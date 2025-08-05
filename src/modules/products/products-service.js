import { toCamelCase } from "../../util.js";
import { Logger } from "../../logger.js";
import productsValidation from "./products-validation.js";
import productsDictionary from "./products-dictionary.js";

export default class ProductsService {
  constructor({ productsRepository, whatsappService, chatService }) {
    this.productsRepository = productsRepository;
    this.whatsappService = whatsappService;
    this.chatService = chatService;
    this.validation = productsValidation;
    this.find = this.#createFind();
    this.draft = this.#createDraft();
  }

  #createFind() {
    return {
      byId: async ({ id }) => {
        const product = await this.productsRepository.findById({ id });
        return product ? toCamelCase(product) : null;
      },
      byName: async ({ name }) => {
        const product = await this.productsRepository.findByName({ name });
        return product ? toCamelCase(product) : null;
      },
    };
  }

  #createDraft() {
    return {
      getActive: async ({ chatId }) => {
        const activeProductsDraft =
          await this.productsRepository.getActiveDraft({ chatId });
        return activeProductsDraft ? toCamelCase(activeProductsDraft) : null;
      },
      create: async ({ productDraft }) => {
        const draft = await this.productsRepository.createDraft({
          productDraft,
        });
        return draft ? toCamelCase(draft) : null;
      },
      update: async ({ productDraft }) => {
        const draft = await this.productsRepository.updateDraft({
          productDraft,
        });
        return draft ? toCamelCase(draft) : null;
      },
    };
  }

  async update({ product }) {
    const updatedProduct = await this.productsRepository.update({ product });
    Logger.info(`Product updated: ${updatedProduct.id}`);
    return toCamelCase(updatedProduct);
  }

  async create({ product }) {
    const createdProduct = await this.productsRepository.create({ product });
    Logger.info(`Product created: ${createdProduct.id}`);
    return toCamelCase(createdProduct);
  }

  async sendInvalidAndRetry(step, senderNumber) {
    await this.whatsappService.sendMessage({
      content: productsDictionary.step[step].invalid_message,
      to: senderNumber,
    });

    await this.whatsappService.sendMessage({
      content: productsDictionary.step[step].default_message,
      to: senderNumber,
      opts: {
        delay_ms: 1500,
      },
    });
  }

  async process({ message, chat }) {
    const senderNumber = message.from;
    const messageContent = message.body.trim();

    let productDraft = await this.draft.getActive({ chatId: chat.id });
    if (!productDraft) {
      productDraft = await this.draft.create({
        productDraft: { chat_id: chat.id,
                        registration_step: "BEGIN",
         },
      });
    }

    try {
      switch (productDraft.registrationStep) {
        case "BEGIN":
          this.whatsappService.sendMessage({
            content: productsDictionary.step.BEGIN.default_message,
            to: senderNumber,
            messageRef: message,
            opts: {
              delay_ms: 3000 ,
            },
          });

          productDraft.registration_step = "AWAITING_NAME";
          productDraft = await this.draft.update({ productDraft });

          this.whatsappService.sendMessage({
            content: productsDictionary.step.AWAITING_NAME.default_message,
            to: senderNumber,
            messageRef: message,
            opts: {
              delay_ms: 5000,
            },
          });
          return;

        case "AWAITING_NAME":
          if (!this.validation.isValidName(messageContent)) {
            await this.sendInvalidAndRetry("AWAITING_NAME", senderNumber);
            return;
          }

          productDraft.name = messageContent;
          productDraft.registration_step = "AWAITING_COST_PRICE";
          await this.draft.update({ productDraft });

          await this.whatsappService.sendMessage({
            content:
              productsDictionary.step.AWAITING_COST_PRICE.default_message,
            to: senderNumber,
            opts: {
              delay_ms: 1500,
            },
          });
          return;

        case "AWAITING_COST_PRICE":
          if (!this.validation.isValidCostPrice(messageContent)) {
            await this.sendInvalidAndRetry("AWAITING_COST_PRICE", senderNumber);
            return;
          }
          productDraft.cost_price = parseFloat(messageContent);
          productDraft.registration_step = "AWAITING_SALE_PRICE";
          productDraft = await this.draft.update({ productDraft });

          await this.whatsappService.sendMessage({
            content:
              productsDictionary.step.AWAITING_SALE_PRICE.default_message,
            to: senderNumber,
            opts: {
              delay_ms: 1500,
            },
          });
          return;
        case "AWAITING_SALE_PRICE":
          if (!this.validation.isValidSalePrice(messageContent)) {
            await this.sendInvalidAndRetry("AWAITING_SALE_PRICE", senderNumber);
            return;
          }
          productDraft.sale_price = parseFloat(messageContent);
          productDraft.registration_step = "AWAITING_INVENTORY";
          productDraft = await this.draft.update({ productDraft });

          await this.whatsappService.sendMessage({
            content: productsDictionary.step.AWAITING_INVENTORY.default_message,
            to: senderNumber,
            opts: {
              delay_ms: 1500,
            },
          });
          return;
        case "AWAITING_INVENTORY":
          if (!this.validation.isValidInventory(messageContent)) {
            await this.sendInvalidAndRetry("AWAITING_INVENTORY", senderNumber);
            return;
          }
          productDraft.inventory = parseInt(messageContent, 10);
          productDraft.registration_step = "COMPLETED";
          productDraft.status = "archived";
          productDraft = await this.draft.update({ productDraft });

          const product = {
            name: productDraft.name,
            cost_price: productDraft.cost_price,
            sale_price: productDraft.sale_price,
            inventory: productDraft.inventory,
            supplier_name: productDraft.supplier_name,
          };
          await this.create({ product });

          await this.chatService.changeState({ id: chat.id, newState: "IDLE" });
          await this.whatsappService.sendMessage({
            content: productsDictionary.step.COMPLETED.default_message,
            to: senderNumber,
            opts: {
              delay_ms: 1500,
            },
          });
          return;
      }
    } catch (error) {
      Logger.error(
        `Error processing supplier registration for supplier: ${productDraft.id}, step: ${productDraft.registrationStep} \n` +
          error.message
      );
      await this.whatsappService.sendMessage({
        content:
          "Ocorreu um erro ao processar o cadastro do fornecedor. Por favor, tente novamente mais tarde.",
        to: senderNumber,
      });
    }
  }
}

import { toCamelCase } from "../../util.js";
import { Logger } from "../../logger.js";
import supplierValidation from "./supplier-validations.js";
import supplierDictionary from "./supplier-dictionary.js";

export default class supplierService {
  constructor({ supplierRepository, whatsappService, chatService }) {
    this.supplierRepository = supplierRepository;
    this.whatsappService = whatsappService;
    this.chatService = chatService;
    this.validation = supplierValidation;
    this.find = this.#createFind();
    this.draft = this.#createDraft();
  }

  #createFind() {
    return {
      byId: async ({ id }) => {
        const supplier = await this.supplierRepository.findById({ id });
        return supplier ? toCamelCase(supplier) : null;
      },
      byName: async ({ name }) => {
        const supplier = await this.supplierRepository.findByName({ name });
        return supplier ? toCamelCase(supplier) : null;
      },
    };
  }

  #createDraft() {
    return {
      getActive: async ({ chatId }) => {
        const activeSupplierDraft = await this.supplierRepository.getActiveDraft({ chatId })
        return activeSupplierDraft ? toCamelCase(activeSupplierDraft) : null;
      },
      create: async ({ supplierDraft }) => {
        const draft = await this.supplierRepository.createDraft({ supplierDraft })
        return draft ? toCamelCase(draft) : null;
      },
      update: async ({ supplierDraft }) => {
        const draft = await this.supplierRepository.updateDraft({ supplierDraft })
        return draft ? toCamelCase(draft) : null;
      }
    }
  }

  async update({ supplier }) {
    const updatedSupplier = await this.supplierRepository.update({ supplier });
    Logger.info(`Supplier updated: ${updatedSupplier.id}`);
    return toCamelCase(updatedSupplier);
  }

  async create({ supplier }) {
    const createdSupplier = await this.supplierRepository.create({ supplier });
    Logger.info(`Supplier created: ${createdSupplier.id}`);
    return toCamelCase(createdSupplier);
  }

  async sendInvalidAndRetry(step, senderNumber) {
    await this.whatsappService.sendMessage({
      content: supplierDictionary.step[step].invalid_message,
      to: senderNumber,
    });

    await this.whatsappService.sendMessage({
      content: supplierDictionary.step[step].default_message,
      to: senderNumber,
      opts: {
        delay_ms: 1500,
      },
    });
  }

  async process({ message, chat}) {
    const senderNumber = message.from;
    const messageContent = message.body.trim();

    let supplierDraft = await this.draft.getActive({ chatId: chat.id })
    if(!supplierDraft)
      supplierDraft = await this.draft.create({ supplierDraft: { chatId: chat.id } })
      
    try {
      switch (supplierDraft.registrationStep) {
        case "BEGIN":
          this.whatsappService.sendMessage({
            content: supplierDictionary.step.BEGIN.default_message,
            to: senderNumber,
            messageRef: message,
            opts: { delay_ms: 3000 }
          });

          supplierDraft.registrationStep = "AWAITING_CPF_OR_CNPJ";
          supplierDraft = await this.draft.update({ supplierDraft })

          this.whatsappService.sendMessage({
            content: supplierDictionary.step.AWAITING_CPF_OR_CNPJ.default_message,
            to: senderNumber,
            messageRef: message,
            opts: { delay_ms: 5000 },
          });
          return;

        case "AWAITING_NAME":
          if (!this.validation.isValidName(messageContent)) {
            await this.sendInvalidAndRetry("AWAITING_NAME", senderNumber);
            return;
          }

          supplierDraft.name = messageContent;
          supplierDraft.registrationStep = "COMPLETED";
          supplierDraft.status = "archived";
          await this.draft.update({ supplierDraft });
          const supplier = {
            name: supplierDraft.name,
            cnpj: supplierDraft.cnpj,
            cpf: supplierDraft.cpf
          }
          await this.create({ supplier })

          await this.chatService.changeState({ id: chat.id, newState: "IDLE" })

          await this.whatsappService.sendMessage({
            content: supplierDictionary.step.COMPLETED.default_message,
            to: senderNumber,
            opts: { delay_ms: 1500 },
          });
          return;

        case "AWAITING_CPF_OR_CNPJ":
          let isValidDocument = false;

          if (
            this.validation.isValidCPF &&
            this.validation.isValidCPF(messageContent)
          ) {
            supplierDraft.cpf = messageContent;
            supplierDraft.cnpj = null;
            isValidDocument = true;
          } else if (
            this.validation.isValidCNPJ &&
            this.validation.isValidCNPJ(messageContent)
          ) {
            supplierDraft.cnpj = messageContent;
            supplierDraft.cpf = null;
            isValidDocument = true;
          }

          if (!isValidDocument) {
            await this.sendInvalidAndRetry("AWAITING_CPF_OR_CNPJ", senderNumber);
            return;
          }

          supplierDraft.registrationStep = "AWAITING_NAME";
          await this.draft.update({ supplierDraft });

          await this.whatsappService.sendMessage({
            content: supplierDictionary.step.AWAITING_NAME.default_message,
            to: senderNumber,
            opts: { delay_ms: 1500 },
          });
          return;

        case "COMPLETED":
          await this.whatsappService.sendMessage({
            content: supplierDictionary.step.COMPLETED.default_message,
            to: senderNumber,
            opts: { delay_ms: 1500 },
          });
          return;

        default:
          return;
      }
    } catch (error) {
      Logger.error(
        `Error processing supplier registration for supplier: ${supplierDraft.id}, step: ${supplierDraft.registrationStep} \n` +
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

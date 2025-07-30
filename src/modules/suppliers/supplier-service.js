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

  async process({ message }) {
    const senderNumber = message.from;
    const messageContent = message.body.trim();

    const chat = await this.chatService.find.byPhoneNumber({ phonenumber: senderNumber });
    await this.chatService.changeState({ id: chat.id, newState: "WANTS TO ADD SUPPLIER" });


    /// Look here
    let supplier = "Find by? How to verify if supplier exists?";
    if (!supplier) {
      /// CHK makes me create a CNPJ
      supplier = await this.create({
          supplier: { name: "Fornecedor", cnpj: Date.now().toString(), cpf: null, registrationStep: "BEGIN" },
        });
    }

    Logger.info(
      `Processing supplier registration for supplier: ${supplier.id}, current step: ${supplier.registrationStep}`
    );

    try {
      switch (supplier.registrationStep) {
        case "BEGIN":
          await this.whatsappService.sendMessage({
            content: supplierDictionary.step.BEGIN.default_message,
            to: senderNumber,
          });

          supplier.registrationStep = "AWAITING_NAME";
          await this.update({ supplier });

          await this.whatsappService.sendMessage({
            content: supplierDictionary.step.AWAITING_NAME.default_message,
            to: senderNumber,
            opts: { delay_ms: 1500 },
          });
          return;

        case "AWAITING_NAME":
          if (!this.validation.isValidName(messageContent)) {
            await this.sendInvalidAndRetry("AWAITING_NAME", senderNumber);
            return;
          }

          supplier.name = messageContent;
          supplier.registrationStep = "AWAITING_CPF_OR_CNPJ";
          await this.update({ supplier });

          await this.whatsappService.sendMessage({
            content: supplierDictionary.step.AWAITING_CPF_OR_CNPJ.default_message,
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
            supplier.cpf = messageContent;
            supplier.cnpj = null;
            isValidDocument = true;
          } else if (
            this.validation.isValidCNPJ &&
            this.validation.isValidCNPJ(messageContent)
          ) {
            supplier.cnpj = messageContent;
            supplier.cpf = null;
            isValidDocument = true;
          }

          if (!isValidDocument) {
            await this.sendInvalidAndRetry("AWAITING_CPF_OR_CNPJ", senderNumber);
            return;
          }

          supplier.registrationStep = "COMPLETED";
          await this.update({ supplier });

          await this.whatsappService.sendMessage({
            content: supplierDictionary.step.COMPLETED.default_message,
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
        `Error processing supplier registration for supplier: ${supplier.id}, step: ${supplier.registrationStep} \n` +
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

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

    const flags = supplierDictionary;

    let chat = await this.chatService.find.byPhoneNumber({
      phonenumber: senderNumber,
    });

    // Se não existe chat, cria um novo com estado BEGIN
    if (!chat) {
      chat = await this.chatService.create({
        phonenumber: senderNumber,
        state: "BEGIN",
      });
    }

    switch (chat.state) {
      case "IDLE":
        console.log("Idle state");
        await this.chatService.changeState({ id: chat.id, newState: "BEGIN" });
        chat = await this.chatService.find.byPhoneNumber({
          phonenumber: senderNumber,
        });
        return
      case "BEGIN":
        this.whatsappService.sendMessage({
          content: flags.step.BEGIN.default_message,
          to: senderNumber,
        });
        await this.chatService.changeState({ id: chat.id, newState: "AWAITING_NAME"});
        chat = await this.chatService.find.byPhoneNumber({
          phonenumber: senderNumber,
        });
        return
      case "AWAITING_NAME":
        console.log("esperando o nome")
        await this.chatService.changeState({ id: chat.id, newState: "AWAITING_CPF_OR_CNPJ"});
        chat = await this.chatService.find.byPhoneNumber({
          phonenumber: senderNumber,
        });
        return
      case "AWAITING_CPF_OR_CNPJ":
        console.log("Esperando cpf")
         await this.chatService.changeState({ id: chat.id, newState: "COMPLETED"});
        chat = await this.chatService.find.byPhoneNumber({
          phonenumber: senderNumber,
        });
        return
        
      default:
        console.log("Estado desconhecido:", chat.state);
        break;
    }
  }
}

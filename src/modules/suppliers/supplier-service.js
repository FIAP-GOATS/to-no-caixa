import { toCamelCase } from "../../util.js";
import { Logger } from "../../logger.js";
import supplierValidation from "./supplier-validations.js"
import supplierDictionary from "./supplier-dictionary.js";

export default class supplierService{
    constructor({
      supplierRepository
    }){
        this.supplierRepository = supplierRepository;
        this.find = this.#createFind();
    }

    #createFind(){
        return {
            byId: async ({id}) => {
                const supplier = await this.supplierRepository.findById({id});
                return supplier ? toCamelCase(supplier) : null;
            },
            byName: async ({name}) => {
                const supplier = await this.supplierRepository.findByName({name});
                return supplier ? toCamelCase(supplier) : null;
            }
        }

    }

    async update({supplier}){
        const updatedSupplier = await this.supplierRepository.update({supplier});
        Logger.info(`Supplier updated: ${updatedSupplier.id}`);
        return toCamelCase(updatedSupplier);
    }

    async create({supplier}){
        const createdSupplier = await this.supplierRepository.create({supplier});
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
    
        let currentStep = "BEGIN";
    
        switch (currentStep) {
          case "BEGIN":
            this.whatsappService.sendMessage({
              content: flags.step.BEGIN.default_message,
              to: senderNumber,
            });
    
            currentStep = "AWAITING_NAME";
    
            await this.whatsappService.sendMessage({
              content: flags.step.AWAITING_NAME.default_message,
              to: senderNumber,
              opts: {
                delay_ms: 1500,
              },
            });
            return;
    
          case "AWAITING_NAME":
            if (!this.validation.isValidName(messageContent)) {
              await this.sendInvalidAndRetry("AWAITING_NAME", senderNumber);
              return;
            }
            const supplier_name = messageContent;
            return;
       }
    }

}

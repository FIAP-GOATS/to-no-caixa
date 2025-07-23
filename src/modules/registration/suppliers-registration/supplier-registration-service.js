import supplierRegistrationDictionary from "./supplier-registration-dictionary.js"
import supplierRegistrationValidation from "./supplier-registration-validation.js";
import { Logger } from "../../../logger.js";

export default class SupplierRegistrationService {
  constructor({ whatsappService, supplierService }) {
    this.whatsappService = whatsappService;
    this.supplierService = supplierService;
    this.validation = supplierRegistrationValidation
  }

  async sendInvalidAndRetry(step, senderNumber) {
    await this.whatsappService.sendMessage({
      content: supplierRegistrationDictionary.step[step].invalid_message,
      to: senderNumber,
    });

    await this.whatsappService.sendMessage({
      content: supplierRegistrationDictionary.step[step].default_message,
      to: senderNumber,
      opts: {
        delay_ms: 1500,
      },
    });
  }

  async process({ message }) {
    const senderNumber = message.from;
    const messageContent = message.body.trim();

    const flags = supplierRegistrationDictionary;

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
}}

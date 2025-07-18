import signupDictionary from "./signup-dictionary.js";
import signupValidations from "./signup-validations.js";
import { Logger } from "../../logger.js";

export default class SignupService {
  constructor({ whatsappService, companyService }) {
    this.whatsappService = whatsappService;
    this.companyService = companyService;
    this.validations = signupValidations;
  }

  async sendInvalidAndRetry(step, senderNumber) {
    await this.whatsappService.sendMessage({
      content: signupDictionary.step[step].invalid_message,
      to: senderNumber,
    });

    await this.whatsappService.sendMessage({
      content: signupDictionary.step[step].default_message,
      to: senderNumber,
      opts: {
        delay_ms: 1500,
      },
    });
  }

  async process({ message }) {

    //>> This validation handle the situation when the client(a number) made the first interaction with the bot. 
    //>  For some reason, the whatsapp lib returns a message.body like " ", yes a string with a space or some unknown char.
    //>  The current code solve it but needs to be replaced in the future for something more robust.
    //>  Theres a lot of talk about it in github and reddit. Maybe it occurs because the "waiting for this message, please wait" type of message. Its like if whatsapp deal with the two numbers before make the message available.
    //>> For better analysis, debug the app and simulate the situation to get the entire Message obj and see if there is some info. 
    if (!message || !message.body || message.body.trim() === ""){
      Logger.info('Empty message received, aborting process...')
      return
    }

    const senderNumber = message.from;
    const messageContent = message.body.trim();

    let company = await this.companyService.find.byNumber({
      number: senderNumber,
    });
    if (!company) {
      company = await this.companyService.create({
        company: { registrationNumber: senderNumber },
      });
    }

    Logger.info(
      `Processing signup for company: ${company.registrationNumber}, current step: ${company.registrationStep}`
    );

    try {
      switch (company.registrationStep) {
        case "BEGIN":
          this.whatsappService.sendMessage({
            content: signupDictionary.step.BEGIN.default_message,
            to: senderNumber,
          });

          company.registrationStep = "AWAITING_NAME";
          await this.companyService.update({ company });

          this.whatsappService.sendMessage({
            content: signupDictionary.step.AWAITING_NAME.default_message,
            to: senderNumber,
            opts: {
              delay_ms: 1500,
            },
          });
          return;

        case "AWAITING_NAME":
          if (!this.validations.isValidName(messageContent)) {
            await this.sendInvalidAndRetry("AWAITING_NAME", senderNumber);
            return;
          }

          company.name = messageContent;
          company.registrationStep = "AWAITING_EMAIL";
          await this.companyService.update({ company });

          this.whatsappService.sendMessage({
            content: signupDictionary.step.AWAITING_EMAIL.default_message,
            to: senderNumber,
            opts: {
              delay_ms: 1500,
            },
          });
          return;

        case "AWAITING_EMAIL":
          if (!this.validations.isValidEmail(messageContent)) {
            await this.sendInvalidAndRetry("AWAITING_EMAIL", senderNumber);
            return;
          }

          company.email = messageContent;
          company.registrationStep = "AWAITING_CNPJ";
          await this.companyService.update({ company });

          this.whatsappService.sendMessage({
            content: signupDictionary.step.AWAITING_CNPJ.default_message,
            to: senderNumber,
            opts: {
              delay_ms: 1500,
            },
          });
          return;

        case "AWAITING_CNPJ":
          if (!this.validations.isValidCNPJ(messageContent)) {
            await this.sendInvalidAndRetry("AWAITING_CNPJ", senderNumber);
            return;
          }

          company.cnpj = messageContent;
          company.registrationStep = "AWAITING_TYPE";
          await this.companyService.update({ company });

          this.whatsappService.sendMessage({
            content: signupDictionary.step.AWAITING_TYPE.default_message,
            to: senderNumber,
            opts: {
              delay_ms: 1500,
            },
          });
          return;

        case "AWAITING_TYPE":
          if (!this.validations.isValidText(messageContent)) {
            await this.sendInvalidAndRetry("AWAITING_TYPE", senderNumber);
            return;
          }

          company.type = messageContent;
          company.registrationStep = "AWAITING_ADRESS";
          await this.companyService.update({ company });

          this.whatsappService.sendMessage({
            content: signupDictionary.step.AWAITING_ADRESS.default_message,
            to: senderNumber,
            opts: {
              delay_ms: 1500,
            },
          });
          return;

        case "AWAITING_ADRESS":
          if (!this.validations.isValidText(messageContent)) {
            await this.sendInvalidAndRetry("AWAITING_ADRESS", senderNumber);
            return;
          }

          company.address = messageContent;
          company.registrationStep = "AWAITING_CITY";
          await this.companyService.update({ company });

          this.whatsappService.sendMessage({
            content: signupDictionary.step.AWAITING_CITY.default_message,
            to: senderNumber,
            opts: {
              delay_ms: 1500,
            },
          });
          return;

        case "AWAITING_CITY":
          if (!this.validations.isValidText(messageContent)) {
            await this.sendInvalidAndRetry("AWAITING_CITY", senderNumber);
            return;
          }
          company.city = messageContent;
          company.registrationStep = "AWAITING_STATE";
          await this.companyService.update({ company });

          this.whatsappService.sendMessage({
            content: signupDictionary.step.AWAITING_STATE.default_message,
            to: senderNumber,
            opts: {
              delay_ms: 1500,
            },
          });
          return;

        case "AWAITING_STATE":
          if(!this.validations.isValidState(messageContent)) {
            await this.sendInvalidAndRetry("AWAITING_STATE", senderNumber);
            return;
          }

          company.state = messageContent;
          company.registrationStep = "AWAITING_POSTAL_CODE";
          await this.companyService.update({ company });

          this.whatsappService.sendMessage({
            content: signupDictionary.step.AWAITING_POSTAL_CODE.default_message,
            to: senderNumber,
            opts: {
              delay_ms: 1500,
            },
          });
          return;

        case "AWAITING_POSTAL_CODE":
          if(!this.validations.isValidCep(messageContent)) {
            await this.sendInvalidAndRetry("AWAITING_POSTAL_CODE", senderNumber);
            return;
          }

          company.postalCode = messageContent;
          company.registrationStep = "COMPLETED";
          await this.companyService.update({ company });

          this.whatsappService.sendMessage({
            content: signupDictionary.step.COMPLETED.default_message,
            to: senderNumber,
            opts: {
              delay_ms: 1500,
            },
          });
          return;

        // case 'AWAITING_PRODUCTS':
        //     return { message: this.dictionary.AWAITING_PROUCTS.default_message, completed: true }

        case "COMPLETED":
          this.whatsappService.sendMessage({
            content: signupDictionary.step.COMPLETED.default_message,
            to: senderNumber,
            opts: {
              delay_ms: 1500,
            },
          });
          return;
        default:
          return;
      }
    } catch (error) {
      Logger.error(
        `Error processing signup for company: ${company.registrationNumber}, step: ${company.registrationStep}`,
        error
      );
      this.whatsappService.sendMessage({
        content:
          "Ocorreu um erro ao processar seu cadastro. Por favor, tente novamente mais tarde.",
        to: senderNumber,
      });
    }
  }
}

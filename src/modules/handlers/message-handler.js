import { Logger } from "../../logger.js";
import { prompts } from "../AI/prompts.js";

export default class MessageHandler {
  constructor({ companyService, signupService, whatsappService, aiService }) {
    this.companyService = companyService;
    this.signupService = signupService;
    this.whatsappService = whatsappService;
    this.aiService = aiService;
  }

  init() {
    this.listenWhatsapp()
    Logger.info("Message Handler initialized successfully")
  }

  listenWhatsapp() {
    this.whatsappService.client.on("message", async (message) => {
      Logger.info(`Received message from ${message.from}: ${message.body}`);

      this.handle({ message });
    });
    Logger.info("Listening for WhatsApp messages...");
  }

  async handle({ message }) {
    const company = await this.companyService.find.byNumber({
      number: message.from,
    });
    if (!company || company.registrationStep != "COMPLETED") {
      this.signupService.process({ message });
      return
    }

    let customerServiceAssistantResponse =
      await this.aiService.getAssistantResponse({
        systemPrompt: prompts.customer_service_prompt,
        userPrompt: message.body
    });

    this.whatsappService.sendMessage({
      to: message.from,
      content: customerServiceAssistantResponse,
    });
  }
}

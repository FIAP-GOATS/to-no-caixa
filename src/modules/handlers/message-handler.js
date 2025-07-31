import { Logger } from "../../logger.js";
import { createFlowHandlers } from "./flow-handlers.js";
import { createStateHandlers } from "./state-handlers.js";

export default class MessageHandler {
  constructor({ services }) {
    this.companyService = services.companyService;
    this.signupService = services.signupService;
    this.whatsappService = services.whatsappService;
    this.aiService = services.aiService;
    this.customerService = services.customerService;
    this.supplierService = services.supplierService;
    this.chatService = services.chatService;
    this.productService = services.productService;
    this.salleService = services.salleService;

    this.flowHandlers = createFlowHandlers({
      productService: this.productService,
      supplierService: this.supplierService,
      salleService: this.salleService,
      chatService: this.chatService
    });

    this.stateHandlers = createStateHandlers({
      productService: this.productService,
      supplierService: this.supplierService,
      signupService: this.signupService
    });
  }

  init() {
    this.listenWhatsapp();
    Logger.info("Message Handler initialized successfully");
  }

  listenWhatsapp() {
    this.whatsappService.client.on("message", async (message) => {
      Logger.info(`Received message from ${message.from}: ${message.body}`);
      this.handle({ message });
    });
    Logger.info("Listening for WhatsApp messages...");
  }

  async handle({ message }) {
    if (!message || !message.body || message.body.trim() === "") {
      Logger.info('Empty message received, aborting process...');
      return;
    }

    //> Check if the message is from a registered phone number, if not, register it creating a new chat with the state 'WANTS TO SIGNUP'
    let chat = await this.chatService.find.byPhoneNumber({ phonenumber: message.from }) 
            ?? await this.chatService.create({ phonenumber: message.from, state: 'WANTS TO SIGNUP' });

    //>> If chat is in IDLE state, redirect customer to the appropriate flow handler, else handle based on the current state
    //> IMPROVE: In the future, replace it for a fully context aware AI service to decide the flow
    if (chat.state === 'IDLE') {
      const response = await this.customerService.redirectCustomer({ message });
      Logger.info(`Redirecting user: ${response.interactionAnalysys}`);

      const handler = this.flowHandlers[response.interactionAnalysys];
      if (handler) 
        handler(message, chat);
      else 
        Logger.info("No matching flow handler found.");
    } else {
      const handler = this.stateHandlers[chat.state];
      if (handler) 
        handler(message, chat);
      else 
        Logger.info(`No state handler for chat state: ${chat.state}`);
    }
  }
}

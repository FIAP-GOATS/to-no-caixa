import { gWhatsappInstance } from "../whatsapp/whatsapp-factory.js"
import Database from "../database/database.js";
import MessageHandler from "../handlers/message-handler.js";
import { gCompanyInstance } from "../companies/company-factory.js";
import { gSignupInstance } from "../sign-up/signup-factory.js";
import { gAiInstance } from "../AI/ai-factory.js";
import { gCustomerInstance } from "../customer/customer-factory.js";
import { gSupplierInstance } from "../suppliers/supplier-factory.js";
import { gChatInstance } from "../chats/chat-factory.js";
import { Logger } from '../../logger.js';

export default class App {
  constructor() {
    this.name = 'app';
    this.version = '1.0.0';
    this.description = 'Application module for managing app state and configuration';
  }

  async init() {
    Logger.info('Initializing application...');

    const db = new Database({
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DATABASE,
      password: process.env.POSTGRES_PASSWORD,
      port: process.env.POSTGRES_PORT,
    })
    await db.init();

    this.startup({ db });
  }

  async startup({ db }) {    
    const { companyService } = gCompanyInstance({ db })
    const { chatService } = gChatInstance({ db })
    const { whatsappService } = await gWhatsappInstance({  });
    const { supplierService } = gSupplierInstance({ db, whatsappService, chatService })
    const { signupService } = gSignupInstance({ whatsappService, companyService, chatService })
    const { aiService } = gAiInstance({ 
      apiKey: process.env.GPT_API_KEY, 
      apiUrl: 'https://api.openai.com/v1/chat/completions'
    }) 
    const { customerService } = gCustomerInstance({ aiService, whatsappService })

    const services = {
      companyService,
      signupService,
      whatsappService,
      aiService,
      customerService,
      supplierService,
      chatService
    }

    const messageHandler = new MessageHandler({ services })
    messageHandler.init()

    Logger.info('Application started successfully');
  }
}
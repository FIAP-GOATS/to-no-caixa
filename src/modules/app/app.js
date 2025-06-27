import { gWhatsappInstance } from "../whatsapp/whatsapp-factory.js"
import Database from "../database/database.js";
import MessageHandler from "../messages/message-handler.js";
import { gCompanyInstance } from "../companies/company-factory.js";
import { gSignupInstance } from "../sign-up/signup-factory.js";


export default class App {
  constructor() {
    this.name = 'app';
    this.version = '1.0.0';
    this.description = 'Application module for managing app state and configuration';
  }

  async init() {
    console.log(`${this.name} initialized with version ${this.version}`);

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
    const { whatsappService } = await gWhatsappInstance({  });
    const { signupService } = gSignupInstance({ whatsappService, companyService }) 

    const messageHandler = new MessageHandler({ signupService, companyService })
    messageHandler.listenWhatsapp({ whatsappService })
  }


}
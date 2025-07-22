import { response } from "express";
import { Logger } from "../../logger.js";

export default class MessageHandler {
  constructor({ services }) {
    this.companyService = services.companyService;
    this.signupService = services.signupService;
    this.whatsappService = services.whatsappService;
    this.aiService = services.aiService;
    this.customerService = services.customerService;
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

    let response = await this.customerService.redirectCustomer({message})
    Logger.info(`Redirecting user: ${response.interactionAnalysys}`);

    switch(response.interactionAnalysys){
      case "CADASTRAR PRODUTO":
        // Lógica de cadastrar produto
        break
      case "CADASTRAR FORNECEDOR":
        // Lógica de cadastrar fornecedor
        break
      case "ABRIR CAIXA":
        // Lógica de abrir caixa
        break 
      case "VENDER":
        // Lógica de venda
        // Deve haver injeção de contexto, caso o assistente anterior possui dados sobre a venda.
        break
      case "CANCELAR VENDA":
        // Lógica de cancelar venda
        break
      case "FECHAR CAIXA":
        // Lógica de fechar caixa
        break
      default:
        // Lógica de quando o agente não escolher nenhum fluxo
    }
  }
}

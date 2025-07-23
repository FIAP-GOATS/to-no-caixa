import { response } from "express";
import { Logger } from "../../logger.js";

export default class MessageHandler {
  constructor({ services }) {
    this.companyService = services.companyService;
    this.signupService = services.signupService;
    this.whatsappService = services.whatsappService;
    this.aiService = services.aiService;
    this.customerService = services.customerService;
    this.supplierRegistrationService = services.supplierRegistrationService
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
        // this.productService.process({ message })
        break
      case "CADASTRAR FORNECEDOR":
        this.supplierRegistrationService.process({message})
        break
      case "ABRIR CAIXA":
        // this.salleService.open({ timestamp })
        break 
      case "ATUALIZAR ESTOQUE":
        break
      case "VENDER":
        // this.salleService.process({ message })
        // Deve haver injeção de contexto, caso o assistente anterior possuia dados sobre a venda.
        break
      case "CANCELAR VENDA":
        // this.salleService.cancel()
        break
      case "FECHAR CAIXA":
        // this.salleService.close({ timestamp })
        break
      default:
        // Lógica de quando o agente não escolher nenhum fluxo
    }
  }
}

import { prompts } from "../AI/prompts.js";

export default class CustomerService {
  constructor({ aiService, whatsappService }) {
    this.aiService = aiService;
    this.whatsappService = whatsappService;
  }

  async redirectCustomer({ message }) {

    let customerServiceAssistantResponse =
      await this.aiService.getAssistantResponse({
        systemPrompt: prompts.customer_service_prompt,
        userPrompt: message.body,
      });

    // Divide a resposta em frases separadas por ponto final ou exclamação
    const responseChunks = customerServiceAssistantResponse
      .split(/[.!]/)
      .map((sentence) => sentence.trim())
      .filter(Boolean); // remove strings vazias

    // Envia duas mensagens ao usuário, visando melhor visualização no whatsapp
    const limitedChunks = responseChunks.slice(0, 2);
    for (let i = 0; i < limitedChunks.length; i++) {
      await this.whatsappService.sendMessage({
        to: message.from,
        content: limitedChunks[i] + (i < limitedChunks.length - 1 ? "!" : ""), // Adiciona ponto de exclamação se não for a última frase
      });
      // Intervalo entre as mensagens para não parecer spam
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    // Agente que analisa a resposta completa do assistente e decide o fluxo.
    let interactionAnalysys = await this.aiService.getAssistantResponse({
      systemPrompt: prompts.monitoring_agent_prompt,
      userPrompt: customerServiceAssistantResponse,
    });

    return { customerServiceAssistantResponse, interactionAnalysys };
  }
}
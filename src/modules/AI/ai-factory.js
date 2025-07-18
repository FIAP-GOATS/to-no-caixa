import AIService from "./ai-service.js";

const gAiInstance = ({ apiKey, apiUrl }) => {
    const aiService = new AIService({ apiKey, apiUrl })

    return {aiService}
}

export {
    gAiInstance
}
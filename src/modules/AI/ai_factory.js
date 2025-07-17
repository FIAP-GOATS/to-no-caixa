import AIService from "./ai-service.js";

const gAiInstance = () => {
    const aiService = new AIService()

    return {aiService}
}

export {
    gAiInstance
}
export default class MessageHandler {
    constructor ({
        companyService,
        signupService
    }) {
        this.companyService = companyService
        this.signupService = signupService
    }

    listenWhatsapp({ whatsappService }) {
        whatsappService.client.on('message', async (message) => {
            console.log(`📩 Message received from ${message.from}: ${message.body}`)
            
            this.handle({ message })
        });
    }

    async handle({ message }) {
        const company = await this.companyService.find.byNumber({ number: message.from })
        if(!company || company.registerStatus != 'COMPLETED') {
            this.signupService.process({ message })
        }
    }
}
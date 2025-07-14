import { Logger } from '../../logger.js';

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
            Logger.info(`Received message from ${message.from}: ${message.body}`);
            
            this.handle({ message })
        });
        Logger.info('Listening for WhatsApp messages...');
    }

    async handle({ message }) {
        const company = await this.companyService.find.byNumber({ number: message.from })
        if(!company || company.registrationStep != 'COMPLETED') {
            this.signupService.process({ message })
        }
    }
}
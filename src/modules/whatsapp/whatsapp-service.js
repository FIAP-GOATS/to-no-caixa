import { Logger } from '../../logger.js';

export default class WhatsappService {
    constructor({
        messageRepository,
        client
    }) {
        this.messageRepository = messageRepository;
        this.client = client
        
        this.name = 'whatsapp-service';
        this.version = '1.0.0';
        this.description = 'WhatsApp service for managing WhatsApp interactions and configurations';
    }

    init() {
        this.client.initialize()
        Logger.info('WhatsApp service initialized');
    }

    async sendMessage({
        content,
        to,
        messageRef,
        opts = { }
    }) {
        const {
            delay_ms=0,
        } = opts

        if (delay_ms > 0) {
            let chat = null
            if(messageRef) {
                chat = await messageRef.getChat();
                chat.sendStateTyping();
            }
            await this.helpers.sleep(delay_ms);
            if(chat)
                chat.clearState()
        }
        //if(to === '553592172728@c.us') {
        this.client.sendMessage(to, content.toString())
        Logger.info(`Message sent to ${to}: ${content}`);
        //}
    }

    helpers = {
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }
    


}
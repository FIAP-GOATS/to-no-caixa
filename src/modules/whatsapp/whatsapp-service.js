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
        console.log(`${this.name} initialized with version ${this.version}`);
        this.client.initialize()
    }

    async sendMessage({
        content,
        to,
        opts = { }
    }) {
        const {
            delay_ms=0
        } = opts

        if (delay_ms > 0) 
            await this.sleep(delay_ms);
        this.client.sendMessage(to, content.toString())
    }

    sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


}
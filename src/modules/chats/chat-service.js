import { toCamelCase } from '../../util.js';
import { Logger } from '../../logger.js';

export default class ChatService {
    constructor({
        chatRepository
    }) {
        this.chatRepository = chatRepository;
        this.find = this.#createFind();
    }

    #createFind() {
        return {
            byId: async (id) => {
                const chat = await this.chatRepository.findById({ id });
                return toCamelCase(chat);
            },
            byPhoneNumber: async ({ phonenumber }) => {
                const chats = await this.chatRepository.findByPhoneNumber({ phonenumber });
                return toCamelCase(chats)
            }
        }
    }

    async create({ phonenumber, state }) {
        const createdChat = await this.chatRepository.create({ phonenumber, state });
        Logger.info(`Chat created: ${createdChat.id}`);
        return toCamelCase(createdChat);
    }

    async changeState({ id, newState }) {
        const updatedChat = await this.chatRepository.update({ id, state: newState });
        Logger.info(`Chat state changed: ${updatedChat.id} -> ${updatedChat.state}`);
        return toCamelCase(updatedChat);
    }
}

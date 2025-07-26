import ChatRepository from './chat-repository.js';
import ChatService from './chat-service.js';

const gChatInstance = ({ db }) => {
    const chatRepository = new ChatRepository({ db });
    const chatService = new ChatService({ chatRepository });

    return { chatService };
};

export {
    gChatInstance
};

import SignupService from "./signup-service.js"
import { Logger } from '../../logger.js';

const gSignupInstance = ({
    whatsappService,
    companyService, 
    chatService,
    userService
}) => {
    const signupService = new SignupService({ whatsappService, companyService, chatService, userService })
    return { signupService }
}

export {
    gSignupInstance
}
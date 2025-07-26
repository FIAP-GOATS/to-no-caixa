import SignupService from "./signupService.js"
import { Logger } from '../../logger.js';

const gSignupInstance = ({
    whatsappService,
    companyService, 
    chatService
}) => {
    const signupService = new SignupService({ whatsappService, companyService, chatService })
    return { signupService }
}

export {
    gSignupInstance
}
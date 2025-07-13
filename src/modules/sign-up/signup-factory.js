import SignupService from "./signupService.js"
import { Logger } from '../../logger.js';

const gSignupInstance = ({
    whatsappService,
    companyService
}) => {
    const signupService = new SignupService({ whatsappService, companyService })
    return { signupService }
}

export {
    gSignupInstance
}
import SignupService from "./signupService.js"

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
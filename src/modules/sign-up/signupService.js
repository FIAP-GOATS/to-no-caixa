import signupDictionary from "./signup-dictionary.js"

export default class SignupService {
    constructor ({
        whatsappService,
        companyService
    }) {
        this.whatsappService = whatsappService
        this.companyService = companyService
    }

    async process({ message }) {
        const senderNumber = message.from
        const messageContent = message.body

        let company = await this.companyService.find.byNumber({ number: senderNumber })
        if(!company) {
            company = await this.companyService.create({ company: { registrationNumber: senderNumber } })
        }

        switch (company.registrationStep) {
            case 'BEGIN':
                this.whatsappService.sendMessage({
                    content: signupDictionary.logo.default_message,
                    to: senderNumber
                })

                this.whatsappService.sendMessage({
                    content: signupDictionary.step.BEGIN.default_message,
                    to: senderNumber
                })

                company.registrationStep = 'AWAITING_NAME'
                await this.companyService.update({ company })

                this.whatsappService.sendMessage({
                    content: signupDictionary.step.AWAITING_NAME.default_message,
                    to: senderNumber,
                    opts: {
                        delay_ms: 1500
                    }
                })
                return
            case 'AWAITING_NAME':
                company.name = messageContent
                company.registrationStep = 'AWAITING_EMAIL'
                await this.companyService.update({ company })
                
                this.whatsappService.sendMessage({
                    content: signupDictionary.step.AWAITING_EMAIL.default_message,
                    to: senderNumber,
                    opts: {
                        delay_ms: 1500
                    }
                })
                return
            case 'AWAITING_EMAIL':
                company.email = messageContent
                company.registrationStep = 'AWAITING_CNPJ'
                await this.companyService.update({ company })

                this.whatsappService.sendMessage({
                    content: signupDictionary.step.AWAITING_CNPJ.default_message,
                    to: senderNumber,
                    opts: {
                        delay_ms: 1500
                    }
                })
                return
            case 'AWAITING_CNPJ':
                company.cnpj = messageContent
                company.registrationStep = 'AWAITING_TYPE'
                await this.companyService.update({ company })

                this.whatsappService.sendMessage({
                    content: signupDictionary.step.AWAITING_TYPE.default_message,
                    to: senderNumber,
                    opts: {
                        delay_ms: 1500
                    }
                })
                return
            case 'AWAITING_TYPE':
                company.type = messageContent
                company.registrationStep = 'AWAITING_ADRESS'
                await this.companyService.update({ company })
                
                this.whatsappService.sendMessage({
                    content: signupDictionary.step.AWAITING_ADRESS.default_message,
                    to: senderNumber,
                    opts: {
                        delay_ms: 1500
                    }
                })
                return
            case 'AWAITING_ADRESS': 
                company.adress = messageContent
                company.registrationStep = 'COMPLETED'
                await this.companyService.update({ company })

                this.whatsappService.sendMessage({
                    content: signupDictionary.step.COMPLETED.default_message,
                    to: senderNumber,
                    opts: {
                        delay_ms: 1500
                    }
                })

                return
            // case 'AWAITING_PRODUCTS':
            //     return { message: this.dictionary.AWAITING_PROUCTS.default_message, completed: true }

            case 'COMPLETED':
                this.whatsappService.sendMessage({
                    content: signupDictionary.step.COMPLETED.default_message,
                    to: senderNumber,
                    opts: {
                        delay_ms: 1500
                    }
                })
                return
            default:
                return 
        }
    }
}
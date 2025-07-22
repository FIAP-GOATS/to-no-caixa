import CustomerService from './customer-service.js';

const gCustomerInstance = ({aiService, whatsappService}) => {
    const customerService = new CustomerService({aiService, whatsappService})

    return {customerService}
}

export {gCustomerInstance}
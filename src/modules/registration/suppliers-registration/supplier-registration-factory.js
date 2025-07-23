import SupplierRegistrationService from "./supplier-registration-service.js"

const gSupplierRegistrationInstance = ({
    whatsappService, supplierService
}) => {
    const supplierRegistrationService = new SupplierRegistrationService({whatsappService, supplierService})
    return {supplierRegistrationService}
}

export {gSupplierRegistrationInstance}


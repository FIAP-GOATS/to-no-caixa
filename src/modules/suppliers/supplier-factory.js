import SupplierRepository from "./supplier-repository.js";
import SupplierService from "./supplier-service.js";
import { Logger } from "../../logger.js";

const gSupplierInstance = ({ db, whatsappService, chatService }) => {
    const supplierRepository = new SupplierRepository({db})
    const supplierService = new SupplierService({supplierRepository, whatsappService, chatService})

    return {supplierService}
}

export {gSupplierInstance}
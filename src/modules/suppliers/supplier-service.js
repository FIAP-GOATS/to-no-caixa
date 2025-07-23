import { toCamelCase } from "../../util.js";
import { Logger } from "../../logger.js";

export default class supplierService{
    constructor({supplierRepository}){
        this.supplierRepository = supplierRepository;
        this.find = this.#createFind();
    }

    #createFind(){
        return {
            byId: async ({id}) => {
                const supplier = await this.supplierRepository.findById({id});
                return supplier ? toCamelCase(supplier) : null;
            },
            byName: async ({name}) => {
                const supplier = await this.supplierRepository.findByName({name});
                return supplier ? toCamelCase(supplier) : null;
            }
        }

    }

    async update({supplier}){
        const updatedSupplier = await this.supplierRepository.update({supplier});
        Logger.info(`Supplier updated: ${updatedSupplier.id}`);
        return toCamelCase(updatedSupplier);
    }

    async create({supplier}){
        const createdSupplier = await this.supplierRepository.create({supplier});
        Logger.info(`Supplier created: ${createdSupplier.id}`);
        return toCamelCase(createdSupplier);
    }

    }

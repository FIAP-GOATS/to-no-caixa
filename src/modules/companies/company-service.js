import { toCamelCase } from "../../util.js";

import { Logger } from '../../logger.js';

export default class CommpanyService {
    constructor({
        companyRepository
    }) {
        this.companyRepository = companyRepository
        this.find = this.#createFind();
    }

    #createFind() {
        return {
            byId: async (id) => {
                const company = await this.companyRepository.findById(id);
                return toCamelCase(company)
            },
            byPhoneNumber: async ({ phonenumber }) => {
                const company = await this.companyRepository.findByPhoneNumber({ phonenumber });
                return toCamelCase(company)
            },
        }
    }

    async update({ company }) {
        const updatedCompany = await this.companyRepository.update({company}) 
        Logger.info(`Company updated: ${updatedCompany.id}`);
        return toCamelCase(updatedCompany)
    }

    async create({ company }) {
        const createdCompany = await this.companyRepository.create({ company });
        Logger.info(`Company created: ${createdCompany.id}`);
        return toCamelCase(createdCompany)
    }

    async linkPhoneNumber({ phonenumber, companyId }) {
        const linkedPhoneNumber = await this.companyRepository.createPhoneNumberRelation({ phonenumber, companyId })
        return toCamelCase(linkedPhoneNumber)
    }

    
}
import { toCamelCase } from "../../util.js";

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
            byNumber: async ({ number }) => {
                const company = await this.companyRepository.findByNumber({ number });
                return toCamelCase(company)
            },
        }
    }

    async update({ company }) {
        const updatedCompany = this.companyRepository.update({company}) 

        return toCamelCase(updatedCompany)
    }

    async create({ company }) {
        const createdCompany = await this.companyRepository.create({ company });

        return toCamelCase(createdCompany)
    }

    
}
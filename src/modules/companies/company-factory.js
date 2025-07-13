import CompanyRepository from "./company-repository.js"
import CommpanyService from "./company-service.js"

import { Logger } from '../../logger.js';

const gCompanyInstance = ({
db
}) => {
    const companyRepository = new CompanyRepository({ db })
    const companyService = new CommpanyService({ companyRepository })

    return { companyService }
}

export {
    gCompanyInstance
}
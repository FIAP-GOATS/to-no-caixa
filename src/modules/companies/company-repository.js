export default class CompanyRepository {
    constructor ({
        db
    }) {
        this.db = db
    }

    async findByPhoneNumber({ phonenumber }) {
        const result = await this.db.query({
            text: `
            SELECT c.*
            FROM company_numbers cn
            JOIN companies c ON cn.company_id = c.id
            WHERE cn.phonenumber = $1
            LIMIT 1
            `,
            params: [phonenumber],
        });

        return result.rows[0];
    }


    async update({ company }) {
        const result = await this.db.query({
            text: `
                UPDATE companies
                SET
                    name = COALESCE($1, name),
                    email = COALESCE($2, email),
                    cnpj = COALESCE($3, cnpj),
                    type = COALESCE($4, type),
                    street_address = COALESCE($5, street_address),
                    city = COALESCE($6, city),
                    state = COALESCE($7, state),
                    postal_code = COALESCE($8, postal_code),
                    registration_step = COALESCE($9, registration_step)
                WHERE id = $10
                RETURNING *;
            `,
            params: [
                (company?.name) ?? null,
                (company?.email) ?? null,
                (company?.cnpj) ?? null,
                (company?.type) ?? null,
                (company?.address) ?? null,
                (company?.city) ?? null,
                (company?.state) ?? null,
                (company?.postalCode) ?? null,
                (company?.registrationStep) ?? null,
                company.id
            ],
        });

        return result.rows[0];
    }


    async create({ company }) {
        const result = await this.db.query({
            text: `
                INSERT INTO companies (
                    name,
                    email,
                    cnpj,
                    type,
                    street_address,
                    city,
                    state,
                    postal_code,
                    registration_step
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9
                )
                RETURNING *;
            `,
            params: [
                (company?.name) ?? null,
                (company?.email) ?? null,
                (company?.cnpj) ?? null,
                (company?.type) ?? null,
                (company?.address) ?? null,
                (company?.city) ?? null,
                (company?.state) ?? null,
                (company?.postalCode) ?? null,
                (company?.registrationStep) ?? 'BEGIN'
            ]
        });

        return result.rows[0];
    }

    async createPhoneNumberRelation({ phonenumber, companyId }) {
        const result = await this.db.query({
            text: `
            INSERT INTO company_numbers (phonenumber, company_id)
            VALUES ($1, $2)
            RETURNING *;
            `,
            params: [phonenumber, companyId],
        });

    return result.rows[0];
}


}
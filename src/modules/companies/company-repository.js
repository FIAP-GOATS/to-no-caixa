export default class CompanyRepository {
    constructor ({
        db
    }) {
        this.db = db
    }

    async findByNumber({ number }) {
        const result = await this.db.query({
            text: 'SELECT * FROM companies WHERE registration_number = $1',
            params: [number]
        })

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
                WHERE registration_number = $10
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
                (company?.registrationNumber)
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
                    registration_number,
                    registration_step
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
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
                (company?.registrationNumber) ?? null,
                (company?.registrationStep) ?? 'BEGIN'
            ]
        });

        return result.rows[0];
    }

}
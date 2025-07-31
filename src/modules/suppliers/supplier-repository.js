export default class SupplierRepository{
    constructor({db}){
        this.db = db
    }


    async findById({id}){
        const result =  this.db.query({
            text: 'SELECT * FROM suppliers WHERE id = $1',
            params: [id]
        })

        return result.rows[0]
    }

    async findByName({name}){
        const result = await this.db.query({
            text: 'SELECT * FROM suppliers WHERE name = $1',
            params: [name]
        })

        return result.rows[0]
    }

    async update ({supplier}){
        const result = await this.db.query({
            text: `
            UPDATE suppliers
                SET
                    name = COALESCE($1, name),
                    cnpj = COALESCE($2, cnpj),
                    cpf = COALESCE($3, cpf)
                WHERE id = $4
                RETURNING *;
            `,
            params:[
                (supplier?.name || null),
                (supplier?.cnpj || null),
                (supplier?.cpf || null),
                supplier.id
            ]
        });

        return result.rows[0];
    }

    async create({supplier}){
        const result = await this.db.query({
            text: `
            INSERT INTO suppliers (name, cnpj, cpf)
            VALUES ($1, $2, $3)
            RETURNING *;
            `,
            params: [
                supplier.name,
                supplier.cnpj,
                supplier.cpf
            ]
        });

        return result.rows[0];
    }

    async getActiveDraft({ chatId }) {
        const result = await this.db.query({
            text: `
                SELECT *
                FROM supplier_drafts
                WHERE chat_id = $1 AND status = 'active'
            `,
            params: [chatId]
        });

        return result.rows[0];
    }


    async createDraft({ supplierDraft }) {
        const result = await this.db.query({
            text: `
            INSERT INTO supplier_drafts (
                name,
                cnpj,
                cpf,
                chat_id,
                registration_step,
                status
            ) VALUES (
                $1, $2, $3, $4, $5, $6
            )
            RETURNING *;
            `,
            params: [
                supplierDraft?.name ?? null,
                supplierDraft?.cnpj ?? null,
                supplierDraft?.cpf ?? null,
                supplierDraft.chatId,
                supplierDraft?.registrationStep ?? 'BEGIN',
                supplierDraft?.status ?? 'active'
            ],
        });

        return result.rows[0];
    }

    async updateDraft({ supplierDraft }) {
        const result = await this.db.query({
            text: `
            UPDATE supplier_drafts
            SET
                name = COALESCE($1, name),
                cnpj = COALESCE($2, cnpj),
                cpf = COALESCE($3, cpf),
                registration_step = COALESCE($4, registration_step),
                status = COALESCE($5, status),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $6
            RETURNING *;
            `,
            params: [
                supplierDraft?.name ?? null,
                supplierDraft?.cnpj ?? null,
                supplierDraft?.cpf ?? null,
                supplierDraft?.registrationStep ?? null,
                supplierDraft?.status ?? null,
                supplierDraft.id
            ],
        });

        return result.rows[0];
    }
}
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
}
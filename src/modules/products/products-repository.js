export default class ProductsRepository {
    constructor({ db }) {
        this.db = db;
    }

    async findById({id}){
        const result = await this.db.query({
            text: 'SELECT * FROM products WHERE id = $1',
            params: [id]
        })

        return result.rows[0]
    }

    async findByName({name}){
        const result = await this.db.query({
            text: 'SELECT * FROM products WHERE name = $1',
            params: [name]
        })

        return result.rows[0]
    }

    async update ({product}){
        const result = await this.db.query({
            text: `
            UPDATE products 
                SET
                    name = COALESCE($1, name),
                    inventory = COALESCE($2, inventory),
                    cost_price = COALESCE($3, cost_price),
                    sale_price = COALESCE($4, sale_price),
                    supplier_name = COALESCE($5, supplier_name)
                WHERE id = $6
                RETURNING *;
            `,
            params: [
                (product?.name || null),
                (product?.inventory || null),
                (product?.cost_price || null),
                (product?.sale_price || null),
                (product?.supplier_name || null),
                product.id
            ]
        })
    }

    async create({ product }) {
        const result = await this.db.query({
            text: `
            INSERT INTO products (name, inventory, cost_price, sale_price, supplier_name)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
            `,
            params: [
                product.name,
                product.inventory,
                product.cost_price,
                product.sale_price,
                product.supplier_name
            ]
        })

        return result.rows[0]
    }

    async ListAll(){
        const result = await this.db.query({
            text: 'SELECT * FROM products'
        })

        return result.rows
    }

    async getActiveDraft({chatId}){
        const result = await this.db.query({
            text: `SELECT * FROM products_drafts WHERE chat_id = $1 AND status = 'active'`,
            params: [chatId]
        });

        return result.rows[0];
    }

    async createDraft({productDraft}){
        const result = await this.db.query({
            text: `
            INSERT INTO products_drafts (name, inventory, cost_price, sale_price, supplier_name, chat_id, registration_step, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
            `,
            params: [
                productDraft?.name ?? null,
                productDraft?.inventory ?? null,
                productDraft?.cost_price ?? null,
                productDraft?.sale_price ?? null,
                productDraft?.supplier_name ?? null,
                productDraft?.chat_id ?? null,
                productDraft?.registration_step ?? 'BEGIN',
                productDraft?.status ?? 'active',
            ]
        })

        return result.rows[0];
    }

    async updateDraft({productDraft}){
        const result = await this.db.query({
            text: `
            UPDATE products_drafts
            SET
                name = COALESCE($1, name),
                inventory = COALESCE($2, inventory),
                cost_price = COALESCE($3, cost_price),
                sale_price = COALESCE($4, sale_price),
                supplier_name = COALESCE($5, supplier_name),
                registration_step = COALESCE($6, registration_step),
                status = COALESCE($7, status)
            WHERE id = $8
            RETURNING *;
            `,
            params: [
                (productDraft?.name || null),
                (productDraft?.inventory || null),
                (productDraft?.cost_price || null),
                (productDraft?.sale_price || null),
                (productDraft?.supplier_name || null),
                (productDraft?.registration_step || null),
                (productDraft?.status || null),
                productDraft.id
            ]
        })

        return result.rows[0];
    }

}

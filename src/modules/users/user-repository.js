export default class UserRepository {
    constructor ({
        db
    }) {
        this.db = db
    }

    async create({
        name,
        email,
        hashedPassword,
        type,
        companyId
    }) {
        const createQuery = 
        `
        INSERT INTO users (name, email, password, type, company_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `

        try {
            if (!this.db || !this.db.query) throw new Error('Database client not initialized')
            const result = await this.db.query({ text: createQuery, params: [name, email, hashedPassword, type, companyId] })
            return result.rows[0]
        } catch (error) {
            console.error('Erro ao criar Usuário (create):', { name, email, err: error.message })
            throw error;
        }
    }

    async get({
        id
    }) {
        const getQuery = 
        `
        SELECT *
        FROM users
        WHERE id = $1

        `

        try {
            if (!this.db || !this.db.query) throw new Error('Database client not initialized')
            const result = await this.db.query({ text: getQuery, params: [id] })
            return result.rows[0]
        } catch (error) {
            console.error('Erro ao recuperar usuário (get):', { id, query: getQuery, err: error.message })
            throw error;
        }
    }

    async getByEmail({
        email
    }) {
        const getQuery = 
        `
        SELECT id, name, email, password, type, company_id
        FROM users
        WHERE LOWER(email) = LOWER($1)
        LIMIT 1

        `

        try {
            if (!this.db || !this.db.query) throw new Error('Database client not initialized')
            const result = await this.db.query({ text: getQuery, params: [email] })
            return result.rows[0]
        } catch (error) {
            console.error('Erro ao recuperar usuário (getByEmail):', { email, query: getQuery, err: error.message })
            throw error;
        }
    }
}
import  pkg  from 'pg';
const { Pool } = pkg;

export default class Database {
    constructor({
        user,
        host,
        database,
        password,
        port,
    } = {}) {
        this.pool = new Pool({
            user,
            host,
            database,
            password,
            port,
        });
    }

    async init() {
        try {
            await this.pool.query('SELECT 1');
            console.log('✅ Database connected');
        } catch (err) {
            console.error('❌ Database connection failed:', err);
            throw err;
        }
    }

    async query({ text, params }) {
        return this.pool.query(text, params);
    }

    async close() {
        await this.pool.end();
    }
}
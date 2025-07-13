import  pkg  from 'pg';
const { Pool } = pkg;

import { Logger } from '../../logger.js';

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
            Logger.info('Database connection established successfully');
        } catch (err) {
            Logger.error('Database connection failed \n' + err.message);
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
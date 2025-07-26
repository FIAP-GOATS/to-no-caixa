export default class ChatRepository {
    constructor({ db }) {
        this.db = db;
    }

    async findById({ id }) {
        const result = await this.db.query({
            text: 'SELECT * FROM chats WHERE id = $1',
            params: [id]
        });

        return result.rows[0];
    }

    async findByPhoneNumber({ phonenumber }) {
        const result = await this.db.query({
            text: 'SELECT * FROM chats WHERE phonenumber = $1',
            params: [phonenumber]
        });

        return result.rows[0];
    }

    async create({ phonenumber, state }) {
        const result = await this.db.query({
            text: `
                INSERT INTO chats (
                    phonenumber,
                    state
                ) VALUES (
                    $1, $2
                )
                RETURNING *;
            `,
            params: [
                phonenumber,
                state
            ]
        });

        return result.rows[0];
    }

    async update({ id, state }) {
        const result = await this.db.query({
            text: `
                UPDATE chats
                SET
                    state = COALESCE($1, state)
                WHERE id = $2
                RETURNING *;
            `,
            params: [
                state,
                id
            ]
        });

        return result.rows[0];
    }
}

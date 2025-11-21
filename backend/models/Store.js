const pool = require('../config/database');

class Store {
    static async create(storeData) {
        const { name, email, address, owner_id } = storeData;
        const [result] = await pool.execute(
            'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
            [name, email, address, owner_id]
        );
        return result.insertId;
    }

    static async getAllStores(filters = {}) {
        let query = `
            SELECT s.*, 
                   AVG(r.rating) as average_rating,
                   COUNT(r.rating) as rating_count
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE 1=1
        `;
        const params = [];

        if (filters.name) {
            query += ' AND s.name LIKE ?';
            params.push(`%${filters.name}%`);
        }
        if (filters.address) {
            query += ' AND s.address LIKE ?';
            params.push(`%${filters.address}%`);
        }

        query += ' GROUP BY s.id ORDER BY s.name ASC';
        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async getStoreRatings(storeId) {
        const [rows] = await pool.execute(
            `SELECT u.name, u.email, r.rating, r.created_at 
             FROM ratings r 
             JOIN users u ON r.user_id = u.id 
             WHERE r.store_id = ? 
             ORDER BY r.created_at DESC`,
            [storeId]
        );
        return rows;
    }

    static async getUserRating(storeId, userId) {
        const [rows] = await pool.execute(
            'SELECT * FROM ratings WHERE store_id = ? AND user_id = ?',
            [storeId, userId]
        );
        return rows[0];
    }

    static async submitRating(storeId, userId, rating) {
        const [result] = await pool.execute(
            'INSERT INTO ratings (store_id, user_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = ?',
            [storeId, userId, rating, rating]
        );
        return result;
    }
}

module.exports = Store;
const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    static async create(userData) {
        const { name, email, password, address, role = 'user' } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, address, role]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await pool.execute(
            'SELECT id, name, email, address, role, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async updatePassword(id, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.execute(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, id]
        );
    }

    static async getAllUsers(filters = {}) {
        let query = `
            SELECT id, name, email, address, role, created_at 
            FROM users 
            WHERE 1=1
        `;
        const params = [];

        if (filters.name) {
            query += ' AND name LIKE ?';
            params.push(`%${filters.name}%`);
        }
        if (filters.email) {
            query += ' AND email LIKE ?';
            params.push(`%${filters.email}%`);
        }
        if (filters.role) {
            query += ' AND role = ?';
            params.push(filters.role);
        }

        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async getStats() {
        const [userCount] = await pool.execute('SELECT COUNT(*) as count FROM users');
        const [storeCount] = await pool.execute('SELECT COUNT(*) as count FROM stores');
        const [ratingCount] = await pool.execute('SELECT COUNT(*) as count FROM ratings');
        
        return {
            totalUsers: userCount[0].count,
            totalStores: storeCount[0].count,
            totalRatings: ratingCount[0].count
        };
    }
}

module.exports = User;
const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

const adminController = {
    async createUser(req, res) {
        try {
            const { name, email, password, address, role = 'user' } = req.body;
            
            const [existing] = await pool.execute(
                'SELECT id FROM users WHERE email = ?',
                [email]
            );
            
            if (existing.length > 0) {
                return res.status(400).json({ error: 'User with this email already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            
            const [result] = await pool.execute(
                'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
                [name, email, hashedPassword, address, role]
            );
            
            res.status(201).json({ 
                message: 'User created successfully', 
                userId: result.insertId 
            });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'User with this email already exists' });
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getAllUsers(req, res) {
        try {
            const { name, email, role, sortBy, sortOrder } = req.query;
            
            let query = `
                SELECT id, name, email, address, role, created_at 
                FROM users 
                WHERE 1=1
            `;
            const params = [];

            if (name) {
                query += ' AND name LIKE ?';
                params.push(`%${name}%`);
            }

            if (email) {
                query += ' AND email LIKE ?';
                params.push(`%${email}%`);
            }

            if (role) {
                query += ' AND role = ?';
                params.push(role);
            }

            if (sortBy) {
                query += ` ORDER BY ${sortBy} ${sortOrder || 'ASC'}`;
            } else {
                query += ' ORDER BY name ASC';
            }

            const [users] = await pool.execute(query, params);
            res.json({ users });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getStats(req, res) {
        try {
            const [userCount] = await pool.execute('SELECT COUNT(*) as count FROM users');
            const [storeCount] = await pool.execute('SELECT COUNT(*) as count FROM stores');
            const [ratingCount] = await pool.execute('SELECT COUNT(*) as count FROM ratings');
            
            res.json({ 
                stats: {
                    totalUsers: userCount[0].count,
                    totalStores: storeCount[0].count,
                    totalRatings: ratingCount[0].count
                }
            });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getUserDetails(req, res) {
        try {
            const { userId } = req.params;
            
            const [users] = await pool.execute(
                'SELECT id, name, email, address, role FROM users WHERE id = ?',
                [userId]
            );
            
            if (users.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            const user = users[0];
            let storeRating = null;

            if (user.role === 'store_owner') {
                const [ratings] = await pool.execute(
                    `SELECT AVG(r.rating) as average_rating 
                     FROM stores s 
                     LEFT JOIN ratings r ON s.id = r.store_id 
                     WHERE s.owner_id = ?`,
                    [userId]
                );
                storeRating = ratings[0].average_rating;
            }

            res.json({ 
                user: { 
                    ...user, 
                    storeRating: storeRating ? parseFloat(storeRating) : null 
                } 
            });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = adminController;
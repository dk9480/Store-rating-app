const { pool } = require('../config/database');

const storeController = {
    async createStore(req, res) {
        try {
            const { name, email, address, owner_id } = req.body;
            
            console.log('Creating store:', { name, email, address, owner_id });
            
            // Fix: Handle empty owner_id
            const storeOwnerId = (owner_id && owner_id !== '') ? parseInt(owner_id) : null;
            
            const [result] = await pool.execute(
                'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
                [name, email, address, storeOwnerId]
            );
            
            console.log('Store created successfully with ID:', result.insertId);
            
            res.status(201).json({ 
                message: 'Store created successfully', 
                storeId: result.insertId 
            });
        } catch (error) {
            console.error('Store creation error:', error);
            
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Store with this email already exists' });
            }
            
            res.status(500).json({ error: 'Internal server error: ' + error.message });
        }
    },

    async getAllStores(req, res) {
        try {
            const { name, address, sortBy, sortOrder } = req.query;
            
            let query = `
                SELECT s.*, 
                    AVG(r.rating) as average_rating,
                    COUNT(r.rating) as rating_count
                FROM stores s
                LEFT JOIN ratings r ON s.id = r.store_id
                WHERE 1=1
            `;
            const params = [];

            if (name) {
                query += ' AND s.name LIKE ?';
                params.push(`%${name}%`);
            }

            if (address) {
                query += ' AND s.address LIKE ?';
                params.push(`%${address}%`);
            }

            query += ' GROUP BY s.id';

            if (sortBy) {
                query += ` ORDER BY ${sortBy} ${sortOrder || 'ASC'}`;
            } else {
                query += ' ORDER BY s.name ASC';
            }

            const [stores] = await pool.execute(query, params);
            res.json({ stores });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async submitRating(req, res) {
        try {
            const { storeId } = req.params;
            const { rating } = req.body;
            const userId = req.user.id;

            await pool.execute(
                'INSERT INTO ratings (store_id, user_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = ?',
                [storeId, userId, rating, rating]
            );
            
            res.json({ message: 'Rating submitted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getStoreRatings(req, res) {
        try {
            const { storeId } = req.params;
            
            const [ratings] = await pool.execute(
                `SELECT u.name, u.email, r.rating, r.created_at 
                 FROM ratings r 
                 JOIN users u ON r.user_id = u.id 
                 WHERE r.store_id = ? 
                 ORDER BY r.created_at DESC`,
                [storeId]
            );
            
            res.json({ ratings });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getStoreWithUserRating(req, res) {
        try {
            const { name, address } = req.query;
            
            let query = `
                SELECT s.*, 
                    AVG(r.rating) as average_rating,
                    COUNT(r.rating) as rating_count
                FROM stores s
                LEFT JOIN ratings r ON s.id = r.store_id
                WHERE 1=1
            `;
            const params = [];

            if (name) {
                query += ' AND s.name LIKE ?';
                params.push(`%${name}%`);
            }

            if (address) {
                query += ' AND s.address LIKE ?';
                params.push(`%${address}%`);
            }

            query += ' GROUP BY s.id ORDER BY s.name ASC';

            const [stores] = await pool.execute(query, params);
            
            const storesWithUserRating = await Promise.all(
                stores.map(async (store) => {
                    const [userRatings] = await pool.execute(
                        'SELECT * FROM ratings WHERE store_id = ? AND user_id = ?',
                        [store.id, req.user.id]
                    );
                    return {
                        ...store,
                        userRating: userRatings[0] ? userRatings[0].rating : null
                    };
                })
            );

            res.json({ stores: storesWithUserRating });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = storeController;
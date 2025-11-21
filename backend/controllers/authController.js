const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const authController = {
    async register(req, res) {
        try {
            const { name, email, password, address } = req.body;
            
            const [existing] = await pool.execute(
                'SELECT id FROM users WHERE email = ?',
                [email]
            );
            
            if (existing.length > 0) {
                return res.status(400).json({ error: 'User already exists with this email' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            
            const [result] = await pool.execute(
                'INSERT INTO users (name, email, password, address) VALUES (?, ?, ?, ?)',
                [name, email, hashedPassword, address]
            );

            const token = jwt.sign(
                { userId: result.insertId }, 
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            const [users] = await pool.execute(
                'SELECT id, name, email, address, role FROM users WHERE id = ?',
                [result.insertId]
            );

            res.status(201).json({
                message: 'User registered successfully',
                token,
                user: users[0]
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;
            
            const [users] = await pool.execute(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );
            
            if (users.length === 0) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            const user = users[0];
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { userId: user.id }, 
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            const { password: _, ...userWithoutPassword } = user;

            res.json({
                message: 'Login successful',
                token,
                user: userWithoutPassword
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getProfile(req, res) {
        try {
            res.json({ user: req.user });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async updatePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            
            const [users] = await pool.execute(
                'SELECT * FROM users WHERE id = ?',
                [req.user.id]
            );
            
            const user = users[0];
            const isValidPassword = await bcrypt.compare(currentPassword, user.password);
            if (!isValidPassword) {
                return res.status(400).json({ error: 'Current password is incorrect' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await pool.execute(
                'UPDATE users SET password = ? WHERE id = ?',
                [hashedPassword, req.user.id]
            );
            
            res.json({ message: 'Password updated successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = authController;
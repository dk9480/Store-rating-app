const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', require('./routes'));

// Test route
app.get('/', (req, res) => {
    res.json({ 
        success: true,
        message: '🚀 Store Rating API is working perfectly!',
        timestamp: new Date().toISOString()
    });
});

// Health check
app.get('/api/health', async (req, res) => {
    const dbStatus = await testConnection();
    res.json({
        status: 'OK',
        database: dbStatus ? 'Connected' : 'Disconnected',
        timestamp: new Date().toISOString()
    });
});

// Error handling
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler - FIXED: Use proper function syntax
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log('='.repeat(60));
    console.log('✅ STORE RATING API SERVER STARTED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log(`📍 Port: ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`💾 Database: ${process.env.DB_NAME}`);
    console.log(`🕐 Started at: ${new Date().toLocaleString()}`);
    console.log('='.repeat(60));
    
    await testConnection();
});
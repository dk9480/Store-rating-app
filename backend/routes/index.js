const express = require('express');
const router = express.Router();

// Import controllers
const authController = require('../controllers/authController');
const storeController = require('../controllers/storeController');
const adminController = require('../controllers/adminController');

// Import middleware
const { auth, requireRole } = require('../middleware/auth');
const { userValidation, storeValidation, ratingValidation } = require('../middleware/validation');

// Auth routes
router.post('/register', userValidation, authController.register);
router.post('/login', authController.login);
router.get('/profile', auth, authController.getProfile);
router.put('/update-password', auth, authController.updatePassword);

// Store routes
router.get('/stores', auth, storeController.getAllStores);
router.get('/stores-with-ratings', auth, storeController.getStoreWithUserRating);
router.post('/stores/:storeId/rate', auth, ratingValidation, storeController.submitRating);
router.get('/stores/:storeId/ratings', auth, storeController.getStoreRatings);

// Admin routes
router.post('/admin/users', auth, requireRole(['admin']), userValidation, adminController.createUser);
router.get('/admin/users', auth, requireRole(['admin']), adminController.getAllUsers);
router.get('/admin/stats', auth, requireRole(['admin']), adminController.getStats);
router.get('/admin/users/:userId', auth, requireRole(['admin']), adminController.getUserDetails);
router.post('/admin/stores', auth, requireRole(['admin']), storeValidation, storeController.createStore);

module.exports = router;
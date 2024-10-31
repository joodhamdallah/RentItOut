// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const AuthController=require('../controllers/AuthController');
const {verifyToken,authorizeRole}=require('../middleware/authMiddleware')

// Authentication routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/forgotPassword', AuthController.forgotPassword);
router.patch('/resetPassword/:token', AuthController.resetPassword);

// Change password (requires authentication)
router.patch(
    '/changePassword',
    verifyToken,  
    AuthController.changePassword
);

module.exports = router;

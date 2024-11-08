const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');


router.get('/users/myProfile', verifyToken, UserController.getCurrentUser);
router.patch('/users/updateProfile', verifyToken, UserController.updateUser);

// Admin-only routes for managing users
router.get('/users', verifyToken, authorizeRole('admin'), UserController.getAllUsers);
router.get('/users/:id', verifyToken, authorizeRole('admin'), UserController.getUser);
router.get('/users/email/:email', verifyToken, authorizeRole('admin'), UserController.getUserByEmail);
router.get('/users/phone/:phoneNumber', verifyToken, authorizeRole('admin'), UserController.getUserByPhoneNumber); 

router.post('/users',verifyToken, authorizeRole('admin'), UserController.createUser);
router.delete('/users/:id', verifyToken, authorizeRole('admin'),UserController.deleteUser);

module.exports = router;

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');


router.get('/users/myProfile', verifyToken, UserController.getCurrentUser);
router.patch('/users/updateProfile', verifyToken, UserController.updateUser);

router.use(verifyToken, authorizeRole('admin'));
// Admin-only routes for managing users
router.get('/users', UserController.getAllUsers);
router.get('/users/:id', UserController.getUserById);
router.get('/users/email/:email', UserController.getUserByEmail);
router.get('/users/phone/:phoneNumber', UserController.getUserByPhoneNumber); 

router.post('/users', UserController.createUser);
router.delete('/users/:id', UserController.deleteUser);

module.exports = router;

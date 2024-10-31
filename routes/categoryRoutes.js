const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');
const { verifyToken,authorizeRole } = require('../middleware/authMiddleware');

//List all categories
router.get('/categories', CategoryController.listAllCategories);

//  Get a specific category by ID
router.get('/categories/:id', CategoryController.getCategoryById);

router.put('/categories/:id', verifyToken, authorizeRole('admin'), CategoryController.updateCategory); // Update a category
router.post('/categories', verifyToken, authorizeRole('admin'), CategoryController.addCategory);      // Add a new category
router.delete('/categories/:id', verifyToken, authorizeRole('admin'), CategoryController.deleteCategory); // Delete a category

module.exports = router;






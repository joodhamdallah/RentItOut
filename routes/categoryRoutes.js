const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');

//List all categories
router.get('/categories', CategoryController.listAllCategories);

//  Get a specific category by ID
router.get('/categories/:id', CategoryController.getCategoryById);

// Update an existing category
router.put('/categories/:id', CategoryController.updateCategory);

// Add a new category
router.post('/categories', CategoryController.addCategory);

//delete cat
router.delete('/categories/:id', CategoryController.deleteCategory);

module.exports = router;






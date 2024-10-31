const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');
const { verifyToken,authorizeRole } = require('../middleware/authMiddleware');

//List all categories
router.get('/categories', CategoryController.listAllCategories);

//  Get a specific category by ID
router.get('/categories/:id', CategoryController.getCategoryById);

// Update an existing category
router.put('/categories/:id', CategoryController.updateCategory);

router.post('/categories', verifyToken, authorizeRole('admin'), CategoryController.addCategory);

//router.use(verifyToken);
// Add a new category
//router.post('/categories', CategoryController.addCategory);

//delete cat
router.delete('/categories/:id', CategoryController.deleteCategory);

module.exports = router;






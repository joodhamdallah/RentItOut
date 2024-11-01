const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { verifyToken,authorizeRole } = require('../middleware/authMiddleware');

router.get('/items', itemController.listItems);          // List all items
router.get('/items/:id', itemController.getItem);        // Get item by ID

router.post('/items', verifyToken, authorizeRole('admin','vendor'),itemController.createItem);        // Create a new item
router.put('/items/:id',verifyToken, authorizeRole('admin','vendor'), itemController.updateItem);     // Update item details
router.delete('/items/:id',verifyToken, authorizeRole('admin','vendor'), itemController.deleteItem);  // Delete an item

module.exports = router;

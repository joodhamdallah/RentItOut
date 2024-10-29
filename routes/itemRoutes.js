const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');


router.get('/items', itemController.listItems);          // List all items
router.get('/items/:id', itemController.getItem);        // Get item by ID
router.post('/items', itemController.createItem);        // Create a new item
router.put('/items/:id', itemController.updateItem);     // Update item details
router.delete('/items/:id', itemController.deleteItem);  // Delete an item

module.exports = router;

const express = require('express');
const router = express.Router();
const ReturningItemsController = require('../controllers/ReturningItemsController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

// Get all returning items
router.get('/returning-items', verifyToken, authorizeRole('admin'), ReturningItemsController.getAllReturningItems); 

// Get a specific returning item by ID
router.get('/returning-items/:id', ReturningItemsController.getReturningItemById);

// Create a new returning item 
router.post('/returning-items',verifyToken, authorizeRole('admin','Insurance_Team'), ReturningItemsController.createReturningItem);

// Update a returning item by ID
router.put('/returning-items/:id', verifyToken, authorizeRole('admin'), ReturningItemsController.updateReturningItem);

// Delete a returning item by ID
router.delete('/returning-items/:id', verifyToken, authorizeRole('admin'), ReturningItemsController.deleteReturningItem);

//returned amount proccess
router.post('/returning-items/returned-amount/:rental_item_id/:item_id', verifyToken, authorizeRole('admin', 'Insurance_Team'), ReturningItemsController.processReturn);

//overtime_charge proccess
router.post('/returning-items/overtime-charge/:RItem_id', verifyToken, authorizeRole('admin', 'Insurance_Team'), ReturningItemsController.calculateOvertimeCharge);

module.exports = router;

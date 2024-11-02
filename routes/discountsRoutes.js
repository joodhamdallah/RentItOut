const express = require('express');
const router = express.Router();
const DiscountController = require('../controllers/DiscountsController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

router.get('/discounts', DiscountController.listAllDiscounts); // List all discounts
router.get('/discounts/:id', DiscountController.getDiscountById); // Get a specific discount by ID

// Add a new discount (requires authentication and admin role)
router.post('/discounts', verifyToken, authorizeRole('admin'), DiscountController.addDiscount);

// Update an existing discount 
router.put('/discounts/:id', verifyToken, authorizeRole('admin'), DiscountController.updateDiscount);

// Delete a discount 
router.delete('/discounts/:id', verifyToken, authorizeRole('admin'), DiscountController.deleteDiscount);

module.exports = router;

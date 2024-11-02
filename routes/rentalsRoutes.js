const express = require('express');
const router = express.Router();
const RentalController = require('../controllers/RentalController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

//router.post('/rental-details/create', rentalController.createRentalDetails);
// Add item to cart
router.post('/cart',  RentalController.addToCart);

// Get cart items
router.get('/cart',  RentalController.getCart);

// Collect logistics details (step 1)
router.post('/checkout/logistics', verifyToken, RentalController.collectLogisticsDetails);

// Collect payment details (step 2)
router.post('/checkout/payment', verifyToken, RentalController.collectPaymentDetails);

// Confirm checkout (step 3)
router.post('/checkout/confirm', verifyToken, RentalController.confirmCheckout);



module.exports = router;

const express = require('express');
const router = express.Router();
const RentalController = require('../controllers/RentalController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

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

//rentals with basic info
router.get('/basics', verifyToken,authorizeRole('admin'),RentalController.getAllRentalsWithInfo);

//get rental with it's details using a rental id
router.get('/details/:rentalId', verifyToken, authorizeRole('admin'), RentalController.getRentalDetailsByRentalId);

//delete rental and associated rental details
router.delete('/:rentalId', verifyToken, authorizeRole('admin'), RentalController.deleteRental);

//get the rentals with the user who is logged in 
router.get('/', verifyToken, RentalController.getUserRentalsWithDetails);



module.exports = router;

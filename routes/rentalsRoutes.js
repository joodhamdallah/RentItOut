const express = require('express');
const router = express.Router();
const RentalController = require('../controllers/RentalController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

// Cart routes
router.post('/cart', RentalController.addToCart); // Add item to cart
router.get('/cart', RentalController.getCart); // Get cart items
router.put('/cart/:itemId', RentalController.updateCartItem); // Update item in cart
router.delete('/cart/:itemId', RentalController.removeCartItem); // Remove item from cart

// Checkout routes
router.post('/checkout/logistics', verifyToken, RentalController.collectLogisticsDetails); // Collect logistics details (step 1)
router.post('/checkout/payment', verifyToken, RentalController.collectPaymentDetails); // Collect payment details (step 2)
router.post('/checkout/confirm', verifyToken, RentalController.confirmCheckout); // Confirm checkout (step 3)

// User-specific rental routes
router.get('/', verifyToken, RentalController.getUserRentalsWithDetails); // Get rentals for logged-in user
router.post('/cancel/:rentalId', verifyToken, RentalController.cancelRental); // Cancel a rental
router.put('/extend/:rentalId', verifyToken, RentalController.extendRentalPeriod); // Extend rental period

// Admin routes
router.get('/basics', verifyToken, authorizeRole('admin'), RentalController.getAllRentalsWithInfo); // Get all rentals with basic info
router.get('/details/:rentalId', verifyToken, authorizeRole('admin'), RentalController.getRentalDetailsByRentalId); // Get rental details by rental ID
router.delete('/:rentalId', verifyToken, authorizeRole('admin'), RentalController.deleteRental); // Delete rental and associated rental details



module.exports = router;

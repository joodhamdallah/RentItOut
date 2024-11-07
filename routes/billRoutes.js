const express = require('express');
const router = express.Router();
const BillController = require('../controllers/BillController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

// Retrieve all bills for a specific user
router.get('/my-bills', verifyToken, BillController.getMyBills);

// Retrieve all bills (Admin only)
router.get('/', verifyToken, authorizeRole('admin'), BillController.getAllBills);

// Retrieve a specific bill by ID (Admin only)
router.get('/:billId', verifyToken, authorizeRole('admin'), BillController.getBillById);

// Update a bill (Admin only)
router.put('/:billId', verifyToken, authorizeRole('admin'), BillController.updateBill);

// Delete a bill by ID (Admin only)
router.delete('/:billId', verifyToken, authorizeRole('admin'), BillController.deleteBill);

// Retrieve bills for a specific user (Admin only)
router.get('/user/:userId', verifyToken, authorizeRole('admin'), BillController.getBillsByUserId);

// Retrieve bill by rental id (Admin only)
router.get('/rental/:rentalId', verifyToken, authorizeRole('admin'), BillController.getBillByRentalId);


module.exports = router;

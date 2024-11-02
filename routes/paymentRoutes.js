const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');
const { verifyToken,authorizeRole } = require('../middleware/authMiddleware');



router.get('/payments', PaymentController.getAllPayments); //list al payment method
router.get('/payments/:id', PaymentController.getPaymentById);//get payment method by id 
router.post('/payments',verifyToken, authorizeRole('admin'), PaymentController.createPayment);//creat new payment   method 
router.put('/payments/:id',verifyToken, authorizeRole('admin'), PaymentController.updatePayment);//update the payment method 
router.delete('/payments/:id',verifyToken, authorizeRole('admin'), PaymentController.deletePayment); //delete payment method 

module.exports = router;

const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');  

router.get('/payments', PaymentController.getAllPayments);
router.get('/payments/:id', PaymentController.getPaymentById);
router.post('/payments', PaymentController.createPayment);
router.put('/payments/:id', PaymentController.updatePayment);
router.delete('/payments/:id', PaymentController.deletePayment);

module.exports = router;

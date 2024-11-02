const Payment = require('../models/Payment'); 

class PaymentController {
  // Get all payment methods
  static getAllPayments(req, res) {
    Payment.getAll((err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
    });
  }

  // Get a single payment method
  static getPaymentById(req, res) {
    const { id } = req.params;
    Payment.getById(id, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (result.length === 0) {
        return res.status(404).json({ error: 'Payment method not found' });
      }
      res.json(result[0]);
    });
  }

  // Create a new payment method
  static createPayment(req, res) {
    const { payment_method } = req.body;
    if (!payment_method) {
      return res.status(400).json({ error: 'Payment method is required' });
    }
    Payment.create(payment_method, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Payment method created successfully', pay_id: result.insertId });
    });
  }

  // Update an existing payment method
  static updatePayment(req, res) {
    const { id } = req.params;
    const { payment_method } = req.body;
    if (!payment_method) {
      return res.status(400).json({ error: 'Payment method is required' });
    }
    Payment.update(id, payment_method, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Payment method not found' });
      }
      res.json({ message: 'Payment method updated successfully' });
    });
  }

  // Delete a payment method
  static deletePayment(req, res) {
    const { id } = req.params;
    Payment.delete(id, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Payment method not found' });
      }
      res.json({ message: 'Payment method deleted successfully' });
    });
  }
}

module.exports = PaymentController;

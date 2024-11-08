const Payment = require('../models/Payment'); 
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Test key for Stripe
//const axios = require('axios');


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

  static async getPaymentByMethod(payment_method) {
    try {
        console.log(`Attempting to retrieve payment method: ${payment_method}`); // Log the input
        const paymentRecord = await Payment.getPaymentByMethod(payment_method);
        console.log("Result from database query: ", paymentRecord); // Log the result of the query
        
        if (!paymentRecord) {
            console.error(`No record found for payment method: ${payment_method}`); // More specific error message
            throw new Error(`Payment method ${payment_method} not found.`);
        }
        
        console.log(`Found payment method record with pay_id: ${paymentRecord.pay_id}`); // Log the specific result
        
        return paymentRecord.pay_id; // Return only the `pay_id`
    } catch (error) {
        console.error('Error occurred while retrieving payment method:', error); // Log the full error
        throw error; 
    }
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

 // Method to initiate a Stripe payment
 static async initiatePayment(req, res) {
  const { payment_method } = req.body;
  const amount = Math.round(req.session.cart.reduce((sum, item) => sum + item.subtotal, 0) * 100); // Amount in cents

  try {
    if (payment_method === 'PayPal'||payment_method === 'Credit Card') {
      // Stripe payment initiation
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        payment_method_types: ['card'],
        description: 'Rental order payment'
      });

      //console.log('Stripe Payment Intent created:', paymentIntent);

      return res.status(200).json({
        message: 'Credit Card payment initiated. Complete the payment to confirm the order.',
        client_secret: paymentIntent.client_secret
      });
    }

    throw new Error('Unsupported payment method');
  } catch (err) {
    console.error('Error initiating payment:', err);
    return { error: 'Failed to initiate payment' };
  }
}

// static async confirmStripePayment(req, res) {
//   console.log("helloo");
//   const { paymentIntentId } = req.body;

//   if (!paymentIntentId) {
//     return res.status(400).json({ error: 'Payment Intent ID is required' });
//   }

//   try {
//     const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
//     console.log('Stripe Payment Intent confirmed:', paymentIntent);

//     if (paymentIntent.status === 'succeeded') {
//       return res.status(200).json({
//         message: 'Payment confirmed successfully.',
//         paymentIntent,
//       });
//     } else {
//       return res.status(400).json({
//         message: `Payment confirmation failed. Current status: ${paymentIntent.status}`,
//       });
//     }
//   } catch (error) {
//     console.error('Error confirming payment:', error);
//     return res.status(500).json({ error: 'Failed to confirm Stripe payment' });
//   }
// }


// static async createStripePaymentIntent(req, res) {
//   try {
//       // You can dynamically set the amount from the request or session if needed
//       const amount = req.session.cart.reduce((sum, item) => sum + item.subtotal, 0) * 100; // Amount in cents

//       const response = await axios.post('https://api.stripe.com/v1/payment_intents', {
//           amount: amount, // Using the calculated amount
//           currency: 'usd',
//           payment_method_types: ['card']
//       }, {
//           headers: {
//               'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
//               'Content-Type': 'application/x-www-form-urlencoded'
//           }
//       });

//       console.log('Stripe Payment Intent created:', response.data);

//       // Return response to the client
//       return res.status(200).json({
//           message: 'Stripe Payment Intent created successfully.',
//           client_secret: response.data.client_secret
//       });
//   } catch (error) {
//       console.error('Error creating payment intent:', error.response ? error.response.data : error.message);
//       return res.status(500).json({ error: 'Failed to create Stripe payment intent' });
//   }
// }
}

module.exports = PaymentController;

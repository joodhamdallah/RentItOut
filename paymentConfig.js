require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const paypal = require('@paypal/checkout-server-sdk');
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

module.exports = { stripe, client };

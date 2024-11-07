// services/PaymentService.js
const PaymentController = require('../../controllers/PaymentController');

class PaymentService {
    static async validateAndStorePaymentDetails(payment_method, req) {
        const paymentMethods = ['Credit Card', 'PayPal', 'Cash'];
        if (!paymentMethods.includes(payment_method)) {
            throw new Error(`Invalid payment method. Allowed methods: ${paymentMethods.join(', ')}`);
        }

        const pay_id = await PaymentController.getPaymentByMethod(payment_method);
        if (!pay_id) {
            throw new Error(`Payment ID for ${payment_method} not found.`);
        }

        req.session.checkoutDetails = { ...req.session.checkoutDetails, payment_method, pay_id };
        return pay_id;
    }
}

module.exports = PaymentService;

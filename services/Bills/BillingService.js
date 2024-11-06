// services/BillingService.js
const BillController = require('../../controllers/BillController');
const moment = require('moment');
const Discount = require('../../models/Discounts');
const sendInvoiceEmail = require('./InvoiceGenerator');

class BillingService {
    static async createBillAndSendInvoice(req, user, rentalId, cartItems, discountId, payment_method) {
        try {
            const priceBeforeDiscount = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
            const discountDetails = await this.getDiscountDetails(discountId);
            const discountPercentage = discountDetails?.discount_percentage || 0;
            const discountDescription = discountDetails?.discount_name || 'No Discount';

            const priceAfterDiscount = parseFloat((priceBeforeDiscount * (1 - discountPercentage / 100)).toFixed(2));
            const shippingCost = req.session.checkoutDetails?.logistic_type === 'Delivery' ? 10 : 0;
            const totalPriceToPay = parseFloat((priceAfterDiscount + shippingCost).toFixed(2));
            const billDate = moment().format('YYYY-MM-DD');

            const billData = {
                rental_id: rentalId,
                pay_id: req.session.checkoutDetails?.pay_id,
                price_before_discount: priceBeforeDiscount,
                discount_percentage: discountPercentage,
                discount_description: discountDescription,
                price_after_discount: priceAfterDiscount,
                shipping_cost: shippingCost,
                bill_date: billDate,
                total_price_to_pay: totalPriceToPay,
                user_id: user.user_id
            };

            const bill = await BillController.createBillEntry(billData);

            // Pass payment_method to sendInvoiceEmail
            await sendInvoiceEmail(user, rentalId, req.session.checkoutDetails?.logistic_type, bill, cartItems, discountDetails, payment_method);

            return bill;
        } catch (error) {
            console.error("Error creating bill and sending invoice:", error);
            throw new Error('Failed to create and send bill');
        }
    }

    static async getDiscountDetails(discountId) {
        if (!discountId) return null;
        return await Discount.getDiscountById(discountId);
    }
}

module.exports = BillingService;

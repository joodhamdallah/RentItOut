const Bills = require('../models/Bill');
const moment = require('moment'); 

class BillController {
    static async createBillEntry(req, res, rentalId, priceBeforeDiscount, pay_id, discountDetails, logisticType) {
        try {
            const discountPercentage = discountDetails ? discountDetails.discount_percentage : 0;
            const discountDescription = discountDetails ? discountDetails.discount_name : 'No Discount';
            const priceAfterDiscount = Math.round((priceBeforeDiscount - (priceBeforeDiscount * (discountPercentage / 100))) * 1000) / 1000;
            const shippingCost = logisticType === 'Delivery' ? 40 : 0; // 40$ for delivery, 0$ for pickup
            const totalPriceToPay = priceAfterDiscount + shippingCost;
            const billDate = moment().format('YYYY-MM-DD');
            const userId = req.userId;

            // Create bill entry
            const bill = await Bills.createBill({
                rental_id: rentalId,
                pay_id: pay_id,
                price_before_discount: priceBeforeDiscount,
                discount_percentage: discountPercentage,
                discount_description: discountDescription,
                price_after_discount: priceAfterDiscount,
                shipping_cost: shippingCost,
                bill_date: billDate,
                total_price_to_pay: totalPriceToPay,
                user_id: userId
            });

            if (!bill || !bill.bill_id) {
                throw new Error('Failed to create bill');
            }

            console.log('Bill created:', bill);
            return bill;
        } catch (err) {
            console.error('Error creating bill:', err);
            throw new Error('Failed to create bill');
        }
    }

    // Controller to get all bills
    static async getAllBills(req, res) {
        try {
            const bills = await Bills.getAllBills();
            res.status(200).json(bills);
        } catch (err) {
            res.status(500).json({ error: 'Failed to retrieve bills', details: err });
        }
    }
}

module.exports = BillController;

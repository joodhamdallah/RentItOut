// services/DiscountService.js
const Discount = require('../../models/Discounts');
const moment = require('moment');

class DiscountService {
    static async determineDiscount(userId, rentalDetails, getNumberOfUserRentals) {
        try {
            const discounts = await Discount.getAllDiscounts();
            let applicableDiscount = null;

            // Check if this is the user's first rental
            const userRentals = await getNumberOfUserRentals(userId);
            if (userRentals.length === 0) {
                applicableDiscount = discounts.find(discount => discount.discount_name === 'First Purchase Discount');
            }

            // Loyalty Discount
            if (userRentals.length >= 5) {
                const loyaltyDiscount = discounts.find(discount => discount.discount_name === 'Loyalty Discount');
                if (loyaltyDiscount && (!applicableDiscount || loyaltyDiscount.discount_percentage > applicableDiscount.discount_percentage)) {
                    applicableDiscount = loyaltyDiscount;
                }
            }

            // Percentage Amount Discount
            const totalValue = rentalDetails.reduce((sum, item) => sum + item.subtotal, 0);
            if (totalValue > 100) {
                const percentageDiscount = discounts.find(discount => discount.discount_name === 'Percentage Amount Discount');
                if (percentageDiscount && (!applicableDiscount || percentageDiscount.discount_percentage > applicableDiscount.discount_percentage)) {
                    applicableDiscount = percentageDiscount;
                }
            }

            // Long-Term Rental Discount
            const rentalPeriodExceeds7Days = rentalDetails.some(item => {
                const rentalDays = moment(item.return_date).diff(moment(item.rental_date), 'days') + 1;
                return rentalDays > 7;
            });
            if (rentalPeriodExceeds7Days) {
                const longTermDiscount = discounts.find(discount => discount.discount_name === 'Long-Term Rental Discount');
                if (longTermDiscount && (!applicableDiscount || longTermDiscount.discount_percentage > applicableDiscount.discount_percentage)) {
                    applicableDiscount = longTermDiscount;
                }
            }

            return applicableDiscount ? applicableDiscount.discount_id : null;
        } catch (error) {
            console.error('Error in DiscountService:', error);
            throw new Error('Failed to determine discount');
        }
    }
}

module.exports = DiscountService;

const Bill = require('../models/Bill');

class BillController {
    // static async createBillEntry(rentalId, totalPrice, payId) {
    //     try {
    //         const bill = await Bill.createBill({
    //             total_price: totalPrice,
    //             rental_id: rentalId,
    //             pay_id: payId
    //         });
    //         return bill;
    //     } catch (error) {
    //         console.error('Error creating bill:', error);
    //         throw new Error('Failed to create bill');
    //     }
    // }
}

module.exports = BillController;

const Bills = require('../models/Bill');
const moment = require('moment'); 

class BillController {
    static async createBillEntry(billData) {
        try {
            // Ensure required fields are properly provided and formatted
            if (!billData.price_before_discount || isNaN(billData.price_before_discount)) {
                throw new Error("Invalid price_before_discount");
            }

            // Create bill entry in the database
            const bill = await Bills.createBill(billData);

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

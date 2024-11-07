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

    static async getAllBills(req, res) {
        try {
            const bills = await Bills.getAllBills();
            res.status(200).json(bills);
        } catch (err) {
            res.status(500).json({ error: 'Failed to retrieve bills', details: err });
        }
    }

    static async getBillById(req, res) {
        const { billId } = req.params;
        try {
            const bill = await Bills.getBillById(billId);
            if (!bill) return res.status(404).json({ error: 'Bill not found' });
            res.status(200).json(bill);
        } catch (err) {
            res.status(500).json({ error: 'Failed to retrieve bill', details: err });
        }
    }

    static async updateBill(req, res) {
        const { billId } = req.params;
        const updateData = req.body;
        try {
            const success = await Bills.updateBill(billId, updateData);
            if (!success) return res.status(404).json({ error: 'Bill not found or update failed' });
            res.status(200).json({ message: 'Bill updated successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to update bill', details: err });
        }
    }

    static async deleteBill(req, res) {
        const { billId } = req.params;
        try {
            const success = await Bills.deleteBill(billId);
            if (!success) return res.status(404).json({ error: 'Bill not found or deletion failed' });
            res.status(200).json({ message: 'Bill deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to delete bill', details: err });
        }
    }

    static async getBillsByUserId(req, res) {
        const { userId } = req.params;
        try {
            const bills = await Bills.getUserBills(userId);
            res.status(200).json(bills);
        } catch (err) {
            res.status(500).json({ error: 'Failed to retrieve user bills', details: err });
        }
    }

    static async getBillByRentalId(req, res) {
        const { rentalId } = req.params;
        try {
            const bill = await Bills.getBillByRentalId(rentalId);
            if (!bill) return res.status(404).json({ error: 'Bill not found' });
            res.status(200).json(bill);
        } catch (err) {
            res.status(500).json({ error: 'Failed to retrieve bill by rental ID', details: err });
        }
    }

    static async getMyBills(req, res) {
        console.log("hiiiiiiii");
        const userId = req.userId; // Assuming `userId` is set by the auth middleware
        console.log("userid==="+userId);
        try {
            const bills = await Bills.getUserBills(userId);
            res.status(200).json(bills);
        } catch (err) {
            res.status(500).json({ error: 'Failed to retrieve user bills', details: err });
        }
    }
}

module.exports = BillController;

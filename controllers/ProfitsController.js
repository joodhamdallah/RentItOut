const ProfitsModel = require('../models/Profits');

class ProfitsController {
    static async calculateProfit(req, res) {
        const { item_id } = req.params;
        
        try {
            const result = await ProfitsModel.calculateAndInsertProfit(item_id);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getProfits(req, res) {
        try {
            const profits = await ProfitsModel.getProfits();
            res.status(200).json({ success: true, data: profits });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Failed to retrieve profits' });
        }
    }


    static async getVendorProfitsByUser(req, res) {
        const { user_id } = req.params;

        try {
            const vendorProfits = await ProfitsModel.getVendorProfitsByUser(user_id);
            res.status(200).json({ success: true, data: vendorProfits });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Failed to retrieve vendor profits' });
        }
    }


}

module.exports = ProfitsController;

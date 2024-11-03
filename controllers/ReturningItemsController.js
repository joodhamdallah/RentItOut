const ReturningItemsModel = require('../models/ReturningItems');

class ReturningItemsController {
    static async getAllReturningItems(req, res) {
        try {
            const items = await ReturningItemsModel.getAllReturningItems();
            res.status(200).json({ success: true, data: items });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Failed to retrieve returning items' });
        }
    }

    static async getReturningItemById(req, res) {
        const { id } = req.params;
        try {
            const item = await ReturningItemsModel.getReturningItemById(id);
            if (!item) {
                return res.status(404).json({ success: false, message: 'Returning item not found' });
            }
            res.status(200).json({ success: true, data: item });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Failed to retrieve returning item' });
        }
    }
    
    static async createReturningItem(req, res) {
        const { item_name, status_for_item, returned_amount, actual_return_date, rental_item_id, overtime_charge } = req.body;
        try {
            const newItem = await ReturningItemsModel.createReturningItem({ item_name, status_for_item, returned_amount, actual_return_date, rental_item_id, overtime_charge });
            res.status(201).json({ success: true, data: newItem });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Failed to create returning item' });
        }
    }


    static async updateReturningItem(req, res) {
        const { id } = req.params;
        const updateData = req.body;

        try {
            const success = await ReturningItemsModel.updateReturningItem(id, updateData);
            if (!success) {
                return res.status(404).json({ success: false, message: 'Returning item not found' });
            }
            res.status(200).json({ success: true, message: 'Returning item updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Failed to update returning item' });
        }
    }

    static async deleteReturningItem(req, res) {
        const { id } = req.params;
        try {
            const success = await ReturningItemsModel.deleteReturningItem(id);
            if (!success) {
                return res.status(404).json({ success: false, message: 'Returning item not found' });
            }
            res.status(200).json({ success: true, message: 'Returning item deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Failed to delete returning item' });
        }
    }


    static async processReturn(req, res) {
        const { rental_item_id, item_id } = req.params;
        const { status_for_item, actual_return_date } = req.body;
    
        try {
            // Get the deposit amount for the item
            const deposit = await ReturningItemsModel.getItemDeposit(item_id);
            if (deposit === null) {
                return res.status(404).json({ success: false, message: 'Item not found' });
            }
    
            // Determine returned amount based on status_for_item
            let returned_amount;
            switch (status_for_item) {
                case 'Excellent':
                    returned_amount = deposit; // Return full deposit
                    break;
                case 'Good':
                    returned_amount = deposit * 0.7; // Return 70%
                    break;
                case 'Damaged':
                    returned_amount = deposit * 0.3; // Return 30%
                    break;
                case 'Needs Replacement':
                    returned_amount = 0; // No deposit returned
                    break;
                default:
                    return res.status(400).json({ success: false, message: 'Invalid status_for_item' });
            }
    
            // Insert the returning item record
            const newItem = await ReturningItemsModel.createReturningItem({
                item_name: req.body.item_name,  // Assuming item_name is also passed in the body
                status_for_item,
                returned_amount,
                actual_return_date,
                rental_item_id,
                item_id,
                overtime_charge: req.body.overtime_charge || 0  // Optional: set to 0 if not provided
            });
    
            res.status(201).json({ success: true, data: newItem });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Failed to process returning item' });
        }
    }
}

module.exports = ReturningItemsController;

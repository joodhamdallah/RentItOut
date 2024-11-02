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

    // static async processReturn(req, res) {  ///insurance team part
    //     const { rentalItemId } = req.params;
    //     const { statusForItem } = req.body;

    //     if (!['Excellent', 'Good', 'Damaged', 'Needs Replacement'].includes(statusForItem)) {
    //         return res.status(400).json({ success: false, message: 'Invalid status' });
    //     }

    //     try {
    //         const result = await ReturningItemsModel.createReturnEntry(rentalItemId, statusForItem);
    //         res.status(200).json({
    //             success: true,
    //             message: 'Item return processed successfully',
    //             data: result
    //         });
    //     } catch (error) {
    //         console.error('Error processing item return:', error);
    //         res.status(500).json({ success: false, message: 'Failed to process item return' });
    //     }
    // }

}

module.exports = ReturningItemsController;

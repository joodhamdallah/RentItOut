const DiscountModel = require('../models/Discounts');

class DiscountController {
    static async listAllDiscounts(req, res) {
        try {
            const discounts = await DiscountModel.getAllDiscounts();
            res.status(200).json({ success: true, data: discounts });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Failed to retrieve discounts' });
        }
    }

    static async getDiscountById(req, res) {
        const discountId = req.params.id;
        try {
            const discount = await DiscountModel.getDiscountById(discountId);
            if (!discount) {
                return res.status(404).json({ success: false, message: 'Discount not found' });
            }
            res.status(200).json({ success: true, data: discount });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Failed to retrieve discount' });
        }
    }

    static async addDiscount(req, res) {
        const { discount_name, discount_percentage, description } = req.body;

        // Check if required fields are provided
        if (!discount_name || discount_percentage === undefined || !description) {
            return res.status(400).json({ success: false, message: 'Discount name, percentage, and description are required.' });
        }

        try {
            const newDiscount = await DiscountModel.createDiscount({ discount_name, discount_percentage, description });
            res.status(201).json({ success: true, data: newDiscount });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Failed to add discount' });
        }
    }

    static async updateDiscount(req, res) {
        const discountId = req.params.id;
        const { discount_name, discount_percentage, description } = req.body;

        // Create an object to hold the fields that need to be updated
        const updateData = {};

        if (discount_name !== undefined) {
            updateData.discount_name = discount_name;
        }

        if (discount_percentage !== undefined) {
            if (discount_percentage < 0 || discount_percentage > 100) {
                return res.status(400).json({ success: false, message: 'Discount percentage must be between 0 and 100.' });
            }
            updateData.discount_percentage = discount_percentage;
        }

        if (description !== undefined) {
            updateData.description = description;
        }

        try {
            const updatedDiscount = await DiscountModel.updateDiscount(discountId, updateData);
            if (!updatedDiscount) {
                return res.status(404).json({ success: false, message: 'Discount not found' });
            }
            res.status(200).json({ success: true, message: 'Discount updated successfully', data: updatedDiscount });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to update discount', error });
        }
    }

    static async deleteDiscount(req, res) {
        const discountId = req.params.id;

        try {
            const success = await DiscountModel.deleteDiscount(discountId);
            if (!success) {
                return res.status(404).json({ success: false, message: 'Discount not found' });
            }
            res.status(200).json({ success: true, message: 'Discount deleted successfully' });
        } catch (error) {
            console.error("Error deleting discount:", error);
            res.status(500).json({ success: false, message: 'Failed to delete discount', error });
        }
    }
}

module.exports = DiscountController;

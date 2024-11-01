const CategoryModel = require('../models/Category'); 

class CategoryController {
    static async listAllCategories(req, res) {
        try {
            const categories = await CategoryModel.getAllCategories();
            res.status(200).json({ success: true, data: categories });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Failed to retrieve categories' });
        }
    }

    static async getCategoryById(req, res) {
        const categoryId = req.params.id;
        try {
            const category = await CategoryModel.getCategoryById(categoryId);
            if (!category) {
                return res.status(404).json({ success: false, message: 'Category not found' });
            }
            res.status(200).json({ success: true, data: category });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Failed to retrieve category' });
        }
    }
    
    static async updateCategory(req, res) {
        const categoryId = req.params.id;
        const { category_name, category_description, number_of_items } = req.body;
    
        // Create an object to hold the fields that need to be updated
        const updateData = {};
    
        //add fields to updateData that are in the request body
        if (category_name !== undefined) {
            updateData.category_name = category_name;
        }
        
        if (category_description !== undefined) {
            updateData.category_description = category_description;
        }
        
        if (number_of_items !== undefined) {
            if (number_of_items < 0) {
                return res.status(400).json({ success: false, message: 'Number of items cannot be negative.' });
            }
            updateData.number_of_items = number_of_items;
        }
    
        try {
            const updatedCategory = await CategoryModel.updateCategory(categoryId, updateData);
            if (!updatedCategory) {
                return res.status(404).json({ success: false, message: 'Category not found' });
            }
            res.status(200).json({ success: true, message: 'Category updated successfully', data: updatedCategory });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to update category', error });
        }
    }

    static async addCategory(req, res) {
        const { category_name, category_description, number_of_items } = req.body;

        // Check if required fields are provided
        if (!category_name || !category_description || number_of_items === undefined) {
            return res.status(400).json({ success: false, message: 'Category name, description, and number of items are required.' });
        }
    
        try {
            const newCategory = await CategoryModel.createCategory({ category_name, category_description, number_of_items });
            res.status(201).json({ success: true, data: newCategory });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Failed to add category' });
        }
    }
    

    static async deleteCategory(req, res) {
        const categoryId = req.params.id;

        try {
            const success = await CategoryModel.deleteCategory(categoryId);
            if (!success) {
                return res.status(404).json({ success: false, message: 'Category not found' });
            }
            res.status(200).json({ success: true, message: 'Category deleted successfully' });
        } catch (error) {
            console.error("Error deleting category:", error);
            res.status(500).json({ success: false, message: 'Failed to delete category', error });
        }
    }
    
}

module.exports = CategoryController;

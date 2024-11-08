const CategoryService = require('../services/Categories/CategoryService');

class CategoryController {
  static async listAllCategories(req, res) {
    try {
      const categories = await CategoryService.getAllCategories();
      res.status(200).json({ success: true, data: categories });
    } catch (err) {
      console.error('Error retrieving categories:', err);
      res.status(500).json({ success: false, message: 'Failed to retrieve categories' });
    }
  }

  static async getCategoryById(req, res) {
    try {
      const category = await CategoryService.getCategoryById(req.params.id);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      res.status(200).json({ success: true, data: category });
    } catch (err) {
      console.error('Error retrieving category:', err);
      res.status(500).json({ success: false, message: 'Failed to retrieve category' });
    }
  }

  static async searchCategoryByName(req, res) {
    try {
      const categories = await CategoryService.searchCategoryByName(req.params.name);
      if (categories.length === 0) {
        return res.status(404).json({ success: false, message: 'No categories found' });
      }
      res.status(200).json({ success: true, data: categories });
    } catch (err) {
      console.error('Error searching categories:', err);
      res.status(500).json({ success: false, message: 'Failed to search for categories' });
    }
  }

  static async updateCategory(req, res) {
    try {
      const updatedCategory = await CategoryService.updateCategory(req.params.id, req.body);
      if (!updatedCategory) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      res.status(200).json({ success: true, message: 'Category updated successfully', data: updatedCategory });
    } catch (err) {
      console.error('Error updating category:', err);
      res.status(500).json({ success: false, message: 'Failed to update category' });
    }
  }

  static async addCategory(req, res) {
    try {
      const newCategory = await CategoryService.createCategory(req.body);
      res.status(201).json({ success: true, data: newCategory });
    } catch (err) {
      console.error('Error adding category:', err);
      res.status(500).json({ success: false, message: 'Failed to add category' });
    }
  }

  static async deleteCategory(req, res) {
    try {
      const success = await CategoryService.deleteCategory(req.params.id);
      if (!success) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      res.status(200).json({ success: true, message: 'Category deleted successfully' });
    } catch (err) {
      console.error('Error deleting category:', err);
      res.status(500).json({ success: false, message: 'Failed to delete category' });
    }
  }
}

module.exports = CategoryController;

const CategoryModel = require('../../models/Category');

class CategoryService {
  static async getAllCategories() {
    return CategoryModel.getAllCategories();
  }

  static async getCategoryById(categoryId) {
    return CategoryModel.getCategoryById(categoryId);
  }

  static async searchCategoryByName(searchTerm) {
    return CategoryModel.searchCategoryByName(searchTerm);
  }

  static async updateCategory(categoryId, updateData) {
    if (updateData.number_of_items < 0) {
      throw new Error('Number of items cannot be negative');
    }
    return CategoryModel.updateCategory(categoryId, updateData);
  }

  static async createCategory(categoryData) {
    return CategoryModel.createCategory(categoryData);
  }

  static async deleteCategory(categoryId) {
    return CategoryModel.deleteCategory(categoryId);
  }
}

module.exports = CategoryService;

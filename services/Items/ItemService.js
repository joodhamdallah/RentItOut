const ItemModel = require('../../models/Item');
const CategoryModel = require('../../models/Category');

class ItemService {
  static async getAllItems() {
    return ItemModel.getAllItems();
  }

  static async getItemById(itemId) {
    return ItemModel.getItemById(itemId);
  }

  static async createItem(itemData) {
    const result = await ItemModel.createItem(itemData);
    const success = await CategoryModel.incrementNumberOfItems(itemData.category_id);
    if (!success) {
      throw new Error('Category not found or number of items could not be updated');
    }
    return result;
  }

  static async updateItem(id, itemData) {
    if (itemData.category_id) {
      const categoryExists = await CategoryModel.getCategoryById(itemData.category_id);
      if (!categoryExists) {
        throw new Error(`Category with ID ${itemData.category_id} not found`);
      }
    }
    return ItemModel.updateItem(id, itemData);
  }

  static async deleteItem(itemId) {
    return ItemModel.deleteItem(itemId);
  }

  static async getItemsByUser(userId) {
    return ItemModel.getItemsByUser(userId);
  }

  static async searchItemsByName(searchTerm) {
    return ItemModel.searchItemsByName(searchTerm);
  }
}

module.exports = ItemService;

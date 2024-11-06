// services/InventoryService.js
const Item = require('../models/Item');

class InventoryService {
    static async updateInventory(cartItems) {
        for (const item of cartItems) {
            const itemDetails = await Item.getItemById(item.item_id);

            if (!itemDetails) {
                throw new Error(`Item with ID ${item.item_id} not found.`);
            }

            const newCount = itemDetails.item_count - item.quantity;
            if (newCount < 0) {
                throw new Error(`Not enough stock for item ID ${item.item_id}. Available: ${itemDetails.item_count}`);
            }

            await Item.updateItem(item.item_id, { item_count: newCount });
        }
    }
}

module.exports = InventoryService;

// services/Rentals/RentalDetailsService.js
const Item = require('../../models/Item');
const RentalDetails = require('../../models/Rentaldetails');

class RentalDetailsService {
    static async createRentalDetails(rentalId, cartItems) {
        try {
            for (const item of cartItems) {
                const itemDetails = await Item.getItemById(item.item_id);

                if (!itemDetails) {
                    throw new Error(`Item with ID ${item.item_id} not found.`);
                }

                // Check stock availability
                const newCount = itemDetails.item_count - item.quantity;
                if (newCount < 0) {
                    throw new Error(`Not enough stock for item ID ${item.item_id}. Available: ${itemDetails.item_count}`);
                }

                // Update item stock
                await Item.updateItem(item.item_id, { item_count: newCount });

                // Insert into RentalDetails
                await RentalDetails.createRentalDetails({
                    rental_id: rentalId,
                    item_id: item.item_id,
                    quantity: item.quantity,
                    rental_date: item.rental_date,
                    return_date: item.return_date,
                    subtotal: item.subtotal
                });
            }
        } catch (error) {
            throw new Error('Failed to create rental details: ' + error.message);
        }
    }
}

module.exports = RentalDetailsService;

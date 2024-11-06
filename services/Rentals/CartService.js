// services/CartService.js
const Item = require('../../models/Item');
const moment = require('moment');

class CartService {
    static async validateCartItemDates(item_id, quantity, rental_date, return_date) {
        
        // Check date format
        if (!moment(rental_date, 'YYYY-MM-DD', true).isValid() || !moment(return_date, 'YYYY-MM-DD', true).isValid()) {
            return { success: false, message: 'Dates must be in the format YYYY-MM-DD' };
        }

        // Check if the rental date and return date are in the future
        if (moment(rental_date).isBefore(moment(), 'day')) {
            return { success: false, message: 'Rental date must be in the future' };
        }

        if (moment(return_date).isBefore(moment(), 'day')) {
            return { success: false, message: 'Return date must be in the future' };
        }

        // Ensure return date is after rental date
        if (moment(return_date).isBefore(moment(rental_date))) {
            return { success: false, message: 'Return date must be after the rental date' };
        }

        return { success: true };
    }

     static async addItemToCart(item_id, quantity, rental_date, return_date, sessionCart) {
        // Check for missing fields
        if (!item_id || !quantity || !rental_date || !return_date) {
            return { success: false, message: 'All fields are required' };
        }

        const itemDetails = await Item.getItemById(item_id);
        if (!itemDetails) {
            return { success: false, message: `Item ID ${item_id} not found.` };
        }
        // Check if quantity is a positive number
        if (quantity <= 0) {
         return { success: false, message: 'Quantity must be a positive number' };
        
        }
        // Check if the item has any quantity available at all
        if (itemDetails.item_count === 0) {
         return { success: false, message: `No available quantity, all pieces of item ID ${item_id} are currently rented out!` };
         }
         if (itemDetails.item_count < quantity) {
            return { success: false, message: 'Insufficient quantity available' };
        }
        const validationResult = await this.validateCartItemDates(item_id, quantity, rental_date, return_date);
        if (!validationResult.success) {
            return validationResult;
        }

        const pricePerDay = parseFloat(itemDetails.price_per_day);
        const deposit = parseFloat(itemDetails.deposit);
        const rentalDays = moment(return_date).diff(moment(rental_date), 'days') + 1;
        const subtotal = parseFloat(((pricePerDay * rentalDays * quantity) + deposit).toFixed(3));

        // Update or add item to cart
        const existingItem = sessionCart.find(item => item.item_id === item_id);
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.subtotal += subtotal;
        } else {
            sessionCart.push({
                item_id,
                item_name: itemDetails.item_name,
                price_per_day: pricePerDay,
                deposit: deposit,
                quantity,
                rental_date,
                return_date,
                subtotal
            });
        }
        return { success: true, message: 'Item added to cart successfully' };

    }

    static async getCartDetails(cart) {
        const detailedCart = await Promise.all(cart.map(async item => {
            const itemDetails = await Item.getItemById(item.item_id);
            return { ...item, ...itemDetails };
        }));

        const total = detailedCart.reduce((sum, item) => sum + item.subtotal, 0);
        return { detailedCart, total };
    }
}

module.exports = CartService;

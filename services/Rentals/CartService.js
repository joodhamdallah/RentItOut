// services/CartService.js
const Item = require('../../models/Item');
const moment = require('moment');

class CartService {
 // Helper: Fetch item details and check availability
 static async fetchItemAndCheckAvailability(item_id, quantity) {
    const itemDetails = await Item.getItemById(item_id);
    if (!itemDetails) {
        return { success: false, message: `Item ID ${item_id} not found.` };
    }
    
    // Check if the item has any quantity available at all
    if (itemDetails.item_count === 0) {
        return { success: false, message: `No available quantity, all pieces of item ID ${item_id} are currently rented out!` };
    }
    
    // Check if requested quantity is available
    if (itemDetails.item_count < quantity) {
        return { success: false, message: 'Insufficient quantity available' };
    }
    
    return { success: true, itemDetails };
}

// Helper: Validate dates for a cart item
static validateDates(rental_date, return_date) {
    if (!moment(rental_date, 'YYYY-MM-DD', true).isValid() || !moment(return_date, 'YYYY-MM-DD', true).isValid()) {
        return { success: false, message: 'Dates must be in the format YYYY-MM-DD' };
    }
    if (moment(rental_date).isBefore(moment(), 'day')) {
        return { success: false, message: 'Rental date must be in the future' };
    }
    if (moment(return_date).isBefore(moment(rental_date))) {
        return { success: false, message: 'Return date must be after the rental date' };
    }
    return { success: true };
}

// Helper: Calculate subtotal
static calculateSubtotal(pricePerDay, rentalDays, quantity, deposit) {
    return parseFloat(((pricePerDay * rentalDays * quantity) + deposit).toFixed(2));
}

// Add item to cart
static async addItemToCart(item_id, quantity, rental_date, return_date, sessionCart) {
    if (!item_id || !quantity || !rental_date || !return_date) {
        return { success: false, message: 'All fields are required' };
    }

    // Validate dates
    const dateValidation = this.validateDates(rental_date, return_date);
    if (!dateValidation.success) return dateValidation;

    // Fetch item and check quantity availability
    const { success, message, itemDetails } = await this.fetchItemAndCheckAvailability(item_id, quantity);
    if (!success) return { success, message };

    const pricePerDay = parseFloat(itemDetails.price_per_day);
    const deposit = parseFloat(itemDetails.deposit);
    const rentalDays = moment(return_date).diff(moment(rental_date), 'days') + 1;
    const subtotal = this.calculateSubtotal(pricePerDay, rentalDays, quantity, deposit);

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

// Update an item in the cart
static async updateCartItem(item_id, quantity, rental_date, return_date, sessionCart) {
     const itemIdAsNumber = Number(item_id);
    const validation = this.validateDates(rental_date, return_date);
    if (!validation.success) return validation;

    const { success, message, itemDetails } = await this.fetchItemAndCheckAvailability(itemIdAsNumber, quantity);
    if (!success) return { success, message };

    const cartItem = sessionCart.find(item => item.item_id === itemIdAsNumber);
    if (!cartItem) {
        return { success: false, message: 'Item not found in cart' };
    }

    cartItem.quantity = quantity;
    cartItem.rental_date = rental_date;
    cartItem.return_date = return_date;

    const rentalDays = moment(return_date).diff(moment(rental_date), 'days') + 1;
    cartItem.subtotal = this.calculateSubtotal(cartItem.price_per_day, rentalDays, quantity, cartItem.deposit);

    return { success: true, message: 'Cart item updated successfully' };
}

// Remove an item from the cart
static async removeCartItem(item_id, sessionCart) {
    const itemIdAsNumber = Number(item_id);
    const index = sessionCart.findIndex(item => item.item_id === itemIdAsNumber);
    if (index === -1) {
        return { success: false, message: 'Item not found in cart' };
    }
    sessionCart.splice(index, 1);
    return { success: true, message: 'Item removed from cart' };
}

// Get cart details
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

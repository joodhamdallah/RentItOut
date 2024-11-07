// services/Rentals/RentalService.js

const Rentals = require('../../models/Rentals');
const RentalDetails = require('../../models/Rentaldetails');

class RentalService {
    // Get rentals with details for a specific user
    static async getUserRentalsWithDetails(userId) {
        try {
            const rentals = await Rentals.getUserRentalsWithDetails(userId);
            if (rentals.length === 0) {
                return { message: 'No rentals found for this user' };
            }

            // Structure rentals into a nested format
            return rentals.reduce((acc, item) => {
                let rental = acc.find(r => r.rental_id === item.rental_id);
                if (!rental) {
                    rental = {
                        rental_id: item.rental_id,
                        user_id: item.user_id,
                        email: item.email,
                        logistic_type: item.logistic_type,
                        discount_name: item.discount_name,
                        payment_method: item.payment_method,
                        bill: {
                            bill_id: item.bill_id,
                            price_before_discount: item.price_before_discount,
                            discount_percentage: item.discount_percentage,
                            discount_description: item.discount_description,
                            price_after_discount: item.price_after_discount,
                            shipping_cost: item.shipping_cost,
                            bill_date: item.bill_date,
                            total_price_to_pay: item.total_price_to_pay
                        },
                        items: []
                    };
                    acc.push(rental);
                }

                rental.items.push({
                    item_id: item.item_id,
                    item_name: item.item_name,
                    deposit: item.deposit,
                    price_per_day: item.price_per_day,
                    quantity: item.quantity,
                    rental_date: item.rental_date,
                    return_date: item.return_date,
                    subtotal: item.subtotal
                });

                return acc;
            }, []);
        } catch (error) {
            throw new Error('Error retrieving user rentals with details');
        }
    }

    // Admin-specific: Get all rentals with basic info
    static async getAllRentalsWithInfo() {
        try {
            const rentalDetails = await Rentals.getAllRentalsWithInfo();
            return rentalDetails;
        } catch (error) {
            throw new Error('Failed to retrieve all rentals with basic info');
        }
    }

    // Admin-specific: Get rental details by rental ID
    static async getRentalDetailsByRentalId(rentalId) {
        try {
            const results = await Rentals.getRentalDetailsByRentalId(rentalId);
            if (results.length === 0) {
                throw new Error('Rental not found');
            }

            return {
                rental_id: results[0].rental_id,
                user_id: results[0].user_id,
                email: results[0].email,
                logistic_type: results[0].logistic_type,
                discount_name: results[0].discount_name,
                payment_method: results[0].payment_method,
                items: results.map(item => ({
                    item_id: item.item_id,
                    item_name: item.item_name,
                    deposit: item.deposit,
                    price_per_day: item.price_per_day,
                    quantity: item.quantity,
                    rental_date: item.rental_date,
                    return_date: item.return_date,
                    subtotal: item.subtotal
                }))
            };
        } catch (error) {
            throw new Error(error.message || 'Failed to retrieve rental details');
        }
    }

    // Admin-specific: Delete rental by rental ID
    static async deleteRentalById(rentalId) {
        try {
            const result = await Rentals.deleteRentalById(rentalId);
            if (result.affectedRows === 0) {
                throw new Error('Rental not found or already deleted');
            }
            return { message: 'Rental deleted successfully' };
        } catch (error) {
            throw new Error('Failed to delete rental');
        }
    }

     // Cancel a rental
    static async cancelRental(rentalId, userId) {
    const rental = await Rentals.getRentalById(rentalId);
    if (!rental || rental.user_id !== userId) {
        return { success: false, message: 'Rental not found or unauthorized' };
    }
    if (moment().isAfter(moment(rental.rental_date), 'day')) {
        return { success: false, message: 'Cancellation is not allowed after the rental date has started' };
    }

    try {
        await Rentals.deleteRentalById(rentalId); // Deleting the rental and associated records
        return { success: true, message: 'Rental cancelled successfully' };
    } catch (error) {
        throw new Error('Failed to cancel rental: ' + error.message);
    }
}

     // Extend a rental period
     static async extendRentalPeriod(rentalId, newReturnDate) {
    const rentalDetails = await Rentals.getRentalById(rentalId);

    if (!rentalDetails) {
        return { success: false, message: 'Rental not found' };
    }

    if (moment(newReturnDate).isBefore(rentalDetails.return_date)) {
        return { success: false, message: 'New return date must be after the current return date' };
    }

    const additionalDays = moment(newReturnDate).diff(moment(rentalDetails.return_date), 'days');
    const additionalCost = rentalDetails.price_per_day * additionalDays * rentalDetails.quantity;

    try {
        await Rentals.updateReturnDate(rentalId, newReturnDate);
        await Rentals.updateTotalCost(rentalId, rentalDetails.total_cost + additionalCost);
        return { success: true, message: 'Rental period extended successfully', additionalCost };
    } catch (error) {
        throw new Error('Failed to extend rental period: ' + error.message);
    }
}
     
}

module.exports = RentalService;

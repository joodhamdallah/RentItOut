const Item = require('../models/Item'); 
const RentalDetails = require('../models/Rentaldetails');
const moment = require('moment'); 

exports.createRentalDetails = async (req, res) => {
    const { item_id, quantity, rental_date, return_date } = req.body;

    // Validation to check that all the fields are required 
    if (!item_id || !quantity || !rental_date || !return_date) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (quantity <= 0) {
        return res.status(400).json({ error: 'Quantity must be a positive number' });
    }

    // Validate date formats using moment.js
    if (!moment(rental_date, 'YYYY-MM-DD', true).isValid() || !moment(return_date, 'YYYY-MM-DD', true).isValid()) {
        return res.status(400).json({ error: 'Dates must be in the format YYYY-MM-DD' });
    }

    // Make sure that the return date is after the rental date
    if (moment(return_date).isBefore(moment(rental_date))) {
        return res.status(400).json({ error: 'Return date must be after the rental date' });
    }

    try {
       
        const item = await Item.getItemById(item_id);

        // Check if item was found
        if (!item) {
            console.log('Item not found for ID:', item_id);
            return res.status(404).json({ error: 'Item not found' });
        }

        const pricePerDay = parseFloat(item.price_per_day); 
        const deposit = parseFloat(item.deposit); 

        // Calculate the number of rental days (including the start day) <<<<MAKE SURE U DO nmp instsll for moment library>>>>  
        const rentalDays = moment(return_date).diff(moment(rental_date), 'days') + 1;

      

        // Calculate subtotal
        const subtotal = (pricePerDay * rentalDays * quantity) + deposit;

        // Check if subtotal is a valid number
        if (isNaN(subtotal)) {
            console.error("Calculated subtotal is NaN");
            return res.status(500).json({ error: 'Failed to calculate subtotal' });
        }

        console.log("Subtotal:", subtotal); 

        // Create rental details
        const result = await RentalDetails.createRentalDetails({
            item_id,
            quantity,
            rental_date,
            return_date,
            subtotal,
        });

        res.status(201).json({
            message: 'Rental details created successfully', 
            rental_item_id: result.insertId,
            subtotal, 
        });
    } catch (err) {
        console.error('Error creating rental details:', err);
        res.status(500).json({ error: 'Failed to create rental details' });
    }
};

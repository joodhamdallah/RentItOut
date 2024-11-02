const Item = require('../models/Item'); 
const RentalDetails = require('../models/Rentaldetails');
const Rentals = require('../models/Rentals');
const Discount = require('../models/Discounts');
const moment = require('moment'); 

class RentalController {
      // Add item to cart
  static async addToCart(req, res) {
    const { item_id, quantity, rental_date, return_date } = req.body;

    // Validate the input
    if (!item_id || !quantity || !rental_date || !return_date) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be a positive number' });
    }

    // Check date format
    if (!moment(rental_date, 'YYYY-MM-DD', true).isValid() || !moment(return_date, 'YYYY-MM-DD', true).isValid()) {
      return res.status(400).json({ error: 'Dates must be in the format YYYY-MM-DD' });
    }

    if (moment(return_date).isBefore(moment(rental_date))) {
      return res.status(400).json({ error: 'Return date must be after the rental date' });
    }

    try {
      const itemDetails = await Item.getItemById(item_id);

      // Check if the item was found
      if (!itemDetails) {
        return res.status(404).json({ error: `Item with ID ${item_id} not found` });
      }

      // Check if there is enough quantity available for the rental
      if (itemDetails.item_count < quantity) {
        return res.status(400).json({ error: `Not enough quantity available for item ID ${item_id}. Available: ${itemDetails.item_count}` });
      }

      const pricePerDay = parseFloat(itemDetails.price_per_day);
      const deposit = parseFloat(itemDetails.deposit);
      // Calculate subtotal for the item
      const rentalDays = moment(return_date).diff(moment(rental_date), 'days') + 1;
      const subtotal = (pricePerDay * rentalDays * quantity) + deposit;
        // Check if subtotal is a valid number
        if (isNaN(subtotal)) {
            console.error("Calculated subtotal is NaN");
            return res.status(500).json({ error: 'Failed to calculate subtotal' });
        }
      
        // Initialize session cart if not already set
      if (!req.session.cart) {
        req.session.cart = [];
      }

      // Check if the item already exists in the cart
      const existingItemIndex = req.session.cart.findIndex(item => item.item_id === item_id);

      if (existingItemIndex !== -1) {
        // Update the existing item's quantity and subtotal
        req.session.cart[existingItemIndex].quantity += quantity;
        req.session.cart[existingItemIndex].subtotal += subtotal;
      } else {
        // Add item to session cart with detailed information
        req.session.cart.push({
          item_id,
          item_name: itemDetails.item_name,
          item_description: itemDetails.item_description,
          category_name: itemDetails.category_name, // Include category name
          price_per_day: itemDetails.price_per_day,
          deposit: itemDetails.deposit,
          quantity,
          rental_date,
          return_date,
          subtotal
        });
      }

      res.status(200).json({ message: 'Item added to cart successfully'});
    } catch (err) {
      console.error('Error adding item to cart:', err);
      res.status(500).json({ error: 'Failed to add item to cart' });
    }
  }

   // Get items in the cart and display full details
   static async getCart(req, res) {
    const cart = req.session.cart || [];
    const detailedCart = [];

    try {
        if (cart.length === 0) {
            return res.status(200).json({
              message: 'The cart is empty. Please add items to your cart before proceeding to checkout.'
            });
          }       
      // Populate detailed cart information
      for (const item of cart) {
        const itemDetails = await Item.getItemById(item.item_id);
        if (itemDetails) {
          detailedCart.push({
            item_id: item.item_id,
            item_name: itemDetails.item_name,
            item_description: itemDetails.item_description,
            category_name: itemDetails.category_name, // Include category name
            price_per_day: itemDetails.price_per_day,
            deposit: itemDetails.deposit,
            quantity: item.quantity,
            rental_date: item.rental_date,
            return_date: item.return_date,
            subtotal: item.subtotal
          });
        }
      }

      const total = detailedCart.reduce((sum, item) => sum + item.subtotal, 0);
      const checkoutLink = 'http://localhost:3000/checkout/logistics'; // Replace with your actual checkout URL

      // Check if the user is authenticated (using token or session)
      const isAuthenticated = req.userId; 
  
      const message = isAuthenticated
        ? `You can proceed with checkout by visiting  ${checkoutLink} to provide shipping and payment details:`
        : `If you want to complete the process, please log in or sign up and follow the link to complete the process: ${checkoutLink}`;

      res.status(200).json({ 
        cart: detailedCart, 
        total, 
        message
      });
      
    } catch (err) {
      console.error('Error retrieving cart:', err);
      res.status(500).json({ error: 'Failed to retrieve cart details' });
    }
  }

  static async collectLogisticsDetails(req, res) {
    const { logistic_type } = req.body;
  
    if (!logistic_type) {
      return res.status(400).json({ error: 'Logistic type is required' });
    }
  // List of allowed logistic types
  const allowedLogisticTypes = ['Delivery', 'Pickup'];

  // Validate the provided logistic type
  if (!allowedLogisticTypes.includes(logistic_type)) {
    return res.status(400).json({ error: 'Invalid logistic type. Please choose a valid type.' });
  }
    try {
      // Initialize the checkout details if not present
      if (!req.session.checkoutDetails) {
        req.session.checkoutDetails = {};
      }
  
      // Store logistic type in the session
      req.session.checkoutDetails.logistic_type = logistic_type;
  
      res.status(200).json({ message: 'Logistics details received. Proceed to the next step.' });
    } catch (err) {
      console.error('Error collecting logistics details:', err);
      res.status(500).json({ error: 'Failed to process logistics details' });
    }
  }
  
  // Collect payment details (step 2)
  static async collectPaymentDetails(req, res) {
    const { payment_method } = req.body;
  
    if (!payment_method) {
      return res.status(400).json({ error: 'Payment method is required' });
    }
  
    try {
      // Initialize the checkout details if not present
      if (!req.session.checkoutDetails) {
        req.session.checkoutDetails = {};
      }
  
      // Store payment method in the session
      req.session.checkoutDetails.payment_method = payment_method;
  
      res.status(200).json({ message: 'Payment details received. Proceed to confirmation.' });
    } catch (err) {
      console.error('Error collecting payment details:', err);
      res.status(500).json({ error: 'Failed to process payment details' });
    }
  }

  // Function to determine applicable discount
  static async determineDiscount(userId, rentalDetails) {
    try {
      // Get all discounts
      const discounts = await Discount.getAllDiscounts();
      
      let applicableDiscount = null;

      // Check if this is the user's first rental
      const userRentals = await Rentals.getUserRentals(userId);
      if (userRentals.length === 0) {
        applicableDiscount = discounts.find(discount => discount.discount_name === 'First Purchase Discount');
      }

      // Check if the user qualifies for the "Loyalty Discount" (after 5 rentals)
      if (userRentals.length >= 5) {
        const loyaltyDiscount = discounts.find(discount => discount.discount_name === 'Loyalty Discount');
        if (loyaltyDiscount && (!applicableDiscount || loyaltyDiscount.discount_percentage > applicableDiscount.discount_percentage)) {
          applicableDiscount = loyaltyDiscount;
        }
      }

      // Check if the total value of the rental exceeds $100 for "Percentage Amount Discount"
      const totalValue = rentalDetails.reduce((sum, item) => sum + item.subtotal, 0);
      if (totalValue > 100) {
        const percentageDiscount = discounts.find(discount => discount.discount_name === 'Percentage Amount Discount');
        if (percentageDiscount && (!applicableDiscount || percentageDiscount.discount_percentage > applicableDiscount.discount_percentage)) {
          applicableDiscount = percentageDiscount;
        }
      }

      // Check if the rental period is longer than 7 days for "Long-Term Rental Discount"
      const rentalPeriodExceeds7Days = rentalDetails.some(item => {
        const rentalDays = moment(item.return_date).diff(moment(item.rental_date), 'days') + 1;
        return rentalDays > 7;
      });
      if (rentalPeriodExceeds7Days) {
        const longTermDiscount = discounts.find(discount => discount.discount_name === 'Long-Term Rental Discount');
        if (longTermDiscount && (!applicableDiscount || longTermDiscount.discount_percentage > applicableDiscount.discount_percentage)) {
          applicableDiscount = longTermDiscount;
        }
      }

      return applicableDiscount ? applicableDiscount.discount_id : null;
    } catch (err) {
      console.error('Error determining discount:', err);
      throw new Error('Failed to determine discount');
    }
  }


   // Confirm and store the complete rental process with discount logic
   static async confirmCheckout(req, res) {
    const userId = req.userId;

    if (!req.session.cart || req.session.cart.length === 0) {
      return res.status(400).json({ error: 'Cart is empty. Please add items to the cart before checkout' });
    }

         const { logistic_type} = req.session.checkoutDetails || {};
         if (!logistic_type ) {
            return res.status(400).json({ error: 'Logistic type and required for confirmation' });
          }
    // const { logistic_type, payment_method } = req.session.checkoutDetails || {};

    // if (!logistic_type || !payment_method) {
    //   return res.status(400).json({ error: 'Logistic type and payment method are required for confirmation' });
    // }

    try {
      const cartItems = req.session.cart;

      // Determine the discount ID based on rental conditions
      const discountId = await RentalController.determineDiscount(userId, cartItems);

      // Save the complete rental order in the database
      const rentalId = await Rentals.createRental(userId, logistic_type, discountId);
      console.log("rent id="+rentalId);

      // Save rental details for each item
      for (const item of cartItems) {
        await RentalDetails.createRentalDetails({
          rental_id: rentalId,
          item_id: item.item_id,
          quantity: item.quantity,
          rental_date: item.rental_date,
          return_date: item.return_date,
          subtotal: item.subtotal
        });
      }

      // Clear cart and checkout details after checkout is confirmed
      req.session.cart = [];
      req.session.checkoutDetails = null;

      res.status(201).json({ message: 'Checkout confirmed and stored successfully', rentalId });
    } catch (err) {
      console.error('Error confirming checkout:', err);
      res.status(500).json({ error: 'Failed to confirm and store the checkout process' });
    }
  }
}
  
  module.exports = RentalController;

// /////////saleeeeeeeeeeeeeeeeeeeh////////////
// exports.createRentalDetails = async (req, res) => {
//     const { item_id, quantity, rental_date, return_date } = req.body;

//     // Validation to check that all the fields are required 
//     if (!item_id || !quantity || !rental_date || !return_date) {
//         return res.status(400).json({ error: 'All fields are required' });
//     }

//     if (quantity <= 0) {
//         return res.status(400).json({ error: 'Quantity must be a positive number' });
//     }

//     // Validate date formats using moment.js
//     if (!moment(rental_date, 'YYYY-MM-DD', true).isValid() || !moment(return_date, 'YYYY-MM-DD', true).isValid()) {
//         return res.status(400).json({ error: 'Dates must be in the format YYYY-MM-DD' });
//     }

//     // Make sure that the return date is after the rental date
//     if (moment(return_date).isBefore(moment(rental_date))) {
//         return res.status(400).json({ error: 'Return date must be after the rental date' });
//     }

//     try {
//         const item = await Item.getItemById(item_id);

//         // Check if item was found
//         if (!item) {
//             console.log('Item not found for ID:', item_id);
//             return res.status(404).json({ error: 'Item not found' });
//         }

//         // Check if enough items are available
//         if (item.item_count < quantity) {
//             return res.status(400).json({ error: 'Not enough items available for rental' });
//         }

//         const pricePerDay = parseFloat(item.price_per_day); 
//         const deposit = parseFloat(item.deposit); 

//         // Calculate the number of rental days (including the start day)
//         const rentalDays = moment(return_date).diff(moment(rental_date), 'days') + 1;

//         // Calculate subtotal
//         const subtotal = (pricePerDay * rentalDays * quantity) + deposit;

//         // Check if subtotal is a valid number
//         if (isNaN(subtotal)) {
//             console.error("Calculated subtotal is NaN");
//             return res.status(500).json({ error: 'Failed to calculate subtotal' });
//         }

//         console.log("Subtotal:", subtotal); 

//         // Create rental details
//         const result = await RentalDetails.createRentalDetails({
//             item_id,
//             quantity,
//             rental_date,
//             return_date,
//             subtotal,
//         });

//         // Decrement item_count after successful rental creation
//         await Item.updateItem(item_id, { item_count: item.item_count - quantity }); // Update item_count

//         res.status(201).json({
//             message: 'Rental details created successfully', 
//             rental_item_id: result.insertId,
//             subtotal, 
//         });
//     } catch (err) {
//         console.error('Error creating rental details:', err);
//         res.status(500).json({ error: 'Failed to create rental details' });
//     }
// };

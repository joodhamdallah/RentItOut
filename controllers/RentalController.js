const Item = require('../models/Item'); 
const RentalDetails = require('../models/Rentaldetails');
const Rentals = require('../models/Rentals');
const Discount = require('../models/Discounts');
const moment = require('moment'); 
const PaymentController = require('../controllers/PaymentController');
const BillController = require('../controllers/BillController'); 
const Users=require('../controllers/UserController');
const sendInvoiceEmail = require('../services/invoiceGenerator');

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

    // Check if the rental_date and return_date are in the future
    if (moment(rental_date).isBefore(moment(), 'day')) {
      return res.status(400).json({ error: 'Rental date must be in the future' });
  }

  if (moment(return_date).isBefore(moment(), 'day')) {
      return res.status(400).json({ error: 'Return date must be in the future' });
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
       // Check if the item has any quantity available at all
       if (itemDetails.item_count === 0) {
        return res.status(400).json({ error: `All pieces of item ID ${item_id} are currently rented out` });
      }
      // Check if there is enough quantity available for the rental
      if (itemDetails.item_count < quantity) {
        return res.status(400).json({ error: `Not enough quantity available for item ID ${item_id}. Available: ${itemDetails.item_count}` });
      }

      const pricePerDay = parseFloat(itemDetails.price_per_day);
      const deposit = parseFloat(itemDetails.deposit);
      // Calculate subtotal for the item
      const rentalDays = moment(return_date).diff(moment(rental_date), 'days') + 1;
      const subtotal = parseFloat(((pricePerDay * rentalDays * quantity) + deposit).toFixed(3));
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

      const total = parseFloat(detailedCart.reduce((sum, item) => sum + item.subtotal, 0));
      const checkoutLink = 'http://localhost:3000/checkout/logistics'; // Replace with your actual checkout URL

      // Check if the user is authenticated (using token or session)
      const isAuthenticated = req.userId; 
      const logisticOptions = 'Delivery, Pickup';
      const message = isAuthenticated 
      ? `You can proceed with checkout by visiting ${checkoutLink} to provide shipping and payment details. Available logistic options: ${logisticOptions}`
      : `If you want to complete the process, please log in or sign up and follow the link to provide shipping and payment details: ${checkoutLink}.                                       **Available logistic options: ${logisticOptions} `
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

  //Take the desired logstic type from user
  static async collectLogisticsDetails(req, res) {
    const { logistic_type } = req.body;
  
    if (!logistic_type) {
      return res.status(400).json({ error: 'Logistic type is required' });
    }
  // List of allowed logistic types
  const allowedLogisticTypes = ['Delivery', 'Pickup'];

  // Validate the provided logistic type
  if (!allowedLogisticTypes.includes(logistic_type)) {
    return res.status(400).json({ error: `Invalid logistic type. Please choose a valid type: ${allowedLogisticTypes}` });
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
  
  //Take the desired payment type from
  static async collectPaymentDetails(req, res) {
    const { payment_method } = req.body;
    const paymentMethods = ['Credit Card', 'PayPal', 'Cash'];

    if (!payment_method) {
        return res.status(400).json({ error: 'Payment method is required, Choose from available payment methods: ${paymentMethods} ' });
    }

    if (!paymentMethods.includes(payment_method)) {
        return res.status(400).json({ error: 'Invalid payment method. Please choose a valid method. Available payment methods: ${paymentMethods}' });
    }

    try {
        // Use the controller to get the `pay_id`
        const pay_id = await PaymentController.getPaymentByMethod(payment_method);

        if (!pay_id) {
            return res.status(404).json({ error: `Payment ID for ${payment_method} not found.` });
        }

        if (payment_method === 'Cash') {
            // Direct confirmation for cash payments
            req.session.checkoutDetails = { ...req.session.checkoutDetails, payment_method, pay_id };
            return res.status(200).json({ message: 'Cash payment chosen. Proceeding directly to order confirmation.', pay_id });
        } else {
          req.session.checkoutDetails = {
            ...req.session.checkoutDetails,
            payment_method,
            pay_id,
        };
          // Initiate payment for other methods
            const paymentInitiationResponse = await PaymentController.initiatePayment(req, res);
            if (paymentInitiationResponse.error) {
              console.error('Error initiating payment:', paymentInitiationResponse.error);
              if (!res.headersSent) {
                  return res.status(500).json({ error: paymentInitiationResponse.error });
              }         
           }

          if (!res.headersSent) {
              return res.status(200).json(paymentInitiationResponse);
          }
        }
    } catch (err) {
          console.error('Error collecting payment details:', err);
        if (!res.headersSent) {
            return res.status(500).json({ error: 'Failed to process payment details' });
        }
    }
  }
  

  //Determine the discount type
  static async determineDiscount(userId, rentalDetails) {
    try {
      // Get all discounts
      const discounts = await Discount.getAllDiscounts();
      
      let applicableDiscount = null;

      // Check if this is the user's first rental
      const userRentals = await Rentals.getNumberOfUserRentals(userId);
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


   //Confirm and store the complete rental process with discount logic
   static async confirmCheckout(req, res) {
    const userId = req.userId;

    if (!req.session.cart || req.session.cart.length === 0) {
        return res.status(400).json({ error: 'Cart is empty. Please add items to the cart before checkout' });
    }

    const { logistic_type, pay_id ,payment_method} = req.session.checkoutDetails || {};

    console.log("paaaaaaaay id= "+pay_id);
    if (!logistic_type || !pay_id) {
        return res.status(400).json({ error: 'Logistic type and payment method are required for confirmation' });
    }

    try {
        const cartItems = req.session.cart;
        const discountId = await RentalController.determineDiscount(userId, cartItems);
        const rentalId = await Rentals.createRental(userId, logistic_type, discountId);

        for (const item of cartItems) {
          const itemDetails = await Item.getItemById(item.item_id);
        
          if (!itemDetails) {
            console.error(`Item with ID ${item.item_id} not found.`);
            return res.status(404).json({ error: `Item with ID ${item.item_id} not found.` });
        }
        // Ensure `item_count` is valid before updating
        const newCount = itemDetails.item_count - item.quantity;
        if (newCount < 0) {
        console.error(`Not enough stock for item ID ${item.item_id}. Available: ${itemDetails.item_count}`);
        return res.status(400).json({ error: `Not enough stock for item ID ${item.item_id}` });
       }

        // Update the item count in the database
       await Item.updateItem(item.item_id, { item_count: newCount });

            await RentalDetails.createRentalDetails({
                rental_id: rentalId,
                item_id: item.item_id,
                quantity: item.quantity,
                rental_date: item.rental_date,
                return_date: item.return_date,
                subtotal: item.subtotal
            });
            console.log("Updating item count:");
           console.log("Current item count:", itemDetails.item_count);
           console.log("Quantity being subtracted:", item.quantity);

        }
       // Retrieve the total price before discount from RentalDetails table
        const priceBeforeDiscount = await RentalDetails.getTotalPriceBeforeDiscount(rentalId);

        // Retrieve discount details using the discount ID
        const discountDetails = discountId ? await Discount.getDiscountById(discountId) : null;

        // Call the BillsController to create a bill
        const bill = await BillController.createBillEntry(req, res, rentalId, priceBeforeDiscount, pay_id, discountDetails, logistic_type);
        if (!bill || !bill.bill_id) {
            return res.status(500).json({ error: 'Failed to create bill' });
        }
          // Retrieve user details before sending email
          const user = await Users.getUserById(userId);    
 
     //await sendRentalConfirmationEmail(user, rentalId, logistic_type, { ...bill, payment_method}, cartItems, discountDetails);    
     await sendInvoiceEmail(user, rentalId, logistic_type, bill, cartItems, discountDetails, payment_method);

        req.session.cart = [];
        req.session.checkoutDetails = null;

        res.status(201).json({ message: 'Checkout confirmed and stored successfully, Rental confirmation email sent to your email!', rentalId, bill });
    } catch (err) {
        console.error('Error confirming checkout:', err);
        res.status(500).json({ error: 'Failed to confirm and store the checkout process' });
    }
 }

 //not useeeed
 static async getAllRentals(req, res) {
  try {
    const rentals = await Rentals.getAllRentals();
    res.status(200).json(rentals);
  } catch (err) {
    console.error('Error retrieving all rentals:', err);
    res.status(500).json({ error: 'Failed to retrieve all rentals' });
  }
}


// Get the number of rentals for a user
//it doesnt have a specific route, only used to determine discount percentage
static async getNumberOfUserRentals(req, res) {
  const userId = req.userId;

  try {
    const rentalCount = await Rentals.getNumberOfUserRentals(userId);
    res.status(200).json({ userId, rentalCount });
  } catch (err) {
    console.error('Error retrieving rental count:', err);
    res.status(500).json({ error: 'Failed to retrieve rental count' });
  }
}

  // Get all rentals with detailed user and item information
  static async getAllRentalsWithInfo(req, res) {
    try {
      const rentalDetails = await Rentals.getAllRentalsWithInfo();
      res.status(200).json(rentalDetails);
    } catch (err) {
      console.error('Error retrieving detailed rental information:', err);
      res.status(500).json({ error: 'Failed to retrieve detailed rental information' });
    }
  }

   // Controller method to get rental details by rental ID
   static async getRentalDetailsByRentalId(req, res) {
    const { rentalId } = req.params;

    console.log('rentai id='+rentalId);
    try {
      const results = await Rentals.getRentalDetailsByRentalId(rentalId);

      if (results.length === 0) {
        return res.status(404).json({ message: 'Rental not found' });
      }

      // Structure the response in the controller
      const rental = {
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

      res.status(200).json(rental);
    } catch (err) {
      console.error('Error in getRentalDetailsByRentalId:', err);
      res.status(500).json({ error: 'Failed to retrieve rental details' });
    }
  }

  // Controller method to delete a rental by ID
  static async deleteRental(req, res) {
    const { rentalId } = req.params;

    try {
        // Call the model method to delete the rental and related data
        const result = await Rentals.deleteRentalById(rentalId);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Rental not found or already deleted' });
        }

        res.status(200).json({ message: 'Rental deleted successfully' });
    } catch (err) {
        console.error('Error deleting rental:', err);
        res.status(500).json({ error: 'Failed to delete rental' });
    }
}

//get rentals for a user who's logged in
static async getUserRentalsWithDetails(req, res) {
  // Extract userId from the cookie
  const userId = req.userId;

  if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
      // Call the model method to fetch rentals with all details for the user
      const rentals = await Rentals.getUserRentalsWithDetails(userId);

      if (rentals.length === 0) {
          return res.status(404).json({ message: 'No rentals found for this user' });
      }

      // Structure the rentals into a nested format
      const formattedRentals = rentals.reduce((acc, item) => {
          // Find or create the rental entry
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

          // Add item details to the rental's items array
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

      res.status(200).json(formattedRentals);
  } catch (err) {
      console.error('Error retrieving user rentals with details:', err);
      res.status(500).json({ error: 'Failed to retrieve user rentals with details' });
  }

  
  


 }
}

  module.exports = RentalController;
 


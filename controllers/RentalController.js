// controllers/RentalController.js
const CartService = require('../services/Rentals/CartService');
const LogisticsService = require('../services/Rentals/LogisticsService');
const PaymentService = require('../services/Payments/PaymentService');
const DiscountService = require('../services/Discounts/DiscountService');
const BillingService = require('../services/Bills/BillingService');
const Users = require('../controllers/UserController');
const Rentals=require('../models/Rentals');
const RentalService = require('../services/Rentals/RentalService');
const RentalDetailsService=require('../services/Rentals/RentalDetailsService');

class RentalController {
  static async addToCart(req, res) {
        const { item_id, quantity, rental_date, return_date } = req.body;

        try {
            req.session.cart = req.session.cart || [];
            const result = await CartService.addItemToCart(item_id, quantity, rental_date, return_date, req.session.cart);

            if (!result.success) {
                return res.status(400).json({ error: result.message });
            }

            res.status(200).json({ message: result.message });
        } catch (error) {
            console.error('Error adding item to cart:', error);
            res.status(500).json({ error: 'Failed to add item to cart' });
        }
    }

    static async getCart(req, res) {
        try {
            const { detailedCart, total } = await CartService.getCartDetails(req.session.cart || []);
            res.status(200).json({ cart: detailedCart, total });
        } catch (error) {
            console.error('Error retrieving cart:', error);
            res.status(500).json({ error: 'Failed to retrieve cart details' });
        }
    }

    static async collectLogisticsDetails(req, res) {
        try {
            LogisticsService.validateLogisticType(req.body.logistic_type);
            req.session.checkoutDetails = { ...req.session.checkoutDetails, logistic_type: req.body.logistic_type };
            res.status(200).json({ message: 'Logistics details received.' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async collectPaymentDetails(req, res) {
        try {
            const pay_id = await PaymentService.validateAndStorePaymentDetails(req.body.payment_method, req);
            res.status(200).json({ message: 'Payment method collected.', pay_id });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async confirmCheckout(req, res) {
      const userId = req.userId;
      
      // Check if all checkout details are present
      if (!req.session.cart || !req.session.checkoutDetails?.logistic_type || !req.session.checkoutDetails?.pay_id) {
          return res.status(400).json({ error: 'Incomplete checkout details' });
      }

      try {
        const user = await Users.getUserById(userId);

        if (!user) throw new Error('User not found');
        console.log(`User fetched: ${user.email}`);

        // Step 2: Determine discount ID
        const discountId = await DiscountService.determineDiscount(userId, req.session.cart, Rentals.getUserRentals);
        console.log(`Discount ID determined: ${discountId}`);

        // Step 3: Create Rental entry
        const rentalId = await Rentals.createRental(userId, req.session.checkoutDetails.logistic_type, discountId);
        console.log(`Rental created with ID: ${rentalId}`);

        // Step 4: Create Rental Details for each cart item
        await RentalDetailsService.createRentalDetails(rentalId, req.session.cart);
        console.log(`Rental details created for rental ID: ${rentalId}`);

        // Step 5: Create Bill entry and send invoice
        const bill = await BillingService.createBillAndSendInvoice(
            req,
            user,
            rentalId,
            req.session.cart,
            discountId,
            req.session.checkoutDetails.payment_method
        );
        console.log(`Bill created with ID: ${bill.bill_id}`);


          req.session.cart = [];
          req.session.checkoutDetails = null;
          res.status(201).json({ message: 'Checkout confirmed', rentalId, bill });
      } catch (error) {
          console.error('Error confirming checkout:', error);
          res.status(500).json({ error: 'Failed to confirm checkout' });
      }
  }   
  // Get rentals with details for the logged-in user
  static async getUserRentalsWithDetails(req, res) {
      const userId = req.userId;

      if (!userId) {
          return res.status(401).json({ error: 'User not authenticated' });
      }

      try {
          const rentals = await RentalService.getUserRentalsWithDetails(userId);
          res.status(200).json(rentals);
      } catch (error) {
          console.error('Error retrieving user rentals:', error);
          res.status(500).json({ error: error.message });
      }
  }

  // Admin: Get all rentals with basic info
  static async getAllRentalsWithInfo(req, res) {
      try {
          const rentals = await RentalService.getAllRentalsWithInfo();
          res.status(200).json(rentals);
      } catch (error) {
          console.error('Error retrieving all rentals info:', error);
          res.status(500).json({ error: error.message });
      }
  }

  // Admin: Get rental details by rental ID
  static async getRentalDetailsByRentalId(req, res) {
      const { rentalId } = req.params;

      try {
          const rental = await RentalService.getRentalDetailsByRentalId(rentalId);
          res.status(200).json(rental);
      } catch (error) {
          console.error('Error retrieving rental details:', error);
          res.status(500).json({ error: error.message });
      }
  }

  // Admin: Delete rental by ID
  static async deleteRental(req, res) {
      const { rentalId } = req.params;

      try {
          const result = await RentalService.deleteRentalById(rentalId);
          res.status(200).json(result);
      } catch (error) {
          console.error('Error deleting rental:', error);
          res.status(500).json({ error: error.message });
      }
  }
  
}

module.exports = RentalController;

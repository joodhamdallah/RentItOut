const axios = require("axios");
const moment = require("moment");
const geolib = require("geolib");
const BillController = require("../../controllers/BillController");
const Discount = require("../../models/Discounts");
const sendInvoiceEmail = require("./InvoiceGenerator");

class BillingService {
    static async createBillAndSendInvoice(req, user, rentalId, cartItems, discountId, payment_method) {
        try {
            const priceBeforeDiscount = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
            const discountDetails = await this.getDiscountDetails(discountId);
            const discountPercentage = discountDetails?.discount_percentage || 0;
            const discountDescription = discountDetails?.discount_name || 'No Discount';

            const priceAfterDiscount = parseFloat((priceBeforeDiscount * (1 - discountPercentage / 100)).toFixed(2));
            let shippingCost = 0;

            if (req.session.checkoutDetails?.logistic_type === 'Delivery') {
                const { pickupLocation, userAddress } = req.session.checkoutDetails;

                if (pickupLocation && userAddress) {
                    const straightLineDistance = geolib.getDistance(
                        { latitude: pickupLocation.lat, longitude: pickupLocation.lng },
                        { latitude: userAddress.lat, longitude: userAddress.lng }
                    );
                    
                    console.log(`Straight-line distance: ${straightLineDistance / 1000} km`);

                    try {
                        // Attempt to calculate the driving distance
                        const response = await axios.get("https://api.openrouteservice.org/v2/directions/driving-car", {
                            params: {
                                api_key: "5b3ce3597851110001cf6248a730afe508174e86a1ba16100e27a1a4", // Replace with your actual API key
                                start: `${pickupLocation.lng},${pickupLocation.lat}`,
                                end: `${userAddress.lng},${userAddress.lat}`
                            }
                        });

                        if (response.data.routes && response.data.routes.length > 0) {
                            const drivingDistance = response.data.routes[0].summary.distance;
                            shippingCost = this.calculateShippingCost(drivingDistance);
                        } else {
                            console.warn("No driving route found. Using straight-line distance for shipping cost.");
                            shippingCost = this.calculateShippingCost(straightLineDistance,true);
                        }
                    } catch (error) {
                        console.error("Error in OpenRouteService request:", error.response?.data || error.message);
                        console.warn("Using straight-line distance for shipping cost due to routing failure.");
                        shippingCost = this.calculateShippingCost(straightLineDistance,true);
                    }
                } else {
                    throw new Error("Missing coordinates for delivery locations");
                }
            }

            const totalPriceToPay = parseFloat((priceAfterDiscount + shippingCost).toFixed(2));
            const billDate = moment().format("YYYY-MM-DD");

            const billData = {
                rental_id: rentalId,
                pay_id: req.session.checkoutDetails?.pay_id,
                price_before_discount: priceBeforeDiscount,
                discount_percentage: discountPercentage,
                discount_description: discountDescription,
                price_after_discount: priceAfterDiscount,
                shipping_cost: shippingCost,
                bill_date: billDate,
                total_price_to_pay: totalPriceToPay,
                user_id: user.user_id
            };

            // Create a new bill entry in the database
            const bill = await BillController.createBillEntry(billData);

            // Send the invoice to the user
            await sendInvoiceEmail(user, rentalId, req.session.checkoutDetails?.logistic_type, bill, cartItems, discountDetails, payment_method);

            return bill;
        } catch (error) {
            console.error("Error creating bill and sending invoice:", error);
            throw new Error("Failed to create and send bill");
        }
    }

    static calculateShippingCost(distance, isStraightLine = true) {
        const ratePerKm = 5; // Example rate per kilometer
        
        // Adjust the distance if it's a straight-line estimation
        if (isStraightLine) {
            const multiplier = 1.4; // Multiplier for straight-line to approximate driving distance
            const extraDistanceMeters = 2000; // Add 2 km to the estimated distance
            distance = distance * multiplier + extraDistanceMeters;
        }
        
        return (distance / 1000) * ratePerKm;
    }

    // Get discount details for the given discount ID
    static async getDiscountDetails(discountId) {
        if (!discountId) return null;
        return await Discount.getDiscountById(discountId);
    }
}

module.exports = BillingService;

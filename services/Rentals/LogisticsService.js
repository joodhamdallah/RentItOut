// services/LogisticsService.js
const axios = require("axios");
class LogisticsService {
    static validateLogisticType(logistic_type) {
        const allowedLogisticTypes = ['Delivery', 'Pickup'];
        if (!allowedLogisticTypes.includes(logistic_type)) {
            throw new Error(`Invalid logistic type. Allowed types: ${allowedLogisticTypes.join(', ')}`);
        }
    }

    static async geocodeAddress(address) {
        try {
            const response = await axios.get("https://nominatim.openstreetmap.org/search", {
                params: {
                    q: address,
                    format: "json",
                    addressdetails: 1,
                    limit: 1
                },
                headers: {
                    'User-Agent': 'RentItOutApp/1.0 (contact@example.com)', // Replace with your app name and contact
                }
            });

            if (response.data.length === 0) {
                throw new Error("Address not found");
            }

            const { lat, lon } = response.data[0];
            return { lat: parseFloat(lat), lng: parseFloat(lon) };
        } catch (error) {
            console.error("Error geocoding address:", error);
            throw new Error("Failed to geocode address");
        }
    }
}

module.exports = LogisticsService;

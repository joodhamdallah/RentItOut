// services/LogisticsService.js
class LogisticsService {
    static validateLogisticType(logistic_type) {
        const allowedLogisticTypes = ['Delivery', 'Pickup'];
        if (!allowedLogisticTypes.includes(logistic_type)) {
            throw new Error(`Invalid logistic type. Allowed types: ${allowedLogisticTypes.join(', ')}`);
        }
    }
}

module.exports = LogisticsService;

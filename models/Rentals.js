const db = require('../config/database');

class RentalsModel {
  static createRental(userId, logisticType, discountId) {
    return new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO Rentals (user_id, logistic_type, discount_id) VALUES (?, ?, ?)',
        [userId, logisticType, discountId],
        (err, result) => {
          if (err) {
            return reject(new Error('Failed to create rental: ' + err.message));
          }
          resolve(result.insertId); 
        }
      );
    });
  }
}

module.exports = RentalsModel;
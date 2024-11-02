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
  // Get all rentals by a user
  static getUserRentals(userId) {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM Rentals WHERE user_id = ?',
        [userId],
        (err, results) => {
          if (err) {
            return reject(new Error('Failed to retrieve user rentals: ' + err.message));
          }
          resolve(results);
        }
      );
    });
  }
}

module.exports = RentalsModel;
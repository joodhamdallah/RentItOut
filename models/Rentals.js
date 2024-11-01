const db = require('../config/database');

class RentalsModel {
  static createRental(userId, logisticType) {
    return new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO Rentals (user_id, logistic_type) VALUES (?, ?)',
        [userId, logisticType],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.insertId); // Return the new rental_id
        }
      );
    });
  }
}

module.exports = RentalsModel;

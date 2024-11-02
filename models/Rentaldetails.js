const db = require('../config/database');

class RentalDetailsModel {

  static createRentalDetails(data) {
    return new Promise((resolve, reject) => {
      const { item_id, quantity, rental_date, return_date, subtotal } = data;
      db.query(
        'INSERT INTO Rental_details (item_id, quantity, rental_date, return_date, subtotal) VALUES (?, ?, ?, ?, ?)',
        [item_id, quantity, rental_date, return_date, subtotal],
        (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        }
      );
    });
  }
}

module.exports = RentalDetailsModel;

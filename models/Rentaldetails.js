const db = require('../config/database');

class RentalDetailsModel {

  static createRentalDetails(data) {
    return new Promise((resolve, reject) => {
      const {rental_id, item_id, quantity, rental_date, return_date, subtotal } = data;
      db.query(
        'INSERT INTO Rental_details (rental_id, item_id, quantity, rental_date, return_date, subtotal) VALUES (?, ?, ?, ?, ?, ?)',
        [rental_id,item_id, quantity, rental_date, return_date, subtotal],
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

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
     //  method to validate the association between rental, item, and user
     static findByRentalAndItem(userId, rental_id, item_id) {
      return new Promise((resolve, reject) => {
          const query = `
              SELECT rd.*
              FROM Rental_details rd
              JOIN Rentals r ON rd.rental_id = r.rental_id
              WHERE r.user_id = ? AND rd.rental_id = ? AND rd.item_id = ?
          `;
          db.query(query, [userId, rental_id, item_id], (err, results) => {
              if (err) {
                  return reject(err);
              }
              resolve(results.length > 0 ? results[0] : null);
          });
      });
  }
}


module.exports = RentalDetailsModel;

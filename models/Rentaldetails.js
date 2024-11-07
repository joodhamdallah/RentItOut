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

  static async checkAvailability(item_id, rental_date, return_date) {
    const query = `
      SELECT * FROM Rental_details 
      WHERE item_id = ? 
      AND (
        (rental_date BETWEEN ? AND ?)
        OR (return_date BETWEEN ? AND ?)
        OR (? BETWEEN rental_date AND return_date)
        OR (? BETWEEN rental_date AND return_date)
      )
    `;
    const [results] = await db.query(query, [item_id, rental_date, return_date, rental_date, return_date, rental_date, return_date]);
    return results;
  }

    static getTotalPriceBeforeDiscount(rentalId) {
        return new Promise((resolve, reject) => {
            const query = `SELECT SUM(subtotal) AS price_before_discount FROM Rental_details WHERE rental_id = ?`;
            db.query(query, [rentalId], (err, results) => {
                if (err) {
                    console.error('Error retrieving total price before discount:', err);
                    return reject(err);
                }
                resolve(results[0].price_before_discount || 0);
            });
        });
    }
    static async getRentalsDueOn(date) {
      return new Promise((resolve, reject) => {
          const query = `
              SELECT rd.rental_id, rd.item_id, rd.return_date, u.email AS user_email, 
                     CONCAT(u.first_name, ' ', u.last_name) AS user_name, 
                     i.item_name, i.price_per_day
              FROM Rental_details rd
              JOIN Rentals r ON rd.rental_id = r.rental_id
              JOIN Users u ON r.user_id = u.user_id
              JOIN Items i ON rd.item_id = i.item_id
              WHERE rd.return_date = ?
          `;
          db.query(query, [date], (err, results) => {
              if (err) {
                  return reject(new Error('Failed to retrieve rentals due tomorrow: ' + err.message));
              }
              resolve(results);
          });
      });
  }
  

}
module.exports = RentalDetailsModel;

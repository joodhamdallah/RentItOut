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
    // Get all rentals
    static getAllRentals() {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Rentals', [], (err, results) => {
          if (err) {
            return reject(new Error('Failed to retrieve all rentals: ' + err.message));
          }
          resolve(results);
        });
      });
    }

    static getAllRentalsWithInfo() {
      return new Promise((resolve, reject) => {
        const query = `
          SELECT 
            Rentals.rental_id,
            Rentals.user_id,
            Rentals.logistic_type,
            Rentals.discount_id,
            Discounts.discount_name,
            Users.first_name,
            Users.last_name,
            Users.email,
            Users.address
          FROM 
            Rentals
          JOIN 
            Users ON Rentals.user_id = Users.user_id
          LEFT JOIN 
            Discounts ON Rentals.discount_id = Discounts.discount_id
        `;
        db.query(query, [], (err, results) => {
          if (err) {
            return reject(new Error('Failed to retrieve rental details: ' + err.message));
          }
       // Append URL to each rental
       const baseUrl = 'http://localhost:3000/api/rentals/details'; // Replace with actual base URL
       results.forEach(rental => {
        rental.rentail_details_url = `${baseUrl}/${rental.rental_id}`;
       });

          resolve(results);
        });
      });
    }
    
    static getRentalDetailsByRentalId(rentalId) {
      console.log("from model="+rentalId);
      return new Promise((resolve, reject) => {
        const query = `
          SELECT 
  Rentals.rental_id,
  Rentals.user_id,
  Rentals.logistic_type,
  Discounts.discount_name,
  Users.email,
  Payments.payment_method AS payment_method,
  Rental_details.item_id,
  Items.item_name,
  Items.deposit,
  Items.price_per_day,
  Rental_details.quantity,
  Rental_details.rental_date,
  Rental_details.return_date,
  Rental_details.subtotal
FROM 
  Rentals
JOIN 
  Users ON Rentals.user_id = Users.user_id
LEFT JOIN 
  Discounts ON Rentals.discount_id = Discounts.discount_id
LEFT JOIN 
  Rental_details ON Rentals.rental_id = Rental_details.rental_id
LEFT JOIN 
  Items ON Rental_details.item_id = Items.item_id
LEFT JOIN 
  Bills ON Rentals.rental_id = Bills.rental_id
LEFT JOIN 
  Payments ON Bills.pay_id = Payments.pay_id
WHERE 
  Rentals.rental_id = ?

        `;
        db.query(query, [rentalId], (err, results) => {
          if (err) {
            return reject(new Error('Failed to retrieve rental details: ' + err.message));
          }
          resolve(results);
        });
      });
    }

    static deleteRentalById(rentalId) {
      return new Promise((resolve, reject) => {
          // Delete associated records in RentalDetails before deleting the rental itself
          const deleteRentalDetails = `DELETE FROM Rental_details WHERE rental_id = ?`;
          const deleteRental = `DELETE FROM Rentals WHERE rental_id = ?`;

          db.beginTransaction((err) => {
              if (err) {
                  return reject(new Error('Failed to start transaction: ' + err.message));
              }

              // Delete from Rental_details
              db.query(deleteRentalDetails, [rentalId], (err, results) => {
                  if (err) {
                      return db.rollback(() => reject(new Error('Failed to delete rental details: ' + err.message)));
                  }

                  // Finally, delete from Rentals
                  db.query(deleteRental, [rentalId], (err, results) => {
                      if (err) {
                          return db.rollback(() => reject(new Error('Failed to delete rental: ' + err.message)));
                      }

                      db.commit((err) => {
                          if (err) {
                              return db.rollback(() => reject(new Error('Failed to commit transaction: ' + err.message)));
                          }
                          resolve(results);
                      });
                  });
              });
          });
      });
  }


  static getUserRentalsWithDetails(userId) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                Rentals.rental_id,
                Rentals.user_id,
                Users.email,
                Rentals.logistic_type,
                Discounts.discount_name,
                Payments.payment_method AS payment_method,
                Bills.bill_id,
                Bills.price_before_discount,
                Bills.discount_percentage,
                Bills.discount_description,
                Bills.price_after_discount,
                Bills.shipping_cost,
                Bills.bill_date,
                Bills.total_price_to_pay,
                Rental_details.item_id,
                Items.item_name,
                Items.deposit,
                Items.price_per_day,
                Rental_details.quantity,
                Rental_details.rental_date,
                Rental_details.return_date,
                Rental_details.subtotal
            FROM 
                Rentals
            JOIN 
                Users ON Rentals.user_id = Users.user_id
            LEFT JOIN 
                Discounts ON Rentals.discount_id = Discounts.discount_id
            LEFT JOIN 
                Bills ON Rentals.rental_id = Bills.rental_id
            LEFT JOIN 
                Payments ON Bills.pay_id = Payments.pay_id
            LEFT JOIN 
                Rental_details ON Rentals.rental_id = Rental_details.rental_id
            LEFT JOIN 
                Items ON Rental_details.item_id = Items.item_id
            WHERE 
                Rentals.user_id = ?
        `;

        db.query(query, [userId], (err, results) => {
            if (err) {
                return reject(new Error('Failed to retrieve rentals with details: ' + err.message));
            }
            resolve(results);
        });
    });
}
    
}

module.exports = RentalsModel;
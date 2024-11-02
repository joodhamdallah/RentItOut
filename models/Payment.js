const connection = require('../config/database');

class Payment {
  // Fetch all payment methods
  static getAll(callback) {
    connection.query('SELECT * FROM Payments', (err, results) => {
      callback(err, results);
    });
  }

  // Fetch a payment method by ID
  static getById(id, callback) {
    connection.query('SELECT * FROM Payments WHERE pay_id = ?', [id], (err, result) => {
      callback(err, result);
    });
  }

  // Create a new payment method
  static create(paymentMethod, callback) {
    connection.query('INSERT INTO Payments (payment_method) VALUES (?)', [paymentMethod], (err, result) => {
      callback(err, result);
    });
  }

  // Update an existing payment method
  static update(id, paymentMethod, callback) {
    connection.query('UPDATE Payments SET payment_method = ? WHERE pay_id = ?', [paymentMethod, id], (err, result) => {
      callback(err, result);
    });
  }

  // Delete a payment method
  static delete(id, callback) {
    connection.query('DELETE FROM Payments WHERE pay_id = ?', [id], (err, result) => {
      callback(err, result);
    });
  }
}

module.exports = Payment;

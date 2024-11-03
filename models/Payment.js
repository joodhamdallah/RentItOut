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

  static getPaymentByMethod(payment_method) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT pay_id FROM Payments WHERE payment_method = ?';

        // Print the query and the parameter for debugging
        console.log('Executing query:', query);
        console.log('With parameter:', payment_method);

        connection.query(query, [payment_method], (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return reject(err);
            }

            // Print the results to debug the response from the database
            console.log('Query results:', results);

            if (results.length === 0) {
                console.log('No results found for the provided payment method.');
                return resolve(null);
            }

            // Print the specific record being returned
            console.log('Returning payment record:', results[0]);
            resolve(results[0]);
        });
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

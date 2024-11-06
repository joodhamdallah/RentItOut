const connection = require('../config/database'); // Import the database connection

class Bills {
    // Method to create a new bill entry
    static createBill({ rental_id, pay_id, price_before_discount, discount_percentage, discount_description, price_after_discount, shipping_cost, bill_date, total_price_to_pay, user_id }) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO Bills (rental_id, pay_id, price_before_discount, discount_percentage, discount_description, price_after_discount, shipping_cost, bill_date, total_price_to_pay, user_id) 
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            connection.query(query, [
                rental_id,
                pay_id,
                price_before_discount,
                discount_percentage,
                discount_description,
                price_after_discount,
                shipping_cost,
                bill_date,
                total_price_to_pay,
                user_id
            ], (err, result) => {
                if (err) {
                    console.error('Error inserting bill:', err);
                    return reject(err);
                }
                resolve({ bill_id: result.insertId, rental_id, pay_id, price_before_discount, discount_percentage, discount_description, price_after_discount, shipping_cost, bill_date, total_price_to_pay, user_id });
            });
        });
    }

    // Method to retrieve a bill by its ID
    static getBillById(bill_id) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM Bills WHERE bill_id = ?`;
            connection.query(query, [bill_id], (err, result) => {
                if (err) {
                    console.error('Error retrieving bill:', err);
                    return reject(err);
                }
                if (result.length === 0) {
                    return resolve(null);
                }
                resolve(result[0]);
            });
        });
    }

    // Method to retrieve all bills
    static getAllBills() {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM Bills`;
            connection.query(query, (err, results) => {
                if (err) {
                    console.error('Error retrieving bills:', err);
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
}

module.exports = Bills;

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

    // Method to update a bill by its ID
    static updateBill(bill_id, updateData) {
        return new Promise((resolve, reject) => {
            const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
            const values = [...Object.values(updateData), bill_id];
            const query = `UPDATE Bills SET ${fields} WHERE bill_id = ?`;
            connection.query(query, values, (err, result) => {
                if (err) {
                    console.error('Error updating bill:', err);
                    return reject(err);
                }
                resolve(result.affectedRows > 0); // Returns true if the bill was updated
            });
        });
    }

    // Method to delete a bill by its ID
    static deleteBill(bill_id) {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM Bills WHERE bill_id = ?`;
            connection.query(query, [bill_id], (err, result) => {
                if (err) {
                    console.error('Error deleting bill:', err);
                    return reject(err);
                }
                resolve(result.affectedRows > 0); // Returns true if the bill was deleted
            });
        });
    }

    // Method to retrieve all bills for a specific user by their user ID
    static getUserBills(user_id) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM Bills WHERE user_id = ?`;
            connection.query(query, [user_id], (err, results) => {
                if (err) {
                    console.error('Error retrieving user bills:', err);
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    // Method to retrieve a bill by rental ID
    static getBillByRentalId(rental_id) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM Bills WHERE rental_id = ?`;
            connection.query(query, [rental_id], (err, result) => {
                if (err) {
                    console.error('Error retrieving bill by rental ID:', err);
                    return reject(err);
                }
                if (result.length === 0) {
                    return resolve(null);
                }
                resolve(result[0]);
            });
        });
    }
}

module.exports = Bills;

const connection = require('../config/database');

class DiscountModel {
    static getAllDiscounts() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Discounts';
            connection.query(query, (err, results) => {
                if (err) {
                    return reject(new Error('Failed to retrieve discounts: ' + err.message));
                }
                resolve(results);
            });
        });
    }

    static getDiscountById(discountId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Discounts WHERE discount_id = ?';
            connection.query(query, [discountId], (err, results) => {
                if (err) {
                    return reject(new Error('Failed to retrieve discount: ' + err.message));
                }
                resolve(results.length > 0 ? results[0] : null);
            });
        });
    }

    static createDiscount({ discount_name, discount_percentage, description }) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO Discounts (discount_name, discount_percentage, description) VALUES (?, ?, ?)';
            connection.query(query, [discount_name, discount_percentage, description], (err, results) => {
                if (err) {
                    return reject(new Error('Failed to create discount: ' + err.message));
                }
                resolve({ success: true, id: results.insertId, discount_name, discount_percentage, description });
            });
        });
    }

    static updateDiscount(discountId, data) {
        return new Promise((resolve, reject) => {
            const values = [];
            const fields = [];

            if (data.discount_name !== undefined) {
                fields.push('discount_name = ?');
                values.push(data.discount_name);
            }

            if (data.discount_percentage !== undefined) {
                fields.push('discount_percentage = ?');
                values.push(data.discount_percentage);
            }

            if (data.description !== undefined) {
                fields.push('description = ?');
                values.push(data.description);
            }

            values.push(discountId);

            const query = `UPDATE Discounts SET ${fields.join(', ')} WHERE discount_id = ?`;

            connection.query(query, values, (err, results) => {
                if (err) {
                    return reject(err);
                }
                if (results.affectedRows === 0) {
                    return resolve(null); // Discount not found
                }
                resolve({
                    ...data,
                    discount_id: discountId // Include the discount ID for reference
                });
            });
        });
    }

    static deleteDiscount(discountId) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM Discounts WHERE discount_id = ?';
            connection.query(query, [discountId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results.affectedRows > 0); // Returns true if deletion was successful
            });
        });
    }
}

module.exports = DiscountModel;

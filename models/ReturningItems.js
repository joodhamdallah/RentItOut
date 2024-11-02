const db = require('../config/database');
const mysql = require('mysql2/promise');

class ReturningItemsModel {
    static getAllReturningItems() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Returning_Items';
            db.query(query, (err, results) => {
                if (err) return reject(new Error('Failed to retrieve returning items: ' + err.message));
                resolve(results);
            });
        });
    }

    static getReturningItemById(RItem_id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Returning_Items WHERE RItem_id = ?';
            db.query(query, [RItem_id], (err, results) => {
                if (err) return reject(new Error('Failed to retrieve returning item: ' + err.message));
                resolve(results.length > 0 ? results[0] : null);
            });
        });
    }

    static createReturningItem({ item_name, status_for_item, returned_amount, actual_return_date, rental_item_id, overtime_charge }) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO Returning_Items (item_name, status_for_item, returned_amount, actual_return_date, rental_item_id, overtime_charge) VALUES (?, ?, ?, ?, ?, ?)';
            db.query(query, [item_name, status_for_item, returned_amount, actual_return_date, rental_item_id, overtime_charge], (err, results) => {
                if (err) return reject(new Error('Failed to create returning item: ' + err.message));
                resolve({ success: true, id: results.insertId });
            });
        });
    }

    static updateReturningItem(RItem_id, data) {
        return new Promise((resolve, reject) => {
            const fields = [];
            const values = [];

            if (data.item_name !== undefined) {
                fields.push('item_name = ?');
                values.push(data.item_name);
            }
            if (data.status_for_item !== undefined) {
                fields.push('status_for_item = ?');
                values.push(data.status_for_item);
            }
            if (data.returned_amount !== undefined) {
                fields.push('returned_amount = ?');
                values.push(data.returned_amount);
            }
            if (data.actual_return_date !== undefined) {
                fields.push('actual_return_date = ?');
                values.push(data.actual_return_date);
            }
            if (data.overtime_charge !== undefined) {
                fields.push('overtime_charge = ?');
                values.push(data.overtime_charge);
            }

            values.push(RItem_id);
            const query = `UPDATE Returning_Items SET ${fields.join(', ')} WHERE RItem_id = ?`;

            db.query(query, values, (err, results) => {
                if (err) return reject(new Error('Failed to update returning item: ' + err.message));
                resolve(results.affectedRows > 0);
            });
        });
    }

    static deleteReturningItem(RItem_id) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM Returning_Items WHERE RItem_id = ?';
            db.query(query, [RItem_id], (err, results) => {
                if (err) return reject(new Error('Failed to delete returning item: ' + err.message));
                resolve(results.affectedRows > 0);
            });
        });
    }

    static async createReturnEntry(rentalItemId, statusForItem) {
        return new Promise(async (resolve, reject) => {
            try {
                // Step 1: Get the deposit amount from the item based on rental_item_id
                const [item] = await db.promise().query(
                    'SELECT i.deposit FROM Items i JOIN Rental_details r ON i.item_id = r.item_id WHERE r.rental_item_id = ?',
                    [rentalItemId]
                );

                if (!item) {
                    return reject(new Error('Item not found'));
                }

                const deposit = item.deposit;
                let returnedAmount;

                // Step 2: Determine returned_amount based on status
                switch (statusForItem) {
                    case 'Excellent':
                        returnedAmount = deposit;
                        break;
                    case 'Good':
                        returnedAmount = deposit * 0.7;
                        break;
                    case 'Damaged':
                        returnedAmount = deposit * 0.3;
                        break;
                    case 'Needs Replacement':
                        returnedAmount = 0;
                        break;
                    default:
                        return reject(new Error('Invalid status'));
                }

                // Step 3: Insert return entry into Returning_Items
                const [result] = await db.query(
                    `INSERT INTO Returning_Items (status_for_item, returned_amount, actual_return_date, rental_item_id, overtime_charge) 
                     VALUES (?, ?, NOW(), ?, 0)`,
                    [statusForItem, returnedAmount, rentalItemId]
                );

                resolve({
                    success: true,
                    returnId: result.insertId,
                    returnedAmount,
                    statusForItem
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}



module.exports = ReturningItemsModel;

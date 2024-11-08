const db = require('../config/database');

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

    static createReturningItem({ item_name, status_for_item, returned_amount, actual_return_date, rental_item_id, item_id, overtime_charge }) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO Returning_Items (item_name, status_for_item, returned_amount, actual_return_date, rental_item_id, item_id, overtime_charge) VALUES (?, ?, ?, ?, ?, ?, ?)';
            db.query(query, [item_name, status_for_item, returned_amount, actual_return_date, rental_item_id, item_id, overtime_charge], (err, results) => {
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
    
    static getItemDeposit(item_id) {
        return new Promise((resolve, reject) => {
        const query = 'SELECT deposit FROM Items WHERE item_id = ?';
        db.query(query, [item_id], (err, results) => {
            if (err) return reject(new Error('Failed to retrieve item deposit: ' + err.message));
            resolve(results.length > 0 ? results[0].deposit : null);
        });
    });
    }

    static incrementItemCount(item_id) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE Items 
                SET item_count = item_count + 1 
                WHERE item_id = ?`;
            
            db.query(query, [item_id], (err, results) => {
                if (err) return reject(new Error('Failed to increment item count: ' + err.message));
                resolve(results.affectedRows > 0);
            });
        });
    }

    static getRentalItemAndItemId(RItem_id) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT rental_item_id, item_id 
                FROM Returning_Items 
                WHERE RItem_id = ?`;
            
            db.query(query, [RItem_id], (err, results) => {
                if (err) {
                    console.error('Database Error:', err.message);
                    return reject(new Error('Failed to retrieve rental item and item ID: ' + err.message));
                }
                if (results.length === 0) {
                    console.log('No record found for RItem_id:', RItem_id);
                    return resolve(null); // No matching record
                }
                console.log('Record found for RItem_id:', results[0]);
                resolve(results[0]);
            });
        });
    }
    
    

    static getRentalDetailsAndPrice(rental_item_id, item_id) {
        return new Promise((resolve, reject) => {
            const queryRental = 'SELECT return_date FROM Rental_details WHERE rental_item_id = ?';
            const queryPrice = 'SELECT price_per_day FROM Items WHERE item_id = ?';
    
            db.query(queryRental, [rental_item_id], (err, rentalResults) => {
                if (err) return reject(new Error('Failed to retrieve return_date: ' + err.message));
                if (rentalResults.length === 0) {
                    console.log(`No return_date found for rental_item_id: ${rental_item_id}`);
                    return resolve(null); 
                }
    
                const return_date = rentalResults[0].return_date;
    
                db.query(queryPrice, [item_id], (err, itemResults) => {
                    if (err) return reject(new Error('Failed to retrieve price_per_day: ' + err.message));
                    if (itemResults.length === 0) {
                        console.log(`No price_per_day found for item_id: ${item_id}`);
                        return resolve(null); 
                    }
    
                    const price_per_day = itemResults[0].price_per_day;
                    console.log(`Rental Data found: return_date=${return_date}, price_per_day=${price_per_day}`);
                    resolve({ return_date, price_per_day });
                });
            });
        });
    }
    
    
      
    static updateOvertimeCharge(RItem_id, overtime_charge) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE Returning_Items 
                SET overtime_charge = ? 
                WHERE RItem_id = ?`;
            
            db.query(query, [overtime_charge, RItem_id], (err, results) => {
                if (err) return reject(new Error('Failed to update overtime charge: ' + err.message));
                resolve(results.affectedRows > 0); // Returns true if a row was updated
            });
        });
    }
    

}

module.exports = ReturningItemsModel;

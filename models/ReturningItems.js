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


    // static getRentalDetailsAndPrice(rental_item_id, item_id) {
    //     return new Promise((resolve, reject) => {
    //         const query = `
    //             SELECT r.return_date, i.price_per_day 
    //             FROM Rental_details r 
    //             JOIN Items i ON i.item_id = ? 
    //             WHERE r.rental_item_id = ?`;
    //         db.query(query, [item_id, rental_item_id], (err, results) => {
    //             if (err) return reject(new Error('Failed to retrieve rental details and price: ' + err.message));
    //             resolve(results.length > 0 ? results[0] : null);
    //         });
    //     });
    // }
    
    // static async getRentalDetailsAndPrice(rental_item_id, item_id) {
    //     try {
    //         // Get the return_date from Rental_details
    //         const rentalQuery = 'SELECT return_date FROM Rental_details WHERE rental_item_id = ?';
    //         const rentalResults = await new Promise((resolve, reject) => {
    //             db.query(rentalQuery, [rental_item_id], (err, results) => {
    //                 if (err) return reject(new Error('Failed to retrieve rental details: ' + err.message));
    //                 resolve(results);
    //             });
    //         });
    
    //         if (rentalResults.length === 0) {
    //             throw new Error('Rental details not found');
    //         }
    
    //         const return_date = rentalResults[0].return_date;
    
    //         // Get the price from Items
    //         const itemQuery = 'SELECT price_per_day FROM Items WHERE item_id = ?';
    //         const itemResults = await new Promise((resolve, reject) => {
    //             db.query(itemQuery, [item_id], (err, results) => {
    //                 if (err) return reject(new Error('Failed to retrieve item price: ' + err.message));
    //                 resolve(results);
    //             });
    //         });
    
    //         if (itemResults.length === 0) {
    //             throw new Error('Item not found');
    //         }
    
    //         const price_per_day = itemResults[0].price_per_day;
    
    //         return { return_date, price_per_day };
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    static getRentalDetailsAndPrice(rental_item_id, item_id) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT r.return_date, i.price_per_day 
                FROM Rental_details r 
                JOIN Items i ON i.item_id = r.item_id 
                WHERE r.rental_item_id = ? AND i.item_id = ?`;
            db.query(query, [rental_item_id, item_id], (err, results) => {
                if (err) return reject(new Error('Failed to retrieve rental details and price: ' + err.message));
                if (results.length === 0) {
                    return resolve(null); // Return null if no results found
                }
                resolve(results[0]); // Resolve with the first result
            });
        });
    }
    
      
    static updateOvertimeCharge(rental_item_id, item_id, overtime_charge) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE Returning_Items 
                SET overtime_charge = ? 
                WHERE rental_item_id = ? AND item_id = ?`;
            
            db.query(query, [overtime_charge, rental_item_id, item_id], (err, results) => {
                if (err) return reject(new Error('Failed to update overtime charge: ' + err.message));
                resolve(results.affectedRows > 0); // Returns true if a row was updated
            });
        });
    }

}

module.exports = ReturningItemsModel;

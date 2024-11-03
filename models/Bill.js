const db = require('../config/database');

class Bills {
    // // Method to create a new bill entry
    // static createBill({ total_price, rental_id, pay_id }) {
    //     return new Promise((resolve, reject) => {
           
    //         const query = 'INSERT INTO Bills (total_price, rental_id, pay_id) VALUES (?, ?, ?)';
    //         db.query(query, [total_price, rental_id, pay_id], (err, result) => {
    //             if (err) {
    //                 console.error('Error inserting bill:', err);
    //                 return reject(err);
    //             }
    //             resolve({ bill_id: result.insertId, total_price, rental_id, pay_id });
    //         });
    //     });
    // }

    // // Method to retrieve a bill by its ID
    // static getBillById(bill_id) {
    //     return new Promise((resolve, reject) => {
    //         const query = 'SELECT * FROM Bills WHERE bill_id = ?';
    //         db.query(query, [bill_id], (err, result) => {
    //             if (err) {
    //                 console.error('Error retrieving bill:', err);
    //                 return reject(err);
    //             }
    //             if (result.length === 0) {
    //                 return resolve(null);
    //             }
    //             resolve(result[0]);
    //         });
    //     });
    // }

    // // Method to retrieve all bills (optional)
    // static getAllBills() {
    //     return new Promise((resolve, reject) => {
    //         const query = 'SELECT * FROM Bills';
    //         db.query(query, (err, results) => {
    //             if (err) {
    //                 console.error('Error retrieving all bills:', err);
    //                 return reject(err);
    //             }
    //             resolve(results);
    //         });
    //     });
    // }
}

module.exports = Bills;

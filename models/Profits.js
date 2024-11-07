const db = require('../config/database');


class ProfitsModel {
    // Function to calculate platform income and vendor profit, then insert into the profits table
    static async calculateAndInsertProfit(item_id) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT price_per_day FROM Items WHERE item_id = ?;
            `;
            
            db.query(query, [item_id], (err, results) => {
                if (err) return reject(new Error('Failed to retrieve item price: ' + err.message));
                
                if (results.length === 0) {
                    return reject(new Error('Item not found'));
                }
                
                const price_per_day = parseFloat(results[0].price_per_day);
                const platform_percentage = 0.15; // 15% platform income
               // const vendor_percentage = 0.10;  // 10% for vendor net profit
                
                const platform_income_per_item = price_per_day * platform_percentage;
                const vendor_net_profit = price_per_day - platform_income_per_item
                
                const insertQuery = `
                    INSERT INTO profits (item_id, platform_income_per_item, vendor_net_profit)
                    VALUES (?, ?, ?);
                `;
                
                db.query(insertQuery, [item_id, platform_income_per_item, vendor_net_profit], (err, results) => {
                    if (err) return reject(new Error('Failed to insert profit data: ' + err.message));
                    resolve({ success: true, message: 'Profit data inserted successfully' });
                });
            });
        });
    }

    static getProfits() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT p.id, p.platform_income_per_item, p.vendor_net_profit, i.item_id
                FROM Profits AS p
                JOIN Items AS i ON p.item_id = i.item_id
            `;
            db.query(query, (err, results) => {
                if (err) return reject(new Error('Failed to retrieve profits: ' + err.message));
                resolve(results);
            });
        });
    }


    static getVendorProfitsByUser(user_id) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT p.vendor_net_profit, i.item_name, i.item_id
                FROM Profits AS p
                JOIN Items AS i ON p.item_id = i.item_id
                WHERE i.user_id = ?
            `;
            db.query(query, [user_id], (err, results) => {
                if (err) return reject(new Error('Failed to retrieve vendor profits: ' + err.message));
                resolve(results);
            });
        });
    }
}




module.exports = ProfitsModel;

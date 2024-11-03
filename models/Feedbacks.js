const connection = require('../config/database');

class feedbackModeel {
    // Create a new feedback entry
    static create(rental_id, user_id, comment, rating, item_id) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO Feedbacks (rental_id, user_id, comment, rating, item_id) VALUES (?, ?, ?, ?, ?)`;
            connection.query(query, [rental_id, user_id, comment, rating, item_id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result.insertId);
            });
        });
    }

    //list all feedbacks 
    static getAll() {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM Feedbacks`;
            connection.query(query, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }


    // Fetch all feedbacks for a specific item
    static getByItem(itemId) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM Feedbacks WHERE item_id = ?`;
            connection.query(query, [itemId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    // Fetch all feedbacks from a specific user
    static getByUser(userId) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM Feedbacks WHERE user_id = ?`;
            connection.query(query, [userId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    // Get most rented items based on feedback count

    static getMostRentedItems(limit = 10) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT item_id, COUNT(*) AS feedback_count
                FROM Feedbacks
                GROUP BY item_id
                ORDER BY feedback_count DESC
                LIMIT ?`;
            connection.query(query, [limit], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    // Update an existing feedback entry
    static update(feedbackId, comment, rating) {
        return new Promise((resolve, reject) => {
            const query = `UPDATE Feedbacks SET comment = ?, rating = ? WHERE feedback_id = ?`;
            connection.query(query, [comment, rating, feedbackId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                if (results.affectedRows === 0) {
                    return reject(new Error('Feedback not found'));
                }
                resolve(results);
            });
        });
    }


    // Delete a feedback entry
    static delete(feedbackId) {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM Feedbacks WHERE feedback_id = ?`;
            connection.query(query, [feedbackId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                if (results.affectedRows === 0) {
                    return reject(new Error('Feedback not found'));
                }
                resolve(results);
            });
        });
    }
}

module.exports = feedbackModeel;

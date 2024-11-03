const connection = require('../config/database');

class FeedbackModel {
    static getAllFeedbacks() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Feedbacks';
            connection.query(query, (err, results) => {
                if (err) {
                    return reject(new Error('Failed to retrieve feedbacks: ' + err.message));
                }
                resolve(results);
            });
        });
    }

    static getFeedbackById(feedbackId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Feedbacks WHERE feedback_id = ?';
            connection.query(query, [feedbackId], (err, results) => {
                if (err) {
                    return reject(new Error('Failed to retrieve feedback: ' + err.message));
                }
                resolve(results.length > 0 ? results[0] : null);
            });
        });
    }

    static getFeedbackByUserId(userId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Feedbacks WHERE user_id = ?';
            connection.query(query, [userId], (err, results) => {
                if (err) {
                    return reject(new Error('Failed to retrieve feedback: ' + err.message));
                }
                resolve(results);
            });
        });
    }

    static createFeedback({ rental_id, user_id, comment, rating }) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO Feedbacks (rental_id, user_id, comment, rating) VALUES (?, ?, ?, ?)';
            const values = [rental_id, user_id, comment, rating];


            connection.query(query, values, (err, results) => {
                if (err) {
                    console.error("SQL error:", err.message);  // Log specific SQL error message
                    return reject(new Error('Failed to create feedback: ' + err.message));
                }
                
                resolve({ success: true, id: results.insertId, rental_id, user_id, comment, rating });
            });
        });
    }

    
    static updateFeedback(feedbackId, data) {
        return new Promise((resolve, reject) => {
            const fields = [];
            const values = [];

            if (data.comment !== undefined) {
                fields.push('comment = ?');
                values.push(data.comment);
            }

            if (data.rating !== undefined) {
                fields.push('rating = ?');
                values.push(data.rating);
            }

            values.push(feedbackId);
            const query = `UPDATE Feedbacks SET ${fields.join(', ')} WHERE feedback_id = ?`;

            connection.query(query, values, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results.affectedRows > 0);
            });
        });
    }

    static deleteFeedback(feedbackId) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM Feedbacks WHERE feedback_id = ?';
            connection.query(query, [feedbackId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results.affectedRows > 0);
            });
        });
    }
}

module.exports = FeedbackModel;

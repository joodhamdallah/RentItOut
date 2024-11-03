const connection = require('../database');

class FeedbackModel {
    static createFeedback(rental_id, user_id, comment, rating, callback) {
        const query = `
            INSERT INTO Feedbacks (rental_id, user_id, comment, rating)
            VALUES (?, ?, ?, ?)
        `;
        connection.query(query, [rental_id, user_id, comment, rating], callback);
    }

    static getAllFeedbacks(callback) {
        const query = `SELECT * FROM Feedbacks`;
        connection.query(query, callback);
    }

    static getFeedbacksByRental(rental_id, callback) {
        const query = `SELECT * FROM Feedbacks WHERE rental_id = ?`;
        connection.query(query, [rental_id], callback);
    }

    static updateFeedback(feedback_id, comment, rating, callback) {
        const query = `UPDATE Feedbacks SET comment = ?, rating = ? WHERE feedback_id = ?`;
        connection.query(query, [comment, rating, feedback_id], callback);
    }

    static deleteFeedback(feedback_id, callback) {
        const query = `DELETE FROM Feedbacks WHERE feedback_id = ?`;
        connection.query(query, [feedback_id], callback);
    }
}

module.exports = FeedbackModel;

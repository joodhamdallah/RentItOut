const FeedbackModel = require('../models/feedbackModel');

class FeedbackController {
    static createFeedback(req, res) {
        const { rental_id, user_id, comment, rating } = req.body;
        FeedbackModel.createFeedback(rental_id, user_id, comment, rating, (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Error creating feedback', details: err });
            }
            res.status(201).json({ message: 'Feedback created successfully', feedback_id: results.insertId });
        });
    }

    static getAllFeedbacks(req, res) {
        FeedbackModel.getAllFeedbacks((err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Error fetching feedbacks', details: err });
            }
            res.status(200).json(results);
        });
    }

    static getFeedbacksByRental(req, res) {
        const { rental_id } = req.params;
        FeedbackModel.getFeedbacksByRental(rental_id, (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Error fetching feedbacks', details: err });
            }
            res.status(200).json(results);
        });
    }

    static updateFeedback(req, res) {
        const { feedback_id } = req.params;
        const { comment, rating } = req.body;
        FeedbackModel.updateFeedback(feedback_id, comment, rating, (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Error updating feedback', details: err });
            }
            res.status(200).json({ message: 'Feedback updated successfully' });
        });
    }

    static deleteFeedback(req, res) {
        const { feedback_id } = req.params;
        FeedbackModel.deleteFeedback(feedback_id, (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Error deleting feedback', details: err });
            }
            res.status(200).json({ message: 'Feedback deleted successfully' });
        });
    }
}

module.exports = FeedbackController;

const Feedback = require('../models/Feedbacks'); 
const RentalDetails = require('../models/Rentaldetails');


class FeedbackController {
    // Create a new feedback
    static async createFeedback(req, res) {
        const userId = req.userId;
        const { rental_id, comment, rating, item_id } = req.body;

        try {
            const rentalDetails = await RentalDetails.findByRentalAndItem(userId, rental_id, item_id);
            if (!rentalDetails) {
                return res.status(400).json({ error: 'The specified item is not associated with this rental for the user.' });
            }

            const feedbackId = await Feedback.create(rental_id, userId, comment, rating, item_id);
            res.status(201).json({ message: 'Feedback created successfully', feedbackId });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Get all feedbacks
    static async getAllFeedbacks(req, res) {
        try {
            const feedbacks = await Feedback.getAll();
            res.json(feedbacks);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }


    // Get feedbacks for a specific item
    static async getFeedbacksByItem(req, res) {
        const { itemId } = req.params;
        try {
            const feedbacks = await Feedback.getByItem(itemId);
            res.json(feedbacks);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Get feedbacks from specific user
    static async getFeedbacksByUser(req, res) {
        const userId = req.userId; 
        try {
            const feedbacks = await Feedback.getByUser(userId);
            res.json(feedbacks);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }


    // Get most rented items based on feedback
    static async getMostRentedItems(req, res) {
        const limit = parseInt(req.query.limit) || 10; // Default to 10 if no limit is provided
        try {
            const items = await Feedback.getMostRentedItems(limit);
            res.json(items);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }


    // Update the ]feedback
    static async updateFeedback(req, res) {
        const { feedbackId } = req.params;
        const { comment, rating } = req.body;
        try {
            await Feedback.update(feedbackId, comment, rating);
            res.json({ message: 'Feedback updated successfully' });
        } catch (err) {
            res.status(err.message === 'Feedback not found' ? 404 : 500).json({ error: err.message });
        }
    }

    // Delete the feedback
    static async deleteFeedback(req, res) {
        const { feedbackId } = req.params;
        try {
            await Feedback.delete(feedbackId);
            res.json({ message: 'Feedback deleted successfully' });
        } catch (err) {
            res.status(err.message === 'Feedback not found' ? 404 : 500).json({ error: err.message });
        }
    }
}

module.exports = FeedbackController;

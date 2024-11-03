const FeedbackModel = require('../models/Feedbacks');

class FeedbackController {
    static async listAllFeedbacks(req, res) {
        try {
            const feedbacks = await FeedbackModel.getAllFeedbacks();
            res.status(200).json({ success: true, data: feedbacks });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to retrieve feedbacks' });
        }
    }

    static async getFeedbackById(req, res) {
        const feedbackId = req.params.id;
        try {
            const feedback = await FeedbackModel.getFeedbackById(feedbackId);
            if (!feedback) {
                return res.status(404).json({ success: false, message: 'Feedback not found' });
            }
            res.status(200).json({ success: true, data: feedback });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to retrieve feedback' });
        }
    }

    static async getFeedbackByUserId(req, res) {
        const userId = req.params.userId;
        
        try {
            const feedback = await FeedbackModel.getFeedbackByUserId(userId);
            if (feedback.length === 0) {
                return res.status(404).json({ success: false, message: 'No feedback found for this user.' });
            }
            res.status(200).json({ success: true, data: feedback });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Failed to retrieve feedback', error: error.message });
        }
    }

    static async addFeedback(req, res) {
        const { rental_id, user_id, comment, rating } = req.body;
        try {
            const newFeedback = await FeedbackModel.createFeedback({ rental_id, user_id, comment, rating });
            res.status(201).json({ success: true, data: newFeedback });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to add feedback' });
        }
    }

    static async updateFeedback(req, res) {
        const feedbackId = req.params.id;
        const { comment, rating } = req.body;

        try {
            const success = await FeedbackModel.updateFeedback(feedbackId, { comment, rating });
            if (!success) {
                return res.status(404).json({ success: false, message: 'Feedback not found' });
            }
            res.status(200).json({ success: true, message: 'Feedback updated successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to update feedback' });
        }
    }

    static async deleteFeedback(req, res) {
        const feedbackId = req.params.id;
        try {
            const success = await FeedbackModel.deleteFeedback(feedbackId);
            if (!success) {
                return res.status(404).json({ success: false, message: 'Feedback not found' });
            }
            res.status(200).json({ success: true, message: 'Feedback deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to delete feedback' });
        }
    }
}

module.exports = FeedbackController;

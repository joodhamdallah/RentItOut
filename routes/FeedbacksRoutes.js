const express = require('express');
const router = express.Router();
const FeedbackController = require('../controllers/FeedbacksController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

// List all feedbacks
router.get('/feedbacks', FeedbackController.listAllFeedbacks);

// Get a specific feedback by ID
router.get('/feedbacks/:id', FeedbackController.getFeedbackById);

// Get feedback by user ID
router.get('/feedbacks/user/:userId', FeedbackController.getFeedbackByUserId);

// Add a new feedback
router.post('/feedbacks', FeedbackController.addFeedback);

// Update a feedback
router.put('/feedbacks/:id', verifyToken, authorizeRole('customer'), FeedbackController.updateFeedback);

// Delete a feedback
router.delete('/feedbacks/:id', verifyToken, authorizeRole('admin'), FeedbackController.deleteFeedback);

module.exports = router;

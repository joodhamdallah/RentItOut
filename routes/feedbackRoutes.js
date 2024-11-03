const express = require('express');
const router = express.Router();
const FeedbackController = require('../controllers/feedbackController');

router.post('/feedbacks', FeedbackController.createFeedback);
router.get('/feedbacks', FeedbackController.getAllFeedbacks);
router.get('/feedbacks/rental/:rental_id', FeedbackController.getFeedbacksByRental);
router.put('/feedbacks/:feedback_id', FeedbackController.updateFeedback);
router.delete('/feedbacks/:feedback_id', FeedbackController.deleteFeedback);

module.exports = router;

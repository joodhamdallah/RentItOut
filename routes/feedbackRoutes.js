const express = require('express');
const router = express.Router();
const FeedbackController = require('../controllers/feedbackController');
const { verifyToken,authorizeRole } = require('../middleware/authMiddleware');


router.post('/feedback',verifyToken, FeedbackController.createFeedback); 
router.get('/feedback', FeedbackController.getAllFeedbacks); 
router.get('/feedback/item/:itemId', FeedbackController.getFeedbacksByItem); 
router.get('/feedback/user',verifyToken, FeedbackController.getFeedbacksByUser);  
router.put('/feedback/:feedbackId', FeedbackController.updateFeedback);  
router.delete('/feedback/:feedbackId', FeedbackController.deleteFeedback);  

module.exports = router;
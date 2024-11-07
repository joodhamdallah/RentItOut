const express = require('express');
const ProfitsController = require('../controllers/ProfitsController');
const router = express.Router();
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

// Route to calculate and insert profit for an item
router.post('/profits/calculate/:item_id', ProfitsController.calculateProfit);

router.get('/profits', ProfitsController.getProfits);

router.get('/vendor-profits/:user_id',verifyToken, authorizeRole('admin','vendor'), ProfitsController.getVendorProfitsByUser);


module.exports = router;

const express = require('express');
const router = express.Router();
const rentalDetailsController = require('../controllers/RentalDetailsController');

router.post('/rental-details/create', rentalDetailsController.createRentalDetails);

module.exports = router;

const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

// Route for creating products
router.post('/create', productsController.createProduct);

// Route for calculating price
router.post('/price', productsController.calculatePrice);

module.exports = router;

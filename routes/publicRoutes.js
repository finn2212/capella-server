// File: routes/publicRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../utilities/multerConfig');
const publicController = require('../controllers/publicController'); // Ensure this path is correct

// Define the public Capella route
router.post('/capella/upload', upload.array('pdf', 10), publicController.uploadPDFs);

// You can add more public routes here if needed

module.exports = router;

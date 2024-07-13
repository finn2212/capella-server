// File: routes/publicRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../utilities/multerConfig');
const publicController = require('../controllers/publicController'); // Ensure this path is correct
const { supabase } = require("../supabase-config");

// Define the public Capella route
router.post('/capella/upload', upload.array('pdf', 10), publicController.uploadPDFs);

router.get('/keep-alive', async (req, res) => {
    try {
      // Make a simple query to the Supabase database
      const { data, error } = await supabase
        .from('keep-alive') // Replace with your actual table name
        .select('id') // Select a simple column
        .limit(1); // Limit the result to 1 to keep the query lightweight
  
      if (error) {
        throw error;
      }
  
      res.send('Supabase is active');
    } catch (error) {
      console.error('Error keeping Supabase active:', error);
      res.status(500).send('Error keeping Supabase active');
    }
  });
// You can add more public routes here if needed

module.exports = router;

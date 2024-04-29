require('dotenv').config(); // Make sure this is at the top
const express = require('express');
const cors = require('cors');
const app = express();



// Define allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'https://dev.capellaprint.com',
  'http://localhost:3000',
  'https://www.capellaprint.com',
  'https://capellaprint.com/',
  'https://preview.capellaprint.com'
];
//active branch

//this is main

// Configure CORS
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
    } else {
      callback(new Error(`Your origin ${origin} is not allowed by CORS`));
    }
},
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
};

const permissiveCorsOptions = {
  origin: '*', // Allows all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Assuming you want to allow typical HTTP methods
  credentials: false // It's important to not allow credentials on a fully open endpoint
};

app.use((req, res, next) => {
  if (req.path.startsWith('/api/public')) {
    // Apply permissive CORS for specific public API endpoints
    cors(permissiveCorsOptions)(req, res, next);
  } else {
    // Apply restrictive CORS for all other endpoints
    cors(corsOptions)(req, res, function(err) {
      if (err) {
        return res.status(403).json({ message: err.message });
      }
      next();
    });
  }
});

app.use(express.json()); 
// Import routes
const productsRoutes = require('./routes/productsRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const musicSheetRoutes = require('./routes/musicSheetRoutes');
const publicRoutes = require('./routes/publicRoutes');

// Use the product routes
app.use('/api/products', productsRoutes);
app.use('/api', uploadRoutes); 
app.use('/api/musicSheet', musicSheetRoutes); 
app.use('/api/public', publicRoutes); 


// Define a test route to ensure the server is working
app.get('/', (req, res) => {
    res.send('Server is up and running!');
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

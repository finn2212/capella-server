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
  methods: ['GET', 'POST']
};

app.use(cors(corsOptions));

app.use(express.json()); 
// Import routes
const productsRoutes = require('./routes/productsRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const musicSheetRoutes = require('./routes/musicSheetRoutes')

// Use the product routes
app.use('/api/products', productsRoutes);
app.use('/api', uploadRoutes); 
app.use('/api/musicSheet', musicSheetRoutes); // Notice the removal of the trailing slash for consistency


// Define a test route to ensure the server is working
app.get('/', (req, res) => {
    res.send('Server is up and running!');
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

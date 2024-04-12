require('dotenv').config(); // Make sure this is at the top
const express = require('express');
const cors = require('cors');
const app = express();

// Import routes
const productsRoutes = require('./routes/productsRoutes');

// Configure CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());  // Middleware to parse JSON bodies

// Use the product routes
app.use('/api/products', productsRoutes);

// Define a test route to ensure the server is working
app.get('/', (req, res) => {
    res.send('Server is up and running!');
});
console.log(process.env.CORS_ORIGIN,"process.env.CORS_ORIGIN")

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

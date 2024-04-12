const express = require('express');
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

// Define a test route to ensure the server is working
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// Define the /api/price route for POST requests
app.post('/api/price', (req, res) => {
  const { pagePrice, pageNumber } = req.body;
  const handlingPrice = 50; // Example handling price
  const totalPrice = (pagePrice * pageNumber) + handlingPrice;
  res.json({ totalPrice });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

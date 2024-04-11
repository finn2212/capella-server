const express = require('express');
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

// Define the price calculation API endpoint
app.post('/api/price', (req, res) => {
  const { pagePrice, pageNumber } = req.body;
  const handlingPrice = 50; // Your secret handling price

  // Calculate the total price
  const totalPrice = (pagePrice * pageNumber) + handlingPrice;

  // Return the computed total price
  res.json({ totalPrice });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

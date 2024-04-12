const express = require('express');
const app = express();
// Configure CORS
app.use(cors({
  origin: ['http://localhost:3000'], // Specify the domain of your frontend app
  methods: ['GET', 'POST'], // Allowable methods
  credentials: true // Enable credentials for session-based authentication
}));

app.use(express.json()); // Middleware to parse JSON bodies

// Define a test route to ensure the server is working
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// Your API routes
app.post('/api/price', (req, res) => {
  const { pagePrice, pageNumber } = req.body;
  const handlingPrice = 50;
  const totalPrice = (pagePrice * pageNumber) + handlingPrice;
  res.json({ totalPrice });
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

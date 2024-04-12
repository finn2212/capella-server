// Controller for creating products
exports.createProduct = (req, res) => {
    // Placeholder for product creation logic
    res.send(true);  // Simulate a successful product creation
};

// Controller for calculating the price
exports.calculatePrice = (req, res) => {
    const { pagePrice, pageNumber } = req.body;
    const handlingPrice = 50;  // Additional cost
    const totalPrice = (pagePrice * pageNumber) + handlingPrice;
    res.json({ totalPrice });
};

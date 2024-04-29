const productService = require("../services/createProductServices");
const musicSheetController = require("./musicSheetController");
const { calculatePrice } = require('../services/pricingService'); // Adjust the path as necessary



exports.createProduct = async (req, res) => {
  try {
    const musicSheetProject = req.body; // Get product details from the request body
    const newProduct = await productService.createProduct(musicSheetProject); // Await the promise from the service layer
    musicSheetProject.shopwareId = newProduct.id;
    await musicSheetController.createMusicSheet(
      musicSheetProject
    );
    res.json({ success: true, product: newProduct }); // Send successful response with the productId
  } catch (error) {
    console.error("Error in creating product:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to create product",
        error: error.message,
      }); // Send error response
  }
};

// Controller functions
exports.calculatePrice = (req, res) => {
  const params = req.body;

  try {
      const result = calculatePrice(params);
      res.json(result);
  } catch (error) {
      console.error("Error calculating price:", error);
      res.status(500).json({
          success: false,
          message: "Failed to calculate price",
          error: error.message
      });
  }
};

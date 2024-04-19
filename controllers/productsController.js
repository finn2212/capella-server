    // Define discount tiers
    const discounts = [
    { id: 1, discount: 0, amount: 0 },
    { id: 2, discount: 0.1, amount: 1 },
    { id: 3, discount: 0.2, amount: 2 },
    { id: 4, discount: 0.3, amount: 3 },
    { id: 5, discount: 0.325, amount: 4 },
    { id: 6, discount: 0.35, amount: 5 },
    { id: 7, discount: 0.375, amount: 6 },
    { id: 8, discount: 0.4, amount: 7 },
    { id: 9, discount: 0.45, amount: 8 },
    { id: 10, discount: 0.5, amount: 9 },
    { id: 11, discount: 0.55, amount: 10 },
    { id: 12, discount: 0.6, amount: 25 },
    { id: 13, discount: 0.65, amount: 50 },
    { id: 14, discount: 0.7, amount: 75 },
    { id: 15, discount: 0.725, amount: 100 },
    { id: 16, discount: 0.75, amount: 150 },
    { id: 17, discount: 0.76, amount: 250 },
    ];
const handlingFee = 18.69; // Example fee for handling each voice
const voicePagePrice = 0.14;
const productService = require('../services/createProductServices');

const calculateVoicePrices = (voices) =>
  voices.reduce(
    (total, voice) =>
      total +
      (voice.pages * voicePagePrice * voice.quantity),
    0
  );

  const findAppropriateDiscount = (quantity) => {
    // Assuming the discounts are sorted by 'amount' in ascending order
    let applicableDiscount = discounts[0];  // Start with the lowest possible discount
    for (let i = discounts.length - 1; i >= 0; i--) {
      if (quantity > discounts[i].amount) {
        applicableDiscount = discounts[i];
        break;
      }
    }
    console.log(applicableDiscount.id);
    return applicableDiscount;
  };

  exports.createProduct = async (req, res) => {
    try {
      const musicSheetProject = req.body; // Get product details from the request body
      const productId = await productService.createProduct(musicSheetProject); // Await the promise from the service layer
      res.json({ success: true, product: productId }); // Send successful response with the productId
    } catch (error) {
      console.error("Error in creating product:", error);
      res.status(500).json({ success: false, message: "Failed to create product", error: error.message }); // Send error response
    }
  };

// Controller functions
exports.calculatePrice = (req, res) => {
  const {
    pagesQuantity,
    format,
    paperFormat,
    color,
    projectType,
    bindingType,
    productName,
    hasCover,
    productQuantity,
    voices,
  } = req.body;

  const pagePrice = paperFormat < 4 ? 0.14 : 0.2;
  const adjustedPagePrice = color === "true" ? pagePrice * 2 : pagePrice;
  let bindingTypeExtra = 0;
  if (bindingType === "false") {
    bindingTypeExtra = paperFormat > 4 ? 4.50 : 3.50;
  }
  const totalVoicePrice = calculateVoicePrices(voices);
  const discount = findAppropriateDiscount(productQuantity).discount;
  const coverCharge = hasCover === "true" ? 1.5 : 0;
  const basePrice = pagesQuantity * adjustedPagePrice + totalVoicePrice + coverCharge + bindingTypeExtra;
  const totalPrice = basePrice * (1 - discount);
  const formattedPrice = (totalPrice * productQuantity + handlingFee)
    .toFixed(2)
    .replace(".", ",");
    const singlePrice=  (totalPrice + (handlingFee/ productQuantity))
    .toFixed(2);
  const productionTime = productQuantity >= 100 ? "3–5 Tage" : "1–3 Tage";

  res.json({ price: formattedPrice, productionTime, singlePrice });
};

// pricingService.js
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
const voicePagePrice = 0.14; // Example fixed fee, adjust as necessary
// Calculate prices for additional voice parts
const calculateVoicePrices = (voices) =>
  voices.reduce(
    (total, voice) => total + voice.pages * voicePagePrice * voice.quantity,
    0
  );

// Find the most appropriate discount based on quantity
const findAppropriateDiscount = (quantity) => {
  let applicableDiscount = discounts[0]; // Start with the lowest possible discount
  for (let i = discounts.length - 1; i >= 0; i--) {
    if (quantity >= discounts[i].amount) {
      applicableDiscount = discounts[i];
      break;
    }
  }
  return applicableDiscount;
};

// Main calculation function
function calculatePrice({
  pagesQuantity,
  paperFormat,
  color,
  bindingType,
  hasCover,
  productQuantity,
  voices
}) {
    const pagePrice = paperFormat < 4 ? 0.14 : 0.2;
    const adjustedPagePrice = color === "true" ? pagePrice * 2 : pagePrice;
  let bindingTypeExtra = 0;
  if (bindingType === "false") {
    bindingTypeExtra = paperFormat > 4 ? 4.5 : 3.5;
  }

  const totalVoicePrice = calculateVoicePrices(voices);
  const discountDetails = findAppropriateDiscount(productQuantity);
  const coverCharge = hasCover === "true" ? 1.5 : 0;
  const basePrice =
    pagesQuantity * adjustedPagePrice +
    totalVoicePrice +
    coverCharge +
    bindingTypeExtra;
  const totalPrice = basePrice * (1 - discountDetails.discount);
  const formattedPrice = (totalPrice * productQuantity + handlingFee)
    .toFixed(2)
    .replace(".", ",");
  const singlePrice = (totalPrice + handlingFee / productQuantity).toFixed(2);
  const productionTime = productQuantity >= 100 ? "3–5 Tage" : "1–3 Tage";

  return {
    price: formattedPrice,
    productionTime,
    singlePrice,
  };
}

module.exports = { calculatePrice };

import { Purchase } from "./types";
import amazonData from "../amazonData.json";

// Simple category mapping based on product names
const categorizeProduct = (productName: string): string => {
  const name = productName.toLowerCase();

  if (
    name.includes("shirt") ||
    name.includes("socks") ||
    name.includes("sunglasses") ||
    name.includes("mascara") ||
    name.includes("makeup") ||
    name.includes("shampoo") ||
    name.includes("moisturizer") ||
    name.includes("lip balm")
  ) {
    return "Fashion";
  }

  if (
    name.includes("smart") ||
    name.includes("phone") ||
    name.includes("camera") ||
    name.includes("headset") ||
    name.includes("gpu") ||
    name.includes("webcam") ||
    name.includes("mouse") ||
    name.includes("memory card") ||
    name.includes("thermometer") ||
    name.includes("laptop") ||
    name.includes("toothbrush") ||
    name.includes("blender")
  ) {
    return "Electronics";
  }

  if (
    name.includes("water") ||
    name.includes("vitamin") ||
    name.includes("almonds") ||
    name.includes("detergent") ||
    name.includes("sunscreen") ||
    name.includes("drops")
  ) {
    return "Health & Personal Care";
  }

  if (
    name.includes("bottle") ||
    name.includes("tumbler") ||
    name.includes("flask") ||
    name.includes("pot") ||
    name.includes("cooker") ||
    name.includes("sheet") ||
    name.includes("yoga mat") ||
    name.includes("car seat")
  ) {
    return "Home & Garden";
  }

  return "Other";
};

// Simple carbon score estimation based on category and price
const estimateCarbonScore = (
  category: string,
  price: number,
  quantity: number
): number => {
  const baseScores = {
    Electronics: 0.008, // Higher carbon per dollar
    Fashion: 0.006,
    "Health & Personal Care": 0.003,
    "Home & Garden": 0.004,
    Other: 0.005,
  };

  const multiplier = baseScores[category as keyof typeof baseScores] || 0.005;
  const score = price * multiplier * quantity; // Factor in quantity

  // Add some randomness and cap between 0.5 and 15 (higher max for multiple items)
  const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
  return Math.max(0.5, Math.min(15, score * randomFactor));
};

// Transform Amazon data to Purchase format
export const transformAmazonDataToPurchases = (): Purchase[] => {
  const purchases: Purchase[] = [];
  let purchaseId = 1;

  // Process transactions in reverse order so last JSON entries appear first
  const reversedTransactions = [...amazonData.transactions].reverse();

  reversedTransactions.forEach((transaction) => {
    // Also reverse products within each transaction
    const reversedProducts = [...transaction.products].reverse();

    reversedProducts.forEach((product) => {
      const category = categorizeProduct(product.name);
      const totalPrice = parseFloat(product.price.total);
      const unitPrice = parseFloat(product.price.unit_price);
      const quantity = product.quantity;
      const carbonScore = estimateCarbonScore(category, totalPrice, 1); // Use total price, quantity 1

      // Create single purchase entry with actual quantity and total price
      purchases.push({
        id: purchaseId++,
        item: quantity > 1 ? `${product.name} (×${quantity})` : product.name,
        store: amazonData.merchant.name,
        category: category,
        amount: totalPrice, // Use total price instead of unit price
        carbonScore: Math.round(carbonScore * 10) / 10, // Round to 1 decimal
        date: transaction.datetime.split("T")[0], // Extract date part
        description:
          quantity > 1
            ? `${product.name} (${quantity} items) from ${amazonData.merchant.name}`
            : `${product.name} from ${amazonData.merchant.name}`,
        alternatives: Math.floor(Math.random() * 8) + 2, // Random between 2-9
      });
    });
  });

  // Return in the order processed (last JSON entries first)
  return purchases;
};

// Export the transformed data (recalculated each time)
export const amazonPurchases = transformAmazonDataToPurchases();

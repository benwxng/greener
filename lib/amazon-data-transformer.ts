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
const estimateCarbonScore = (category: string, price: number): number => {
  const baseScores = {
    Electronics: 0.008, // Higher carbon per dollar
    Fashion: 0.006,
    "Health & Personal Care": 0.003,
    "Home & Garden": 0.004,
    Other: 0.005,
  };

  const multiplier = baseScores[category as keyof typeof baseScores] || 0.005;
  const score = price * multiplier;

  // Add some randomness and cap between 0.5 and 10
  const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
  return Math.max(0.5, Math.min(10, score * randomFactor));
};

// Transform Amazon data to Purchase format
export const transformAmazonDataToPurchases = (): Purchase[] => {
  const purchases: Purchase[] = [];
  let purchaseId = 1;

  amazonData.transactions.forEach((transaction) => {
    transaction.products.forEach((product) => {
      const category = categorizeProduct(product.name);
      const unitPrice = parseFloat(product.price.unit_price);
      const carbonScore = estimateCarbonScore(category, unitPrice);

      // Create individual purchases for each quantity
      for (let i = 0; i < product.quantity; i++) {
        purchases.push({
          id: purchaseId++,
          item: product.name,
          store: amazonData.merchant.name,
          category: category,
          amount: unitPrice,
          carbonScore: Math.round(carbonScore * 10) / 10, // Round to 1 decimal
          date: transaction.datetime.split("T")[0], // Extract date part
          description: `${product.name} from ${amazonData.merchant.name}`,
          alternatives: Math.floor(Math.random() * 8) + 2, // Random between 2-9
        });
      }
    });
  });

  // Sort by date (newest first)
  return purchases.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

// Export the transformed data
export const amazonPurchases = transformAmazonDataToPurchases();

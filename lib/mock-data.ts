// Mock data service for Greener app
import {
  Purchase,
  Recommendation,
  CarbonTrendData,
  CategoryData,
  UserProfile,
  Achievement,
  MonthlyGoals,
} from "./types";

// Mock purchase data
export const mockPurchases: Purchase[] = [
  {
    id: 1,
    item: "Organic Cotton T-Shirt",
    store: "EcoWear",
    category: "Fashion",
    amount: 35.99,
    carbonScore: 2.1,
    date: "2024-01-15",
    description: "100% organic cotton, sustainably sourced",
    alternatives: 3,
  },
  {
    id: 2,
    item: "iPhone 15 Pro",
    store: "Apple Store",
    category: "Electronics",
    amount: 999.99,
    carbonScore: 8.7,
    date: "2024-01-12",
    description: "Latest smartphone with advanced features",
    alternatives: 5,
  },
  {
    id: 3,
    item: "Fair Trade Coffee Beans",
    store: "Local Roastery",
    category: "Food",
    amount: 12.5,
    carbonScore: 1.2,
    date: "2024-01-10",
    description: "Ethiopian single origin, fair trade certified",
    alternatives: 2,
  },
  {
    id: 4,
    item: "Running Shoes",
    store: "Nike",
    category: "Fashion",
    amount: 129.99,
    carbonScore: 6.4,
    date: "2024-01-08",
    description: "Air Max series with recycled materials",
    alternatives: 4,
  },
  {
    id: 5,
    item: "Laptop Stand",
    store: "Amazon",
    category: "Electronics",
    amount: 49.99,
    carbonScore: 3.2,
    date: "2024-01-05",
    description: "Aluminum laptop stand with adjustable height",
    alternatives: 6,
  },
  {
    id: 6,
    item: "Wireless Headphones",
    store: "Sony",
    category: "Electronics",
    amount: 199.99,
    carbonScore: 4.8,
    date: "2024-01-03",
    description: "Noise-cancelling wireless headphones",
    alternatives: 7,
  },
];

// Mock recommendations data
export const mockRecommendations: Recommendation[] = [
  {
    id: 1,
    title: "Sustainable Alternative to iPhone 15 Pro",
    originalProduct: "iPhone 15 Pro",
    recommendedProduct: "Fairphone 5",
    store: "Fairphone Store",
    originalPrice: 999.99,
    recommendedPrice: 699.0,
    originalCarbon: 8.7,
    recommendedCarbon: 3.2,
    savings: 300.99,
    carbonReduction: 5.5,
    rating: 4.3,
    reviews: 1247,
    category: "Electronics",
    sustainabilityScore: 9.2,
    features: [
      "Modular design",
      "7-year warranty",
      "Fair trade materials",
      "Repairable",
    ],
    affiliateLink: "https://amazon.com/fairphone-5",
    reason: "Lower carbon footprint with modular, repairable design",
  },
  {
    id: 2,
    title: "Eco-Friendly Running Shoes",
    originalProduct: "Nike Air Max",
    recommendedProduct: "Allbirds Tree Runners",
    store: "Allbirds",
    originalPrice: 129.99,
    recommendedPrice: 98.0,
    originalCarbon: 6.4,
    recommendedCarbon: 2.1,
    savings: 31.99,
    carbonReduction: 4.3,
    rating: 4.6,
    reviews: 3420,
    category: "Fashion",
    sustainabilityScore: 8.8,
    features: [
      "Tree fiber material",
      "Carbon neutral shipping",
      "Recyclable",
      "Comfortable",
    ],
    affiliateLink: "https://amazon.com/allbirds-tree-runners",
    reason: "Made from sustainable tree fiber with carbon neutral shipping",
  },
  {
    id: 3,
    title: "Sustainable Coffee Alternative",
    originalProduct: "Regular Coffee Beans",
    recommendedProduct: "Organic Rainforest Alliance Coffee",
    store: "Whole Foods",
    originalPrice: 12.5,
    recommendedPrice: 14.99,
    originalCarbon: 1.2,
    recommendedCarbon: 0.4,
    savings: -2.49,
    carbonReduction: 0.8,
    rating: 4.5,
    reviews: 892,
    category: "Food",
    sustainabilityScore: 9.5,
    features: [
      "Rainforest Alliance certified",
      "Organic",
      "Fair trade",
      "Carbon offset program",
    ],
    affiliateLink: "https://amazon.com/rainforest-coffee",
    reason: "Supports forest conservation and reduces environmental impact",
  },
  {
    id: 4,
    title: "Eco Laptop Stand",
    originalProduct: "Aluminum Laptop Stand",
    recommendedProduct: "Bamboo Laptop Stand",
    store: "EcoTech",
    originalPrice: 49.99,
    recommendedPrice: 39.99,
    originalCarbon: 3.2,
    recommendedCarbon: 0.8,
    savings: 10.0,
    carbonReduction: 2.4,
    rating: 4.4,
    reviews: 567,
    category: "Electronics",
    sustainabilityScore: 8.9,
    features: [
      "Sustainable bamboo",
      "Biodegradable",
      "Lightweight",
      "Adjustable",
    ],
    affiliateLink: "https://amazon.com/bamboo-laptop-stand",
    reason: "Made from renewable bamboo instead of energy-intensive aluminum",
  },
];

// Mock chart data
export const mockCarbonTrendData: CarbonTrendData[] = [
  { month: "Jan", emissions: 12.5, target: 10 },
  { month: "Feb", emissions: 11.2, target: 10 },
  { month: "Mar", emissions: 9.8, target: 10 },
  { month: "Apr", emissions: 8.5, target: 10 },
  { month: "May", emissions: 7.9, target: 10 },
  { month: "Jun", emissions: 7.2, target: 10 },
];

export const mockCategoryData: CategoryData[] = [
  { category: "Fashion", emissions: 2.1, percentage: 29 },
  { category: "Electronics", emissions: 1.8, percentage: 25 },
  { category: "Food", emissions: 1.2, percentage: 17 },
  { category: "Transport", emissions: 1.1, percentage: 15 },
  { category: "Other", emissions: 1.0, percentage: 14 },
];

// Mock user profile data
export const mockUserProfile: UserProfile = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  joinDate: "2024-01-01",
  totalPurchases: 87,
  totalSavings: 245.67,
  carbonReduced: 34.8,
  currentStreak: 7,
  longestStreak: 15,
};

export const mockAchievements: Achievement[] = [
  {
    id: 1,
    name: "Eco Warrior",
    description: "Reduced carbon footprint by 25%",
    icon: "🌱",
    earned: true,
  },
  {
    id: 2,
    name: "Smart Shopper",
    description: "Saved $100 with better choices",
    icon: "💰",
    earned: true,
  },
  {
    id: 3,
    name: "Streak Master",
    description: "7-day sustainable shopping streak",
    icon: "🔥",
    earned: true,
  },
  {
    id: 4,
    name: "Carbon Crusher",
    description: "Reduced 50kg of CO₂",
    icon: "💨",
    earned: false,
  },
  {
    id: 5,
    name: "Green Guardian",
    description: "100 sustainable purchases",
    icon: "🛡️",
    earned: false,
  },
];

export const mockMonthlyGoals: MonthlyGoals = {
  carbonReduction: { current: 7.2, target: 10, unit: "kg CO₂" },
  sustainablePurchases: { current: 15, target: 20, unit: "purchases" },
  savings: { current: 45.67, target: 75, unit: "$" },
};

// Utility functions
export function getCarbonScoreColor(score: number): string {
  if (score <= 2) return "text-green-600";
  if (score <= 4) return "text-yellow-600";
  return "text-red-600";
}

export function getCarbonScoreBadge(score: number): {
  className: string;
  label: string;
} {
  if (score <= 2)
    return {
      className:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      label: "Low Impact",
    };
  if (score <= 4)
    return {
      className:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      label: "Medium Impact",
    };
  return {
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    label: "High Impact",
  };
}

export function getCategoryColor(category: string): string {
  const colors: { [key: string]: string } = {
    Fashion:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    Electronics:
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    Food: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    Transport: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    Other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  };
  return colors[category] || colors.Other;
}

export function getSustainabilityBadge(score: number): {
  className: string;
  label: string;
} {
  if (score >= 9)
    return {
      className:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      label: "Excellent",
    };
  if (score >= 8)
    return {
      className:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      label: "Very Good",
    };
  if (score >= 7)
    return {
      className:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      label: "Good",
    };
  return {
    className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    label: "Fair",
  };
}

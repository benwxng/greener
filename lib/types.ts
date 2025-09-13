// Types for the Greener app

export interface Purchase {
  id: number;
  item: string;
  store: string;
  category: string;
  amount: number;
  carbonScore: number;
  date: string;
  description: string;
  alternatives: number;
  image?: string;
}

export interface Recommendation {
  id: number;
  title: string;
  originalProduct: string;
  recommendedProduct: string;
  store: string;
  originalPrice: number;
  recommendedPrice: number;
  originalCarbon: number;
  recommendedCarbon: number;
  savings: number;
  carbonReduction: number;
  rating: number;
  reviews: number;
  category: string;
  sustainabilityScore: number;
  features: string[];
  affiliateLink: string;
  image?: string;
  reason: string;
}

export interface CarbonTrendData {
  month: string;
  emissions: number;
  target: number;
}

export interface CategoryData {
  category: string;
  emissions: number;
  percentage: number;
}

export interface UserProfile {
  name: string;
  email: string;
  joinDate: string;
  totalPurchases: number;
  totalSavings: number;
  carbonReduced: number;
  currentStreak: number;
  longestStreak: number;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
}

export interface Goal {
  current: number;
  target: number;
  unit: string;
}

export interface MonthlyGoals {
  carbonReduction: Goal;
  sustainablePurchases: Goal;
  savings: Goal;
}

// API Response types for future integration
export interface KnotTransactionResponse {
  transactions: Array<{
    id: string;
    amount: number;
    merchant: string;
    category: string;
    date: string;
    description: string;
  }>;
}

export interface CarbonAnalysisResponse {
  carbonScore: number;
  category: string;
  factors: Array<{
    factor: string;
    impact: number;
    weight: number;
  }>;
}

export interface ProductRecommendationResponse {
  alternatives: Array<{
    product: string;
    price: number;
    carbonScore: number;
    sustainabilityRating: number;
    affiliateUrl: string;
    features: string[];
  }>;
}

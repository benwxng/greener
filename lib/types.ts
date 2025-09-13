// Types for the Greener app

// Existing types (for backward compatibility with current UI)
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

// Database schema types (matching Supabase tables)
export interface User {
  id: string;
  external_user_id: string;
  created_at: string;
}

export interface MerchantAccount {
  id: string;
  user_id: string;
  merchant_id: string;
  status: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  merchant_account_id: string;
  knot_transaction_id: string;
  order_datetime: string;
  total_amount: number;
  currency: string;
  status: string;
  raw_json: any;
  created_at: string;
}

export interface TransactionProduct {
  id: string;
  transaction_id: string;
  external_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total: number;
  url: string;
  category?: string;
  auto_categorized?: boolean;
  created_at: string;
}

export interface EmissionsEstimate {
  id: string;
  product_id: string;
  factor_source: string;
  factor_id: string;
  method: "pcf" | "category" | "spend";
  estimated_co2e_kg: number;
  confidence: number;
  created_at: string;
}

export interface ProductAlternative {
  id: string;
  product_id: string;
  alt_name: string;
  alt_url: string;
  co2e_kg: number;
  savings_percent: number;
  created_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  monthly_carbon_target: number;
  currency: string;
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
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

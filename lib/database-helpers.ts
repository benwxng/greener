import { createClient } from "./supabase/client";
import {
  User,
  Transaction,
  TransactionProduct,
  EmissionsEstimate,
  UserPreferences,
} from "./types";
import amazonData from "../amazonData.json";

// Get Supabase client
const supabase = createClient();

// Helper to get or create user
export async function getOrCreateUser(
  externalUserId: string
): Promise<User | null> {
  // First try to get existing user
  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("external_user_id", externalUserId)
    .single();

  if (existingUser) {
    return existingUser;
  }

  // Create new user if doesn't exist
  const { data: newUser, error: createError } = await supabase
    .from("users")
    .insert({ external_user_id: externalUserId })
    .select()
    .single();

  if (createError) {
    console.error("Error creating user:", createError);
    return null;
  }

  // Create default preferences for new user
  await supabase.from("user_preferences").insert({
    user_id: newUser.id,
    monthly_carbon_target: 10.0,
    currency: "USD",
    notifications_enabled: true,
  });

  return newUser;
}

// Helper to get user preferences
export async function getUserPreferences(
  userId: string
): Promise<UserPreferences | null> {
  const { data, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching user preferences:", error);
    return null;
  }

  return data;
}

// Helper to update user preferences
export async function updateUserPreferences(
  userId: string,
  preferences: Partial<UserPreferences>
): Promise<boolean> {
  const { error } = await supabase
    .from("user_preferences")
    .update(preferences)
    .eq("user_id", userId);

  if (error) {
    console.error("Error updating user preferences:", error);
    return false;
  }

  return true;
}

// Simple category mapping (same as in amazon-data-transformer.ts)
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

// Simple carbon score estimation
const estimateCarbonScore = (category: string, price: number): number => {
  const baseScores = {
    Electronics: 0.008,
    Fashion: 0.006,
    "Health & Personal Care": 0.003,
    "Home & Garden": 0.004,
    Other: 0.005,
  };

  const multiplier = baseScores[category as keyof typeof baseScores] || 0.005;
  const score = price * multiplier;

  const randomFactor = 0.8 + Math.random() * 0.4;
  return Math.max(0.5, Math.min(10, score * randomFactor));
};

// Migrate Amazon data to database
export async function migrateAmazonDataToDatabase(
  userId: string
): Promise<boolean> {
  try {
    // Get or create user
    const user = await getOrCreateUser(userId);
    if (!user) {
      throw new Error("Failed to get or create user");
    }

    // Create merchant account for Amazon
    const { data: merchantAccount, error: merchantError } = await supabase
      .from("merchant_accounts")
      .upsert({
        user_id: user.id,
        merchant_id: amazonData.merchant.id.toString(),
        status: "authenticated",
      })
      .select()
      .single();

    if (merchantError) {
      throw new Error(
        `Failed to create merchant account: ${merchantError.message}`
      );
    }

    // Process each transaction
    for (const transaction of amazonData.transactions) {
      // Insert transaction
      const { data: dbTransaction, error: transactionError } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          merchant_account_id: merchantAccount.id,
          knot_transaction_id: transaction.id,
          order_datetime: transaction.datetime,
          total_amount: parseFloat(transaction.price.total),
          currency: transaction.price.currency,
          status: transaction.order_status,
          raw_json: transaction,
        })
        .select()
        .single();

      if (transactionError) {
        console.error(
          `Failed to insert transaction ${transaction.id}:`,
          transactionError
        );
        continue;
      }

      // Process each product in the transaction
      for (const product of transaction.products) {
        const category = categorizeProduct(product.name);

        // Insert transaction product
        const { data: dbProduct, error: productError } = await supabase
          .from("transaction_products")
          .insert({
            transaction_id: dbTransaction.id,
            external_id: product.external_id,
            name: product.name,
            quantity: product.quantity,
            unit_price: parseFloat(product.price.unit_price),
            total: parseFloat(product.price.total),
            url: product.url,
            category: category,
            auto_categorized: true,
          })
          .select()
          .single();

        if (productError) {
          console.error(
            `Failed to insert product ${product.external_id}:`,
            productError
          );
          continue;
        }

        // Calculate and insert emissions estimate
        const carbonScore = estimateCarbonScore(
          category,
          parseFloat(product.price.unit_price)
        );

        const { error: emissionsError } = await supabase
          .from("emissions_estimates")
          .insert({
            product_id: dbProduct.id,
            factor_source: "manual-category",
            factor_id: category.toLowerCase().replace(/\s+/g, "-"),
            method: "category",
            estimated_co2e_kg: Math.round(carbonScore * 10) / 10,
            confidence: 70, // Medium confidence for category-based estimation
          });

        if (emissionsError) {
          console.error(
            `Failed to insert emissions estimate for ${product.external_id}:`,
            emissionsError
          );
        }
      }
    }

    return true;
  } catch (error) {
    console.error("Error migrating Amazon data:", error);
    return false;
  }
}

// Get user's transactions with products and emissions
export async function getUserTransactions(userId: string) {
  const { data, error } = await supabase
    .from("transactions")
    .select(
      `
      *,
      transaction_products (
        *,
        emissions_estimates (*)
      )
    `
    )
    .eq("user_id", userId)
    .order("order_datetime", { ascending: false });

  if (error) {
    console.error("Error fetching user transactions:", error);
    return [];
  }

  return data;
}

// Get user's carbon footprint summary
export async function getUserCarbonSummary(userId: string) {
  // This would typically be a stored procedure or view for performance
  // For now, we'll calculate on the client side
  const transactions = await getUserTransactions(userId);

  let totalEmissions = 0;
  let totalSpent = 0;
  let totalProducts = 0;
  const categoryTotals: { [key: string]: number } = {};

  transactions.forEach((transaction: any) => {
    totalSpent += transaction.total_amount || 0;

    transaction.transaction_products?.forEach((product: any) => {
      totalProducts += product.quantity || 0;

      if (product.category) {
        categoryTotals[product.category] =
          categoryTotals[product.category] || 0;
      }

      product.emissions_estimates?.forEach((estimate: any) => {
        totalEmissions += estimate.estimated_co2e_kg || 0;
        if (product.category) {
          categoryTotals[product.category] += estimate.estimated_co2e_kg || 0;
        }
      });
    });
  });

  return {
    totalEmissions: Math.round(totalEmissions * 10) / 10,
    totalSpent: Math.round(totalSpent * 100) / 100,
    totalProducts,
    categoryBreakdown: Object.entries(categoryTotals).map(
      ([category, emissions]) => ({
        category,
        emissions: Math.round(emissions * 10) / 10,
        percentage: Math.round((emissions / totalEmissions) * 100),
      })
    ),
  };
}

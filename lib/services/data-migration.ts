import { createClient } from "@/lib/supabase/client";
import {
  estimateCarbonFootprint,
  batchEstimateCarbonFootprints,
} from "./carbon-estimation";
import amazonData from "../../amazonData.json";

// Simple category mapping (same as transformer)
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

// Progressive data loading strategy
export async function migrateAmazonDataWithLLM(userId: string): Promise<{
  success: boolean;
  totalProducts: number;
  processedProducts: number;
  error?: string;
}> {
  const supabase = createClient();

  try {
    console.log("Starting migration for user ID:", userId);

    // 1. Get or create user with better error handling
    let user;

    // First try to get existing user
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("external_user_id", userId)
      .single();

    if (existingUser) {
      user = existingUser;
      console.log("Found existing user:", user.id);
    } else {
      console.log("Creating new user...");
      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({ external_user_id: userId })
        .select()
        .single();

      if (createError) {
        console.error("User creation error:", createError);
        throw new Error(`Failed to create user: ${createError.message}`);
      }

      user = newUser;
      console.log("Created new user:", user.id);
    }

    if (!user) {
      throw new Error(
        "User creation/retrieval failed - no user object returned"
      );
    }

    // 2. Create merchant account for Amazon
    console.log("Creating merchant account...");
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
      console.error("Merchant account error:", merchantError);
      throw new Error(
        `Failed to create merchant account: ${merchantError.message}`
      );
    }

    console.log("Created merchant account:", merchantAccount.id);

    let totalProducts = 0;
    let processedProducts = 0;

    // 3. Process transactions and products
    for (const [
      transactionIndex,
      transaction,
    ] of amazonData.transactions.entries()) {
      console.log(
        `Processing transaction ${transactionIndex + 1}/${
          amazonData.transactions.length
        }: ${transaction.id}`
      );

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
          `Transaction error for ${transaction.id}:`,
          transactionError
        );
        continue; // Skip this transaction but continue with others
      }

      console.log(`Created transaction: ${dbTransaction.id}`);

      // Insert products with immediate category-based estimates
      for (const [productIndex, product] of transaction.products.entries()) {
        console.log(
          `  Processing product ${productIndex + 1}/${
            transaction.products.length
          }: ${product.name}`
        );

        const category = categorizeProduct(product.name);
        const totalPrice = parseFloat(product.price.total);

        // Insert product
        const { data: dbProduct, error: productError } = await supabase
          .from("transaction_products")
          .insert({
            transaction_id: dbTransaction.id,
            external_id: product.external_id,
            name: product.name,
            quantity: product.quantity,
            unit_price: parseFloat(product.price.unit_price),
            total: totalPrice,
            url: product.url,
            category: category,
            auto_categorized: true,
          })
          .select()
          .single();

        if (productError) {
          console.error(
            `Product error for ${product.external_id}:`,
            productError
          );
          totalProducts++;
          continue; // Skip this product but continue with others
        }

        console.log(`  Created product: ${dbProduct.id}`);
        totalProducts++;

        // Insert immediate category-based estimate for fast loading
        const categoryEstimate = getCategoryBasedEstimate(
          category,
          totalPrice,
          1
        );

        const { error: estimateError } = await supabase
          .from("emissions_estimates")
          .insert({
            product_id: dbProduct.id,
            factor_source: "category-immediate",
            factor_id: `${category}-${totalPrice}`,
            method: "category",
            estimated_co2e_kg: Math.round(categoryEstimate * 10) / 10,
            confidence: 50,
          });

        if (estimateError) {
          console.error(
            `Estimate error for ${product.external_id}:`,
            estimateError
          );
        } else {
          console.log(`  Created estimate for: ${dbProduct.id}`);
          processedProducts++;
        }
      }
    }

    console.log(
      `Migration completed: ${processedProducts}/${totalProducts} products processed`
    );

    // 4. Trigger background LLM processing (non-blocking)
    triggerBackgroundLLMProcessing(user.id);

    return {
      success: true,
      totalProducts,
      processedProducts,
    };
  } catch (error) {
    console.error("Migration failed with error:", error);
    return {
      success: false,
      totalProducts: 0,
      processedProducts: 0,
      error: error instanceof Error ? error.message : "Unknown migration error",
    };
  }
}

// Background processing for LLM estimates
async function triggerBackgroundLLMProcessing(userId: string) {
  // This would run in the background, not blocking the UI
  setTimeout(async () => {
    try {
      await enhanceWithLLMEstimates(userId);
    } catch (error) {
      console.error("Background LLM processing failed:", error);
    }
  }, 2000); // Start after 2 seconds
}

// Enhance existing products with LLM estimates
async function enhanceWithLLMEstimates(userId: string) {
  const supabase = createClient();

  // Get products that only have category-based estimates
  const { data: products } = await supabase
    .from("transaction_products")
    .select(
      `
      *,
      transactions!inner(user_id),
      emissions_estimates!inner(method)
    `
    )
    .eq("transactions.user_id", userId)
    .eq("emissions_estimates.method", "category");

  if (!products?.length) return;

  // Prepare LLM requests
  const llmRequests = products.map((product: any) => ({
    productName: product.name,
    category: product.category || "Other",
    price: product.total,
    quantity: product.quantity,
  }));

  // Get LLM estimates in batches
  const llmResults = await batchEstimateCarbonFootprints(llmRequests);

  // Update database with LLM estimates
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const llmResult = llmResults[i];

    if (llmResult.method === "llm") {
      // Insert new LLM-based estimate
      await supabase.from("emissions_estimates").insert({
        product_id: product.id,
        factor_source: "llm-openai",
        factor_id: `llm-${product.name}-${product.total}`,
        method: "llm",
        estimated_co2e_kg: llmResult.estimatedCo2eKg,
        confidence: llmResult.confidence,
      });

      // Store alternatives if provided
      if (llmResult.alternatives?.length) {
        const alternatives = llmResult.alternatives.map((alt) => ({
          product_id: product.id,
          alt_name: alt.name,
          alt_url: "", // Would need to be populated
          co2e_kg: product.total * (1 - alt.carbonReduction / 100), // Rough estimate
          savings_percent: alt.carbonReduction,
        }));

        await supabase.from("product_alternatives").insert(alternatives);
      }
    }
  }
}

// Get category-based estimate for immediate use
function getCategoryBasedEstimate(
  category: string,
  price: number,
  quantity: number
): number {
  const baseScores = {
    Electronics: 0.008,
    Fashion: 0.006,
    "Health & Personal Care": 0.003,
    "Home & Garden": 0.004,
    Other: 0.005,
  };

  const multiplier = baseScores[category as keyof typeof baseScores] || 0.005;
  return Math.max(0.5, Math.min(15, price * multiplier * quantity));
}

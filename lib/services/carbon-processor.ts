import { createClient } from "@/lib/supabase/client";

export interface ProductForEstimation {
  id: string;
  name: string;
  category: string;
  total: number;
  quantity: number;
}

export interface CarbonEstimate {
  productId: string;
  estimatedCo2eKg: number;
  confidence: number;
  method: "ai" | "category";
  reasoning?: string;
}

// Main function to process all products and ensure they have carbon estimates
export async function processAllProductCarbonEstimates(): Promise<{
  success: boolean;
  totalProducts: number;
  alreadyEstimated: number;
  newlyEstimated: number;
  errors: number;
}> {
  const supabase = createClient();

  try {
    console.log("🔍 Starting carbon estimation process...");

    // 1. Get all products that don't have AI estimates yet
    const { data: productsNeedingEstimates, error: fetchError } = await supabase
      .from("transaction_products")
      .select(
        `
        id,
        name,
        category,
        total,
        quantity,
        emissions_estimates!left(id, method)
      `
      )
      .is("emissions_estimates.id", null); // Only products without estimates

    if (fetchError) {
      throw new Error(`Failed to fetch products: ${fetchError.message}`);
    }

    const totalProducts = await getTotalProductCount();
    const alreadyEstimated =
      totalProducts - (productsNeedingEstimates?.length || 0);

    console.log(`📊 Found ${totalProducts} total products`);
    console.log(`✅ ${alreadyEstimated} already have estimates`);
    console.log(
      `🔄 ${productsNeedingEstimates?.length || 0} need new estimates`
    );

    if (!productsNeedingEstimates || productsNeedingEstimates.length === 0) {
      console.log("🎉 All products already have carbon estimates!");
      return {
        success: true,
        totalProducts,
        alreadyEstimated,
        newlyEstimated: 0,
        errors: 0,
      };
    }

    // 2. Process products in batches through AI
    const batchSize = 5; // Process 5 products at a time
    let newlyEstimated = 0;
    let errors = 0;

    for (let i = 0; i < productsNeedingEstimates.length; i += batchSize) {
      const batch = productsNeedingEstimates.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(
        productsNeedingEstimates.length / batchSize
      );

      console.log(
        `🤖 Processing AI batch ${batchNum}/${totalBatches}: ${batch
          .map((p: any) => p.name.substring(0, 30))
          .join(", ")}`
      );

      try {
        // Get AI estimates for this batch
        const estimates = await getAIEstimatesForBatch(batch);

        // Store estimates in database
        const storeResults = await storeEstimatesInDatabase(estimates);

        newlyEstimated += storeResults.success;
        errors += storeResults.errors;

        console.log(
          `✅ Batch ${batchNum} complete: ${storeResults.success} success, ${storeResults.errors} errors`
        );
      } catch (batchError) {
        console.error(`❌ Batch ${batchNum} failed:`, batchError);
        errors += batch.length;
      }

      // Small delay to respect API rate limits
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log(
      `🎉 Carbon estimation complete: ${newlyEstimated} new estimates, ${errors} errors`
    );

    return {
      success: true,
      totalProducts,
      alreadyEstimated,
      newlyEstimated,
      errors,
    };
  } catch (error) {
    console.error("❌ Carbon estimation process failed:", error);
    return {
      success: false,
      totalProducts: 0,
      alreadyEstimated: 0,
      newlyEstimated: 0,
      errors: 1,
    };
  }
}

// Get AI estimates for a batch of products
async function getAIEstimatesForBatch(
  products: any[]
): Promise<CarbonEstimate[]> {
  const estimates: CarbonEstimate[] = [];

  for (const product of products) {
    try {
      // Call your AI API for carbon estimation
      const aiEstimate = await callAIForCarbonEstimate(product);
      estimates.push(aiEstimate);
    } catch (error) {
      console.error(`AI estimation failed for ${product.name}:`, error);

      // Fallback to category-based estimate
      const categoryEstimate = getCategoryBasedEstimate(product);
      estimates.push(categoryEstimate);
    }
  }

  return estimates;
}

// Call AI API for carbon estimation
async function callAIForCarbonEstimate(product: any): Promise<CarbonEstimate> {
  const response = await fetch("/api/llm/carbon-estimate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: `Estimate the carbon footprint for this product purchase:
      
Product: ${product.name}
Category: ${product.category}
Price: $${product.total}
Quantity: ${product.quantity}

Please provide a realistic CO2 equivalent estimate in kg, considering manufacturing, packaging, and shipping.`,
      product: {
        name: product.name,
        category: product.category,
        price: product.total,
        quantity: product.quantity,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`AI API call failed: ${response.statusText}`);
  }

  const result = await response.json();

  return {
    productId: product.id,
    estimatedCo2eKg: result.estimatedCo2eKg,
    confidence: result.confidence,
    method: "ai",
    reasoning: result.reasoning,
  };
}

// Fallback category-based estimate
function getCategoryBasedEstimate(product: any): CarbonEstimate {
  const baseScores = {
    Electronics: 0.012,
    Fashion: 0.008,
    "Health & Personal Care": 0.004,
    "Home & Garden": 0.006,
    Other: 0.007,
  };

  const multiplier =
    baseScores[product.category as keyof typeof baseScores] || 0.007;
  const estimate = Math.max(0.5, Math.min(15, product.total * multiplier));

  return {
    productId: product.id,
    estimatedCo2eKg: Math.round(estimate * 10) / 10,
    confidence: 60,
    method: "category",
  };
}

// Store estimates in database
async function storeEstimatesInDatabase(estimates: CarbonEstimate[]): Promise<{
  success: number;
  errors: number;
}> {
  const supabase = createClient();
  let success = 0;
  let errors = 0;

  for (const estimate of estimates) {
    try {
      const { error } = await supabase.from("emissions_estimates").insert({
        product_id: estimate.productId,
        factor_source:
          estimate.method === "ai" ? "ai-openai" : "category-fallback",
        factor_id: `${estimate.method}-${estimate.productId}`,
        method: estimate.method,
        estimated_co2e_kg: estimate.estimatedCo2eKg,
        confidence: estimate.confidence,
      });

      if (error) {
        console.error(
          `Failed to store estimate for ${estimate.productId}:`,
          error
        );
        errors++;
      } else {
        success++;
      }
    } catch (error) {
      console.error(
        `Exception storing estimate for ${estimate.productId}:`,
        error
      );
      errors++;
    }
  }

  return { success, errors };
}

// Get total product count
async function getTotalProductCount(): Promise<number> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("transaction_products")
    .select("*", { count: "exact", head: true });

  return count || 0;
}

// Trigger carbon estimation process (can be called from UI)
export async function triggerCarbonEstimation(): Promise<void> {
  console.log("🚀 Triggering carbon estimation process...");

  // Run in background
  setTimeout(async () => {
    try {
      await processAllProductCarbonEstimates();
    } catch (error) {
      console.error("Background carbon estimation failed:", error);
    }
  }, 1000);
}

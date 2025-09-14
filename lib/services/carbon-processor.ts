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

// FIXED: Main function with corrected query logic and safe database operations
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

    // FIXED: Use two separate queries instead of problematic LEFT JOIN
    console.log("📋 Fetching all products...");
    const { data: allProducts, error: productsError } = await supabase
      .from("transaction_products")
      .select("id, name, category, total, quantity");

    if (productsError) {
      throw new Error(`Failed to fetch products: ${productsError.message}`);
    }

    console.log("📋 Fetching existing estimates...");
    const { data: existingEstimates, error: estimatesError } = await supabase
      .from("emissions_estimates")
      .select("product_id");

    if (estimatesError) {
      throw new Error(`Failed to fetch estimates: ${estimatesError.message}`);
    }

    // FIXED: Find products that don't have estimates using Set for efficiency
    const productsWithEstimates = new Set(
      existingEstimates?.map(e => e.product_id) || []
    );
    
    const productsNeedingEstimates = allProducts?.filter(
      p => !productsWithEstimates.has(p.id)
    ) || [];

    const totalProducts = allProducts?.length || 0;
    const alreadyEstimated = existingEstimates?.length || 0;

    console.log(`📊 Found ${totalProducts} total products`);
    console.log(`✅ ${alreadyEstimated} already have estimates`);
    console.log(`🔄 ${productsNeedingEstimates.length} need new estimates`);

    if (productsNeedingEstimates.length === 0) {
      console.log("🎉 All products already have carbon estimates!");
      return {
        success: true,
        totalProducts,
        alreadyEstimated,
        newlyEstimated: 0,
        errors: 0,
      };
    }

    // FIXED: Process products in smaller batches to avoid timeouts
    const batchSize = 3; // Reduced batch size for safety
    let newlyEstimated = 0;
    let errors = 0;

    for (let i = 0; i < productsNeedingEstimates.length; i += batchSize) {
      const batch = productsNeedingEstimates.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(productsNeedingEstimates.length / batchSize);

      console.log(
        `🤖 Processing AI batch ${batchNum}/${totalBatches}: ${batch
          .map((p: any) => p.name.substring(0, 30))
          .join(", ")}`
      );

      try {
        // Get AI estimates for this batch
        const estimates = await getAIEstimatesForBatch(batch);

        // Store estimates in database safely
        const storeResults = await storeEstimatesInDatabaseSafe(estimates);

        newlyEstimated += storeResults.success;
        errors += storeResults.errors;

        console.log(
          `✅ Batch ${batchNum} complete: ${storeResults.success} success, ${storeResults.errors} errors`
        );
      } catch (batchError) {
        console.error(`❌ Batch ${batchNum} failed:`, batchError);
        errors += batch.length;
      }

      // Longer delay to respect API rate limits and prevent timeouts
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    console.log(
      `🎉 Carbon estimation complete: ${newlyEstimated} new estimates, ${errors} errors`
    );

    // FIXED: Trigger UI refresh after completion
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('carbonEstimationComplete', {
        detail: { newlyEstimated, errors }
      }));
    }

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
async function getAIEstimatesForBatch(products: any[]): Promise<CarbonEstimate[]> {
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

  const multiplier = baseScores[product.category as keyof typeof baseScores] || 0.007;
  const estimate = Math.max(0.5, Math.min(15, product.total * multiplier));

  return {
    productId: product.id,
    estimatedCo2eKg: Math.round(estimate * 10) / 10,
    confidence: 60,
    method: "category",
  };
}

// FIXED: Store estimates in database with simple insert (no upsert)
async function storeEstimatesInDatabaseSafe(estimates: CarbonEstimate[]): Promise<{
  success: number;
  errors: number;
}> {
  const supabase = createClient();
  let success = 0;
  let errors = 0;

  for (const estimate of estimates) {
    try {
      // FIXED: Use simple insert instead of problematic upsert
      const { error } = await supabase
        .from("emissions_estimates")
        .insert({
          product_id: estimate.productId,
          factor_source: estimate.method === "ai" ? "ai-openai" : "category-fallback",
          factor_id: `${estimate.method}-${estimate.productId}`,
          method: estimate.method,
          estimated_co2e_kg: estimate.estimatedCo2eKg,
          confidence: estimate.confidence,
        });

      if (error) {
        console.error(`Failed to store estimate for ${estimate.productId}:`, error);
        errors++;
      } else {
        success++;
        console.log(`✅ Stored estimate for ${estimate.productId}: ${estimate.estimatedCo2eKg} kg CO2`);
      }
    } catch (error) {
      console.error(`Exception storing estimate for ${estimate.productId}:`, error);
      errors++;
    }
  }

  return { success, errors };
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

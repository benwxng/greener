import { createClient } from "@/lib/supabase/client";
import { Purchase } from "@/lib/types";

// Fetch products from database with their carbon estimates (simplified approach)
export async function getDatabasePurchases(): Promise<Purchase[]> {
  const supabase = createClient();

  try {
    console.log("Fetching products from database...");

    // First, fetch all products
    const { data: products, error: productsError } = await supabase
      .from("transaction_products")
      .select("*")
      .order("created_at", { ascending: false }); // Most recent first

    if (productsError) {
      console.error("Error fetching products:", productsError);
      return [];
    }

    if (!products || products.length === 0) {
      console.log("No products found in database");
      return [];
    }

    console.log(`Fetched ${products.length} products from database`);

    // Then, fetch all estimates separately
    const { data: estimates, error: estimatesError } = await supabase
      .from("emissions_estimates")
      .select("*");

    if (estimatesError) {
      console.warn(
        "Error fetching estimates (using category fallback):",
        estimatesError
      );
    }

    console.log(
      `Fetched ${estimates?.length || 0} carbon estimates from database`
    );

    // Create a map of estimates by product_id for quick lookup
    const estimatesMap = new Map();
    if (estimates) {
      estimates.forEach((estimate: any) => {
        if (!estimatesMap.has(estimate.product_id)) {
          estimatesMap.set(estimate.product_id, []);
        }
        estimatesMap.get(estimate.product_id).push(estimate);
      });
    }

    // Transform database products to Purchase interface
    const purchases: Purchase[] = products.map(
      (product: any, index: number) => {
        // Get the best carbon estimate available
        const productEstimates = estimatesMap.get(product.id) || [];
        const carbonEstimate = getBestCarbonEstimate(product, productEstimates);

        return {
          id: index + 1, // Simple incrementing ID for UI
          item:
            product.quantity > 1
              ? `${product.name} (×${product.quantity})`
              : product.name,
          store: "Amazon",
          category: product.category || "Other",
          amount: product.total || 0,
          carbonScore: carbonEstimate.value,
          date: product.created_at
            ? product.created_at.split("T")[0]
            : new Date().toISOString().split("T")[0],
          description:
            product.quantity > 1
              ? `${product.name} (${product.quantity} items) from Amazon`
              : `${product.name} from Amazon`,
          alternatives: Math.floor(Math.random() * 8) + 2, // Random between 2-9 for now
        };
      }
    );

    return purchases;
  } catch (error) {
    console.error("Database fetch error:", error);
    return [];
  }
}

// Get the best available carbon estimate for a product
function getBestCarbonEstimate(
  product: any,
  estimates: any[]
): { value: number; method: string; confidence: number } {
  if (estimates.length === 0) {
    // No estimates yet, use category-based fallback
    const fallbackEstimate = estimateCarbonScore(
      product.category || "Other",
      product.total || 0
    );
    return {
      value: fallbackEstimate,
      method: "category-fallback",
      confidence: 50,
    };
  }

  // Find the best estimate (prefer AI over category)
  const aiEstimate = estimates.find((e: any) => e.method === "ai");
  const categoryEstimate = estimates.find((e: any) => e.method === "category");

  const bestEstimate = aiEstimate || categoryEstimate || estimates[0];

  return {
    value: bestEstimate.estimated_co2e_kg || 0,
    method: bestEstimate.method || "unknown",
    confidence: bestEstimate.confidence || 50,
  };
}

// Get cached metrics from database products
export async function getDatabaseMetrics() {
  const purchases = await getDatabasePurchases();

  if (purchases.length === 0) {
    return {
      currentScore: 0,
      totalSpent: 0,
      totalPurchases: 0,
      totalEmissions: 0,
      averageScore: 0,
      categoryData: [],
      carbonTrendData: [],
      recentPurchases: [],
    };
  }

  const totalSpent = purchases.reduce((sum, p) => sum + p.amount, 0);
  const totalEmissions = purchases.reduce((sum, p) => sum + p.carbonScore, 0);
  const currentScore = totalEmissions;
  const averageScore = totalEmissions / purchases.length;

  // Group by category for category data
  const categoryTotals: {
    [key: string]: { emissions: number; count: number };
  } = {};
  purchases.forEach((p) => {
    if (!categoryTotals[p.category]) {
      categoryTotals[p.category] = { emissions: 0, count: 0 };
    }
    categoryTotals[p.category].emissions += p.carbonScore;
    categoryTotals[p.category].count += 1;
  });

  const categoryData = Object.entries(categoryTotals)
    .map(([category, data]) => ({
      category,
      emissions: Math.round(data.emissions * 10) / 10,
      percentage: Math.round((data.emissions / totalEmissions) * 100),
    }))
    .sort((a, b) => b.emissions - a.emissions);

  // Generate trend data (mock for now, but based on real total)
  const carbonTrendData = [
    {
      month: "Jan",
      emissions: Math.round(currentScore * 1.2 * 10) / 10,
      target: 10,
    },
    {
      month: "Feb",
      emissions: Math.round(currentScore * 1.1 * 10) / 10,
      target: 10,
    },
    {
      month: "Mar",
      emissions: Math.round(currentScore * 1.05 * 10) / 10,
      target: 10,
    },
    {
      month: "Apr",
      emissions: Math.round(currentScore * 1.02 * 10) / 10,
      target: 10,
    },
    {
      month: "May",
      emissions: Math.round(currentScore * 1.01 * 10) / 10,
      target: 10,
    },
    { month: "Jun", emissions: Math.round(currentScore * 10) / 10, target: 10 },
  ];

  // Get recent purchases (last 3)
  const recentPurchases = purchases.slice(0, 3);

  return {
    currentScore: Math.round(currentScore * 10) / 10,
    totalSpent: Math.round(totalSpent * 100) / 100,
    totalPurchases: purchases.length,
    totalEmissions: Math.round(totalEmissions * 10) / 10,
    averageScore: Math.round(averageScore * 10) / 10,
    categoryData,
    carbonTrendData,
    recentPurchases,
  };
}

// Simple carbon score estimation (fallback when no database estimate exists)
function estimateCarbonScore(category: string, price: number): number {
  const baseScores = {
    Electronics: 0.008,
    Fashion: 0.006,
    "Health & Personal Care": 0.003,
    "Home & Garden": 0.004,
    Other: 0.005,
  };

  const multiplier = baseScores[category as keyof typeof baseScores] || 0.005;
  const score = price * multiplier;

  // Add some randomness and cap between 0.5 and 15
  const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
  return (
    Math.round(Math.max(0.5, Math.min(15, score * randomFactor)) * 10) / 10
  );
}

// Check if database has data
export async function hasDatabaseData(): Promise<boolean> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("transaction_products")
      .select("id")
      .limit(1);

    return !error && data && data.length > 0;
  } catch (error) {
    return false;
  }
}

// Trigger carbon estimation for all products
export async function startCarbonEstimationProcess(): Promise<void> {
  const { processAllProductCarbonEstimates } = await import(
    "./carbon-processor"
  );

  // Run in background
  setTimeout(async () => {
    try {
      console.log("🚀 Starting background carbon estimation...");
      await processAllProductCarbonEstimates();
      console.log("✅ Background carbon estimation complete");

      // Optionally trigger a data refresh in the UI
      window.dispatchEvent(new CustomEvent("carbonEstimationComplete"));
    } catch (error) {
      console.error("❌ Background carbon estimation failed:", error);
    }
  }, 2000);
}

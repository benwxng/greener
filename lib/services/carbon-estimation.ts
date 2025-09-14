import { createClient } from "@/lib/supabase/client";

export interface CarbonEstimationRequest {
  productName: string;
  category: string;
  price: number;
  quantity: number;
}

export interface CarbonEstimationResult {
  estimatedCo2eKg: number;
  confidence: number;
  method: "llm" | "category" | "cached";
  reasoning?: string;
  alternatives?: Array<{
    name: string;
    carbonReduction: number;
    priceChange: number;
    sustainabilityScore: number;
  }>;
}

// Fallback category-based estimation (for immediate display)
const getCategoryBasedEstimate = (
  category: string,
  price: number,
  quantity: number
): number => {
  const baseScores = {
    Electronics: 0.008,
    Fashion: 0.006,
    "Health & Personal Care": 0.003,
    "Home & Garden": 0.004,
    Other: 0.005,
  };

  const multiplier = baseScores[category as keyof typeof baseScores] || 0.005;
  return Math.max(0.5, Math.min(15, price * multiplier * quantity));
};

// LLM-powered carbon estimation
export async function estimateCarbonFootprint(
  request: CarbonEstimationRequest
): Promise<CarbonEstimationResult> {
  const supabase = createClient();

  // First, check if we have a cached estimate
  const { data: cached } = await supabase
    .from("emissions_estimates")
    .select("*")
    .eq("factor_id", `${request.productName}-${request.price}`)
    .single();

  if (cached) {
    return {
      estimatedCo2eKg: cached.estimated_co2e_kg,
      confidence: cached.confidence,
      method: "cached",
    };
  }

  try {
    // Call LLM API for carbon estimation
    const llmEstimate = await callLLMForCarbonEstimate(request);

    // Cache the result in database
    await supabase.from("emissions_estimates").insert({
      factor_id: `${request.productName}-${request.price}`,
      factor_source: "llm-openai",
      method: "llm",
      estimated_co2e_kg: llmEstimate.estimatedCo2eKg,
      confidence: llmEstimate.confidence,
    });

    return llmEstimate;
  } catch (error) {
    console.error("LLM estimation failed, using category fallback:", error);

    // Fallback to category-based estimation
    const categoryEstimate = getCategoryBasedEstimate(
      request.category,
      request.price,
      request.quantity
    );

    return {
      estimatedCo2eKg: Math.round(categoryEstimate * 10) / 10,
      confidence: 60,
      method: "category",
    };
  }
}

// LLM API call (using OpenAI or similar)
async function callLLMForCarbonEstimate(
  request: CarbonEstimationRequest
): Promise<CarbonEstimationResult> {
  const prompt = `
Estimate the carbon footprint for this product purchase:

Product: ${request.productName}
Category: ${request.category}
Price: $${request.price}
Quantity: ${request.quantity}

Please provide:
1. Estimated CO2 equivalent in kg (considering manufacturing, shipping, packaging)
2. Confidence level (0-100)
3. Brief reasoning for the estimate
4. 2-3 sustainable alternatives with lower carbon footprint

Respond in JSON format:
{
  "estimatedCo2eKg": number,
  "confidence": number,
  "reasoning": "string",
  "alternatives": [
    {
      "name": "string",
      "carbonReduction": number,
      "priceChange": number,
      "sustainabilityScore": number
    }
  ]
}
`;

  // This would call your preferred LLM API
  // For now, I'll show the structure you'd use:

  const response = await fetch("/api/llm/carbon-estimate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, product: request }),
  });

  if (!response.ok) {
    throw new Error("LLM API call failed");
  }

  const result = await response.json();

  return {
    estimatedCo2eKg: result.estimatedCo2eKg,
    confidence: result.confidence,
    method: "llm",
    reasoning: result.reasoning,
    alternatives: result.alternatives,
  };
}

// Batch process multiple products
export async function batchEstimateCarbonFootprints(
  requests: CarbonEstimationRequest[]
): Promise<CarbonEstimationResult[]> {
  // Process in chunks to avoid overwhelming the LLM API
  const chunkSize = 5;
  const results: CarbonEstimationResult[] = [];

  for (let i = 0; i < requests.length; i += chunkSize) {
    const chunk = requests.slice(i, i + chunkSize);
    const chunkResults = await Promise.all(
      chunk.map((request) => estimateCarbonFootprint(request))
    );
    results.push(...chunkResults);

    // Small delay to respect API rate limits
    if (i + chunkSize < requests.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return results;
}

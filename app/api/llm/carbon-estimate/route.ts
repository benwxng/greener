import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let product: any;

  try {
    const { prompt, product: productData } = await request.json();
    product = productData; // Store for use in catch block

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OpenAI API key not configured, using fallback estimation");
      return NextResponse.json(generateFallbackResponse(product));
    }

    console.log(`🤖 Requesting AI carbon estimate for: ${product.name}`);

    // Call OpenAI API for real carbon estimation
    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini", // Use the more cost-effective model
          messages: [
            {
              role: "system",
              content: `You are an expert environmental scientist specializing in product lifecycle carbon footprint analysis. 

Your task is to estimate the total carbon footprint (CO2 equivalent in kg) for consumer products, considering:
- Manufacturing/production emissions
- Raw material extraction and processing
- Packaging materials
- Transportation/shipping (assume average global supply chain)
- End-of-life disposal impact

Provide realistic, research-based estimates. Be conservative but accurate.

Respond ONLY in valid JSON format with this exact structure:
{
  "estimatedCo2eKg": number,
  "confidence": number (0-100),
  "reasoning": "brief explanation of calculation factors",
  "alternatives": [
    {
      "name": "specific sustainable alternative product",
      "carbonReduction": number (percentage reduction),
      "priceChange": number (percentage price change, negative for cheaper),
      "sustainabilityScore": number (1-10)
    }
  ]
}`,
            },
            {
              role: "user",
              content: `Analyze this product purchase:

Product Name: ${product.name}
Category: ${product.category}
Purchase Price: $${product.price}
Quantity: ${product.quantity}

Estimate the total carbon footprint in kg CO2 equivalent for this purchase.`,
            },
          ],
          temperature: 0.2, // Low temperature for consistent estimates
          max_tokens: 800,
          response_format: { type: "json_object" }, // Ensure JSON response
        }),
      }
    );

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error("OpenAI API error:", openaiResponse.status, errorText);
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const openaiResult = await openaiResponse.json();

    if (
      !openaiResult.choices ||
      !openaiResult.choices[0] ||
      !openaiResult.choices[0].message
    ) {
      throw new Error("Invalid OpenAI response structure");
    }

    let llmResponse;
    try {
      llmResponse = JSON.parse(openaiResult.choices[0].message.content);
    } catch (parseError) {
      console.error(
        "Failed to parse OpenAI JSON response:",
        openaiResult.choices[0].message.content
      );
      throw new Error("Invalid JSON response from OpenAI");
    }

    // Validate and sanitize the response
    const sanitizedResponse = {
      estimatedCo2eKg: Math.max(
        0.1,
        Math.min(50, llmResponse.estimatedCo2eKg || 1)
      ),
      confidence: Math.max(50, Math.min(100, llmResponse.confidence || 75)),
      reasoning: llmResponse.reasoning || "AI-based lifecycle analysis",
      alternatives: (llmResponse.alternatives || []).slice(0, 3), // Limit to 3 alternatives
    };

    console.log(
      `✅ AI estimate for ${product.name}: ${sanitizedResponse.estimatedCo2eKg} kg CO2 (${sanitizedResponse.confidence}% confidence)`
    );

    return NextResponse.json(sanitizedResponse);
  } catch (error) {
    console.error("LLM API error:", error);

    // Fallback to category-based estimation if AI fails
    console.log("🔄 Falling back to category-based estimation");
    const fallbackResponse = generateFallbackResponse(
      product || { category: "Other", price: 0 }
    );

    return NextResponse.json(fallbackResponse);
  }
}

// Fallback response when AI is unavailable or fails
function generateFallbackResponse(product: any) {
  const category = product.category || "Other";
  const price = product.price || 0;

  // Category-based estimates with realistic multipliers
  const categoryMultipliers = {
    Electronics: 0.015, // Higher carbon intensity for electronics
    Fashion: 0.012,
    "Health & Personal Care": 0.006,
    "Home & Garden": 0.008,
    Other: 0.01,
  };

  const multiplier =
    categoryMultipliers[category as keyof typeof categoryMultipliers] || 0.01;
  const baseEstimate = Math.max(0.5, Math.min(20, price * multiplier));

  // Generate category-appropriate alternatives
  const alternativesByCategory = {
    Electronics: [
      {
        name: "Refurbished/certified pre-owned version",
        carbonReduction: 65,
        priceChange: -30,
        sustainabilityScore: 8.5,
      },
      {
        name: "Energy Star certified alternative",
        carbonReduction: 25,
        priceChange: 5,
        sustainabilityScore: 7.8,
      },
    ],
    Fashion: [
      {
        name: "Organic/sustainable material version",
        carbonReduction: 45,
        priceChange: 15,
        sustainabilityScore: 9.0,
      },
      {
        name: "Second-hand/vintage alternative",
        carbonReduction: 85,
        priceChange: -50,
        sustainabilityScore: 9.5,
      },
    ],
    "Health & Personal Care": [
      {
        name: "Organic/natural alternative",
        carbonReduction: 35,
        priceChange: 20,
        sustainabilityScore: 8.2,
      },
      {
        name: "Concentrated/refillable version",
        carbonReduction: 50,
        priceChange: -15,
        sustainabilityScore: 8.8,
      },
    ],
    "Home & Garden": [
      {
        name: "Sustainable material alternative",
        carbonReduction: 40,
        priceChange: 10,
        sustainabilityScore: 8.3,
      },
      {
        name: "Local/domestic version",
        carbonReduction: 30,
        priceChange: 5,
        sustainabilityScore: 7.9,
      },
    ],
  };

  const alternatives = alternativesByCategory[
    category as keyof typeof alternativesByCategory
  ] || [
    {
      name: "Eco-friendly alternative",
      carbonReduction: 35,
      priceChange: 10,
      sustainabilityScore: 8.0,
    },
  ];

  return {
    estimatedCo2eKg: Math.round(baseEstimate * 10) / 10,
    confidence: 65, // Lower confidence for category-based
    reasoning: `Category-based estimate for ${category.toLowerCase()} products, considering typical manufacturing and supply chain emissions.`,
    alternatives: alternatives,
  };
}

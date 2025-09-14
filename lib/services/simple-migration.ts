import { createClient } from "@/lib/supabase/client";
import amazonData from "../../amazonData.json";

// Simple product migration - just get the data in first
export async function simpleProductMigration(userId: string) {
  const supabase = createClient();

  try {
    console.log("Testing database connection...");

    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from("users")
      .select("count")
      .limit(1);

    if (testError) {
      throw new Error(`Database connection failed: ${testError.message}`);
    }

    console.log("Database connection successful");

    // Create a simple flat table for products if it doesn't exist
    const { error: createTableError } = await supabase.rpc(
      "create_simple_products_table"
    );

    // If RPC doesn't work, we'll insert directly into existing tables

    console.log("Starting product insertion...");

    const products: any[] = [];
    let productId = 1;

    // Extract all products from Amazon data
    amazonData.transactions.forEach((transaction, transactionIndex) => {
      transaction.products.forEach((product, productIndex) => {
        console.log(`Processing: ${product.name}`);

        products.push({
          id: productId++,
          name: product.name,
          price: parseFloat(product.price.total),
          quantity: product.quantity,
          category: categorizeProduct(product.name),
          date: transaction.datetime.split("T")[0],
          transaction_id: transaction.id,
          external_id: product.external_id,
          user_id: userId,
        });
      });
    });

    console.log(`Prepared ${products.length} products for insertion`);

    // Try to insert into a simple structure first
    const { data: insertedProducts, error: insertError } = await supabase
      .from("simple_products")
      .insert(products)
      .select();

    if (insertError) {
      console.log(
        "Simple products table not found, using complex structure..."
      );
      // Fall back to complex migration
      return await complexMigration(userId, products);
    }

    console.log(
      `Successfully inserted ${insertedProducts?.length || 0} products`
    );

    return {
      success: true,
      totalProducts: products.length,
      processedProducts: insertedProducts?.length || 0,
    };
  } catch (error) {
    console.error("Simple migration failed:", error);
    return {
      success: false,
      totalProducts: 0,
      processedProducts: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Fallback to complex migration
async function complexMigration(userId: string, products: any[]) {
  const supabase = createClient();

  // Just insert products directly without complex relationships
  let successCount = 0;

  for (const product of products) {
    try {
      const { error } = await supabase.from("transaction_products").insert({
        external_id: product.external_id,
        name: product.name,
        quantity: product.quantity,
        unit_price: product.price / product.quantity,
        total: product.price,
        category: product.category,
        created_at: new Date().toISOString(),
      });

      if (!error) {
        successCount++;
      } else {
        console.error(`Failed to insert ${product.name}:`, error);
      }
    } catch (error) {
      console.error(`Error inserting ${product.name}:`, error);
    }
  }

  return {
    success: successCount > 0,
    totalProducts: products.length,
    processedProducts: successCount,
  };
}

// Simple category mapping
function categorizeProduct(productName: string): string {
  const name = productName.toLowerCase();

  if (
    name.includes("phone") ||
    name.includes("laptop") ||
    name.includes("camera") ||
    name.includes("headset") ||
    name.includes("gpu") ||
    name.includes("mouse") ||
    name.includes("blender") ||
    name.includes("thermometer")
  ) {
    return "Electronics";
  }

  if (
    name.includes("shirt") ||
    name.includes("socks") ||
    name.includes("sunglasses") ||
    name.includes("makeup") ||
    name.includes("shampoo")
  ) {
    return "Fashion";
  }

  if (
    name.includes("vitamin") ||
    name.includes("detergent") ||
    name.includes("drops") ||
    name.includes("toothbrush")
  ) {
    return "Health & Personal Care";
  }

  if (
    name.includes("pot") ||
    name.includes("mat") ||
    name.includes("bottle") ||
    name.includes("sheet")
  ) {
    return "Home & Garden";
  }

  return "Other";
}

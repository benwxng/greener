import { createClient } from "@/lib/supabase/client";
import amazonData from "../../amazonData.json";

// Very simple migration - just get the products in
export async function directProductMigration(userId: string) {
  const supabase = createClient();

  try {
    console.log("Starting direct product migration...");

    // Extract all products into a flat array with minimal required fields
    const allProducts: any[] = [];

    amazonData.transactions.forEach((transaction) => {
      transaction.products.forEach((product) => {
        allProducts.push({
          external_id: product.external_id,
          name: product.name,
          quantity: product.quantity,
          unit_price: parseFloat(product.price.unit_price),
          total: parseFloat(product.price.total),
          url: product.url,
          category: categorizeProduct(product.name),
          auto_categorized: true,
          transaction_id_original: transaction.id, // Store original transaction ID as text
          // Remove problematic date field for now
        });
      });
    });

    console.log(`Prepared ${allProducts.length} products for direct insertion`);

    // Insert products in small batches to avoid timeouts
    const batchSize = 5; // Smaller batches
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < allProducts.length; i += batchSize) {
      const batch = allProducts.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(allProducts.length / batchSize);

      console.log(
        `Inserting batch ${batchNum}/${totalBatches}: ${batch
          .map((p) => p.name.substring(0, 30))
          .join(", ")}`
      );

      try {
        const { data, error } = await supabase
          .from("transaction_products")
          .insert(batch)
          .select();

        if (error) {
          console.error(`Batch ${batchNum} failed:`, error);
          errors.push(`Batch ${batchNum}: ${error.message}`);
          errorCount += batch.length;
        } else {
          console.log(
            `Batch ${batchNum} success: ${data?.length || 0} products inserted`
          );
          successCount += data?.length || 0;
        }
      } catch (batchError) {
        console.error(`Batch ${batchNum} exception:`, batchError);
        errors.push(
          `Batch ${batchNum}: ${
            batchError instanceof Error ? batchError.message : "Unknown error"
          }`
        );
        errorCount += batch.length;
      }

      // Small delay between batches to avoid overwhelming the database
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    console.log(
      `Migration complete: ${successCount} success, ${errorCount} errors`
    );
    if (errors.length > 0) {
      console.log("Errors encountered:", errors);
    }

    return {
      success: successCount > 0,
      totalProducts: allProducts.length,
      processedProducts: successCount,
      errors: errorCount,
      errorDetails:
        errors.length > 0 ? errors.slice(0, 3).join("; ") : undefined,
    };
  } catch (error) {
    console.error("Direct migration failed:", error);
    return {
      success: false,
      totalProducts: 0,
      processedProducts: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
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
    name.includes("thermometer") ||
    name.includes("smart")
  ) {
    return "Electronics";
  }

  if (
    name.includes("shirt") ||
    name.includes("socks") ||
    name.includes("sunglasses") ||
    name.includes("makeup") ||
    name.includes("shampoo") ||
    name.includes("mascara")
  ) {
    return "Fashion";
  }

  if (
    name.includes("vitamin") ||
    name.includes("detergent") ||
    name.includes("drops") ||
    name.includes("toothbrush") ||
    name.includes("dental") ||
    name.includes("moisturizer")
  ) {
    return "Health & Personal Care";
  }

  if (
    name.includes("pot") ||
    name.includes("mat") ||
    name.includes("bottle") ||
    name.includes("sheet") ||
    name.includes("flask") ||
    name.includes("tumbler")
  ) {
    return "Home & Garden";
  }

  return "Other";
}

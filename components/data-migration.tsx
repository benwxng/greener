"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/hooks/useAuth";
import { migrateAmazonDataWithLLM } from "@/lib/services/data-migration";
import { simpleProductMigration } from "@/lib/services/simple-migration";
import { directProductMigration } from "@/lib/services/direct-migration";
import {
  Database,
  Loader2,
  CheckCircle,
  AlertCircle,
  TestTube,
  Zap,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function DataMigration() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [result, setResult] = useState<any>(null);
  const [errorDetails, setErrorDetails] = useState<string>("");

  const handleMigration = async (
    type: "simple" | "direct" | "full" = "direct"
  ) => {
    if (!user) {
      setStatus("error");
      setErrorDetails("No user found. Please make sure you are logged in.");
      return;
    }

    setIsLoading(true);
    setStatus("processing");
    setProgress(0);
    setErrorDetails("");

    try {
      console.log(`Starting ${type} migration for user:`, user.id);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 15, 90));
      }, 300);

      let migrationResult;

      switch (type) {
        case "direct":
          migrationResult = await directProductMigration(user.id);
          break;
        case "simple":
          migrationResult = await simpleProductMigration(user.id);
          break;
        case "full":
          migrationResult = await migrateAmazonDataWithLLM(user.id);
          break;
      }

      clearInterval(progressInterval);
      setProgress(100);
      setResult(migrationResult);

      console.log("Migration result:", migrationResult);

      if (migrationResult.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorDetails(
          migrationResult.error ||
            "Migration completed but with errors. Check console for details."
        );
      }
    } catch (error) {
      console.error("Migration error:", error);
      setStatus("error");
      setErrorDetails(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
      setResult({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test database connection
  const testConnection = async () => {
    setErrorDetails("Testing database connection...");

    try {
      const supabase = createClient();

      // Test multiple tables
      const tests = [
        { table: "users", name: "Users table" },
        { table: "transaction_products", name: "Products table" },
        { table: "emissions_estimates", name: "Estimates table" },
      ];

      const results = [];

      for (const test of tests) {
        const { data, error } = await supabase
          .from(test.table)
          .select("count")
          .limit(1);
        results.push({
          table: test.name,
          success: !error,
          error: error?.message,
        });
      }

      const successfulTables = results.filter((r) => r.success).length;
      const failedTables = results.filter((r) => !r.success);

      if (successfulTables === tests.length) {
        setErrorDetails("✅ All database tables are working correctly!");
      } else {
        setErrorDetails(
          `⚠️ ${successfulTables}/${
            tests.length
          } tables working. Failed: ${failedTables
            .map((f) => `${f.table} (${f.error})`)
            .join(", ")}`
        );
      }

      setTimeout(() => setErrorDetails(""), 8000);
    } catch (error) {
      setErrorDetails(
        `Connection test failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  if (status === "success") {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-800">
              Migration Complete!
            </CardTitle>
          </div>
          <CardDescription className="text-green-700">
            Your Amazon data has been successfully migrated to the database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-green-700">
            <p>✅ {result?.totalProducts || 0} products found</p>
            <p>
              ✅ {result?.processedProducts || 0} products successfully migrated
            </p>
            {result?.errors > 0 && (
              <p>⚠️ {result.errors} products had errors</p>
            )}
            <p>✅ Individual products now stored in database</p>
            <p className="text-xs text-green-600 mt-2">
              Your individual products are now stored and ready for carbon
              analysis!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === "error") {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <CardTitle className="text-red-800">Migration Failed</CardTitle>
          </div>
          <CardDescription className="text-red-700">
            There was an error migrating your data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-red-700 bg-red-100 p-3 rounded border max-h-32 overflow-y-auto">
            <strong>Error Details:</strong>
            <br />
            {errorDetails || result?.error || "Unknown error occurred"}
          </div>
          <div className="text-xs text-red-600">
            💡 Try running the database fix script first, then use &apos;Direct
            Migration&apos;
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setStatus("idle")}
              variant="outline"
              size="sm"
            >
              Reset
            </Button>
            <Button onClick={testConnection} variant="outline" size="sm">
              <TestTube className="h-3 w-3 mr-1" />
              Test Database
            </Button>
            <Button
              onClick={() => handleMigration("direct")}
              variant="outline"
              size="sm"
            >
              <Zap className="h-3 w-3 mr-1" />
              Direct Migration
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Database className="h-5 w-5 text-blue-600" />
          <CardTitle>Migrate Amazon Data</CardTitle>
        </div>
        <CardDescription>
          Move your Amazon purchase data to the database. Try &apos;Direct
          Migration&apos; first for best results.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Processing your Amazon data...</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {progress < 30 && "Testing database connection..."}
              {progress >= 30 && progress < 60 && "Processing products..."}
              {progress >= 60 && progress < 90 && "Inserting into database..."}
              {progress >= 90 && "Finalizing migration..."}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {errorDetails && (
              <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded border">
                {errorDetails}
              </div>
            )}
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Extract ~40+ individual products from Amazon data</p>
              <p>• Store each product with category, price, and carbon data</p>
              <p>• Enable future LLM-powered enhancements</p>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={testConnection} variant="outline" size="sm">
                  <TestTube className="h-3 w-3 mr-1" />
                  Test Database
                </Button>
                <Button
                  onClick={() => handleMigration("direct")}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Direct Migration
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleMigration("simple")}
                  variant="outline"
                  size="sm"
                >
                  Simple Migration
                </Button>
                <Button
                  onClick={() => handleMigration("full")}
                  variant="outline"
                  size="sm"
                >
                  <Database className="h-3 w-3 mr-1" />
                  Full Migration
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Import amazonData for the component
import amazonData from "../amazonData.json";

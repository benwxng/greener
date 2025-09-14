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
import { Brain, Loader2, CheckCircle, AlertCircle, Zap } from "lucide-react";
import { processAllProductCarbonEstimates } from "@/lib/services/carbon-processor";

export function AIEstimationTrigger() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [result, setResult] = useState<any>(null);

  const startAIEstimation = async () => {
    setIsProcessing(true);
    setStatus("processing");
    setProgress(0);

    try {
      console.log("🚀 Starting AI carbon estimation process...");

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 90) return prev + 5;
          return prev;
        });
      }, 2000);

      const estimationResult = await processAllProductCarbonEstimates();

      clearInterval(progressInterval);
      setProgress(100);
      setResult(estimationResult);

      if (estimationResult.success) {
        setStatus("success");
        console.log("✅ AI estimation completed successfully");

        // Trigger data refresh
        window.dispatchEvent(new CustomEvent("carbonEstimationComplete"));
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("❌ AI estimation failed:", error);
      setStatus("error");
      setResult({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (status === "success") {
    return (
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-purple-800">
              AI Estimation Complete!
            </CardTitle>
          </div>
          <CardDescription className="text-purple-700">
            OpenAI has analyzed all your products for accurate carbon
            footprints.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-purple-700">
            <p>🔍 {result?.totalProducts || 0} total products</p>
            <p>✅ {result?.alreadyEstimated || 0} already had estimates</p>
            <p>🤖 {result?.newlyEstimated || 0} new AI estimates created</p>
            {result?.errors > 0 && (
              <p>⚠️ {result.errors} products used category fallback</p>
            )}
            <p className="text-xs text-purple-600 mt-2">
              All estimates are now cached - future loads will be instant!
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
            <CardTitle className="text-red-800">AI Estimation Failed</CardTitle>
          </div>
          <CardDescription className="text-red-700">
            There was an error during the AI estimation process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-700">
            {result?.error || "Unknown error occurred"}
          </p>
          <Button
            onClick={() => setStatus("idle")}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <CardTitle>AI Carbon Estimation</CardTitle>
        </div>
        <CardDescription>
          Use OpenAI to analyze each product and generate accurate carbon
          footprint estimates.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isProcessing ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">AI analyzing your products...</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {progress < 20 && "Checking existing estimates..."}
              {progress >= 20 &&
                progress < 60 &&
                "OpenAI analyzing products..."}
              {progress >= 60 && progress < 90 && "Caching results..."}
              {progress >= 90 && "Finalizing estimates..."}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                • Analyze each product with OpenAI for accurate carbon estimates
              </p>
              <p>
                • Cache results permanently (never re-estimate same products)
              </p>
              <p>• Generate sustainable product alternatives</p>
              <p>• Replace category estimates with AI-powered analysis</p>
            </div>
            <Button
              onClick={startAIEstimation}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <Brain className="h-4 w-4 mr-2" />
              Start AI Carbon Analysis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

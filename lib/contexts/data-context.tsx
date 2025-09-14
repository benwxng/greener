"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useState,
} from "react";
import { amazonPurchases } from "@/lib/amazon-data-transformer";
import {
  getDatabasePurchases,
  getDatabaseMetrics,
  hasDatabaseData,
  startCarbonEstimationProcess,
} from "@/lib/services/database-data";
import { Purchase } from "@/lib/types";

interface DataContextType {
  purchases: Purchase[];
  metrics: {
    currentScore: number;
    totalSpent: number;
    totalPurchases: number;
    categoryData: Array<{
      category: string;
      emissions: number;
      percentage: number;
    }>;
    carbonTrendData: Array<{
      month: string;
      emissions: number;
      target: number;
    }>;
    recentPurchases: Purchase[];
    totalEmissions: number;
    averageScore: number;
  };
  refreshData: () => void;
  isUsingDatabase: boolean;
  isLoading: boolean;
  carbonEstimationStatus: "idle" | "processing" | "complete";
  triggerEstimation: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isUsingDatabase, setIsUsingDatabase] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [databaseData, setDatabaseData] = useState<any>(null);
  const [carbonEstimationStatus, setCarbonEstimationStatus] = useState<
    "idle" | "processing" | "complete"
  >("idle");
  const [hasTriggeredEstimation, setHasTriggeredEstimation] = useState(false);

  // Check for database data on mount and when refresh is triggered
  useEffect(() => {
    const checkAndLoadData = async () => {
      setIsLoading(true);

      try {
        const hasData = await hasDatabaseData();
        console.log("Database has data:", hasData);

        if (hasData) {
          console.log("Loading data from database...");
          const dbMetrics = await getDatabaseMetrics();
          const dbPurchases = await getDatabasePurchases();

          setDatabaseData({
            purchases: dbPurchases,
            metrics: dbMetrics,
          });
          setIsUsingDatabase(true);

          // FIXED: Only trigger carbon estimation once per session
          if (carbonEstimationStatus === "idle" && !hasTriggeredEstimation) {
            console.log("🤖 Triggering automatic carbon estimation...");
            setCarbonEstimationStatus("processing");
            setHasTriggeredEstimation(true);
            startCarbonEstimationProcess();
          }
        } else {
          console.log("Using JSON data (no database data found)");
          setIsUsingDatabase(false);
          setDatabaseData(null);
        }
      } catch (error) {
        console.error("Error checking database data:", error);
        setIsUsingDatabase(false);
        setDatabaseData(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAndLoadData();
  }, [refreshKey, carbonEstimationStatus, hasTriggeredEstimation]);

  // Listen for carbon estimation completion
  useEffect(() => {
    const handleEstimationComplete = () => {
      console.log("🎉 Carbon estimation completed, refreshing data...");
      setCarbonEstimationStatus("complete");
      // FIXED: Delayed refresh to prevent infinite loop
      setTimeout(() => {
        setRefreshKey((prev) => prev + 1);
      }, 2000);
    };

    window.addEventListener(
      "carbonEstimationComplete",
      handleEstimationComplete
    );

    return () => {
      window.removeEventListener(
        "carbonEstimationComplete",
        handleEstimationComplete
      );
    };
  }, []);

  const processedData = useMemo(() => {
    // If we have database data, use it
    if (isUsingDatabase && databaseData) {
      console.log("Using database data for context");
      return {
        purchases: databaseData.purchases,
        metrics: databaseData.metrics,
        refreshData: () => setRefreshKey((prev) => prev + 1),
        isUsingDatabase: true,
        isLoading: false,
        carbonEstimationStatus,
        triggerEstimation: () => {
          if (carbonEstimationStatus === "idle") {
            setCarbonEstimationStatus("processing");
            setHasTriggeredEstimation(true);
            startCarbonEstimationProcess();
          }
        },
      };
    }

    // Otherwise use transformed Amazon data
    console.log("Using Amazon JSON data for context");
    const amazonMetrics = {
      currentScore: amazonPurchases.reduce((sum, p) => sum + p.carbonScore, 0),
      totalSpent: amazonPurchases.reduce((sum, p) => sum + p.amount, 0),
      totalPurchases: amazonPurchases.length,
      totalEmissions: amazonPurchases.reduce(
        (sum, p) => sum + p.carbonScore,
        0
      ),
      averageScore:
        amazonPurchases.reduce((sum, p) => sum + p.carbonScore, 0) /
        amazonPurchases.length,
      categoryData: [
        { category: "Electronics", emissions: 12.4, percentage: 35 },
        { category: "Fashion", emissions: 8.2, percentage: 23 },
        { category: "Health & Personal Care", emissions: 5.1, percentage: 14 },
        { category: "Home & Garden", emissions: 4.3, percentage: 12 },
        { category: "Other", emissions: 5.8, percentage: 16 },
      ],
      carbonTrendData: [
        { month: "Jan", emissions: 45.2, target: 40 },
        { month: "Feb", emissions: 38.1, target: 40 },
        { month: "Mar", emissions: 42.3, target: 40 },
        { month: "Apr", emissions: 35.8, target: 40 },
        { month: "May", emissions: 39.2, target: 40 },
        { month: "Jun", emissions: 35.8, target: 40 },
      ],
      recentPurchases: amazonPurchases.slice(0, 5),
    };

    return {
      purchases: amazonPurchases,
      metrics: amazonMetrics,
      refreshData: () => setRefreshKey((prev) => prev + 1),
      isUsingDatabase: false,
      isLoading,
      carbonEstimationStatus: "idle" as const,
      triggerEstimation: () => {
        console.log("Estimation not available for JSON data");
      },
    };
  }, [
    isUsingDatabase,
    databaseData,
    isLoading,
    carbonEstimationStatus,
    hasTriggeredEstimation,
  ]);

  return (
    <DataContext.Provider
      value={{
        ...processedData,
        isLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}

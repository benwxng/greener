"use client";

import React, { createContext, useContext, useMemo } from "react";
import { amazonPurchases } from "@/lib/amazon-data-transformer";
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
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [refreshKey, setRefreshKey] = React.useState(0);

  const processedData = useMemo(() => {
    // Get fresh data each time (no caching in transformer now)
    const purchases = amazonPurchases;
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
      {
        month: "Jun",
        emissions: Math.round(currentScore * 10) / 10,
        target: 10,
      },
    ];

    // Get recent purchases (last 3)
    const recentPurchases = purchases.slice(0, 3);

    return {
      purchases,
      metrics: {
        currentScore: Math.round(currentScore * 10) / 10,
        totalSpent: Math.round(totalSpent * 100) / 100,
        totalPurchases: purchases.length,
        totalEmissions: Math.round(totalEmissions * 10) / 10,
        averageScore: Math.round(averageScore * 10) / 10,
        categoryData,
        carbonTrendData,
        recentPurchases,
      },
      refreshData: () => setRefreshKey((prev) => prev + 1),
    };
  }, [refreshKey]); // Depend on refreshKey to allow manual refresh

  return (
    <DataContext.Provider value={processedData}>
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

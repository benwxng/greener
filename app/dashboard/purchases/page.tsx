"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Calendar,
  ShoppingCart,
  Leaf,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Smartphone,
  Shirt,
  Home,
  Heart,
  Package,
} from "lucide-react";
import { useData } from "@/lib/contexts/data-context";

// Memoized Category Icon Component
const CategoryIcon = React.memo(({ category }: { category: string }) => {
  const iconProps = { className: "h-8 w-8 text-muted-foreground" };

  switch (category) {
    case "Electronics":
      return <Smartphone {...iconProps} />;
    case "Fashion":
      return <Shirt {...iconProps} />;
    case "Health & Personal Care":
      return <Heart {...iconProps} />;
    case "Home & Garden":
      return <Home {...iconProps} />;
    default:
      return <Package {...iconProps} />;
  }
});

CategoryIcon.displayName = "CategoryIcon";

// Function to get category-based background color
function getCategoryImageBackground(category: string) {
  const backgrounds = {
    Electronics: "bg-blue-100",
    Fashion: "bg-purple-100",
    "Health & Personal Care": "bg-pink-100",
    "Home & Garden": "bg-green-100",
    Other: "bg-gray-100",
  };
  return backgrounds[category as keyof typeof backgrounds] || backgrounds.Other;
}

function getCarbonScoreColor(score: number) {
  if (score <= 2) return "text-green-600";
  if (score <= 4) return "text-yellow-600";
  return "text-red-600";
}

const CarbonScoreBadge = React.memo(({ score }: { score: number }) => {
  if (score <= 2)
    return (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
        Low Impact
      </Badge>
    );
  if (score <= 4)
    return (
      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
        Medium Impact
      </Badge>
    );
  return (
    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
      High Impact
    </Badge>
  );
});

CarbonScoreBadge.displayName = "CarbonScoreBadge";

function getCategoryColor(category: string) {
  const colors: { [key: string]: string } = {
    Fashion:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    Electronics:
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "Health & Personal Care":
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    "Home & Garden":
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  };
  return colors[category] || colors.Other;
}

export default function PurchasesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Use shared data context
  const { purchases, metrics } = useData();

  // Memoize categories calculation
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(purchases.map((p) => p.category)))],
    [purchases]
  );

  // Memoize filtered purchases
  const filteredPurchases = useMemo(() => {
    return purchases.filter((purchase) => {
      const matchesSearch =
        purchase.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.store.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || purchase.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [purchases, searchTerm, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Purchase History</h1>
        <p className="text-muted-foreground">
          Track your Amazon purchases and their environmental impact
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.totalSpent}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.totalPurchases} purchases from Amazon
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Emissions
            </CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.totalEmissions} kg
            </div>
            <p className="text-xs text-muted-foreground">CO₂ equivalent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageScore}</div>
            <p className="text-xs text-muted-foreground">kg CO₂ per purchase</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search purchases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex space-x-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="mb-2 transition-colors duration-150"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase List */}
      <Card>
        <CardHeader>
          <CardTitle>Purchases ({filteredPurchases.length})</CardTitle>
          <CardDescription>
            {filteredPurchases.length === purchases.length
              ? "All your Amazon purchases"
              : `Showing ${filteredPurchases.length} of ${purchases.length} purchases`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPurchases.map((purchase) => (
              <div
                key={purchase.id}
                className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-accent/50 transition-all duration-150"
              >
                {/* Product Image */}
                <div
                  className={`w-20 h-20 rounded-lg flex items-center justify-center ${getCategoryImageBackground(
                    purchase.category
                  )}`}
                >
                  <CategoryIcon category={purchase.category} />
                </div>

                {/* Product Info */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{purchase.item}</h4>
                    <Badge className={getCategoryColor(purchase.category)}>
                      {purchase.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {purchase.store} •{" "}
                    {new Date(purchase.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {purchase.description}
                  </p>
                </div>

                {/* Carbon Score */}
                <div className="text-center">
                  <div
                    className={`text-lg font-bold ${getCarbonScoreColor(
                      purchase.carbonScore
                    )}`}
                  >
                    {purchase.carbonScore} kg
                  </div>
                  <div className="text-xs text-muted-foreground">CO₂</div>
                  <CarbonScoreBadge score={purchase.carbonScore} />
                </div>

                {/* Price & Actions */}
                <div className="text-right space-y-2">
                  <div className="text-lg font-bold">${purchase.amount}</div>
                  <div className="flex flex-col space-y-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="transition-colors duration-150"
                    >
                      {purchase.alternatives} Alternatives
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="transition-colors duration-150"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPurchases.length === 0 && (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No purchases found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

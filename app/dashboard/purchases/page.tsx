"use client";

import { useState } from "react";
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
} from "lucide-react";

// Mock purchase data
const purchases = [
  {
    id: 1,
    item: "Organic Cotton T-Shirt",
    store: "EcoWear",
    category: "Fashion",
    amount: 35.99,
    carbonScore: 2.1,
    date: "2024-01-15",
    description: "100% organic cotton, sustainably sourced",
    alternatives: 3,
    image: "/api/placeholder/60/60",
  },
  {
    id: 2,
    item: "iPhone 15 Pro",
    store: "Apple Store",
    category: "Electronics",
    amount: 999.99,
    carbonScore: 8.7,
    date: "2024-01-12",
    description: "Latest smartphone with advanced features",
    alternatives: 5,
    image: "/api/placeholder/60/60",
  },
  {
    id: 3,
    item: "Fair Trade Coffee Beans",
    store: "Local Roastery",
    category: "Food",
    amount: 12.5,
    carbonScore: 1.2,
    date: "2024-01-10",
    description: "Ethiopian single origin, fair trade certified",
    alternatives: 2,
    image: "/api/placeholder/60/60",
  },
  {
    id: 4,
    item: "Running Shoes",
    store: "Nike",
    category: "Fashion",
    amount: 129.99,
    carbonScore: 6.4,
    date: "2024-01-08",
    description: "Air Max series with recycled materials",
    alternatives: 4,
    image: "/api/placeholder/60/60",
  },
  {
    id: 5,
    item: "Laptop Stand",
    store: "Amazon",
    category: "Electronics",
    amount: 49.99,
    carbonScore: 3.2,
    date: "2024-01-05",
    description: "Aluminum laptop stand with adjustable height",
    alternatives: 6,
    image: "/api/placeholder/60/60",
  },
  {
    id: 6,
    item: "Wireless Headphones",
    store: "Sony",
    category: "Electronics",
    amount: 199.99,
    carbonScore: 4.8,
    date: "2024-01-03",
    description: "Noise-cancelling wireless headphones",
    alternatives: 7,
    image: "/api/placeholder/60/60",
  },
];

function getCarbonScoreColor(score: number) {
  if (score <= 2) return "text-green-600";
  if (score <= 4) return "text-yellow-600";
  return "text-red-600";
}

function getCarbonScoreBadge(score: number) {
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
}

function getCategoryColor(category: string) {
  const colors: { [key: string]: string } = {
    Fashion:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    Electronics:
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    Food: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    Transport: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    Other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  };
  return colors[category] || colors.Other;
}

export default function PurchasesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    ...Array.from(new Set(purchases.map((p) => p.category))),
  ];

  const filteredPurchases = purchases.filter((purchase) => {
    const matchesSearch =
      purchase.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.store.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || purchase.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalSpent = purchases.reduce((sum, p) => sum + p.amount, 0);
  const totalEmissions = purchases.reduce((sum, p) => sum + p.carbonScore, 0);
  const averageScore = totalEmissions / purchases.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Purchase History</h1>
        <p className="text-muted-foreground">
          Track your purchases and their environmental impact
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
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {purchases.length} purchases this month
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
              {totalEmissions.toFixed(1)} kg
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
            <div className="text-2xl font-bold">{averageScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↓ 12%</span> vs last month
            </p>
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
            <div className="flex space-x-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
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
              ? "All your purchases"
              : `Showing ${filteredPurchases.length} of ${purchases.length} purchases`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPurchases.map((purchase) => (
              <div
                key={purchase.id}
                className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                {/* Product Image Placeholder */}
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-muted-foreground" />
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
                  <p className="text-sm text-muted-foreground">
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
                  {getCarbonScoreBadge(purchase.carbonScore)}
                </div>

                {/* Price & Actions */}
                <div className="text-right space-y-2">
                  <div className="text-lg font-bold">${purchase.amount}</div>
                  <div className="flex flex-col space-y-1">
                    <Button variant="outline" size="sm">
                      {purchase.alternatives} Alternatives
                    </Button>
                    <Button variant="ghost" size="sm">
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

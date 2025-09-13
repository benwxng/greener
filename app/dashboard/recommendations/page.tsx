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
import { Progress } from "@/components/ui/progress";
import {
  ExternalLink,
  Star,
  Heart,
  ShoppingCart,
  Leaf,
  TrendingDown,
  Filter,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Mock recommendations data
const recommendations = [
  {
    id: 1,
    title: "Sustainable Alternative to iPhone 15 Pro",
    originalProduct: "iPhone 15 Pro",
    recommendedProduct: "Fairphone 5",
    store: "Fairphone Store",
    originalPrice: 999.99,
    recommendedPrice: 699.0,
    originalCarbon: 8.7,
    recommendedCarbon: 3.2,
    savings: 300.99,
    carbonReduction: 5.5,
    rating: 4.3,
    reviews: 1247,
    category: "Electronics",
    sustainabilityScore: 9.2,
    features: [
      "Modular design",
      "7-year warranty",
      "Fair trade materials",
      "Repairable",
    ],
    affiliateLink: "https://amazon.com/fairphone-5",
    image: "/api/placeholder/120/120",
    reason: "Lower carbon footprint with modular, repairable design",
  },
  {
    id: 2,
    title: "Eco-Friendly Running Shoes",
    originalProduct: "Nike Air Max",
    recommendedProduct: "Allbirds Tree Runners",
    store: "Allbirds",
    originalPrice: 129.99,
    recommendedPrice: 98.0,
    originalCarbon: 6.4,
    recommendedCarbon: 2.1,
    savings: 31.99,
    carbonReduction: 4.3,
    rating: 4.6,
    reviews: 3420,
    category: "Fashion",
    sustainabilityScore: 8.8,
    features: [
      "Tree fiber material",
      "Carbon neutral shipping",
      "Recyclable",
      "Comfortable",
    ],
    affiliateLink: "https://amazon.com/allbirds-tree-runners",
    image: "/api/placeholder/120/120",
    reason: "Made from sustainable tree fiber with carbon neutral shipping",
  },
  {
    id: 3,
    title: "Sustainable Coffee Alternative",
    originalProduct: "Regular Coffee Beans",
    recommendedProduct: "Organic Rainforest Alliance Coffee",
    store: "Whole Foods",
    originalPrice: 12.5,
    recommendedPrice: 14.99,
    originalCarbon: 1.2,
    recommendedCarbon: 0.4,
    savings: -2.49,
    carbonReduction: 0.8,
    rating: 4.5,
    reviews: 892,
    category: "Food",
    sustainabilityScore: 9.5,
    features: [
      "Rainforest Alliance certified",
      "Organic",
      "Fair trade",
      "Carbon offset program",
    ],
    affiliateLink: "https://amazon.com/rainforest-coffee",
    image: "/api/placeholder/120/120",
    reason: "Supports forest conservation and reduces environmental impact",
  },
  {
    id: 4,
    title: "Eco Laptop Stand",
    originalProduct: "Aluminum Laptop Stand",
    recommendedProduct: "Bamboo Laptop Stand",
    store: "EcoTech",
    originalPrice: 49.99,
    recommendedPrice: 39.99,
    originalCarbon: 3.2,
    recommendedCarbon: 0.8,
    savings: 10.0,
    carbonReduction: 2.4,
    rating: 4.4,
    reviews: 567,
    category: "Electronics",
    sustainabilityScore: 8.9,
    features: [
      "Sustainable bamboo",
      "Biodegradable",
      "Lightweight",
      "Adjustable",
    ],
    affiliateLink: "https://amazon.com/bamboo-laptop-stand",
    image: "/api/placeholder/120/120",
    reason: "Made from renewable bamboo instead of energy-intensive aluminum",
  },
];

const categories = ["All", "Electronics", "Fashion", "Food"];

function getCarbonScoreColor(score: number) {
  if (score <= 2) return "text-green-600";
  if (score <= 4) return "text-yellow-600";
  return "text-red-600";
}

function getSustainabilityBadge(score: number) {
  if (score >= 9)
    return (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
        Excellent
      </Badge>
    );
  if (score >= 8)
    return (
      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
        Very Good
      </Badge>
    );
  if (score >= 7)
    return (
      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
        Good
      </Badge>
    );
  return (
    <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
      Fair
    </Badge>
  );
}

export default function RecommendationsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [savedItems, setSavedItems] = useState<Set<number>>(new Set());

  const filteredRecommendations = recommendations.filter(
    (rec) => selectedCategory === "All" || rec.category === selectedCategory
  );

  const totalSavings = recommendations.reduce(
    (sum, rec) => sum + rec.savings,
    0
  );
  const totalCarbonReduction = recommendations.reduce(
    (sum, rec) => sum + rec.carbonReduction,
    0
  );

  const toggleSaved = (id: number) => {
    const newSaved = new Set(savedItems);
    if (newSaved.has(id)) {
      newSaved.delete(id);
    } else {
      newSaved.add(id);
    }
    setSavedItems(newSaved);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Sustainable Recommendations
        </h1>
        <p className="text-muted-foreground">
          Discover eco-friendly alternatives to your recent purchases
        </p>
      </div>

      {/* Impact Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Potential Savings
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              $
              {totalSavings > 0
                ? totalSavings.toFixed(2)
                : `+${Math.abs(totalSavings).toFixed(2)}`}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalSavings > 0 ? "Money saved" : "Small investment for impact"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Carbon Reduction
            </CardTitle>
            <Leaf className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              -{totalCarbonReduction.toFixed(1)} kg
            </div>
            <p className="text-xs text-muted-foreground">
              CO₂ equivalent reduction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recommendations
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredRecommendations.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Based on your purchases
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations List */}
      <div className="space-y-6">
        {filteredRecommendations.map((rec) => (
          <Card key={rec.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex space-x-6">
                {/* Product Image */}
                <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{rec.title}</h3>
                      <p className="text-muted-foreground">{rec.reason}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSaved(rec.id)}
                      className={savedItems.has(rec.id) ? "text-red-500" : ""}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          savedItems.has(rec.id) ? "fill-current" : ""
                        }`}
                      />
                    </Button>
                  </div>

                  {/* Comparison */}
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Original Product */}
                    <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                      <h4 className="font-medium mb-2">Current Choice</h4>
                      <p className="text-sm font-medium">
                        {rec.originalProduct}
                      </p>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Price:</span>
                          <span className="font-medium">
                            ${rec.originalPrice}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Carbon:</span>
                          <span
                            className={`font-medium ${getCarbonScoreColor(
                              rec.originalCarbon
                            )}`}
                          >
                            {rec.originalCarbon} kg CO₂
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Recommended Product */}
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <h4 className="font-medium mb-2">Recommended</h4>
                      <p className="text-sm font-medium">
                        {rec.recommendedProduct}
                      </p>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Price:</span>
                          <span className="font-medium">
                            ${rec.recommendedPrice}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Carbon:</span>
                          <span
                            className={`font-medium ${getCarbonScoreColor(
                              rec.recommendedCarbon
                            )}`}
                          >
                            {rec.recommendedCarbon} kg CO₂
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Impact Metrics */}
                  <div className="flex space-x-6">
                    <div className="text-center">
                      <div
                        className={`text-lg font-bold ${
                          rec.savings > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {rec.savings > 0
                          ? `$${rec.savings.toFixed(2)}`
                          : `-$${Math.abs(rec.savings).toFixed(2)}`}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {rec.savings > 0 ? "Savings" : "Extra Cost"}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        -{rec.carbonReduction.toFixed(1)} kg
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Carbon Reduction
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">
                        {rec.sustainabilityScore}/10
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Sustainability
                      </div>
                    </div>
                  </div>

                  {/* Features & Rating */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{rec.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({rec.reviews.toLocaleString()} reviews)
                        </span>
                      </div>
                      {getSustainabilityBadge(rec.sustainabilityScore)}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {rec.features.map((feature, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <Button className="flex-1">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Shop on {rec.store}
                    </Button>
                    <Button variant="outline">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRecommendations.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Leaf className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              No recommendations found
            </h3>
            <p className="text-muted-foreground">
              Try a different category or make some purchases to get
              personalized recommendations.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

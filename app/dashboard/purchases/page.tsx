"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
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
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  DollarSign,
} from "lucide-react";
import { useData } from "@/lib/contexts/data-context";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

const cardVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 15,
    },
  },
};

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

type SortOption = "newest" | "oldest" | "expensive" | "carbon";

export default function PurchasesPage() {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Use shared data context
  const { purchases, metrics } = useData();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize categories calculation
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(purchases.map((p) => p.category)))],
    [purchases]
  );

  // Memoize filtered and sorted purchases
  const filteredPurchases = useMemo(() => {
    const filtered = purchases.filter((purchase) => {
      const matchesSearch =
        purchase.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.store.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || purchase.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "expensive":
          return b.amount - a.amount;
        case "carbon":
          return b.carbonScore - a.carbonScore;
        default:
          return 0;
      }
    });
  }, [purchases, searchTerm, selectedCategory, sortBy]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Purchase History
          </h1>
          <p className="text-muted-foreground">
            Track your past purchases and their environmental impact
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Purchase History</h1>
        <p className="text-muted-foreground">
          Track your past purchases and their environmental impact
        </p>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        className="grid gap-4 md:grid-cols-3"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Emissions Saved
                </CardTitle>
                <Leaf className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{128} kg</div>
                <p className="text-xs text-muted-foreground">CO₂ equivalent</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Money Saved
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${317.45}
                </div>
                <p className="text-xs text-muted-foreground">
                  On sustainable choices
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Purchases
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{purchases.length}</div>
                <p className="text-xs text-muted-foreground">Items tracked</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Filter & Search</CardTitle>
            <CardDescription>
              Find specific purchases and analyze your spending patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search and Sort Row */}
              <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
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

                {/* Sort Options */}
                <div className="flex items-center space-x-2">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    Sort by:
                  </span>
                  <div className="flex space-x-1">
                    <Button
                      variant={sortBy === "newest" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSortBy("newest")}
                      className="transition-colors duration-150"
                    >
                      <ArrowDown className="h-3 w-3 mr-1" />
                      Newest
                    </Button>
                    <Button
                      variant={sortBy === "oldest" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSortBy("oldest")}
                      className="transition-colors duration-150"
                    >
                      <ArrowUp className="h-3 w-3 mr-1" />
                      Oldest
                    </Button>
                    <Button
                      variant={sortBy === "expensive" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSortBy("expensive")}
                      className="transition-colors duration-150"
                    >
                      $
                    </Button>
                    <Button
                      variant={sortBy === "carbon" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSortBy("carbon")}
                      className="transition-colors duration-150"
                    >
                      <Leaf className="h-3 w-3 mr-1" />
                      CO₂
                    </Button>
                  </div>
                </div>
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Categories:
                </span>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="transition-colors duration-150"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Purchase List */}
      <motion.div variants={itemVariants}>
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
            <motion.div className="space-y-4" variants={containerVariants}>
              {filteredPurchases.map((purchase, index) => (
                <motion.div
                  key={purchase.id}
                  variants={itemVariants}
                  custom={index}
                  whileHover={{
                    scale: 1.01,
                    transition: { duration: 0.2 },
                  }}
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
                  <div className="text-center min-w-[80px]">
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
                  <div className="text-right min-w-[140px] space-y-3">
                    <div className="text-lg font-bold">
                      ${purchase.amount.toFixed(2)}
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-center transition-colors duration-150"
                      >
                        {purchase.alternatives} Alternatives
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-center transition-colors duration-150"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

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
      </motion.div>
    </motion.div>
  );
}

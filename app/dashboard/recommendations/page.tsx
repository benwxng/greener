"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Star,
  Heart,
  ShoppingCart,
  Leaf,
  TrendingDown,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
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

// Mock recommendations data
const recommendations = [
  {
    id: 1,
    title: "Eco-Friendly Running Shoes",
    originalProduct: "Nike Vapor Max",
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
    affiliateLink:
      "https://www.amazon.com/Allbirds-Everyday-Sneakers-Washable-Materials/dp/B0CJ41M7M8/ref=sr_1_1?crid=3IVJOHGA0VI4D&dib=eyJ2IjoiMSJ9.WTaygUT9-LPZxI4Ap986ue4TtXV175MsgxYJcl6WBhfYx6LEl4AFQ1Dya9yTvSNCb_f4gPxDkEvk6hLIc8mayyGQeBdRPsV-XB6dbI7Oodw6_U2P_3vXSY9KYMDRSBQxTT-lUajT2RKuSBrPrUHp_AY4kpB2tUNg-r3pERMQ-Z6YzBOJDcA5xgMgVzSDBFPiNQ8pTmrKF_wnBoeqonVP3OIUV8H3QrQpeKL8fpfQ7TEeLOcGapm8NEqv3cjplpM1pkqzevbmKO-91fcFFjd2PkGGfhrMpvnwb5m6tsE4BB0.wbgJfx3KbJ6TztUzBmnTcPXwvKMyP1_BXYWGK0trKqk&dib_tag=se&keywords=allbirds&qid=1757859919&sprefix=allbi%2Caps%2C155&sr=8-1",
    image: "/allbirdsTreeRunner.webp",
    reason: "Made from sustainable tree fiber with carbon neutral shipping",
  },
  {
    id: 2,
    title: "Dryer Sheet Alternative",
    originalProduct: "Bounce Dryer Sheets",
    recommendedProduct: "Reusable Dryer Balls",
    store: "EcoTech",
    originalPrice: 16.99,
    recommendedPrice: 12.9,
    originalCarbon: 3.2,
    recommendedCarbon: 0.8,
    savings: 4.09,
    carbonReduction: 2.4,
    rating: 4.4,
    reviews: 567,
    category: "Home",
    sustainabilityScore: 8.9,
    features: ["Biodegradable", "Reusable", "Environmentally friendly"],
    affiliateLink:
      "https://www.amazon.com/Ezhippie-Reusable-Softener-Essential-Clothing/dp/B0B7K8MDP5/ref=sr_1_4?crid=4EZB5DWZDD64&dib=eyJ2IjoiMSJ9.L8ugfClpt3n2F_j8ZhQgcuakKluJjuT2VCwon-J32tpjYRAUq0Mrqe4lewaHMfwawUrtb5ZIleQbiF3mFBPZcxQZxaoede9ZAeRcokUEjpNSo8BSbdigL796q2i9nJ6qqC4eGwvJYrdWiJ1xnV0oTfkgnnxvNwRVzSiyuyD5JgtZMcMQQzX-mNOHqatXKXzxBoEwD7a3SQLy28Mjf-Z63ckGEMNPaxCfi_dBM2CuWrPc5tZZj3Hnsvg73Zx1UKgxxVR00mV8TDUFPpHlGEumJI28iK3AcELwWWv-QgcT2MA.7PKVlie1ZaPQus8fAnEHoSztKviOJIBI3i_BkJA-TXE&dib_tag=se&keywords=dryer%2Bballs&qid=1757859781&sprefix=dryer%2Bballs%2Caps%2C161&sr=8-4&th=1",
    image: "/dryerballs.webp",
    reason: "Made from renewable bamboo instead of energy-intensive aluminum",
  },
  {
    id: 3,
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
    image: "/fairphone.png",
    reason: "Lower carbon footprint with modular, repairable design",
  },
  {
    id: 4,
    title: "Bottled Water Alternative",
    originalProduct: "Deer Park 24 Pack Bottled Water",
    recommendedProduct: "Brita Water Filter",
    store: "Amazon",
    originalPrice: 18.0,
    recommendedPrice: 31.48,
    originalCarbon: 1.2,
    recommendedCarbon: 0.4,
    savings: -13.48,
    carbonReduction: 0.8,
    rating: 4.5,
    reviews: 892,
    category: "Home",
    sustainabilityScore: 9.5,
    features: [
      "Carbon neutral",
      "BPA free",
      "Eco-friendly",
      "Carbon offset program",
    ],
    affiliateLink:
      "https://www.amazon.com/Brita-Water-Filter-Replacement-Filter/dp/B0711111111/ref=sr_1_1?crid=1234567890&dib=eyJ2IjoiMSJ9.1234567890&keywords=brita+water+filter&qid=1757860000&sprefix=brita+water+filter%2Caps%2C155&sr=8-1",
    image: "/brita.jpg",
    reason: "Supports forest conservation and reduces environmental impact",
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
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [savedItems, setSavedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Sustainable Recommendations
          </h1>
          <p className="text-muted-foreground">
            Discover eco-friendly alternatives to your recent purchases
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
        <h1 className="text-3xl font-bold tracking-tight">
          Sustainable Recommendations
        </h1>
        <p className="text-muted-foreground">
          Discover eco-friendly alternatives to your recent purchases
        </p>
      </motion.div>

      {/* Impact Summary */}
      <motion.div
        className="grid gap-4 md:grid-cols-2"
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
                  {totalSavings > 0
                    ? "Save money while saving the planet"
                    : "Small investment for impact"}
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
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Category Filter */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Filter by Category</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
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
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommendations List */}
      <motion.div className="space-y-6" variants={containerVariants}>
        {filteredRecommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            variants={itemVariants}
            custom={index}
            whileHover={{
              scale: 1.01,
              transition: { duration: 0.2 },
            }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex space-x-6">
                  {/* Product Image */}
                  <div className="w-32 h-32 bg-muted rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                    {rec.image ? (
                      <Image
                        src={rec.image}
                        alt={rec.title}
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          // Fallback to shopping cart icon if image fails to load
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling?.classList.remove(
                            "hidden"
                          );
                        }}
                      />
                    ) : null}
                    <ShoppingCart
                      className={`h-8 w-8 text-muted-foreground ${
                        rec.image ? "hidden" : ""
                      }`}
                    />
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
                      <Button className="flex-1" asChild>
                        <a
                          href={rec.affiliateLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Shop
                        </a>
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
          </motion.div>
        ))}
      </motion.div>

      {filteredRecommendations.length === 0 && (
        <motion.div variants={itemVariants}>
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
        </motion.div>
      )}
    </motion.div>
  );
}

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingDown,
  ShoppingCart,
  Leaf,
  Target,
  Calendar,
  DollarSign,
  Award,
  Smartphone,
  Shirt,
  Home,
  Heart,
  Package,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { amazonPurchases } from "@/lib/amazon-data-transformer";

// Function to get category icon
function getCategoryIcon(category: string) {
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
}

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

// Calculate dashboard metrics from real Amazon data
const calculateDashboardMetrics = () => {
  const purchases = amazonPurchases;
  const totalSpent = purchases.reduce((sum, p) => sum + p.amount, 0);
  const totalEmissions = purchases.reduce((sum, p) => sum + p.carbonScore, 0);
  const currentScore = totalEmissions;

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
    { month: "Jan", emissions: currentScore * 1.2, target: 10 },
    { month: "Feb", emissions: currentScore * 1.1, target: 10 },
    { month: "Mar", emissions: currentScore * 1.05, target: 10 },
    { month: "Apr", emissions: currentScore * 1.02, target: 10 },
    { month: "May", emissions: currentScore * 1.01, target: 10 },
    { month: "Jun", emissions: currentScore, target: 10 },
  ];

  // Get recent purchases (last 3)
  const recentPurchases = purchases.slice(0, 3);

  return {
    currentScore: Math.round(currentScore * 10) / 10,
    totalSpent: Math.round(totalSpent * 100) / 100,
    totalPurchases: purchases.length,
    categoryData,
    carbonTrendData,
    recentPurchases,
  };
};

const metrics = calculateDashboardMetrics();

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

export default function DashboardPage() {
  const monthlyTarget = 10.0;
  const improvement = -0.8; // negative means improvement
  const progressToTarget =
    ((monthlyTarget - metrics.currentScore) / monthlyTarget) * 100;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
        <p className="text-muted-foreground">
          Here's your carbon footprint overview based on your Amazon purchases.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Score</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.currentScore}</div>
            <p className="text-xs text-muted-foreground">
              <span className="flex items-center">
                <TrendingDown className="h-3 w-3 text-green-600 mr-1" />
                {Math.abs(improvement)} kg CO₂
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Target
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyTarget}</div>
            <div className="mt-2">
              <Progress value={Math.max(0, progressToTarget)} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(Math.max(0, progressToTarget))}% to target
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Purchases</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalPurchases}</div>
            <p className="text-xs text-muted-foreground">
              <span className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                From Amazon
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.totalSpent}</div>
            <p className="text-xs text-muted-foreground">
              <span className="flex items-center">
                <Award className="h-3 w-3 text-green-600 mr-1" />
                On tracked purchases
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Carbon Footprint Trend</CardTitle>
            <CardDescription>
              Your monthly carbon emissions over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.carbonTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="emissions"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Actual Emissions"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#22c55e"
                  strokeDasharray="5 5"
                  name="Target"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emissions by Category</CardTitle>
            <CardDescription>
              Where your carbon footprint comes from
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="emissions" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Purchases */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Purchases</CardTitle>
          <CardDescription>
            Your latest purchases and their carbon impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.recentPurchases.map((purchase) => (
              <div
                key={purchase.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4 flex-1">
                  {/* Product Image */}
                  <div
                    className={`w-16 h-16 rounded-lg flex items-center justify-center ${getCategoryImageBackground(
                      purchase.category
                    )}`}
                  >
                    {getCategoryIcon(purchase.category)}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium line-clamp-1">
                        {purchase.item}
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {purchase.store} •{" "}
                      {new Date(purchase.date).toLocaleDateString()}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm font-medium">
                        ${purchase.amount}
                      </span>
                      <span
                        className={`text-sm font-medium ${getCarbonScoreColor(
                          purchase.carbonScore
                        )}`}
                      >
                        {purchase.carbonScore} kg CO₂
                      </span>
                      {getCarbonScoreBadge(purchase.carbonScore)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="ml-4">
                  <Button variant="outline" size="sm">
                    {purchase.alternatives} Alternatives
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline">View All Purchases</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

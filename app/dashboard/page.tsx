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

// Mock data for charts
const carbonTrendData = [
  { month: "Jan", emissions: 12.5, target: 10 },
  { month: "Feb", emissions: 11.2, target: 10 },
  { month: "Mar", emissions: 9.8, target: 10 },
  { month: "Apr", emissions: 8.5, target: 10 },
  { month: "May", emissions: 7.9, target: 10 },
  { month: "Jun", emissions: 7.2, target: 10 },
];

const categoryData = [
  { category: "Fashion", emissions: 2.1, percentage: 29 },
  { category: "Electronics", emissions: 1.8, percentage: 25 },
  { category: "Food", emissions: 1.2, percentage: 17 },
  { category: "Transport", emissions: 1.1, percentage: 15 },
  { category: "Other", emissions: 1.0, percentage: 14 },
];

const recentPurchases = [
  {
    id: 1,
    item: "Organic Cotton T-Shirt",
    store: "EcoWear",
    amount: 35.99,
    carbonScore: 2.1,
    date: "2 days ago",
    alternatives: 3,
  },
  {
    id: 2,
    item: "Smartphone Charger",
    store: "TechStore",
    amount: 19.99,
    carbonScore: 5.8,
    date: "5 days ago",
    alternatives: 5,
  },
  {
    id: 3,
    item: "Coffee Beans",
    store: "Local Roastery",
    amount: 12.5,
    carbonScore: 1.2,
    date: "1 week ago",
    alternatives: 2,
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

export default function DashboardPage() {
  const currentScore = 7.2;
  const monthlyTarget = 10.0;
  const improvement = -0.8; // negative means improvement
  const progressToTarget =
    ((monthlyTarget - currentScore) / monthlyTarget) * 100;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
        <p className="text-muted-foreground">
          Here&apos;s your carbon footprint overview for this month.
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
            <div className="text-2xl font-bold">{currentScore}</div>
            <p className="text-xs text-muted-foreground">
              <span className="flex items-center">
                <TrendingDown className="h-3 w-3 text-green-600 mr-1" />
                {Math.abs(improvement)} from last month
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
              <Progress value={progressToTarget} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(progressToTarget)}% to target
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Purchases</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              <span className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                This month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$127</div>
            <p className="text-xs text-muted-foreground">
              <span className="flex items-center">
                <Award className="h-3 w-3 text-green-600 mr-1" />
                From better choices
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
              <LineChart data={carbonTrendData}>
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
              <BarChart data={categoryData}>
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
            {recentPurchases.map((purchase) => (
              <div
                key={purchase.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <h4 className="font-medium">{purchase.item}</h4>
                      <p className="text-sm text-muted-foreground">
                        {purchase.store} • {purchase.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${purchase.amount}</p>
                      <div className="flex items-center space-x-2">
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
                </div>
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

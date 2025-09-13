"use client";

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
  User,
  Leaf,
  Award,
  Target,
  TrendingDown,
  Calendar,
  Star,
} from "lucide-react";

// Mock user data
const userData = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  joinDate: "2024-01-01",
  totalPurchases: 87,
  totalSavings: 245.67,
  carbonReduced: 34.8,
  currentStreak: 7,
  longestStreak: 15,
  achievements: [
    {
      id: 1,
      name: "Eco Warrior",
      description: "Reduced carbon footprint by 25%",
      icon: "🌱",
      earned: true,
    },
    {
      id: 2,
      name: "Smart Shopper",
      description: "Saved $100 with better choices",
      icon: "💰",
      earned: true,
    },
    {
      id: 3,
      name: "Streak Master",
      description: "7-day sustainable shopping streak",
      icon: "🔥",
      earned: true,
    },
    {
      id: 4,
      name: "Carbon Crusher",
      description: "Reduced 50kg of CO₂",
      icon: "💨",
      earned: false,
    },
    {
      id: 5,
      name: "Green Guardian",
      description: "100 sustainable purchases",
      icon: "🛡️",
      earned: false,
    },
  ],
  monthlyGoals: {
    carbonReduction: { current: 7.2, target: 10, unit: "kg CO₂" },
    sustainablePurchases: { current: 15, target: 20, unit: "purchases" },
    savings: { current: 45.67, target: 75, unit: "$" },
  },
};

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Your sustainability journey and achievements
        </p>
      </div>

      {/* User Info */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Name
              </label>
              <p className="text-lg font-medium">{userData.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <p className="text-lg">{userData.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Member Since
              </label>
              <p className="text-lg">
                {new Date(userData.joinDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            </div>
            <Button variant="outline" className="w-full">
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Leaf className="h-5 w-5 text-green-600" />
              <span>Impact Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Purchases
                </span>
                <span className="font-medium">{userData.totalPurchases}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Savings
                </span>
                <span className="font-medium text-green-600">
                  ${userData.totalSavings}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Carbon Reduced
                </span>
                <span className="font-medium text-green-600">
                  {userData.carbonReduced} kg CO₂
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Current Streak
                </span>
                <span className="font-medium">
                  {userData.currentStreak} days
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Monthly Goals</span>
          </CardTitle>
          <CardDescription>
            Track your progress towards this month&apos;s sustainability targets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {Object.entries(userData.monthlyGoals).map(([key, goal]) => {
              const progress = (goal.current / goal.target) * 100;
              const goalNames = {
                carbonReduction: "Carbon Reduction",
                sustainablePurchases: "Sustainable Purchases",
                savings: "Money Saved",
              };

              return (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">
                      {goalNames[key as keyof typeof goalNames]}
                    </h4>
                    <Badge variant={progress >= 100 ? "default" : "outline"}>
                      {Math.round(progress)}%
                    </Badge>
                  </div>
                  <Progress value={Math.min(progress, 100)} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {goal.current} / {goal.target} {goal.unit}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>Achievements</span>
          </CardTitle>
          <CardDescription>
            Celebrate your sustainability milestones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userData.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.earned
                    ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20"
                    : "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950/20 opacity-60"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium">{achievement.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.earned && (
                    <div className="text-green-600">
                      <Star className="h-5 w-5 fill-current" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingDown className="h-5 w-5 text-green-600" />
              <span>Streak Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {userData.currentStreak}
              </div>
              <p className="text-sm text-muted-foreground">
                Current Streak (days)
              </p>
            </div>
            <div className="text-center">
              <div className="text-xl font-medium">
                {userData.longestStreak}
              </div>
              <p className="text-sm text-muted-foreground">
                Longest Streak (days)
              </p>
            </div>
            <div className="text-center pt-2">
              <p className="text-sm text-muted-foreground">
                Keep making sustainable choices to maintain your streak! 🔥
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>This Month</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">24</div>
                <p className="text-sm text-muted-foreground">Purchases</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">15</div>
                <p className="text-sm text-muted-foreground">Sustainable</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">7.2</div>
                <p className="text-sm text-muted-foreground">Carbon Score</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">62%</div>
                <p className="text-sm text-muted-foreground">
                  Sustainable Rate
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

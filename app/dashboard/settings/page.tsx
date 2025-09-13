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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Settings,
  Bell,
  Shield,
  CreditCard,
  Target,
  Smartphone,
  Globe,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    weekly_report: true,
    purchase_analysis: true,
    recommendations: false,
    achievements: true,
    goals_reminder: true,
  });

  const [goals, setGoals] = useState({
    monthly_carbon_target: "10",
    sustainable_purchase_target: "20",
    savings_target: "75",
  });

  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
  });

  const handleNotificationChange = (key: string, checked: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: checked }));
  };

  const handleGoalChange = (key: string, value: string) => {
    setGoals((prev) => ({ ...prev, [key]: value }));
  };

  const handleProfileChange = (key: string, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and sustainability goals
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Profile Settings</span>
          </CardTitle>
          <CardDescription>
            Update your personal information and account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => handleProfileChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleProfileChange("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => handleProfileChange("phone", e.target.value)}
              />
            </div>
          </div>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Sustainability Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Sustainability Goals</span>
          </CardTitle>
          <CardDescription>
            Set your monthly targets for carbon reduction and sustainable
            shopping
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="carbon_target">
                Monthly Carbon Target (kg CO₂)
              </Label>
              <Input
                id="carbon_target"
                type="number"
                value={goals.monthly_carbon_target}
                onChange={(e) =>
                  handleGoalChange("monthly_carbon_target", e.target.value)
                }
              />
              <p className="text-sm text-muted-foreground">
                Target carbon footprint for the month
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchase_target">
                Sustainable Purchases Target
              </Label>
              <Input
                id="purchase_target"
                type="number"
                value={goals.sustainable_purchase_target}
                onChange={(e) =>
                  handleGoalChange(
                    "sustainable_purchase_target",
                    e.target.value
                  )
                }
              />
              <p className="text-sm text-muted-foreground">
                Number of sustainable purchases per month
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="savings_target">Monthly Savings Target ($)</Label>
              <Input
                id="savings_target"
                type="number"
                value={goals.savings_target}
                onChange={(e) =>
                  handleGoalChange("savings_target", e.target.value)
                }
              />
              <p className="text-sm text-muted-foreground">
                Money saved through better choices
              </p>
            </div>
          </div>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Update Goals
          </Button>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notification Preferences</span>
          </CardTitle>
          <CardDescription>
            Choose how you want to receive updates about your sustainability
            journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="weekly_report"
                checked={notifications.weekly_report}
                onCheckedChange={(checked) =>
                  handleNotificationChange("weekly_report", checked as boolean)
                }
              />
              <div className="flex-1">
                <Label htmlFor="weekly_report" className="font-medium">
                  Weekly Carbon Report
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get a weekly summary of your carbon footprint and progress
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="purchase_analysis"
                checked={notifications.purchase_analysis}
                onCheckedChange={(checked) =>
                  handleNotificationChange(
                    "purchase_analysis",
                    checked as boolean
                  )
                }
              />
              <div className="flex-1">
                <Label htmlFor="purchase_analysis" className="font-medium">
                  Purchase Analysis
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive carbon impact analysis for each purchase
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="recommendations"
                checked={notifications.recommendations}
                onCheckedChange={(checked) =>
                  handleNotificationChange(
                    "recommendations",
                    checked as boolean
                  )
                }
              />
              <div className="flex-1">
                <Label htmlFor="recommendations" className="font-medium">
                  New Recommendations
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when we find better sustainable alternatives
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="achievements"
                checked={notifications.achievements}
                onCheckedChange={(checked) =>
                  handleNotificationChange("achievements", checked as boolean)
                }
              />
              <div className="flex-1">
                <Label htmlFor="achievements" className="font-medium">
                  Achievement Alerts
                </Label>
                <p className="text-sm text-muted-foreground">
                  Celebrate when you reach sustainability milestones
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="goals_reminder"
                checked={notifications.goals_reminder}
                onCheckedChange={(checked) =>
                  handleNotificationChange("goals_reminder", checked as boolean)
                }
              />
              <div className="flex-1">
                <Label htmlFor="goals_reminder" className="font-medium">
                  Goals Reminder
                </Label>
                <p className="text-sm text-muted-foreground">
                  Monthly reminders about your sustainability goals
                </p>
              </div>
            </div>
          </div>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Preferences
          </Button>
        </CardContent>
      </Card>

      {/* Connected Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Connected Services</span>
          </CardTitle>
          <CardDescription>
            Manage integrations with banks and shopping platforms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-6 w-6 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">Bank Account (Chase)</h4>
                  <p className="text-sm text-muted-foreground">
                    Transaction tracking for carbon analysis
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Connected
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-6 w-6 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">Knot Transaction API</h4>
                  <p className="text-sm text-muted-foreground">
                    Real-time purchase tracking and analysis
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Connected
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Globe className="h-6 w-6 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">Amazon Affiliate</h4>
                  <p className="text-sm text-muted-foreground">
                    Product recommendations and affiliate links
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Connect
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Privacy & Security</span>
          </CardTitle>
          <CardDescription>
            Control your data and account security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Two-Factor Authentication
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Download My Data
            </Button>
            <Button variant="destructive" className="w-full justify-start">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

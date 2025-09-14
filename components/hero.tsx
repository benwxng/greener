import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { KnotLogo } from "./knot-logo";
import {
  Leaf,
  ShoppingCart,
  TrendingDown,
  Star,
  CheckCircle,
  BarChart3,
  Target,
  Award,
} from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <div className="flex flex-col gap-16 items-center">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-4xl">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Leaf className="h-8 w-8 text-green-600" />
          <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 bg-clip-text text-transparent">
            Greener
          </h1>
        </div>

        <h2 className="text-2xl lg:text-3xl font-semibold text-foreground mb-6">
          Track Your Carbon Footprint with Every Purchase
        </h2>

        <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Discover the environmental impact of your shopping habits and find
          sustainable alternatives that help you reduce your carbon footprint
          while saving money.
        </p>
        
        {/* Powered by Knot */}
        <div className="flex items-center justify-center space-x-2 mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border">
          <span className="text-sm text-muted-foreground">Powered by</span>
          <KnotLogo size="md" />
          <span className="text-sm text-muted-foreground">Transaction API</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link href="/auth/sign-up">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8"
            >
              Get Started Free
              <Leaf className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg" className="px-8">
              Learn More
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <Card className="text-center">
          <CardContent className="pt-6">
            <TrendingDown className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">25%</div>
            <p className="text-sm text-muted-foreground">
              Average carbon reduction
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <ShoppingCart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">10k+</div>
            <p className="text-sm text-muted-foreground">Purchases analyzed</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">$127</div>
            <p className="text-sm text-muted-foreground">
              Average monthly savings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Features Section */}
      <div id="features" className="w-full max-w-6xl space-y-12">
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-4">How Greener Works</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform analyzes your purchases and suggests better
            alternatives
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 text-center space-y-4">
            <div className="bg-green-100 dark:bg-green-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
              <ShoppingCart className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="text-xl font-semibold">Track Purchases</h4>
            <p className="text-sm text-muted-foreground">
              Powered by Knot API - securely connect your bank account to automatically track all transactions
            </p>
          </Card>

          <Card className="p-6 text-center space-y-4">
            <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="text-xl font-semibold">Analyze Impact</h4>
            <p className="text-sm text-muted-foreground">
              AI calculates the carbon footprint of each purchase
            </p>
          </Card>

          <Card className="p-6 text-center space-y-4">
            <div className="bg-purple-100 dark:bg-purple-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
              <Target className="h-8 w-8 text-purple-600" />
            </div>
            <h4 className="text-xl font-semibold">Get Recommendations</h4>
            <p className="text-sm text-muted-foreground">
              Discover sustainable alternatives with better environmental impact
            </p>
          </Card>

          <Card className="p-6 text-center space-y-4">
            <div className="bg-orange-100 dark:bg-orange-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
              <Award className="h-8 w-8 text-orange-600" />
            </div>
            <h4 className="text-xl font-semibold">Earn Rewards</h4>
            <p className="text-sm text-muted-foreground">
              Achieve sustainability goals and unlock eco-friendly badges
            </p>
          </Card>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="w-full max-w-4xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl p-8">
        <div className="text-center space-y-6">
          <h3 className="text-2xl font-bold">Why Choose Greener?</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Real-time Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Get instant carbon impact scores for every purchase
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Smart Alternatives</h4>
                <p className="text-sm text-muted-foreground">
                  AI-powered recommendations for sustainable products
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Save Money</h4>
                <p className="text-sm text-muted-foreground">
                  Often eco-friendly choices cost less in the long run
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Track Progress</h4>
                <p className="text-sm text-muted-foreground">
                  Monitor your carbon reduction goals and achievements
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center space-y-6 max-w-2xl">
        <h3 className="text-2xl font-bold">Ready to Make a Difference?</h3>
        <p className="text-muted-foreground">
          Join thousands of users who are already reducing their carbon
          footprint and saving money with smarter shopping choices.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/sign-up">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8"
            >
              Start Your Journey
              <Leaf className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
          <Badge variant="outline" className="border-green-200 text-green-700">
            Free to start
          </Badge>
          <Badge variant="outline" className="border-blue-200 text-blue-700">
            No credit card
          </Badge>
          <Badge
            variant="outline"
            className="border-purple-200 text-purple-700"
          >
            Instant setup
          </Badge>
        </div>
      </div>

      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
      
      {/* Footer Attribution */}
      <div className="text-center space-y-2 text-sm text-muted-foreground">
        <p>Secure transaction tracking powered by</p>
        <div className="flex items-center justify-center space-x-2">
          <KnotLogo size="md" />
        </div>
        <p>Trusted by financial institutions worldwide</p>
      </div>
    </div>
  );
}

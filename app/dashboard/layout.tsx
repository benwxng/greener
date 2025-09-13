import { AuthButton } from "@/components/auth-button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Home,
  ShoppingCart,
  Lightbulb,
  User,
  Settings,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { icon: Home, label: "Overview", href: "/dashboard" },
  { icon: ShoppingCart, label: "Purchases", href: "/dashboard/purchases" },
  {
    icon: Lightbulb,
    label: "Recommendations",
    href: "/dashboard/recommendations",
  },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center space-x-4">
            <Leaf className="h-8 w-8 text-green-600" />
            <h1 className="text-xl font-bold text-foreground">Greener</h1>
          </div>
          <div className="ml-auto">
            <AuthButton />
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card">
          <div className="flex h-full flex-col">
            <div className="flex-1 space-y-1 p-4">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:bg-accent hover:text-accent-foreground"
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* Carbon Score Widget in Sidebar */}
            <div className="border-t border-border p-4">
              <div className="rounded-lg bg-green-50 dark:bg-green-950 p-3">
                <div className="flex items-center space-x-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    Monthly Score
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-green-600">7.2</div>
                  <div className="text-xs text-green-600">
                    Better than last month
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

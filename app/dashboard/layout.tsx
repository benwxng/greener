"use client";

import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { KnotLogo } from "@/components/knot-logo";
import { useAuth } from "@/lib/hooks/useAuth";
import { DataProvider } from "@/lib/contexts/data-context";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingCart,
  Lightbulb,
  User,
  Settings,
  Leaf,
  Menu,
  ChevronLeft,
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    window.location.href = "/auth/login";
    return null;
  }

  return (
    <DataProvider>
      <div className="min-h-screen bg-background flex overflow-x-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarCollapsed ? "w-24" : "w-64"
          } transition-all duration-300 ease-in-out flex-shrink-0 relative h-screen ml-2`}
        >
          {/* Sidebar Content */}
          <div className="h-full p-4">
            <div className="h-full bg-card border border-border rounded-2xl shadow-sm flex flex-col">
              {/* Sidebar Header with Logo */}
              <div className="p-4 border-b border-border flex-shrink-0">
                <div className="flex items-center justify-between">
                  {!sidebarCollapsed ? (
                    <div className="flex items-center space-x-3">
                      <Leaf className="h-8 w-8 text-green-600" />
                      <h1 className="text-xl font-bold text-foreground">
                        Greener
                      </h1>
                    </div>
                  ) : (
                    <div className="flex justify-center w-full">
                      <Leaf className="h-8 w-8 text-green-600" />
                    </div>
                  )}
                  {!sidebarCollapsed && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {sidebarCollapsed && (
                  <div className="flex justify-center mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                      className="h-8 w-8 p-0"
                    >
                      <Menu className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Navigation Items */}
              <div className="flex-1 space-y-1 p-4 overflow-y-auto">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link key={item.href} href={item.href} prefetch={true}>
                      <Button
                        variant="ghost"
                        className={`w-full ${
                          sidebarCollapsed
                            ? "justify-center px-2"
                            : "justify-start"
                        } transition-colors duration-150 ${
                          isActive
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {!sidebarCollapsed && (
                          <span className="ml-2">{item.label}</span>
                        )}
                      </Button>
                    </Link>
                  );
                })}
              </div>

              {/* Bottom Section - Always Visible */}
              <div className="border-t border-border p-4 flex-shrink-0">
                {/* Carbon Score Widget */}
                <div className="rounded-lg bg-green-50 dark:bg-green-950 p-3 mb-3">
                  {!sidebarCollapsed && (
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Leaf className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-xs font-medium text-green-800 dark:text-green-200">
                          Monthly Score
                        </span>
                      </div>
                      <div className="text-xl font-bold text-green-600">
                        7.2
                      </div>
                      <div className="text-xs text-green-600">
                        Better than last month
                      </div>
                    </div>
                  )}
                  {sidebarCollapsed && (
                    <div className="text-center">
                      <Leaf className="h-4 w-4 text-green-600 mx-auto mb-1" />
                      <div className="text-sm font-bold text-green-600">
                        7.2
                      </div>
                    </div>
                  )}
                </div>

                {/* Powered by Knot */}
                {!sidebarCollapsed && (
                  <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-2">Powered by</div>
                      <div className="flex justify-center">
                        <KnotLogo size="sm" />
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">API</div>
                    </div>
                  </div>
                )}
                {sidebarCollapsed && (
                  <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg border">
                    <div className="flex justify-center">
                      <KnotLogo size="sm" showText={false} />
                    </div>
                  </div>
                )}

                {/* Theme Switcher and Auth Controls */}
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <ThemeSwitcher />
                  </div>
                  <div className="w-full">
                    <AuthButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden h-screen min-w-0">
          <div className="w-full max-w-none p-6">{children}</div>
        </main>

        {/* Mobile Sidebar Overlay */}
        {!sidebarCollapsed && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarCollapsed(true)}
          />
        )}
      </div>
    </DataProvider>
  );
}

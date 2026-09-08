"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  BarChart3,
  DollarSign,
  Users,
  Zap,
  Settings,
  Play,
  Bell,
  Search,
  TrendingUp,
  Menu,
  X,
  Calendar,
  Receipt,
  BarChart2,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/revenue", label: "Revenue", icon: DollarSign },
  { href: "/dashboard/cashflow", label: "Cash Flow", icon: Calendar },
  { href: "/dashboard/pnl", label: "Video P&L", icon: BarChart2 },
  { href: "/dashboard/expenses", label: "Expenses", icon: Receipt },
  { href: "/dashboard/sponsorships", label: "Sponsorships", icon: Users },
  { href: "/dashboard/ai-studio", label: "AI Studio", icon: Zap },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/goals", label: "Goals", icon: TrendingUp },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const searchPages = [
    { href: "/dashboard", label: "Dashboard", keywords: "home overview summary" },
    { href: "/dashboard/revenue", label: "Revenue", keywords: "money income adsense earnings" },
    { href: "/dashboard/cashflow", label: "Cash Flow", keywords: "payments schedule calendar" },
    { href: "/dashboard/pnl", label: "Video P&L", keywords: "profit loss costs expenses videos" },
    { href: "/dashboard/expenses", label: "Expenses", keywords: "tax deductions categories" },
    { href: "/dashboard/sponsorships", label: "Sponsorships", keywords: "deals brands pipeline leads" },
    { href: "/dashboard/ai-studio", label: "AI Studio", keywords: "titles descriptions ideas generate" },
    { href: "/dashboard/analytics", label: "Analytics", keywords: "views watch time ctr rpm" },
    { href: "/dashboard/goals", label: "Goals", keywords: "targets milestones progress" },
    { href: "/dashboard/settings", label: "Settings", keywords: "profile account preferences" },
  ];

  const filteredPages = searchQuery
    ? searchPages.filter(
        (p) =>
          p.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.keywords.includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSelect = (href: string) => {
    router.push(href);
    setSearchQuery("");
    setSearchOpen(false);
  };

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    setSidebarOpen(mq.matches);
    const handler = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
      setSidebarOpen(e.matches);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [pathname, isDesktop]);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Overlay */}
      {sidebarOpen && !isDesktop && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 bg-white border-r border-yt-border flex flex-col transition-transform duration-200 ease-in-out w-60
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${isDesktop ? "relative translate-x-0" : ""}
        `}
      >
        {/* Logo */}
        <div className="h-14 flex items-center gap-2 px-4 border-b border-yt-border shrink-0">
          <Link href="/dashboard" className="flex items-center gap-1.5 flex-1">
            <div className="w-7 h-7 rounded-lg bg-yt-red flex items-center justify-center">
              <Play className="w-3.5 h-3.5 text-white fill-white" />
            </div>
            <span className="text-base font-semibold">CreatorOS</span>
          </Link>
          {!isDesktop && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-full hover:bg-yt-hover transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-2 px-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`yt-sidebar-item ${isActive ? "active" : ""}`}
              >
                <item.icon className="w-5 h-5 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Settings */}
        <div className="py-2 px-2 border-t border-yt-border">
          <Link
            href="/dashboard/settings"
            className={`yt-sidebar-item ${pathname === "/dashboard/settings" ? "active" : ""}`}
          >
            <Settings className="w-5 h-5 shrink-0" />
            <span>Settings</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Bar */}
        <header className="h-14 bg-white border-b border-yt-border flex items-center px-3 md:px-4 gap-3 shrink-0 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-full hover:bg-yt-hover transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 max-w-xl hidden sm:block" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yt-text-secondary" />
              <input
                type="text"
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                className="yt-input pl-10 h-10 rounded-full bg-yt-surface border-transparent focus:border-yt-border"
              />
              {searchOpen && searchQuery && filteredPages.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-yt-border rounded-xl shadow-lg z-50 overflow-hidden">
                  {filteredPages.map((page) => (
                    <button
                      key={page.href}
                      onClick={() => handleSearchSelect(page.href)}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-yt-hover transition-colors flex items-center gap-3 ${
                        pathname === page.href ? "bg-yt-surface font-medium" : ""
                      }`}
                    >
                      <Search className="w-3.5 h-3.5 text-yt-text-secondary" />
                      <span>{page.label}</span>
                      {pathname === page.href && (
                        <span className="ml-auto text-xs text-yt-green">current</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-2 ml-auto">
            <button className="p-2 rounded-full hover:bg-yt-hover transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-yt-red rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-yt-red flex items-center justify-center text-white font-medium text-sm cursor-pointer">
              R
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-3 md:p-6">{children}</main>
      </div>
    </div>
  );
}

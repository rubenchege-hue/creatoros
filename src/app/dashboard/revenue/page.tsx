"use client";

import { DollarSign, TrendingUp, ArrowUpRight, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface RevenueData {
  channel: {
    title: string;
    subscriberCount: string;
  };
  revenue: Array<{
    estimatedRevenue: number;
    estimatedAdSense: number;
    playbacks: number;
    period: string;
  }>;
  analytics: {
    views: number;
    estimatedRevenue: number;
  };
}

export default function RevenuePage() {
  const { data: session } = useSession();
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem("youtube_data");
      if (cached) {
        setData(JSON.parse(cached));
        setLoading(false);
        return;
      }
    } catch {
      sessionStorage.removeItem("youtube_data");
    }

    if (session) {
      fetch("/api/youtube")
        .then((res) => res.json())
        .then((d) => {
          if (d.channel) {
            setData(d);
            sessionStorage.setItem("youtube_data", JSON.stringify(d));
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [session]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Revenue Tracking</h2>
          <p className="text-yt-text-secondary">Loading your revenue data...</p>
        </div>
        <div className="grid grid-cols-2 gap-2 md:gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="yt-card p-5 border border-yt-border">
              <div className="yt-skeleton w-24 h-4 mb-2" />
              <div className="yt-skeleton w-16 h-7" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Revenue Tracking</h2>
          <p className="text-yt-text-secondary">Connect your channel to see real revenue</p>
        </div>
        <div className="yt-card p-8 md:p-12 border border-yt-border text-center">
          <DollarSign className="w-12 h-12 text-yt-text-secondary/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No channel connected</h3>
          <p className="text-sm text-yt-text-secondary mb-4">
            Connect your YouTube channel to track your revenue
          </p>
          <Link
            href="/dashboard/connect"
            className="yt-btn yt-btn-primary py-2 px-4 inline-flex"
          >
            Connect YouTube
          </Link>
        </div>
      </div>
    );
  }

  const totalRevenue = data.revenue?.reduce((sum, r) => sum + r.estimatedRevenue, 0) || 0;
  const totalAdSense = data.revenue?.reduce((sum, r) => sum + r.estimatedAdSense, 0) || 0;
  const totalPlaybacks = data.revenue?.reduce((sum, r) => sum + r.playbacks, 0) || 0;
  const rpm = totalPlaybacks > 0 ? (totalRevenue / (totalPlaybacks / 1000)) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold">Revenue Tracking</h2>
          <p className="text-yt-text-secondary">
            Real revenue from {data.channel?.title || "your channel"}
          </p>
        </div>
      </div>

      {/* Revenue KPIs */}
      <div className="grid grid-cols-2 gap-2 md:gap-4 md:grid-cols-4">
        <div className="yt-card p-5 border border-yt-border">
          <div className="flex items-center gap-2 text-sm text-yt-text-secondary mb-2">
            <DollarSign className="w-4 h-4" />
            Total Revenue (6mo)
          </div>
          <div className="text-2xl font-bold text-yt-green">
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="yt-card p-5 border border-yt-border">
          <div className="flex items-center gap-2 text-sm text-yt-text-secondary mb-2">
            <TrendingUp className="w-4 h-4" />
            Ad Revenue (6mo)
          </div>
          <div className="text-2xl font-bold">
            ${totalAdSense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="yt-card p-5 border border-yt-border">
          <div className="flex items-center gap-2 text-sm text-yt-text-secondary mb-2">
            <DollarSign className="w-4 h-4" />
            RPM
          </div>
          <div className="text-2xl font-bold">
            ${rpm.toFixed(2)}
          </div>
        </div>
        <div className="yt-card p-5 border border-yt-border">
          <div className="flex items-center gap-2 text-sm text-yt-text-secondary mb-2">
            <ArrowUpRight className="w-4 h-4" />
            Total Playbacks
          </div>
          <div className="text-2xl font-bold">
            {totalPlaybacks.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="yt-card p-5 border border-yt-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Revenue by Month</h3>
        </div>
        {data.revenue && data.revenue.length > 0 ? (
          <div className="h-48 flex items-end gap-1">
            {(() => {
              const maxRevenue = Math.max(...data.revenue.map((r) => r.estimatedRevenue));
              return data.revenue.map((r, i) => {
                const height = maxRevenue > 0 ? (r.estimatedRevenue / maxRevenue) * 100 : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col justify-end">
                    <div
                      className="bg-yt-red rounded-t"
                      style={{ height: `${Math.max(height, 5)}%` }}
                    />
                    <div className="text-[10px] text-yt-text-secondary text-center mt-1">
                      ${Math.round(r.estimatedRevenue)}
                    </div>
                    <div className="text-[9px] text-yt-text-secondary text-center">
                      {r.period}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        ) : (
          <div className="h-48 bg-yt-surface rounded-xl flex items-center justify-center">
            <div className="text-center">
              <DollarSign className="w-10 h-10 text-yt-text-secondary/30 mx-auto mb-2" />
              <p className="text-sm text-yt-text-secondary">No revenue data available</p>
              <p className="text-xs text-yt-text-secondary mt-1">
                Revenue data appears here once your channel is monetized
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Revenue Breakdown */}
      <div className="yt-card p-5 border border-yt-border">
        <h3 className="font-medium mb-4">Revenue Breakdown</h3>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">Ad Revenue</span>
              <span className="text-sm font-medium">${totalAdSense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="w-full h-2 bg-yt-surface rounded-full">
              <div
                className="h-full bg-yt-red rounded-full"
                style={{ width: totalRevenue > 0 ? `${(totalAdSense / totalRevenue) * 100}%` : "0%" }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">Other Revenue</span>
              <span className="text-sm font-medium">${(totalRevenue - totalAdSense).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="w-full h-2 bg-yt-surface rounded-full">
              <div
                className="h-full bg-yt-green rounded-full"
                style={{ width: totalRevenue > 0 ? `${((totalRevenue - totalAdSense) / totalRevenue) * 100}%` : "0%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

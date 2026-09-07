"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { DollarSign, TrendingUp, Users, Eye, ArrowUpRight, Play, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

interface YouTubeData {
  channel: {
    id: string;
    title: string;
    subscriberCount: string;
    viewCount: string;
    videoCount: string;
  };
  revenue: Array<{
    estimatedRevenue: number;
    estimatedAdSense: number;
    playbacks: number;
    period: string;
  }>;
  videos: Array<{
    videoId: string;
    title: string;
    viewCount: string;
    likeCount: string;
  }>;
  analytics: {
    views: number;
    watchTime: number;
    subscribersGained: number;
    estimatedRevenue: number;
    ctr: number;
  };
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [youtubeData, setYoutubeData] = useState<YouTubeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try cached data first
    try {
      const cached = sessionStorage.getItem("youtube_data");
      if (cached) {
        setYoutubeData(JSON.parse(cached));
        setLoading(false);
        return;
      }
    } catch {
      sessionStorage.removeItem("youtube_data");
    }

    // Check for auth error
    if ((session as any)?.error === "RefreshAccessTokenError") {
      setError("Session expired. Please sign in again.");
      setLoading(false);
      return;
    }

    if (session) {
      fetch("/api/youtube")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch");
          return res.json();
        })
        .then((data) => {
          if (data.channel) {
            setYoutubeData(data);
            sessionStorage.setItem("youtube_data", JSON.stringify(data));
          }
        })
        .catch(() => setError("Failed to load YouTube data. Please try again."))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [session]);

  const totalRevenue = youtubeData?.revenue?.reduce((sum, r) => sum + r.estimatedRevenue, 0) || 0;
  const totalViews = youtubeData?.analytics?.views || 0;
  const channelTitle = youtubeData?.channel?.title || "Creator";
  const subs = youtubeData?.channel?.subscriberCount
    ? parseInt(youtubeData.channel.subscriberCount)
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
          <span className="text-sm text-red-600">{error}</span>
          <Link href="/dashboard/connect" className="text-sm font-medium text-red-600 hover:underline">
            Reconnect
          </Link>
        </div>
      )}

      {/* Welcome Banner */}
      {!youtubeData && !loading && (
        <div className="bg-gradient-to-r from-yt-red to-red-600 rounded-2xl p-4 md:p-6 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg md:text-xl font-bold mb-1">Welcome to CreatorOS</h2>
              <p className="opacity-90 text-sm">
                Connect your YouTube channel to see real revenue data and analytics.
              </p>
            </div>
            <Link
              href="/dashboard/connect"
              className="px-5 py-2.5 bg-white text-yt-red font-medium rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm shrink-0"
            >
              Connect Channel
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 md:gap-4">
        {[
          { icon: DollarSign, color: "text-yt-green", value: loading ? null : totalRevenue > 0 ? `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0", label: "Revenue" },
          { icon: Eye, color: "text-yt-success", value: loading ? null : totalViews > 0 ? `${(totalViews / 1000000).toFixed(1)}M` : "0", label: "Views (6mo)" },
          { icon: Users, color: "text-yt-red", value: loading ? null : subs > 0 ? `${(subs / 1000).toFixed(1)}K` : "0", label: "Subscribers" },
          { icon: TrendingUp, color: "text-yt-green", value: loading ? null : youtubeData?.analytics?.ctr ? `${(youtubeData.analytics.ctr * 100).toFixed(1)}%` : "0%", label: "CTR" },
        ].map((stat) => (
          <div key={stat.label} className="yt-stat">
            <stat.icon className={`w-5 h-5 ${stat.color} mb-1`} />
            <div className="yt-stat-value">
              {stat.value === null ? (
                <div className="w-16 h-7 bg-yt-border/50 rounded animate-pulse" />
              ) : (
                stat.value
              )}
            </div>
            <div className="yt-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue + Channel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 yt-card p-5 border border-yt-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Revenue Overview</h3>
            <div className="flex gap-1">
              {["7D", "30D", "90D", "1Y"].map((period) => (
                <button
                  key={period}
                  className={`yt-chip text-xs ${period === "30D" ? "active" : ""}`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {youtubeData?.revenue?.length ? (
            <div className="h-48 flex items-end gap-1">
              {(() => {
                const maxRevenue = Math.max(...youtubeData.revenue.map((r) => r.estimatedRevenue));
                return youtubeData.revenue.map((r, i) => {
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
                    </div>
                  );
                });
              })()}
            </div>
          ) : (
            <div className="h-48 bg-yt-surface rounded-xl flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-10 h-10 text-yt-text-secondary/30 mx-auto mb-2" />
                <p className="text-sm text-yt-text-secondary">
                  {loading ? "Loading..." : "Revenue data appears here"}
                </p>
                {!loading && (
                  <Link href="/dashboard/connect" className="text-yt-red text-sm font-medium hover:underline">
                    Connect channel
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          {/* Channel Status */}
          <div className="yt-card p-5 border border-yt-border">
            <h3 className="font-medium mb-3">Channel</h3>
            {youtubeData ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-yt-red flex items-center justify-center text-white font-bold">
                  {youtubeData.channel.title[0]}
                </div>
                <div>
                  <div className="font-medium text-sm">{youtubeData.channel.title}</div>
                  <div className="text-xs text-yt-text-secondary">
                    {subs.toLocaleString()} subscribers
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/dashboard/connect"
                className="block text-center py-3 bg-yt-red text-white rounded-full font-medium text-sm hover:bg-yt-red-dark transition-colors"
              >
                Connect YouTube
              </Link>
            )}
          </div>

          {/* Top Videos */}
          <div className="yt-card p-5 border border-yt-border">
            <h3 className="font-medium mb-3">Top Videos</h3>
            {youtubeData?.videos?.length ? (
              <div className="space-y-3">
                {youtubeData.videos.slice(0, 3).map((video) => (
                  <div key={video.videoId} className="flex items-center gap-3">
                    <div className="w-20 h-12 md:w-24 md:h-14 bg-yt-surface rounded-lg flex items-center justify-center shrink-0">
                      <Play className="w-4 h-4 text-yt-text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{video.title}</div>
                      <div className="text-xs text-yt-text-secondary">
                        {parseInt(video.viewCount).toLocaleString()} views
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-yt-text-secondary text-center py-4">
                {loading ? "Loading..." : "Connect to see videos"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

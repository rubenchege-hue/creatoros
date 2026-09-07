"use client";

import { BarChart3, TrendingUp, Eye, ThumbsUp, Clock, ArrowUpRight, Play } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface VideoData {
  videoId: string;
  title: string;
  viewCount: string;
  likeCount: string;
}

interface AnalyticsData {
  channel: {
    title: string;
    subscriberCount: string;
    viewCount: string;
    videoCount: string;
  };
  videos: VideoData[];
  analytics: {
    views: number;
    watchTime: number;
    subscribersGained: number;
    estimatedRevenue: number;
    ctr: number;
  };
  revenue: Array<{
    estimatedRevenue: number;
    period: string;
  }>;
}

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get cached data first
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

    // Fetch fresh data
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
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Channel Analytics</h2>
          <p className="text-yt-text-secondary">Loading your real analytics...</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="yt-stat">
              <div className="yt-skeleton w-20 h-7" />
              <div className="yt-skeleton w-16 h-4 mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Channel Analytics</h2>
          <p className="text-yt-text-secondary">Connect your YouTube channel to see real analytics</p>
        </div>
        <div className="yt-card p-8 md:p-12 border border-yt-border text-center">
          <BarChart3 className="w-12 h-12 text-yt-text-secondary/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No channel connected</h3>
          <p className="text-sm text-yt-text-secondary mb-4">
            Connect your YouTube channel to see real analytics data
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

  const totalViews = data.analytics?.views || parseInt(data.channel?.viewCount || "0");
  const watchTime = data.analytics?.watchTime || 0;
  const ctr = data.analytics?.ctr || 0;
  const subs = parseInt(data.channel?.subscriberCount || "0");

  // Calculate RPM from revenue and views
  const totalRevenue = data.revenue?.reduce((sum, r) => sum + r.estimatedRevenue, 0) || 0;
  const rpm = totalViews > 0 ? (totalRevenue / (totalViews / 1000)) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Channel Analytics</h2>
        <p className="text-yt-text-secondary">
          Real data from {data.channel?.title || "your channel"}
        </p>
      </div>

      {/* Overview KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="yt-stat">
          <Eye className="w-5 h-5 text-yt-success mb-1" />
          <div className="yt-stat-value">
            {totalViews > 0 ? `${(totalViews / 1000000).toFixed(1)}M` : "0"}
          </div>
          <div className="yt-stat-label">Total Views</div>
        </div>
        <div className="yt-stat">
          <Clock className="w-5 h-5 text-yt-text-secondary mb-1" />
          <div className="yt-stat-value">
            {watchTime > 0 ? `${Math.round(watchTime).toLocaleString()}` : "0"}
          </div>
          <div className="yt-stat-label">Watch Time (hrs)</div>
        </div>
        <div className="yt-stat">
          <TrendingUp className="w-5 h-5 text-yt-green mb-1" />
          <div className="yt-stat-value">
            {rpm > 0 ? `$${rpm.toFixed(2)}` : "$0"}
          </div>
          <div className="yt-stat-label">RPM</div>
        </div>
        <div className="yt-stat">
          <ThumbsUp className="w-5 h-5 text-yt-red mb-1" />
          <div className="yt-stat-value">
            {ctr > 0 ? `${(ctr * 100).toFixed(1)}%` : "0%"}
          </div>
          <div className="yt-stat-label">CTR</div>
        </div>
      </div>

      {/* Channel Stats */}
      <div className="yt-card p-6 border border-yt-border">
        <h3 className="font-medium mb-4">Channel Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <div className="text-center p-4 bg-yt-surface rounded-xl">
            <div className="text-2xl font-bold">{subs.toLocaleString()}</div>
            <div className="text-xs text-yt-text-secondary uppercase tracking-wide">Subscribers</div>
          </div>
          <div className="text-center p-4 bg-yt-surface rounded-xl">
            <div className="text-2xl font-bold">{parseInt(data.channel?.videoCount || "0").toLocaleString()}</div>
            <div className="text-xs text-yt-text-secondary uppercase tracking-wide">Videos</div>
          </div>
          <div className="text-center p-4 bg-yt-surface rounded-xl">
            <div className="text-2xl font-bold text-yt-green">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="text-xs text-yt-text-secondary uppercase tracking-wide">Revenue (6mo)</div>
          </div>
        </div>
      </div>

      {/* Video Performance */}
      <div className="yt-card border border-yt-border overflow-hidden">
        <div className="p-5 border-b border-yt-border">
          <h3 className="font-medium">Your Videos</h3>
        </div>
        {data.videos && data.videos.length > 0 ? (
          <div className="divide-y divide-yt-border">
            {data.videos.map((video) => (
              <div key={video.videoId} className="p-3 md:p-4 hover:bg-yt-surface transition-colors">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-20 h-12 md:w-28 md:h-16 bg-yt-surface rounded-lg flex items-center justify-center shrink-0">
                    <Play className="w-5 h-5 text-yt-text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{video.title}</div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-yt-text-secondary">
                      <span>{parseInt(video.viewCount).toLocaleString()} views</span>
                      <span>{parseInt(video.likeCount).toLocaleString()} likes</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-yt-text-secondary">
            No videos found
          </div>
        )}
      </div>
    </div>
  );
}

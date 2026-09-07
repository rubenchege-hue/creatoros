"use client";

import { Target, TrendingUp, CheckCircle, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface ChannelData {
  channel: {
    subscriberCount: string;
    viewCount: string;
  };
  revenue: Array<{
    estimatedRevenue: number;
  }>;
  analytics: {
    views: number;
  };
}

export default function GoalsPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<ChannelData | null>(null);
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

  const subs = data ? parseInt(data.channel?.subscriberCount || "0") : 0;
  const totalRevenue = data?.revenue?.reduce((sum, r) => sum + r.estimatedRevenue, 0) || 0;

  // Generate real goals based on channel data
  const goals = data ? [
    {
      id: 1,
      title: "Reach 100K Subscribers",
      current: subs,
      target: 100000,
      unit: "",
      deadline: "Dec 31",
      status: subs >= 100000 ? "completed" : subs >= 80000 ? "on-track" : "behind",
    },
    {
      id: 2,
      title: "Earn $10K Revenue",
      current: Math.round(totalRevenue),
      target: 10000,
      unit: "$",
      deadline: "Dec 31",
      status: totalRevenue >= 10000 ? "completed" : totalRevenue >= 7000 ? "on-track" : "behind",
    },
    {
      id: 3,
      title: "Reach 1M Total Views",
      current: data.analytics?.views || parseInt(data.channel?.viewCount || "0"),
      target: 1000000,
      unit: "",
      deadline: "Dec 31",
      status: (data.analytics?.views || 0) >= 1000000 ? "completed" : "on-track",
    },
  ] : [];

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Goals & Milestones</h2>
          <p className="text-yt-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Goals & Milestones</h2>
          <p className="text-yt-text-secondary">Connect your channel to set goals</p>
        </div>
        <div className="yt-card p-8 md:p-12 border border-yt-border text-center">
          <Target className="w-12 h-12 text-yt-text-secondary/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No channel connected</h3>
          <p className="text-sm text-yt-text-secondary mb-4">
            Connect your YouTube channel to track goals based on your real data
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

  const statusConfig: Record<string, { color: string; icon: typeof CheckCircle; label: string }> = {
    completed: { color: "text-yt-green", icon: CheckCircle, label: "Completed" },
    "on-track": { color: "text-yt-success", icon: TrendingUp, label: "On Track" },
    behind: { color: "text-red-500", icon: Clock, label: "Behind" },
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Goals & Milestones</h2>
        <p className="text-yt-text-secondary">Track your progress based on real channel data</p>
      </div>

      {/* Goals */}
      <div className="yt-card border border-yt-border">
        <div className="p-5 border-b border-yt-border">
          <h3 className="font-medium">Your Goals</h3>
        </div>
        <div className="divide-y divide-yt-border">
          {goals.map((goal) => {
            const pct = Math.min(Math.round((goal.current / goal.target) * 100), 100);
            const status = statusConfig[goal.status] || statusConfig["on-track"];
            return (
              <div key={goal.id} className="p-4 md:p-5 hover:bg-yt-surface transition-colors">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h4 className="font-medium text-sm md:text-base">{goal.title}</h4>
                    <p className="text-xs md:text-sm text-yt-text-secondary">Deadline: {goal.deadline}</p>
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs md:text-sm font-medium ${status.color} shrink-0`}>
                    <status.icon className="w-4 h-4" />
                    {status.label}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="w-full h-2 bg-yt-surface rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          goal.status === "completed"
                            ? "bg-yt-green"
                            : goal.status === "on-track"
                            ? "bg-yt-success"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm font-medium shrink-0">
                    {goal.unit === "$" ? `$${goal.current.toLocaleString()}` : goal.current.toLocaleString()}
                    {" / "}
                    {goal.unit === "$" ? `$${goal.target.toLocaleString()}` : goal.target.toLocaleString()}
                    <span className="text-yt-text-secondary ml-2">({pct}%)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue Forecast */}
      <div className="yt-card p-5 border border-yt-border">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-yt-success" />
          <h3 className="font-medium">Revenue Summary</h3>
        </div>
        <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
          <div>
            <div className="text-sm text-yt-text-secondary">Total Revenue</div>
            <div className="text-lg font-bold text-yt-green">
              ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div>
            <div className="text-sm text-yt-text-secondary">Subscribers</div>
            <div className="text-lg font-bold">{subs.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-yt-text-secondary">Views</div>
            <div className="text-lg font-bold">
              {((data.analytics?.views || parseInt(data.channel?.viewCount || "0")) / 1000000).toFixed(1)}M
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

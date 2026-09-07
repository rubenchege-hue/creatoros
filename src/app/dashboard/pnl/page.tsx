"use client";

import { DollarSign, Plus, Trash2, TrendingUp, TrendingDown, Play, BarChart3, Filter, ArrowUpDown, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Video {
  videoId: string;
  title: string;
  viewCount: string;
  likeCount: string;
}

interface VideoCost {
  id: string;
  videoId: string;
  category: string;
  amount: number;
  description: string;
}

interface ChannelData {
  channel: { title: string; subscriberCount: string };
  videos: Video[];
  revenue: Array<{ estimatedRevenue: number; period: string }>;
  analytics: { views: number };
}

const costCategories = [
  { id: "editing", label: "Editing", icon: "✂️" },
  { id: "thumbnail", label: "Thumbnail", icon: "🎨" },
  { id: "music", label: "Music/SFX", icon: "🎵" },
  { id: "equipment", label: "Equipment", icon: "🎥" },
  { id: "travel", label: "Travel", icon: "✈️" },
  { id: "talent", label: "Talent/Host", icon: "👤" },
  { id: "scripts", label: "Scripts", icon: "📝" },
  { id: "props", label: "Props/Set", icon: "🎪" },
  { id: "software", label: "Software", icon: "💻" },
  { id: "other", label: "Other", icon: "📦" },
];

export default function PnLPage() {
  const { data: session } = useSession();
  const [channelData, setChannelData] = useState<ChannelData | null>(null);
  const [costs, setCosts] = useState<VideoCost[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string>("");
  const [newCost, setNewCost] = useState({ category: "editing", amount: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"profit" | "revenue" | "cost" | "views">("profit");
  const [filterCosts, setFilterCosts] = useState<"all" | "has-costs" | "no-costs">("all");

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem("youtube_data");
      if (cached) setChannelData(JSON.parse(cached));
    } catch {
      sessionStorage.removeItem("youtube_data");
    }

    try {
      const saved = localStorage.getItem("video_costs");
      if (saved) setCosts(JSON.parse(saved));
    } catch {
      localStorage.removeItem("video_costs");
    }

    setLoading(false);
  }, [session]);

  const saveCosts = (c: VideoCost[]) => {
    setCosts(c);
    localStorage.setItem("video_costs", JSON.stringify(c));
  };

  const handleAddCost = () => {
    if (!selectedVideo || !newCost.amount) return;
    const cost: VideoCost = {
      id: Date.now().toString(),
      videoId: selectedVideo,
      category: newCost.category,
      amount: parseFloat(newCost.amount),
      description: newCost.description,
    };
    saveCosts([...costs, cost]);
    setNewCost({ category: "editing", amount: "", description: "" });
    setShowAddModal(false);
  };

  const handleDeleteCost = (id: string) => {
    saveCosts(costs.filter((c) => c.id !== id));
  };

  const getVideoCosts = (videoId: string) => costs.filter((c) => c.videoId === videoId);
  const getVideoTotalCost = (videoId: string) => getVideoCosts(videoId).reduce((sum, c) => sum + c.amount, 0);

  const totalRevenue = channelData?.revenue?.reduce((sum, r) => sum + r.estimatedRevenue, 0) || 0;
  const totalCosts = costs.reduce((sum, c) => sum + c.amount, 0);
  const totalProfit = totalRevenue - totalCosts;

  const videosWithPL = (channelData?.videos || []).map((video) => {
    const videoCosts = getVideoCosts(video.videoId);
    const totalCost = videoCosts.reduce((sum, c) => sum + c.amount, 0);
    const views = parseInt(video.viewCount) || 0;
    const revenuePerView = channelData?.revenue?.length
      ? totalRevenue / (channelData.analytics?.views || 1)
      : 0;
    const estimatedVideoRevenue = views * revenuePerView;
    const profit = estimatedVideoRevenue - totalCost;
    const rpm = views > 0 ? (estimatedVideoRevenue / (views / 1000)) : 0;
    const costPerView = views > 0 ? (totalCost / views) : 0;

    return {
      ...video,
      costs: videoCosts,
      totalCost,
      estimatedRevenue: estimatedVideoRevenue,
      profit,
      views,
      rpm,
      costPerView,
    };
  });

  let filtered = videosWithPL;
  if (filterCosts === "has-costs") filtered = videosWithPL.filter((v) => v.totalCost > 0);
  if (filterCosts === "no-costs") filtered = videosWithPL.filter((v) => v.totalCost === 0);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "profit") return b.profit - a.profit;
    if (sortBy === "revenue") return b.estimatedRevenue - a.estimatedRevenue;
    if (sortBy === "cost") return b.totalCost - a.totalCost;
    if (sortBy === "views") return b.views - a.views;
    return 0;
  });

  const profitableVideos = videosWithPL.filter((v) => v.profit > 0).length;
  const unprofitableVideos = videosWithPL.filter((v) => v.profit <= 0 && v.totalCost > 0).length;

  const handleExportCSV = () => {
    const header = "Video,Views,Est. Revenue,Total Cost,Profit,RPM,Cost Per View\n";
    const rows = sorted.map((v) =>
      `"${v.title}",${v.views},${v.estimatedRevenue.toFixed(2)},${v.totalCost.toFixed(2)},${v.profit.toFixed(2)},${v.rpm.toFixed(2)},${v.costPerView.toFixed(4)}`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "creatoros-video-pnl.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Video P&L</h2>
          <p className="text-yt-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!channelData) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Video P&L</h2>
          <p className="text-yt-text-secondary">Connect your YouTube channel to track profit per video</p>
        </div>
        <div className="yt-card p-8 md:p-12 border border-yt-border text-center">
          <BarChart3 className="w-10 h-10 text-yt-text-secondary/30 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">No channel connected</h3>
          <p className="text-sm text-yt-text-secondary mb-4">
            Connect your YouTube channel to see profit per video
          </p>
          <Link href="/dashboard/connect" className="yt-btn yt-btn-primary py-2 px-4 inline-flex">
            Connect YouTube
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Video P&L</h2>
          <p className="text-yt-text-secondary text-sm">Attach production costs to see true profit per video</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="yt-btn yt-btn-outline py-2 px-3 text-sm">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="yt-btn yt-btn-primary py-2 px-4 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Cost
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        <div className="yt-card p-3 md:p-5 border border-yt-border">
          <div className="flex items-center gap-2 text-xs md:text-sm text-yt-text-secondary mb-1">
            <DollarSign className="w-4 h-4" />
            Total Revenue
          </div>
          <div className="text-lg md:text-2xl font-bold">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
        <div className="yt-card p-3 md:p-5 border border-yt-border">
          <div className="flex items-center gap-2 text-xs md:text-sm text-yt-text-secondary mb-1">
            <TrendingDown className="w-4 h-4" />
            Total Costs
          </div>
          <div className="text-lg md:text-2xl font-bold text-red-500">${totalCosts.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
        <div className="yt-card p-3 md:p-5 border border-yt-border">
          <div className="flex items-center gap-2 text-xs md:text-sm text-yt-text-secondary mb-1">
            <TrendingUp className="w-4 h-4" />
            Net Profit
          </div>
          <div className={`text-lg md:text-2xl font-bold ${totalProfit >= 0 ? "text-yt-green" : "text-red-500"}`}>
            ${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="yt-card p-3 md:p-5 border border-yt-border">
          <div className="flex items-center gap-2 text-xs md:text-sm text-yt-text-secondary mb-1">
            <BarChart3 className="w-4 h-4" />
            Profitable Videos
          </div>
          <div className="text-lg md:text-2xl font-bold">{profitableVideos}/{videosWithPL.length}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 overflow-x-auto pb-1">
          {(["profit", "revenue", "cost", "views"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`yt-chip text-xs shrink-0 capitalize ${sortBy === s ? "active" : ""}`}
            >
              {s === "profit" ? "By Profit" : s === "revenue" ? "By Revenue" : s === "cost" ? "By Cost" : "By Views"}
            </button>
          ))}
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {(["all", "has-costs", "no-costs"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilterCosts(f)}
              className={`yt-chip text-xs shrink-0 ${filterCosts === f ? "active" : ""}`}
            >
              {f === "all" ? "All" : f === "has-costs" ? "With Costs" : "No Costs"}
            </button>
          ))}
        </div>
      </div>

      {/* Video P&L List */}
      <div className="yt-card border border-yt-border">
        <div className="p-4 md:p-5 border-b border-yt-border">
          <h3 className="font-medium">Your Videos</h3>
        </div>
        {sorted.length === 0 ? (
          <div className="p-8 text-center">
            <Play className="w-10 h-10 text-yt-text-secondary/30 mx-auto mb-3" />
            <p className="text-sm text-yt-text-secondary">No videos found</p>
          </div>
        ) : (
          <div className="divide-y divide-yt-border">
            {sorted.map((video) => {
              const categoryBreakdown = video.costs.reduce((acc, c) => {
                acc[c.category] = (acc[c.category] || 0) + c.amount;
                return acc;
              }, {} as Record<string, number>);

              return (
                <div key={video.videoId} className="p-3 md:p-4 hover:bg-yt-surface transition-colors">
                  <div className="flex items-start gap-3">
                    {/* Thumbnail */}
                    <div className="w-20 h-12 md:w-28 md:h-16 bg-yt-surface rounded-lg flex items-center justify-center shrink-0">
                      <Play className="w-4 h-4 md:w-5 md:h-5 text-yt-text-secondary" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate mb-1">{video.title}</div>
                      <div className="flex items-center gap-3 text-xs text-yt-text-secondary">
                        <span>{video.views.toLocaleString()} views</span>
                        <span>RPM: ${video.rpm.toFixed(2)}</span>
                      </div>

                      {/* Cost breakdown pills */}
                      {video.totalCost > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {Object.entries(categoryBreakdown).map(([cat, amount]) => {
                            const config = costCategories.find((c) => c.id === cat);
                            return (
                              <span key={cat} className="text-[10px] bg-yt-surface px-1.5 py-0.5 rounded-full">
                                {config?.icon} ${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Numbers */}
                    <div className="text-right shrink-0">
                      <div className="grid grid-cols-3 gap-2 md:gap-4 text-right">
                        <div>
                          <div className="text-[10px] text-yt-text-secondary">Revenue</div>
                          <div className="text-xs md:text-sm font-medium text-yt-green">
                            ${video.estimatedRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-yt-text-secondary">Costs</div>
                          <div className="text-xs md:text-sm font-medium text-red-500">
                            ${video.totalCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-yt-text-secondary">Profit</div>
                          <div className={`text-xs md:text-sm font-bold ${video.profit >= 0 ? "text-yt-green" : "text-red-500"}`}>
                            ${video.profit.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </div>
                        </div>
                      </div>

                      {/* Per-video cost list */}
                      {video.costs.length > 0 && (
                        <div className="mt-2 space-y-0.5">
                          {video.costs.map((cost) => {
                            const config = costCategories.find((c) => c.id === cost.category);
                            return (
                              <div key={cost.id} className="flex items-center justify-end gap-1 text-[10px] text-yt-text-secondary group/cost">
                                <span className="opacity-0 group-hover/cost:opacity-100">
                                  {cost.description && `${cost.description} `}
                                  {config?.icon}
                                </span>
                                <span>${cost.amount.toLocaleString()}</span>
                                <button
                                  onClick={() => handleDeleteCost(cost.id)}
                                  className="opacity-0 group-hover/cost:opacity-100 p-0.5 hover:bg-red-100 rounded"
                                >
                                  <Trash2 className="w-2.5 h-2.5 text-red-500" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Cost Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="yt-card p-5 md:p-6 border border-yt-border w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Add Production Cost</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Video *</label>
                <select
                  value={selectedVideo}
                  onChange={(e) => setSelectedVideo(e.target.value)}
                  className="yt-input"
                >
                  <option value="">Select a video</option>
                  {channelData.videos.map((v) => (
                    <option key={v.videoId} value={v.videoId}>
                      {v.title.length > 40 ? v.title.slice(0, 40) + "..." : v.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={newCost.category}
                  onChange={(e) => setNewCost({ ...newCost, category: e.target.value })}
                  className="yt-input"
                >
                  {costCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount ($) *</label>
                <input
                  type="number"
                  value={newCost.amount}
                  onChange={(e) => setNewCost({ ...newCost, amount: e.target.value })}
                  placeholder="e.g., 200"
                  className="yt-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  value={newCost.description}
                  onChange={(e) => setNewCost({ ...newCost, description: e.target.value })}
                  placeholder="e.g., Freelance editor payment"
                  className="yt-input"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 bg-yt-surface rounded-full font-medium text-sm hover:bg-yt-hover transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCost}
                disabled={!selectedVideo || !newCost.amount}
                className="flex-1 py-2 bg-yt-red text-white rounded-full font-medium text-sm hover:bg-yt-red-dark transition-colors disabled:opacity-50"
              >
                Add Cost
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

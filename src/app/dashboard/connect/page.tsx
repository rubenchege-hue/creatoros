"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Play, Check, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface ChannelData {
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
  }>;
  videos: Array<{
    videoId: string;
    title: string;
    viewCount: string;
  }>;
  analytics: {
    views: number;
    watchTime: number;
    estimatedRevenue: number;
    ctr: number;
  };
}

export default function ConnectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [channelData, setChannelData] = useState<ChannelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"connect" | "loading" | "success">("connect");

  useEffect(() => {
    if (status === "authenticated") {
      fetchChannelData();
    }
  }, [status]);

  const fetchChannelData = async () => {
    setLoading(true);
    setStep("loading");
    try {
      const response = await fetch("/api/youtube");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch data");
      setChannelData(data);
      setStep("success");
    } catch {
      setError("Failed to load your YouTube data. Please try again.");
      setStep("connect");
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    await signIn("google", { callbackUrl: "/dashboard/connect" });
  };

  const goToDashboard = () => {
    if (channelData) {
      sessionStorage.setItem("youtube_data", JSON.stringify(channelData));
    }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-yt-red flex items-center justify-center">
            <Play className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-2xl font-bold">CreatorOS</span>
        </div>

        {step === "connect" && (
          <div className="yt-card p-8 border border-yt-border">
            <h1 className="text-lg md:text-xl font-bold text-center mb-2">Connect Your YouTube Channel</h1>
            <p className="text-yt-text-secondary text-sm text-center mb-6">
              See your real revenue, analytics, and manage sponsorships.
            </p>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-sm text-red-600">{error}</span>
              </div>
            )}

            <button
              onClick={handleConnect}
              className="w-full py-3 bg-white border border-yt-border rounded-full font-medium hover:bg-yt-hover transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>

            <div className="mt-6 pt-6 border-t border-yt-border">
              <div className="text-xs text-yt-text-secondary text-center mb-3">What you get:</div>
              <div className="grid grid-cols-2 gap-2">
                {["Revenue tracking", "Sponsorship pipeline", "AI content studio", "Channel analytics"].map((f) => (
                  <div key={f} className="flex items-center gap-1.5 text-xs text-yt-text-secondary">
                    <Check className="w-3.5 h-3.5 text-yt-green shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-yt-text-secondary text-center mt-4">
              Read-only access. We never modify your data.
            </p>
          </div>
        )}

        {step === "loading" && (
          <div className="yt-card p-8 border border-yt-border text-center">
            <Loader2 className="w-10 h-10 text-yt-red animate-spin mx-auto mb-4" />
            <h2 className="text-lg font-bold mb-1">Loading your channel</h2>
            <p className="text-sm text-yt-text-secondary">Fetching revenue and analytics...</p>
          </div>
        )}

        {step === "success" && channelData && (
          <div className="yt-card p-8 border border-yt-border">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
                <Check className="w-7 h-7 text-yt-green" />
              </div>
              <h2 className="text-xl font-bold mb-1">Connected!</h2>
              <p className="text-sm text-yt-text-secondary">Here&apos;s your channel data:</p>
            </div>

            <div className="flex items-center gap-3 p-3 bg-yt-surface rounded-xl mb-4">
              <div className="w-12 h-12 rounded-full bg-yt-red flex items-center justify-center text-white font-bold">
                {channelData.channel.title[0]}
              </div>
              <div>
                <div className="font-medium text-sm">{channelData.channel.title}</div>
                <div className="text-xs text-yt-text-secondary">
                  {parseInt(channelData.channel.subscriberCount).toLocaleString()} subscribers
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 bg-yt-surface rounded-xl text-center">
                <div className="text-lg font-bold text-yt-green">
                  ${channelData.revenue.reduce((s, r) => s + r.estimatedRevenue, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-yt-text-secondary uppercase tracking-wide">Revenue</div>
              </div>
              <div className="p-3 bg-yt-surface rounded-xl text-center">
                <div className="text-lg font-bold">
                  {(channelData.analytics.views / 1000000).toFixed(1)}M
                </div>
                <div className="text-[11px] text-yt-text-secondary uppercase tracking-wide">Views</div>
              </div>
            </div>

            <button
              onClick={goToDashboard}
              className="w-full py-3 bg-yt-red text-white font-medium rounded-full hover:bg-yt-red-dark transition-colors flex items-center justify-center gap-2"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => { setStep("connect"); setChannelData(null); setError(null); }}
              className="w-full mt-2 py-2 text-yt-text-secondary text-sm font-medium hover:text-yt-text transition-colors"
            >
              Connect different account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

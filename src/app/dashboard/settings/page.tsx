"use client";

import { User, Bell, Shield, CreditCard, Video, LogOut, Save, Check, Loader2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";

const SETTINGS_KEY = "creatoros_settings";

interface Settings {
  name: string;
  email: string;
  notifications: {
    paymentReceived: boolean;
    sponsorshipOpportunities: boolean;
    revenueMilestones: boolean;
    weeklyDigest: boolean;
  };
}

const defaultSettings: Settings = {
  name: "Creator",
  email: "creator@example.com",
  notifications: {
    paymentReceived: true,
    sponsorshipOpportunities: true,
    revenueMilestones: true,
    weeklyDigest: false,
  },
};

function loadSettings(): Settings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) return { ...defaultSettings, ...JSON.parse(stored) };
  } catch {}
  return defaultSettings;
}

function saveSettings(settings: Settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [saved, setSaved] = useState(false);
  const [channelTitle, setChannelTitle] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem("youtube_data");
      if (cached) {
        const data = JSON.parse(cached);
        if (data.channel?.title) setChannelTitle(data.channel.title);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (session?.user?.name && settings.name === "Creator") {
      setSettings((prev) => ({ ...prev, name: session.user?.name || "Creator" }));
    }
    if (session?.user?.email && settings.email === "creator@example.com") {
      setSettings((prev) => ({ ...prev, email: session.user?.email || "creator@example.com" }));
    }
  }, [session]);

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCheckout = async (plan: string, amount: number) => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: settings.email,
          firstName: settings.name.split(" ")[0],
          lastName: settings.name.split(" ").slice(1).join(" ") || "",
          amount,
          plan,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start checkout");
      }
    } catch {
      alert("Failed to connect to payment gateway");
    } finally {
      setLoading(false);
    }
  };

  const toggleNotification = (key: keyof typeof settings.notifications) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: !prev.notifications[key] },
    }));
  };

  const initials = settings.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-3xl space-y-4 md:space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-yt-text-secondary">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <div className="yt-card p-6 border border-yt-border">
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-yt-red" />
          <h3 className="font-semibold">Profile</h3>
        </div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-yt-red flex items-center justify-center text-white font-bold text-xl">
            {initials}
          </div>
          <div>
            <div className="text-lg font-semibold">{settings.name}</div>
            <div className="text-sm text-yt-text-secondary">{settings.email}</div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              className="yt-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="yt-input"
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          className="mt-4 px-4 py-2 bg-yt-red text-white rounded-full text-sm font-medium hover:bg-yt-red-dark transition-colors flex items-center gap-2"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Connected Channels */}
      <div className="yt-card p-6 border border-yt-border">
        <div className="flex items-center gap-2 mb-6">
          <Video className="w-5 h-5 text-yt-red" />
          <h3 className="font-semibold">Connected YouTube Channels</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-yt-surface rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yt-red flex items-center justify-center text-white font-bold text-sm">
                {channelTitle ? channelTitle[0] : "R"}
              </div>
              <div>
                <div className="font-medium">{channelTitle || "Your Channel"}</div>
                <div className="text-xs text-yt-text-secondary">Connected via Google OAuth</div>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/dashboard/connect" })}
              className="text-sm text-yt-red font-medium hover:underline"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="yt-card p-6 border border-yt-border">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-yt-text-secondary" />
          <h3 className="font-semibold">Notifications</h3>
        </div>
        <div className="space-y-4">
          {([
            { key: "paymentReceived" as const, label: "Payment received alerts", description: "Get notified when a sponsorship payment comes in" },
            { key: "sponsorshipOpportunities" as const, label: "New sponsorship opportunities", description: "AI-matched brand deals matching your niche" },
            { key: "revenueMilestones" as const, label: "Revenue milestone alerts", description: "Celebrate when you hit revenue targets" },
            { key: "weeklyDigest" as const, label: "Weekly revenue digest", description: "Summary of your revenue performance each Monday" },
          ]).map((n) => (
            <div key={n.key} className="flex items-center justify-between p-3 bg-yt-surface rounded-xl">
              <div>
                <div className="font-medium text-sm">{n.label}</div>
                <div className="text-xs text-yt-text-secondary">{n.description}</div>
              </div>
              <button
                onClick={() => toggleNotification(n.key)}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                  settings.notifications[n.key] ? "bg-yt-green" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${
                    settings.notifications[n.key] ? "translate-x-5.5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={handleSave}
          className="mt-4 px-4 py-2 bg-yt-red text-white rounded-full text-sm font-medium hover:bg-yt-red-dark transition-colors flex items-center gap-2"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved!" : "Save Preferences"}
        </button>
      </div>

      {/* Billing */}
      <div className="yt-card p-6 border border-yt-border">
        <div className="flex items-center gap-2 mb-6">
          <CreditCard className="w-5 h-5 text-yt-text-secondary" />
          <h3 className="font-semibold">Billing</h3>
        </div>
        <div className="p-4 bg-yt-surface rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Free Plan</div>
              <div className="text-sm text-yt-text-secondary">Revenue tracking, up to 3 channels, basic analytics</div>
            </div>
            <button
              onClick={() => handleCheckout("creator", 19)}
              disabled={loading}
              className="px-4 py-2 bg-yt-red text-white rounded-full text-sm font-medium hover:bg-yt-red-dark transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Redirecting..." : "Upgrade to Pro — $19/mo"}
            </button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-yt-text-secondary">
            <div className="flex items-center gap-1"><Check className="w-3 h-3 text-yt-green" /> Revenue tracking</div>
            <div className="flex items-center gap-1"><Check className="w-3 h-3 text-yt-green" /> Expense management</div>
            <div className="flex items-center gap-1"><Check className="w-3 h-3 text-yt-green" /> Sponsorship pipeline</div>
            <div className="flex items-center gap-1 opacity-50"><Check className="w-3 h-3" /> AI title generator</div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="yt-card p-6 border border-yt-border">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-yt-green" />
          <h3 className="font-semibold">Security</h3>
        </div>
        <div className="space-y-3">
          <div className="p-3 bg-yt-surface rounded-xl">
            <div className="font-medium text-sm">Connected Apps</div>
            <div className="text-xs text-yt-text-secondary mt-1">YouTube Data API v3, YouTube Analytics API, Google OAuth 2.0</div>
          </div>
          <div className="p-3 bg-yt-surface rounded-xl">
            <div className="font-medium text-sm">Data Storage</div>
            <div className="text-xs text-yt-text-secondary mt-1">All data is stored locally in your browser. No server-side data storage.</div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="yt-card p-6 border border-red-200">
        <div className="flex items-center gap-2 mb-4">
          <LogOut className="w-5 h-5 text-red-500" />
          <h3 className="font-semibold text-red-500">Account</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-sm">Sign Out</div>
            <div className="text-xs text-yt-text-secondary">Sign out of your account (YouTube data will be re-fetched on next login)</div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

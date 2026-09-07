"use client";

import { User, Bell, Shield, CreditCard, Video, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-4 md:space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-yt-text-secondary">Manage your account and connected channels</p>
      </div>

      {/* Profile */}
      <div className="yt-card p-6 border border-yt-border">
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-yt-red" />
          <h3 className="font-semibold">Profile</h3>
        </div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-yt-red flex items-center justify-center text-white font-bold text-xl">
            R
          </div>
          <div>
            <div className="text-lg font-semibold">Creator</div>
            <div className="text-sm text-yt-text-secondary">creator@example.com</div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              defaultValue="Creator"
              className="yt-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              defaultValue="creator@example.com"
              className="yt-input"
            />
          </div>
        </div>
        <button className="mt-4 px-4 py-2 bg-yt-red text-white rounded-full text-sm font-medium hover:bg-yt-red-dark transition-colors">
          Save Changes
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
                R
              </div>
              <div>
                <div className="font-medium">Your Channel</div>
                <div className="text-xs text-yt-text-secondary">Connected</div>
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
          {[
            { label: "Payment received alerts", description: "Get notified when a sponsorship payment comes in", enabled: true },
            { label: "New sponsorship opportunities", description: "AI-matched brand deals matching your niche", enabled: true },
            { label: "Revenue milestone alerts", description: "Celebrate when you hit revenue targets", enabled: true },
            { label: "Weekly revenue digest", description: "Summary of your revenue performance each Monday", enabled: false },
          ].map((n) => (
            <div key={n.label} className="flex items-center justify-between p-3 bg-yt-surface rounded-xl">
              <div>
                <div className="font-medium text-sm">{n.label}</div>
                <div className="text-xs text-yt-text-secondary">{n.description}</div>
              </div>
              <button
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  n.enabled ? "bg-yt-text" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${
                    n.enabled ? "translate-x-5.5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
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
              <div className="text-sm text-yt-text-secondary">No active subscription</div>
            </div>
            <button className="px-4 py-2 bg-yt-red text-white rounded-full text-sm font-medium hover:bg-yt-red-dark transition-colors">
              Upgrade
            </button>
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
          <button className="w-full text-left p-3 bg-yt-surface rounded-xl hover:bg-yt-hover transition-colors">
            <div className="font-medium text-sm">Connected Apps</div>
            <div className="text-xs text-yt-text-secondary">YouTube API, Google OAuth</div>
          </button>
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
            <div className="text-xs text-yt-text-secondary">Sign out of your account</div>
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

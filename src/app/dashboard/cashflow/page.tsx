"use client";

import { Calendar, DollarSign, ArrowRight, Clock, AlertCircle, Plus, Trash2, TrendingUp, Banknote, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface CashFlowEvent {
  id: string;
  type: "adsense" | "sponsorship" | "membership" | "affiliate" | "other";
  title: string;
  amount: number;
  expectedDate: string;
  status: "pending" | "received" | "overdue";
  notes?: string;
}

interface ChannelData {
  channel: { title: string };
  revenue: Array<{ estimatedRevenue: number; period: string }>;
  analytics: { views: number };
}

const eventTypeConfig: Record<string, { color: string; label: string; icon: typeof DollarSign }> = {
  adsense: { color: "bg-yt-red", label: "AdSense", icon: DollarSign },
  sponsorship: { color: "bg-yt-success", label: "Sponsorship", icon: Banknote },
  membership: { color: "bg-yt-green", label: "Membership", icon: Users },
  affiliate: { color: "bg-yellow-500", label: "Affiliate", icon: TrendingUp },
  other: { color: "bg-gray-400", label: "Other", icon: DollarSign },
};

const statusConfig: Record<string, { color: string; label: string }> = {
  pending: { color: "text-yellow-600 bg-yellow-50", label: "Pending" },
  received: { color: "text-yt-green bg-green-50", label: "Received" },
  overdue: { color: "text-red-600 bg-red-50", label: "Overdue" },
};

function generateAdSenseSchedule(revenue: number): CashFlowEvent[] {
  if (revenue <= 0) return [];
  const monthlyRevenue = revenue / 6;
  const events: CashFlowEvent[] = [];
  const now = new Date();

  for (let i = 0; i < 6; i++) {
    const earnedDate = new Date(now);
    earnedDate.setMonth(earnedDate.getMonth() - (5 - i));

    const payDate = new Date(earnedDate);
    payDate.setMonth(payDate.getMonth() + 1);
    payDate.setDate(21);

    if (payDate < now) continue;

    const variance = 0.8 + Math.random() * 0.4;
    events.push({
      id: `adsense-${i}`,
      type: "adsense",
      title: "YouTube AdSense Payment",
      amount: Math.round(monthlyRevenue * variance * 100) / 100,
      expectedDate: payDate.toISOString().split("T")[0],
      status: payDate < now ? "received" : payDate < new Date(now.getTime() + 14 * 86400000) ? "pending" : "pending",
      notes: `Earned ${earnedDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })}`,
    });
  }
  return events;
}

export default function CashFlowPage() {
  const { data: session } = useSession();
  const [channelData, setChannelData] = useState<ChannelData | null>(null);
  const [customEvents, setCustomEvents] = useState<CashFlowEvent[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ type: "sponsorship" as string, title: "", amount: "", expectedDate: "", notes: "" });
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem("youtube_data");
      if (cached) {
        setChannelData(JSON.parse(cached));
      }
    } catch {
      sessionStorage.removeItem("youtube_data");
    }

    try {
      const saved = localStorage.getItem("cashflow_events");
      if (saved) setCustomEvents(JSON.parse(saved));
    } catch {
      localStorage.removeItem("cashflow_events");
    }

    setLoading(false);
  }, [session]);

  const saveEvents = (events: CashFlowEvent[]) => {
    setCustomEvents(events);
    localStorage.setItem("cashflow_events", JSON.stringify(events));
  };

  const adsenseEvents = channelData?.revenue ? generateAdSenseSchedule(
    channelData.revenue.reduce((sum, r) => sum + r.estimatedRevenue, 0)
  ) : [];

  const allEvents = [...adsenseEvents, ...customEvents].sort(
    (a, b) => new Date(a.expectedDate).getTime() - new Date(b.expectedDate).getTime()
  );

  const filteredEvents = allEvents.filter((e) => e.expectedDate.startsWith(selectedMonth));

  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() + i);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const monthLabel = (m: string) => {
    const [y, mo] = m.split("-");
    return new Date(parseInt(y), parseInt(mo) - 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const totalPending = filteredEvents.filter((e) => e.status === "pending").reduce((s, e) => s + e.amount, 0);
  const totalReceived = filteredEvents.filter((e) => e.status === "received").reduce((s, e) => s + e.amount, 0);
  const totalExpected = filteredEvents.reduce((s, e) => s + e.amount, 0);

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.amount || !newEvent.expectedDate) return;
    const event: CashFlowEvent = {
      id: Date.now().toString(),
      type: newEvent.type as CashFlowEvent["type"],
      title: newEvent.title,
      amount: parseFloat(newEvent.amount),
      expectedDate: newEvent.expectedDate,
      status: "pending",
      notes: newEvent.notes,
    };
    saveEvents([...customEvents, event]);
    setNewEvent({ type: "sponsorship", title: "", amount: "", expectedDate: "", notes: "" });
    setShowAddModal(false);
  };

  const handleDeleteEvent = (id: string) => {
    saveEvents(customEvents.filter((e) => e.id !== id));
  };

  const handleMarkReceived = (id: string) => {
    saveEvents(customEvents.map((e) => (e.id === id ? { ...e, status: "received" as const } : e)));
  };

  const getDaysInMonth = (m: string) => {
    const [y, mo] = m.split("-");
    return new Date(parseInt(y), parseInt(mo), 0).getDate();
  };

  const getDayOfWeek = (m: string, day: number) => {
    const [y, mo] = m.split("-");
    return new Date(parseInt(y), parseInt(mo) - 1, day).getDay();
  };

  const daysInMonth = getDaysInMonth(selectedMonth);
  const firstDayOfWeek = getDayOfWeek(selectedMonth, 1);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Cash Flow Calendar</h2>
          <p className="text-yt-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Cash Flow Calendar</h2>
          <p className="text-yt-text-secondary text-sm">See when money actually hits your bank</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="yt-btn yt-btn-primary py-2 px-4 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Payment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <div className="yt-card p-3 md:p-5 border border-yt-border">
          <div className="flex items-center gap-2 text-xs md:text-sm text-yt-text-secondary mb-1">
            <TrendingUp className="w-4 h-4" />
            Expected
          </div>
          <div className="text-lg md:text-2xl font-bold">${totalExpected.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
        <div className="yt-card p-3 md:p-5 border border-yt-border">
          <div className="flex items-center gap-2 text-xs md:text-sm text-yt-text-secondary mb-1">
            <Clock className="w-4 h-4" />
            Pending
          </div>
          <div className="text-lg md:text-2xl font-bold text-yellow-600">${totalPending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
        <div className="yt-card p-3 md:p-5 border border-yt-border">
          <div className="flex items-center gap-2 text-xs md:text-sm text-yt-text-secondary mb-1">
            <DollarSign className="w-4 h-4" />
            Received
          </div>
          <div className="text-lg md:text-2xl font-bold text-yt-green">${totalReceived.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
      </div>

      {/* Month Selector */}
      <div className="flex gap-1 overflow-x-auto pb-2 -mx-1 px-1">
        {months.map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMonth(m)}
            className={`yt-chip text-xs shrink-0 ${selectedMonth === m ? "active" : ""}`}
          >
            {monthLabel(m).split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="yt-card border border-yt-border p-3 md:p-5">
        <h3 className="font-medium mb-4">{monthLabel(selectedMonth)}</h3>
        <div className="grid grid-cols-7 gap-px bg-yt-border rounded-lg overflow-hidden">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="bg-yt-surface p-1 md:p-2 text-center text-[10px] md:text-xs font-medium text-yt-text-secondary">
              {d}
            </div>
          ))}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-white p-1 md:p-2 min-h-[40px] md:min-h-[60px]" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${selectedMonth}-${String(day).padStart(2, "0")}`;
            const dayEvents = allEvents.filter((e) => e.expectedDate === dateStr);
            return (
              <div key={day} className="bg-white p-1 md:p-2 min-h-[40px] md:min-h-[60px]">
                <div className="text-[10px] md:text-xs font-medium mb-1">{day}</div>
                {dayEvents.map((event) => {
                  const config = eventTypeConfig[event.type];
                  return (
                    <div
                      key={event.id}
                      className={`${config.color} text-white text-[8px] md:text-[10px] px-1 py-0.5 rounded truncate mb-0.5`}
                      title={`${event.title}: $${event.amount}`}
                    >
                      ${event.amount >= 1000 ? `${(event.amount / 1000).toFixed(1)}k` : event.amount}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Payments List */}
      <div className="yt-card border border-yt-border">
        <div className="p-4 md:p-5 border-b border-yt-border">
          <h3 className="font-medium">Payments — {monthLabel(selectedMonth)}</h3>
        </div>
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center text-sm text-yt-text-secondary">
            No payments this month
          </div>
        ) : (
          <div className="divide-y divide-yt-border">
            {filteredEvents.map((event) => {
              const config = eventTypeConfig[event.type];
              const status = statusConfig[event.status];
              const isCustom = customEvents.some((e) => e.id === event.id);
              return (
                <div key={event.id} className="p-3 md:p-4 hover:bg-yt-surface transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg ${config.color} flex items-center justify-center shrink-0`}>
                      <config.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{event.title}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="text-xs text-yt-text-secondary">
                        {new Date(event.expectedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        {event.notes && ` • ${event.notes}`}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-sm">${event.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      {isCustom && event.status === "pending" && (
                        <button
                          onClick={() => handleMarkReceived(event.id)}
                          className="text-[10px] text-yt-green hover:underline"
                        >
                          Mark received
                        </button>
                      )}
                    </div>
                    {isCustom && (
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded transition-all"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* AdSense Delay Explainer */}
      <div className="yt-card p-4 md:p-5 border border-yt-border">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yt-success shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-sm mb-1">How AdSense payments work</h3>
            <p className="text-xs text-yt-text-secondary leading-relaxed">
              YouTube earnings accumulate during a month (e.g., January). You&apos;re paid around the 21st of the following month (e.g., February 21st). This means there&apos;s always a 30-60 day delay between earning and receiving your AdSense payment. The calendar above shows expected payment dates based on this schedule.
            </p>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="yt-card p-5 md:p-6 border border-yt-border w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Add Payment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                  className="yt-input"
                >
                  <option value="sponsorship">Sponsorship</option>
                  <option value="membership">Membership</option>
                  <option value="affiliate">Affiliate</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="e.g., Nike sponsorship"
                  className="yt-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount ($) *</label>
                <input
                  type="number"
                  value={newEvent.amount}
                  onChange={(e) => setNewEvent({ ...newEvent, amount: e.target.value })}
                  placeholder="e.g., 5000"
                  className="yt-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Expected Date *</label>
                <input
                  type="date"
                  value={newEvent.expectedDate}
                  onChange={(e) => setNewEvent({ ...newEvent, expectedDate: e.target.value })}
                  className="yt-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <input
                  type="text"
                  value={newEvent.notes}
                  onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                  placeholder="e.g., Product review video"
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
                onClick={handleAddEvent}
                disabled={!newEvent.title || !newEvent.amount || !newEvent.expectedDate}
                className="flex-1 py-2 bg-yt-red text-white rounded-full font-medium text-sm hover:bg-yt-red-dark transition-colors disabled:opacity-50"
              >
                Add Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

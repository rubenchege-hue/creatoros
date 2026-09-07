"use client";

import { Plus, MoreHorizontal, DollarSign, Calendar, Building2, Trash2 } from "lucide-react";
import { useState } from "react";

interface Deal {
  id: string;
  brand: string;
  value: string;
  contact: string;
  deadline: string;
  notes: string;
}

const columns = [
  { id: "leads", label: "Leads", color: "bg-gray-400" },
  { id: "contacted", label: "Contacted", color: "bg-yt-success" },
  { id: "negotiating", label: "Negotiating", color: "bg-yellow-500" },
  { id: "won", label: "Won", color: "bg-yt-green" },
  { id: "invoiced", label: "Invoiced", color: "bg-blue-500" },
  { id: "paid", label: "Paid", color: "bg-purple-500" },
];

const statusColors: Record<string, string> = {
  leads: "border-t-gray-400",
  contacted: "border-t-yt-success",
  negotiating: "border-t-yellow-500",
  won: "border-t-yt-green",
  invoiced: "border-t-blue-500",
  paid: "border-t-purple-500",
};

export default function SponsorshipsPage() {
  const [deals, setDeals] = useState<Record<string, Deal[]>>({
    leads: [],
    contacted: [],
    negotiating: [],
    won: [],
    invoiced: [],
    paid: [],
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeal, setNewDeal] = useState({ brand: "", value: "", contact: "", deadline: "", notes: "" });

  const totalPipeline = Object.values(deals)
    .flat()
    .reduce((sum, deal) => sum + parseInt(deal.value.replace(/[$,]/g, "") || "0"), 0);

  const wonDeals = deals.won.length + deals.invoiced.length + deals.paid.length;

  const handleAddDeal = () => {
    if (!newDeal.brand || !newDeal.value) return;
    const deal: Deal = {
      id: Date.now().toString(),
      ...newDeal,
    };
    setDeals((prev) => ({
      ...prev,
      leads: [...prev.leads, deal],
    }));
    setNewDeal({ brand: "", value: "", contact: "", deadline: "", notes: "" });
    setShowAddModal(false);
  };

  const handleDeleteDeal = (columnId: string, dealId: string) => {
    setDeals((prev) => ({
      ...prev,
      [columnId]: prev[columnId].filter((d) => d.id !== dealId),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Sponsorship Pipeline</h2>
          <p className="text-yt-text-secondary text-sm">Manage your brand deals from lead to payment</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="yt-btn yt-btn-primary py-2 px-4 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Deal
        </button>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="yt-card p-5 border border-yt-border">
          <div className="text-sm text-yt-text-secondary mb-1">Total Pipeline</div>
          <div className="text-2xl font-bold">${totalPipeline.toLocaleString()}</div>
          <div className="text-xs text-yt-text-secondary mt-1">{Object.values(deals).flat().length} deals</div>
        </div>
        <div className="yt-card p-5 border border-yt-border">
          <div className="text-sm text-yt-text-secondary mb-1">Deals Won</div>
          <div className="text-2xl font-bold text-yt-green">{wonDeals}</div>
        </div>
        <div className="yt-card p-5 border border-yt-border">
          <div className="text-sm text-yt-text-secondary mb-1">Avg Deal Size</div>
          <div className="text-2xl font-bold">
            ${Object.values(deals).flat().length > 0
              ? Math.round(totalPipeline / Object.values(deals).flat().length).toLocaleString()
              : "0"}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 -mx-3 md:mx-0 px-3 md:px-0">
        {columns.map((col) => (
          <div key={col.id} className="w-64 md:w-72 shrink-0">
            <div className={`yt-card border border-yt-border border-t-2 ${statusColors[col.id]}`}>
              <div className="p-4 border-b border-yt-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{col.label}</span>
                    <span className="text-xs bg-yt-surface text-yt-text-secondary px-2 py-0.5 rounded-full">
                      {deals[col.id]?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-3 space-y-3 min-h-[300px]">
                {deals[col.id]?.length === 0 && (
                  <div className="text-center py-8 text-sm text-yt-text-secondary">
                    No deals
                  </div>
                )}
                {deals[col.id]?.map((deal) => (
                  <div
                    key={deal.id}
                    className="bg-yt-surface p-3 rounded-xl border border-yt-border hover:shadow-sm transition-shadow cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-yt-red/10 flex items-center justify-center font-bold text-xs text-yt-red">
                          {deal.brand[0]}
                        </div>
                        <span className="font-medium text-sm">{deal.brand}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-sm text-yt-green">{deal.value}</span>
                        <button
                          onClick={() => handleDeleteDeal(col.id, deal.id)}
                          className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded transition-all"
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </button>
                      </div>
                    </div>
                    {deal.contact && (
                      <div className="flex items-center gap-1 text-xs text-yt-text-secondary mb-1">
                        <Building2 className="w-3 h-3" />
                        {deal.contact}
                      </div>
                    )}
                    {deal.deadline && (
                      <div className="flex items-center gap-1 text-xs text-yt-text-secondary">
                        <Calendar className="w-3 h-3" />
                        {deal.deadline}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Deal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="yt-card p-6 border border-yt-border w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Add New Deal</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Brand Name *</label>
                <input
                  type="text"
                  value={newDeal.brand}
                  onChange={(e) => setNewDeal({ ...newDeal, brand: e.target.value })}
                  placeholder="e.g., Vercel"
                  className="yt-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deal Value *</label>
                <input
                  type="text"
                  value={newDeal.value}
                  onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })}
                  placeholder="e.g., $5,000"
                  className="yt-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact</label>
                <input
                  type="email"
                  value={newDeal.contact}
                  onChange={(e) => setNewDeal({ ...newDeal, contact: e.target.value })}
                  placeholder="e.g., partnerships@vercel.com"
                  className="yt-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deadline</label>
                <input
                  type="text"
                  value={newDeal.deadline}
                  onChange={(e) => setNewDeal({ ...newDeal, deadline: e.target.value })}
                  placeholder="e.g., Sep 30"
                  className="yt-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <input
                  type="text"
                  value={newDeal.notes}
                  onChange={(e) => setNewDeal({ ...newDeal, notes: e.target.value })}
                  placeholder="e.g., Tutorial sponsorship"
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
                onClick={handleAddDeal}
                disabled={!newDeal.brand || !newDeal.value}
                className="flex-1 py-2 bg-yt-red text-white rounded-full font-medium text-sm hover:bg-yt-red-dark transition-colors disabled:opacity-50"
              >
                Add Deal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

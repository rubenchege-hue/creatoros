"use client";

import { Receipt, DollarSign, Plus, Trash2, Tag, TrendingDown, Calculator, Download, AlertCircle, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  deductible: boolean;
  notes?: string;
}

interface ChannelData {
  channel: { title: string };
  revenue: Array<{ estimatedRevenue: number; period: string }>;
  analytics: { views: number };
}

const categories = [
  { id: "equipment", label: "Equipment", deductible: true, icon: "🎥" },
  { id: "software", label: "Software & Tools", deductible: true, icon: "💻" },
  { id: "travel", label: "Travel", deductible: true, icon: "✈️" },
  { id: "home-office", label: "Home Office", deductible: true, icon: "🏠" },
  { id: "education", label: "Education", deductible: true, icon: "📚" },
  { id: "marketing", label: "Marketing", deductible: true, icon: "📢" },
  { id: "contractors", label: "Contractors", deductible: true, icon: "👥" },
  { id: "subscriptions", label: "Subscriptions", deductible: true, icon: "🔄" },
  { id: "production", label: "Production", deductible: true, icon: "🎬" },
  { id: "office-supplies", label: "Office Supplies", deductible: true, icon: "📎" },
  { id: "meals", label: "Meals & Entertainment", deductible: true, icon: "🍽️" },
  { id: "other", label: "Other", deductible: true, icon: "📦" },
  { id: "personal", label: "Personal (Non-Deductible)", deductible: false, icon: "🛒" },
];

const taxRates = {
  federal: 0.22,
  state: 0.05,
  selfEmployment: 0.153,
};

export default function ExpensesPage() {
  const { data: session } = useSession();
  const [channelData, setChannelData] = useState<ChannelData | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpense, setNewExpense] = useState({ description: "", amount: "", category: "equipment", date: new Date().toISOString().split("T")[0], notes: "" });
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem("youtube_data");
      if (cached) setChannelData(JSON.parse(cached));
    } catch {
      sessionStorage.removeItem("youtube_data");
    }

    try {
      const saved = localStorage.getItem("expenses");
      if (saved) setExpenses(JSON.parse(saved));
    } catch {
      localStorage.removeItem("expenses");
    }

    setLoading(false);
  }, [session]);

  const saveExpenses = (exp: Expense[]) => {
    setExpenses(exp);
    localStorage.setItem("expenses", JSON.stringify(exp));
  };

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount) return;
    const cat = categories.find((c) => c.id === newExpense.category);
    const expense: Expense = {
      id: Date.now().toString(),
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: newExpense.date,
      deductible: cat?.deductible ?? true,
      notes: newExpense.notes,
    };
    saveExpenses([...expenses, expense]);
    setNewExpense({ description: "", amount: "", category: "equipment", date: new Date().toISOString().split("T")[0], notes: "" });
    setShowAddModal(false);
  };

  const handleDeleteExpense = (id: string) => {
    saveExpenses(expenses.filter((e) => e.id !== id));
  };

  const filteredExpenses = expenses.filter((e) => {
    const matchesYear = e.date.startsWith(selectedYear);
    const matchesCategory = selectedCategory === "all" || e.category === selectedCategory;
    return matchesYear && matchesCategory;
  });

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const deductibleExpenses = filteredExpenses.filter((e) => e.deductible);
  const totalDeductible = deductibleExpenses.reduce((sum, e) => sum + e.amount, 0);

  const totalRevenue = channelData?.revenue?.reduce((sum, r) => sum + r.estimatedRevenue, 0) || 0;
  const netIncome = totalRevenue - totalDeductible;

  const estimatedTax = Math.max(0,
    netIncome * taxRates.federal +
    netIncome * taxRates.state +
    totalRevenue * taxRates.selfEmployment
  );

  const quarterlyTax = estimatedTax / 4;

  const expensesByCategory = categories
    .map((cat) => ({
      ...cat,
      total: filteredExpenses.filter((e) => e.category === cat.id).reduce((s, e) => s + e.amount, 0),
    }))
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);

  const monthlyTotals = Array.from({ length: 12 }, (_, i) => {
    const month = String(i + 1).padStart(2, "0");
    const monthExpenses = filteredExpenses
      .filter((e) => e.date.endsWith(`-${month}`))
      .reduce((s, e) => s + e.amount, 0);
    return { month: new Date(parseInt(selectedYear), i).toLocaleDateString("en-US", { month: "short" }), total: monthExpenses };
  });

  const maxMonthly = Math.max(...monthlyTotals.map((m) => m.total), 1);

  const handleExportCSV = () => {
    const header = "Date,Description,Category,Amount,Deductible,Notes\n";
    const rows = filteredExpenses.map((e) =>
      `${e.date},"${e.description}",${categories.find((c) => c.id === e.category)?.label || e.category},${e.amount},${e.deductible ? "Yes" : "No"},"${e.notes || ""}"`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `creatoros-expenses-${selectedYear}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Tax & Expenses</h2>
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
          <h2 className="text-xl md:text-2xl font-bold">Tax & Expenses</h2>
          <p className="text-yt-text-secondary text-sm">Track deductible expenses and estimate quarterly taxes</p>
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
            Add Expense
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        <div className="yt-card p-3 md:p-5 border border-yt-border">
          <div className="flex items-center gap-2 text-xs md:text-sm text-yt-text-secondary mb-1">
            <TrendingDown className="w-4 h-4" />
            Total Expenses
          </div>
          <div className="text-lg md:text-2xl font-bold">${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
        <div className="yt-card p-3 md:p-5 border border-yt-border">
          <div className="flex items-center gap-2 text-xs md:text-sm text-yt-text-secondary mb-1">
            <Check className="w-4 h-4" />
            Deductible
          </div>
          <div className="text-lg md:text-2xl font-bold text-yt-green">${totalDeductible.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
        <div className="yt-card p-3 md:p-5 border border-yt-border">
          <div className="flex items-center gap-2 text-xs md:text-sm text-yt-text-secondary mb-1">
            <DollarSign className="w-4 h-4" />
            Net Income
          </div>
          <div className={`text-lg md:text-2xl font-bold ${netIncome >= 0 ? "" : "text-red-500"}`}>
            ${netIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="yt-card p-3 md:p-5 border border-yt-border">
          <div className="flex items-center gap-2 text-xs md:text-sm text-yt-text-secondary mb-1">
            <Calculator className="w-4 h-4" />
            Est. Quarterly Tax
          </div>
          <div className="text-lg md:text-2xl font-bold text-yellow-600">${quarterlyTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="yt-input w-full sm:w-auto sm:min-w-[120px]"
        >
          <option value="2026">2026</option>
          <option value="2025">2025</option>
        </select>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="yt-input w-full sm:w-auto sm:min-w-[180px]"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
          ))}
        </select>
      </div>

      {/* Monthly Chart */}
      <div className="yt-card p-4 md:p-5 border border-yt-border">
        <h3 className="font-medium mb-4">Monthly Expenses</h3>
        <div className="h-32 md:h-40 flex items-end gap-1">
          {monthlyTotals.map((m, i) => {
            const height = maxMonthly > 0 ? (m.total / maxMonthly) * 100 : 0;
            return (
              <div key={i} className="flex-1 flex flex-col justify-end">
                <div
                  className="bg-yt-red rounded-t"
                  style={{ height: `${Math.max(height, 2)}%` }}
                />
                <div className="text-[9px] md:text-[10px] text-yt-text-secondary text-center mt-1">{m.month}</div>
                {m.total > 0 && (
                  <div className="text-[8px] md:text-[10px] text-yt-text-secondary text-center">
                    ${m.total >= 1000 ? `${(m.total / 1000).toFixed(1)}k` : Math.round(m.total)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Breakdown */}
      {expensesByCategory.length > 0 && (
        <div className="yt-card p-4 md:p-5 border border-yt-border">
          <h3 className="font-medium mb-4">By Category</h3>
          <div className="space-y-3">
            {expensesByCategory.map((cat) => {
              const pct = totalExpenses > 0 ? (cat.total / totalExpenses) * 100 : 0;
              return (
                <div key={cat.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm flex items-center gap-2">
                      <span>{cat.icon}</span>
                      {cat.label}
                    </span>
                    <span className="text-sm font-medium">${cat.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="w-full h-2 bg-yt-surface rounded-full">
                    <div className="h-full bg-yt-red rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Expense List */}
      <div className="yt-card border border-yt-border">
        <div className="p-4 md:p-5 border-b border-yt-border">
          <h3 className="font-medium">Expenses ({filteredExpenses.length})</h3>
        </div>
        {filteredExpenses.length === 0 ? (
          <div className="p-8 text-center">
            <Receipt className="w-10 h-10 text-yt-text-secondary/30 mx-auto mb-3" />
            <p className="text-sm text-yt-text-secondary">No expenses yet</p>
            <p className="text-xs text-yt-text-secondary mt-1">Add your first expense to start tracking deductions</p>
          </div>
        ) : (
          <div className="divide-y divide-yt-border">
            {filteredExpenses.sort((a, b) => b.date.localeCompare(a.date)).map((expense) => {
              const cat = categories.find((c) => c.id === expense.category);
              return (
                <div key={expense.id} className="p-3 md:p-4 hover:bg-yt-surface transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-yt-surface flex items-center justify-center shrink-0 text-base md:text-lg">
                      {cat?.icon || "📦"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{expense.description}</span>
                        {expense.deductible && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-50 text-yt-green font-medium">
                            Deductible
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-yt-text-secondary">
                        {new Date(expense.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        {expense.notes && ` • ${expense.notes}`}
                      </div>
                    </div>
                    <div className="text-right shrink-0 flex items-center gap-2">
                      <span className="font-bold text-sm">-${expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded transition-all"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tax Info */}
      <div className="yt-card p-4 md:p-5 border border-yt-border">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yt-success shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-sm mb-1">Tax estimates are approximate</h3>
            <p className="text-xs text-yt-text-secondary leading-relaxed">
              Based on 22% federal + 5% state + 15.3% self-employment tax. Actual rates vary by location and income level. Consult a tax professional for accurate estimates. Deductible expenses reduce your taxable income.
            </p>
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="yt-card p-5 md:p-6 border border-yt-border w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Add Expense</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  placeholder="e.g., Sony A7IV Camera"
                  className="yt-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount ($) *</label>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  placeholder="e.g., 2500"
                  className="yt-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="yt-input"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  className="yt-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <input
                  type="text"
                  value={newExpense.notes}
                  onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                  placeholder="e.g., B-roll camera upgrade"
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
                onClick={handleAddExpense}
                disabled={!newExpense.description || !newExpense.amount}
                className="flex-1 py-2 bg-yt-red text-white rounded-full font-medium text-sm hover:bg-yt-red-dark transition-colors disabled:opacity-50"
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

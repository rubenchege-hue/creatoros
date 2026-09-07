"use client";

import { Sparkles, Copy, RefreshCw, TrendingUp, Lightbulb, Target, ChevronDown } from "lucide-react";
import { useState } from "react";

const titleSuggestions = [
  { title: "Why Every Developer Needs This Tool in 2026", ctr: "12.4%", score: "A+" },
  { title: "I Replaced 5 Tools With 1 (Here's What Happened)", ctr: "11.8%", score: "A" },
  { title: "The Productivity Stack Nobody Talks About", ctr: "10.2%", score: "A" },
  { title: "Stop Using These 3 Outdated Tools", ctr: "9.7%", score: "B+" },
  { title: "My Complete Creator Workflow (Behind the Scenes)", ctr: "8.9%", score: "B" },
];

const descriptionTemplate = `Hey creators! In this video, I'm sharing my complete workflow for managing YouTube sponsorships and revenue. If you've ever struggled with tracking brand deals, calculating your RPM, or just keeping everything organized — this one's for you.

🔗 Links mentioned:
• Tool 1: [affiliate link]
• Tool 2: [affiliate link]

📱 Follow me:
• Twitter: @sarahchen
• Instagram: @sarahchen

⏰ Timestamps:
0:00 - Introduction
2:15 - The Problem
5:30 - My Solution
12:45 - Live Demo
18:00 - Results

#YouTube #Creator #Productivity`;

const nicheIdeas = [
  { niche: "Tech", cpm: "$12-18", ideas: ["AI tools review", "Developer setup tour", "Code editor comparison"] },
  { niche: "Lifestyle", cpm: "$8-14", ideas: ["Morning routine", "Home office tour", "Productivity hacks"] },
  { niche: "Finance", cpm: "$15-25", ideas: ["Investing for beginners", "Side hustle ideas", "Budget setup"] },
  { niche: "Fitness", cpm: "$10-16", ideas: ["Workout routine", "Meal prep guide", "Supplement review"] },
];

export default function AIStudioPage() {
  const [selectedNiche, setSelectedNiche] = useState("Tech");
  const [videoTopic, setVideoTopic] = useState("");
  const [generatedTitle, setGeneratedTitle] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGeneratedTitle("The Secret YouTube Algorithm Hack Nobody's Talking About in 2026");
      setGenerating(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">AI Content Studio</h2>
        <p className="text-muted">Generate revenue-optimized titles, descriptions, and content ideas</p>
      </div>

      {/* Usage Banner */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-xl border border-primary/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">Free Plan: 2 of 3 title generations remaining today</span>
        </div>
        <button className="text-sm text-primary font-medium hover:underline">Upgrade for Unlimited</button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Title Generator */}
        <div className="bg-white p-6 rounded-xl border border-card-border">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-semibold">Title Generator</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Video Topic</label>
              <input
                type="text"
                value={videoTopic}
                onChange={(e) => setVideoTopic(e.target.value)}
                placeholder="e.g., Best productivity tools for creators"
                className="w-full px-4 py-2.5 border border-card-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Niche</label>
              <div className="flex gap-2 flex-wrap">
                {["Tech", "Lifestyle", "Finance", "Fitness", "Education"].map((n) => (
                  <button
                    key={n}
                    onClick={() => setSelectedNiche(n)}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                      selectedNiche === n
                        ? "bg-primary text-white border-primary"
                        : "border-card-border hover:bg-gray-50"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating || !videoTopic}
              className="w-full py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Titles
                </>
              )}
            </button>
          </div>

          {/* Generated Title */}
          {generatedTitle && (
            <div className="mt-4 p-4 bg-success/5 border border-success/20 rounded-lg">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-sm">{generatedTitle}</p>
                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors shrink-0">
                  <Copy className="w-4 h-4 text-muted" />
                </button>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted">
                <span>CTR Estimate: 11.2%</span>
                <span>Score: A</span>
                <span>Characters: {generatedTitle.length}/60</span>
              </div>
            </div>
          )}

          {/* Suggested Titles */}
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-3">Suggested Titles (by CTR)</h4>
            <div className="space-y-2">
              {titleSuggestions.map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group">
                  <span className="text-xs text-muted w-6">{i + 1}.</span>
                  <span className="flex-1 text-sm">{s.title}</span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:bg-white rounded">
                      <Copy className="w-3 h-3 text-muted" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-medium text-success">{s.ctr}</span>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">{s.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description Generator */}
        <div className="bg-white p-6 rounded-xl border border-card-border">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-accent" />
            </div>
            <h3 className="font-semibold">Description Generator</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Video Title</label>
              <input
                type="text"
                defaultValue={generatedTitle || "Why Every Developer Needs This Tool in 2026"}
                className="w-full px-4 py-2.5 border border-card-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <button className="w-full py-2.5 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent/90 transition-colors flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Generate Description
            </button>
          </div>

          {/* Generated Description */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Generated Description</span>
              <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                <Copy className="w-4 h-4 text-muted" />
              </button>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-sm whitespace-pre-wrap font-mono text-xs leading-relaxed max-h-80 overflow-y-auto">
              {descriptionTemplate}
            </div>
          </div>
        </div>
      </div>

      {/* Revenue-Scored Content Ideas */}
      <div className="bg-white p-6 rounded-xl border border-card-border">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-warning" />
          </div>
          <div>
            <h3 className="font-semibold">Revenue-Scored Content Ideas</h3>
            <p className="text-xs text-muted">Ideas ranked by estimated revenue potential for {selectedNiche}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {nicheIdeas.map((n) => (
            <div key={n.niche} className={`p-4 rounded-xl border-2 transition-colors cursor-pointer ${
              selectedNiche === n.niche ? "border-primary bg-primary/5" : "border-card-border hover:border-gray-300"
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold">{n.niche}</span>
                <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">CPM {n.cpm}</span>
              </div>
              <ul className="space-y-2">
                {n.ideas.map((idea) => (
                  <li key={idea} className="flex items-center gap-2 text-sm text-muted">
                    <TrendingUp className="w-3 h-3 text-success shrink-0" />
                    {idea}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

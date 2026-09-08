"use client";

import { Sparkles, Copy, RefreshCw, TrendingUp, Lightbulb, Target, Check, ChevronDown } from "lucide-react";
import { useState } from "react";

const titleTemplates: Record<string, Array<(topic: string) => string>> = {
  Tech: [
    (t) => `Why ${t} Changes Everything in 2026`,
    (t) => `I Tried ${t} for 30 Days — Here's What Happened`,
    (t) => `The ${t} Guide Nobody Asked For (But You Need)`,
    (t) => `Stop Ignoring ${t} (Here's Why)`,
    (t) => `${t}: The Honest Truth After 6 Months`,
    (t) => `5 ${t} Mistakes That Are Costing You`,
    (t) => `${t} vs The Competition — Which Is Actually Better?`,
    (t) => `The Ultimate ${t} Setup for Creators`,
  ],
  Lifestyle: [
    (t) => `My ${t} Routine That Changed My Life`,
    (t) => `I Lived Like This for a Week — ${t}`,
    (t) => `The ${t} Hack Nobody Talks About`,
    (t) => `Why ${t} Is the Secret to Success`,
    (t) => `${t}: What I Wish I Knew Earlier`,
    (t) => `Transforming My ${t} in 30 Days`,
    (t) => `${t} Tour — My Complete Setup`,
    (t) => `The Truth About ${t} (Realistic Expectations)`,
  ],
  Finance: [
    (t) => `How to Start ${t} in 2026 (Beginner Guide)`,
    (t) => `${t} Changed My Financial Life`,
    (t) => `5 ${t} Strategies That Actually Work`,
    (t) => `The ${t} Mistake Costing You Thousands`,
    (t) => `${t}: A Complete Breakdown`,
    (t) => `Why Most People Get ${t} Wrong`,
    (t) => `${t} in 2026 — What You Need to Know`,
    (t) => `My ${t} Journey: Results After 1 Year`,
  ],
  Fitness: [
    (t) => `My ${t} Routine for Maximum Results`,
    (t) => `I Did ${t} Every Day for 30 Days`,
    (t) => `The ${t} Guide for Beginners`,
    (t) => `${t}: What Actually Works (Science-Based)`,
    (t) => `5 ${t} Mistakes You're Making`,
    (t) => `${t} vs Alternatives — Which Is Better?`,
    (t) => `The ${t} Plan That Transformed My Body`,
    (t) => `Why ${t} Is the Key to Fitness`,
  ],
  Education: [
    (t) => `How to Learn ${t} Fast (Complete Guide)`,
    (t) => `${t} Explained in 10 Minutes`,
    (t) => `The ${t} Course You Wish You Had`,
    (t) => `Master ${t} With This Simple Method`,
    (t) => `${t}: From Beginner to Expert`,
    (t) => `Why ${t} Is the Most Important Skill in 2026`,
    (t) => `${t} Masterclass — Everything You Need to Know`,
    (t) => `The Secret to Learning ${t} Quickly`,
  ],
};

const nicheCPMs: Record<string, string> = {
  Tech: "$12-18",
  Lifestyle: "$8-14",
  Finance: "$15-25",
  Fitness: "$10-16",
  Education: "$8-15",
};

const nicheIdeas: Record<string, Array<{ idea: string; potential: string }>> = {
  Tech: [
    { idea: "AI tools comparison and review", potential: "High CPM" },
    { idea: "Developer setup and workspace tour", potential: "Medium CPM" },
    { idea: "Coding editor deep-dive", potential: "High CPM" },
    { idea: "New tech product unboxing", potential: "Medium CPM" },
  ],
  Lifestyle: [
    { idea: "Morning routine optimization", potential: "Medium CPM" },
    { idea: "Home office setup on a budget", potential: "Medium CPM" },
    { idea: "Minimalist living challenge", potential: "Low CPM" },
    { idea: "Productivity system review", potential: "High CPM" },
  ],
  Finance: [
    { idea: "Investing for complete beginners", potential: "Very High CPM" },
    { idea: "Side hustle ideas that work", potential: "High CPM" },
    { idea: "Budgeting system deep-dive", potential: "High CPM" },
    { idea: "Tax optimization strategies", potential: "Very High CPM" },
  ],
  Fitness: [
    { idea: "Full workout routine for beginners", potential: "Medium CPM" },
    { idea: "Meal prep guide for muscle gain", potential: "Medium CPM" },
    { idea: "Supplement review and comparison", potential: "High CPM" },
    { idea: "Home gym setup guide", potential: "Medium CPM" },
  ],
  Education: [
    { idea: "How to learn programming fast", potential: "High CPM" },
    { idea: "Study techniques that work", potential: "Medium CPM" },
    { idea: "Online course comparison", potential: "High CPM" },
    { idea: "Career advice for students", potential: "Medium CPM" },
  ],
};

function estimateCTR(topic: string, niche: string): string {
  let base = 7.5;
  const topicLen = topic.length;
  if (topicLen < 20) base += 2;
  else if (topicLen > 50) base -= 1.5;
  if (topic.includes("?") || topic.includes("!")) base += 1;
  if (topic.match(/\d+/)) base += 0.8;
  if (topic.toLowerCase().includes("secret") || topic.toLowerCase().includes("truth")) base += 1.2;
  if (topic.toLowerCase().includes("how to") || topic.toLowerCase().includes("guide")) base += 0.5;
  const nicheBonus: Record<string, number> = { Tech: 0.5, Finance: 1, Fitness: 0.3, Lifestyle: 0, Education: 0.4 };
  base += nicheBonus[niche] || 0;
  return `${Math.min(Math.max(base + (Math.random() * 2 - 1), 5), 15).toFixed(1)}%`;
}

function scoreTitle(ctr: number): string {
  if (ctr >= 12) return "A+";
  if (ctr >= 10) return "A";
  if (ctr >= 8.5) return "B+";
  if (ctr >= 7) return "B";
  return "C";
}

function generateDescription(title: string, niche: string): string {
  const nicheHooks: Record<string, string> = {
    Tech: "Whether you're a seasoned developer or just getting started with technology, this video breaks down everything you need to know.",
    Lifestyle: "I've been experimenting with this for months, and the results speak for themselves. Let me walk you through my complete process.",
    Finance: "After researching extensively and testing these strategies personally, I'm sharing what actually works — no fluff, just results.",
    Fitness: "I've tried countless approaches, and this is the only system that consistently delivers results. Here's the complete breakdown.",
    Education: "I spent months distilling this into the clearest explanation possible. By the end of this video, you'll have a complete understanding.",
  };

  const hook = nicheHooks[niche] || nicheHooks.Tech;

  return `${title} — In this video, I break down everything you need to know.

${hook}

What you'll learn in this video:
• The core concepts explained simply
• Practical tips you can apply today
• Common mistakes to avoid
• My personal recommendations

🔗 Links & Resources:
• [Tool/Resource 1]: affiliate_link
• [Tool/Resource 2]: affiliate_link
• [Full Blog Post]: website_link

📱 Connect with me:
• Twitter: @handle
• Instagram: @handle
• Newsletter: subscribe_link

⏰ Timestamps:
0:00 — Introduction
1:30 — Background & Context
4:00 — The Main Content
10:00 — Practical Tips
15:00 — Results & Takeaways
17:30 — Final Thoughts

If this video helped you, please like and subscribe for more content like this!

#YouTube #${niche} #Creator #Tutorial`;
}

export default function AIStudioPage() {
  const [selectedNiche, setSelectedNiche] = useState("Tech");
  const [videoTopic, setVideoTopic] = useState("");
  const [generatedTitles, setGeneratedTitles] = useState<Array<{ title: string; ctr: string; score: string }>>([]);
  const [generating, setGenerating] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState("");
  const [descTitle, setDescTitle] = useState("");
  const [generatingDesc, setGeneratingDesc] = useState(false);
  const [copiedTitle, setCopiedTitle] = useState<number | null>(null);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [usageCount, setUsageCount] = useState(() => {
    if (typeof window === "undefined") return 0;
    try {
      const stored = localStorage.getItem("creatoros_ai_usage");
      if (stored) {
        const data = JSON.parse(stored);
        const today = new Date().toDateString();
        if (data.date === today) return data.count;
      }
    } catch {}
    return 0;
  });

  const handleGenerate = () => {
    if (!videoTopic) return;
    setGenerating(true);

    setTimeout(() => {
      const templates = titleTemplates[selectedNiche] || titleTemplates.Tech;
      const titles = templates.map((tmpl) => {
        const title = tmpl(videoTopic);
        const ctr = parseFloat(estimateCTR(videoTopic, selectedNiche));
        return { title, ctr: `${ctr}%`, score: scoreTitle(ctr) };
      });
      titles.sort((a, b) => parseFloat(b.ctr) - parseFloat(a.ctr));
      setGeneratedTitles(titles);
      setGenerating(false);
      setUsageCount((prev: number) => {
        const newCount = prev + 1;
        try {
          localStorage.setItem("creatoros_ai_usage", JSON.stringify({ count: newCount, date: new Date().toDateString() }));
        } catch {}
        return newCount;
      });
    }, 1200);
  };

  const handleGenerateDescription = () => {
    const title = descTitle || generatedTitles[0]?.title || videoTopic;
    if (!title) return;
    setGeneratingDesc(true);
    setTimeout(() => {
      setGeneratedDescription(generateDescription(title, selectedNiche));
      setGeneratingDesc(false);
    }, 800);
  };

  const copyToClipboard = async (text: string, type: "title" | "desc", index?: number) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "title" && index !== undefined) {
        setCopiedTitle(index);
        setTimeout(() => setCopiedTitle(null), 1500);
      } else {
        setCopiedDesc(true);
        setTimeout(() => setCopiedDesc(false), 1500);
      }
    } catch {}
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
          <span className="text-sm font-medium">Free Plan: {Math.max(0, 3 - usageCount)} of 3 title generations remaining today</span>
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
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Niche</label>
              <div className="flex gap-2 flex-wrap">
                {Object.keys(titleTemplates).map((n) => (
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
              disabled={generating || !videoTopic || usageCount >= 3}
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

          {/* Generated Titles */}
          {generatedTitles.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">Generated Titles (ranked by CTR)</h4>
              <div className="space-y-2">
                {generatedTitles.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                    <span className="text-xs text-muted w-6">{i + 1}.</span>
                    <span className="flex-1 text-sm">{s.title}</span>
                    <button
                      onClick={() => copyToClipboard(s.title, "title", i)}
                      className="p-1 hover:bg-white rounded transition-colors shrink-0"
                    >
                      {copiedTitle === i ? (
                        <Check className="w-3 h-3 text-yt-green" />
                      ) : (
                        <Copy className="w-3 h-3 text-muted" />
                      )}
                    </button>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-medium text-success">{s.ctr}</span>
                      <span className="text-xs font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">{s.score}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={handleGenerate}
                className="mt-3 w-full py-2 text-sm text-primary font-medium hover:bg-primary/5 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Regenerate
              </button>
            </div>
          )}
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
                value={descTitle}
                onChange={(e) => setDescTitle(e.target.value)}
                placeholder={generatedTitles[0]?.title || "Enter or paste your video title"}
                className="w-full px-4 py-2.5 border border-card-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <button
              onClick={handleGenerateDescription}
              disabled={generatingDesc || (!descTitle && !videoTopic)}
              className="w-full py-2.5 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {generatingDesc ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Description
                </>
              )}
            </button>
          </div>

          {/* Generated Description */}
          {generatedDescription && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Generated Description</span>
                <button
                  onClick={() => copyToClipboard(generatedDescription, "desc")}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                >
                  {copiedDesc ? (
                    <Check className="w-4 h-4 text-yt-green" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted" />
                  )}
                </button>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-sm whitespace-pre-wrap font-mono text-xs leading-relaxed max-h-80 overflow-y-auto">
                {generatedDescription}
              </div>
              <div className="mt-2 text-xs text-muted">
                {generatedDescription.split("\n").length} lines · {generatedDescription.length} characters
              </div>
            </div>
          )}
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
          {Object.entries(nicheIdeas).map(([niche, ideas]) => (
            <div
              key={niche}
              onClick={() => setSelectedNiche(niche)}
              className={`p-4 rounded-xl border-2 transition-colors cursor-pointer ${
                selectedNiche === niche ? "border-primary bg-primary/5" : "border-card-border hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold">{niche}</span>
                <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">CPM {nicheCPMs[niche]}</span>
              </div>
              <ul className="space-y-2">
                {ideas.map((item) => (
                  <li key={item.idea} className="flex items-center gap-2 text-sm text-muted">
                    <TrendingUp className="w-3 h-3 text-success shrink-0" />
                    <div>
                      <div>{item.idea}</div>
                      <div className="text-[10px] text-yt-text-secondary">{item.potential}</div>
                    </div>
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

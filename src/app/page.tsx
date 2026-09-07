import Link from "next/link";
import { Play, BarChart3, DollarSign, Zap, Shield, Users, ArrowRight, Check, Star, TrendingUp, Bell, FileText, Globe, Calendar, Receipt, BarChart2 } from "lucide-react";

const features = [
  { icon: BarChart3, title: "Revenue Dashboard", desc: "See all your YouTube revenue in one place: AdSense, sponsorships, affiliates, memberships." },
  { icon: DollarSign, title: "Sponsorship Pipeline", desc: "Close more brand deals with Kanban pipeline, rate intelligence, and invoicing." },
  { icon: Zap, title: "AI Content Studio", desc: "Generate titles with CTR estimates, not generic suggestions." },
  { icon: Users, title: "Multi-Channel", desc: "Manage multiple channels for what competitors charge for 1." },
  { icon: TrendingUp, title: "Revenue Forecasting", desc: "Predict earnings based on content calendar and pipeline." },
  { icon: Shield, title: "Payment Tracking", desc: "Never miss a payment with automated tracking." },
  { icon: Calendar, title: "Cash Flow Calendar", desc: "See exactly when AdSense and sponsorships hit your bank. 30-60 day AdSense delay accounted for." },
  { icon: Receipt, title: "Tax & Expenses", desc: "Track deductible expenses, auto-categorize, estimate quarterly taxes. Export CSV for your accountant." },
  { icon: BarChart2, title: "Video P&L", desc: "Attach production costs per video. See true profit, not just revenue. Know which content actually makes money." },
];

const pricing = [
  { name: "Free", price: "$0", period: "forever", features: ["1 channel", "Basic dashboard", "Revenue overview", "3 AI generations/day"], cta: "Start Free", popular: false },
  { name: "Creator", price: "$19", period: "/mo", annual: "$15/mo annual", features: ["3 channels", "Full monetization hub", "Sponsorship pipeline", "Unlimited AI", "RPM tracking"], cta: "Get Started", popular: true },
  { name: "Agency", price: "$99", period: "/mo", annual: "$79/mo annual", features: ["10 channels", "Team collaboration", "White-label reports", "API access", "Priority support"], cta: "Go Agency", popular: false },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white border-b border-yt-border z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-lg bg-yt-red flex items-center justify-center">
              <Play className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-lg font-bold">CreatorOS</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-yt-text-secondary hover:text-yt-text">Log in</Link>
            <Link href="/dashboard/connect" className="yt-btn yt-btn-primary text-sm py-2 px-4">Start Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-yt-surface rounded-full px-4 py-1.5 mb-6">
            <Bell className="w-3.5 h-3.5 text-yt-red" />
            <span className="text-xs text-yt-text-secondary">87% of creators get paid late — we fix that</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Your YouTube Revenue
            <br />
            <span className="text-yt-red">Command Center</span>
          </h1>
          <p className="text-lg text-yt-text-secondary max-w-xl mx-auto mb-8">
            Stop juggling 5 tools to manage 1 channel. See all your revenue, close more sponsorships, grow your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard/connect" className="yt-btn yt-btn-primary py-3 px-6 text-base">
              Connect Your Channel
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/dashboard" className="yt-btn yt-btn-outline py-3 px-6 text-base">
              View Demo
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 mt-8 md:mt-12">
            {[
              { val: "87%", label: "creators paid late" },
              { val: "52%", label: "income from sponsors" },
              { val: "10hrs", label: "saved per week" },
              { val: "$310B", label: "creator economy" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold">{s.val}</div>
                <div className="text-xs text-yt-text-secondary">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-16 px-4 bg-yt-surface">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            You&apos;re using VidIQ for research, TubeBuddy for optimization,<br />
            spreadsheets for sponsorship tracking...
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: FileText, title: "Fragmented Tools", desc: "Creators spend $45-80/mo across 4+ tools that don't talk to each other." },
              { icon: DollarSign, title: "Missed Revenue", desc: "68% cite payment delays as #1 frustration. 55% cite financial instability." },
              { icon: Globe, title: "No Full Picture", desc: "3-5 revenue streams with no consolidated tooling." },
            ].map((f) => (
              <div key={f.title} className="yt-card p-6 border border-yt-border">
                <f.icon className="w-8 h-8 text-yt-red mb-3" />
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-yt-text-secondary">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Everything to <span className="text-yt-red">monetize like a pro</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.title} className="yt-card p-6 border border-yt-border hover:shadow-md transition-shadow">
                <f.icon className="w-8 h-8 text-yt-red mb-3" />
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-yt-text-secondary">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-yt-surface">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            See your revenue in <span className="text-yt-red">60 seconds</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { step: "1", title: "Connect", desc: "One-click Google sign-in" },
              { step: "2", title: "See Data", desc: "Instant dashboard with real revenue" },
              { step: "3", title: "Find Deals", desc: "AI-matched sponsorship leads" },
              { step: "4", title: "Get Paid", desc: "Pipeline to close deals" },
            ].map((i) => (
              <div key={i.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-yt-red text-white text-lg font-bold flex items-center justify-center mx-auto mb-3">
                  {i.step}
                </div>
                <h3 className="font-semibold mb-1">{i.title}</h3>
                <p className="text-sm text-yt-text-secondary">{i.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competitor Comparison */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
            Why creators switch to <span className="text-yt-red">CreatorOS</span>
          </h2>
          <p className="text-yt-text-secondary text-center mb-10 max-w-2xl mx-auto">
            VidIQ and TubeBuddy help you get views. CreatorOS helps you get paid. We&apos;re the only tool that combines revenue tracking, sponsorship pipeline, and AI content tools in one place.
          </p>

          {/* Comparison Table */}
          <div className="yt-card border border-yt-border overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-yt-surface border-b border-yt-border">
                    <th className="text-left py-3 px-4 font-medium text-yt-text-secondary w-1/4">Feature</th>
                    <th className="text-center py-3 px-4 font-bold text-yt-red w-1/4">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="w-5 h-5 rounded bg-yt-red flex items-center justify-center">
                          <Play className="w-3 h-3 text-white fill-white" />
                        </div>
                        CreatorOS
                      </div>
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-yt-text-secondary w-1/4">VidIQ</th>
                    <th className="text-center py-3 px-4 font-medium text-yt-text-secondary w-1/4">TubeBuddy</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Revenue Dashboard", creatoros: true, vidiq: false, tube: false },
                    { feature: "Sponsorship Pipeline", creatoros: true, vidiq: false, tube: false },
                    { feature: "AI Title Generator", creatoros: true, vidiq: true, tube: true },
                    { feature: "Video SEO & Tags", creatoros: false, vidiq: true, tube: true },
                    { feature: "Keyword Research", creatoros: false, vidiq: true, tube: true },
                    { feature: "Competitor Tracking", creatoros: false, vidiq: true, tube: true },
                    { feature: "Multi-Channel Support", creatoros: true, vidiq: false, tube: false },
                    { feature: "RPM & Earnings Per View", creatoros: true, vidiq: false, tube: false },
                    { feature: "A/B Thumbnail Testing", creatoros: false, vidiq: false, tube: true },
                    { feature: "Bulk Processing", creatoros: false, vidiq: false, tube: true },
                  ].map((row) => (
                    <tr key={row.feature} className="border-b border-yt-border last:border-0 hover:bg-yt-surface/50 transition-colors">
                      <td className="py-3 px-4 font-medium">{row.feature}</td>
                      <td className="py-3 px-4 text-center">
                        {row.creatoros ? (
                          <Check className="w-5 h-5 text-yt-green mx-auto" />
                        ) : (
                          <span className="text-yt-text-secondary/30">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {row.vidiq ? (
                          <Check className="w-5 h-5 text-yt-green mx-auto" />
                        ) : (
                          <span className="text-yt-text-secondary/30">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {row.tube ? (
                          <Check className="w-5 h-5 text-yt-green mx-auto" />
                        ) : (
                          <span className="text-yt-text-secondary/30">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "All-in-One vs. 4+ Tools", desc: "VidIQ ($16/mo) + TubeBuddy ($9/mo) + spreadsheet + CRM = $45+/mo. CreatorOS does it all for $19/mo." },
              { title: "Revenue First, Not Views", desc: "Other tools optimize for views. We optimize for revenue. See which content actually makes you money." },
              { title: "Built for Full-Time Creators", desc: "Not another SEO tool. CreatorOS is for creators who treat YouTube as a business and need real financial tooling." },
            ].map((v) => (
              <div key={v.title} className="yt-card p-5 border border-yt-border">
                <h3 className="font-semibold text-sm mb-1">{v.title}</h3>
                <p className="text-xs text-yt-text-secondary leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Creators love <span className="text-yt-red">CreatorOS</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { quote: "CreatorOS helped me close my first $3,000 sponsorship deal.", author: "Sarah Chen", role: "Tech Creator, 85K subs", metric: "$3,000 first deal" },
              { quote: "I replaced VidIQ, TubeBuddy, and my spreadsheet with one tool.", author: "Marcus Johnson", role: "Lifestyle, 230K subs", metric: "$200/mo saved" },
              { quote: "The dashboard showed me I was leaving $4K/mo on the table.", author: "Elena Rodriguez", role: "Fitness, 150K subs", metric: "$4K/mo recovered" },
            ].map((t) => (
              <div key={t.author} className="yt-card p-6 border border-yt-border">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yt-red fill-yt-red" />
                  ))}
                </div>
                <p className="text-sm mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{t.author}</div>
                    <div className="text-xs text-yt-text-secondary">{t.role}</div>
                  </div>
                  <span className="text-xs font-medium text-yt-green bg-green-50 px-2 py-0.5 rounded-full">
                    {t.metric}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 bg-yt-surface">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">Simple pricing</h2>
          <p className="text-yt-text-secondary text-center mb-10">
            VidIQ charges $16.58/mo for 1 channel. We charge $19/mo for 3.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {pricing.map((plan) => (
              <div key={plan.name} className={`yt-card p-6 border-2 ${plan.popular ? "border-yt-red" : "border-yt-border"} relative`}>
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yt-red text-white text-xs font-medium px-3 py-0.5 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="font-semibold mb-1">{plan.name}</h3>
                <div className="mb-3">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-yt-text-secondary text-sm">{plan.period}</span>
                </div>
                {plan.annual && <p className="text-xs text-yt-green mb-3">{plan.annual}</p>}
                <ul className="space-y-2 mb-5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-yt-green shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/dashboard/connect"
                  className={`block w-full py-2.5 text-center font-medium rounded-full transition-colors text-sm ${
                    plan.popular ? "bg-yt-red text-white hover:bg-yt-red-dark" : "bg-yt-surface text-yt-text hover:bg-yt-border"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto bg-yt-red rounded-2xl p-6 md:p-10 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            You&apos;re leaving money on the table
          </h2>
          <p className="opacity-90 mb-6">
            Creators using CreatorOS close 40% more sponsorship deals and save 10 hours/week.
          </p>
          <Link href="/dashboard/connect" className="yt-btn bg-white text-yt-red hover:bg-gray-100 py-3 px-6 text-base">
            Connect Your Channel
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-yt-border">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-yt-red flex items-center justify-center">
              <Play className="w-3.5 h-3.5 text-white fill-white" />
            </div>
            <span className="font-bold">CreatorOS</span>
          </div>
          <div className="flex gap-6 text-sm text-yt-text-secondary">
            <a href="#" className="hover:text-yt-text">Privacy</a>
            <a href="#" className="hover:text-yt-text">Terms</a>
            <a href="#" className="hover:text-yt-text">Support</a>
          </div>
          <p className="text-xs text-yt-text-secondary">© 2026 CreatorOS</p>
        </div>
      </footer>
    </div>
  );
}

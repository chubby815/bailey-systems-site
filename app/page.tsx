import { HeroInput } from "@/components/HeroInput";
import { AgentCards } from "@/components/AgentCards";

export default function Home() {
  return (
    <div className="bg-[#08090a] text-[#f0f0f0] overflow-x-hidden">

      {/* ── SECTION 1: HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#00e5a0]/8 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[500px] bg-blue-600/5 rounded-full blur-[140px]" />
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          {/* Fade edges */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#08090a] via-transparent to-[#08090a]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#08090a] via-transparent to-[#08090a]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#111214] border border-white/10 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#00e5a0] animate-pulse" />
            <span className="text-sm text-[#9ca3af] font-medium">AI-Powered Business Platform</span>
          </div>

          {/* H1 */}
          <h1 className="font-syne text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
            AI Builds Your Business<br />
            Website in <span className="text-[#00e5a0]">60 Seconds</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-[#6b7280] max-w-2xl mx-auto mb-10 leading-relaxed">
            Generate a complete website, find leads, and create content — all powered by AI.
            No code. No designers. Just results.
          </p>

          {/* AI Input */}
          <HeroInput />

          {/* Social proof */}
          <p className="text-sm text-[#4b5563] mt-4">
            Trusted by 2,400+ businesses · Sites live in under 3 minutes
          </p>
          <p className="text-xs text-[#374151] mt-1">Cancel anytime · No questions asked</p>
        </div>
      </section>

      {/* ── STATS ROW ───────────────────────────────────────────────── */}
      <section className="border-y border-white/[0.05] bg-[#0d0e10] py-5 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-8 md:gap-16">
          {[
            { icon: "⚡", label: "60 Second Setup" },
            { icon: "🌐", label: "5 Premium Templates" },
            { icon: "🎯", label: "Real Lead Finder" },
            { icon: "💬", label: "AI Chat Included" },
            { icon: "🔒", label: "Powered by Stripe" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2 text-sm text-[#6b7280]">
              <span className="text-base">{s.icon}</span>
              <span className="font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 2: TEMPLATE PREVIEWS ───────────────────────────── */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[#00e5a0] text-xs font-semibold uppercase tracking-widest mb-3">
            What We Build
          </p>
          <h2 className="font-syne text-4xl md:text-5xl font-black tracking-tight">
            Live in minutes, not months
          </h2>
          <p className="text-[#6b7280] mt-4 max-w-xl mx-auto">
            Every site is custom-built, mobile-first, and ready to convert visitors into customers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Apex Fitness",
              industry: "Health & Wellness",
              template: "Dark Premium",
              gradient: "from-emerald-500/25 to-teal-600/10",
              dot: "bg-emerald-400",
            },
            {
              name: "Neon Legal",
              industry: "Legal Services",
              template: "Classic Business",
              gradient: "from-blue-500/25 to-violet-600/10",
              dot: "bg-blue-400",
            },
            {
              name: "Swift Realty",
              industry: "Real Estate",
              template: "Modern Minimal",
              gradient: "from-orange-500/25 to-rose-600/10",
              dot: "bg-orange-400",
            },
          ].map((item) => (
            <div
              key={item.name}
              className="bg-[#111214] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-white/20 transition-colors group cursor-pointer"
            >
              {/* Browser bar */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.07]">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <div className="flex-1 bg-white/[0.04] rounded-md h-4 ml-2" />
              </div>
              {/* Preview hero block */}
              <div
                className={`h-36 bg-gradient-to-br ${item.gradient} m-4 rounded-xl flex items-center justify-center`}
              >
                <div className={`w-12 h-12 rounded-full ${item.dot} opacity-40 blur-sm`} />
              </div>
              {/* Placeholder lines */}
              <div className="px-4 space-y-2 pb-3">
                <div className="h-2.5 bg-white/[0.05] rounded-full w-3/4" />
                <div className="h-2.5 bg-white/[0.05] rounded-full w-1/2" />
                <div className="h-2.5 bg-white/[0.05] rounded-full w-2/3" />
              </div>
              {/* Label */}
              <div className="px-4 pb-4 flex items-start justify-between">
                <div>
                  <span className="text-sm font-semibold text-[#f0f0f0] block">{item.name}</span>
                  <span className="text-xs text-[#6b7280]">{item.template}</span>
                </div>
                <span className="text-xs text-[#00e5a0] bg-[#00e5a0]/10 border border-[#00e5a0]/20 px-2.5 py-1 rounded-full shrink-0 ml-2">
                  {item.industry}
                </span>
              </div>
              <div className="px-4 pb-4">
                <span className="text-xs text-[#4b5563] group-hover:text-[#00e5a0] transition-colors">
                  View Example →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 3: AI AGENTS ────────────────────────────────────── */}
      <section id="agents" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[#00e5a0] text-xs font-semibold uppercase tracking-widest mb-3">
            AI Agents
          </p>
          <h2 className="font-syne text-4xl md:text-5xl font-black tracking-tight">
            Your AI team, working 24/7
          </h2>
          <p className="text-[#6b7280] mt-4 max-w-xl mx-auto">
            Three specialized agents that handle the work you hate — automatically.
          </p>
        </div>

        <AgentCards />
      </section>

      {/* ── SECTION 4: HOW IT WORKS ─────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 bg-[#111214]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#00e5a0] text-xs font-semibold uppercase tracking-widest mb-3">
              Process
            </p>
            <h2 className="font-syne text-4xl md:text-5xl font-black tracking-tight">
              Simple. Fast. Done.
            </h2>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="grid md:grid-cols-4 gap-8">
              {[
                { n: "01", title: "Tell Us Your Vision", desc: "Describe your business, goals, and what you need. Takes 2 minutes." },
                { n: "02", title: "AI Builds It", desc: "Our agents get to work — website, content, automations — all configured." },
                { n: "03", title: "Review & Refine", desc: "We walk you through the deliverables and adjust until it's perfect." },
                { n: "04", title: "Go Live", desc: "Your site goes live. Your agents start running. Revenue starts coming in." },
              ].map((step) => (
                <div key={step.n} className="text-center relative">
                  <div className="w-16 h-16 rounded-full bg-[#08090a] border border-white/[0.07] flex items-center justify-center mx-auto mb-5 relative z-10">
                    <span className="font-syne font-black text-[#00e5a0] text-lg">{step.n}</span>
                  </div>
                  <h3 className="font-syne font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-[#6b7280] leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: DASHBOARD MOCKUP ─────────────────────────────── */}
      <section className="py-24 px-6 bg-[#111214]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#00e5a0] text-xs font-semibold uppercase tracking-widest mb-3">
              Dashboard
            </p>
            <h2 className="font-syne text-4xl md:text-5xl font-black tracking-tight">
              Everything in one place
            </h2>
            <p className="text-[#6b7280] mt-4 max-w-xl mx-auto">
              Monitor your sites, agents, and revenue from a single clean dashboard.
            </p>
          </div>

          {/* Mockup */}
          <div className="bg-[#08090a] border border-white/[0.07] rounded-2xl overflow-hidden max-w-5xl mx-auto shadow-[0_0_80px_rgba(0,229,160,0.05)]">
            {/* App chrome */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.07]">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <div className="flex-1 flex items-center gap-2 ml-3">
                <div className="bg-white/[0.04] rounded-md h-5 w-48" />
              </div>
            </div>

            <div className="flex min-h-[400px]">
              {/* Sidebar */}
              <div className="w-52 border-r border-white/[0.07] p-4 hidden md:block">
                <div className="flex items-center gap-2 mb-6 px-2">
                  <div className="w-6 h-6 rounded-md bg-[#00e5a0]/20" />
                  <div className="h-3 bg-white/10 rounded-full w-24" />
                </div>
                <div className="space-y-1">
                  {["Overview", "My Sites", "AI Agents", "Analytics", "Billing", "Settings"].map((item, i) => (
                    <div
                      key={item}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs ${
                        i === 0
                          ? "bg-[#00e5a0]/10 text-[#00e5a0]"
                          : "text-[#6b7280]"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded ${i === 0 ? "bg-[#00e5a0]/30" : "bg-white/5"}`} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main content */}
              <div className="flex-1 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="h-4 bg-white/10 rounded-full w-32 mb-2" />
                    <div className="h-2.5 bg-white/5 rounded-full w-20" />
                  </div>
                  <div className="bg-[#00e5a0] text-black text-xs font-bold px-4 py-2 rounded-lg">
                    + New Site
                  </div>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: "Active Sites", value: "4", color: "text-[#00e5a0]" },
                    { label: "Total Leads", value: "247", color: "text-blue-400" },
                    { label: "Revenue", value: "$8.4k", color: "text-purple-400" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-[#111214] border border-white/[0.07] rounded-xl p-4">
                      <p className="text-xs text-[#6b7280] mb-1">{stat.label}</p>
                      <p className={`font-syne text-2xl font-black ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Site list */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-widest mb-3">Your Sites</p>
                  {[
                    { name: "Apex Fitness", status: "Live", traffic: "1.2k/mo" },
                    { name: "Neon Legal", status: "Live", traffic: "890/mo" },
                    { name: "Swift Realty", status: "Building", traffic: "—" },
                  ].map((site) => (
                    <div
                      key={site.name}
                      className="flex items-center justify-between bg-[#111214] border border-white/[0.07] rounded-xl px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5" />
                        <div>
                          <p className="text-sm font-medium">{site.name}</p>
                          <p className="text-xs text-[#6b7280]">{site.traffic} visitors</p>
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          site.status === "Live"
                            ? "bg-[#00e5a0]/10 text-[#00e5a0]"
                            : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {site.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION: TRUST & TESTIMONIALS ───────────────────────────── */}
      <section className="py-24 px-6 bg-[#111214]">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-14">
            <p className="text-[#00e5a0] text-xs font-semibold uppercase tracking-widest mb-3">
              Social Proof
            </p>
            <h2 className="font-syne text-4xl md:text-5xl font-black tracking-tight mb-3">
              Trusted by 2,400+ businesses
            </h2>
            <div className="flex justify-center gap-0.5 text-2xl">
              {"⭐⭐⭐⭐⭐".split("").map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </div>
          </div>

          {/* Testimonial cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "Generated my landscaping site in under a minute. Customers call me daily now.",
                name: "Marcus T.",
                role: "Landscaping Business Owner",
                initial: "M",
                color: "bg-emerald-500",
              },
              {
                quote: "The Lead Hunter found me 50 contacts in 10 minutes. Closed 3 deals already.",
                name: "Sarah K.",
                role: "Marketing Consultant",
                initial: "S",
                color: "bg-blue-500",
              },
              {
                quote: "Replaced my $200/month web agency. Bailey does it better and faster.",
                name: "James R.",
                role: "Restaurant Owner",
                initial: "J",
                color: "bg-purple-500",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="bg-[#08090a] border border-white/[0.07] rounded-2xl p-7 flex flex-col gap-5 hover:border-white/20 transition-colors"
              >
                {/* Stars */}
                <div className="flex gap-0.5 text-sm">⭐⭐⭐⭐⭐</div>
                {/* Quote */}
                <p className="text-[#d1d5db] text-sm leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                    {t.initial}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#f0f0f0]">{t.name}</p>
                    <p className="text-xs text-[#6b7280]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: CTA BANNER ───────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-[#111214] border border-white/[0.07] rounded-3xl p-16 overflow-hidden">
            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00e5a0]/5 rounded-full blur-[80px]" />
            </div>
            <div className="relative z-10">
              <h2 className="font-syne text-4xl md:text-5xl font-black tracking-tight mb-6">
                Your Business Deserves<br />
                to Be Online <span className="text-[#00e5a0]">Today</span>
              </h2>
              <p className="text-[#6b7280] text-lg mb-10 max-w-lg mx-auto">
                Stop waiting. Start building. We ship fast, we build right, and we make sure it works.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/login"
                  className="bg-[#00e5a0] hover:bg-[#00ffb2] text-black font-bold px-8 py-4 rounded-xl transition-colors text-sm"
                >
                  Start Building Free →
                </a>
                <a
                  href="mailto:Lilianajs27@gmail.com"
                  className="border border-white/10 hover:border-white/30 text-[#f0f0f0] font-semibold px-8 py-4 rounded-xl transition-colors text-sm"
                >
                  Talk to Us
                </a>
              </div>
              <p className="text-xs text-[#4b5563] mt-6">
                7-day free trial · Cancel anytime · No questions asked
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

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

      {/* ── SECTION: TEAM ───────────────────────────────────────────── */}
      <section id="team" className="py-24 px-6 bg-[#0d0e10]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-[#00e5a0] text-xs font-semibold uppercase tracking-widest mb-3">
              Our Team
            </p>
            <h2 className="font-syne text-4xl md:text-5xl font-black tracking-tight mb-5">
              The people behind Bailey
            </h2>
            <p className="text-[#6b7280] max-w-2xl mx-auto text-base leading-relaxed">
              BaileyAgents is a platform designed to help businesses generate 
              professional websites and powerful AI agents in minutes. Our mission 
              is to make advanced AI automation simple and accessible for 
              entrepreneurs, creators, and local businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
            {[
              {
                name: "Javier Sandoval",
                title: "Founder & AI Systems Developer",
                desc: "Creator of the BaileyAgents platform and the developer behind the Bailey AI automation system. Focused on building AI-powered tools that save time and improve productivity.",
                initial: "JS",
                color: "bg-[#00e5a0]/10 text-[#00e5a0] border border-[#00e5a0]/20",
                ai: false,
              },
              {
                name: "Rosa Sandoval",
                title: "Media Director & Creative Production",
                desc: "Leads visual and media production for BaileyAgents — photography, video, and creative content used across branding, marketing, and promotional material.",
                initial: "RS",
                color: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
                ai: false,
              },
              {
                name: "Manny Sandoval",
                title: "Head of Marketing & Growth",
                desc: "Leads marketing strategy and platform growth. Helps businesses understand how AI automation can transform their marketing and online presence.",
                initial: "MS",
                color: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
                ai: false,
              },
              {
                name: "Bailey AI",
                title: "Chief AI Automation Agent",
                desc: "The AI system powering BaileyAgents. Generates websites, operates agents, automates creative workflows, and assists businesses with AI-driven tools.",
                initial: "✦",
                color: "bg-[#00e5a0]/10 text-[#00e5a0] border border-[#00e5a0]/20",
                ai: true,
              },
            ].map((member) => (
              <div
                key={member.name}
                className="bg-[#111214] border border-white/[0.07] rounded-2xl p-6 flex flex-col gap-5 hover:border-white/20 transition-colors group"
              >
                {/* Photo placeholder */}
                <div className="w-full aspect-square rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col items-center justify-center gap-2 group-hover:border-white/10 transition-colors">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-black ${member.color}`}>
                    {member.initial}
                  </div>
                  <span className="text-[10px] text-[#3f3f46] uppercase tracking-widest">
                    {member.ai ? "AI Agent" : "Photo coming soon"}
                  </span>
                </div>

                {/* Info */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-syne font-bold text-[#f0f0f0] text-base">{member.name}</p>
                    {member.ai && (
                      <span className="text-[9px] font-bold uppercase tracking-widest bg-[#00e5a0]/10 text-[#00e5a0] border border-[#00e5a0]/20 px-2 py-0.5 rounded-full">
                        AI
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#00e5a0] font-semibold mb-3">{member.title}</p>
                  <p className="text-xs text-[#6b7280] leading-relaxed">{member.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 2: TEMPLATE PREVIEWS ───────────────────────────── */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[#00e5a0] text-xs font-semibold uppercase tracking-widest mb-3">
            See What We Build
          </p>
          <h2 className="font-syne text-4xl md:text-5xl font-black tracking-tight">
            5 stunning templates, built by AI
          </h2>
          <p className="text-[#6b7280] mt-4 max-w-xl mx-auto">
            Every site is custom-built, mobile-first, and ready to convert visitors into customers.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-4">

          <div className="bg-[#111214] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-[#00e5a0]/30 transition-colors group cursor-pointer flex flex-col">
            <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-white/[0.07]">
              <div className="w-2 h-2 rounded-full bg-red-500/60" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
              <div className="w-2 h-2 rounded-full bg-green-500/60" />
              <div className="flex-1 bg-white/[0.04] rounded h-3 ml-1.5" />
            </div>
            <div className="mx-3 my-3 rounded-xl overflow-hidden">
              <img
                src="/templates/dark-premium.png"
                alt="Dark Premium Template"
                style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }}
              />
            </div>
            <div className="px-3 pb-3">
              <p className="text-xs font-bold text-[#f0f0f0]">Dark Premium</p>
              <p className="text-[10px] text-[#4b5563]">Tesla meets Stripe</p>
              <span className="text-[10px] text-[#4b5563] group-hover:text-[#00e5a0] transition-colors">View →</span>
            </div>
          </div>

          <div className="bg-[#111214] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-yellow-400/30 transition-colors group cursor-pointer flex flex-col">
            <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-white/[0.07]">
              <div className="w-2 h-2 rounded-full bg-red-500/60" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
              <div className="w-2 h-2 rounded-full bg-green-500/60" />
              <div className="flex-1 bg-white/[0.04] rounded h-3 ml-1.5" />
            </div>
            <div className="mx-3 my-3 rounded-xl overflow-hidden">
              <img
                src="/templates/neo-brutalism.png"
                alt="Neo Brutalism Template"
                style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }}
              />
            </div>
            <div className="px-3 pb-3">
              <p className="text-xs font-bold text-[#f0f0f0]">Neo Brutalism</p>
              <p className="text-[10px] text-[#4b5563]">Bold &amp; poster-style</p>
              <span className="text-[10px] text-[#4b5563] group-hover:text-yellow-400 transition-colors">View →</span>
            </div>
          </div>

          <div className="bg-[#111214] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-blue-400/30 transition-colors group cursor-pointer flex flex-col">
            <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-white/[0.07]">
              <div className="w-2 h-2 rounded-full bg-red-500/60" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
              <div className="w-2 h-2 rounded-full bg-green-500/60" />
              <div className="flex-1 bg-white/[0.04] rounded h-3 ml-1.5" />
            </div>
            <div className="mx-3 my-3 rounded-xl overflow-hidden">
              <img
                src="/templates/modern-minimal.png"
                alt="Modern Minimal Template"
                style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }}
              />
            </div>
            <div className="px-3 pb-3">
              <p className="text-xs font-bold text-[#f0f0f0]">Modern Minimal</p>
              <p className="text-[10px] text-[#4b5563]">Apple meets Linear</p>
              <span className="text-[10px] text-[#4b5563] group-hover:text-blue-400 transition-colors">View →</span>
            </div>
          </div>

          <div className="bg-[#111214] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-rose-400/30 transition-colors group cursor-pointer flex flex-col">
            <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-white/[0.07]">
              <div className="w-2 h-2 rounded-full bg-red-500/60" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
              <div className="w-2 h-2 rounded-full bg-green-500/60" />
              <div className="flex-1 bg-white/[0.04] rounded h-3 ml-1.5" />
            </div>
            <div className="mx-3 my-3 rounded-xl overflow-hidden">
              <img
                src="/templates/bold-magazine.png"
                alt="Bold Magazine Template"
                style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }}
              />
            </div>
            <div className="px-3 pb-3">
              <p className="text-xs font-bold text-[#f0f0f0]">Bold Magazine</p>
              <p className="text-[10px] text-[#4b5563]">Vogue meets Wired</p>
              <span className="text-[10px] text-[#4b5563] group-hover:text-rose-400 transition-colors">View →</span>
            </div>
          </div>

          <div className="bg-[#111214] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-yellow-600/30 transition-colors group cursor-pointer flex flex-col">
            <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-white/[0.07]">
              <div className="w-2 h-2 rounded-full bg-red-500/60" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
              <div className="w-2 h-2 rounded-full bg-green-500/60" />
              <div className="flex-1 bg-white/[0.04] rounded h-3 ml-1.5" />
            </div>
            <div className="mx-3 my-3 rounded-xl overflow-hidden">
              <img
                src="/templates/classic-business.png"
                alt="Classic Business Template"
                style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }}
              />
            </div>
            <div className="px-3 pb-3">
              <p className="text-xs font-bold text-[#f0f0f0]">Classic Business</p>
              <p className="text-[10px] text-[#4b5563]">Navy &amp; gold, trusted</p>
              <span className="text-[10px] text-[#4b5563] group-hover:text-yellow-600 transition-colors">View →</span>
            </div>
          </div>

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
            Eight specialized agents that handle the work you hate — automatically.
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
                quote: "Bailey built my plumbing website in under 2 minutes. I got 3 new customer calls the first week it went live.",
                name: "Derek M.",
                role: "Plumbing Business Owner",
                initial: "D",
                color: "bg-emerald-500",
              },
              {
                quote: "The Lead Hunter found me 40 local restaurants to pitch in 5 minutes. Closed my first deal within 48 hours.",
                name: "Priya S.",
                role: "Marketing Agency Owner",
                initial: "P",
                color: "bg-blue-500",
              },
              {
                quote: "Cancelled my $180/month web agency the same day I found BaileyAgents. Never looking back.",
                name: "Tony R.",
                role: "Restaurant Owner",
                initial: "T",
                color: "bg-purple-500",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="bg-[#08090a] border border-white/[0.07] rounded-2xl p-7 flex flex-col gap-5 hover:border-white/20 transition-colors"
              >
                {/* Stars */}
                <div className="text-base leading-none">⭐⭐⭐⭐⭐</div>
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

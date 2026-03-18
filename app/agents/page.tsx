import Link from "next/link";

const agents = [
  {
    icon: "🔥",
    name: "Website Roast",
    desc: "Paste any URL and get a brutally honest analysis of what needs fixing — copy, design, SEO, and conversion.",
    plan: "All plans",
    planColor: "text-[#00e5a0] bg-[#00e5a0]/10 border-[#00e5a0]/20",
    href: "/dashboard/roast",
    available: true,
  },
  {
    icon: "🎯",
    name: "Lead Hunter",
    desc: "Find local businesses actively spending on ads. Get their contact info and reach out automatically.",
    plan: "Pro only",
    planColor: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    href: "/dashboard/leads",
    available: true,
  },
  {
    icon: "📧",
    name: "Email Marketer",
    desc: "Write and send targeted email campaigns that convert. AI writes the copy — you just hit send.",
    plan: "Growth + Pro",
    planColor: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    href: "/dashboard/email",
    available: true,
  },
  {
    icon: "✍️",
    name: "AI Copywriter",
    desc: "Generate sales copy, ads, landing pages and more in seconds. Never stare at a blank page again.",
    plan: "Pro only",
    planColor: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    href: "/dashboard/copywriter",
    available: true,
  },
  {
    icon: "📱",
    name: "Content Machine",
    desc: "Create 30 days of social media content for any business instantly. Captions, hooks, and hashtags included.",
    plan: "Pro only",
    planColor: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    href: "/dashboard/content",
    available: true,
  },
  {
    icon: "💼",
    name: "Sales Manager",
    desc: "AI that follows up with leads, books appointments and closes deals — while you sleep.",
    plan: "Pro only",
    planColor: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    href: "/dashboard/sales",
    available: true,
  },
  {
    icon: "💬",
    name: "Customer Support",
    desc: "AI that handles customer questions 24/7 so you never miss a lead or lose a sale after hours.",
    plan: "Growth + Pro",
    planColor: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    href: "/dashboard/support",
    available: true,
  },
  {
    icon: "📘",
    name: "Facebook Agent",
    desc: "Auto post content to your Facebook page with AI generated captions and scheduling.",
    plan: "Coming Soon",
    planColor: "text-[#4b5563] bg-white/5 border-white/10",
    href: "/dashboard/facebook",
    available: false,
  },
];

export default function AgentsPage() {
  return (
    <main className="min-h-screen bg-[#08090a] text-[#f0f0f0]">
      {/* Header */}
      <div className="pt-32 pb-16 px-6 text-center max-w-4xl mx-auto">
        <p className="text-[#00e5a0] text-xs font-semibold uppercase tracking-widest mb-4">
          AI Agents
        </p>
        <h1 className="font-syne text-5xl md:text-6xl font-black tracking-tight mb-5">
          Eight agents.<br />One platform.
        </h1>
        <p className="text-[#6b7280] text-lg max-w-xl mx-auto leading-relaxed">
          Specialized AI workers that handle the parts of your business you hate dealing with — automatically.
        </p>
      </div>

      {/* Agent grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {agents.map((agent) => (
            <div
              key={agent.name}
              className={`bg-[#111214] border rounded-2xl p-7 flex flex-col gap-4 transition-all ${
                agent.available
                  ? "border-white/[0.07] hover:border-white/20"
                  : "border-white/[0.04] opacity-60"
              }`}
            >
              {/* Icon */}
              <div className="text-4xl leading-none">{agent.icon}</div>

              {/* Name + plan badge */}
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-syne text-lg font-bold">{agent.name}</h2>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border whitespace-nowrap flex-shrink-0 ${agent.planColor}`}
                >
                  {agent.plan}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-[#6b7280] leading-relaxed flex-1">
                {agent.desc}
              </p>

              {/* CTA */}
              {agent.available ? (
                <Link
                  href={agent.href}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#00e5a0] hover:text-[#00ffb2] transition-colors mt-auto"
                >
                  Try it →
                </Link>
              ) : (
                <span className="text-xs text-[#374151] font-medium mt-auto">
                  Coming soon
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-[#6b7280] text-sm mb-5">
            All agents included with your plan. Start with a free trial.
          </p>
          <Link
            href="/login"
            className="inline-block bg-[#00e5a0] hover:bg-[#00ffb2] text-black font-bold px-8 py-4 rounded-xl transition-colors text-sm"
          >
            Start Free →
          </Link>
        </div>
      </div>
    </main>
  );
}

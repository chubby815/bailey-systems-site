"use client";

const agents = [
  {
    icon: "🔥",
    label: "Agent 01",
    labelColor: "text-orange-400",
    title: "Website Roast",
    desc: "Most business websites are silently killing sales. Bailey analyzes your site in seconds and gives you a brutally honest score, identifies every design flaw, SEO gap, and trust issue — then hands you a prioritized fix list. What used to cost $500 with a consultant takes 30 seconds.",
    features: [
      "Design & UX analysis",
      "SEO issue detection",
      "Trust signal audit",
      "Conversion rate review",
      "Top 5 priority fixes",
    ],
    checkColor: "text-orange-400",
    hoverBorder: "hover:border-orange-500/30",
    glowColor: "rgba(249,115,22,0.08)",
    comingSoon: false,
  },
  {
    icon: "🎯",
    label: "Agent 02",
    labelColor: "text-blue-400",
    title: "Lead Hunter",
    desc: "Stop wasting hours manually searching for potential customers. Lead Hunter finds qualified businesses in your niche, filters out bad fits, and generates ready-to-send outreach copy for each one. Most businesses spend 10+ hours a week on prospecting — Bailey does it in under 2 minutes.",
    features: [
      "Automated lead discovery",
      "Smart qualification filters",
      "Custom outreach per lead",
      "Contact info included",
      "Real-time results",
    ],
    checkColor: "text-blue-400",
    hoverBorder: "hover:border-blue-500/30",
    glowColor: "rgba(59,130,246,0.08)",
    comingSoon: false,
  },
  {
    icon: "✍️",
    label: "Agent 03",
    labelColor: "text-purple-400",
    title: "Content Machine",
    desc: "Consistently posting quality content is what separates businesses that grow from ones that stall. Content Machine generates 7 social media posts, hashtag sets, and a full blog draft in your brand voice — in one click. Replaces a $1,500/month social media manager.",
    features: [
      "7 social posts at once",
      "Hashtags per platform",
      "Full blog post draft",
      "Written in your brand voice",
      "Ready to publish instantly",
    ],
    checkColor: "text-purple-400",
    hoverBorder: "hover:border-purple-500/30",
    glowColor: "rgba(168,85,247,0.08)",
    comingSoon: false,
  },
  {
    icon: "✉️",
    label: "Agent 04",
    labelColor: "text-emerald-400",
    title: "Email Marketer",
    desc: "Cold email is still the highest ROI marketing channel — but only when done right. Email Marketer generates personalized cold outreach, follow-up sequences, and newsletters that actually get opened and replied to. One good email can land a $5,000 client. Bailey writes it in 10 seconds.",
    features: [
      "Cold outreach emails",
      "3-day follow-up included",
      "Newsletter campaigns",
      "Multiple tones and goals",
      "Refine with AI chat",
    ],
    checkColor: "text-emerald-400",
    hoverBorder: "hover:border-emerald-500/30",
    glowColor: "rgba(16,185,129,0.08)",
    comingSoon: false,
  },
  {
    icon: "📝",
    label: "Agent 05",
    labelColor: "text-violet-400",
    title: "AI Copywriter",
    desc: "Great copy is the difference between a website that converts and one that gets ignored. AI Copywriter writes blog posts that rank on Google, Facebook ads that stop the scroll, and landing pages that turn visitors into buyers — in your tone, for your audience. Hiring a copywriter costs $150/hour. Bailey charges nothing extra.",
    features: [
      "Blog posts that rank on Google",
      "Facebook & Google ad copy",
      "Landing page copy",
      "About us & service pages",
      "Refine with AI chat",
    ],
    checkColor: "text-violet-400",
    hoverBorder: "hover:border-violet-500/30",
    glowColor: "rgba(139,92,246,0.08)",
    comingSoon: false,
  },
  {
    icon: "💰",
    label: "Agent 06",
    labelColor: "text-yellow-400",
    title: "Sales Manager",
    desc: "Most business owners lose deals not because their product is bad — but because they don't know what to say. Sales Manager builds your full sales script, elevator pitch, objection handlers, and closing lines based on your exact offer and customer. Like having a $10,000 sales coach in your pocket.",
    features: [
      "Full sales scripts",
      "Elevator pitch generator",
      "Objection handler guide",
      "Power closing phrases",
      "Refine with AI chat",
    ],
    checkColor: "text-yellow-400",
    hoverBorder: "hover:border-yellow-500/30",
    glowColor: "rgba(234,179,8,0.08)",
    comingSoon: false,
  },
  {
    icon: "🎧",
    label: "Agent 07",
    labelColor: "text-cyan-400",
    title: "Customer Support",
    desc: "Slow or bad customer responses kill reviews, referrals, and repeat business. Customer Support generates professional reply templates, FAQ pages, complaint handlers, and review responses in your brand voice — so every customer feels heard and valued. Save 5+ hours a week on customer communication.",
    features: [
      "Review response templates",
      "Complaint escalation scripts",
      "FAQ page generator",
      "Brand voice guide",
      "Refine with AI chat",
    ],
    checkColor: "text-cyan-400",
    hoverBorder: "hover:border-cyan-500/30",
    glowColor: "rgba(6,182,212,0.08)",
    comingSoon: false,
  },
  {
    icon: "📘",
    label: "Agent 08",
    labelColor: "text-blue-400",
    title: "Facebook Agent",
    desc: "Posting consistently on Facebook is what keeps your business top of mind — but most owners never have time for it. Facebook Agent generates engaging posts with emojis and hashtags and publishes them directly to your Facebook Business Page with one click. No scheduling tools. No extra apps. Just results.",
    features: [
      "AI-generated post copy",
      "Emojis and hashtags included",
      "One-click publishing",
      "Multiple tones and styles",
      "Coming Soon",
    ],
    checkColor: "text-blue-400",
    hoverBorder: "hover:border-blue-500/30",
    glowColor: "rgba(59,130,246,0.08)",
    comingSoon: true,
  },
];

export function AgentCards() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {agents.map((agent) => (
        <div
          key={agent.title}
          className={`bg-[#111214] border border-white/[0.07] rounded-2xl p-8 transition-all duration-300 relative ${
            agent.comingSoon
              ? "opacity-75 cursor-default"
              : `${agent.hoverBorder} cursor-pointer`
          }`}
          onMouseEnter={(e) => {
            if (!agent.comingSoon) {
              e.currentTarget.style.boxShadow = `0 0 50px ${agent.glowColor}`;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {/* Coming Soon badge */}
          {agent.comingSoon && (
            <span
              className="absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(251,146,60,0.1)",
                border: "1px solid rgba(251,146,60,0.3)",
                color: "#fb923c",
              }}
            >
              Coming Soon
            </span>
          )}

          <div className="text-3xl mb-5">{agent.icon}</div>
          <p className={`text-xs font-semibold uppercase tracking-widest ${agent.labelColor} mb-2`}>
            {agent.label}
          </p>
          <h3 className="font-syne text-xl font-bold mb-3">{agent.title}</h3>
          <p className="text-sm text-[#6b7280] leading-relaxed mb-6">{agent.desc}</p>
          <ul className="space-y-2.5 text-sm text-[#9ca3af]">
            {agent.features.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className={`${agent.checkColor} text-xs`}>✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

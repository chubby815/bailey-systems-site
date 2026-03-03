"use client";

const agents = [
  {
    icon: "🌐",
    label: "Agent 01",
    labelColor: "text-[#00e5a0]",
    title: "Website Builder",
    desc: "Describe your business and get a production-ready website in minutes. Mobile-first, SEO-ready, and conversion-optimized.",
    features: [
      "Custom design, 0 code required",
      "Mobile responsive by default",
      "Contact forms & booking",
      "SEO meta tags included",
      "Delivered in 48 hours",
    ],
    checkColor: "text-[#00e5a0]",
    hoverBorder: "hover:border-[#00e5a0]/30",
    glowColor: "rgba(0,229,160,0.08)",
  },
  {
    icon: "🎯",
    label: "Agent 02",
    labelColor: "text-blue-400",
    title: "Lead Hunter",
    desc: "Automatically finds, qualifies, and contacts leads in your niche. Your sales pipeline fills itself while you sleep.",
    features: [
      "Automated lead discovery",
      "Smart qualification filters",
      "Outreach at scale",
      "CRM sync included",
      "Real-time pipeline updates",
    ],
    checkColor: "text-blue-400",
    hoverBorder: "hover:border-blue-500/30",
    glowColor: "rgba(59,130,246,0.08)",
  },
  {
    icon: "✍️",
    label: "Agent 03",
    labelColor: "text-purple-400",
    title: "Content Machine",
    desc: "Blog posts, social captions, emails, and ads — generated in your brand voice and ready to publish.",
    features: [
      "Blog posts & articles",
      "Social media captions",
      "Email sequences",
      "Ad copy variations",
      "Brand voice trained",
    ],
    checkColor: "text-purple-400",
    hoverBorder: "hover:border-purple-500/30",
    glowColor: "rgba(168,85,247,0.08)",
  },
];

export function AgentCards() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <div
          key={agent.title}
          className={`bg-[#111214] border border-white/[0.07] rounded-2xl p-8 transition-all duration-300 ${agent.hoverBorder} cursor-pointer`}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `0 0 50px ${agent.glowColor}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
          }}
        >
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

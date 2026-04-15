"use client";

const AGENT_CODES = [
  "BRAVO-01",
  "DELTA-02",
  "ECHO-03",
  "FOXTROT-04",
  "GOLF-05",
  "HOTEL-06",
  "INDIA-07",
  "JULIET-08",
];

const AMBER_GLOW  = "rgba(255,176,0,0.08)";
const GREEN_GLOW  = "rgba(75,83,32,0.12)";
const BLUE_GLOW   = "rgba(0,212,255,0.08)";

const agents = [
  {
    code: "BRAVO-01",
    mission: "WEBSITE ROAST",
    classification: "RECON",
    classColor: "#ff6b35",
    desc: "Most business websites are silently killing sales. Bailey analyzes your site in seconds and gives you a brutally honest score, identifies every design flaw, SEO gap, and trust issue — then hands you a prioritized fix list.",
    features: [
      "Design & UX analysis",
      "SEO issue detection",
      "Trust signal audit",
      "Conversion rate review",
      "Top 5 priority fixes",
    ],
    glowColor: GREEN_GLOW,
    borderColor: "#ff6b35",
    comingSoon: false,
  },
  {
    code: "DELTA-02",
    mission: "LEAD HUNTER",
    classification: "INTELLIGENCE",
    classColor: "#00d4ff",
    desc: "Stop wasting hours manually searching for potential customers. Lead Hunter finds qualified businesses in your niche, filters out bad fits, and generates ready-to-send outreach copy for each one in under 2 minutes.",
    features: [
      "Automated lead discovery",
      "Smart qualification filters",
      "Custom outreach per lead",
      "Contact info included",
      "Real-time results",
    ],
    glowColor: BLUE_GLOW,
    borderColor: "#00d4ff",
    comingSoon: false,
  },
  {
    code: "ECHO-03",
    mission: "CONTENT MACHINE",
    classification: "OPERATIONS",
    classColor: "#a855f7",
    desc: "Consistently posting quality content is what separates businesses that grow from ones that stall. Content Machine generates 7 social media posts, hashtag sets, and a full blog draft in your brand voice — in one click.",
    features: [
      "7 social posts at once",
      "Hashtags per platform",
      "Full blog post draft",
      "Written in your brand voice",
      "Ready to publish instantly",
    ],
    glowColor: "rgba(168,85,247,0.08)",
    borderColor: "#a855f7",
    comingSoon: false,
  },
  {
    code: "FOXTROT-04",
    mission: "EMAIL MARKETER",
    classification: "COMMS",
    classColor: "#10b981",
    desc: "Cold email is still the highest ROI marketing channel — but only when done right. Email Marketer generates personalized cold outreach, follow-up sequences, and newsletters that actually get opened and replied to.",
    features: [
      "Cold outreach emails",
      "3-day follow-up included",
      "Newsletter campaigns",
      "Multiple tones and goals",
      "Refine with AI chat",
    ],
    glowColor: "rgba(16,185,129,0.08)",
    borderColor: "#10b981",
    comingSoon: false,
  },
  {
    code: "GOLF-05",
    mission: "AI COPYWRITER",
    classification: "PSYOPS",
    classColor: "#8b5cf6",
    desc: "Great copy is the difference between a website that converts and one that gets ignored. AI Copywriter writes blog posts that rank on Google, Facebook ads that stop the scroll, and landing pages that turn visitors into buyers.",
    features: [
      "Blog posts that rank on Google",
      "Facebook & Google ad copy",
      "Landing page copy",
      "About us & service pages",
      "Refine with AI chat",
    ],
    glowColor: "rgba(139,92,246,0.08)",
    borderColor: "#8b5cf6",
    comingSoon: false,
  },
  {
    code: "HOTEL-06",
    mission: "SALES MANAGER",
    classification: "STRIKE",
    classColor: "#ffb000",
    desc: "Most business owners lose deals not because their product is bad — but because they don't know what to say. Sales Manager builds your full sales script, elevator pitch, objection handlers, and closing lines.",
    features: [
      "Full sales scripts",
      "Elevator pitch generator",
      "Objection handler guide",
      "Power closing phrases",
      "Refine with AI chat",
    ],
    glowColor: AMBER_GLOW,
    borderColor: "#ffb000",
    comingSoon: false,
  },
  {
    code: "INDIA-07",
    mission: "CUSTOMER SUPPORT",
    classification: "DEFENSE",
    classColor: "#00d4ff",
    desc: "Slow or bad customer responses kill reviews, referrals, and repeat business. Customer Support generates professional reply templates, FAQ pages, complaint handlers, and review responses in your brand voice.",
    features: [
      "Review response templates",
      "Complaint escalation scripts",
      "FAQ page generator",
      "Brand voice guide",
      "Refine with AI chat",
    ],
    glowColor: BLUE_GLOW,
    borderColor: "#00d4ff",
    comingSoon: false,
  },
  {
    code: "JULIET-08",
    mission: "FACEBOOK AGENT",
    classification: "BROADCAST",
    classColor: "#3b82f6",
    desc: "Posting consistently on Facebook keeps your business top of mind. Facebook Agent generates engaging posts with emojis and hashtags and publishes them directly to your Facebook Business Page with one click.",
    features: [
      "AI-generated post copy",
      "Emojis and hashtags included",
      "One-click publishing",
      "Multiple tones and styles",
      "Coming Soon",
    ],
    glowColor: "rgba(59,130,246,0.08)",
    borderColor: "#3b82f6",
    comingSoon: true,
  },
];

export function AgentCards() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {agents.map((agent) => (
        <div
          key={agent.mission}
          className="tac-hover relative flex flex-col"
          style={{
            background: "#0d0e0f",
            borderLeft: `3px solid ${agent.borderColor}`,
            borderTop: "1px solid rgba(75,83,32,0.25)",
            borderRight: "1px solid rgba(75,83,32,0.15)",
            borderBottom: "1px solid rgba(75,83,32,0.15)",
            padding: "24px",
            transition: "all 0.3s ease",
            cursor: agent.comingSoon ? "default" : "pointer",
            opacity: agent.comingSoon ? 0.7 : 1,
            clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
          }}
          onMouseEnter={(e) => {
            if (!agent.comingSoon) {
              e.currentTarget.style.background = agent.glowColor;
              e.currentTarget.style.boxShadow = `0 0 20px ${agent.glowColor}, inset 0 0 0 1px rgba(75,83,32,0.3)`;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#0d0e0f";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {/* Coming Soon badge */}
          {agent.comingSoon && (
            <span
              className="absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest"
              style={{
                background: "rgba(255,176,0,0.08)",
                border: "1px solid rgba(255,176,0,0.3)",
                color: "#ffb000",
                fontFamily: "var(--font-tactical)",
              }}
            >
              PENDING
            </span>
          )}

          {/* Mission code */}
          <div className="flex items-center gap-2 mb-3">
            <span
              style={{
                fontSize: "9px",
                color: "#4b5320",
                fontFamily: "var(--font-tactical)",
                letterSpacing: "0.15em",
                border: "1px solid rgba(75,83,32,0.3)",
                padding: "2px 6px",
              }}
            >
              {agent.code}
            </span>
            <span
              style={{
                fontSize: "9px",
                color: agent.classColor,
                fontFamily: "var(--font-tactical)",
                letterSpacing: "0.1em",
              }}
            >
              [{agent.classification}]
            </span>
          </div>

          {/* Mission name */}
          <h3
            className="font-black mb-3 uppercase tracking-widest"
            style={{
              fontFamily: "var(--font-tactical)",
              fontSize: "14px",
              color: "#e5e5e0",
              letterSpacing: "0.12em",
            }}
          >
            {agent.mission}
          </h3>

          {/* Description */}
          <p
            style={{
              fontSize: "12px",
              color: "#6b7280",
              lineHeight: 1.6,
              fontFamily: "var(--font-tactical)",
              marginBottom: "16px",
              flex: 1,
            }}
          >
            {agent.desc}
          </p>

          {/* Divider */}
          <div style={{ height: "1px", background: "rgba(75,83,32,0.2)", marginBottom: "12px" }} />

          {/* Features */}
          <ul className="space-y-1.5">
            {agent.features.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span style={{ color: agent.borderColor, fontSize: "10px", fontFamily: "var(--font-tactical)" }}>▸</span>
                <span
                  style={{
                    fontSize: "11px",
                    color: "#9ca3af",
                    fontFamily: "var(--font-tactical)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {f}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

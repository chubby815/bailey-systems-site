import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth";

export default async function GuidePage() {
  const session = await getSessionFromCookies();
  if (!session?.email) redirect("/login");

  const steps = [
    {
      num: "01",
      icon: "🔗",
      title: "Connect Your Accounts",
      color: "#00e5a0",
      href: "/dashboard/connections",
      linkLabel: "Go to Connections →",
      desc: "Before running any workflow, connect the platforms you want to post to. Bailey supports:",
      items: [
        "Telegram — get instant notifications when workflows run",
        "Instagram — auto-post images and captions to your business account",
        "Facebook — publish posts to your Facebook page automatically",
        "LinkedIn — post articles and updates to your LinkedIn profile",
        "Slack — send messages to your workspace channels",
      ],
      tip: "You only need to connect once. Your tokens are stored securely and reused every time.",
    },
    {
      num: "02",
      icon: "⚡",
      title: "Build Your First Workflow",
      color: "#a855f7",
      href: "/dashboard/workflows/new",
      linkLabel: "Create a Workflow →",
      desc: "Workflows are visual pipelines. Drag nodes onto the canvas and connect them left to right.",
      items: [
        "Trigger node — how the workflow starts (Manual, Schedule, or Webhook)",
        "Bailey Write node — AI generates your content based on your prompt",
        "Action node — where the content goes (LinkedIn, Instagram, Telegram, etc.)",
      ],
      tip: 'Start simple: Manual Trigger → Bailey Write → LinkedIn Post. Run it, see it work, then expand.',
      example: {
        label: "Example: Auto LinkedIn Post",
        nodes: ["Manual Trigger", "Bailey Write", "LinkedIn Post"],
      },
    },
    {
      num: "03",
      icon: "⏰",
      title: "Schedule Automatic Posts",
      color: "#f59e0b",
      href: "/dashboard/workflows",
      linkLabel: "My Workflows →",
      desc: "Replace the Manual Trigger with a Schedule Trigger to run workflows automatically.",
      items: [
        "Every day at 9am — post to LinkedIn daily without touching anything",
        "Every Monday at 8am — send a weekly newsletter",
        "Every morning — generate and post to Instagram automatically",
      ],
      tip: "Use cron expressions like '0 9 * * *' for 9am daily or '0 9 * * 1' for every Monday at 9am.",
      schedules: [
        { label: "Every day at 9am",    cron: "0 9 * * *"  },
        { label: "Every Monday 9am",    cron: "0 9 * * 1"  },
        { label: "Every hour",          cron: "0 * * * *"  },
        { label: "Weekdays at 10am",    cron: "0 10 * * 1-5" },
      ],
    },
    {
      num: "04",
      icon: "🌐",
      title: "Build an AI Website",
      color: "#00e5a0",
      href: "/dashboard/build",
      linkLabel: "Build a Site →",
      desc: "Generate a complete professional website in under 60 seconds. No coding needed.",
      items: [
        "Fill out your business name, industry, location, and services",
        "Choose your brand tone — Luxury, Bold, Professional, Cyberpunk, and more",
        "Pick a color scheme and font style",
        "Click Generate — Bailey builds the full site with AI-generated images",
        "Share your live URL instantly — sites are hosted on baileyagents.com/sites/yoursite",
      ],
      tip: "You can also build sites from workflows using the Build Site node — great for client automation.",
    },
    {
      num: "05",
      icon: "🎯",
      title: "Find Leads",
      color: "#3b82f6",
      href: "/dashboard/leads",
      linkLabel: "Open Lead Hunter →",
      desc: "Use the Lead Hunter to find potential customers in any industry and location.",
      items: [
        "Enter an industry (e.g. Restaurants, Gyms, Plumbers)",
        "Enter a city or region",
        "Bailey finds real local businesses with contact info",
        "Use the Bailey Find Leads workflow node to automate this on a schedule",
      ],
      tip: "Combine Lead Hunter with a Telegram node to get fresh leads sent to your phone every morning.",
    },
    {
      num: "06",
      icon: "🖼️",
      title: "Generate AI Images",
      color: "#ec4899",
      href: "/dashboard/workflows/new",
      linkLabel: "Try Bailey Image →",
      desc: "The Bailey Image workflow node generates real photos using Grok AI.",
      items: [
        "Add a Bailey Image node to any workflow",
        "Write a prompt describing the image you want",
        "The image is generated, uploaded to CDN, and the URL is stored as {{imageUrl}}",
        "Chain it into an Instagram Post node to auto-post with a real image",
      ],
      tip: "Example prompt: 'A modern fitness gym, premium lighting, dark luxury aesthetic'",
      example: {
        label: "Example: AI Image to Instagram",
        nodes: ["Schedule", "Bailey Write", "Bailey Image", "Instagram Post"],
      },
    },
    {
      num: "07",
      icon: "📋",
      title: "Use Templates",
      color: "#00e5a0",
      href: "/dashboard/workflows/templates",
      linkLabel: "Browse Templates →",
      desc: "Don't start from scratch. Use a pre-built template and customize it.",
      items: [
        "Daily AI Instagram Post — runs every morning, writes caption, generates image, posts automatically",
        "New Lead Alert — finds leads and sends them to Telegram",
        "Weekly Email Newsletter — writes and sends a newsletter every Monday",
        "Build Site & Announce — builds a website and sends the URL to Telegram",
        "Daily Facebook Post — AI writes and publishes to your Facebook page daily",
      ],
      tip: "Click 'Use Template' and the workflow opens pre-built in the editor. Just fill in your details and save.",
    },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "#08090a", color: "#f0f0f0", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "4rem 1.5rem 6rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <Link href="/dashboard" style={{ color: "#4b5563", fontSize: "0.8rem", textDecoration: "none" }}>
            ← Back to Dashboard
          </Link>
          <div style={{ marginTop: "1.5rem" }}>
            <p style={{ color: "#00e5a0", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.5rem" }}>
              Getting Started
            </p>
            <h1 style={{ fontSize: "2.25rem", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>
              How to Use Bailey Agents
            </h1>
            <p style={{ color: "#6b7280", fontSize: "1rem", lineHeight: 1.7, maxWidth: "560px" }}>
              Bailey automates your social media, builds websites, and finds leads — all from one dashboard.
              Follow these steps to get fully set up in under 10 minutes.
            </p>
          </div>
        </div>

        {/* Quick links */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.75rem", marginBottom: "3rem" }}>
          {[
            { label: "Connections", href: "/dashboard/connections", icon: "🔗" },
            { label: "Workflows",   href: "/dashboard/workflows",   icon: "⚡" },
            { label: "Templates",   href: "/dashboard/workflows/templates", icon: "📋" },
            { label: "Build Site",  href: "/dashboard/build",       icon: "🌐" },
            { label: "Lead Hunter", href: "/dashboard/leads",        icon: "🎯" },
          ].map(item => (
            <Link key={item.label} href={item.href} style={{
              background: "#111214", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "10px", padding: "0.75rem 1rem", textDecoration: "none",
              color: "#f0f0f0", fontSize: "0.8rem", fontWeight: 600,
              display: "flex", alignItems: "center", gap: "0.5rem",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(0,229,160,0.3)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </div>

        {/* Platform Requirements — Transparency Section */}
        <div style={{ background: "#111214", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "1.5rem", marginBottom: "2rem" }}>
          <p style={{ color: "#f0f0f0", fontSize: "0.85rem", fontWeight: 800, marginBottom: "0.25rem" }}>
            📋 Platform Requirements — What You Need Before Connecting
          </p>
          <p style={{ color: "#6b7280", fontSize: "0.78rem", marginBottom: "1rem", lineHeight: 1.6 }}>
            Bailey Agents connects to real social media APIs. Each platform has its own requirements set by that platform — not by us. Here's exactly what you need for each one.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {[
              {
                platform: "LinkedIn",
                icon: "💼",
                status: "ready",
                req: "A LinkedIn account. That's it. Connect via OAuth on the Connections page.",
              },
              {
                platform: "Facebook",
                icon: "📘",
                status: "ready",
                req: "A Facebook Business PAGE (not a personal profile). Facebook's API does not allow posting to personal profiles — this is Facebook's policy, not ours. Creating a free Business Page takes 5 minutes.",
              },
              {
                platform: "Instagram",
                icon: "📸",
                status: "ready",
                req: "An Instagram Business or Creator account linked to a Facebook Page. Personal Instagram accounts cannot connect via API — this is Instagram/Meta's policy that applies to every social media tool (Buffer, Hootsuite, Later, etc.).",
              },
              {
                platform: "Telegram",
                icon: "✈️",
                status: "ready",
                req: "A Telegram account. Message @BaileyOS_Bot to get your verification code. Works instantly.",
              },
              {
                platform: "Slack",
                icon: "💬",
                status: "ready",
                req: "A Slack workspace. Create a webhook URL in Slack → Apps → Incoming Webhooks. Free on all Slack plans.",
              },
              {
                platform: "WhatsApp",
                icon: "📱",
                status: "soon",
                req: "Requires Meta Business Verification (3-7 days review process). Currently in setup — coming soon.",
              },
            ].map(item => (
              <div key={item.platform} style={{
                display: "flex", gap: "0.75rem", alignItems: "flex-start",
                background: "rgba(0,0,0,0.3)", borderRadius: "8px", padding: "0.65rem 0.85rem",
              }}>
                <span style={{ fontSize: "1rem", flexShrink: 0 }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                    <span style={{ color: "#f0f0f0", fontSize: "0.8rem", fontWeight: 700 }}>{item.platform}</span>
                    <span style={{
                      fontSize: "0.6rem", fontWeight: 700, padding: "0.1rem 0.4rem", borderRadius: "4px",
                      background: item.status === "ready" ? "rgba(0,229,160,0.1)" : "rgba(251,191,36,0.1)",
                      color: item.status === "ready" ? "#00e5a0" : "#fbbf24",
                      border: `1px solid ${item.status === "ready" ? "rgba(0,229,160,0.2)" : "rgba(251,191,36,0.2)"}`,
                    }}>
                      {item.status === "ready" ? "READY" : "COMING SOON"}
                    </span>
                  </div>
                  <p style={{ color: "#9ca3af", fontSize: "0.76rem", lineHeight: 1.6, margin: 0 }}>
                    {item.req}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p style={{ color: "#4b5563", fontSize: "0.72rem", marginTop: "0.75rem", lineHeight: 1.6 }}>
            💡 These requirements are set by Facebook, Instagram, LinkedIn, and other platforms — not by Bailey Agents. Every social media scheduling tool (Buffer, Hootsuite, Later, Sprout Social) has identical requirements.
          </p>
        </div>

        {/* Cron Quick Reference */}
        <div style={{ background: "#111214", border: "1px solid rgba(0,229,160,0.2)", borderRadius: "14px", padding: "1.5rem", marginBottom: "2rem" }}>
          <p style={{ color: "#00e5a0", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
            ⏰ Schedule Quick Reference — copy these into your Schedule node
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.5rem" }}>
            {[
              { cron: "*/5 * * * *", label: "Every 5 minutes (testing)" },
              { cron: "0 * * * *",   label: "Every hour" },
              { cron: "0 9 * * *",   label: "Every day at 9am" },
              { cron: "0 9 * * 1-5", label: "Weekdays at 9am" },
              { cron: "0 9 * * 1",   label: "Every Monday at 9am" },
              { cron: "0 8 * * 1",   label: "Weekly newsletter (Mon 8am)" },
              { cron: "0 10 * * *",  label: "Every day at 10am" },
              { cron: "0 18 * * *",  label: "Every day at 6pm" },
            ].map((s) => (
              <div key={s.cron} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,0.3)", borderRadius: "8px", padding: "0.5rem 0.75rem", gap: "0.75rem" }}>
                <span style={{ color: "#9ca3af", fontSize: "0.78rem" }}>{s.label}</span>
                <code style={{ background: "rgba(0,229,160,0.08)", color: "#00e5a0", fontSize: "0.72rem", padding: "0.2rem 0.5rem", borderRadius: "4px", fontFamily: "monospace", flexShrink: 0 }}>
                  {s.cron}
                </code>
              </div>
            ))}
          </div>
          <p style={{ color: "#4b5563", fontSize: "0.72rem", marginTop: "0.75rem" }}>
            💡 Paste any of these into the Schedule node cron field. Workflows check every 5 minutes so changes take effect quickly.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {steps.map(step => (
            <div key={step.num} style={{
              background: "#111214", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "16px", padding: "1.75rem", borderLeft: `3px solid ${step.color}`,
            }}>
              {/* Step header */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "10px",
                  background: `${step.color}18`, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "1.25rem", flexShrink: 0,
                }}>
                  {step.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                    <span style={{ color: step.color, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em" }}>
                      STEP {step.num}
                    </span>
                  </div>
                  <h2 style={{ fontSize: "1.1rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
                    {step.title}
                  </h2>
                </div>
              </div>

              {/* Description */}
              <p style={{ color: "#9ca3af", fontSize: "0.875rem", lineHeight: 1.7, marginBottom: "0.75rem" }}>
                {step.desc}
              </p>

              {/* Items */}
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {step.items.map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", fontSize: "0.82rem", color: "#d1d5db" }}>
                    <span style={{ color: step.color, flexShrink: 0, marginTop: "0.1rem" }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* Example workflow */}
              {"example" in step && step.example && (
                <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "0.75rem" }}>
                  <p style={{ color: "#4b5563", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
                    {step.example.label}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                    {step.example.nodes.map((node, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ background: `${step.color}18`, border: `1px solid ${step.color}33`, color: step.color, fontSize: "0.72rem", fontWeight: 600, padding: "0.25rem 0.6rem", borderRadius: "6px" }}>
                          {node}
                        </span>
                        {i < step.example!.nodes.length - 1 && (
                          <span style={{ color: "#4b5563", fontSize: "0.8rem" }}>→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cron schedule examples */}
              {"schedules" in step && step.schedules && (
                <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "0.75rem" }}>
                  <p style={{ color: "#4b5563", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
                    Common Schedules
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    {step.schedules.map((s, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ color: "#9ca3af", fontSize: "0.78rem" }}>{s.label}</span>
                        <code style={{ background: "rgba(255,255,255,0.05)", color: "#00e5a0", fontSize: "0.72rem", padding: "0.15rem 0.5rem", borderRadius: "4px", fontFamily: "monospace" }}>
                          {s.cron}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tip */}
              <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", background: `${step.color}08`, border: `1px solid ${step.color}20`, borderRadius: "8px", padding: "0.6rem 0.85rem" }}>
                <span style={{ fontSize: "0.8rem", flexShrink: 0 }}>💡</span>
                <p style={{ color: "#9ca3af", fontSize: "0.78rem", lineHeight: 1.6, margin: 0 }}>
                  {step.tip}
                </p>
              </div>

              {/* CTA link */}
              <div style={{ marginTop: "1rem" }}>
                <Link href={step.href} style={{
                  color: step.color, fontSize: "0.8rem", fontWeight: 700,
                  textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.3rem",
                }}>
                  {step.linkLabel}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          marginTop: "3rem", background: "linear-gradient(135deg, #00e5a018 0%, #a855f718 100%)",
          border: "1px solid rgba(0,229,160,0.2)", borderRadius: "16px", padding: "2rem",
          textAlign: "center",
        }}>
          <p style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            Ready to automate everything?
          </p>
          <p style={{ color: "#6b7280", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            Start with one workflow. Connect one account. Run it once. Then scale.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/dashboard/workflows/templates" style={{
              background: "#00e5a0", color: "#000", fontWeight: 700, fontSize: "0.875rem",
              padding: "0.75rem 1.5rem", borderRadius: "10px", textDecoration: "none",
            }}>
              Browse Templates →
            </Link>
            <Link href="/dashboard/workflows/new" style={{
              background: "transparent", color: "#f0f0f0", fontWeight: 600, fontSize: "0.875rem",
              padding: "0.75rem 1.5rem", borderRadius: "10px", textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
              Build from Scratch
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}

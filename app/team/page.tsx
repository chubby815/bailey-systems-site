const team = [
  {
    name: "Liliana Sandoval",
    role: "CEO & Founder",
    bio: "Visionary leader and founder of BaileyAgents. Building the future of AI-powered business tools for entrepreneurs and local businesses worldwide.",
    email: "liliana@baileyagents.com",
    emoji: "👑",
  },
  {
    name: "Javier Sandoval",
    role: "Sr. Software Engineer",
    bio: "Full stack engineer and architect behind the BaileyAgents platform. Specializes in AI systems, automation, and building tools that actually work.",
    email: "javier@baileyagents.com",
    emoji: "⚡",
  },
  {
    name: "Rosa Sandoval",
    role: "Director of Media",
    bio: "Creative director overseeing all media, visual content, and brand identity for BaileyAgents.",
    email: "rosa@baileyagents.com",
    emoji: "🎨",
  },
  {
    name: "Manny Sandoval",
    role: "Director of Marketing",
    bio: "Marketing strategist driving growth and customer acquisition for BaileyAgents.",
    email: "manny@baileyagents.com",
    emoji: "📈",
  },
  {
    name: "Christina Sandoval",
    role: "Customer Support Representative",
    bio: "First point of contact for all BaileyAgents customers. Dedicated to making sure every user gets the most out of the platform.",
    email: "support@baileyagents.com",
    emoji: "💬",
  },
  {
    name: "Bailey",
    role: "AI Agent — The Brains Behind It All",
    bio: "The AI that powers everything. Builds websites, writes copy, generates images, manages tasks, and never sleeps. Bailey is the engine that makes BaileyAgents possible.",
    email: null,
    emoji: "🤖",
  },
];

export default function TeamPage() {
  return (
    <main style={{
      background: "#080810",
      minHeight: "100vh",
      padding: "8rem 1.5rem 4rem",
      fontFamily: "Inter, sans-serif",
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <p style={{
            color: "#00e5a0",
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "1rem",
          }}>
            The Team
          </p>
          <h1 style={{
            color: "#f0f0f0",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            marginBottom: "1rem",
            lineHeight: 1.15,
          }}>
            Meet the people<br />behind BaileyAgents
          </h1>
          <p style={{
            color: "#6b7280",
            fontSize: "1.1rem",
            maxWidth: "500px",
            margin: "0 auto",
            lineHeight: 1.7,
          }}>
            A small team building big things.<br />
            Real people. Real AI. Real results.
          </p>
        </div>

        {/* Team grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1.5rem",
        }}>
          {team.map((member) => (
            <div
              key={member.name}
              style={{
                background: "#0d0e10",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "20px",
                padding: "2rem",
              }}
            >
              {/* Avatar */}
              <div style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #00e5a0 0%, #0066ff 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                marginBottom: "1.25rem",
              }}>
                {member.emoji}
              </div>

              {/* Name */}
              <h2 style={{
                color: "#f0f0f0",
                fontSize: "1.1rem",
                fontWeight: 700,
                marginBottom: "0.25rem",
              }}>
                {member.name}
              </h2>

              {/* Role */}
              <p style={{
                color: "#00e5a0",
                fontSize: "0.8rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "1rem",
              }}>
                {member.role}
              </p>

              {/* Bio */}
              <p style={{
                color: "#6b7280",
                fontSize: "0.9rem",
                lineHeight: 1.7,
                marginBottom: "1.25rem",
              }}>
                {member.bio}
              </p>

              {/* Email */}
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  style={{
                    color: "#4b5563",
                    fontSize: "0.8rem",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  ✉ {member.email}
                </a>
              )}

              {/* Bailey badge */}
              {member.name === "Bailey" && (
                <div style={{
                  marginTop: "1rem",
                  background: "rgba(0,229,160,0.08)",
                  border: "1px solid rgba(0,229,160,0.2)",
                  borderRadius: "8px",
                  padding: "0.5rem 0.75rem",
                  color: "#00e5a0",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}>
                  ⚡ Always Online — Never Sleeps
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          textAlign: "center",
          marginTop: "4rem",
          padding: "3rem",
          background: "#0d0e10",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "24px",
        }}>
          <h2 style={{
            color: "#f0f0f0",
            fontSize: "1.75rem",
            fontWeight: 800,
            marginBottom: "0.75rem",
          }}>
            Ready to work with us?
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
            Start building your AI website today.
          </p>
          <a
            href="/pricing"
            style={{
              background: "#00e5a0",
              color: "#000",
              fontWeight: 700,
              padding: "0.875rem 2rem",
              borderRadius: "12px",
              textDecoration: "none",
              fontSize: "0.95rem",
            }}
          >
            Start Free Trial →
          </a>
        </div>

      </div>
    </main>
  );
}

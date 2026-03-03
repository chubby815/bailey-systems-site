import type { StructuredSiteContent, ThemeTokens } from "@/lib/site-theme";
import type { SiteRecord } from "@/lib/kv";

type AboutContent = StructuredSiteContent["about"];

type Props = {
  content: AboutContent;
  tokens:  ThemeTokens;
  site:    SiteRecord;
};

function yearsLabel(years: string | undefined): string {
  if (!years || years === "Less than 1 year") return "New";
  if (years === "10+ years") return "10+";
  const match = years.match(/^(\d+)/);
  return match ? match[1] : years;
}

export function SiteAbout({ content, tokens, site }: Props) {
  const { primaryColor, maxWidth, fontFamily, fontWeight } = tokens;
  const { location, contactEmail, contactPhone, serviceArea, yearsInBusiness } = site;

  return (
    <section id="about" style={{ padding: "6rem 1.5rem", background: "#fff" }}>
      <div
        style={{
          maxWidth,
          margin: "0 auto",
          display: "flex",
          gap: "4rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {/* Left: stats block */}
        <div
          style={{
            flex: "0 0 auto",
            width: "280px",
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}cc 100%)`,
            borderRadius: "24px",
            padding: "2.5rem 2rem",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "2.75rem", marginBottom: "1rem" }}>🏆</div>
          <div
            style={{
              fontFamily,
              fontSize: "2.5rem",
              fontWeight,
              lineHeight: 1,
            }}
          >
            {yearsLabel(yearsInBusiness)}
          </div>
          <div style={{ fontSize: "0.875rem", opacity: 0.85, marginTop: "0.5rem" }}>
            {yearsInBusiness === "Less than 1 year" ? "Year in Business" : "Years of Experience"}
          </div>

          {content.stats.length > 0 && (
            <div
              style={{
                marginTop: "1.75rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {content.stats.slice(0, 3).map((stat, i) => (
                <div key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.25)", paddingTop: "1rem" }}>
                  <div style={{ fontFamily, fontSize: "1.5rem", fontWeight, lineHeight: 1 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: "0.75rem", opacity: 0.8, marginTop: "0.25rem" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {serviceArea && (
            <div style={{ fontSize: "0.78rem", opacity: 0.75, marginTop: "1rem", lineHeight: 1.4 }}>
              📍 {serviceArea}
            </div>
          )}
        </div>

        {/* Right: text */}
        <div style={{ flex: 1, minWidth: "260px" }}>
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: primaryColor,
              marginBottom: "0.75rem",
            }}
          >
            About Us
          </p>
          <h2
            style={{
              fontFamily,
              fontSize: "2rem",
              fontWeight,
              letterSpacing: "-0.03em",
              color: "#111",
              marginBottom: "1.25rem",
            }}
          >
            {content.title}
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "#6b7280",
              lineHeight: 1.8,
              marginBottom: "1.75rem",
            }}
          >
            {content.body}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {contactEmail && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontSize: "0.9rem",
                  color: "#374151",
                }}
              >
                <span style={{ color: primaryColor, fontWeight: 700 }}>✉</span>
                <a
                  href={`mailto:${contactEmail}`}
                  style={{ color: "#374151", textDecoration: "none" }}
                >
                  {contactEmail}
                </a>
              </div>
            )}
            {contactPhone && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontSize: "0.9rem",
                  color: "#374151",
                }}
              >
                <span style={{ color: primaryColor, fontWeight: 700 }}>✆</span>
                <a
                  href={`tel:${contactPhone}`}
                  style={{ color: "#374151", textDecoration: "none" }}
                >
                  {contactPhone}
                </a>
              </div>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                fontSize: "0.9rem",
                color: "#374151",
              }}
            >
              <span style={{ color: primaryColor, fontWeight: 700 }}>📍</span>
              {serviceArea || location}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

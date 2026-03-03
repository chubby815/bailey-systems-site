import type { StructuredSiteContent, ThemeTokens } from "@/lib/site-theme";

type ServiceItem = StructuredSiteContent["services"][number];

type Props = {
  content:  ServiceItem[];
  tokens:   ThemeTokens;
  location: string;
};

export function SiteServices({ content, tokens, location }: Props) {
  const { primaryColor, accentLight, maxWidth, fontFamily, fontWeight } = tokens;

  return (
    <section id="services" style={{ padding: "6rem 1.5rem", background: "#f9fafb" }}>
      <div style={{ maxWidth, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
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
            What We Do
          </p>
          <h2
            style={{
              fontFamily,
              fontSize: "2.5rem",
              fontWeight,
              letterSpacing: "-0.03em",
              color: "#111",
            }}
          >
            Our Services
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {content.map((service, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "1.75rem",
                borderTop: `3px solid ${primaryColor}`,
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: accentLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                  fontSize: "1.35rem",
                }}
              >
                {service.icon || "✓"}
              </div>
              <h3
                style={{
                  fontFamily,
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#111",
                  marginBottom: "0.5rem",
                }}
              >
                {service.name}
              </h3>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", lineHeight: 1.6 }}>
                {service.description ||
                  `Professional ${service.name.toLowerCase()} services in ${location}.`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import type { StructuredSiteContent, ThemeTokens } from "@/lib/site-theme";

type Testimonial = StructuredSiteContent["testimonials"][number];

type Props = {
  content: Testimonial[];
  tokens:  ThemeTokens;
};

function StarRating({ rating }: { rating: number }) {
  const clamped = Math.min(5, Math.max(1, Math.round(rating)));
  return (
    <div style={{ display: "flex", gap: "2px", marginBottom: "0.75rem" }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          style={{
            fontSize: "1rem",
            color: i < clamped ? "#f59e0b" : "#e5e7eb",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export function SiteTestimonials({ content, tokens }: Props) {
  const { primaryColor, accentLight, maxWidth, fontFamily, fontWeight } = tokens;

  if (!content || content.length === 0) return null;

  return (
    <section style={{ padding: "6rem 1.5rem", background: "#f9fafb" }}>
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
            What Our Clients Say
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
            Customer Reviews
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {content.map((t, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "20px",
                padding: "2rem",
                position: "relative",
              }}
            >
              {/* Quote mark */}
              <div
                style={{
                  position: "absolute",
                  top: "1.25rem",
                  right: "1.5rem",
                  fontSize: "3rem",
                  color: accentLight,
                  lineHeight: 1,
                  fontFamily: "Georgia, serif",
                }}
              >
                "
              </div>

              <StarRating rating={t.rating} />

              <p
                style={{
                  fontSize: "0.9375rem",
                  color: "#374151",
                  lineHeight: 1.75,
                  marginBottom: "1.5rem",
                  fontStyle: "italic",
                }}
              >
                "{t.quote}"
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}99 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {t.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "#111" }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

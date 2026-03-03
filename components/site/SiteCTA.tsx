import type { StructuredSiteContent, ThemeTokens } from "@/lib/site-theme";

type CTAContent = StructuredSiteContent["cta"];

type Props = {
  content:      CTAContent;
  tokens:       ThemeTokens;
  contactEmail?: string;
  contactPhone?: string;
};

export function SiteCTA({ content, tokens, contactEmail, contactPhone }: Props) {
  const { primaryColor, accentMid, fontFamily, fontWeight, buttonRadius } = tokens;

  const contactHref = contactPhone
    ? `tel:${contactPhone}`
    : contactEmail
    ? `mailto:${contactEmail}`
    : "#contact";

  return (
    <section
      id="contact"
      style={{
        padding: "7rem 1.5rem",
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}e0 100%)`,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle pattern overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: "680px", margin: "0 auto" }}>
        <h2
          style={{
            fontFamily,
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight,
            letterSpacing: "-0.03em",
            color: "#fff",
            marginBottom: "1rem",
            textShadow: "0 2px 12px rgba(0,0,0,0.25)",
          }}
        >
          {content.headline}
        </h2>

        <p
          style={{
            fontSize: "1.1rem",
            color: "rgba(255,255,255,0.88)",
            lineHeight: 1.7,
            marginBottom: "2.5rem",
            maxWidth: "520px",
            margin: "0 auto 2.5rem",
          }}
        >
          {content.subtext}
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href={contactHref}
            style={{
              background: "#fff",
              color: `var(--btn-text-color, ${primaryColor})`,
              fontWeight: 700,
              fontSize: "1rem",
              padding: "0.9375rem 2.25rem",
              borderRadius: buttonRadius,
              textDecoration: "none",
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
              display: "inline-block",
            }}
          >
            {content.buttonText}
          </a>
          {(contactEmail || contactPhone) && (
            <a
              href="#footer"
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "1rem",
                padding: "0.9375rem 2.25rem",
                borderRadius: buttonRadius,
                textDecoration: "none",
                border: "1.5px solid rgba(255,255,255,0.35)",
                display: "inline-block",
              }}
            >
              View Contact Info
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

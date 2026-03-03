import type { StructuredSiteContent, ThemeConfig, ThemeTokens } from "@/lib/site-theme";

type HeroContent = StructuredSiteContent["hero"];

type Props = {
  content:     HeroContent;
  theme:       ThemeConfig;
  tokens:      ThemeTokens;
  location:    string;
  serviceArea?: string;
};

export function SiteHero({ content, theme, tokens, location, serviceArea }: Props) {
  const { primaryColor, accentMid, heroImageUrl, fontFamily, fontWeight, buttonRadius } = tokens;

  function heroBackground(): React.CSSProperties {
    if (theme.heroStyle === "photo") {
      return {
        backgroundImage: `url(${heroImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    if (theme.heroStyle === "gradient") {
      return {
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}cc 40%, #0a0a1a 100%)`,
      };
    }
    return { background: primaryColor };
  }

  return (
    <section
      id="home"
      style={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "5rem 1.5rem",
        position: "relative",
        overflow: "hidden",
        ...heroBackground(),
      }}
    >
      {/* Readability overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            theme.heroStyle === "photo"
              ? "linear-gradient(135deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.7) 100%)"
              : "rgba(0,0,0,0.35)",
        }}
      />
      {theme.heroStyle === "photo" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: `linear-gradient(to bottom right, ${primaryColor}22 0%, transparent 60%)`,
          }}
        />
      )}

      <div style={{ position: "relative", maxWidth: "800px", margin: "0 auto" }}>
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.25)",
            backdropFilter: "blur(8px)",
            borderRadius: "100px",
            padding: "6px 14px",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#ffffff",
            marginBottom: "1.5rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#ffffff",
              display: "inline-block",
            }}
          />
          {content.badge || serviceArea || location}
        </div>

        <h1
          style={{
            fontFamily,
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "#ffffff",
            marginBottom: "1.5rem",
            textShadow: "0 2px 20px rgba(0,0,0,0.4)",
          }}
        >
          {content.headline}
        </h1>

        <p
          style={{
            fontSize: "1.125rem",
            color: "rgba(255,255,255,0.85)",
            maxWidth: "560px",
            margin: "0 auto 2.5rem",
            lineHeight: 1.7,
            textShadow: "0 1px 8px rgba(0,0,0,0.3)",
          }}
        >
          {content.subheadline}
        </p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a
            href="#contact"
            style={{
              background: primaryColor,
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
              padding: "0.875rem 2rem",
              borderRadius: buttonRadius,
              textDecoration: "none",
              boxShadow: `0 8px 24px ${accentMid}`,
            }}
          >
            {content.ctaText}
          </a>
          <a
            href="#services"
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: "1rem",
              padding: "0.875rem 2rem",
              borderRadius: buttonRadius,
              textDecoration: "none",
              border: "1.5px solid rgba(255,255,255,0.3)",
            }}
          >
            See Our Services
          </a>
        </div>
      </div>
    </section>
  );
}

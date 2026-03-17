/**
 * Dark Premium v2 — Apple cinematic restraint × editorial fashion magazine.
 * Clash Display headings · Inter body · Word-by-word hero reveal
 * Rich bento grid · Masonry testimonials · Zero decorative clutter
 */
import type { SiteRecord } from "@/lib/kv";
import type { StructuredSiteContent, ThemeConfig } from "@/lib/site-theme";
import { TrustBadges, RatingBadge } from "@/components/site/TrustBadges";
import { ScrollAnimator } from "@/components/site/ScrollAnimator";
import { ContactFormBlock } from "@/components/site/ContactFormBlock";

export type TemplateProps = {
  site:            SiteRecord;
  content:         StructuredSiteContent;
  primaryColor:    string;
  heroImageUrl?:   string;
  aboutImageUrl?:  string;
  serviceImages?:  Record<number, string>;
  theme?:          ThemeConfig;
  isEditing?:      boolean;
};

// ── Design tokens ─────────────────────────────────────────────────────────────
const FF_DISPLAY = "'Clash Display', 'Inter', system-ui, sans-serif";
const FF_BODY    = "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
const BORDER     = "rgba(255,255,255,0.07)";
const BORDER_MID = "rgba(255,255,255,0.12)";

const C_HEADING = "var(--heading-color, #ffffff)";
const C_BODY    = "var(--body-color, #71717a)";
const C_BTN     = "var(--btn-text-color, #000000)";
const C_MUTED   = "#3f3f46";

function hexToRgba(hex: string, alpha: number): string {
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return `rgba(0,0,0,${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function Stars({ n, color }: { n: number; color: string }) {
  const c = Math.min(5, Math.max(1, Math.round(n)));
  return (
    <span style={{ color, fontSize: "0.8rem", letterSpacing: "2px" }}>
      {"★".repeat(c)}{"☆".repeat(5 - c)}
    </span>
  );
}

// ── Global styles + Clash Display font ───────────────────────────────────────
function Styles({ p, card, bg }: { p: string; card: string; bg: string }) {
  const pRgba12 = hexToRgba(p, 0.12);
  const pRgba20 = hexToRgba(p, 0.20);
  const pRgba06 = hexToRgba(p, 0.06);
  const pRgba40 = hexToRgba(p, 0.40);
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
      @font-face {
        font-family: 'Clash Display';
        src: url('https://api.fontshare.com/v2/css?f[]=clash-display@700,600,500&display=swap');
        font-display: swap;
      }

      /* ── Word-by-word hero reveal ─────────────────────────────── */
      @keyframes dp2-word-in {
        from { opacity: 0; transform: translateY(28px); filter: blur(4px); }
        to   { opacity: 1; transform: translateY(0);    filter: blur(0);   }
      }
      @keyframes dp2-fade-up {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0);    }
      }
      @keyframes dp2-scale-in {
        from { opacity: 0; transform: scale(0.94); }
        to   { opacity: 1; transform: scale(1);    }
      }
      @keyframes dp2-orb-pulse {
        0%, 100% { opacity: 0.35; transform: scale(1);    }
        50%      { opacity: 0.55; transform: scale(1.08); }
      }
      @keyframes dp2-badge-slide {
        from { opacity: 0; transform: translateY(-10px); }
        to   { opacity: 1; transform: translateY(0);     }
      }
      @keyframes dp2-live-pulse {
        0%, 100% { opacity: 1;   transform: scale(1);    }
        50%      { opacity: 0.4; transform: scale(0.75); }
      }
      @keyframes dp2-line-grow {
        from { width: 0; }
        to   { width: 3rem; }
      }

      /* ── Root ─────────────────────────────────────────────────── */
      .dp2-root {
        font-family: ${FF_BODY};
        background: ${bg};
        color: #f4f4f5;
        overflow-x: clip;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      /* ── Nav ──────────────────────────────────────────────────── */
      .dp2-nav {
        position: sticky; top: 0; z-index: 100;
        padding: 0 clamp(1.5rem, 5vw, 4rem);
        transition: background 0.3s ease, border-color 0.3s ease;
      }
      .dp2-nav-inner {
        max-width: 1320px; margin: 0 auto;
        display: flex; align-items: center; justify-content: space-between;
        height: 68px;
      }
      .dp2-nav-link {
        font-family: ${FF_BODY};
        font-size: 0.8125rem;
        font-weight: 500;
        color: #52525b;
        text-decoration: none;
        letter-spacing: 0.01em;
        transition: color 0.2s ease;
      }
      .dp2-nav-link:hover { color: #a1a1aa; }

      /* ── Hero words ────────────────────────────────────────────── */
      .dp2-hero-word {
        display: inline-block;
        opacity: 0;
        animation: dp2-word-in 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }

      /* ── Bento cards ───────────────────────────────────────────── */
      .dp2-bento-card {
        border-radius: 20px;
        border: 1px solid ${BORDER};
        background: ${card};
        padding: 2rem;
        position: relative;
        overflow: hidden;
        transition: border-color 0.3s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1);
      }
      .dp2-bento-card::before {
        content: '';
        position: absolute; inset: 0;
        background: radial-gradient(ellipse 80% 60% at 0% 0%, ${pRgba06}, transparent 70%);
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.35s ease;
      }
      .dp2-bento-card:hover {
        border-color: ${BORDER_MID};
        transform: translateY(-3px);
      }
      .dp2-bento-card:hover::before { opacity: 1; }

      /* ── Featured bento card (first card) ─────────────────────── */
      .dp2-bento-card-featured {
        background: linear-gradient(145deg, ${pRgba12}, ${hexToRgba(p, 0.04)});
        border-color: ${pRgba20};
      }
      .dp2-bento-card-featured:hover { border-color: ${pRgba40}; }

      /* ── Stat cards inside bento ───────────────────────────────── */
      .dp2-bento-stat {
        border-radius: 20px;
        border: 1px solid ${BORDER};
        background: ${card};
        padding: 2rem;
        text-align: center;
        position: relative;
        overflow: hidden;
        transition: border-color 0.3s ease;
      }
      .dp2-bento-stat:hover { border-color: ${BORDER_MID}; }

      /* ── Testimonial cards ─────────────────────────────────────── */
      .dp2-testi-card {
        border-radius: 20px;
        border: 1px solid ${BORDER};
        background: ${card};
        padding: 2rem;
        position: relative;
        overflow: hidden;
        break-inside: avoid;
        margin-bottom: 1rem;
        transition: border-color 0.3s ease;
      }
      .dp2-testi-card:hover { border-color: ${BORDER_MID}; }

      /* ── Section label ─────────────────────────────────────────── */
      .dp2-label {
        display: inline-flex; align-items: center; gap: 0.75rem;
        font-family: ${FF_BODY};
        font-size: 0.6875rem;
        font-weight: 600;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: #52525b;
        margin-bottom: 1.5rem;
      }
      .dp2-label::before {
        content: '';
        display: block;
        width: 0;
        height: 1px;
        background: #52525b;
        animation: dp2-line-grow 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s forwards;
      }

      /* ── About accent number ───────────────────────────────────── */
      .dp2-about-number {
        font-family: ${FF_DISPLAY};
        font-weight: 700;
        font-size: clamp(6rem, 14vw, 12rem);
        letter-spacing: -0.06em;
        line-height: 0.9;
        color: transparent;
        -webkit-text-stroke: 1px ${BORDER_MID};
        user-select: none;
        pointer-events: none;
      }

      /* ── CTA headline ──────────────────────────────────────────── */
      .dp2-cta-hl {
        font-family: ${FF_DISPLAY};
        font-weight: 700;
        font-size: clamp(2.5rem, 7vw, 6rem);
        letter-spacing: -0.04em;
        line-height: 0.95;
        color: ${C_HEADING};
      }

      /* ── Scrollbar hide ────────────────────────────────────────── */
      .dp2-no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
      .dp2-no-scrollbar::-webkit-scrollbar { display: none; }

      /* ── Responsive ────────────────────────────────────────────── */
      @media (max-width: 900px) {
        .dp2-bento-grid { grid-template-columns: 1fr !important; }
        .dp2-bento-featured { grid-column: span 1 !important; }
        .dp2-testi-cols { columns: 1 !important; }
        .dp2-about-inner { flex-direction: column !important; gap: 3rem !important; }
        .dp2-nav-links { display: none !important; }
        .dp2-hero-btns { flex-direction: column !important; align-items: stretch !important; }
        .dp2-hero-btns a { text-align: center !important; }
      }
      @media (max-width: 640px) {
        .dp2-bento-stats-row { grid-template-columns: 1fr 1fr !important; }
      }

      /* ── Reduced motion ────────────────────────────────────────── */
      @media (prefers-reduced-motion: reduce) {
        .dp2-hero-word, .dp2-hero-sub, .dp2-hero-cta, .dp2-hero-badge { animation: none !important; opacity: 1 !important; }
        .dp2-bento-card:hover, .dp2-testi-card:hover { transform: none !important; }
        .dp2-orb { animation: none !important; }
      }
    `}</style>
  );
}

// ── Navbar ─────────────────────────────────────────────────────────────────────
function Navbar({
  businessName, ctaText, primaryColor, navBackground,
  navLinks, isEditing,
}: {
  businessName: string; ctaText: string; primaryColor: string;
  navBackground: string; navLinks?: [string, string, string]; isEditing?: boolean;
}) {
  return (
    <nav
      className="dp2-nav"
      style={{
        background: `${navBackground}cc`,
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderBottom: isEditing
          ? `2px solid ${primaryColor}`
          : `1px solid ${BORDER}`,
      }}
    >
      <div className="dp2-nav-inner">
        {/* Logo */}
        <span style={{
          fontFamily: FF_DISPLAY,
          fontWeight: 700,
          fontSize: "1.05rem",
          color: "#ffffff",
          letterSpacing: "-0.03em",
        }}>
          {businessName}
        </span>

        {/* Links + CTA */}
        <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
          <div className="dp2-nav-links" style={{ display: "flex", gap: "2rem" }}>
            {(navLinks ?? ["Services", "About", "Contact"]).map((l, i) => (
              <a
                key={i}
                href={["#services", "#about", "#contact"][i]}
                className="dp2-nav-link"
              >
                {l}
              </a>
            ))}
          </div>
          <a
            href="#contact"
            style={{
              background: primaryColor,
              color: C_BTN,
              fontFamily: FF_BODY,
              fontWeight: 600,
              fontSize: "0.8125rem",
              padding: "9px 22px",
              borderRadius: "10px",
              textDecoration: "none",
              letterSpacing: "0.01em",
            }}
          >
            {ctaText}
          </a>
        </div>
      </div>
    </nav>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────────
function Hero({
  content, primaryColor, location, bg, heroImageUrl, theme, btnRadius,
}: {
  content: StructuredSiteContent["hero"];
  primaryColor: string;
  location: string;
  bg: string;
  heroImageUrl?: string;
  theme?: ThemeConfig;
  btnRadius?: string;
}) {
  // Split headline into words for staggered animation
  const words = (content.headline ?? "").split(" ");

  return (
    <section
      id="home"
      style={{
        minHeight: "100svh",
        backgroundColor: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "2rem clamp(1.5rem, 5vw, 4rem) 8rem",
        ...(heroImageUrl
          ? {
              backgroundImage: `url(${heroImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}),
      }}
    >
      {/* Hero image dark overlay */}
      {heroImageUrl && (
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.65) 100%)",
        }} />
      )}

      {/* Single large ambient orb — the ONLY decoration */}
      <div
        className="dp2-orb"
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(900px, 140vw)",
          height: "min(900px, 140vw)",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${hexToRgba(primaryColor, 0.12)} 0%, transparent 65%)`,
          pointerEvents: "none",
          animation: "dp2-orb-pulse 6s ease-in-out infinite",
        }}
      />

      {/* Bottom section fade */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "280px",
        background: `linear-gradient(to bottom, transparent, ${bg})`,
        pointerEvents: "none",
      }} />

      {/* Content */}
      <div style={{
        position: "relative",
        maxWidth: "1000px",
        margin: "0 auto",
        textAlign: "center",
      }}>
        {/* Badge */}
        <div
          className="dp2-hero-badge"
          style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${BORDER_MID}`,
            backdropFilter: "blur(16px)",
            borderRadius: "100px",
            padding: "8px 20px",
            marginBottom: "3.5rem",
            opacity: 0,
            animation: "dp2-badge-slide 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s forwards",
          }}
        >
          <span style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: primaryColor, display: "inline-block",
            animation: "dp2-live-pulse 2.5s ease-in-out infinite",
          }} />
          <span style={{
            fontFamily: FF_BODY,
            fontSize: "0.6875rem",
            fontWeight: 600,
            color: "#71717a",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
          }}>
            {content.badge || location}
          </span>
        </div>

        {/* Headline — word by word */}
        <h1 style={{
          fontFamily: FF_DISPLAY,
          fontWeight: 700,
          fontSize: "calc(clamp(3.5rem, 9vw, 8rem) * var(--font-scale, 1))",
          lineHeight: 0.95,
          letterSpacing: "-0.05em",
          marginBottom: "2.25rem",
          ...(theme?.headingColor
            ? { color: theme.headingColor }
            : {
                background: `linear-gradient(160deg, #ffffff 0%, ${hexToRgba(primaryColor, 0.85)} 120%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }
          ),
        }}>
          {words.map((word, i) => (
            <span
              key={i}
              className="dp2-hero-word"
              style={{
                animationDelay: `${0.3 + i * 0.07}s`,
                marginRight: i < words.length - 1 ? "0.25em" : 0,
              }}
            >
              {word}
            </span>
          ))}
        </h1>

        {/* Subheadline — fades in after all words */}
        <p
          className="dp2-hero-sub"
          style={{
            fontFamily: FF_BODY,
            fontSize: "clamp(1rem, 2.5vw, 1.1875rem)",
            color: C_BODY,
            lineHeight: 1.75,
            maxWidth: "560px",
            margin: "0 auto 3.5rem",
            opacity: 0,
            animation: `dp2-fade-up 0.7s cubic-bezier(0.16,1,0.3,1) ${0.3 + words.length * 0.07 + 0.2}s forwards`,
          }}
        >
          {content.subheadline}
        </p>

        {/* CTA buttons — slide up last */}
        <div
          className="dp2-hero-btns dp2-hero-cta"
          style={{
            display: "flex",
            gap: "0.875rem",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "3rem",
            opacity: 0,
            animation: `dp2-fade-up 0.7s cubic-bezier(0.16,1,0.3,1) ${0.3 + words.length * 0.07 + 0.5}s forwards`,
          }}
        >
          <a
            href="#contact"
            style={{
              background: primaryColor,
              color: C_BTN,
              fontFamily: FF_BODY,
              fontWeight: 700,
              fontSize: "0.9375rem",
              padding: "14px 38px",
              borderRadius: btnRadius ?? "12px",
              textDecoration: "none",
              letterSpacing: "0.01em",
            }}
          >
            {content.ctaText}
          </a>
          <a
            href="#services"
            style={{
              background: "transparent",
              color: "#a1a1aa",
              fontFamily: FF_BODY,
              fontWeight: 500,
              fontSize: "0.9375rem",
              padding: "14px 38px",
              borderRadius: btnRadius ?? "12px",
              textDecoration: "none",
              border: `1px solid ${BORDER_MID}`,
              letterSpacing: "0.01em",
              transition: "color 0.2s, border-color 0.2s",
            }}
          >
            Explore Services
          </a>
        </div>

        {/* Trust signals */}
        <div style={{
          opacity: 0,
          animation: `dp2-fade-up 0.6s ease ${0.3 + words.length * 0.07 + 0.75}s forwards`,
        }}>
          <TrustBadges primaryColor={primaryColor} center mt="0" />
          <div style={{ display: "flex", justifyContent: "center", marginTop: "0.75rem" }}>
            <RatingBadge theme="dark" mt="0" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Services — Rich Bento Grid ─────────────────────────────────────────────────
function Services({
  content, primaryColor, location, bg, card, serviceImages,
}: {
  content: StructuredSiteContent["services"];
  primaryColor: string;
  location: string;
  bg: string;
  card: string;
  serviceImages?: Record<number, string>;
}) {
  const pRgba = (a: number) => hexToRgba(primaryColor, a);

  const services = content.slice(0, 6);

  // Bento stats to display inside featured card
  const bentoStats = [
    { value: "10×", label: "Faster results" },
    { value: "98%", label: "Client retention" },
  ];

  return (
    <section
      id="services"
      style={{ background: bg, padding: "9rem clamp(1.5rem, 5vw, 4rem)" }}
    >
      <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
        {/* Section header */}
        <ScrollAnimator style={{ marginBottom: "4rem" }}>
          <div className="dp2-label">Services</div>
          <h2 style={{
            fontFamily: FF_DISPLAY,
            fontWeight: 700,
            fontSize: "clamp(2.25rem, 5vw, 4rem)",
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
            color: C_HEADING,
            maxWidth: "520px",
          }}>
            Built to move<br />the needle.
          </h2>
        </ScrollAnimator>

        <ScrollAnimator>
          {/* ── Bento grid ── */}
          <div
            className="dp2-bento-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gridTemplateRows: "auto",
              gap: "1rem",
            }}
          >
            {/* ── Card 0: Featured (spans 2 cols, tall) ── */}
            {services[0] && (
              <div
                className="dp2-bento-card dp2-bento-card-featured dp2-bento-featured"
                style={{ gridColumn: "span 2", minHeight: "320px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
              >
                {serviceImages?.[0] && serviceImages[0] !== "[uploaded]" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={serviceImages[0]}
                    alt={services[0].name}
                    style={{
                      width: "calc(100% + 4rem)",
                      height: "220px",
                      objectFit: "cover",
                      borderRadius: "12px 12px 0 0",
                      margin: "-2rem -2rem 1.5rem -2rem",
                      display: "block",
                      opacity: 0.9,
                    }}
                  />
                )}
                {/* Top */}
                <div>
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "48px", height: "48px",
                    borderRadius: "14px",
                    background: pRgba(0.15),
                    border: `1px solid ${pRgba(0.25)}`,
                    fontSize: "1.5rem",
                    marginBottom: "1.75rem",
                  }}>
                    {services[0].icon || "◆"}
                  </div>
                  <h3 style={{
                    fontFamily: FF_DISPLAY,
                    fontWeight: 700,
                    fontSize: "1.5rem",
                    letterSpacing: "-0.03em",
                    color: C_HEADING,
                    marginBottom: "0.75rem",
                  }}>
                    {services[0].name}
                  </h3>
                  <p style={{
                    fontFamily: FF_BODY,
                    fontSize: "0.9375rem",
                    color: C_BODY,
                    lineHeight: 1.75,
                    maxWidth: "420px",
                  }}>
                    {services[0].description || `Professional ${services[0].name.toLowerCase()} services in ${location}.`}
                  </p>
                </div>

                {/* Bottom: mini stats + arrow */}
                <div style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  marginTop: "2.5rem",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}>
                  <div style={{ display: "flex", gap: "2rem" }}>
                    {bentoStats.map((bs, i) => (
                      <div key={i}>
                        <div style={{
                          fontFamily: FF_DISPLAY,
                          fontWeight: 700,
                          fontSize: "1.75rem",
                          letterSpacing: "-0.04em",
                          color: primaryColor,
                          lineHeight: 1,
                        }}>
                          {bs.value}
                        </div>
                        <div style={{
                          fontFamily: FF_BODY,
                          fontSize: "0.75rem",
                          color: "#52525b",
                          marginTop: "4px",
                        }}>
                          {bs.label}
                        </div>
                      </div>
                    ))}
                  </div>
                  <a href="#contact" style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    fontFamily: FF_BODY,
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: primaryColor,
                    textDecoration: "none",
                    letterSpacing: "0.01em",
                  }}>
                    Get started <span style={{ fontSize: "1rem" }}>→</span>
                  </a>
                </div>
              </div>
            )}

            {/* ── Card 1: Standard right column ── */}
            {services[1] && (
              <div className="dp2-bento-card" style={{ minHeight: "320px", display: "flex", flexDirection: "column" }}>
                {serviceImages?.[1] && serviceImages[1] !== "[uploaded]" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={serviceImages[1]}
                    alt={services[1].name}
                    style={{
                      width: "calc(100% + 4rem)",
                      height: "160px",
                      objectFit: "cover",
                      borderRadius: "12px 12px 0 0",
                      margin: "-2rem -2rem 1.5rem -2rem",
                      display: "block",
                      opacity: 0.9,
                    }}
                  />
                )}
                <div style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: "44px", height: "44px", borderRadius: "13px",
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${BORDER}`,
                  fontSize: "1.35rem", marginBottom: "1.5rem",
                }}>
                  {services[1].icon || "◈"}
                </div>
                <h3 style={{
                  fontFamily: FF_DISPLAY, fontWeight: 700,
                  fontSize: "1.1rem", letterSpacing: "-0.03em",
                  color: C_HEADING, marginBottom: "0.625rem",
                }}>
                  {services[1].name}
                </h3>
                <p style={{
                  fontFamily: FF_BODY, fontSize: "0.875rem",
                  color: C_BODY, lineHeight: 1.75, flex: 1,
                }}>
                  {services[1].description || `Expert ${services[1].name.toLowerCase()} tailored for your market.`}
                </p>
                {/* Decorative bottom accent */}
                <div style={{
                  marginTop: "2rem",
                  height: "1px",
                  background: `linear-gradient(to right, ${pRgba(0.3)}, transparent)`,
                }} />
              </div>
            )}

            {/* ── Cards 2–4: Bottom row, 3 equal columns ── */}
            {services.slice(2, 5).map((s, i) => {
              const svcImg = serviceImages?.[i + 2];
              return (
              <div
                key={`mid-${i}`}
                className="dp2-bento-card"
                style={{ minHeight: "220px", display: "flex", flexDirection: "column" }}
              >
                {svcImg && svcImg !== "[uploaded]" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={svcImg}
                    alt={s.name}
                    style={{
                      width: "calc(100% + 4rem)",
                      height: "160px",
                      objectFit: "cover",
                      borderRadius: "12px 12px 0 0",
                      margin: "-2rem -2rem 1.5rem -2rem",
                      display: "block",
                      opacity: 0.9,
                    }}
                  />
                )}
                {/* Large index number — editorial accent */}
                <div style={{
                  fontFamily: FF_DISPLAY,
                  fontWeight: 700,
                  fontSize: "0.65rem",
                  letterSpacing: "0.14em",
                  color: C_MUTED,
                  marginBottom: "1.25rem",
                  textTransform: "uppercase",
                }}>
                  {String(i + 3).padStart(2, "0")}
                </div>
                <div style={{ fontSize: "1.4rem", marginBottom: "1rem" }}>{s.icon || "◇"}</div>
                <h3 style={{
                  fontFamily: FF_DISPLAY, fontWeight: 700,
                  fontSize: "1rem", letterSpacing: "-0.025em",
                  color: C_HEADING, marginBottom: "0.5rem",
                }}>
                  {s.name}
                </h3>
                <p style={{
                  fontFamily: FF_BODY, fontSize: "0.8125rem",
                  color: C_BODY, lineHeight: 1.7, flex: 1,
                }}>
                  {s.description || `Professional ${s.name.toLowerCase()} services.`}
                </p>
              </div>
              );
            })}

            {/* ── Card 5: Wide gradient CTA card ── */}
            {services[5] && (
              <div
                className="dp2-bento-card"
                style={{
                  background: `linear-gradient(135deg, ${pRgba(0.10)}, ${hexToRgba(primaryColor, 0.04)})`,
                  border: `1px solid ${pRgba(0.18)}`,
                  minHeight: "160px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1.5rem",
                  flexWrap: "wrap",
                }}
              >
                {serviceImages?.[5] && serviceImages[5] !== "[uploaded]" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={serviceImages[5]}
                    alt={services[5].name}
                    style={{
                      width: "calc(100% + 4rem)",
                      height: "160px",
                      objectFit: "cover",
                      borderRadius: "12px 12px 0 0",
                      margin: "-2rem -2rem 1.5rem -2rem",
                      display: "block",
                      opacity: 0.9,
                    }}
                  />
                )}
                <div>
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>{services[5].icon || "✦"}</div>
                  <h3 style={{
                    fontFamily: FF_DISPLAY, fontWeight: 700,
                    fontSize: "1rem", letterSpacing: "-0.025em",
                    color: C_HEADING, marginBottom: "0.375rem",
                  }}>
                    {services[5].name}
                  </h3>
                  <p style={{
                    fontFamily: FF_BODY, fontSize: "0.8125rem",
                    color: C_BODY, lineHeight: 1.6,
                  }}>
                    {services[5].description || `Specialized ${services[5].name.toLowerCase()} solutions.`}
                  </p>
                </div>
                <a href="#contact" style={{
                  flexShrink: 0,
                  background: primaryColor,
                  color: C_BTN,
                  fontFamily: FF_BODY,
                  fontWeight: 700,
                  fontSize: "0.8125rem",
                  padding: "11px 24px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}>
                  Start here
                </a>
              </div>
            )}

            {/* Extra services beyond 6 */}
            {content.slice(6).map((s, i) => {
              const svcImg = serviceImages?.[i + 6];
              return (
              <div key={`extra-${i}`} className="dp2-bento-card" style={{ minHeight: "180px" }}>
                {svcImg && svcImg !== "[uploaded]" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={svcImg}
                    alt={s.name}
                    style={{
                      width: "calc(100% + 4rem)",
                      height: "160px",
                      objectFit: "cover",
                      borderRadius: "12px 12px 0 0",
                      margin: "-2rem -2rem 1.5rem -2rem",
                      display: "block",
                      opacity: 0.9,
                    }}
                  />
                )}
                <div style={{ fontSize: "1.35rem", marginBottom: "1rem" }}>{s.icon || "◇"}</div>
                <h3 style={{
                  fontFamily: FF_DISPLAY, fontWeight: 700,
                  fontSize: "1rem", letterSpacing: "-0.025em",
                  color: C_HEADING, marginBottom: "0.5rem",
                }}>
                  {s.name}
                </h3>
                <p style={{
                  fontFamily: FF_BODY, fontSize: "0.8125rem",
                  color: C_BODY, lineHeight: 1.7,
                }}>
                  {s.description || `Professional ${s.name.toLowerCase()} services.`}
                </p>
              </div>
              );
            })}
          </div>
        </ScrollAnimator>
      </div>
    </section>
  );
}

// ── About ──────────────────────────────────────────────────────────────────────
function About({
  content, site, primaryColor, card, aboutImageUrl,
}: {
  content: StructuredSiteContent["about"];
  site: SiteRecord;
  primaryColor: string;
  card: string;
  aboutImageUrl?: string;
}) {
  const stats = content.stats.slice(0, 4);

  return (
    <section
      id="about"
      style={{
        backgroundColor: card,
        padding: "9rem clamp(1.5rem, 5vw, 4rem)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle ambient glow */}
      <div style={{
        position: "absolute",
        top: "-20%", right: "-10%",
        width: "50vw", height: "50vw",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${hexToRgba(primaryColor, 0.05)}, transparent 65%)`,
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1320px", margin: "0 auto", position: "relative" }}>
        <div
          className="dp2-about-inner"
          style={{
            display: "flex",
            gap: "6rem",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {/* Left: editorial large number + text */}
          <div style={{ flex: "1 1 400px", minWidth: 0 }}>
            <ScrollAnimator>
              <div className="dp2-label">About Us</div>
              <h2 style={{
                fontFamily: FF_DISPLAY,
                fontWeight: 700,
                fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                letterSpacing: "-0.04em",
                lineHeight: 1.0,
                color: C_HEADING,
                marginBottom: "1.75rem",
              }}>
                {content.title}
              </h2>
              <p style={{
                fontFamily: FF_BODY,
                fontSize: "1.0625rem",
                color: C_BODY,
                lineHeight: 1.85,
                marginBottom: "2.5rem",
              }}>
                {content.body}
              </p>

              {/* Contact */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {site.contactEmail && (
                  <a
                    href={`mailto:${site.contactEmail}`}
                    style={{
                      fontFamily: FF_BODY, fontSize: "0.875rem",
                      color: "#52525b", textDecoration: "none",
                      display: "flex", alignItems: "center", gap: "0.75rem",
                      transition: "color 0.2s",
                    }}
                  >
                    <span style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: "28px", height: "28px", borderRadius: "8px",
                      background: hexToRgba(primaryColor, 0.1),
                      fontSize: "0.85rem",
                    }}>✉</span>
                    {site.contactEmail}
                  </a>
                )}
                {site.contactPhone && (
                  <a
                    href={`tel:${site.contactPhone}`}
                    style={{
                      fontFamily: FF_BODY, fontSize: "0.875rem",
                      color: "#52525b", textDecoration: "none",
                      display: "flex", alignItems: "center", gap: "0.75rem",
                      transition: "color 0.2s",
                    }}
                  >
                    <span style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: "28px", height: "28px", borderRadius: "8px",
                      background: hexToRgba(primaryColor, 0.1),
                      fontSize: "0.85rem",
                    }}>✆</span>
                    {site.contactPhone}
                  </a>
                )}
              </div>
            </ScrollAnimator>
          </div>

          {/* Right: image OR stats grid */}
          <div style={{ flex: "1 1 340px", minWidth: 0 }}>
            <ScrollAnimator>
              {aboutImageUrl ? (
                <div style={{ position: "relative" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={aboutImageUrl}
                    alt="About"
                    style={{
                      width: "100%",
                      maxHeight: "460px",
                      objectFit: "cover",
                      borderRadius: "20px",
                      display: "block",
                      border: `1px solid ${BORDER}`,
                    }}
                  />
                  {/* Floating stat pill on image */}
                  {stats[0] && (
                    <div style={{
                      position: "absolute",
                      bottom: "1.5rem", left: "1.5rem",
                      background: "rgba(10,10,12,0.85)",
                      backdropFilter: "blur(16px)",
                      border: `1px solid ${BORDER_MID}`,
                      borderRadius: "14px",
                      padding: "1rem 1.5rem",
                    }}>
                      <div style={{
                        fontFamily: FF_DISPLAY, fontWeight: 700,
                        fontSize: "1.75rem", letterSpacing: "-0.04em",
                        color: primaryColor, lineHeight: 1,
                      }}>
                        {stats[0].value}
                      </div>
                      <div style={{
                        fontFamily: FF_BODY, fontSize: "0.75rem",
                        color: "#71717a", marginTop: "4px",
                      }}>
                        {stats[0].label}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Stats grid — no image */
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}>
                  {stats.map((st, i) => (
                    <div
                      key={i}
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: `1px solid ${BORDER}`,
                        borderRadius: "18px",
                        padding: "2rem 1.5rem",
                        transition: "border-color 0.3s",
                      }}
                    >
                      <div style={{
                        fontFamily: FF_DISPLAY,
                        fontWeight: 700,
                        fontSize: "clamp(2rem, 4vw, 3rem)",
                        letterSpacing: "-0.05em",
                        color: primaryColor,
                        lineHeight: 1,
                        marginBottom: "0.5rem",
                      }}>
                        {st.value}
                      </div>
                      <div style={{
                        fontFamily: FF_BODY,
                        fontSize: "0.8rem",
                        color: "#52525b",
                        lineHeight: 1.4,
                      }}>
                        {st.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollAnimator>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Testimonials — Masonry grid ────────────────────────────────────────────────
function Testimonials({
  content, primaryColor, bg,
}: {
  content: StructuredSiteContent["testimonials"];
  primaryColor: string;
  bg: string;
}) {
  if (!content?.length) return null;

  return (
    <section style={{ background: bg, padding: "9rem clamp(1.5rem, 5vw, 4rem)" }}>
      <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
        <ScrollAnimator style={{ marginBottom: "4rem" }}>
          <div className="dp2-label">Reviews</div>
          <div style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "2rem",
            flexWrap: "wrap",
          }}>
            <h2 style={{
              fontFamily: FF_DISPLAY,
              fontWeight: 700,
              fontSize: "clamp(2.25rem, 5vw, 4rem)",
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              color: C_HEADING,
            }}>
              Trusted by<br />hundreds.
            </h2>
            {/* Aggregate rating */}
            <div style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              paddingBottom: "0.25rem",
            }}>
              <div style={{
                fontFamily: FF_DISPLAY, fontWeight: 700,
                fontSize: "2.5rem", letterSpacing: "-0.05em",
                color: primaryColor,
              }}>
                5.0
              </div>
              <div>
                <Stars n={5} color={primaryColor} />
                <div style={{
                  fontFamily: FF_BODY, fontSize: "0.75rem",
                  color: "#52525b", marginTop: "4px",
                }}>
                  Average rating
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimator>

        <ScrollAnimator>
          {/* CSS columns masonry */}
          <div
            className="dp2-testi-cols"
            style={{
              columns: "3",
              columnGap: "1rem",
            }}
          >
            {content.map((t, i) => (
              <div key={i} className="dp2-testi-card">
                <div style={{ marginBottom: "1rem" }}>
                  <Stars n={t.rating} color={primaryColor} />
                </div>
                <p style={{
                  fontFamily: FF_BODY,
                  fontSize: "0.9375rem",
                  color: "#a1a1aa",
                  lineHeight: 1.8,
                  marginBottom: "1.5rem",
                  fontStyle: "italic",
                }}>
                  "{t.quote}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                  {/* Avatar */}
                  <div style={{
                    width: "38px", height: "38px", borderRadius: "50%",
                    background: `linear-gradient(135deg, ${primaryColor}33, ${hexToRgba(primaryColor, 0.1)})`,
                    border: `1px solid ${hexToRgba(primaryColor, 0.2)}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: FF_DISPLAY, fontWeight: 700,
                    fontSize: "0.9rem", color: primaryColor,
                    flexShrink: 0,
                  }}>
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{
                      fontFamily: FF_BODY, fontWeight: 600,
                      fontSize: "0.875rem", color: "#e4e4e7",
                    }}>
                      {t.name}
                    </div>
                    <div style={{
                      fontFamily: FF_BODY, fontSize: "0.75rem",
                      color: "#52525b",
                    }}>
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollAnimator>
      </div>
    </section>
  );
}

// ── CTA ─────────────────────────────────────────────────────────────────────────
function CTA({
  content, primaryColor, contactEmail, contactPhone,
  card, businessName, siteId, btnRadius,
}: {
  content: StructuredSiteContent["cta"];
  primaryColor: string;
  contactEmail?: string;
  contactPhone?: string;
  card: string;
  businessName?: string;
  siteId?: string;
  btnRadius?: string;
}) {
  return (
    <section
      id="contact"
      style={{
        backgroundColor: card,
        borderTop: `1px solid ${BORDER}`,
        padding: "10rem clamp(1.5rem, 5vw, 4rem)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Large ambient orb */}
      <div style={{
        position: "absolute",
        bottom: "-20%", left: "50%",
        transform: "translateX(-50%)",
        width: "80vw", height: "80vw",
        maxWidth: "900px", maxHeight: "900px",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${hexToRgba(primaryColor, 0.09)}, transparent 65%)`,
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1320px", margin: "0 auto", position: "relative" }}>
        <ScrollAnimator>
          {/* Big editorial headline */}
          <div className="dp2-label" style={{ marginBottom: "2rem" }}>Get Started</div>
          <h2 className="dp2-cta-hl" style={{ marginBottom: "1.5rem", maxWidth: "800px" }}>
            {content.headline}
          </h2>
          <p style={{
            fontFamily: FF_BODY,
            fontSize: "1.0625rem",
            color: C_BODY,
            lineHeight: 1.75,
            marginBottom: "4rem",
            maxWidth: "480px",
          }}>
            {content.subtext}
          </p>

          {/* Form */}
          <div style={{ maxWidth: "500px" }}>
            <ContactFormBlock
              businessEmail={contactEmail}
              businessName={businessName}
              siteId={siteId}
              fontFamily={FF_BODY}
              labelStyle={{
                color: "#52525b",
                fontSize: "0.8125rem",
                fontWeight: 500,
                letterSpacing: "0.01em",
              }}
              inputStyle={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${BORDER}`,
                borderRadius: "10px",
                padding: "13px 16px",
                color: "#f4f4f5",
                fontSize: "0.9rem",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              btnStyle={{
                background: primaryColor,
                color: C_BTN,
                fontFamily: FF_BODY,
                fontWeight: 700,
                fontSize: "0.9375rem",
                padding: "14px 28px",
                borderRadius: btnRadius ?? "12px",
                border: "none",
                width: "100%",
                cursor: "pointer",
                letterSpacing: "0.01em",
              }}
              successColor={primaryColor}
            />
          </div>
        </ScrollAnimator>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────────
function Footer({ site, primaryColor, navLinks }: {
  site: SiteRecord;
  primaryColor: string;
  navLinks?: [string, string, string];
}) {
  const links = navLinks ?? ["Services", "About", "Contact"];
  const hrefs = ["#services", "#about", "#contact"];

  return (
    <footer style={{
      background: "#030303",
      borderTop: `1px solid ${BORDER}`,
      padding: "4rem clamp(1.5rem, 5vw, 4rem) 2.5rem",
    }}>
      <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
        {/* Top row */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "3rem",
          marginBottom: "4rem",
        }}>
          {/* Brand */}
          <div>
            <div style={{
              fontFamily: FF_DISPLAY,
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "#ffffff",
              letterSpacing: "-0.03em",
              marginBottom: "0.75rem",
            }}>
              {site.businessName}
            </div>
            <div style={{
              fontFamily: FF_BODY,
              fontSize: "0.8125rem",
              color: "#3f3f46",
              maxWidth: "240px",
              lineHeight: 1.6,
            }}>
              {site.location}
            </div>
          </div>

          {/* Nav links */}
          <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
            <div>
              <div style={{
                fontFamily: FF_BODY, fontSize: "0.6875rem",
                fontWeight: 600, letterSpacing: "0.12em",
                textTransform: "uppercase", color: "#3f3f46",
                marginBottom: "1rem",
              }}>
                Navigation
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {links.map((l, i) => (
                  <a key={i} href={hrefs[i]} style={{
                    fontFamily: FF_BODY, fontSize: "0.875rem",
                    color: "#52525b", textDecoration: "none",
                    transition: "color 0.2s",
                  }}>
                    {l}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact */}
            {(site.contactEmail || site.contactPhone) && (
              <div>
                <div style={{
                  fontFamily: FF_BODY, fontSize: "0.6875rem",
                  fontWeight: 600, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: "#3f3f46",
                  marginBottom: "1rem",
                }}>
                  Contact
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  {site.contactEmail && (
                    <a href={`mailto:${site.contactEmail}`} style={{
                      fontFamily: FF_BODY, fontSize: "0.875rem",
                      color: "#52525b", textDecoration: "none",
                    }}>
                      {site.contactEmail}
                    </a>
                  )}
                  {site.contactPhone && (
                    <a href={`tel:${site.contactPhone}`} style={{
                      fontFamily: FF_BODY, fontSize: "0.875rem",
                      color: "#52525b", textDecoration: "none",
                    }}>
                      {site.contactPhone}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: `1px solid ${BORDER}`,
          paddingTop: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}>
          <span style={{
            fontFamily: FF_BODY, fontSize: "0.75rem", color: "#27272a",
          }}>
            © {new Date().getFullYear()} {site.businessName}. All rights reserved.
          </span>
          <span style={{ fontFamily: FF_BODY, fontSize: "0.75rem", color: "#27272a" }}>
            Built with{" "}
            <a
              href="https://baileyagents.com"
              style={{ color: primaryColor, textDecoration: "none" }}
            >
              BaileyAgents
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

// ── Root layout ────────────────────────────────────────────────────────────────
export function DarkPremiumLayout({
  site, content, primaryColor, heroImageUrl, aboutImageUrl, serviceImages, theme, isEditing,
}: TemplateProps) {
  const BG   = theme?.background ?? "#080808";
  const CARD = theme?.surface    ?? "#0c0c0e";

  const btnRadius =
    theme?.buttonStyle === "sharp" ? "0px"   :
    theme?.buttonStyle === "pill"  ? "999px" : "12px";

  return (
    <>
      <Styles p={primaryColor} card={CARD} bg={BG} />
      <div className="dp2-root" style={{ background: BG }}>
        <Navbar
          businessName={site.businessName}
          ctaText={content.hero.ctaText}
          primaryColor={primaryColor}
          navBackground={CARD}
          navLinks={content.nav?.links}
          isEditing={isEditing}
        />
        <Hero
          content={content.hero}
          primaryColor={primaryColor}
          location={site.location}
          bg={BG}
          heroImageUrl={heroImageUrl}
          theme={theme}
          btnRadius={btnRadius}
        />
        <Services
          content={content.services}
          primaryColor={primaryColor}
          location={site.location}
          bg={BG}
          card={CARD}
          serviceImages={serviceImages}
        />
        <About
          content={content.about}
          site={site}
          primaryColor={primaryColor}
          card={CARD}
          aboutImageUrl={aboutImageUrl}
        />
        <Testimonials
          content={content.testimonials}
          primaryColor={primaryColor}
          bg={BG}
        />
        <CTA
          content={content.cta}
          primaryColor={primaryColor}
          contactEmail={site.contactEmail}
          contactPhone={site.contactPhone}
          card={CARD}
          businessName={site.businessName}
          siteId={site.siteId}
          btnRadius={btnRadius}
        />
        <Footer
          site={site}
          primaryColor={primaryColor}
          navLinks={content.nav?.links}
        />
      </div>
    </>
  );
}

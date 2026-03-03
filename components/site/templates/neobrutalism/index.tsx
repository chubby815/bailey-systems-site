/**
 * Neo Brutalism template — thick black borders, offset shadows, raw bold typography.
 * Cream background, yellow CTAs, zero border-radius — poster / zine aesthetic.
 */
import type { SiteRecord } from "@/lib/kv";
import type { StructuredSiteContent } from "@/lib/site-theme";

export type TemplateProps = {
  site:          SiteRecord;
  content:       StructuredSiteContent;
  primaryColor:  string;
  heroImageUrl?: string;
};

// ── Design tokens ────────────────────────────────────────────────────────────
const BG      = "#fffef7";
const BLACK   = "#000000";
const YELLOW  = "#FFE500";
const BORDER  = `3px solid ${BLACK}`;
const SHADOW  = "4px 4px 0px #000";
const SHADOW_LG = "6px 6px 0px #000";
const FF      = "'Helvetica Neue', 'Arial Black', Arial, sans-serif";

// CSS-variable–aware text colors (user can override via editor)
const C_HEADING = "var(--heading-color, #000000)";
const C_BODY    = "var(--body-color, #333333)";
const C_ACCENT  = "var(--accent-color, #000000)";
const C_BTN     = "var(--btn-text-color, #FFE500)";

function Stars({ n }: { n: number }) {
  return (
    <span style={{ color: YELLOW, fontSize: "1.1rem", textShadow: "1px 1px 0 #000" }}>
      {"★".repeat(Math.min(5, Math.max(1, Math.round(n))))}
      {"☆".repeat(5 - Math.min(5, Math.max(1, Math.round(n))))}
    </span>
  );
}

// ── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ businessName, ctaText }: { businessName: string; ctaText: string }) {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: BLACK, borderBottom: `3px solid ${BLACK}`,
      padding: "0 2rem",
    }}>
      <div style={{
        maxWidth: "1200px", margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "64px",
      }}>
        <span style={{ fontFamily: FF, fontWeight: 900, fontSize: "1.3rem", color: YELLOW, letterSpacing: "-0.02em" }}>
          {businessName.toUpperCase()}
        </span>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          {["Services", "About", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{
              color: "#fff", fontFamily: FF, fontWeight: 700, fontSize: "0.8rem",
              textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.05em",
            }}>{l}</a>
          ))}
          <a href="#contact" style={{
            background: YELLOW, color: BLACK, fontFamily: FF, fontWeight: 900,
            fontSize: "0.8rem", padding: "8px 16px", border: BORDER,
            boxShadow: SHADOW, textDecoration: "none", textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>{ctaText}</a>
        </div>
      </div>
    </nav>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ content, heroImageUrl, primaryColor, location }: {
  content: StructuredSiteContent["hero"];
  heroImageUrl?: string;
  primaryColor: string;
  location: string;
}) {
  return (
    <section id="home" style={{
      background: BG, borderBottom: BORDER,
      padding: "5rem 2rem 4rem",
    }}>
      <div style={{
        maxWidth: "1200px", margin: "0 auto",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center",
      }}>
        {/* Left: Text */}
        <div>
          <div style={{
            display: "inline-block", background: YELLOW, color: BLACK,
            fontFamily: FF, fontWeight: 900, fontSize: "0.75rem",
            textTransform: "uppercase", letterSpacing: "0.1em",
            padding: "4px 12px", border: BORDER, boxShadow: SHADOW,
            marginBottom: "1.5rem",
          }}>
            {content.badge || location}
          </div>
        <h1 style={{
          fontFamily: FF, fontWeight: 900,
          fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
          lineHeight: 1.0, letterSpacing: "-0.03em",
          color: C_HEADING, marginBottom: "1.5rem",
          textTransform: "uppercase",
        }}>
          {content.headline}
        </h1>
        <p style={{
          fontFamily: FF, fontSize: "1.05rem",
          color: C_BODY, lineHeight: 1.7, marginBottom: "2rem", maxWidth: "480px",
        }}>
          {content.subheadline}
        </p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <a href="#contact" style={{
            background: BLACK, color: C_BTN,
              fontFamily: FF, fontWeight: 900, fontSize: "0.95rem",
              padding: "14px 28px", border: BORDER, boxShadow: SHADOW_LG,
              textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.05em",
              transition: "transform 0.1s",
            }}>
              {content.ctaText}
            </a>
            <a href="#services" style={{
              background: "transparent", color: BLACK,
              fontFamily: FF, fontWeight: 900, fontSize: "0.95rem",
              padding: "14px 28px", border: BORDER, boxShadow: SHADOW,
              textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.05em",
            }}>
              Our Work →
            </a>
          </div>
        </div>

        {/* Right: Image box */}
        <div style={{
          border: BORDER, boxShadow: SHADOW_LG, overflow: "hidden",
          aspectRatio: "4/3", background: "#111",
          position: "relative",
        }}>
          {heroImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={heroImageUrl} alt="Hero" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          )}
          <div style={{
            position: "absolute", bottom: "1rem", left: "1rem",
            background: primaryColor, color: "#fff",
            fontFamily: FF, fontWeight: 900, fontSize: "0.7rem",
            textTransform: "uppercase", letterSpacing: "0.1em",
            padding: "6px 12px", border: `2px solid #fff`,
          }}>
            Professional Service
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Services ─────────────────────────────────────────────────────────────────
function Services({ content, location }: { content: StructuredSiteContent["services"]; location: string }) {
  return (
    <section id="services" style={{ background: "#fff", borderBottom: BORDER, padding: "5rem 2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", marginBottom: "3rem" }}>
          <span style={{
            fontFamily: FF, fontWeight: 900, fontSize: "5rem",
            color: YELLOW, lineHeight: 1, WebkitTextStroke: `3px ${BLACK}`,
          }}>02</span>
          <h2 style={{
            fontFamily: FF, fontWeight: 900, fontSize: "2.5rem",
            textTransform: "uppercase", letterSpacing: "-0.02em", color: C_HEADING,
          }}>Services</h2>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "1.25rem",
        }}>
          {content.map((s, i) => (
            <div key={i} style={{
              background: i % 2 === 0 ? BG : YELLOW,
              border: BORDER, boxShadow: SHADOW,
              padding: "1.75rem",
            }}>
              <div style={{
                fontFamily: FF, fontSize: "2rem", marginBottom: "0.75rem",
              }}>{s.icon || "✦"}</div>
              <h3 style={{
                fontFamily: FF, fontWeight: 900, fontSize: "1.1rem",
                textTransform: "uppercase", color: C_HEADING, marginBottom: "0.5rem",
              }}>{s.name}</h3>
              <p style={{ fontFamily: FF, fontSize: "0.875rem", color: C_BODY, lineHeight: 1.6 }}>
                {s.description || `Professional ${s.name.toLowerCase()} services in ${location}.`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
function About({ content, site }: { content: StructuredSiteContent["about"]; site: SiteRecord }) {
  return (
    <section id="about" style={{ background: BG, borderBottom: BORDER, padding: "5rem 2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", marginBottom: "2.5rem" }}>
          <span style={{
            fontFamily: FF, fontWeight: 900, fontSize: "5rem",
            color: "transparent", lineHeight: 1, WebkitTextStroke: `3px ${BLACK}`,
          }}>03</span>
          <h2 style={{
            fontFamily: FF, fontWeight: 900, fontSize: "2.5rem",
            textTransform: "uppercase", letterSpacing: "-0.02em", color: C_HEADING,
          }}>About Us</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>
          <div>
            <h3 style={{
              fontFamily: FF, fontWeight: 900, fontSize: "1.8rem",
              textTransform: "uppercase", color: C_HEADING, marginBottom: "1rem", lineHeight: 1.1,
            }}>{content.title}</h3>
            <p style={{ fontFamily: FF, fontSize: "0.95rem", color: C_BODY, lineHeight: 1.8, marginBottom: "1.5rem" }}>
              {content.body}
            </p>
            {site.contactEmail && (
              <p style={{ fontFamily: FF, fontSize: "0.875rem", color: BLACK, fontWeight: 700 }}>
                ✉ {site.contactEmail}
              </p>
            )}
            {site.contactPhone && (
              <p style={{ fontFamily: FF, fontSize: "0.875rem", color: BLACK, fontWeight: 700, marginTop: "0.25rem" }}>
                ✆ {site.contactPhone}
              </p>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {content.stats.map((st, i) => (
              <div key={i} style={{
                background: i === 0 ? BLACK : i === 1 ? YELLOW : "#fff",
                border: BORDER, boxShadow: SHADOW,
                padding: "1.25rem 1.5rem",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{
                  fontFamily: FF, fontWeight: 900, fontSize: "2rem",
                  color: i === 0 ? YELLOW : BLACK,
                }}>{st.value}</span>
                <span style={{
                  fontFamily: FF, fontWeight: 700, fontSize: "0.8rem",
                  textTransform: "uppercase", letterSpacing: "0.08em",
                  color: i === 0 ? "#fff" : BLACK,
                }}>{st.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────────
function Testimonials({ content }: { content: StructuredSiteContent["testimonials"] }) {
  if (!content?.length) return null;
  return (
    <section style={{ background: BLACK, borderBottom: BORDER, padding: "5rem 2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", marginBottom: "3rem" }}>
          <span style={{
            fontFamily: FF, fontWeight: 900, fontSize: "5rem",
            color: YELLOW, lineHeight: 1,
          }}>04</span>
          <h2 style={{
            fontFamily: FF, fontWeight: 900, fontSize: "2.5rem",
            textTransform: "uppercase", letterSpacing: "-0.02em", color: "#fff",
          }}>What They Say</h2>
          {/* testimonials section heading stays white — it's on a black background */}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
          {content.map((t, i) => (
            <div key={i} style={{
              background: i % 2 === 0 ? BG : YELLOW,
              border: `3px solid ${YELLOW}`, boxShadow: `4px 4px 0 ${YELLOW}`,
              padding: "2rem",
            }}>
              <Stars n={t.rating} />
              <p style={{
                fontFamily: FF, fontSize: "0.9rem", color: C_BODY, lineHeight: 1.7,
                margin: "0.75rem 0 1.25rem", fontWeight: 700,
              }}>"{t.quote}"</p>
              <div style={{ fontFamily: FF, fontWeight: 900, fontSize: "0.875rem", color: C_HEADING, textTransform: "uppercase" }}>
                — {t.name}
              </div>
              <div style={{ fontFamily: FF, fontSize: "0.75rem", color: C_BODY, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {t.role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────────
function CTA({ content, contactEmail, contactPhone }: {
  content: StructuredSiteContent["cta"];
  contactEmail?: string;
  contactPhone?: string;
}) {
  const href = contactPhone ? `tel:${contactPhone}` : contactEmail ? `mailto:${contactEmail}` : "#contact";
  return (
    <section id="contact" style={{ background: YELLOW, borderBottom: BORDER, padding: "5rem 2rem", textAlign: "center" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        <span style={{
          fontFamily: FF, fontWeight: 900, fontSize: "5rem",
          color: "transparent", WebkitTextStroke: `3px ${BLACK}`, display: "block", lineHeight: 1, marginBottom: "1rem",
        }}>05</span>
        <h2 style={{
          fontFamily: FF, fontWeight: 900,
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          textTransform: "uppercase", letterSpacing: "-0.03em",
          color: C_HEADING, marginBottom: "1rem", lineHeight: 1.0,
        }}>{content.headline}</h2>
        <p style={{ fontFamily: FF, fontSize: "1rem", color: C_BODY, marginBottom: "2.5rem" }}>
          {content.subtext}
        </p>
        <a href={href} style={{
          background: BLACK, color: C_BTN,
          fontFamily: FF, fontWeight: 900, fontSize: "1.1rem",
          padding: "18px 40px", border: BORDER,
          boxShadow: SHADOW_LG, textDecoration: "none",
          textTransform: "uppercase", letterSpacing: "0.08em", display: "inline-block",
        }}>{content.buttonText}</a>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer({ site }: { site: SiteRecord }) {
  return (
    <footer id="footer" style={{ background: BLACK, padding: "2.5rem 2rem", borderTop: BORDER }}>
      <div style={{
        maxWidth: "1200px", margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem",
      }}>
        <span style={{ fontFamily: FF, fontWeight: 900, fontSize: "1.2rem", color: YELLOW, textTransform: "uppercase" }}>
          {site.businessName}
        </span>
        <span style={{ fontFamily: FF, fontSize: "0.75rem", color: "#666", textTransform: "uppercase" }}>
          © {new Date().getFullYear()} · Built with{" "}
          <a href="https://baileysystemsai.com" style={{ color: YELLOW, textDecoration: "none" }}>BaileySystemsAI</a>
        </span>
      </div>
    </footer>
  );
}

// ── Main Layout ───────────────────────────────────────────────────────────────
export function NeoBrutalismLayout({ site, content, primaryColor, heroImageUrl }: TemplateProps) {
  return (
    <div style={{ fontFamily: FF, background: BG }}>
      <Navbar businessName={site.businessName} ctaText={content.hero.ctaText} />
      <Hero content={content.hero} heroImageUrl={heroImageUrl} primaryColor={primaryColor} location={site.location} />
      <Services content={content.services} location={site.location} />
      <About content={content.about} site={site} />
      <Testimonials content={content.testimonials} />
      <CTA content={content.cta} contactEmail={site.contactEmail} contactPhone={site.contactPhone} />
      <Footer site={site} />
    </div>
  );
}

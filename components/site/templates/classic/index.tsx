/**
 * Classic Business template — traditional professional aesthetic.
 * Navy header, white content, gold accents, 3-column icon grid, trust badges.
 */
import type { SiteRecord } from "@/lib/kv";
import type { StructuredSiteContent } from "@/lib/site-theme";

export type TemplateProps = {
  site:          SiteRecord;
  content:       StructuredSiteContent;
  primaryColor:  string;
  heroImageUrl?: string;
};

const NAVY    = "#1e3a5f";
const NAVY_LT = "#234569";
const GOLD    = "#c9a84c";
const WHITE   = "#ffffff";
const OFF_W   = "#f7f8fa";
const TEXT    = "#1a2332";
const MUTED   = "#5a6a7a";
const FF      = "'Georgia', 'Times New Roman', serif";
const FF_SAN  = "'Helvetica Neue', Arial, sans-serif";

// CSS-variable–aware text colors
const C_HEADING = "var(--heading-color, #1a2332)";
const C_BODY    = "var(--body-color, #5a6a7a)";
const C_ACCENT  = "var(--accent-color, #c9a84c)";
const C_BTN     = "var(--btn-text-color, #1a2332)";

function Stars({ n }: { n: number }) {
  const c = Math.min(5, Math.max(1, Math.round(n)));
  return <span style={{ color: GOLD, fontSize: "1rem" }}>{"★".repeat(c)}{"☆".repeat(5 - c)}</span>;
}

// ── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ businessName, ctaText }: { businessName: string; ctaText: string }) {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: NAVY, borderBottom: `3px solid ${GOLD}`,
      padding: "0 2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
    }}>
      <div style={{
        maxWidth: "1160px", margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "68px",
      }}>
        <span style={{
          fontFamily: FF, fontWeight: 700, fontSize: "1.3rem",
          color: WHITE, letterSpacing: "-0.01em",
        }}>{businessName}</span>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {["Services", "About", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{
              fontFamily: FF_SAN, fontSize: "0.82rem", fontWeight: 400,
              color: "rgba(255,255,255,0.75)", textDecoration: "none",
              padding: "6px 14px",
            }}>{l}</a>
          ))}
          <a href="#contact" style={{
            background: GOLD, color: TEXT,
            fontFamily: FF_SAN, fontWeight: 700, fontSize: "0.82rem",
            padding: "8px 20px", borderRadius: "4px", textDecoration: "none",
            border: `1px solid ${GOLD}`, boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}>{ctaText}</a>
        </div>
      </div>
    </nav>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ content, heroImageUrl, location }: {
  content: StructuredSiteContent["hero"];
  heroImageUrl?: string;
  location: string;
}) {
  return (
    <section id="home" style={{
      background: NAVY,
      backgroundImage: heroImageUrl ? `url(${heroImageUrl})` : undefined,
      backgroundSize: "cover", backgroundPosition: "center",
      minHeight: "80vh", display: "flex", alignItems: "center",
      padding: "5rem 2rem", position: "relative",
    }}>
      {heroImageUrl && (
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(30,58,95,0.88) 0%, rgba(30,58,95,0.72) 100%)",
        }} />
      )}
      <div style={{ position: "relative", maxWidth: "1160px", margin: "0 auto", textAlign: "center", width: "100%" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "rgba(201,168,76,0.15)", border: `1px solid ${GOLD}`,
          padding: "6px 18px", marginBottom: "1.75rem", borderRadius: "2px",
        }}>
          <span style={{ width: "6px", height: "6px", background: GOLD, borderRadius: "50%", display: "inline-block" }} />
          <span style={{ fontFamily: FF_SAN, fontSize: "0.72rem", fontWeight: 600, color: GOLD, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {content.badge || location}
          </span>
        </div>
        <h1 style={{
          fontFamily: FF, fontWeight: 700,
          fontSize: "clamp(2.25rem, 5vw, 4rem)",
          lineHeight: 1.15, color: WHITE, marginBottom: "1.5rem",
          textShadow: "0 2px 20px rgba(0,0,0,0.3)",
        }}>
          {content.headline}
        </h1>
        <p style={{
          fontFamily: FF_SAN, fontSize: "1.05rem", color: "rgba(255,255,255,0.82)",
          maxWidth: "580px", margin: "0 auto 2.5rem", lineHeight: 1.75,
        }}>{content.subheadline}</p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="#contact" style={{
            background: GOLD, color: TEXT,
            fontFamily: FF_SAN, fontWeight: 700, fontSize: "0.9rem",
            padding: "13px 32px", borderRadius: "4px", textDecoration: "none",
            boxShadow: "0 4px 20px rgba(201,168,76,0.4)",
          }}>{content.ctaText}</a>
          <a href="#services" style={{
            background: "transparent", color: WHITE,
            fontFamily: FF_SAN, fontWeight: 600, fontSize: "0.9rem",
            padding: "13px 32px", borderRadius: "4px", textDecoration: "none",
            border: "1.5px solid rgba(255,255,255,0.35)",
          }}>Our Services ↓</a>
        </div>

        {/* Trust badges */}
        <div style={{
          display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap",
          marginTop: "3.5rem", paddingTop: "2.5rem",
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}>
          {["✓ Licensed & Insured", "⭐ 5-Star Rated", "🏆 Trusted Local Business", "📞 Free Consultations"].map(b => (
            <span key={b} style={{
              fontFamily: FF_SAN, fontSize: "0.78rem", fontWeight: 600,
              color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: "0.05em",
            }}>{b}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Services (3-column icon grid) ─────────────────────────────────────────────
function Services({ content, location }: { content: StructuredSiteContent["services"]; location: string }) {
  return (
    <section id="services" style={{ background: OFF_W, padding: "6rem 2rem" }}>
      <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{
            width: "48px", height: "3px", background: GOLD, margin: "0 auto 1.25rem",
          }} />
          <h2 style={{ fontFamily: FF, fontWeight: 700, fontSize: "2.25rem", color: C_HEADING, marginBottom: "0.75rem" }}>
            Our Services
          </h2>
          <p style={{ fontFamily: FF_SAN, fontSize: "0.95rem", color: C_BODY, maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
            Professional services delivered with experience and dedication to quality.
          </p>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}>
          {content.map((s, i) => (
            <div key={i} style={{
              background: WHITE, border: "1px solid #e0e6ef",
              borderTop: `4px solid ${GOLD}`, borderRadius: "4px",
              padding: "2rem 1.75rem",
              boxShadow: "0 2px 12px rgba(30,58,95,0.06)",
              textAlign: "center",
            }}>
              <div style={{
                width: "56px", height: "56px", borderRadius: "50%",
                background: `${NAVY}10`, border: `2px solid ${GOLD}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.5rem", margin: "0 auto 1.25rem",
              }}>{s.icon || "✓"}</div>
              <h3 style={{ fontFamily: FF, fontWeight: 700, fontSize: "1.1rem", color: C_HEADING, marginBottom: "0.625rem" }}>
                {s.name}
              </h3>
              <p style={{ fontFamily: FF_SAN, fontSize: "0.85rem", color: C_BODY, lineHeight: 1.7 }}>
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
    <section id="about" style={{ background: WHITE, padding: "6rem 2rem" }}>
      <div style={{
        maxWidth: "1160px", margin: "0 auto",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center",
      }}>
        {/* Stats block */}
        <div style={{
          background: NAVY, borderRadius: "4px", padding: "3rem 2.5rem",
          boxShadow: "0 8px 40px rgba(30,58,95,0.18)",
        }}>
          <div style={{ width: "40px", height: "3px", background: GOLD, marginBottom: "1.75rem" }} />
          <div style={{ fontFamily: FF, fontWeight: 700, fontSize: "2rem", color: WHITE, marginBottom: "0.375rem" }}>
            {content.stats[0]?.value ?? ""}
          </div>
          <div style={{ fontFamily: FF_SAN, fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "2rem" }}>
            {content.stats[0]?.label ?? ""}
          </div>
          {content.stats.slice(1).map((st, i) => (
            <div key={i} style={{
              borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: "1.25rem", marginTop: "1.25rem",
            }}>
              <div style={{ fontFamily: FF, fontWeight: 700, fontSize: "1.5rem", color: GOLD }}>{st.value}</div>
              <div style={{ fontFamily: FF_SAN, fontSize: "0.75rem", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "0.25rem" }}>{st.label}</div>
            </div>
          ))}
          {site.serviceArea && (
            <div style={{ fontFamily: FF_SAN, fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
              📍 Serving {site.serviceArea}
            </div>
          )}
        </div>

        {/* Text */}
        <div>
          <div style={{ width: "40px", height: "3px", background: GOLD, marginBottom: "1.25rem" }} />
          <h2 style={{ fontFamily: FF, fontWeight: 700, fontSize: "2rem", color: C_HEADING, marginBottom: "1.25rem", lineHeight: 1.2 }}>
            {content.title}
          </h2>
          <p style={{ fontFamily: FF_SAN, fontSize: "0.95rem", color: C_BODY, lineHeight: 1.85, marginBottom: "1.75rem" }}>
            {content.body}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {site.contactEmail && (
              <a href={`mailto:${site.contactEmail}`} style={{ fontFamily: FF_SAN, fontSize: "0.875rem", color: C_HEADING, textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: C_ACCENT }}>✉</span> {site.contactEmail}
              </a>
            )}
            {site.contactPhone && (
              <a href={`tel:${site.contactPhone}`} style={{ fontFamily: FF_SAN, fontSize: "0.875rem", color: C_HEADING, textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: C_ACCENT }}>✆</span> {site.contactPhone}
              </a>
            )}
            <span style={{ fontFamily: FF_SAN, fontSize: "0.875rem", color: C_HEADING, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ color: C_ACCENT }}>📍</span> {site.serviceArea || site.location}
            </span>
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
    <section style={{ background: OFF_W, padding: "6rem 2rem" }}>
      <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{ width: "48px", height: "3px", background: GOLD, margin: "0 auto 1.25rem" }} />
          <h2 style={{ fontFamily: FF, fontWeight: 700, fontSize: "2.25rem", color: C_HEADING }}>
            Client Testimonials
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {content.map((t, i) => (
            <div key={i} style={{
              background: WHITE, border: "1px solid #e0e6ef",
              borderRadius: "4px", padding: "2rem",
              boxShadow: "0 2px 12px rgba(30,58,95,0.06)",
            }}>
              <Stars n={t.rating} />
              <p style={{
                fontFamily: FF, fontStyle: "italic", fontSize: "0.9rem",
                color: C_BODY, lineHeight: 1.8, margin: "0.875rem 0 1.5rem",
              }}>"{t.quote}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "50%",
                  background: NAVY, color: WHITE,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: FF, fontWeight: 700, fontSize: "1rem",
                  flexShrink: 0,
                }}>
                  {t.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontFamily: FF_SAN, fontWeight: 700, fontSize: "0.875rem", color: C_HEADING }}>{t.name}</div>
                  <div style={{ fontFamily: FF_SAN, fontSize: "0.78rem", color: C_BODY }}>{t.role}</div>
                </div>
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
    <section id="contact" style={{
      background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_LT} 100%)`,
      padding: "6rem 2rem", textAlign: "center",
    }}>
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        <div style={{ width: "48px", height: "3px", background: GOLD, margin: "0 auto 1.75rem" }} />
        <h2 style={{
          fontFamily: FF, fontWeight: 700,
          fontSize: "clamp(1.75rem, 4vw, 3rem)",
          color: WHITE, marginBottom: "1rem", lineHeight: 1.2,
        }}>{content.headline}</h2>
        <p style={{ fontFamily: FF_SAN, fontSize: "1rem", color: "rgba(255,255,255,0.72)", marginBottom: "2.5rem", lineHeight: 1.7 }}>
          {content.subtext}
        </p>
        <a href={href} style={{
          background: GOLD, color: C_BTN,
          fontFamily: FF_SAN, fontWeight: 700, fontSize: "0.95rem",
          padding: "14px 36px", borderRadius: "4px", textDecoration: "none",
          display: "inline-block", boxShadow: "0 4px 20px rgba(201,168,76,0.4)",
        }}>{content.buttonText}</a>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer({ site }: { site: SiteRecord }) {
  return (
    <footer id="footer" style={{ background: "#111d2b", borderTop: `3px solid ${GOLD}`, padding: "2.5rem 2rem" }}>
      <div style={{
        maxWidth: "1160px", margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem",
      }}>
        <div>
          <span style={{ fontFamily: FF, fontWeight: 700, fontSize: "1.1rem", color: WHITE }}>{site.businessName}</span>
          <span style={{ fontFamily: FF_SAN, fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", marginLeft: "1rem" }}>
            {site.location}
          </span>
        </div>
        <span style={{ fontFamily: FF_SAN, fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>
          © {new Date().getFullYear()} · Built with{" "}
          <a href="https://baileysystemsai.com" style={{ color: GOLD, textDecoration: "none" }}>BaileySystemsAI</a>
        </span>
      </div>
    </footer>
  );
}

// ── Main Layout ───────────────────────────────────────────────────────────────
export function ClassicLayout({ site, content, heroImageUrl }: TemplateProps) {
  return (
    <div style={{ fontFamily: FF_SAN, background: WHITE, color: TEXT }}>
      <Navbar businessName={site.businessName} ctaText={content.hero.ctaText} />
      <Hero content={content.hero} heroImageUrl={heroImageUrl} location={site.location} />
      <Services content={content.services} location={site.location} />
      <About content={content.about} site={site} />
      <Testimonials content={content.testimonials} />
      <CTA content={content.cta} contactEmail={site.contactEmail} contactPhone={site.contactPhone} />
      <Footer site={site} />
    </div>
  );
}

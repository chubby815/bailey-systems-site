/**
 * Modern Minimal — Apple meets Linear. Obsessive whitespace. Thin and elegant.
 */
import type { SiteRecord } from "@/lib/kv";
import type { StructuredSiteContent } from "@/lib/site-theme";

export type TemplateProps = {
  site:          SiteRecord;
  content:       StructuredSiteContent;
  primaryColor:  string;
  heroImageUrl?: string;
};

const FF      = "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
const FF_MONO = "'SF Mono', 'Fira Mono', 'Consolas', monospace";
const TEXT    = "#111111";
const MUTED   = "#6b7280";
const LINE    = "#e5e7eb";
const OFF_BG  = "#f9fafb";

const C_HEADING = "var(--heading-color, #111111)";
const C_BODY    = "var(--body-color, #6b7280)";
const C_BTN     = "var(--btn-text-color, #ffffff)";

function Stars({ n, color }: { n: number; color: string }) {
  const c = Math.min(5, Math.max(1, Math.round(n)));
  return <span style={{ color, fontSize: "0.8rem", letterSpacing: "1px" }}>{"★".repeat(c)}{"☆".repeat(5 - c)}</span>;
}

// ── Styles ────────────────────────────────────────────────────────────────────
function Styles({ p }: { p: string }) {
  return (
    <style>{`
      .mn-service-row {
        display: flex; align-items: flex-start; gap: 2rem; padding: 1.75rem 0;
        border-bottom: 1px solid ${LINE}; transition: background 0.15s;
        cursor: default;
      }
      .mn-service-row:hover { background: #f9fafb; margin: 0 -2rem; padding-left: 2rem; padding-right: 2rem; }
      .mn-trust-pill {
        background: #f3f4f6; border: 1px solid ${LINE}; border-radius: 100px;
        padding: 8px 20px; white-space: nowrap;
        font-family: ${FF}; font-size: 0.8rem; font-weight: 500; color: ${MUTED};
      }
      .mn-btn {
        background: ${p}; color: ${C_BTN};
        font-family: ${FF}; font-weight: 500; font-size: 0.95rem;
        padding: 13px 32px; border-radius: 10px; text-decoration: none;
        display: inline-block; transition: opacity 0.2s, transform 0.2s;
        border: 1px solid transparent;
      }
      .mn-btn:hover { opacity: 0.88; transform: translateY(-1px); }
      .mn-btn-outline {
        background: transparent; color: ${TEXT};
        font-family: ${FF}; font-weight: 500; font-size: 0.95rem;
        padding: 13px 32px; border-radius: 10px; text-decoration: none;
        display: inline-block; transition: background 0.2s;
        border: 1px solid ${LINE};
      }
      .mn-btn-outline:hover { background: ${OFF_BG}; }
      .mn-testimonial {
        background: #fff; border: 1px solid ${LINE}; border-radius: 16px;
        padding: 1.75rem; transition: box-shadow 0.2s;
        flex: 0 0 300px;
      }
      .mn-testimonial:hover { box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
      @media (max-width: 768px) {
        .mn-hero-actions { flex-direction: column !important; }
        .mn-hero-actions a { width: 100%; text-align: center; }
        .mn-about-grid { flex-direction: column !important; }
        .mn-trust-scroll { flex-direction: column; align-items: flex-start !important; }
        .mn-stats-row { grid-template-columns: repeat(2,1fr) !important; }
        .mn-testimonials-track { flex-direction: column !important; }
        .mn-nav-links { display: none !important; }
      }
    `}</style>
  );
}

// ── Navbar ─────────────────────────────────────────────────────────────────────
function Navbar({ businessName, primaryColor }: { businessName: string; primaryColor: string }) {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px) saturate(180%)",
      borderBottom: `1px solid ${LINE}`, padding: "0 clamp(1rem, 5vw, 3rem)",
    }}>
      <div style={{
        maxWidth: "1100px", margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: "56px",
      }}>
        <span style={{ fontFamily: FF, fontWeight: 600, fontSize: "1rem", color: TEXT, letterSpacing: "-0.02em" }}>
          {businessName}
        </span>
        <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
          <div className="mn-nav-links" style={{ display: "flex", gap: "2rem" }}>
            {["Services", "About", "Contact"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{
                fontFamily: FF, fontSize: "0.875rem", fontWeight: 400,
                color: MUTED, textDecoration: "none",
              }}>{l}</a>
            ))}
          </div>
          <a href="#contact" className="mn-btn" style={{ padding: "8px 20px", fontSize: "0.875rem" }}>
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero({ content, primaryColor, location }: {
  content: StructuredSiteContent["hero"];
  primaryColor: string;
  location: string;
}) {
  return (
    <section id="home" style={{
      background: "#fff", padding: "9rem clamp(1rem, 5vw, 3rem) 7rem",
      textAlign: "center", position: "relative",
    }}>
      {/* Subtle radial */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${primaryColor}08 0%, transparent 70%)`,
      }} />

      <div style={{ position: "relative", maxWidth: "760px", margin: "0 auto" }}>
        {/* Eyebrow label */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          marginBottom: "2rem",
        }}>
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: primaryColor, display: "inline-block" }} />
          <span style={{
            fontFamily: FF_MONO, fontSize: "0.65rem", fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.14em", color: primaryColor,
          }}>Professional Services · {content.badge || location}</span>
        </div>

        <h1 style={{
          fontFamily: FF, fontWeight: 300,
          fontSize: "clamp(2.75rem, 7vw, 6rem)",
          lineHeight: 1.05, letterSpacing: "-0.05em",
          color: C_HEADING, marginBottom: "1.75rem",
        }}>
          {content.headline}
        </h1>

        <p style={{
          fontFamily: FF, fontSize: "clamp(1rem, 2.5vw, 1.1875rem)", fontWeight: 400,
          color: MUTED, lineHeight: 1.75, marginBottom: "3rem",
          maxWidth: "520px", margin: "0 auto 3rem",
        }}>
          {content.subheadline}
        </p>

        <div className="mn-hero-actions" style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="#contact" className="mn-btn">{content.ctaText}</a>
          <a href="#services" className="mn-btn-outline">See Services ↓</a>
        </div>
      </div>
    </section>
  );
}

// ── Trust Strip ────────────────────────────────────────────────────────────────
function TrustStrip({ location }: { location: string }) {
  const companies = [
    `Local Business · ${location}`,
    "5-Star Rated",
    "Fully Insured",
    "Free Estimates",
    "Fast Response",
    "Trusted & Reliable",
  ];
  return (
    <div style={{
      background: OFF_BG, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`,
      padding: "1.25rem clamp(1rem, 5vw, 3rem)", overflowX: "auto",
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <p style={{
          fontFamily: FF_MONO, fontSize: "0.65rem", fontWeight: 600,
          textTransform: "uppercase", letterSpacing: "0.12em", color: "#9ca3af",
          marginBottom: "1rem", textAlign: "center",
        }}>Trusted by local businesses</p>
        <div className="mn-trust-scroll" style={{
          display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap",
        }}>
          {companies.map((c, i) => (
            <span key={i} className="mn-trust-pill">{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Services ───────────────────────────────────────────────────────────────────
function Services({ content, primaryColor, location }: {
  content: StructuredSiteContent["services"];
  primaryColor: string;
  location: string;
}) {
  return (
    <section id="services" style={{ background: "#fff", padding: "6rem clamp(1rem, 5vw, 3rem)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ marginBottom: "3.5rem" }}>
          <span style={{
            fontFamily: FF_MONO, fontSize: "0.65rem", fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.14em",
            color: `var(--accent-color, ${primaryColor})`,
          }}>Services</span>
          <h2 style={{
            fontFamily: FF, fontWeight: 300,
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            letterSpacing: "-0.04em", color: C_HEADING, marginTop: "0.75rem",
          }}>What we offer</h2>
        </div>

        <div style={{ borderTop: `1px solid ${LINE}` }}>
          {content.map((s, i) => (
            <div key={i} className="mn-service-row">
              <span style={{
                fontFamily: FF_MONO, fontSize: "0.75rem", fontWeight: 600,
                color: `var(--accent-color, ${primaryColor})`, flexShrink: 0,
                marginTop: "0.25rem", minWidth: "36px",
              }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div style={{ flex: "0 0 200px" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.375rem" }}>{s.icon || "○"}</div>
                <h3 style={{ fontFamily: FF, fontWeight: 600, fontSize: "1rem", color: C_HEADING }}>
                  {s.name}
                </h3>
              </div>
              <p style={{ fontFamily: FF, fontSize: "0.9rem", color: C_BODY, lineHeight: 1.75, flex: 1 }}>
                {s.description || `Professional ${s.name.toLowerCase()} services in ${location}.`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── About ──────────────────────────────────────────────────────────────────────
function About({ content, site, primaryColor }: {
  content: StructuredSiteContent["about"];
  site: SiteRecord;
  primaryColor: string;
}) {
  return (
    <section id="about" style={{ background: OFF_BG, borderTop: `1px solid ${LINE}`, padding: "7rem clamp(1rem, 5vw, 3rem)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div className="mn-about-grid" style={{ display: "flex", gap: "6rem", alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Left: pull quote */}
          <div style={{ flex: "1 1 300px" }}>
            <span style={{
              fontFamily: FF_MONO, fontSize: "0.65rem", fontWeight: 600,
              textTransform: "uppercase", letterSpacing: "0.14em",
              color: `var(--accent-color, ${primaryColor})`, display: "block", marginBottom: "1.5rem",
            }}>About</span>
            <p style={{
              fontFamily: FF, fontWeight: 300,
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              lineHeight: 1.3, letterSpacing: "-0.03em",
              color: `var(--accent-color, ${primaryColor})`,
            }}>
              "{content.body.slice(0, 100)}{content.body.length > 100 ? "…" : ""}"
            </p>
          </div>

          {/* Right: text + stats */}
          <div style={{ flex: "1 1 360px" }}>
            <h2 style={{
              fontFamily: FF, fontWeight: 500,
              fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
              letterSpacing: "-0.03em", color: C_HEADING,
              marginBottom: "1.25rem",
            }}>{content.title}</h2>
            <p style={{ fontFamily: FF, fontSize: "0.9375rem", color: C_BODY, lineHeight: 1.85, marginBottom: "2.5rem" }}>
              {content.body}
            </p>

            {/* Stats row */}
            <div className="mn-stats-row" style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem",
              borderTop: `1px solid ${LINE}`, paddingTop: "2rem", marginBottom: "2rem",
            }}>
              {content.stats.slice(0, 3).map((st, i) => (
                <div key={i}>
                  <div style={{
                    fontFamily: FF, fontWeight: 600,
                    fontSize: "clamp(1.5rem, 3vw, 2rem)",
                    letterSpacing: "-0.04em", color: `var(--accent-color, ${primaryColor})`,
                  }}>{st.value}</div>
                  <div style={{ fontFamily: FF, fontSize: "0.78rem", color: MUTED, marginTop: "0.25rem" }}>{st.label}</div>
                </div>
              ))}
            </div>

            {site.contactEmail && (
              <p style={{ fontFamily: FF_MONO, fontSize: "0.82rem", color: TEXT }}>✉ {site.contactEmail}</p>
            )}
            {site.contactPhone && (
              <p style={{ fontFamily: FF_MONO, fontSize: "0.82rem", color: TEXT, marginTop: "0.25rem" }}>✆ {site.contactPhone}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ───────────────────────────────────────────────────────────────
function Testimonials({ content, primaryColor }: { content: StructuredSiteContent["testimonials"]; primaryColor: string }) {
  if (!content?.length) return null;
  return (
    <section style={{ background: "#fff", borderTop: `1px solid ${LINE}`, padding: "7rem clamp(1rem, 5vw, 3rem)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ marginBottom: "3.5rem" }}>
          <span style={{
            fontFamily: FF_MONO, fontSize: "0.65rem", fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.14em",
            color: `var(--accent-color, ${primaryColor})`,
          }}>Testimonials</span>
          <h2 style={{
            fontFamily: FF, fontWeight: 300,
            fontSize: "clamp(2rem, 4vw, 3rem)",
            letterSpacing: "-0.04em", color: C_HEADING, marginTop: "0.75rem",
          }}>What clients say</h2>
        </div>
        <div className="mn-testimonials-track" style={{
          display: "flex", gap: "1.25rem", overflowX: "auto",
          paddingBottom: "1rem", scrollbarWidth: "none",
        }}>
          {content.map((t, i) => (
            <div key={i} className="mn-testimonial">
              <Stars n={t.rating} color={primaryColor} />
              <p style={{
                fontFamily: FF, fontSize: "0.9rem", color: C_BODY,
                lineHeight: 1.8, margin: "1rem 0 1.5rem", fontStyle: "italic",
              }}>"{t.quote}"</p>
              <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: "1rem" }}>
                <div style={{ fontFamily: FF, fontWeight: 600, fontSize: "0.825rem", color: TEXT }}>{t.name}</div>
                <div style={{ fontFamily: FF, fontSize: "0.78rem", color: MUTED }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA ────────────────────────────────────────────────────────────────────────
function CTA({ content, primaryColor, contactEmail, contactPhone }: {
  content: StructuredSiteContent["cta"];
  primaryColor: string;
  contactEmail?: string;
  contactPhone?: string;
}) {
  const href = contactPhone ? `tel:${contactPhone}` : contactEmail ? `mailto:${contactEmail}` : "#contact";
  return (
    <section id="contact" style={{
      background: OFF_BG, borderTop: `1px solid ${LINE}`,
      padding: "8rem clamp(1rem, 5vw, 3rem)", textAlign: "center",
    }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <span style={{
          fontFamily: FF_MONO, fontSize: "0.65rem", fontWeight: 600,
          textTransform: "uppercase", letterSpacing: "0.14em",
          color: `var(--accent-color, ${primaryColor})`, display: "block", marginBottom: "1.5rem",
        }}>Get in touch</span>
        <h2 style={{
          fontFamily: FF, fontWeight: 300,
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          letterSpacing: "-0.05em", color: C_HEADING,
          marginBottom: "1.25rem", lineHeight: 1.1,
        }}>{content.headline}</h2>
        <p style={{ fontFamily: FF, fontSize: "1rem", color: MUTED, marginBottom: "2.5rem", lineHeight: 1.75 }}>
          {content.subtext}
        </p>
        <a href={href} className="mn-btn" style={{ fontSize: "1rem", padding: "15px 40px" }}>
          {content.buttonText}
        </a>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────────
function Footer({ site, primaryColor }: { site: SiteRecord; primaryColor: string }) {
  return (
    <footer style={{ background: "#fff", borderTop: `1px solid ${LINE}`, padding: "2rem clamp(1rem, 5vw, 3rem)" }}>
      <div style={{
        maxWidth: "1100px", margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem",
      }}>
        <span style={{ fontFamily: FF, fontWeight: 600, fontSize: "0.9rem", color: TEXT }}>
          {site.businessName}
        </span>
        <span style={{ fontFamily: FF, fontSize: "0.78rem", color: "#bbb" }}>
          © {new Date().getFullYear()} · Built with{" "}
          <a href="https://baileysystemsai.com" style={{ color: primaryColor, textDecoration: "none" }}>BaileySystemsAI</a>
        </span>
      </div>
    </footer>
  );
}

// ── Main Layout ────────────────────────────────────────────────────────────────
export function MinimalLayout({ site, content, primaryColor }: TemplateProps) {
  return (
    <>
      <Styles p={primaryColor} />
      <div style={{ fontFamily: FF, background: "#fff", color: TEXT, overflowX: "hidden" }}>
        <Navbar businessName={site.businessName} primaryColor={primaryColor} />
        <Hero content={content.hero} primaryColor={primaryColor} location={site.location} />
        <TrustStrip location={site.location} />
        <Services content={content.services} primaryColor={primaryColor} location={site.location} />
        <About content={content.about} site={site} primaryColor={primaryColor} />
        <Testimonials content={content.testimonials} primaryColor={primaryColor} />
        <CTA content={content.cta} primaryColor={primaryColor} contactEmail={site.contactEmail} contactPhone={site.contactPhone} />
        <Footer site={site} primaryColor={primaryColor} />
      </div>
    </>
  );
}

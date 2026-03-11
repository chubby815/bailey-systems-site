/**
 * Modern Minimal — Apple meets Linear. Obsessive whitespace. Thin and elegant.
 */
import type { SiteRecord } from "@/lib/kv";
import type { StructuredSiteContent, ThemeConfig } from "@/lib/site-theme";
import { TrustBadges, RatingBadge } from "@/components/site/TrustBadges";
import { ScrollAnimator } from "@/components/site/ScrollAnimator";
import { ContactFormBlock } from "@/components/site/ContactFormBlock";

export type TemplateProps = {
  site:           SiteRecord;
  content:        StructuredSiteContent;
  primaryColor:   string;
  heroImageUrl?:  string;
  aboutImageUrl?: string;
  theme?:         ThemeConfig;
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
function Styles({ p, offBg, bg }: { p: string; offBg: string; bg: string }) {
  return (
    <style>{`
      .mn-service-row {
        display: flex; align-items: flex-start; gap: 2rem; padding: 1.75rem 0;
        border-bottom: 1px solid ${LINE}; transition: background 0.15s;
        cursor: default;
      }
      .mn-service-row:hover { background: ${offBg}; margin: 0 -2rem; padding-left: 2rem; padding-right: 2rem; }
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
        background: ${bg}; border: 1px solid ${LINE}; border-radius: 16px;
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
function Navbar({ businessName, primaryColor, surface }: { businessName: string; primaryColor: string; surface: string }) {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: surface, backdropFilter: "blur(20px) saturate(180%)",
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
function Hero({ content, primaryColor, location, bg, heroImageUrl }: {
  content: StructuredSiteContent["hero"];
  primaryColor: string;
  location: string;
  bg: string;
  heroImageUrl?: string;
}) {
  return (
    <section id="home" style={{
      background: heroImageUrl ? "#111" : bg,
      padding: "9rem clamp(1rem, 5vw, 3rem) 7rem",
      textAlign: "center", position: "relative",
      ...(heroImageUrl ? { backgroundImage: `url(${heroImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : {}),
    }}>
      {/* Dark overlay when hero image present */}
      {heroImageUrl && (
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.55) 100%)",
        }} />
      )}
      {/* Subtle radial (only without image) */}
      {!heroImageUrl && <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `radial-gradient(ellipse 60% 50% at 50% 0%, ${primaryColor}08 0%, transparent 70%)`,
      }} />}

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
        <TrustBadges primaryColor={primaryColor} center mt="2rem" />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <RatingBadge theme="light" mt="0.875rem" />
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
function Services({ content, primaryColor, location, bg }: {
  content: StructuredSiteContent["services"];
  primaryColor: string;
  location: string;
  bg: string;
}) {
  return (
    <section id="services" style={{ background: bg, padding: "6rem clamp(1rem, 5vw, 3rem)" }}>
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

        <ScrollAnimator>
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
        </ScrollAnimator>
      </div>
    </section>
  );
}

// ── About ──────────────────────────────────────────────────────────────────────
function About({ content, site, primaryColor, bg, aboutImageUrl }: {
  content: StructuredSiteContent["about"];
  site: SiteRecord;
  primaryColor: string;
  bg: string;
  aboutImageUrl?: string;
}) {
  return (
    <section id="about" style={{ background: bg, borderTop: `1px solid ${LINE}`, padding: "7rem clamp(1rem, 5vw, 3rem)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div className="mn-about-grid" style={{ display: "flex", gap: "6rem", alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Left: pull quote OR about image */}
          <div style={{ flex: "1 1 300px" }}>
            {aboutImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={aboutImageUrl} alt="About" style={{ width: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "12px", display: "block" }} />
            ) : (
              <>
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
                  &ldquo;{content.body.slice(0, 100)}{content.body.length > 100 ? "…" : ""}&rdquo;
                </p>
              </>
            )}
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
              <a href={`mailto:${site.contactEmail}`} style={{ fontFamily: FF_MONO, fontSize: "0.82rem", color: TEXT, textDecoration: "none", display: "block" }}>✉ {site.contactEmail}</a>
            )}
            {site.contactPhone && (
              <a href={`tel:${site.contactPhone}`} style={{ fontFamily: FF_MONO, fontSize: "0.82rem", color: TEXT, marginTop: "0.25rem", textDecoration: "none", display: "block" }}>✆ {site.contactPhone}</a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ───────────────────────────────────────────────────────────────
function Testimonials({ content, primaryColor, bg }: { content: StructuredSiteContent["testimonials"]; primaryColor: string; bg: string }) {
  if (!content?.length) return null;
  return (
    <section style={{ background: bg, borderTop: `1px solid ${LINE}`, padding: "7rem clamp(1rem, 5vw, 3rem)" }}>
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
        <ScrollAnimator>
        <div className="mn-testimonials-track" style={{
          display: "flex", gap: "1.25rem", overflowX: "auto",
          paddingBottom: "1rem", scrollbarWidth: "none",
        }}>
          {content.map((t, i) => (
            <div key={i} className="mn-testimonial card-hover">
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
        </ScrollAnimator>
      </div>
    </section>
  );
}

// ── CTA ────────────────────────────────────────────────────────────────────────
function CTA({ content, primaryColor, contactEmail, contactPhone, bg, businessName, siteId }: {
  content: StructuredSiteContent["cta"];
  primaryColor: string;
  contactEmail?: string;
  contactPhone?: string;
  bg: string;
  businessName?: string;
  siteId?: string;
}) {
  const href = contactPhone ? `tel:${contactPhone}` : contactEmail ? `mailto:${contactEmail}` : "#contact";
  return (
    <section id="contact" style={{
      background: bg, borderTop: `1px solid ${LINE}`,
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
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <ContactFormBlock
            businessEmail={contactEmail}
            businessName={businessName}
            siteId={siteId}
            fontFamily={FF}
            labelStyle={{ color: "#374151" }}
            inputStyle={{
              background: "#fff",
              border: `1px solid ${LINE}`,
              borderRadius: "8px",
              padding: "12px 14px",
              color: TEXT,
              fontSize: "0.9rem",
              outline: "none",
            }}
            btnStyle={{
              background: `var(--accent-color, ${primaryColor})`,
              color: C_BTN,
              fontFamily: FF,
              fontWeight: 500,
              fontSize: "0.95rem",
              padding: "13px 28px",
              borderRadius: "10px",
              border: "none",
              width: "100%",
            }}
            successColor={primaryColor}
          />
        </div>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────────
function Footer({ site, primaryColor, bg }: { site: SiteRecord; primaryColor: string; bg: string }) {
  return (
    <footer style={{ background: bg, borderTop: `1px solid ${LINE}`, padding: "2rem clamp(1rem, 5vw, 3rem)" }}>
      <div style={{
        maxWidth: "1100px", margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem",
      }}>
        <span style={{ fontFamily: FF, fontWeight: 600, fontSize: "0.9rem", color: TEXT }}>
          {site.businessName}
        </span>
        <span style={{ fontFamily: FF, fontSize: "0.78rem", color: "#bbb" }}>
          © {new Date().getFullYear()} · Built with{" "}
          <a href="https://baileyagents.com" style={{ color: primaryColor, textDecoration: "none" }}>BaileyAgents</a>
        </span>
      </div>
    </footer>
  );
}

// ── Main Layout ────────────────────────────────────────────────────────────────
export function MinimalLayout({ site, content, primaryColor, heroImageUrl, aboutImageUrl, theme }: TemplateProps) {
  const BG      = theme?.background ?? "#ffffff";
  const SURFACE = theme?.surface ?? "rgba(255,255,255,0.92)";
  return (
    <>
      <Styles p={primaryColor} offBg={OFF_BG} bg={BG} />
      <div style={{ fontFamily: FF, background: BG, color: TEXT, overflowX: "hidden" }}>
        <Navbar businessName={site.businessName} primaryColor={primaryColor} surface={SURFACE} />
        <Hero content={content.hero} primaryColor={primaryColor} location={site.location} bg={BG} heroImageUrl={heroImageUrl} />
        <TrustStrip location={site.location} />
        <Services content={content.services} primaryColor={primaryColor} location={site.location} bg={BG} />
        <About content={content.about} site={site} primaryColor={primaryColor} bg={OFF_BG} aboutImageUrl={aboutImageUrl} />
        <Testimonials content={content.testimonials} primaryColor={primaryColor} bg={BG} />
        <CTA content={content.cta} primaryColor={primaryColor} contactEmail={site.contactEmail} contactPhone={site.contactPhone} bg={OFF_BG} businessName={site.businessName} siteId={site.siteId} />
        <Footer site={site} primaryColor={primaryColor} bg={BG} />
      </div>
    </>
  );
}

/**
 * Classic Business — Trusted, professional, converts well.
 * Navy gradient, gold accents, trust badges, traditional layout.
 */
import type { SiteRecord } from "@/lib/kv";
import type { StructuredSiteContent, ThemeConfig } from "@/lib/site-theme";
import { RatingBadge } from "@/components/site/TrustBadges";
import { ScrollAnimator } from "@/components/site/ScrollAnimator";

export type TemplateProps = {
  site:           SiteRecord;
  content:        StructuredSiteContent;
  primaryColor:   string;
  heroImageUrl?:  string;
  aboutImageUrl?: string;
  theme?:         ThemeConfig;
};

const NAVY   = "#1a2744";
const NAVY2  = "#0f1729";
const GOLD   = "#c9a84c";
const GOLD_L = "#e8c86a";
const WHITE  = "#ffffff";
const LIGHT  = "#e8edf5";
const TEXT   = "#1e2d4a";
const MUTED  = "#5a6a7a";
const LINE   = "#d8e2ef";
const FF     = "'Georgia', 'Times New Roman', serif";
const FF_SAN = "'Helvetica Neue', 'Arial', system-ui, sans-serif";

const C_HEADING = "var(--heading-color, #1a2332)";
const C_BODY    = "var(--body-color, #5a6a7a)";
const C_ACCENT  = "var(--accent-color, #c9a84c)";
const C_BTN     = "var(--btn-text-color, #1a2744)";

function Stars({ n }: { n: number }) {
  const c = Math.min(5, Math.max(1, Math.round(n)));
  return <span style={{ color: GOLD, fontSize: "0.9rem" }}>{"★".repeat(c)}{"☆".repeat(5 - c)}</span>;
}

// ── Styles ────────────────────────────────────────────────────────────────────
function Styles() {
  return (
    <style>{`
      .cb-service-card {
        background: #fff; border: 1px solid ${LINE}; border-radius: 8px;
        padding: 2rem 1.5rem; text-align: center;
        transition: transform 0.2s ease, box-shadow 0.2s ease, border-bottom-color 0.2s;
        border-bottom: 3px solid transparent;
        cursor: default;
      }
      .cb-service-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 36px rgba(26,39,68,0.10);
        border-bottom-color: ${GOLD};
      }
      .cb-testimonial {
        background: #fff; border: 1px solid ${LINE};
        border-radius: 10px; padding: 1.75rem;
        flex: 0 0 clamp(280px, 36vw, 360px);
        box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        transition: box-shadow 0.2s;
      }
      .cb-testimonial:hover { box-shadow: 0 8px 28px rgba(26,39,68,0.10); }
      .cb-badge {
        display: inline-flex; align-items: center; gap: 6px;
        background: rgba(201,168,76,0.12); border: 1px solid rgba(201,168,76,0.3);
        border-radius: 4px; padding: 6px 14px;
        font-family: ${FF_SAN}; font-size: 0.72rem; font-weight: 600;
        color: ${GOLD_L}; text-transform: uppercase; letter-spacing: 0.08em;
        white-space: nowrap;
      }
      .cb-btn-gold {
        background: linear-gradient(135deg, ${GOLD}, ${GOLD_L});
        color: ${C_BTN};
        font-family: ${FF_SAN}; font-weight: 700; font-size: 0.95rem;
        padding: 14px 32px; text-decoration: none; display: inline-block;
        border-radius: 6px; text-transform: uppercase; letter-spacing: 0.06em;
        box-shadow: 0 4px 20px rgba(201,168,76,0.35);
        transition: opacity 0.2s, transform 0.15s;
      }
      .cb-btn-gold:hover { opacity: 0.9; transform: translateY(-1px); }
      .cb-btn-outline {
        background: transparent; color: rgba(255,255,255,0.9);
        font-family: ${FF_SAN}; font-weight: 600; font-size: 0.95rem;
        padding: 14px 32px; border: 1.5px solid rgba(255,255,255,0.45);
        text-decoration: none; display: inline-block;
        border-radius: 6px; text-transform: uppercase; letter-spacing: 0.06em;
        transition: border-color 0.2s, background 0.2s;
      }
      .cb-btn-outline:hover { border-color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.06); }
      @media (max-width: 768px) {
        .cb-hero-grid { flex-direction: column !important; }
        .cb-hero-grid > div:last-child { display: none !important; }
        .cb-services-grid { grid-template-columns: 1fr 1fr !important; }
        .cb-about-grid { flex-direction: column !important; }
        .cb-hero-btns { flex-direction: column !important; }
        .cb-hero-btns a { width: 100%; text-align: center; }
        .cb-trust-badges { flex-wrap: wrap !important; }
        .cb-testimonials { flex-direction: column !important; }
        .cb-stats-panel { flex-direction: row !important; flex-wrap: wrap; }
        .cb-nav-links { display: none !important; }
      }
    `}</style>
  );
}

// ── Navbar ─────────────────────────────────────────────────────────────────────
function Navbar({ businessName, ctaText, contactPhone, surface }: { businessName: string; ctaText: string; contactPhone?: string; surface: string }) {
  return (
    <nav style={{
      background: surface,
      padding: "0 clamp(1rem, 5vw, 3rem)",
      boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
      position: "sticky", top: 0, zIndex: 50,
    }}>
      <div style={{
        maxWidth: "1200px", margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px",
      }}>
        <span style={{ fontFamily: FF, fontWeight: 700, fontSize: "1.25rem", color: WHITE, letterSpacing: "-0.02em" }}>
          {businessName}
        </span>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          {contactPhone && (
            <a href={`tel:${contactPhone}`} style={{
              fontFamily: FF_SAN, fontSize: "0.875rem", color: GOLD,
              textDecoration: "none", fontWeight: 600, letterSpacing: "0.02em",
            }}>
              ✆ {contactPhone}
            </a>
          )}
          <div className="cb-nav-links" style={{ display: "flex", gap: "1.75rem" }}>
            {["Services", "About", "Contact"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{
                fontFamily: FF_SAN, fontSize: "0.82rem", fontWeight: 400,
                color: "rgba(255,255,255,0.7)", textDecoration: "none",
                textTransform: "uppercase", letterSpacing: "0.06em",
              }}>{l}</a>
            ))}
          </div>
          <a href="#contact" className="cb-btn-gold" style={{ padding: "10px 22px", fontSize: "0.82rem" }}>
            {ctaText}
          </a>
        </div>
      </div>
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero({ content, heroImageUrl, location }: {
  content: StructuredSiteContent["hero"];
  heroImageUrl?: string;
  location: string;
}) {
  const trustBadges = [
    "✓ Licensed & Insured",
    "✓ Free Estimates",
    "✓ 5-Star Rated",
    "✓ Local & Family Owned",
  ];

  return (
    <section id="home" style={{
      backgroundImage: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 60%, #0a1020 100%)`,
      padding: "6rem clamp(1rem, 5vw, 3rem) 5rem",
      position: "relative", overflow: "hidden",
    }}>
      {/* Subtle texture */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `radial-gradient(ellipse 70% 60% at 80% 50%, rgba(201,168,76,0.08) 0%, transparent 60%),
                     radial-gradient(ellipse 50% 80% at 10% 80%, rgba(255,255,255,0.03) 0%, transparent 60%)`,
      }} />

      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
        <div className="cb-hero-grid" style={{
          display: "flex", gap: "4rem", alignItems: "center",
        }}>
          {/* Left: text */}
          <div style={{ flex: "1 1 480px" }}>
            {/* Trust badges */}
            <div className="cb-trust-badges" style={{ display: "flex", gap: "0.625rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
              {trustBadges.map((b, i) => (
                <span key={i} className="cb-badge">{b}</span>
              ))}
            </div>

            <h1 style={{
              fontFamily: FF, fontWeight: 700,
              fontSize: "clamp(2.5rem, 7vw, 5rem)",
              lineHeight: 1.05, letterSpacing: "-0.03em",
              color: WHITE, marginBottom: "1.25rem",
            }}>
              {content.headline}
            </h1>

            <p style={{
              fontFamily: FF_SAN, fontSize: "clamp(1rem, 2vw, 1.125rem)",
              color: "rgba(255,255,255,0.72)", lineHeight: 1.8,
              marginBottom: "2.5rem", maxWidth: "500px",
            }}>
              {content.subheadline}
            </p>

            <div className="cb-hero-btns" style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
              <a href="#contact" className="cb-btn-gold">{content.ctaText}</a>
              <a href="#services" className="cb-btn-outline">Our Services</a>
            </div>
            <RatingBadge theme="dark" mt="0" />

            <p style={{ fontFamily: FF_SAN, fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "1.25rem" }}>
              Proudly serving {location}
            </p>
          </div>

          {/* Right: circular image with gold ring */}
          <div style={{ flex: "0 0 auto", display: "flex", justifyContent: "center" }}>
            <div style={{
              width: "clamp(200px, 30vw, 380px)", height: "clamp(200px, 30vw, 380px)",
              borderRadius: "50%",
              padding: "6px",
              backgroundImage: `linear-gradient(135deg, ${GOLD}, ${GOLD_L}, ${GOLD})`,
              boxShadow: `0 0 0 1px rgba(201,168,76,0.3), 0 20px 60px rgba(0,0,0,0.4)`,
            }}>
              <div style={{
                width: "100%", height: "100%", borderRadius: "50%",
                overflow: "hidden",
                backgroundImage: heroImageUrl
                  ? `url(${heroImageUrl}) center/cover`
                  : `linear-gradient(160deg, ${NAVY} 0%, #2a4080 100%)`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {!heroImageUrl && (
                  <span style={{ fontSize: "6rem", opacity: 0.15 }}>🏆</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Services (3-col icon grid) ─────────────────────────────────────────────────
function Services({ content, location, bg }: { content: StructuredSiteContent["services"]; location: string; bg: string }) {
  return (
    <section id="services" style={{ background: bg, padding: "6rem clamp(1rem, 5vw, 3rem)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span style={{
            fontFamily: FF_SAN, fontSize: "0.7rem", fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.14em", color: `var(--accent-color, ${GOLD})`,
            display: "block", marginBottom: "0.75rem",
          }}>What We Offer</span>
          <h2 style={{
            fontFamily: FF, fontWeight: 700,
            fontSize: "clamp(1.75rem, 4.5vw, 3rem)",
            letterSpacing: "-0.03em", color: C_HEADING,
          }}>Our Services</h2>
          <div style={{ width: "60px", height: "3px", background: GOLD, margin: "1.25rem auto 0" }} />
        </div>

        <ScrollAnimator>
        <div className="cb-services-grid" style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.25rem",
        }}>
          {content.map((s, i) => (
            <div key={i} className={`cb-service-card card-hover${i === 0 ? " cb-service-featured" : ""}`}>
              <div style={{
                width: "60px", height: "60px", borderRadius: "50%",
                background: `linear-gradient(135deg, ${GOLD}22, ${GOLD}11)`,
                border: `2px solid ${GOLD}44`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1.25rem", fontSize: "1.75rem",
              }}>{s.icon || "◆"}</div>
              <h3 style={{
                fontFamily: FF, fontWeight: 700, fontSize: "1rem",
                color: C_HEADING, marginBottom: "0.625rem",
              }}>{s.name}</h3>
              <p style={{ fontFamily: FF_SAN, fontSize: "0.85rem", color: C_BODY, lineHeight: 1.7 }}>
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
function About({ content, site, aboutImageUrl }: { content: StructuredSiteContent["about"]; site: SiteRecord; aboutImageUrl?: string }) {
  return (
    <section id="about" style={{ background: WHITE, borderTop: `1px solid ${LINE}`, padding: "6rem clamp(1rem, 5vw, 3rem)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* About image — full width above the 2-panel layout */}
        {aboutImageUrl && (
          <div style={{ marginBottom: "3rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={aboutImageUrl} alt="About" style={{ width: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "12px", display: "block", borderBottom: `4px solid ${GOLD}` }} />
          </div>
        )}
        <div className="cb-about-grid" style={{ display: "flex", gap: "0", alignItems: "stretch", flexWrap: "wrap" }}>
          {/* Left: navy panel */}
          <div style={{
            flex: "1 1 340px",
            backgroundImage: `linear-gradient(160deg, ${NAVY} 0%, ${NAVY2} 100%)`,
            padding: "4rem clamp(2rem, 4vw, 3.5rem)",
          }}>
            <span style={{
              fontFamily: FF_SAN, fontSize: "0.7rem", fontWeight: 600,
              textTransform: "uppercase", letterSpacing: "0.12em", color: GOLD,
              display: "block", marginBottom: "1.5rem",
            }}>About Us</span>
            <h2 style={{
              fontFamily: FF, fontWeight: 700,
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              color: WHITE, marginBottom: "1.25rem", letterSpacing: "-0.03em", lineHeight: 1.15,
            }}>{content.title}</h2>

            {/* Stats */}
            <div className="cb-stats-panel" style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "2.5rem" }}>
              {content.stats.map((st, i) => (
                <div key={i} style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
                  <span style={{
                    fontFamily: FF, fontWeight: 700, fontSize: "2.25rem",
                    color: GOLD, letterSpacing: "-0.04em", lineHeight: 1,
                  }}>{st.value}</span>
                  <span style={{ fontFamily: FF_SAN, fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {st.label}
                  </span>
                </div>
              ))}
            </div>

            {site.contactPhone && (
              <a href={`tel:${site.contactPhone}`} style={{
                display: "block", marginTop: "2.5rem",
                fontFamily: FF_SAN, fontWeight: 700, fontSize: "1.1rem", color: GOLD,
                textDecoration: "none", letterSpacing: "-0.01em",
              }}>
                ✆ {site.contactPhone}
              </a>
            )}
          </div>

          {/* Right: white panel */}
          <div style={{
            flex: "1 1 360px", padding: "4rem clamp(2rem, 4vw, 3.5rem)",
            background: "#fff", borderTop: `4px solid ${GOLD}`,
          }}>
            <p style={{
              fontFamily: FF_SAN, fontSize: "0.9375rem", color: C_BODY,
              lineHeight: 1.9, marginBottom: "2rem",
            }}>
              {content.body}
            </p>

            {/* Trust list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {[
                "Licensed & fully insured professionals",
                "Serving the local community for years",
                "100% satisfaction guaranteed",
                "Free estimates on all projects",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                  <span style={{
                    color: GOLD, fontWeight: 700, fontSize: "1rem", flexShrink: 0, marginTop: "0.0625rem",
                  }}>✓</span>
                  <span style={{ fontFamily: FF_SAN, fontSize: "0.875rem", color: C_BODY, lineHeight: 1.5 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {site.contactEmail && (
              <a href={`mailto:${site.contactEmail}`} style={{
                display: "inline-block", marginTop: "2rem",
                fontFamily: FF_SAN, fontSize: "0.875rem", color: NAVY,
                textDecoration: "none", borderBottom: `1px solid ${GOLD}`, paddingBottom: "2px",
              }}>
                {site.contactEmail}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ───────────────────────────────────────────────────────────────
function Testimonials({ content, bg }: { content: StructuredSiteContent["testimonials"]; bg: string }) {
  if (!content?.length) return null;
  return (
    <section style={{ background: bg, borderTop: `1px solid ${LINE}`, padding: "6rem clamp(1rem, 5vw, 3rem)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span style={{
            fontFamily: FF_SAN, fontSize: "0.7rem", fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.14em", color: `var(--accent-color, ${GOLD})`,
            display: "block", marginBottom: "0.75rem",
          }}>Client Testimonials</span>
          <h2 style={{
            fontFamily: FF, fontWeight: 700, fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
            letterSpacing: "-0.03em", color: C_HEADING,
          }}>What Our Clients Say</h2>
          <div style={{ width: "60px", height: "3px", background: GOLD, margin: "1.25rem auto 0" }} />
        </div>
        <ScrollAnimator>
        <div className="cb-testimonials" style={{
          display: "flex", gap: "1.25rem", overflowX: "auto",
          paddingBottom: "1rem", scrollbarWidth: "none",
        }}>
          {content.map((t, i) => (
            <div key={i} className="cb-testimonial card-hover">
              <div style={{ marginBottom: "0.75rem" }}>
                <Stars n={t.rating} />
              </div>
              <p style={{
                fontFamily: FF, fontStyle: "italic", fontSize: "0.9375rem",
                color: C_BODY, lineHeight: 1.8, marginBottom: "1.25rem",
              }}>"{t.quote}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", borderTop: `1px solid ${LINE}`, paddingTop: "1rem" }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "50%", flexShrink: 0,
                  backgroundImage: `linear-gradient(135deg, ${NAVY} 0%, #2a4080 100%)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: WHITE, fontFamily: FF, fontWeight: 700, fontSize: "1rem",
                  boxShadow: `0 0 0 2px ${GOLD}`,
                }}>{t.name.charAt(0)}</div>
                <div>
                  <div style={{ fontFamily: FF_SAN, fontWeight: 700, fontSize: "0.875rem", color: TEXT }}>{t.name}</div>
                  <div style={{ fontFamily: FF_SAN, fontSize: "0.78rem", color: MUTED }}>{t.role}</div>
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

// ── CTA ────────────────────────────────────────────────────────────────────────
function CTA({ content, contactEmail, contactPhone }: {
  content: StructuredSiteContent["cta"];
  contactEmail?: string;
  contactPhone?: string;
}) {
  const href = contactPhone ? `tel:${contactPhone}` : contactEmail ? `mailto:${contactEmail}` : "#contact";
  return (
    <section id="contact" style={{
      backgroundImage: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`,
      padding: "7rem clamp(1rem, 5vw, 3rem)", textAlign: "center",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `radial-gradient(ellipse 60% 80% at 50% 100%, rgba(201,168,76,0.10) 0%, transparent 60%)`,
      }} />
      <div style={{ maxWidth: "680px", margin: "0 auto", position: "relative" }}>
        <h2 style={{
          fontFamily: FF, fontWeight: 700,
          fontSize: "clamp(2rem, 5.5vw, 4rem)",
          letterSpacing: "-0.03em", color: WHITE,
          marginBottom: "1.25rem", lineHeight: 1.1,
        }}>{content.headline}</h2>
        <p style={{ fontFamily: FF_SAN, fontSize: "1rem", color: "rgba(255,255,255,0.65)", marginBottom: "1.5rem", lineHeight: 1.75 }}>
          {content.subtext}
        </p>
        {contactPhone && (
          <p style={{
            fontFamily: FF, fontWeight: 700, fontSize: "clamp(1.25rem, 3vw, 2rem)",
            color: GOLD, marginBottom: "2rem", letterSpacing: "-0.02em",
          }}>✆ {contactPhone}</p>
        )}
        <div style={{ display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href={href} className="cb-btn-gold">{content.buttonText}</a>
          {contactPhone && (
            <a href={`tel:${contactPhone}`} className="cb-btn-outline">Call Now</a>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────────
function Footer({ site }: { site: SiteRecord }) {
  return (
    <footer style={{
      background: NAVY2, borderTop: `3px solid ${GOLD}33`,
      padding: "2.5rem clamp(1rem, 5vw, 3rem)",
    }}>
      <div style={{
        maxWidth: "1200px", margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem",
      }}>
        <span style={{ fontFamily: FF, fontWeight: 700, fontSize: "1rem", color: WHITE }}>
          {site.businessName}
        </span>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
          {site.contactEmail && (
            <a href={`mailto:${site.contactEmail}`} style={{ fontFamily: FF_SAN, fontSize: "0.78rem", color: GOLD, textDecoration: "none" }}>
              {site.contactEmail}
            </a>
          )}
          <span style={{ fontFamily: FF_SAN, fontSize: "0.72rem", color: "#444" }}>
            © {new Date().getFullYear()} · Built with{" "}
            <a href="https://baileyagents.com" style={{ color: GOLD, textDecoration: "none" }}>BaileyAgents</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

// ── Main Layout ────────────────────────────────────────────────────────────────
export function ClassicLayout({ site, content, heroImageUrl, aboutImageUrl, theme }: TemplateProps) {
  const BG      = theme?.background ?? "#f8f9fa";
  const SURFACE = theme?.surface ?? `linear-gradient(90deg, ${NAVY} 0%, ${NAVY2} 100%)`;
  return (
    <>
      <Styles />
      <div style={{ fontFamily: FF_SAN, background: BG, color: TEXT, overflowX: "hidden" }}>
        <Navbar businessName={site.businessName} ctaText={content.hero.ctaText} contactPhone={site.contactPhone} surface={SURFACE} />
        <Hero content={content.hero} heroImageUrl={heroImageUrl} location={site.location} />
        <Services content={content.services} location={site.location} bg={BG} />
        <About content={content.about} site={site} aboutImageUrl={aboutImageUrl} />
        <Testimonials content={content.testimonials} bg={BG} />
        <CTA content={content.cta} contactEmail={site.contactEmail} contactPhone={site.contactPhone} />
        <Footer site={site} />
      </div>
    </>
  );
}

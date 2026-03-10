/**
 * Bold Magazine — Vogue meets Wired. Editorial perfection.
 * Full-bleed hero, bottom-left text, serif x sans, section numbers.
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

const BLACK  = "#1a1a1a";
const MUTED  = "#6b6b6b";
const LINE   = "#e8e5df";
const FF_SER = "Georgia, 'Times New Roman', serif";
const FF_SAN = "'Helvetica Neue', Arial, system-ui, sans-serif";

const C_HEADING = "var(--heading-color, #1a1a1a)";
const C_BODY    = "var(--body-color, #6b6b6b)";
const C_BTN     = "var(--btn-text-color, #ffffff)";

function Stars({ n, color }: { n: number; color: string }) {
  const c = Math.min(5, Math.max(1, Math.round(n)));
  return <span style={{ color, fontSize: "0.9rem" }}>{"★".repeat(c)}{"☆".repeat(5 - c)}</span>;
}

// ── Styles ────────────────────────────────────────────────────────────────────
function Styles({ p }: { p: string }) {
  return (
    <style>{`
      .mg-service-card {
        overflow: hidden; background: #fff; border: 1px solid ${LINE};
        transition: transform 0.25s ease, box-shadow 0.25s ease;
        cursor: default;
      }
      .mg-service-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 16px 40px rgba(0,0,0,0.08);
      }
      .mg-service-img {
        aspect-ratio: 4/3; overflow: hidden; position: relative;
      }
      .mg-service-img-inner {
        width: 100%; height: 100%; object-fit: cover;
        transition: transform 0.5s ease;
      }
      .mg-service-card:hover .mg-service-img-inner { transform: scale(1.04); }
      .mg-btn-filled {
        background: ${p}; color: ${C_BTN};
        font-family: ${FF_SAN}; font-weight: 600; font-size: 0.875rem;
        padding: 12px 28px; text-decoration: none; display: inline-block;
        text-transform: uppercase; letter-spacing: 0.08em;
        transition: opacity 0.2s;
      }
      .mg-btn-filled:hover { opacity: 0.85; }
      .mg-btn-outline {
        background: transparent; color: #fff;
        font-family: ${FF_SAN}; font-weight: 600; font-size: 0.875rem;
        padding: 12px 28px; border: 1.5px solid rgba(255,255,255,0.5);
        text-decoration: none; display: inline-block;
        text-transform: uppercase; letter-spacing: 0.08em;
        transition: border-color 0.2s;
      }
      .mg-btn-outline:hover { border-color: #fff; }
      @media (max-width: 768px) {
        .mg-services-grid { grid-template-columns: 1fr !important; }
        .mg-about-grid { flex-direction: column !important; }
        .mg-hero-btns { flex-direction: column !important; }
        .mg-testimonials { flex-direction: column !important; }
        .mg-nav-links { display: none !important; }
      }
    `}</style>
  );
}

// ── Navbar ─────────────────────────────────────────────────────────────────────
function Navbar({ businessName, primaryColor, surface }: { businessName: string; primaryColor: string; surface: string }) {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: surface, borderBottom: `1px solid ${LINE}`,
      padding: "0 clamp(1rem, 5vw, 3rem)",
    }}>
      <div style={{
        maxWidth: "1280px", margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px",
      }}>
        <span style={{
          fontFamily: FF_SER, fontStyle: "italic", fontWeight: 700,
          fontSize: "1.25rem", color: BLACK, letterSpacing: "-0.02em",
        }}>{businessName}</span>
        <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
          <div className="mg-nav-links" style={{ display: "flex", gap: "2.5rem" }}>
            {["Services", "About", "Contact"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{
                fontFamily: FF_SAN, fontSize: "0.78rem", fontWeight: 400, color: MUTED,
                textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.08em",
              }}>{l}</a>
            ))}
          </div>
          <a href="#contact" style={{
            background: "transparent", color: primaryColor,
            fontFamily: FF_SAN, fontSize: "0.78rem", fontWeight: 600,
            padding: "7px 18px", border: `1.5px solid ${primaryColor}`,
            textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.08em",
          }}>Contact</a>
        </div>
      </div>
    </nav>
  );
}

// ── Hero (Full bleed, bottom-left text) ───────────────────────────────────────
function Hero({ content, heroImageUrl, primaryColor, location, industry }: {
  content: StructuredSiteContent["hero"];
  heroImageUrl?: string;
  primaryColor: string;
  location: string;
  industry: string;
}) {
  const year = new Date().getFullYear();
  return (
    <section id="home" style={{
      position: "relative", minHeight: "95vh",
      display: "flex", alignItems: "flex-end",
      background: "#111",
    }}>
      {/* Background image */}
      {heroImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={heroImageUrl} alt="" style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", opacity: 0.5,
        }} />
      )}
      {/* Gradient overlay — dark bottom, light top */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)",
      }} />
      {/* Side gradient */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 60%)",
      }} />

      <div style={{
        position: "relative", maxWidth: "1280px", margin: "0 auto", width: "100%",
        padding: "0 clamp(1.5rem, 5vw, 4rem) clamp(4rem, 8vh, 6rem)",
      }}>
        {/* Category tag */}
        <div style={{
          display: "inline-block", background: primaryColor,
          fontFamily: FF_SAN, fontWeight: 600, fontSize: "0.7rem",
          textTransform: "uppercase", letterSpacing: "0.14em", color: "#fff",
          padding: "6px 16px", marginBottom: "1.75rem",
        }}>
          Est. {year} · {industry}
        </div>

        <h1 style={{
          fontFamily: FF_SER, fontStyle: "italic", fontWeight: 700,
          fontSize: "clamp(3rem, 8vw, 7rem)",
          lineHeight: 0.92, letterSpacing: "-0.03em",
          color: "#fff", marginBottom: "1.5rem",
          maxWidth: "800px",
        }}>
          {content.headline}
        </h1>

        <p style={{
          fontFamily: FF_SAN, fontSize: "clamp(0.9rem, 2vw, 1.0625rem)",
          color: "rgba(255,255,255,0.7)", maxWidth: "480px", lineHeight: 1.75, marginBottom: "2.5rem",
        }}>
          {content.subheadline}
        </p>

        <div className="mg-hero-btns" style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
          <a href="#contact" className="mg-btn-filled">{content.ctaText}</a>
          <a href="#services" className="mg-btn-outline">Our Services ↓</a>
        </div>
        <TrustBadges primaryColor={primaryColor} mt="1.75rem" />
        <RatingBadge theme="dark" mt="0.75rem" />

        {/* Location badge */}
        <div style={{
          marginTop: "2rem",
          fontFamily: FF_SAN, fontSize: "0.72rem", fontWeight: 600,
          textTransform: "uppercase", letterSpacing: "0.1em",
          color: "rgba(255,255,255,0.45)",
        }}>
          {content.badge || location}
        </div>
      </div>
    </section>
  );
}

// ── Services (editorial card grid with image overlays) ────────────────────────
function Services({ content, primaryColor, location, bg }: {
  content: StructuredSiteContent["services"];
  primaryColor: string;
  location: string;
  bg: string;
}) {
  return (
    <section id="services" style={{ background: bg, padding: "7rem clamp(1rem, 5vw, 3rem)", position: "relative" }}>
      {/* Large section number behind heading */}
      <div style={{
        position: "absolute", top: "4rem", left: "clamp(1rem, 5vw, 3rem)",
        fontFamily: FF_SER, fontWeight: 700, fontSize: "18vw",
        color: "rgba(0,0,0,0.03)", lineHeight: 1, userSelect: "none",
        pointerEvents: "none",
      }}>01</div>

      <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative" }}>
        <div style={{ marginBottom: "4rem" }}>
          <span style={{
            fontFamily: FF_SAN, fontSize: "0.7rem", fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.14em",
            color: `var(--accent-color, ${primaryColor})`,
          }}>Services</span>
          <h2 style={{
            fontFamily: FF_SER, fontStyle: "italic", fontWeight: 700,
            fontSize: "clamp(2rem, 5vw, 3.75rem)", letterSpacing: "-0.03em",
            color: C_HEADING, marginTop: "0.75rem",
          }}>What we offer</h2>
        </div>

        <ScrollAnimator>
        <div className="mg-services-grid" style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem",
        }}>
          {content.map((s, i) => (
            <div key={i} className="mg-service-card card-hover">
              {/* Image / color placeholder */}
              <div className="mg-service-img" style={{
                backgroundImage: `linear-gradient(135deg, ${primaryColor}${i % 2 === 0 ? "cc" : "88"}, ${primaryColor}22)`,
              }}>
                <div style={{
                  width: "100%", height: "100%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: "3.5rem", opacity: 0.8, filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))" }}>
                    {s.icon || "◆"}
                  </span>
                </div>
                {/* Bottom overlay */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
                  height: "60%", pointerEvents: "none",
                }} />
                <div style={{
                  position: "absolute", bottom: "1rem", left: "1rem",
                  fontFamily: FF_SAN, fontSize: "0.68rem", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.1em", color: "#fff",
                }}>
                  {`0${i + 1}`}
                </div>
              </div>
              {/* Text */}
              <div style={{ padding: "1.25rem 1.5rem" }}>
                <h3 style={{
                  fontFamily: FF_SAN, fontWeight: 600, fontSize: "0.975rem",
                  color: C_HEADING, marginBottom: "0.5rem",
                  textTransform: "uppercase", letterSpacing: "0.04em",
                }}>{s.name}</h3>
                <p style={{ fontFamily: FF_SAN, fontSize: "0.85rem", color: C_BODY, lineHeight: 1.7 }}>
                  {s.description || `Professional ${s.name.toLowerCase()} services in ${location}.`}
                </p>
              </div>
            </div>
          ))}
        </div>
        </ScrollAnimator>
      </div>
    </section>
  );
}

// ── About (two-column editorial) ──────────────────────────────────────────────
function About({ content, site, primaryColor, bg, aboutImageUrl }: {
  content: StructuredSiteContent["about"];
  site: SiteRecord;
  primaryColor: string;
  bg: string;
  aboutImageUrl?: string;
}) {
  return (
    <section id="about" style={{ background: bg, borderTop: `1px solid ${LINE}`, padding: "7rem clamp(1rem, 5vw, 3rem)", position: "relative" }}>
      <div style={{
        position: "absolute", top: "4rem", right: "clamp(1rem, 5vw, 3rem)",
        fontFamily: FF_SER, fontWeight: 700, fontSize: "18vw",
        color: "rgba(0,0,0,0.025)", lineHeight: 1, userSelect: "none", pointerEvents: "none",
      }}>02</div>

      <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative" }}>
        <div className="mg-about-grid" style={{ display: "flex", gap: "6rem", alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Left: about image (uploaded) or editorial gradient placeholder */}
          <div style={{ flex: "1 1 300px" }}>
            {aboutImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={aboutImageUrl} alt="About" style={{ width: "100%", maxWidth: "360px", maxHeight: "400px", objectFit: "cover", borderBottom: `4px solid ${primaryColor}`, borderRadius: "4px", display: "block" }} />
            ) : (
              <div style={{
                aspectRatio: "3/4", backgroundImage: `linear-gradient(160deg, ${primaryColor}22, ${primaryColor}08)`,
                borderBottom: `4px solid ${primaryColor}`, position: "relative",
                overflow: "hidden", maxWidth: "360px",
              }}>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "6rem", opacity: 0.12 }}>🏆</span>
                </div>
                <div style={{ position: "absolute", bottom: "1rem", left: "1rem", fontFamily: FF_SAN, fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: primaryColor }}>About Us</div>
              </div>
            )}
          </div>

          {/* Right: heading + body + pull quote + stats */}
          <div style={{ flex: "1 1 380px" }}>
            <span style={{
              fontFamily: FF_SAN, fontSize: "0.7rem", fontWeight: 600,
              textTransform: "uppercase", letterSpacing: "0.14em",
              color: `var(--accent-color, ${primaryColor})`, display: "block", marginBottom: "1rem",
            }}>Our Story</span>
            <h2 style={{
              fontFamily: FF_SER, fontStyle: "italic", fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em",
              color: C_HEADING, marginBottom: "1.5rem", lineHeight: 1.1,
            }}>{content.title}</h2>
            <p style={{ fontFamily: FF_SAN, fontSize: "0.9375rem", color: C_BODY, lineHeight: 1.9, marginBottom: "2rem" }}>
              {content.body}
            </p>
            {/* Pull quote */}
            <div style={{ borderLeft: `3px solid ${primaryColor}`, paddingLeft: "1.25rem", marginBottom: "2rem" }}>
              <p style={{
                fontFamily: FF_SER, fontStyle: "italic",
                fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", color: C_HEADING, lineHeight: 1.5,
              }}>
                "{content.body.slice(0, 90)}{content.body.length > 90 ? "…" : ""}"
              </p>
            </div>
            {/* Stats */}
            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", borderTop: `1px solid ${LINE}`, paddingTop: "1.5rem", marginBottom: "1.5rem" }}>
              {content.stats.map((st, i) => (
                <div key={i}>
                  <div style={{
                    fontFamily: FF_SER, fontStyle: "italic", fontWeight: 700,
                    fontSize: "2rem", color: `var(--accent-color, ${primaryColor})`, letterSpacing: "-0.03em",
                  }}>{st.value}</div>
                  <div style={{ fontFamily: FF_SAN, fontSize: "0.72rem", color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "0.125rem" }}>
                    {st.label}
                  </div>
                </div>
              ))}
            </div>
            {site.contactEmail && (
              <a href={`mailto:${site.contactEmail}`} style={{ fontFamily: FF_SAN, fontSize: "0.85rem", color: primaryColor, textDecoration: "none", display: "block" }}>
                {site.contactEmail}
              </a>
            )}
            {site.contactPhone && (
              <a href={`tel:${site.contactPhone}`} style={{ fontFamily: FF_SAN, fontSize: "0.85rem", color: primaryColor, textDecoration: "none", display: "block", marginTop: "0.25rem" }}>
                {site.contactPhone}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Testimonials (dark section) ────────────────────────────────────────────────
function Testimonials({ content, primaryColor }: {
  content: StructuredSiteContent["testimonials"];
  primaryColor: string;
}) {
  if (!content?.length) return null;
  return (
    <section style={{ background: BLACK, padding: "7rem clamp(1rem, 5vw, 3rem)" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ marginBottom: "4rem" }}>
          <span style={{
            fontFamily: FF_SAN, fontSize: "0.7rem", fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.14em",
            color: `var(--accent-color, ${primaryColor})`,
          }}>Reviews</span>
          <h2 style={{
            fontFamily: FF_SER, fontStyle: "italic", fontWeight: 700,
            fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.03em",
            color: "#fff", marginTop: "0.75rem",
          }}>What our clients say</h2>
        </div>
        <ScrollAnimator>
        <div className="mg-testimonials" style={{
          display: "flex", gap: "1.5rem", overflowX: "auto",
          paddingBottom: "1rem", scrollbarWidth: "none",
        }}>
          {content.map((t, i) => (
            <div key={i} className="card-hover" style={{
              flex: "0 0 clamp(300px, 38vw, 400px)",
              borderTop: `3px solid ${i === 0 ? primaryColor : "#333"}`,
              paddingTop: "1.5rem",
            }}>
              <div style={{
                fontFamily: FF_SER, fontStyle: "italic",
                fontSize: "4rem", color: `var(--accent-color, ${primaryColor})`,
                lineHeight: 0.8, marginBottom: "0.75rem", opacity: 0.7,
              }}>"</div>
              <Stars n={t.rating} color={primaryColor} />
              <p style={{
                fontFamily: FF_SER, fontStyle: "italic", fontSize: "1.0625rem",
                color: "#e5e5e5", lineHeight: 1.8, margin: "1rem 0 1.5rem",
              }}>"{t.quote}"</p>
              <div style={{ fontFamily: FF_SAN, fontWeight: 600, fontSize: "0.8rem", color: "#fff", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {t.name}
              </div>
              <div style={{ fontFamily: FF_SAN, fontSize: "0.75rem", color: "#666", marginTop: "0.125rem" }}>
                {t.role}
              </div>
            </div>
          ))}
        </div>
        </ScrollAnimator>
      </div>
    </section>
  );
}

// ── CTA (full bleed image background) ─────────────────────────────────────────
function CTA({ content, primaryColor, heroImageUrl, contactEmail, contactPhone }: {
  content: StructuredSiteContent["cta"];
  primaryColor: string;
  heroImageUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
}) {
  const href = contactPhone ? `tel:${contactPhone}` : contactEmail ? `mailto:${contactEmail}` : "#contact";
  return (
    <section id="contact" style={{
      position: "relative", padding: "9rem clamp(1rem, 5vw, 3rem)", textAlign: "center",
      background: "#111",
    }}>
      {heroImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={heroImageUrl} alt="" style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", opacity: 0.25,
        }} />
      )}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(0,0,0,0.72)",
      }} />
      <div style={{ position: "relative", maxWidth: "700px", margin: "0 auto" }}>
        <span style={{
          fontFamily: FF_SAN, fontSize: "0.7rem", fontWeight: 600,
          textTransform: "uppercase", letterSpacing: "0.14em",
          color: primaryColor, display: "block", marginBottom: "1.5rem",
        }}>Get In Touch</span>
        <h2 style={{
          fontFamily: FF_SER, fontStyle: "italic", fontWeight: 700,
          fontSize: "clamp(2rem, 6vw, 4.5rem)",
          letterSpacing: "-0.03em", color: "#fff",
          marginBottom: "1.25rem", lineHeight: 1.05,
        }}>{content.headline}</h2>
        <p style={{ fontFamily: FF_SAN, fontSize: "1rem", color: "rgba(255,255,255,0.6)", marginBottom: "2.5rem", lineHeight: 1.75 }}>
          {content.subtext}
        </p>
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <ContactFormBlock
            contactEmail={contactEmail}
            fontFamily={FF_SAN}
            labelStyle={{ color: "rgba(255,255,255,0.7)", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}
            inputStyle={{
              background: "rgba(255,255,255,0.08)",
              border: "1.5px solid rgba(255,255,255,0.3)",
              padding: "12px 14px",
              color: "#fff",
              fontSize: "0.875rem",
              outline: "none",
            }}
            btnStyle={{
              background: "#fff",
              color: "#111",
              fontFamily: FF_SAN,
              fontWeight: 700,
              fontSize: "0.875rem",
              padding: "14px 28px",
              border: "none",
              textTransform: "uppercase" as const,
              letterSpacing: "0.08em",
              width: "100%",
            }}
            successColor="#22c55e"
          />
        </div>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────────
function Footer({ site, primaryColor }: { site: SiteRecord; primaryColor: string }) {
  return (
    <footer style={{ background: "#0d0d0d", borderTop: `1px solid #222`, padding: "2.5rem clamp(1rem, 5vw, 3rem)" }}>
      <div style={{
        maxWidth: "1280px", margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem",
      }}>
        <span style={{ fontFamily: FF_SER, fontStyle: "italic", fontWeight: 700, fontSize: "1.1rem", color: "#888" }}>
          {site.businessName}
        </span>
        <span style={{ fontFamily: FF_SAN, fontSize: "0.72rem", color: "#444", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          © {new Date().getFullYear()} · Built with{" "}
          <a href="https://baileyagents.com" style={{ color: primaryColor, textDecoration: "none" }}>BaileyAgents</a>
        </span>
      </div>
    </footer>
  );
}

// ── Main Layout ────────────────────────────────────────────────────────────────
export function MagazineLayout({ site, content, primaryColor, heroImageUrl, aboutImageUrl, theme }: TemplateProps) {
  const BG      = theme?.background ?? "#fafaf8";
  const SURFACE = theme?.surface ?? "#fafaf8";
  return (
    <>
      <Styles p={primaryColor} />
      <div style={{ fontFamily: FF_SAN, background: BG, color: BLACK, overflowX: "hidden" }}>
        <Navbar businessName={site.businessName} primaryColor={primaryColor} surface={SURFACE} />
        <Hero
          content={content.hero}
          heroImageUrl={heroImageUrl}
          primaryColor={primaryColor}
          location={site.location}
          industry={site.industry}
        />
        <Services content={content.services} primaryColor={primaryColor} location={site.location} bg={BG} />
        <About content={content.about} site={site} primaryColor={primaryColor} bg="#fff" aboutImageUrl={aboutImageUrl} />
        <Testimonials content={content.testimonials} primaryColor={primaryColor} />
        <CTA
          content={content.cta}
          primaryColor={primaryColor}
          heroImageUrl={heroImageUrl}
          contactEmail={site.contactEmail}
          contactPhone={site.contactPhone}
        />
        <Footer site={site} primaryColor={primaryColor} />
      </div>
    </>
  );
}

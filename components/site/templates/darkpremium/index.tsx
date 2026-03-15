/**
 * Dark Premium — Tesla meets Stripe. The flagship template.
 * Deep black, animated glow, bento grid, gradient borders.
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
const BORDER  = "rgba(255,255,255,0.06)";

function hexToRgba(hex: string, alpha: number): string {
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return "rgba(8,8,8,0.85)";
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const C_HEADING = "var(--heading-color, #ffffff)";
const C_BODY    = "var(--body-color, #9ca3af)";
const C_BTN     = "var(--btn-text-color, #000000)";

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;

function Stars({ n, color }: { n: number; color: string }) {
  const c = Math.min(5, Math.max(1, Math.round(n)));
  return <span style={{ color, fontSize: "0.85rem", letterSpacing: "1px" }}>{"★".repeat(c)}{"☆".repeat(5 - c)}</span>;
}

// ── Styles ────────────────────────────────────────────────────────────────────
function Styles({ p, card }: { p: string; card: string }) {
  return (
    <style>{`
      @keyframes dp-glow {
        0%, 100% { opacity: 0.55; }
        50% { opacity: 0.9; }
      }
      @keyframes dp-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(0.85); }
      }
      @keyframes dp-float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
      }
      .dp-card {
        background: linear-gradient(145deg, ${p}22, #0066ff11);
        padding: 1px; border-radius: 20px;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .dp-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 60px ${p}22, 0 0 0 1px ${p}33;
      }
      .dp-card-inner {
        background: ${card}; border-radius: 19px; padding: 2rem; height: 100%;
      }
      .dp-stat-card {
        background: ${card}; border: 1px solid ${BORDER}; border-radius: 16px;
        padding: 1.5rem 1.25rem; text-align: center;
        transition: border-color 0.3s ease;
      }
      .dp-stat-card:hover { border-color: ${p}44; }
      .dp-testimonial {
        background: linear-gradient(145deg, ${p}0d, #0066ff08);
        padding: 1px; border-radius: 20px;
        flex: 0 0 320px;
      }
      .dp-testimonial-inner {
        background: ${card}; border-radius: 19px; padding: 1.75rem; height: 100%;
      }
      @media (max-width: 768px) {
        .dp-hero-btns { flex-direction: column !important; }
        .dp-hero-btns a { width: 100%; text-align: center; }
        .dp-bento { grid-template-columns: 1fr !important; }
        .dp-bento-large { grid-column: span 1 !important; }
        .dp-about-grid { flex-direction: column !important; }
        .dp-stats-row { grid-template-columns: repeat(2,1fr) !important; }
        .dp-nav-links { display: none !important; }
        .dp-testimonials-track { flex-direction: column !important; }
      }
    `}</style>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({ businessName, ctaText, primaryColor, navBackground }: { businessName: string; ctaText: string; primaryColor: string; navBackground: string }) {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: navBackground,
      borderBottom: "1px solid rgba(255,255,255,0.15)",
      padding: "0 clamp(1rem, 5vw, 3rem)",
    }}>
      <div style={{
        maxWidth: "1280px", margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px",
      }}>
        <span style={{ fontFamily: FF, fontWeight: 700, fontSize: "1.1rem", color: "#fff", letterSpacing: "-0.03em" }}>
          {businessName}
        </span>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <div className="dp-nav-links" style={{ display: "flex", gap: "2rem" }}>
            {["Services", "About", "Contact"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{
                fontFamily: FF, fontSize: "0.875rem", color: "#6b7280", textDecoration: "none",
                transition: "color 0.2s",
              }}>{l}</a>
            ))}
          </div>
          <a href="#contact" style={{
            background: primaryColor, color: C_BTN,
            fontFamily: FF, fontWeight: 600, fontSize: "0.875rem",
            padding: "8px 22px", borderRadius: "10px", textDecoration: "none",
            boxShadow: `0 4px 20px ${primaryColor}44`,
          }}>{ctaText}</a>
        </div>
      </div>
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero({ content, primaryColor, location, bg, heroImageUrl, theme, btnRadius }: {
  content: StructuredSiteContent["hero"];
  primaryColor: string;
  location: string;
  bg: string;
  heroImageUrl?: string;
  theme?: ThemeConfig;
  btnRadius?: string;
}) {
  return (
    <section id="home" style={{
      minHeight: "100vh", backgroundColor: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", padding: "2rem clamp(1rem, 5vw, 3rem) 5rem",
      backgroundImage: heroImageUrl ? `url(${heroImageUrl})` : GRAIN,
      backgroundSize: heroImageUrl ? "cover" : undefined,
      backgroundPosition: heroImageUrl ? "center" : undefined,
      backgroundBlendMode: heroImageUrl ? undefined : "overlay",
    }}>
      {/* Dark overlay when hero image is present */}
      {heroImageUrl && (
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.55) 100%)",
        }} />
      )}
      {/* Animated radial glow */}
      <div className="dp-glow" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `radial-gradient(ellipse 80% 60% at 30% 40%, ${primaryColor}20 0%, transparent 60%),
                     radial-gradient(ellipse 60% 80% at 80% 70%, #0066ff15 0%, transparent 60%)`,
        animation: "dp-glow 4s ease-in-out infinite",
      }} />
      {/* Bottom gradient fade */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "200px", pointerEvents: "none",
        backgroundImage: `linear-gradient(to bottom, transparent, ${bg})`,
      }} />

      <div style={{ position: "relative", maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`,
          backdropFilter: "blur(12px)", borderRadius: "100px",
          padding: "7px 18px", marginBottom: "2.5rem",
        }}>
          <span style={{
            width: "7px", height: "7px", borderRadius: "50%",
            background: primaryColor, display: "inline-block",
            animation: "dp-pulse 2s ease-in-out infinite",
            boxShadow: `0 0 0 3px ${primaryColor}33`,
          }} />
          <span style={{ fontFamily: FF, fontSize: "0.72rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {content.badge || location}
          </span>
        </div>

        <h1 style={{
          fontFamily: FF, fontWeight: 700,
          fontSize: "calc(var(--hero-size, clamp(3rem, 8vw, 7rem)) * var(--font-scale, 1))",
          lineHeight: 1.0, letterSpacing: "-0.04em",
          marginBottom: "1.75rem",
          ...(theme?.headingColor
            ? { color: theme.headingColor }
            : {
                backgroundImage: `linear-gradient(135deg, #ffffff 40%, ${primaryColor}cc 100%)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text", color: "transparent",
              }
          ),
        }}>
          {content.headline}
        </h1>

        <p style={{
          fontFamily: FF, fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
          color: "#6b7280", lineHeight: 1.75, marginBottom: "3rem",
          maxWidth: "600px", margin: "0 auto 3rem",
        }}>
          {content.subheadline}
        </p>

        <div className="dp-hero-btns" style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="#contact" style={{
            background: primaryColor, color: C_BTN,
            fontFamily: FF, fontWeight: 700, fontSize: "1rem",
            padding: "14px 36px", borderRadius: btnRadius ?? "12px", textDecoration: "none",
            boxShadow: `0 8px 40px ${primaryColor}44`,
          }}>{content.ctaText}</a>
          <a href="#services" style={{
            background: "rgba(255,255,255,0.04)", color: "#ffffff",
            fontFamily: FF, fontWeight: 600, fontSize: "1rem",
            padding: "14px 36px", borderRadius: btnRadius ?? "12px", textDecoration: "none",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(8px)",
          }}>Explore Services →</a>
        </div>
        <TrustBadges primaryColor={primaryColor} center mt="2rem" />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <RatingBadge theme="dark" mt="0.875rem" />
        </div>
      </div>
    </section>
  );
}

// ── Services (Bento Grid) ─────────────────────────────────────────────────────
function Services({ content, primaryColor, location, bg }: {
  content: StructuredSiteContent["services"];
  primaryColor: string;
  location: string;
  bg: string;
}) {
  return (
    <section id="services" style={{ background: bg, padding: "6rem clamp(1rem, 5vw, 3rem)" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ marginBottom: "3.5rem" }}>
          <p style={{
            fontFamily: FF, fontSize: "0.72rem", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.14em",
            color: primaryColor, marginBottom: "1rem",
          }}>What We Do</p>
          <h2 style={{
            fontFamily: FF, fontWeight: 700,
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            letterSpacing: "-0.04em", color: C_HEADING,
          }}>Services built for results</h2>
        </div>

        <ScrollAnimator>
        <div className="dp-bento" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
        }}>
          {content.slice(0, 5).map((s, i) => (
            <div
              key={i}
              className="dp-card card-hover"
              style={{ gridColumn: i === 0 ? "span 2" : "span 1" }}
            >
              <div className="dp-card-inner" style={{
                minHeight: i === 0 ? "220px" : "180px",
                display: "flex", flexDirection: "column", justifyContent: "space-between",
              }}>
                <div>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "12px",
                    background: `${primaryColor}18`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.4rem", marginBottom: "1.25rem",
                    border: `1px solid ${primaryColor}22`,
                  }}>{s.icon || "◆"}</div>
                  <h3 style={{
                    fontFamily: FF, fontWeight: 600,
                    fontSize: i === 0 ? "1.3rem" : "1rem",
                    color: C_HEADING, marginBottom: "0.625rem",
                  }}>{s.name}</h3>
                  <p style={{ fontFamily: FF, fontSize: "0.875rem", color: C_BODY, lineHeight: 1.7 }}>
                    {s.description || `Professional ${s.name.toLowerCase()} services in ${location}.`}
                  </p>
                </div>
                {i === 0 && (
                  <div style={{
                    marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "6px",
                    fontFamily: FF, fontSize: "0.8rem", fontWeight: 600, color: primaryColor,
                  }}>
                    <span>Learn more</span>
                    <span>→</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {content.slice(5).map((s, i) => (
            <div key={`extra-${i}`} className="dp-card card-hover">
              <div className="dp-card-inner" style={{ minHeight: "180px" }}>
                <div style={{
                  fontSize: "1.4rem", marginBottom: "1rem",
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: `${primaryColor}18`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: `1px solid ${primaryColor}22`,
                }}>{s.icon || "◆"}</div>
                <h3 style={{ fontFamily: FF, fontWeight: 600, fontSize: "1rem", color: C_HEADING, marginBottom: "0.5rem" }}>{s.name}</h3>
                <p style={{ fontFamily: FF, fontSize: "0.875rem", color: C_BODY, lineHeight: 1.7 }}>
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

// ── About ──────────────────────────────────────────────────────────────────────
function About({ content, site, primaryColor, card, aboutImageUrl }: {
  content: StructuredSiteContent["about"];
  site: SiteRecord;
  primaryColor: string;
  card: string;
  aboutImageUrl?: string;
}) {
  const textBlock = (
    <div style={{ flex: "1 1 360px" }}>
      <p style={{
        fontFamily: FF, fontSize: "0.72rem", fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.14em",
        color: `var(--accent-color, ${primaryColor})`, marginBottom: "1.25rem",
      }}>About Us</p>
      <h2 style={{
        fontFamily: FF, fontWeight: 700,
        fontSize: "clamp(1.75rem, 4vw, 3rem)",
        letterSpacing: "-0.04em", color: C_HEADING,
        marginBottom: "1.5rem", lineHeight: 1.15,
      }}>{content.title}</h2>
      <p style={{ fontFamily: FF, fontSize: "1.0625rem", color: C_BODY, lineHeight: 1.85, marginBottom: "2rem" }}>
        {content.body}
      </p>
      {/* Stats inline when image is shown */}
      {aboutImageUrl && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
          {content.stats.slice(0, 4).map((st, i) => (
            <div key={i} className="dp-stat-card">
              <div style={{ fontFamily: FF, fontWeight: 800, fontSize: "clamp(1.5rem, 3vw, 2rem)", letterSpacing: "-0.04em", color: primaryColor, marginBottom: "0.25rem" }}>{st.value}</div>
              <div style={{ fontFamily: FF, fontSize: "0.75rem", color: "#6b7280", fontWeight: 500 }}>{st.label}</div>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        {site.contactEmail && (
          <a href={`mailto:${site.contactEmail}`} style={{ fontFamily: FF, fontSize: "0.9rem", color: "#9ca3af", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <span style={{ color: primaryColor }}>✉</span> {site.contactEmail}
          </a>
        )}
        {site.contactPhone && (
          <a href={`tel:${site.contactPhone}`} style={{ fontFamily: FF, fontSize: "0.9rem", color: "#9ca3af", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <span style={{ color: primaryColor }}>✆</span> {site.contactPhone}
          </a>
        )}
      </div>
    </div>
  );

  return (
    <section id="about" style={{
      backgroundColor: card,
      backgroundImage: `radial-gradient(ellipse 80% 60% at 100% 50%, ${primaryColor}08 0%, transparent 60%)`,
      padding: "7rem clamp(1rem, 5vw, 3rem)",
    }}>
      <div className="dp-about-grid" style={{
        maxWidth: "1280px", margin: "0 auto",
        display: "flex", gap: "5rem", alignItems: "center", flexWrap: "wrap",
      }}>
        {textBlock}

        {/* Right: image if uploaded, else stats grid */}
        {aboutImageUrl ? (
          <div style={{ flex: "1 1 320px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={aboutImageUrl} alt="About" style={{ width: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "12px", display: "block" }} />
          </div>
        ) : (
          <div style={{ flex: "1 1 320px" }}>
            <div className="dp-stats-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {content.stats.slice(0, 4).map((st, i) => (
                <div key={i} className="dp-stat-card">
                  <div style={{ fontFamily: FF, fontWeight: 800, fontSize: "clamp(2rem, 4vw, 2.75rem)", letterSpacing: "-0.04em", color: primaryColor, marginBottom: "0.375rem" }}>{st.value}</div>
                  <div style={{ fontFamily: FF, fontSize: "0.8rem", color: "#6b7280", fontWeight: 500 }}>{st.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Testimonials ───────────────────────────────────────────────────────────────
function Testimonials({ content, primaryColor, bg }: { content: StructuredSiteContent["testimonials"]; primaryColor: string; bg: string }) {
  if (!content?.length) return null;
  return (
    <section style={{ background: bg, padding: "7rem clamp(1rem, 5vw, 3rem)" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ marginBottom: "3.5rem" }}>
          <p style={{
            fontFamily: FF, fontSize: "0.72rem", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.14em",
            color: primaryColor, marginBottom: "1rem",
          }}>Reviews</p>
          <h2 style={{
            fontFamily: FF, fontWeight: 700,
            fontSize: "clamp(2rem, 4vw, 3rem)",
            letterSpacing: "-0.04em", color: C_HEADING,
          }}>Trusted by hundreds</h2>
        </div>
        <ScrollAnimator>
        <div className="dp-testimonials-track" style={{
          display: "flex", gap: "1rem", overflowX: "auto",
          paddingBottom: "1rem", scrollbarWidth: "none",
        }}>
          {content.map((t, i) => (
            <div key={i} className="dp-testimonial card-hover">
              <div className="dp-testimonial-inner">
                <Stars n={t.rating} color={primaryColor} />
                <p style={{
                  fontFamily: FF, fontSize: "0.9375rem",
                  color: C_BODY, lineHeight: 1.8,
                  margin: "1rem 0 1.5rem", fontStyle: "italic",
                }}>"{t.quote}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "50%",
                    backgroundImage: `linear-gradient(135deg, ${primaryColor}, #0066ff)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#000", fontFamily: FF, fontWeight: 700, fontSize: "1rem",
                    flexShrink: 0,
                  }}>{t.name.charAt(0)}</div>
                  <div>
                    <div style={{ fontFamily: FF, fontWeight: 700, fontSize: "0.875rem", color: "#f0f0f0" }}>{t.name}</div>
                    <div style={{ fontFamily: FF, fontSize: "0.78rem", color: "#6b7280" }}>{t.role}</div>
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

// ── Stats row ─────────────────────────────────────────────────────────────────
function StatsRow({ content, site, primaryColor, card }: {
  content: StructuredSiteContent["about"];
  site: SiteRecord;
  primaryColor: string;
  card: string;
}) {
  const stats = [
    { value: site.yearsInBusiness ?? "5+",   label: "Years in Business" },
    { value: content.stats[0]?.value ?? "500+", label: content.stats[0]?.label ?? "Happy Clients" },
    { value: content.stats[1]?.value ?? "1000+", label: content.stats[1]?.label ?? "Projects Done" },
    { value: "5★",  label: "Average Rating" },
  ];
  return (
    <div style={{
      background: card, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`,
      padding: "2.5rem clamp(1rem, 5vw, 3rem)",
    }}>
      <div className="dp-stats-row" style={{
        maxWidth: "1280px", margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem",
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: FF, fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              letterSpacing: "-0.04em", color: primaryColor,
            }}>{s.value}</div>
            <div style={{ fontFamily: FF, fontSize: "0.8rem", color: "#6b7280", marginTop: "0.25rem" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CTA ────────────────────────────────────────────────────────────────────────
function CTA({ content, primaryColor, contactEmail, contactPhone, card, businessName, siteId, btnRadius }: {
  content: StructuredSiteContent["cta"];
  primaryColor: string;
  contactEmail?: string;
  contactPhone?: string;
  card: string;
  businessName?: string;
  siteId?: string;
  btnRadius?: string;
}) {
  const href = contactPhone ? `tel:${contactPhone}` : contactEmail ? `mailto:${contactEmail}` : "#contact";
  return (
    <section id="contact" style={{
      backgroundColor: card, borderTop: `1px solid ${BORDER}`,
      padding: "8rem clamp(1rem, 5vw, 3rem)", textAlign: "center",
      backgroundImage: `radial-gradient(ellipse 80% 80% at 50% 100%, ${primaryColor}14 0%, transparent 60%)`,
    }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <p style={{
          fontFamily: FF, fontSize: "0.72rem", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.14em",
          color: primaryColor, marginBottom: "1.5rem",
        }}>Get Started</p>
        <h2 style={{
          fontFamily: FF, fontWeight: 700,
          fontSize: "clamp(2rem, 6vw, 4.5rem)",
          letterSpacing: "-0.04em", color: C_HEADING,
          marginBottom: "1.25rem", lineHeight: 1.05,
        }}>{content.headline}</h2>
        <p style={{ fontFamily: FF, fontSize: "1.0625rem", color: C_BODY, lineHeight: 1.7, marginBottom: "3rem" }}>
          {content.subtext}
        </p>
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <ContactFormBlock
            businessEmail={contactEmail}
            businessName={businessName}
            siteId={siteId}
            fontFamily={FF}
            labelStyle={{ color: "#9ca3af" }}
            inputStyle={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px",
              padding: "12px 14px",
              color: "#f0f0f0",
              fontSize: "0.9rem",
              outline: "none",
            }}
            btnStyle={{
              backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
              color: C_BTN,
              fontFamily: FF,
              fontWeight: 700,
              fontSize: "1rem",
              padding: "14px 28px",
              borderRadius: btnRadius ?? "12px",
              border: "none",
              width: "100%",
              boxShadow: `0 4px 20px ${primaryColor}44`,
            }}
            successColor={primaryColor}
          />
        </div>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────────
function Footer({ site, primaryColor }: { site: SiteRecord; primaryColor: string }) {
  return (
    <footer style={{
      background: "#050505", borderTop: `1px solid ${BORDER}`,
      padding: "2.5rem clamp(1rem, 5vw, 3rem)",
    }}>
      <div style={{
        maxWidth: "1280px", margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: "1rem",
      }}>
        <span style={{ fontFamily: FF, fontWeight: 700, fontSize: "1rem", color: "#fff" }}>
          {site.businessName}
        </span>
        <span style={{ fontFamily: FF, fontSize: "0.78rem", color: "#4b5563" }}>
          © {new Date().getFullYear()} · {site.location} · Built with{" "}
          <a href="https://baileyagents.com" style={{ color: primaryColor, textDecoration: "none" }}>BaileyAgents</a>
        </span>
      </div>
    </footer>
  );
}

// ── Main Layout ────────────────────────────────────────────────────────────────
export function DarkPremiumLayout({ site, content, primaryColor, heroImageUrl, aboutImageUrl, theme }: TemplateProps) {
  const BG   = theme?.background ?? "#080808";
  const CARD = theme?.surface ?? "#0d0e10";
  const btnRadius =
    theme?.buttonStyle === "sharp" ? "0px" :
    theme?.buttonStyle === "pill"  ? "999px" : "12px";
  return (
    <>
      <Styles p={primaryColor} card={CARD} />
      <div style={{ fontFamily: FF, background: BG, color: "#f0f0f0", overflowX: "clip" }}>
        <Navbar businessName={site.businessName} ctaText={content.hero.ctaText} primaryColor={primaryColor} navBackground={CARD} />
        <Hero content={content.hero} primaryColor={primaryColor} location={site.location} bg={BG} heroImageUrl={heroImageUrl} theme={theme} btnRadius={btnRadius} />
        <StatsRow content={content.about} site={site} primaryColor={primaryColor} card={CARD} />
        <Services content={content.services} primaryColor={primaryColor} location={site.location} bg={BG} />
        <About content={content.about} site={site} primaryColor={primaryColor} card={CARD} aboutImageUrl={aboutImageUrl} />
        <Testimonials content={content.testimonials} primaryColor={primaryColor} bg={BG} />
        <CTA content={content.cta} primaryColor={primaryColor} contactEmail={site.contactEmail} contactPhone={site.contactPhone} card={CARD} businessName={site.businessName} siteId={site.siteId} btnRadius={btnRadius} />
        <Footer site={site} primaryColor={primaryColor} />
      </div>
    </>
  );
}

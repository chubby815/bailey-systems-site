/**
 * Neo Brutalism — Raw power. Poster aesthetic, maximum impact.
 * Cream background, thick black borders, yellow accents, marquee ticker.
 */
import type { SiteRecord } from "@/lib/kv";
import type { StructuredSiteContent } from "@/lib/site-theme";

export type TemplateProps = {
  site:          SiteRecord;
  content:       StructuredSiteContent;
  primaryColor:  string;
  heroImageUrl?: string;
};

const BG      = "#fffef7";
const BLACK   = "#0a0a0a";
const YELLOW  = "#FFE500";
const FF      = "'Helvetica Neue', 'Arial Black', Arial, sans-serif";

const C_HEADING = "var(--heading-color, #0a0a0a)";
const C_BODY    = "var(--body-color, #1a1a1a)";
const C_ACCENT  = "var(--accent-color, #0a0a0a)";
const C_BTN     = "var(--btn-text-color, #FFE500)";

function Stars({ n }: { n: number }) {
  const c = Math.min(5, Math.max(1, Math.round(n)));
  return (
    <span style={{ color: YELLOW, fontSize: "1.1rem", WebkitTextStroke: `1px ${BLACK}` }}>
      {"★".repeat(c)}{"☆".repeat(5 - c)}
    </span>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
function Styles() {
  return (
    <style>{`
      @keyframes nb-marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .nb-ticker-track {
        display: flex; white-space: nowrap;
        animation: nb-marquee 18s linear infinite;
      }
      .nb-card {
        border: 3px solid ${BLACK}; box-shadow: 5px 5px 0 ${BLACK};
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }
      .nb-card:hover {
        transform: translate(-3px, -3px);
        box-shadow: 8px 8px 0 ${BLACK};
      }
      .nb-btn-primary {
        background: ${BLACK}; color: ${C_BTN};
        border: 3px solid ${BLACK}; box-shadow: 5px 5px 0 ${BLACK};
        display: inline-block; text-decoration: none;
        font-family: ${FF}; font-weight: 900; font-size: 1rem;
        padding: 14px 32px; text-transform: uppercase; letter-spacing: 0.06em;
        transition: transform 0.12s, box-shadow 0.12s;
        cursor: pointer;
      }
      .nb-btn-primary:hover { transform: translate(-3px,-3px); box-shadow: 8px 8px 0 ${BLACK}; }
      .nb-btn-outline {
        background: transparent; color: ${BLACK};
        border: 3px solid ${BLACK}; box-shadow: 5px 5px 0 ${BLACK};
        display: inline-block; text-decoration: none;
        font-family: ${FF}; font-weight: 900; font-size: 1rem;
        padding: 14px 32px; text-transform: uppercase; letter-spacing: 0.06em;
        transition: transform 0.12s, box-shadow 0.12s;
      }
      .nb-btn-outline:hover { transform: translate(-3px,-3px); box-shadow: 8px 8px 0 ${BLACK}; }
      .nb-work-card {
        border: 3px solid ${BLACK}; box-shadow: 5px 5px 0 ${BLACK};
        overflow: hidden; transition: transform 0.15s, box-shadow 0.15s;
      }
      .nb-work-card:hover { transform: translate(-3px,-3px); box-shadow: 8px 8px 0 ${BLACK}; }
      @media (max-width: 768px) {
        .nb-hero-grid { grid-template-columns: 1fr !important; }
        .nb-services-grid { grid-template-columns: 1fr !important; }
        .nb-work-grid { grid-template-columns: 1fr !important; }
        .nb-about-grid { grid-template-columns: 1fr !important; }
        .nb-hero-btns { flex-direction: column !important; }
        .nb-hero-btns a, .nb-hero-btns button { width: 100%; text-align: center; }
        .nb-testimonials { flex-direction: column !important; }
        .nb-nav-links { display: none !important; }
      }
    `}</style>
  );
}

// ── Marquee Ticker ─────────────────────────────────────────────────────────────
function Ticker() {
  const items = ["● OPEN FOR BUSINESS", "● AI GENERATED", "● LIVE NOW", "● RESULTS GUARANTEED", "● LOCAL EXPERTS", "● CALL TODAY"];
  const repeated = [...items, ...items];
  return (
    <div style={{
      background: YELLOW, borderBottom: `3px solid ${BLACK}`,
      overflow: "hidden", padding: "10px 0",
    }}>
      <div className="nb-ticker-track">
        {repeated.map((item, i) => (
          <span key={i} style={{
            fontFamily: FF, fontWeight: 900, fontSize: "0.75rem",
            textTransform: "uppercase", letterSpacing: "0.1em",
            color: BLACK, padding: "0 2rem",
          }}>{item}</span>
        ))}
      </div>
    </div>
  );
}

// ── Navbar ─────────────────────────────────────────────────────────────────────
function Navbar({ businessName, ctaText }: { businessName: string; ctaText: string }) {
  return (
    <nav style={{
      background: BLACK, borderBottom: `3px solid ${BLACK}`,
      padding: "0 clamp(1rem, 5vw, 3rem)", position: "sticky", top: 0, zIndex: 50,
    }}>
      <div style={{
        maxWidth: "1280px", margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px",
      }}>
        <span style={{ fontFamily: FF, fontWeight: 900, fontSize: "1.2rem", color: YELLOW, textTransform: "uppercase", letterSpacing: "-0.01em" }}>
          {businessName}
        </span>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <div className="nb-nav-links" style={{ display: "flex", gap: "2rem", marginRight: "1rem" }}>
            {["Services", "Work", "About"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{
                fontFamily: FF, fontWeight: 700, fontSize: "0.8rem", color: "rgba(255,255,255,0.7)",
                textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.04em",
              }}>{l}</a>
            ))}
          </div>
          <a href="#contact" className="nb-btn-primary" style={{ fontSize: "0.8rem", padding: "10px 20px" }}>
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
  return (
    <section id="home" style={{ background: BG, padding: "5rem clamp(1rem, 5vw, 3rem) 4rem", borderBottom: `3px solid ${BLACK}` }}>
      <div className="nb-hero-grid" style={{
        maxWidth: "1280px", margin: "0 auto",
        display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "3rem", alignItems: "center",
      }}>
        {/* Left: text */}
        <div>
          {/* Badge */}
          <div style={{
            display: "inline-block", background: YELLOW,
            border: `3px solid ${BLACK}`, boxShadow: `4px 4px 0 ${BLACK}`,
            padding: "6px 16px", marginBottom: "2rem",
            fontFamily: FF, fontWeight: 900, fontSize: "0.72rem",
            textTransform: "uppercase", letterSpacing: "0.12em", color: BLACK,
          }}>
            ● {content.badge || location}
          </div>

          <h1 style={{
            fontFamily: FF, fontWeight: 900,
            fontSize: "clamp(3.5rem, 10vw, 9rem)",
            lineHeight: 0.92, letterSpacing: "-0.04em",
            color: C_HEADING, marginBottom: "0.5rem",
            textTransform: "uppercase",
          }}>
            {content.headline.split(" ").slice(0, 2).join(" ")}
            <br />
            <span style={{
              display: "inline-block",
              borderBottom: `10px solid ${YELLOW}`,
              paddingBottom: "4px",
            }}>
              {content.headline.split(" ").slice(2).join(" ") || content.headline.split(" ").slice(-1)[0]}
            </span>
          </h1>

          <p style={{
            fontFamily: FF, fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
            color: C_BODY, lineHeight: 1.7,
            marginBottom: "2.5rem", marginTop: "1.5rem", maxWidth: "480px",
          }}>
            {content.subheadline}
          </p>

          <div className="nb-hero-btns" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a href="#contact" className="nb-btn-primary">{content.ctaText}</a>
            <a href="#services" className="nb-btn-outline">Our Work →</a>
          </div>
        </div>

        {/* Right: image box */}
        <div style={{
          border: `3px solid ${BLACK}`, boxShadow: `8px 8px 0 ${BLACK}`,
          overflow: "hidden", background: "#111",
          aspectRatio: "4/3", position: "relative",
        }}>
          {heroImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={heroImageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: `repeating-linear-gradient(45deg, #f0eedf 0, #f0eedf 10px, #e8e6d8 10px, #e8e6d8 20px)` }} />
          )}
          <div style={{
            position: "absolute", bottom: "1rem", left: "1rem",
            background: YELLOW, border: `2px solid ${BLACK}`, boxShadow: `3px 3px 0 ${BLACK}`,
            fontFamily: FF, fontWeight: 900, fontSize: "0.7rem", textTransform: "uppercase",
            letterSpacing: "0.08em", color: BLACK, padding: "6px 14px",
          }}>
            Professional Service
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Services ───────────────────────────────────────────────────────────────────
function Services({ content, location }: { content: StructuredSiteContent["services"]; location: string }) {
  return (
    <section id="services" style={{ background: BG, padding: "6rem clamp(1rem, 5vw, 3rem)", borderBottom: `3px solid ${BLACK}` }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", marginBottom: "3rem" }}>
          <span style={{
            fontFamily: FF, fontWeight: 900, fontSize: "clamp(4rem, 8vw, 7rem)",
            color: YELLOW, lineHeight: 1, WebkitTextStroke: `3px ${BLACK}`,
          }}>01</span>
          <h2 style={{
            fontFamily: FF, fontWeight: 900,
            fontSize: "clamp(2rem, 5vw, 4rem)",
            textTransform: "uppercase", letterSpacing: "-0.03em", color: C_HEADING,
          }}>Services</h2>
        </div>

        <div className="nb-services-grid" style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem",
        }}>
          {content.map((s, i) => (
            <div key={i} className="nb-card" style={{
              background: i % 3 === 1 ? YELLOW : i % 3 === 0 ? BG : "#fff",
              padding: "2rem",
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{s.icon || "◆"}</div>
              <h3 style={{
                fontFamily: FF, fontWeight: 900,
                fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
                textTransform: "uppercase", color: C_HEADING, marginBottom: "0.625rem",
              }}>{s.name}</h3>
              <p style={{ fontFamily: FF, fontSize: "0.9rem", color: C_BODY, lineHeight: 1.65 }}>
                {s.description || `Professional ${s.name.toLowerCase()} services in ${location}.`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Featured Work ──────────────────────────────────────────────────────────────
function FeaturedWork({ heroImageUrl, businessName }: { heroImageUrl?: string; businessName: string }) {
  return (
    <section id="work" style={{ background: BLACK, padding: "6rem clamp(1rem, 5vw, 3rem)", borderBottom: `3px solid ${YELLOW}` }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", marginBottom: "3rem" }}>
          <span style={{
            fontFamily: FF, fontWeight: 900, fontSize: "clamp(4rem, 8vw, 7rem)",
            color: "transparent", lineHeight: 1, WebkitTextStroke: `3px ${YELLOW}`,
          }}>02</span>
          <h2 style={{
            fontFamily: FF, fontWeight: 900,
            fontSize: "clamp(2rem, 5vw, 4rem)",
            textTransform: "uppercase", letterSpacing: "-0.03em", color: "#fff",
          }}>Featured Work</h2>
        </div>

        <div className="nb-work-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "1.25rem" }}>
          <div className="nb-work-card" style={{ border: `3px solid ${YELLOW}`, boxShadow: `5px 5px 0 ${YELLOW}` }}>
            <div style={{
              height: "340px", background: heroImageUrl
                ? `url(${heroImageUrl}) center/cover`
                : `repeating-linear-gradient(-45deg, #1a1a1a 0, #1a1a1a 10px, #222 10px, #222 20px)`,
              position: "relative",
            }}>
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }} />
              <div style={{
                position: "absolute", bottom: "1.25rem", left: "1.25rem",
                background: YELLOW, border: `2px solid ${YELLOW}`,
                fontFamily: FF, fontWeight: 900, fontSize: "0.7rem",
                textTransform: "uppercase", letterSpacing: "0.08em", color: BLACK, padding: "6px 14px",
              }}>Featured Project</div>
            </div>
            <div style={{ background: "#111", padding: "1.5rem" }}>
              <h3 style={{ fontFamily: FF, fontWeight: 900, fontSize: "1.15rem", textTransform: "uppercase", color: "#fff", marginBottom: "0.5rem" }}>
                {businessName} — Our Best Work
              </h3>
              <p style={{ fontFamily: FF, fontSize: "0.85rem", color: "#888", lineHeight: 1.6 }}>
                Delivering results that speak for themselves. Quality craftsmanship every time.
              </p>
            </div>
          </div>

          <div className="nb-work-card" style={{ border: `3px solid ${YELLOW}`, boxShadow: `5px 5px 0 ${YELLOW}` }}>
            <div style={{
              height: "200px",
              background: `repeating-linear-gradient(45deg, #1a1a1a 0, #1a1a1a 10px, #222 10px, #222 20px)`,
              position: "relative",
            }}>
              <div style={{
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                fontFamily: FF, fontWeight: 900, fontSize: "3rem", color: YELLOW, opacity: 0.2,
              }}>★</div>
            </div>
            <div style={{ background: "#111", padding: "1.25rem" }}>
              <h3 style={{ fontFamily: FF, fontWeight: 900, fontSize: "1rem", textTransform: "uppercase", color: "#fff", marginBottom: "0.375rem" }}>
                5-Star Service
              </h3>
              <p style={{ fontFamily: FF, fontSize: "0.8rem", color: "#888", lineHeight: 1.6 }}>Trusted by hundreds of happy customers.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── About ──────────────────────────────────────────────────────────────────────
function About({ content, site }: { content: StructuredSiteContent["about"]; site: SiteRecord }) {
  return (
    <section id="about" style={{ background: BG, padding: "6rem clamp(1rem, 5vw, 3rem)", borderBottom: `3px solid ${BLACK}` }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", marginBottom: "3rem" }}>
          <span style={{
            fontFamily: FF, fontWeight: 900, fontSize: "clamp(4rem, 8vw, 7rem)",
            color: "transparent", lineHeight: 1, WebkitTextStroke: `3px ${BLACK}`,
          }}>03</span>
          <h2 style={{
            fontFamily: FF, fontWeight: 900,
            fontSize: "clamp(2rem, 5vw, 4rem)",
            textTransform: "uppercase", letterSpacing: "-0.03em", color: C_HEADING,
          }}>About</h2>
        </div>
        <div className="nb-about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
          <div>
            <h3 style={{
              fontFamily: FF, fontWeight: 900,
              fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
              textTransform: "uppercase", color: C_HEADING, marginBottom: "1.25rem", lineHeight: 1.05,
            }}>{content.title}</h3>
            <p style={{ fontFamily: FF, fontSize: "1rem", color: C_BODY, lineHeight: 1.85, marginBottom: "1.5rem" }}>
              {content.body}
            </p>
            {site.contactEmail && (
              <p style={{ fontFamily: FF, fontSize: "0.875rem", color: C_ACCENT, fontWeight: 700, textTransform: "uppercase" }}>
                ✉ {site.contactEmail}
              </p>
            )}
            {site.contactPhone && (
              <p style={{ fontFamily: FF, fontSize: "0.875rem", color: C_ACCENT, fontWeight: 700, textTransform: "uppercase", marginTop: "0.375rem" }}>
                ✆ {site.contactPhone}
              </p>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {content.stats.map((st, i) => (
              <div key={i} className="nb-card" style={{
                background: i === 0 ? BLACK : i === 1 ? YELLOW : BG,
                padding: "1.25rem 1.5rem",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{
                  fontFamily: FF, fontWeight: 900,
                  fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                  letterSpacing: "-0.04em",
                  color: i === 0 ? YELLOW : BLACK,
                }}>{st.value}</span>
                <span style={{
                  fontFamily: FF, fontWeight: 700, fontSize: "0.75rem",
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

// ── Testimonials ───────────────────────────────────────────────────────────────
function Testimonials({ content }: { content: StructuredSiteContent["testimonials"] }) {
  if (!content?.length) return null;
  return (
    <section style={{ background: BLACK, borderBottom: `3px solid ${YELLOW}`, padding: "6rem clamp(1rem, 5vw, 3rem)" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", marginBottom: "3rem" }}>
          <span style={{
            fontFamily: FF, fontWeight: 900, fontSize: "clamp(4rem, 8vw, 7rem)",
            color: YELLOW, lineHeight: 1,
          }}>04</span>
          <h2 style={{
            fontFamily: FF, fontWeight: 900,
            fontSize: "clamp(2rem, 5vw, 4rem)",
            textTransform: "uppercase", letterSpacing: "-0.03em", color: "#fff",
          }}>What They Say</h2>
        </div>
        <div className="nb-testimonials" style={{ display: "flex", gap: "1.25rem", overflowX: "auto", paddingBottom: "1rem" }}>
          {content.map((t, i) => (
            <div key={i} style={{
              flex: "0 0 clamp(280px, 35vw, 360px)",
              background: i % 2 === 0 ? BG : YELLOW,
              border: `3px solid ${i % 2 === 0 ? YELLOW : BLACK}`,
              boxShadow: `5px 5px 0 ${i % 2 === 0 ? YELLOW : BLACK}`,
              padding: "2rem",
            }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "5rem", color: BLACK, lineHeight: 0.8, marginBottom: "0.5rem", opacity: 0.15 }}>
                "
              </div>
              <Stars n={t.rating} />
              <p style={{
                fontFamily: FF, fontSize: "0.9375rem", color: BLACK,
                lineHeight: 1.7, margin: "1rem 0 1.5rem", fontWeight: 600,
              }}>"{t.quote}"</p>
              <div style={{ fontFamily: FF, fontWeight: 900, fontSize: "0.875rem", color: BLACK, textTransform: "uppercase" }}>
                — {t.name}
              </div>
              <div style={{ fontFamily: FF, fontSize: "0.75rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {t.role}
              </div>
            </div>
          ))}
        </div>
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
      background: YELLOW, borderBottom: `3px solid ${BLACK}`,
      padding: "6rem clamp(1rem, 5vw, 3rem)", textAlign: "center",
    }}>
      <div style={{ maxWidth: "780px", margin: "0 auto" }}>
        <span style={{
          fontFamily: FF, fontWeight: 900,
          fontSize: "clamp(4rem, 8vw, 7rem)",
          color: "transparent", WebkitTextStroke: `3px ${BLACK}`,
          display: "block", lineHeight: 1, marginBottom: "0.5rem",
        }}>05</span>
        <h2 style={{
          fontFamily: FF, fontWeight: 900,
          fontSize: "clamp(2rem, 6vw, 5rem)",
          textTransform: "uppercase", letterSpacing: "-0.04em",
          color: C_HEADING, marginBottom: "1rem", lineHeight: 0.95,
        }}>{content.headline}</h2>
        <p style={{ fontFamily: FF, fontSize: "1.05rem", color: C_BODY, marginBottom: "2.5rem", lineHeight: 1.7 }}>
          {content.subtext}
        </p>
        <a href={href} className="nb-btn-primary" style={{ fontSize: "1rem", padding: "16px 40px" }}>
          {content.buttonText}
        </a>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────────
function Footer({ site }: { site: SiteRecord }) {
  return (
    <footer style={{ background: BLACK, padding: "2.5rem clamp(1rem, 5vw, 3rem)" }}>
      <div style={{
        maxWidth: "1280px", margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem",
      }}>
        <span style={{ fontFamily: FF, fontWeight: 900, fontSize: "1.1rem", color: YELLOW, textTransform: "uppercase" }}>
          {site.businessName}
        </span>
        <span style={{ fontFamily: FF, fontSize: "0.75rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          © {new Date().getFullYear()} · Built with{" "}
          <a href="https://baileyagents.com" style={{ color: YELLOW, textDecoration: "none" }}>BaileyAgents</a>
        </span>
      </div>
    </footer>
  );
}

// ── Main Layout ────────────────────────────────────────────────────────────────
export function NeoBrutalismLayout({ site, content, heroImageUrl }: TemplateProps) {
  return (
    <>
      <Styles />
      <div style={{ fontFamily: FF, background: BG, overflowX: "hidden" }}>
        <Ticker />
        <Navbar businessName={site.businessName} ctaText={content.hero.ctaText} />
        <Hero content={content.hero} heroImageUrl={heroImageUrl} location={site.location} />
        <Services content={content.services} location={site.location} />
        <FeaturedWork heroImageUrl={heroImageUrl} businessName={site.businessName} />
        <About content={content.about} site={site} />
        <Testimonials content={content.testimonials} />
        <CTA content={content.cta} contactEmail={site.contactEmail} contactPhone={site.contactPhone} />
        <Footer site={site} />
      </div>
    </>
  );
}

/**
 * Neo Brutalism — Raw power. Poster aesthetic, maximum impact.
 * Cream background, thick black borders, accent color, marquee ticker.
 */
import type { SiteRecord } from "@/lib/kv";
import type { StructuredSiteContent, ThemeConfig } from "@/lib/site-theme";
import { ScrollAnimator } from "@/components/site/ScrollAnimator";
import { ContactFormBlock } from "@/components/site/ContactFormBlock";

export type TemplateProps = {
  site:           SiteRecord;
  content:        StructuredSiteContent;
  primaryColor:   string;
  heroImageUrl?:  string;
  aboutImageUrl?: string;
  theme?:         ThemeConfig;
  isEditing?:     boolean;
};

const BLACK   = "#0a0a0a";
const FF      = "'Helvetica Neue', 'Arial Black', Arial, sans-serif";

const C_HEADING = "var(--heading-color, #0a0a0a)";
const C_BODY    = "var(--body-color, #1a1a1a)";
const C_ACCENT  = "var(--accent-color, #0a0a0a)";

// CSS variable references — actual value injected on wrapper div
const P  = "var(--nb-primary, #FFE500)";
const BC = "var(--nb-body-color, rgba(255,255,255,0.7))";

function Stars({ n }: { n: number }) {
  const c = Math.min(5, Math.max(1, Math.round(n)));
  return (
    <span style={{ color: P, fontSize: "1.1rem", WebkitTextStroke: `1px ${BLACK}` }}>
      {"★".repeat(c)}{"☆".repeat(5 - c)}
    </span>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
function Styles({ primary }: { primary: string }) {
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
        background: ${BLACK}; color: ${primary};
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
      /* Image zoom on Featured Work hover */
      .nb-work-card .nb-work-img { transition: transform 0.45s ease; }
      .nb-work-card:hover .nb-work-img { transform: scale(1.06); }
      /* Active/click 3D push feedback */
      .nb-card:active { transform: translate(2px, 2px) !important; box-shadow: 2px 2px 0 ${BLACK} !important; }
      /* Page fade-in */
      @keyframes nb-page-in {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      .nb-root { animation: nb-page-in 0.35s ease-out forwards; }
      /* Diagonal grain on hero */
      @keyframes nb-diag-move {
        0%   { background-position: 0 0; }
        100% { background-position: 60px 60px; }
      }
      .nb-hero-grain {
        position: absolute; inset: 0; pointer-events: none; opacity: 0.035;
        background-image: repeating-linear-gradient(
          45deg,
          #000 0px, #000 1px,
          transparent 1px, transparent 12px
        );
        animation: nb-diag-move 4s linear infinite;
      }
      /* Reduced-motion */
      @media (prefers-reduced-motion: reduce) {
        .nb-root, .nb-hero-grain { animation: none !important; }
        .nb-work-card .nb-work-img { transition: none !important; }
      }
      @media (max-width: 768px) {
        .nb-hero-flex { flex-direction: column !important; }
        .nb-hero-flex > div:last-child { height: 300px !important; flex: none !important; width: 100% !important; }
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
      background: P, borderBottom: `3px solid ${BLACK}`,
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
function Navbar({ businessName, ctaText, surface, navLinks, isEditing }: { businessName: string; ctaText: string; surface: string; navLinks?: [string, string, string]; isEditing?: boolean }) {
  return (
    <nav style={{
      background: surface,
      borderBottom: `3px solid ${BLACK}`,
      boxShadow: isEditing ? "0 2px 8px rgba(0,0,0,0.4)" : undefined,
      outline: isEditing ? "2px dashed rgba(255,255,255,0.3)" : undefined,
      padding: "0 clamp(1rem, 5vw, 3rem)", position: "sticky", top: 0, zIndex: 50,
    }}>
      <div style={{
        maxWidth: "1280px", margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px",
      }}>
        <span style={{ fontFamily: FF, fontWeight: 900, fontSize: "1.2rem", color: P, textTransform: "uppercase", letterSpacing: "-0.01em" }}>
          {businessName}
        </span>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <div className="nb-nav-links" style={{ display: "flex", gap: "2rem", marginRight: "1rem" }}>
            {(navLinks ?? ["Services", "Work", "About"]).map((l, i) => (
              <a key={i} href={["#services", "#about", "#contact"][i]} style={{
                fontFamily: FF, fontWeight: 700, fontSize: "0.8rem", color: BC,
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
function Hero({ content, heroImageUrl, location, bg, btnRadius }: {
  content: StructuredSiteContent["hero"];
  heroImageUrl?: string;
  location: string;
  bg: string;
  btnRadius?: string;
}) {
  return (
    <section id="home" style={{ background: bg, borderBottom: `3px solid ${BLACK}`, position: "relative", overflow: "hidden" }}>
      {/* Animated diagonal grain overlay */}
      <div className="nb-hero-grain" />
      {/* Flex split layout: 55% text / 45% image */}
      <div
        className="nb-hero-flex"
        style={{
          display: "flex",
          flexDirection: "row",
          minHeight: "90vh",
        }}
      >
        {/* Left side — text */}
        <div style={{
          flex: "0 0 55%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px clamp(1.5rem, 5vw, 60px)",
        }}>
          {/* Badge */}
          <div style={{
            display: "inline-block", background: P,
            border: `3px solid ${BLACK}`, boxShadow: `4px 4px 0 ${BLACK}`,
            padding: "6px 16px", marginBottom: "2rem",
            fontFamily: FF, fontWeight: 900, fontSize: "0.72rem",
            textTransform: "uppercase", letterSpacing: "0.12em", color: BLACK,
            alignSelf: "flex-start",
          }}>
            ● {content.badge || location}
          </div>

          <h1 style={{
            fontFamily: FF, fontWeight: 900,
            fontSize: `calc(var(--hero-size, clamp(3.5rem, 8vw, 7rem)) * var(--font-scale, 1))`,
            lineHeight: 0.92, letterSpacing: "-0.04em",
            color: C_HEADING, marginBottom: "0.5rem",
            textTransform: "uppercase",
          }}>
            {content.headline.split(" ").slice(0, 2).join(" ")}
            <br />
            <span style={{
              display: "inline-block",
              borderBottom: `10px solid ${P}`,
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
            <a href="#contact" className="nb-btn-primary" style={{ borderRadius: btnRadius ?? "0px" }}>{content.ctaText}</a>
            <a href="#services" className="nb-btn-outline" style={{ borderRadius: btnRadius ?? "0px" }}>Our Work →</a>
          </div>
          {/* Trust badges */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1.75rem" }}>
            {["✓ No Fluff", "✓ Real Results", "✓ Locally Owned", "✓ 5-Star Service"].map((b, i) => (
              <span key={i} style={{
                display: "inline-block",
                background: i % 2 === 0 ? P : bg,
                border: `2px solid ${BLACK}`,
                boxShadow: `2px 2px 0 ${BLACK}`,
                padding: "3px 12px",
                fontFamily: FF, fontWeight: 900, fontSize: "0.65rem",
                textTransform: "uppercase", letterSpacing: "0.08em", color: BLACK,
              }}>{b}</span>
            ))}
          </div>
          {/* Rating badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            marginTop: "1rem",
            background: BLACK,
            border: `2px solid ${P}`,
            padding: "5px 14px",
            fontFamily: FF, fontWeight: 700, fontSize: "0.75rem", color: P,
            alignSelf: "flex-start",
          }}>
            ⭐ 5.0 · 200+ Reviews · Google
          </div>
        </div>

        {/* Right side — hero image */}
        <div style={{
          flex: "0 0 45%",
          minWidth: "0",
          position: "relative",
          overflow: "hidden",
          background: "#111",
          minHeight: "500px",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImageUrl ?? "https://picsum.photos/seed/neo-hero/800/500"}
            alt="Hero"
            style={{
              position: "absolute",
              top: 0, left: 0,
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center",
            }}
          />
          <div style={{
            position: "absolute", bottom: "1rem", left: "1rem",
            background: P, border: `2px solid ${BLACK}`, boxShadow: `3px 3px 0 ${BLACK}`,
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
function Services({ content, location, bg }: { content: StructuredSiteContent["services"]; location: string; bg: string }) {
  return (
    <section id="services" style={{ background: bg, padding: "6rem clamp(1rem, 5vw, 3rem)", borderBottom: `3px solid ${BLACK}` }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <ScrollAnimator style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", marginBottom: "3rem" }}>
          <span style={{
            fontFamily: FF, fontWeight: 900, fontSize: "clamp(4rem, 8vw, 7rem)",
            color: P, lineHeight: 1, WebkitTextStroke: `3px ${BLACK}`,
          }}>01</span>
          <h2 style={{
            fontFamily: FF, fontWeight: 900,
            fontSize: `calc(var(--h2-size, clamp(2rem, 5vw, 4rem)) * var(--font-scale, 1))`,
            textTransform: "uppercase", letterSpacing: "-0.03em", color: C_HEADING,
          }}>Services</h2>
        </ScrollAnimator>

        <ScrollAnimator>
        <div className="nb-services-grid" style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem",
        }}>
          {content.map((s, i) => (
            <div key={i} className="nb-card" style={{
              background: i % 3 === 1 ? P : i % 3 === 0 ? bg : "#fff",
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
              <div style={{
                marginTop: "1.25rem",
                fontFamily: FF, fontWeight: 900, fontSize: "0.72rem",
                textTransform: "uppercase", letterSpacing: "0.08em",
                color: C_HEADING, display: "flex", alignItems: "center", gap: "4px",
              }}>Learn More →</div>
            </div>
          ))}
        </div>
        </ScrollAnimator>
      </div>
    </section>
  );
}

// ── Featured Work ──────────────────────────────────────────────────────────────
function FeaturedWork({ heroImageUrl, businessName, surface }: { heroImageUrl?: string; businessName: string; surface: string }) {
  return (
    <section id="work" style={{ background: surface, padding: "6rem clamp(1rem, 5vw, 3rem)", borderBottom: `3px solid ${P}` }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <ScrollAnimator style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", marginBottom: "3rem" }}>
          <span style={{
            fontFamily: FF, fontWeight: 900, fontSize: "clamp(4rem, 8vw, 7rem)",
            color: "transparent", lineHeight: 1, WebkitTextStroke: `3px ${P}`,
          }}>02</span>
          <h2 style={{
            fontFamily: FF, fontWeight: 900,
            fontSize: `calc(var(--h2-size, clamp(2rem, 5vw, 4rem)) * var(--font-scale, 1))`,
            textTransform: "uppercase", letterSpacing: "-0.03em", color: "#fff",
          }}>Featured Work</h2>
        </ScrollAnimator>

        <div className="nb-work-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {/* Card 1 */}
          <div className="nb-work-card" style={{ border: `3px solid ${P}`, boxShadow: `5px 5px 0 ${P}` }}>
            <div style={{ height: "220px", overflow: "hidden", position: "relative" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImageUrl ?? "https://picsum.photos/seed/work1/600/400"}
                alt="Featured work"
                className="nb-work-img"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              <div style={{
                position: "absolute", bottom: "0.75rem", left: "0.75rem",
                background: P, border: `2px solid ${BLACK}`,
                fontFamily: FF, fontWeight: 900, fontSize: "0.65rem",
                textTransform: "uppercase", letterSpacing: "0.08em", color: BLACK, padding: "4px 10px",
              }}>Featured Project</div>
            </div>
            <div style={{ background: surface, padding: "1.25rem" }}>
              <h3 style={{ fontFamily: FF, fontWeight: 900, fontSize: "1.05rem", textTransform: "uppercase", color: "#fff", marginBottom: "0.375rem" }}>
                {businessName} — Best Work
              </h3>
              <p style={{ fontFamily: FF, fontSize: "0.8rem", color: "#888", lineHeight: 1.6 }}>
                Delivering results that speak for themselves. Quality every time.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="nb-work-card" style={{ border: `3px solid ${P}`, boxShadow: `5px 5px 0 ${P}` }}>
            <div style={{ height: "220px", overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://picsum.photos/seed/work2/600/400"
                alt="Work sample"
                className="nb-work-img"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
            <div style={{ background: surface, padding: "1.25rem" }}>
              <h3 style={{ fontFamily: FF, fontWeight: 900, fontSize: "1.05rem", textTransform: "uppercase", color: "#fff", marginBottom: "0.375rem" }}>
                5-Star Service
              </h3>
              <p style={{ fontFamily: FF, fontSize: "0.8rem", color: "#888", lineHeight: 1.6 }}>Trusted by hundreds of happy customers.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="nb-work-card" style={{ border: `3px solid ${P}`, boxShadow: `5px 5px 0 ${P}` }}>
            <div style={{ height: "220px", overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://picsum.photos/seed/work3/600/400"
                alt="Work sample"
                className="nb-work-img"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
            <div style={{ background: surface, padding: "1.25rem" }}>
              <h3 style={{ fontFamily: FF, fontWeight: 900, fontSize: "1.05rem", textTransform: "uppercase", color: "#fff", marginBottom: "0.375rem" }}>
                Expert Craftsmanship
              </h3>
              <p style={{ fontFamily: FF, fontSize: "0.8rem", color: "#888", lineHeight: 1.6 }}>Every project handled with precision and care.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── About ──────────────────────────────────────────────────────────────────────
function About({ content, site, bg, aboutImageUrl }: { content: StructuredSiteContent["about"]; site: SiteRecord; bg: string; aboutImageUrl?: string }) {
  return (
    <section id="about" style={{ background: bg, padding: "6rem clamp(1rem, 5vw, 3rem)", borderBottom: `3px solid ${BLACK}` }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <ScrollAnimator style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", marginBottom: "3rem" }}>
          <span style={{
            fontFamily: FF, fontWeight: 900, fontSize: "clamp(4rem, 8vw, 7rem)",
            color: "transparent", lineHeight: 1, WebkitTextStroke: `3px ${BLACK}`,
          }}>03</span>
          <h2 style={{
            fontFamily: FF, fontWeight: 900,
            fontSize: `calc(var(--h2-size, clamp(2rem, 5vw, 4rem)) * var(--font-scale, 1))`,
            textTransform: "uppercase", letterSpacing: "-0.03em", color: C_HEADING,
          }}>About</h2>
        </ScrollAnimator>
        <div className="nb-about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
          <div>
            <h3 style={{
              fontFamily: FF, fontWeight: 900,
              fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
              textTransform: "uppercase", color: C_HEADING, marginBottom: "1.25rem", lineHeight: 1.05,
            }}>{content.title}</h3>
            <p style={{ fontFamily: FF, fontSize: `calc(var(--body-size, 1rem) * var(--font-scale, 1))`, color: C_BODY, lineHeight: 1.85, marginBottom: "1.5rem" }}>
              {content.body}
            </p>
            {site.contactEmail && (
              <a href={`mailto:${site.contactEmail}`} style={{ fontFamily: FF, fontSize: "0.875rem", color: C_ACCENT, fontWeight: 700, textTransform: "uppercase", textDecoration: "none", display: "block" }}>
                ✉ {site.contactEmail}
              </a>
            )}
            {site.contactPhone && (
              <a href={`tel:${site.contactPhone}`} style={{ fontFamily: FF, fontSize: "0.875rem", color: C_ACCENT, fontWeight: 700, textTransform: "uppercase", marginTop: "0.375rem", textDecoration: "none", display: "block" }}>
                ✆ {site.contactPhone}
              </a>
            )}
          </div>
          {/* Right: about image if uploaded, else stat cards */}
          {aboutImageUrl ? (
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={aboutImageUrl} alt="About" style={{ width: "100%", maxHeight: "400px", objectFit: "cover", border: `3px solid ${BLACK}`, boxShadow: `5px 5px 0 ${BLACK}`, display: "block" }} />
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {content.stats.map((st, i) => (
                <div key={i} className="nb-card" style={{
                  background: i === 0 ? BLACK : i === 1 ? P : bg,
                  padding: "1.25rem 1.5rem",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <span style={{ fontFamily: FF, fontWeight: 900, fontSize: "clamp(1.5rem, 4vw, 2.5rem)", letterSpacing: "-0.04em", color: i === 0 ? P : BLACK }}>{st.value}</span>
                  <span style={{ fontFamily: FF, fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: i === 0 ? "#fff" : BLACK }}>{st.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ───────────────────────────────────────────────────────────────
function Testimonials({ content, surface, bg }: { content: StructuredSiteContent["testimonials"]; surface: string; bg: string }) {
  if (!content?.length) return null;
  return (
    <section style={{ background: surface, borderBottom: `3px solid ${P}`, padding: "6rem clamp(1rem, 5vw, 3rem)" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", marginBottom: "3rem" }}>
          <span style={{
            fontFamily: FF, fontWeight: 900, fontSize: "clamp(4rem, 8vw, 7rem)",
            color: P, lineHeight: 1,
          }}>04</span>
          <h2 style={{
            fontFamily: FF, fontWeight: 900,
            fontSize: `calc(var(--h2-size, clamp(2rem, 5vw, 4rem)) * var(--font-scale, 1))`,
            textTransform: "uppercase", letterSpacing: "-0.03em", color: "#fff",
          }}>What They Say</h2>
        </div>
        <ScrollAnimator>
        <div className="nb-testimonials" style={{ display: "flex", gap: "1.25rem", overflowX: "auto", paddingBottom: "1rem" }}>
            {content.map((t, i) => (
            <div key={i} style={{
              flex: "0 0 clamp(280px, 35vw, 360px)",
              background: i % 2 === 0 ? bg : P,
              border: `3px solid ${i % 2 === 0 ? P : BLACK}`,
              boxShadow: `5px 5px 0 ${i % 2 === 0 ? P : BLACK}`,
              padding: "2rem",
            }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "5rem", color: i % 2 === 0 ? P : BLACK, lineHeight: 0.8, marginBottom: "0.5rem", opacity: 0.6 }}>
                &ldquo;
              </div>
              <Stars n={t.rating} />
              <p style={{
                fontFamily: FF, fontSize: "0.9375rem", color: BLACK,
                lineHeight: 1.7, margin: "1rem 0 1.5rem", fontWeight: 600,
              }}>&ldquo;{t.quote}&rdquo;</p>
              <div style={{ fontFamily: FF, fontWeight: 900, fontSize: "0.875rem", color: BLACK, textTransform: "uppercase" }}>
                — {t.name}
              </div>
              <div style={{ fontFamily: FF, fontSize: "0.75rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.05em" }}>
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

// ── CTA ────────────────────────────────────────────────────────────────────────
function CTA({ content, contactEmail, contactPhone, businessName, siteId, primary, btnRadius }: {
  content: StructuredSiteContent["cta"];
  contactEmail?: string;
  contactPhone?: string;
  businessName?: string;
  siteId?: string;
  primary: string;
  btnRadius?: string;
}) {
  return (
    <section id="contact" style={{
      background: P, borderBottom: `3px solid ${BLACK}`,
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
          fontSize: `calc(var(--h2-size, clamp(2rem, 6vw, 5rem)) * var(--font-scale, 1))`,
          textTransform: "uppercase", letterSpacing: "-0.04em",
          color: C_HEADING, marginBottom: "1rem", lineHeight: 0.95,
        }}>{content.headline}</h2>
        <p style={{ fontFamily: FF, fontSize: `calc(var(--body-size, 1rem) * var(--font-scale, 1))`, color: C_BODY, marginBottom: "2.5rem", lineHeight: 1.7 }}>
          {content.subtext}
        </p>
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <ContactFormBlock
            businessEmail={contactEmail}
            businessName={businessName}
            siteId={siteId}
            fontFamily={FF}
            labelStyle={{ color: BLACK, textTransform: "uppercase" as const, letterSpacing: "0.06em" }}
            inputStyle={{
              background: "#fff",
              border: `3px solid ${BLACK}`,
              boxShadow: `3px 3px 0 ${BLACK}`,
              borderRadius: btnRadius ?? "0px",
              padding: "12px 14px",
              color: BLACK,
              fontSize: "0.9rem",
              outline: "none",
            }}
            btnStyle={{
              background: BLACK,
              color: primary,
              fontFamily: FF,
              fontWeight: 900,
              fontSize: "1rem",
              padding: "14px 28px",
              border: `3px solid ${BLACK}`,
              boxShadow: `5px 5px 0 ${BLACK}`,
              borderRadius: btnRadius ?? "0px",
              textTransform: "uppercase" as const,
              letterSpacing: "0.06em",
              width: "100%",
            }}
            successColor="#000"
          />
        </div>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────────
function Footer({ site, surface }: { site: SiteRecord; surface: string }) {
  return (
    <footer style={{ background: surface, padding: "2.5rem clamp(1rem, 5vw, 3rem)" }}>
      <div style={{
        maxWidth: "1280px", margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem",
      }}>
        <span style={{ fontFamily: FF, fontWeight: 900, fontSize: "1.1rem", color: P, textTransform: "uppercase" }}>
          {site.businessName}
        </span>
        <span style={{ fontFamily: FF, fontSize: "0.75rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          © {new Date().getFullYear()} · Built with{" "}
          <a href="https://baileyagents.com" style={{ color: P, textDecoration: "none" }}>BaileyAgents</a>
        </span>
      </div>
    </footer>
  );
}

// ── Main Layout ────────────────────────────────────────────────────────────────
export function NeoBrutalismLayout({ site, content, heroImageUrl, aboutImageUrl, theme, isEditing }: TemplateProps) {
  const BG      = theme?.background ?? "#fffef7";
  const SURFACE = theme?.surface ?? "#0a0a0a";
  const PRIMARY = theme?.primaryColor ?? "#FFE500";
  const BODY_COLOR = theme?.bodyColor ?? "rgba(255,255,255,0.7)";
  const btnRadius =
    theme?.buttonStyle === "sharp" ? "0px" :
    theme?.buttonStyle === "pill"  ? "999px" : "0px";

  return (
    <>
      <Styles primary={PRIMARY} />
      <div
        className="nb-root"
        style={{
          fontFamily: FF, background: BG, overflowX: "clip",
          ["--nb-primary"  as string]: PRIMARY,
          ["--nb-body-color" as string]: BODY_COLOR,
        }}
      >
        <Ticker />
        <Navbar businessName={site.businessName} ctaText={content.hero.ctaText} surface={SURFACE} navLinks={content.nav?.links} isEditing={isEditing} />
        <Hero content={content.hero} heroImageUrl={heroImageUrl} location={site.location} bg={BG} btnRadius={btnRadius} />
        <Services content={content.services} location={site.location} bg={BG} />
        <FeaturedWork heroImageUrl={heroImageUrl} businessName={site.businessName} surface={SURFACE} />
        <About content={content.about} site={site} bg={BG} aboutImageUrl={aboutImageUrl} />
        <Testimonials content={content.testimonials} surface={SURFACE} bg={BG} />
        <CTA content={content.cta} contactEmail={site.contactEmail} contactPhone={site.contactPhone} businessName={site.businessName} siteId={site.siteId} primary={PRIMARY} btnRadius={btnRadius} />
        <Footer site={site} surface={SURFACE} />
      </div>
    </>
  );
}

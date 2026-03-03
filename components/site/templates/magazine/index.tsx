/**
 * Bold Magazine template — high-end editorial aesthetic.
 * Off-white, large display type, serif + sans mix, section numbers.
 */
import type { SiteRecord } from "@/lib/kv";
import type { StructuredSiteContent } from "@/lib/site-theme";

export type TemplateProps = {
  site:          SiteRecord;
  content:       StructuredSiteContent;
  primaryColor:  string;
  heroImageUrl?: string;
};

const BG     = "#fafaf8";
const BLACK  = "#1a1a1a";
const MUTED  = "#6b6b6b";
const LINE   = "#e0ddd8";
const FF_SER = "Georgia, 'Times New Roman', serif";
const FF_SAN = "'Helvetica Neue', Arial, sans-serif";

function Num({ n, color }: { n: string; color: string }) {
  return (
    <span style={{
      fontFamily: FF_SER, fontWeight: 400, fontSize: "5rem",
      color: "transparent", WebkitTextStroke: `1px ${color}`,
      lineHeight: 1, display: "block", marginBottom: "0.25rem", opacity: 0.5,
    }}>{n}</span>
  );
}

function Stars({ n, color }: { n: number; color: string }) {
  const c = Math.min(5, Math.max(1, Math.round(n)));
  return <span style={{ color, fontSize: "0.9rem" }}>{"★".repeat(c)}{"☆".repeat(5 - c)}</span>;
}

// ── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ businessName, primaryColor }: { businessName: string; primaryColor: string }) {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: BG, borderBottom: `1px solid ${LINE}`,
      padding: "0 2rem",
    }}>
      <div style={{
        maxWidth: "1100px", margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "64px",
      }}>
        <span style={{
          fontFamily: FF_SER, fontWeight: 700, fontSize: "1.25rem",
          color: BLACK, letterSpacing: "-0.02em", fontStyle: "italic",
        }}>{businessName}</span>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          {["Services", "About", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{
              fontFamily: FF_SAN, fontSize: "0.78rem", fontWeight: 400,
              color: MUTED, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.06em",
            }}>{l}</a>
          ))}
          <a href="#contact" style={{
            background: "transparent", color: primaryColor,
            fontFamily: FF_SAN, fontSize: "0.78rem", fontWeight: 600,
            padding: "7px 18px", border: `1px solid ${primaryColor}`,
            textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.06em",
          }}>Contact</a>
        </div>
      </div>
    </nav>
  );
}

// ── Hero (full bleed image + bold text overlay) ───────────────────────────────
function Hero({ content, heroImageUrl, primaryColor, location }: {
  content: StructuredSiteContent["hero"];
  heroImageUrl?: string;
  primaryColor: string;
  location: string;
}) {
  return (
    <section id="home" style={{
      position: "relative", overflow: "hidden",
      minHeight: "85vh", display: "flex", alignItems: "flex-end",
      background: "#111",
    }}>
      {heroImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={heroImageUrl} alt="Hero" style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%", objectFit: "cover",
          opacity: 0.55,
        }} />
      )}
      {/* Gradient overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.25) 60%, transparent 100%)",
      }} />

      <div style={{ position: "relative", maxWidth: "1100px", margin: "0 auto", width: "100%", padding: "0 2rem 5rem" }}>
        <div style={{
          display: "inline-block", background: primaryColor,
          fontFamily: FF_SAN, fontWeight: 600, fontSize: "0.7rem",
          textTransform: "uppercase", letterSpacing: "0.12em", color: "#fff",
          padding: "5px 14px", marginBottom: "1.5rem",
        }}>
          {content.badge || location}
        </div>
        <h1 style={{
          fontFamily: FF_SER, fontWeight: 700, fontStyle: "italic",
          fontSize: "clamp(3rem, 7vw, 6rem)",
          lineHeight: 0.95, letterSpacing: "-0.03em",
          color: "#fff", marginBottom: "1.5rem",
          maxWidth: "800px",
        }}>
          {content.headline}
        </h1>
        <p style={{
          fontFamily: FF_SAN, fontSize: "1rem", color: "rgba(255,255,255,0.75)",
          maxWidth: "520px", lineHeight: 1.7, marginBottom: "2rem",
        }}>
          {content.subheadline}
        </p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <a href="#contact" style={{
            background: primaryColor, color: "#fff",
            fontFamily: FF_SAN, fontWeight: 600, fontSize: "0.85rem",
            padding: "12px 28px", textDecoration: "none",
            textTransform: "uppercase", letterSpacing: "0.06em",
          }}>{content.ctaText}</a>
          <a href="#services" style={{
            background: "transparent", color: "#fff",
            fontFamily: FF_SAN, fontWeight: 600, fontSize: "0.85rem",
            padding: "12px 28px", textDecoration: "none",
            border: "1px solid rgba(255,255,255,0.45)",
            textTransform: "uppercase", letterSpacing: "0.06em",
          }}>Read More ↓</a>
        </div>
      </div>
    </section>
  );
}

// ── Services ─────────────────────────────────────────────────────────────────
function Services({ content, primaryColor, location }: { content: StructuredSiteContent["services"]; primaryColor: string; location: string }) {
  return (
    <section id="services" style={{ background: BG, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, padding: "6rem 2rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", marginBottom: "0.5rem" }}>
          <Num n="01" color={BLACK} />
          <span style={{
            fontFamily: FF_SAN, fontSize: "0.7rem", fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.14em", color: primaryColor,
          }}>Services</span>
        </div>
        <h2 style={{
          fontFamily: FF_SER, fontStyle: "italic", fontWeight: 700,
          fontSize: "clamp(2rem, 4vw, 3.25rem)", letterSpacing: "-0.03em",
          color: BLACK, marginBottom: "3rem", maxWidth: "600px",
        }}>What We Offer</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0" }}>
          {content.map((s, i) => (
            <div key={i} style={{
              borderTop: `1px solid ${LINE}`,
              borderRight: i % 3 !== 2 ? `1px solid ${LINE}` : "none",
              padding: "2rem 1.75rem",
            }}>
              <div style={{ fontFamily: FF_SER, fontSize: "1.75rem", marginBottom: "0.75rem", fontStyle: "italic", color: primaryColor }}>
                {s.icon || "§"}
              </div>
              <h3 style={{ fontFamily: FF_SAN, fontWeight: 600, fontSize: "1rem", color: BLACK, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {s.name}
              </h3>
              <p style={{ fontFamily: FF_SAN, fontSize: "0.85rem", color: MUTED, lineHeight: 1.7 }}>
                {s.description || `Professional ${s.name.toLowerCase()} services in ${location}.`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── About (two-column magazine layout) ────────────────────────────────────────
function About({ content, site, primaryColor }: { content: StructuredSiteContent["about"]; site: SiteRecord; primaryColor: string }) {
  return (
    <section id="about" style={{ background: "#fff", padding: "6rem 2rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", marginBottom: "0.5rem" }}>
          <Num n="02" color={BLACK} />
          <span style={{
            fontFamily: FF_SAN, fontSize: "0.7rem", fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.14em", color: primaryColor,
          }}>Our Story</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "5rem", alignItems: "start" }}>
          <div>
            <h2 style={{
              fontFamily: FF_SER, fontStyle: "italic", fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em",
              color: BLACK, marginBottom: "1.75rem", lineHeight: 1.1,
            }}>{content.title}</h2>
            <p style={{ fontFamily: FF_SAN, fontSize: "1rem", color: MUTED, lineHeight: 1.9, marginBottom: "2rem" }}>
              {content.body}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {site.contactEmail && (
                <a href={`mailto:${site.contactEmail}`} style={{ fontFamily: FF_SAN, fontSize: "0.85rem", color: primaryColor, textDecoration: "none" }}>
                  {site.contactEmail}
                </a>
              )}
              {site.contactPhone && (
                <a href={`tel:${site.contactPhone}`} style={{ fontFamily: FF_SAN, fontSize: "0.85rem", color: primaryColor, textDecoration: "none" }}>
                  {site.contactPhone}
                </a>
              )}
            </div>
          </div>
          <div style={{ paddingTop: "0.5rem" }}>
            {content.stats.map((st, i) => (
              <div key={i} style={{
                borderBottom: `1px solid ${LINE}`, padding: "1.5rem 0",
              }}>
                <div style={{ fontFamily: FF_SER, fontStyle: "italic", fontWeight: 700, fontSize: "2.5rem", color: primaryColor, letterSpacing: "-0.03em" }}>
                  {st.value}
                </div>
                <div style={{ fontFamily: FF_SAN, fontSize: "0.78rem", color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "0.25rem" }}>
                  {st.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────────
function Testimonials({ content, primaryColor }: { content: StructuredSiteContent["testimonials"]; primaryColor: string }) {
  if (!content?.length) return null;
  return (
    <section style={{ background: BG, borderTop: `1px solid ${LINE}`, padding: "6rem 2rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", marginBottom: "0.5rem" }}>
          <Num n="03" color={BLACK} />
          <span style={{
            fontFamily: FF_SAN, fontSize: "0.7rem", fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.14em", color: primaryColor,
          }}>Reviews</span>
        </div>
        <h2 style={{
          fontFamily: FF_SER, fontStyle: "italic", fontWeight: 700,
          fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em",
          color: BLACK, marginBottom: "3rem",
        }}>What Our Clients Say</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
          {content.map((t, i) => (
            <div key={i} style={{ borderTop: `3px solid ${primaryColor}`, paddingTop: "1.5rem" }}>
              <Stars n={t.rating} color={primaryColor} />
              <p style={{
                fontFamily: FF_SER, fontStyle: "italic", fontSize: "1rem",
                color: BLACK, lineHeight: 1.8, margin: "1rem 0 1.25rem",
              }}>
                "{t.quote}"
              </p>
              <div style={{ fontFamily: FF_SAN, fontWeight: 600, fontSize: "0.8rem", color: BLACK, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {t.name}
              </div>
              <div style={{ fontFamily: FF_SAN, fontSize: "0.75rem", color: MUTED, marginTop: "0.125rem" }}>
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
function CTA({ content, primaryColor, contactEmail, contactPhone }: {
  content: StructuredSiteContent["cta"];
  primaryColor: string;
  contactEmail?: string;
  contactPhone?: string;
}) {
  const href = contactPhone ? `tel:${contactPhone}` : contactEmail ? `mailto:${contactEmail}` : "#contact";
  return (
    <section id="contact" style={{
      background: BLACK, padding: "7rem 2rem", textAlign: "center",
    }}>
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        <span style={{
          fontFamily: FF_SAN, fontSize: "0.7rem", fontWeight: 600,
          textTransform: "uppercase", letterSpacing: "0.14em", color: primaryColor,
          display: "block", marginBottom: "1.5rem",
        }}>Get In Touch</span>
        <h2 style={{
          fontFamily: FF_SER, fontStyle: "italic", fontWeight: 700,
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          letterSpacing: "-0.03em", color: "#fff",
          marginBottom: "1.25rem", lineHeight: 1.1,
        }}>{content.headline}</h2>
        <p style={{ fontFamily: FF_SAN, fontSize: "0.95rem", color: "rgba(255,255,255,0.55)", marginBottom: "2.5rem", lineHeight: 1.7 }}>
          {content.subtext}
        </p>
        <a href={href} style={{
          background: primaryColor, color: "#fff",
          fontFamily: FF_SAN, fontWeight: 600, fontSize: "0.875rem",
          padding: "14px 36px", textDecoration: "none",
          textTransform: "uppercase", letterSpacing: "0.1em", display: "inline-block",
        }}>{content.buttonText}</a>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer({ site, primaryColor }: { site: SiteRecord; primaryColor: string }) {
  return (
    <footer id="footer" style={{ background: "#111", borderTop: `1px solid #333`, padding: "2.5rem 2rem" }}>
      <div style={{
        maxWidth: "1100px", margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem",
      }}>
        <span style={{ fontFamily: FF_SER, fontStyle: "italic", fontSize: "1rem", color: "#888" }}>
          {site.businessName}
        </span>
        <span style={{ fontFamily: FF_SAN, fontSize: "0.72rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          © {new Date().getFullYear()} · Built with{" "}
          <a href="https://baileysystemsai.com" style={{ color: primaryColor, textDecoration: "none" }}>BaileySystemsAI</a>
        </span>
      </div>
    </footer>
  );
}

// ── Main Layout ───────────────────────────────────────────────────────────────
export function MagazineLayout({ site, content, primaryColor, heroImageUrl }: TemplateProps) {
  return (
    <div style={{ fontFamily: FF_SAN, background: BG, color: BLACK }}>
      <Navbar businessName={site.businessName} primaryColor={primaryColor} />
      <Hero content={content.hero} heroImageUrl={heroImageUrl} primaryColor={primaryColor} location={site.location} />
      <Services content={content.services} primaryColor={primaryColor} location={site.location} />
      <About content={content.about} site={site} primaryColor={primaryColor} />
      <Testimonials content={content.testimonials} primaryColor={primaryColor} />
      <CTA content={content.cta} primaryColor={primaryColor} contactEmail={site.contactEmail} contactPhone={site.contactPhone} />
      <Footer site={site} primaryColor={primaryColor} />
    </div>
  );
}

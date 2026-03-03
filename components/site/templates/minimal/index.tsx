/**
 * Modern Minimal template — Apple / Linear aesthetic.
 * Pure white, generous whitespace, thin elegant typography, accent color used sparingly.
 */
import type { SiteRecord } from "@/lib/kv";
import type { StructuredSiteContent } from "@/lib/site-theme";

export type TemplateProps = {
  site:          SiteRecord;
  content:       StructuredSiteContent;
  primaryColor:  string;
  heroImageUrl?: string;
};

const FF_SANS = "'Helvetica Neue', 'Inter', system-ui, sans-serif";
const FF_MONO = "'SF Mono', 'Fira Mono', monospace";
const TEXT    = "#111111";
const MUTED   = "#6b6b6b";
const BORDER  = "1px solid #e8e8e8";

function Label({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span style={{
      fontFamily: FF_MONO, fontSize: "0.65rem", fontWeight: 600,
      textTransform: "uppercase", letterSpacing: "0.12em",
      color, display: "block", marginBottom: "1rem",
    }}>{children}</span>
  );
}

function Stars({ n, color }: { n: number; color: string }) {
  const c = Math.min(5, Math.max(1, Math.round(n)));
  return (
    <span style={{ color, fontSize: "0.75rem", letterSpacing: "2px" }}>
      {"★".repeat(c)}{"☆".repeat(5 - c)}
    </span>
  );
}

// ── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ businessName, primaryColor }: { businessName: string; primaryColor: string }) {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)",
      borderBottom: BORDER, padding: "0 2rem",
    }}>
      <div style={{
        maxWidth: "960px", margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "56px",
      }}>
        <span style={{ fontFamily: FF_SANS, fontWeight: 600, fontSize: "0.95rem", color: TEXT, letterSpacing: "-0.01em" }}>
          {businessName}
        </span>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          {["Services", "About", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{
              fontFamily: FF_SANS, fontSize: "0.8rem", fontWeight: 400,
              color: MUTED, textDecoration: "none",
            }}>{l}</a>
          ))}
          <a href="#contact" style={{
            background: primaryColor, color: "#fff",
            fontFamily: FF_SANS, fontSize: "0.8rem", fontWeight: 500,
            padding: "7px 18px", borderRadius: "6px", textDecoration: "none",
          }}>Get Started</a>
        </div>
      </div>
    </nav>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ content, primaryColor, location }: {
  content: StructuredSiteContent["hero"];
  primaryColor: string;
  location: string;
}) {
  return (
    <section id="home" style={{
      background: "#ffffff", padding: "8rem 2rem 7rem",
      textAlign: "center",
    }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          background: `${primaryColor}10`, borderRadius: "100px",
          padding: "5px 14px", marginBottom: "2rem",
        }}>
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: primaryColor, display: "inline-block" }} />
          <span style={{ fontFamily: FF_MONO, fontSize: "0.65rem", color: primaryColor, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {content.badge || location}
          </span>
        </div>
        <h1 style={{
          fontFamily: FF_SANS, fontWeight: 600,
          fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
          lineHeight: 1.1, letterSpacing: "-0.04em",
          color: TEXT, marginBottom: "1.5rem",
        }}>
          {content.headline}
        </h1>
        <p style={{
          fontFamily: FF_SANS, fontSize: "1.1rem", fontWeight: 400,
          color: MUTED, lineHeight: 1.75, marginBottom: "2.5rem",
        }}>
          {content.subheadline}
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="#contact" style={{
            background: primaryColor, color: "#fff",
            fontFamily: FF_SANS, fontWeight: 500, fontSize: "0.9rem",
            padding: "11px 28px", borderRadius: "8px", textDecoration: "none",
          }}>{content.ctaText}</a>
          <a href="#services" style={{
            background: "transparent", color: TEXT,
            fontFamily: FF_SANS, fontWeight: 500, fontSize: "0.9rem",
            padding: "11px 28px", borderRadius: "8px", textDecoration: "none",
            border: BORDER,
          }}>See services ↓</a>
        </div>
      </div>
    </section>
  );
}

// ── Services ─────────────────────────────────────────────────────────────────
function Services({ content, primaryColor, location }: { content: StructuredSiteContent["services"]; primaryColor: string; location: string }) {
  return (
    <section id="services" style={{ background: "#f5f5f5", padding: "6rem 2rem" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <Label color={primaryColor}>What We Do</Label>
          <h2 style={{ fontFamily: FF_SANS, fontWeight: 600, fontSize: "2rem", letterSpacing: "-0.03em", color: TEXT }}>
            Our Services
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1px", background: "#e8e8e8" }}>
          {content.map((s, i) => (
            <div key={i} style={{
              background: "#fff", padding: "2rem 1.75rem",
            }}>
              <div style={{
                fontSize: "1.5rem", marginBottom: "1rem",
                width: "40px", height: "40px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{s.icon || "○"}</div>
              <h3 style={{ fontFamily: FF_SANS, fontWeight: 600, fontSize: "0.95rem", color: TEXT, marginBottom: "0.5rem" }}>
                {s.name}
              </h3>
              <p style={{ fontFamily: FF_SANS, fontSize: "0.825rem", color: MUTED, lineHeight: 1.65 }}>
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
function About({ content, site, primaryColor }: { content: StructuredSiteContent["about"]; site: SiteRecord; primaryColor: string }) {
  return (
    <section id="about" style={{ background: "#fff", padding: "6rem 2rem" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <Label color={primaryColor}>About</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>
          <div>
            <h2 style={{
              fontFamily: FF_SANS, fontWeight: 600, fontSize: "1.75rem",
              letterSpacing: "-0.03em", color: TEXT, marginBottom: "1.25rem", lineHeight: 1.2,
            }}>{content.title}</h2>
            <p style={{ fontFamily: FF_SANS, fontSize: "0.9rem", color: MUTED, lineHeight: 1.85, marginBottom: "1.5rem" }}>
              {content.body}
            </p>
            {site.contactEmail && (
              <p style={{ fontFamily: FF_MONO, fontSize: "0.8rem", color: TEXT, marginBottom: "0.25rem" }}>
                {site.contactEmail}
              </p>
            )}
            {site.contactPhone && (
              <p style={{ fontFamily: FF_MONO, fontSize: "0.8rem", color: TEXT }}>
                {site.contactPhone}
              </p>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {content.stats.map((st, i) => (
              <div key={i} style={{
                borderBottom: BORDER, padding: "1.5rem 0",
                display: "flex", justifyContent: "space-between", alignItems: "baseline",
              }}>
                <span style={{ fontFamily: FF_SANS, fontWeight: 600, fontSize: "2rem", color: TEXT, letterSpacing: "-0.04em" }}>
                  {st.value}
                </span>
                <span style={{ fontFamily: FF_SANS, fontSize: "0.8rem", color: MUTED }}>
                  {st.label}
                </span>
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
    <section style={{ background: "#f5f5f5", padding: "6rem 2rem" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <Label color={primaryColor}>Reviews</Label>
          <h2 style={{ fontFamily: FF_SANS, fontWeight: 600, fontSize: "2rem", letterSpacing: "-0.03em", color: TEXT }}>
            What clients say
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1px", background: "#e8e8e8" }}>
          {content.map((t, i) => (
            <div key={i} style={{ background: "#fff", padding: "2rem" }}>
              <Stars n={t.rating} color={primaryColor} />
              <p style={{
                fontFamily: FF_SANS, fontSize: "0.875rem", color: MUTED,
                lineHeight: 1.8, margin: "1rem 0 1.5rem", fontStyle: "italic",
              }}>"{t.quote}"</p>
              <div style={{ fontFamily: FF_SANS, fontWeight: 600, fontSize: "0.8rem", color: TEXT }}>{t.name}</div>
              <div style={{ fontFamily: FF_SANS, fontSize: "0.75rem", color: MUTED }}>{t.role}</div>
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
    <section id="contact" style={{ background: "#fff", borderTop: BORDER, padding: "7rem 2rem", textAlign: "center" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <Label color={primaryColor}>Get Started</Label>
        <h2 style={{
          fontFamily: FF_SANS, fontWeight: 600,
          fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
          letterSpacing: "-0.04em", color: TEXT,
          marginBottom: "1rem", lineHeight: 1.15,
        }}>{content.headline}</h2>
        <p style={{ fontFamily: FF_SANS, fontSize: "0.9rem", color: MUTED, marginBottom: "2.5rem", lineHeight: 1.7 }}>
          {content.subtext}
        </p>
        <a href={href} style={{
          background: primaryColor, color: "#fff",
          fontFamily: FF_SANS, fontWeight: 500, fontSize: "0.95rem",
          padding: "13px 32px", borderRadius: "8px", textDecoration: "none", display: "inline-block",
        }}>{content.buttonText}</a>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer({ site, primaryColor }: { site: SiteRecord; primaryColor: string }) {
  return (
    <footer id="footer" style={{ background: "#f5f5f5", borderTop: BORDER, padding: "2rem 2rem" }}>
      <div style={{
        maxWidth: "960px", margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem",
      }}>
        <span style={{ fontFamily: FF_SANS, fontSize: "0.8rem", color: MUTED }}>
          {site.businessName} · {site.location}
        </span>
        <span style={{ fontFamily: FF_SANS, fontSize: "0.75rem", color: "#bbb" }}>
          © {new Date().getFullYear()} · Built with{" "}
          <a href="https://baileysystemsai.com" style={{ color: primaryColor, textDecoration: "none" }}>BaileySystemsAI</a>
        </span>
      </div>
    </footer>
  );
}

// ── Main Layout ───────────────────────────────────────────────────────────────
export function MinimalLayout({ site, content, primaryColor }: TemplateProps) {
  return (
    <div style={{ fontFamily: FF_SANS, background: "#fff", color: TEXT }}>
      <Navbar businessName={site.businessName} primaryColor={primaryColor} />
      <Hero content={content.hero} primaryColor={primaryColor} location={site.location} />
      <Services content={content.services} primaryColor={primaryColor} location={site.location} />
      <About content={content.about} site={site} primaryColor={primaryColor} />
      <Testimonials content={content.testimonials} primaryColor={primaryColor} />
      <CTA content={content.cta} primaryColor={primaryColor} contactEmail={site.contactEmail} contactPhone={site.contactPhone} />
      <Footer site={site} primaryColor={primaryColor} />
    </div>
  );
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSite } from "@/lib/kv";

export const dynamic = "force-dynamic";

// ── Color map ─────────────────────────────────────────────────────────────────
const COLOR_MAP: Record<string, string> = {
  "Emerald Green": "#10b981",
  "Electric Blue": "#3b82f6",
  "Sunset Orange": "#f97316",
  "Royal Purple": "#8b5cf6",
  "Fire Red": "#ef4444",
};

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ siteId: string }>;
}): Promise<Metadata> {
  const { siteId } = await params;
  const site = await getSite(siteId);
  if (!site) return { title: "Site Not Found" };
  return {
    title: site.generatedContent.seo_title,
    description: site.generatedContent.seo_description,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function SitePage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  const site = await getSite(siteId);

  if (!site) notFound();

  const { generatedContent: c, businessName, location, contactEmail, contactPhone, services } = site;
  const accent = COLOR_MAP[site.primaryColor] ?? "#10b981";
  const accentLight = `${accent}18`;
  const accentMid = `${accent}30`;

  const servicesList = Array.isArray(c.services_list)
    ? c.services_list
    : services.split(",").map((s) => s.trim()).slice(0, 6);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: "#1a1a1a", background: "#ffffff" }}>

      {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #e5e7eb", padding: "0 1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
          {/* Logo */}
          <a href="#home" style={{ fontWeight: 900, fontSize: "1.25rem", color: "#1a1a1a", textDecoration: "none", letterSpacing: "-0.03em" }}>
            {businessName}
          </a>

          {/* Nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            {["Home", "Services", "About", "Contact"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                style={{ fontSize: "0.875rem", fontWeight: 500, color: "#6b7280", textDecoration: "none" }}
              >
                {link}
              </a>
            ))}
            <a
              href="#contact"
              style={{
                background: accent,
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.875rem",
                padding: "0.5rem 1.25rem",
                borderRadius: "8px",
                textDecoration: "none",
              }}
            >
              {c.cta_text}
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section
        id="home"
        style={{
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "5rem 1.5rem",
          background: `linear-gradient(135deg, ${accentLight} 0%, #ffffff 60%, ${accentLight} 100%)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative blob */}
        <div style={{
          position: "absolute", top: "-100px", right: "-100px",
          width: "400px", height: "400px", borderRadius: "50%",
          background: `radial-gradient(circle, ${accentMid} 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-80px", left: "-80px",
          width: "300px", height: "300px", borderRadius: "50%",
          background: `radial-gradient(circle, ${accentMid} 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", maxWidth: "800px", margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: accentLight, border: `1px solid ${accentMid}`,
            borderRadius: "100px", padding: "6px 14px",
            fontSize: "0.75rem", fontWeight: 600, color: accent,
            marginBottom: "1.5rem", textTransform: "uppercase", letterSpacing: "0.05em",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: accent, display: "inline-block" }} />
            {location}
          </div>

          <h1 style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "#111",
            marginBottom: "1.5rem",
          }}>
            {c.hero_headline}
          </h1>

          <p style={{
            fontSize: "1.125rem",
            color: "#6b7280",
            maxWidth: "560px",
            margin: "0 auto 2.5rem",
            lineHeight: 1.7,
          }}>
            {c.hero_subheadline}
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="#contact"
              style={{
                background: accent,
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                padding: "0.875rem 2rem",
                borderRadius: "10px",
                textDecoration: "none",
                boxShadow: `0 8px 24px ${accentMid}`,
              }}
            >
              {c.cta_text}
            </a>
            <a
              href="#services"
              style={{
                background: "transparent",
                color: "#374151",
                fontWeight: 600,
                fontSize: "1rem",
                padding: "0.875rem 2rem",
                borderRadius: "10px",
                textDecoration: "none",
                border: "1.5px solid #e5e7eb",
              }}
            >
              See Our Services
            </a>
          </div>
        </div>
      </section>

      {/* ── SERVICES ───────────────────────────────────────────────────── */}
      <section id="services" style={{ padding: "6rem 1.5rem", background: "#f9fafb" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: accent, marginBottom: "0.75rem" }}>
              What We Do
            </p>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 900, letterSpacing: "-0.03em", color: "#111" }}>
              Our Services
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "1.25rem",
          }}>
            {servicesList.map((service: string, i: number) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "16px",
                  padding: "1.75rem",
                  borderTop: `3px solid ${accent}`,
                }}
              >
                <div style={{
                  width: "40px", height: "40px", borderRadius: "10px",
                  background: accentLight, display: "flex", alignItems: "center",
                  justifyContent: "center", marginBottom: "1rem", fontSize: "1.25rem",
                }}>
                  ✓
                </div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111", marginBottom: "0.5rem" }}>
                  {service}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "#6b7280", lineHeight: 1.6 }}>
                  Professional {service.toLowerCase()} services in {location}.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ──────────────────────────────────────────────────────── */}
      <section id="about" style={{ padding: "6rem 1.5rem", background: "#fff" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", gap: "4rem", alignItems: "center", flexWrap: "wrap" }}>
          {/* Left: accent block */}
          <div style={{
            flex: "0 0 auto", width: "280px",
            background: `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)`,
            borderRadius: "24px", padding: "3rem 2rem",
            color: "#fff", textAlign: "center",
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏆</div>
            <div style={{ fontSize: "2.5rem", fontWeight: 900, lineHeight: 1 }}>{new Date().getFullYear() - 2010}+</div>
            <div style={{ fontSize: "0.875rem", opacity: 0.85, marginTop: "0.5rem" }}>Years of Experience</div>
          </div>

          {/* Right: text */}
          <div style={{ flex: 1, minWidth: "260px" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: accent, marginBottom: "0.75rem" }}>
              About Us
            </p>
            <h2 style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.03em", color: "#111", marginBottom: "1.25rem" }}>
              {c.tagline}
            </h2>
            <p style={{ fontSize: "1rem", color: "#6b7280", lineHeight: 1.8, marginBottom: "1.5rem" }}>
              {c.about_text}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {contactEmail && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.9rem", color: "#374151" }}>
                  <span style={{ color: accent, fontWeight: 700 }}>✉</span>
                  <a href={`mailto:${contactEmail}`} style={{ color: "#374151", textDecoration: "none" }}>{contactEmail}</a>
                </div>
              )}
              {contactPhone && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.9rem", color: "#374151" }}>
                  <span style={{ color: accent, fontWeight: 700 }}>✆</span>
                  <a href={`tel:${contactPhone}`} style={{ color: "#374151", textDecoration: "none" }}>{contactPhone}</a>
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.9rem", color: "#374151" }}>
                <span style={{ color: accent, fontWeight: 700 }}>📍</span>
                {location}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ────────────────────────────────────────────────────── */}
      <section id="contact" style={{ padding: "6rem 1.5rem", background: "#f9fafb" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: accent, marginBottom: "0.75rem" }}>
            Get In Touch
          </p>
          <h2 style={{ fontSize: "2.25rem", fontWeight: 900, letterSpacing: "-0.03em", color: "#111", marginBottom: "1rem" }}>
            Ready to Get Started?
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "2.5rem", lineHeight: 1.7 }}>
            Contact us today for a free estimate. We serve {location} and surrounding areas.
          </p>

          <form style={{ display: "flex", flexDirection: "column", gap: "1rem", textAlign: "left" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <input
                type="text"
                placeholder="Your Name"
                style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: "10px", padding: "0.875rem 1rem", fontSize: "0.9rem", outline: "none" }}
              />
              <input
                type="email"
                placeholder="Your Email"
                style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: "10px", padding: "0.875rem 1rem", fontSize: "0.9rem", outline: "none" }}
              />
            </div>
            <input
              type="tel"
              placeholder="Your Phone"
              style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: "10px", padding: "0.875rem 1rem", fontSize: "0.9rem", outline: "none" }}
            />
            <textarea
              placeholder="Tell us about your project..."
              rows={4}
              style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: "10px", padding: "0.875rem 1rem", fontSize: "0.9rem", outline: "none", resize: "vertical" }}
            />
            <button
              type="button"
              style={{
                background: accent,
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                padding: "1rem",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                boxShadow: `0 8px 24px ${accentMid}`,
              }}
            >
              Send Message
            </button>
          </form>

          {(contactEmail || contactPhone) && (
            <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginTop: "2rem", flexWrap: "wrap" }}>
              {contactEmail && (
                <a href={`mailto:${contactEmail}`} style={{ fontSize: "0.875rem", color: "#6b7280", textDecoration: "none" }}>
                  ✉ {contactEmail}
                </a>
              )}
              {contactPhone && (
                <a href={`tel:${contactPhone}`} style={{ fontSize: "0.875rem", color: "#6b7280", textDecoration: "none" }}>
                  ✆ {contactPhone}
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer style={{
        background: "#111",
        color: "#9ca3af",
        padding: "2.5rem 1.5rem",
        textAlign: "center",
      }}>
        <div style={{ fontWeight: 900, fontSize: "1.25rem", color: "#fff", marginBottom: "0.5rem", letterSpacing: "-0.03em" }}>
          {businessName}
        </div>
        <div style={{ fontSize: "0.875rem", marginBottom: "1rem" }}>
          {c.tagline}
        </div>
        <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
          © {new Date().getFullYear()} {businessName}. All rights reserved. · {location}
        </div>
        <div style={{ marginTop: "1rem", fontSize: "0.7rem", color: "#374151" }}>
          Built with{" "}
          <a href="https://baileysystemsai.com" style={{ color: "#10b981", textDecoration: "none" }}>
            BaileySystemsAI
          </a>
        </div>
      </footer>

    </div>
  );
}

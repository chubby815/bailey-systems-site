import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSite, getSiteBySlug } from "@/lib/kv";
import { getSessionFromCookies, getSubscriptionStatus, getActivePlan } from "@/lib/auth";
import { isStructuredContent, buildThemeConfig } from "@/lib/site-theme";
import { SiteShareBar }     from "@/components/SiteShareBar";
import { LayoutRenderer }   from "@/components/site/LayoutRenderer";
import { TemplateRenderer } from "@/components/site/TemplateRenderer";
import { SiteEditor }       from "@/components/site/SiteEditor";
import { SiteChat }         from "@/components/site/SiteChat";

export const dynamic = "force-dynamic";

// ── Metadata ──────────────────────────────────────────────────────────────────
/**
 * Resolve a siteId param to a SiteRecord.
 * Tries the direct key first (site:{siteId}), then falls back to the
 * slug reverse-lookup key (slug:{siteId} → real siteId) so that
 * subdomain rewrites like elninostacos.baileyagents.com → /sites/elninostacos work.
 */
async function resolveSite(siteId: string) {
  console.log(`[resolveSite] looking up siteId="${siteId}"`);
  const direct = await getSite(siteId);
  if (direct) {
    console.log(`[resolveSite] found by direct key site:${siteId}`);
    return direct;
  }
  console.log(`[resolveSite] no direct match — trying slug lookup slug:${siteId}`);
  const bySlug = await getSiteBySlug(siteId);
  console.log(`[resolveSite] slug lookup → ${bySlug ? `found site "${bySlug.siteId}"` : "null (404)"}`);
  return bySlug;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ siteId: string }>;
}): Promise<Metadata> {
  const { siteId } = await params;
  const site = await resolveSite(siteId);
  if (!site) return { title: "Site Not Found" };

  const c = site.generatedContent;
  if (isStructuredContent(c)) {
    return {
      title: c.seo?.title ?? c.hero?.headline ?? "Bailey Agents Site",
      description: c.seo?.description ?? c.hero?.subheadline ?? "",
    };
  }
  return { title: c.seo_title, description: c.seo_description };
}

// ── Paused overlay (shared between old and new renderers) ────────────────────
function PausedOverlay() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        backdropFilter: "blur(10px)",
        background: "rgba(0,0,0,0.82)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          background: "#111214",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
          padding: "3rem 2.5rem",
          textAlign: "center",
          maxWidth: "420px",
          width: "100%",
        }}
      >
        <div style={{ fontSize: "3.5rem", marginBottom: "1.25rem" }}>⏸️</div>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 900,
            color: "#f0f0f0",
            marginBottom: "0.75rem",
            letterSpacing: "-0.03em",
          }}
        >
          Site Paused
        </h2>
        <p
          style={{
            fontSize: "0.9rem",
            color: "#9ca3af",
            lineHeight: 1.7,
            marginBottom: "2rem",
          }}
        >
          This site is paused. Reactivate your Bailey Agents subscription to restore it.
        </p>
        <a
          href="/pricing"
          style={{
            display: "inline-block",
            background: "#00e5a0",
            color: "#000",
            fontWeight: 700,
            fontSize: "0.95rem",
            padding: "0.875rem 2.5rem",
            borderRadius: "12px",
            textDecoration: "none",
          }}
        >
          Reactivate →
        </a>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function SitePage({
  params,
  searchParams,
}: {
  params:       Promise<{ siteId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { siteId } = await params;
  const sp       = await searchParams;
  const editMode = sp.edit === "true";
  const site = await resolveSite(siteId);
  if (!site) notFound();

  let viewerSession = null;
  try { viewerSession = await getSessionFromCookies(); } catch { viewerSession = null; }
  // Case-insensitive comparison: old sites may have mixed-case userId from before
  // email normalization was added. Current sessions always use lowercase email.
  const isOwner        = !!viewerSession?.email &&
    viewerSession.email.toLowerCase() === (site.userId ?? "").toLowerCase();
  let ownerSub = null;
  try { ownerSub = await getSubscriptionStatus(site.userId); } catch { ownerSub = null; }
  const siteIsPaused   =
    ownerSub !== null &&
    (ownerSub.status === "canceled" || ownerSub.status === "past_due");

  // Fetch the viewer's own plan for Ask Bailey edit limits
  let viewerPlan = "starter";
  try {
    viewerPlan = viewerSession?.email
      ? ((await getActivePlan(viewerSession.email)) ?? "starter")
      : "starter";
  } catch { viewerPlan = "starter"; }

  // ── Full HTML generated site (new pipeline) ──────────────────────────────
  if (site.generatedHTML) {
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: site.generatedHTML
        }}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '100vh',
        }}
      />
    )
  }

  const c = site.generatedContent;

  // ── New structured format ─────────────────────────────────────────────────
  if (isStructuredContent(c)) {
    // Use the owner's saved editor theme if present, otherwise derive from record
    const theme = site.editorTheme ?? buildThemeConfig(site);

    // Read hero and about images directly from the site record (base64 data URLs
    // saved by app/api/sites/[siteId]/image/route.ts).
    const heroImageUrl  = site.heroImage  ?? undefined;
    const aboutImageUrl = site.aboutImage ?? undefined;

    // Only mount the editor chrome when the owner explicitly visits with ?edit=true.
    // All other visits (visitors, or owner without ?edit=true) get the clean site.
    if (isOwner && editMode) {
      // SiteShareBar is intentionally omitted here — the editor toolbar already
      // has a "View Live ↗" button. Showing SiteShareBar in edit mode would
      // place it at position:fixed / top:52px / z-index:9999, covering the
      // template's site navbar in the preview canvas.
      return (
        <>
          {siteIsPaused && <PausedOverlay />}
          <SiteEditor
            site={site}
            content={c}
            theme={theme}
            isOwner={true}
            editMode={true}
            siteId={siteId}
            initialHeroImageUrl={heroImageUrl}
            plan={viewerPlan}
          />
        </>
      );
    }

    return (
      <>
        {siteIsPaused && <PausedOverlay />}
        {isOwner && (
          <>
            <SiteShareBar siteId={site.siteId} subdomainSlug={site.subdomainSlug} />
            {/* Spacer so the fixed 48px share bar doesn't overlap site content */}
            <div style={{ height: "48px" }} />
          </>
        )}
        <TemplateRenderer
          site={site}
          content={c}
          theme={theme}
          heroImageUrl={heroImageUrl}
          aboutImageUrl={aboutImageUrl}
        />
        {site.enableChat && <SiteChat site={site} />}
      </>
    );
  }

  // ── Legacy format — preserved exactly as before ───────────────────────────
  const INDUSTRY_PHOTO: Record<string, number> = {
    "Landscaping":       28,  "Plumbing":          164,
    "Electrician":       160, "Beauty & Wellness":  64,
    "Restaurant":        292, "Consulting":        375,
    "Real Estate":       450, "Fitness":             1,
    "Auto & Mechanic":   111, "Cleaning":          219,
    "Other":             338,
  };
  const COLOR_MAP: Record<string, string> = {
    "Emerald Green":  "#10b981", "Electric Blue":  "#0066ff",
    "Sunset Orange":  "#f97316", "Royal Purple":   "#7c3aed",
    "Fire Red":       "#ef4444", "Midnight Black": "#0a0a0a",
    "Golden Yellow":  "#eab308", "Hot Pink":       "#ec4899",
    "Cyan":           "#06b6d4", "Slate Gray":     "#64748b",
    "Rose Gold":      "#fb7185", "Deep Navy":      "#1e3a5f",
  };
  const FONT_MAP: Record<string, { body: string; heading: string; weight: number }> = {
    "Modern":            { body: "'Inter', system-ui, sans-serif",              heading: "'Inter', system-ui, sans-serif",              weight: 900 },
    "Classic & Elegant": { body: "'Georgia', 'Times New Roman', serif",         heading: "'Georgia', 'Times New Roman', serif",         weight: 700 },
    "Bold & Strong":     { body: "'Trebuchet MS', 'Arial Black', sans-serif",   heading: "'Trebuchet MS', 'Arial Black', sans-serif",   weight: 900 },
    "Clean & Minimal":   { body: "'Helvetica Neue', 'Arial', sans-serif",       heading: "'Helvetica Neue', 'Arial', sans-serif",       weight: 700 },
  };
  const LAYOUT_MAP: Record<string, string> = {
    "Standard": "1200px", "Centered": "800px", "Full Width": "100%",
  };

  function yearsLabel(years: string | undefined): string {
    if (!years || years === "Less than 1 year") return "New";
    if (years === "10+ years") return "10+";
    const match = years.match(/^(\d+)/);
    return match ? match[1] : years;
  }

  const {
    businessName, location, contactEmail, contactPhone,
    services, industry,
    tagline: userTagline, description, yearsInBusiness,
    facebookUrl, instagramUrl, googleBusinessUrl,
    businessHours, serviceArea,
    fontStyle = "Modern",
    heroStyle = "Photo Background",
    layoutStyle = "Standard",
  } = site;

  const accent      = COLOR_MAP[site.primaryColor] ?? "#10b981";
  const accentLight = `${accent}18`;
  const accentMid   = `${accent}30`;
  const font        = FONT_MAP[fontStyle] ?? FONT_MAP["Modern"];
  const maxWidth    = LAYOUT_MAP[layoutStyle] ?? "1200px";
  const heroPhotoId = INDUSTRY_PHOTO[industry] ?? 338;
  const heroImage   = `https://picsum.photos/id/${heroPhotoId}/1600/900`;

  const servicesList = Array.isArray(c.services_list)
    ? c.services_list
    : services.split(",").map((s) => s.trim()).slice(0, 6);

  function heroBackground(): React.CSSProperties {
    if (heroStyle === "Photo Background") {
      return { backgroundImage: `url(${heroImage})`, backgroundSize: "cover", backgroundPosition: "center" };
    }
    if (heroStyle === "Gradient Background") {
      return { background: `linear-gradient(135deg, ${accent} 0%, ${accent}cc 40%, #0a0a1a 100%)` };
    }
    return { background: accent };
  }

  const hasSocialLinks = facebookUrl || instagramUrl || googleBusinessUrl;

  return (
    <div style={{ fontFamily: font.body, color: "#1a1a1a", background: "#ffffff" }}>

      {isOwner && <SiteShareBar siteId={site.siteId} subdomainSlug={site.subdomainSlug} />}
      {siteIsPaused && <PausedOverlay />}
      {isOwner && <div style={{ height: "48px" }} />}
      

      {/* NAVBAR */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #e5e7eb", padding: "0 1.5rem" }}>
        <div style={{ maxWidth, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
          <a href="#home" style={{ fontWeight: font.weight, fontFamily: font.heading, fontSize: "1.25rem", color: "#1a1a1a", textDecoration: "none", letterSpacing: "-0.03em" }}>
            {businessName}
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            {["Home", "Services", "About", "Contact"].map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} style={{ fontSize: "0.875rem", fontWeight: 500, color: "#6b7280", textDecoration: "none" }}>{link}</a>
            ))}
            <a href="#contact" style={{ background: accent, color: "#fff", fontWeight: 700, fontSize: "0.875rem", padding: "0.5rem 1.25rem", borderRadius: "8px", textDecoration: "none" }}>
              {c.cta_text}
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" style={{ minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "5rem 1.5rem", position: "relative", overflow: "hidden", ...heroBackground() }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: heroStyle === "Photo Background" ? "linear-gradient(135deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.7) 100%)" : "rgba(0,0,0,0.35)" }} />
        {heroStyle === "Photo Background" && (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `linear-gradient(to bottom right, ${accent}22 0%, transparent 60%)` }} />
        )}
        <div style={{ position: "relative", maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(8px)", borderRadius: "100px", padding: "6px 14px", fontSize: "0.75rem", fontWeight: 600, color: "#ffffff", marginBottom: "1.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ffffff", display: "inline-block" }} />
            {serviceArea || location}
          </div>
          <h1 style={{ fontFamily: font.heading, fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: font.weight, lineHeight: 1.05, letterSpacing: "-0.03em", color: "#ffffff", marginBottom: "1.5rem", textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}>
            {c.hero_headline}
          </h1>
          <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.85)", maxWidth: "560px", margin: "0 auto 2.5rem", lineHeight: 1.7, textShadow: "0 1px 8px rgba(0,0,0,0.3)" }}>
            {c.hero_subheadline}
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#contact" style={{ background: accent, color: "#fff", fontWeight: 700, fontSize: "1rem", padding: "0.875rem 2rem", borderRadius: "10px", textDecoration: "none", boxShadow: `0 8px 24px ${accentMid}` }}>{c.cta_text}</a>
            <a href="#services" style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", color: "#ffffff", fontWeight: 600, fontSize: "1rem", padding: "0.875rem 2rem", borderRadius: "10px", textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.3)" }}>See Our Services</a>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding: "6rem 1.5rem", background: "#f9fafb" }}>
        <div style={{ maxWidth, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: accent, marginBottom: "0.75rem" }}>What We Do</p>
            <h2 style={{ fontFamily: font.heading, fontSize: "2.5rem", fontWeight: font.weight, letterSpacing: "-0.03em", color: "#111" }}>Our Services</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.25rem" }}>
            {servicesList.map((service: string, i: number) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "1.75rem", borderTop: `3px solid ${accent}` }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: accentLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem", fontSize: "1.25rem" }}>✓</div>
                <h3 style={{ fontFamily: font.heading, fontSize: "1rem", fontWeight: 700, color: "#111", marginBottom: "0.5rem" }}>{service}</h3>
                <p style={{ fontSize: "0.875rem", color: "#6b7280", lineHeight: 1.6 }}>Professional {service.toLowerCase()} services in {location}.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: "6rem 1.5rem", background: "#fff" }}>
        <div style={{ maxWidth, margin: "0 auto", display: "flex", gap: "4rem", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: "0 0 auto", width: "280px", background: `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)`, borderRadius: "24px", padding: "3rem 2rem", color: "#fff", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏆</div>
            <div style={{ fontFamily: font.heading, fontSize: "2.5rem", fontWeight: font.weight, lineHeight: 1 }}>{yearsLabel(yearsInBusiness)}</div>
            <div style={{ fontSize: "0.875rem", opacity: 0.85, marginTop: "0.5rem" }}>{yearsInBusiness === "Less than 1 year" ? "Year in Business" : "Years of Experience"}</div>
            {serviceArea && <div style={{ fontSize: "0.78rem", opacity: 0.75, marginTop: "1rem", lineHeight: 1.4 }}>📍 {serviceArea}</div>}
          </div>
          <div style={{ flex: 1, minWidth: "260px" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: accent, marginBottom: "0.75rem" }}>About Us</p>
            <h2 style={{ fontFamily: font.heading, fontSize: "2rem", fontWeight: font.weight, letterSpacing: "-0.03em", color: "#111", marginBottom: "1.25rem" }}>{userTagline || c.tagline}</h2>
            <p style={{ fontSize: "1rem", color: "#6b7280", lineHeight: 1.8, marginBottom: "1.5rem" }}>{description || c.about_text}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {contactEmail && <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.9rem", color: "#374151" }}><span style={{ color: accent, fontWeight: 700 }}>✉</span><a href={`mailto:${contactEmail}`} style={{ color: "#374151", textDecoration: "none" }}>{contactEmail}</a></div>}
              {contactPhone && <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.9rem", color: "#374151" }}><span style={{ color: accent, fontWeight: 700 }}>✆</span><a href={`tel:${contactPhone}`} style={{ color: "#374151", textDecoration: "none" }}>{contactPhone}</a></div>}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.9rem", color: "#374151" }}><span style={{ color: accent, fontWeight: 700 }}>📍</span>{serviceArea || location}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: "6rem 1.5rem", background: "#f9fafb" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: accent, marginBottom: "0.75rem" }}>Get In Touch</p>
          <h2 style={{ fontFamily: font.heading, fontSize: "2.25rem", fontWeight: font.weight, letterSpacing: "-0.03em", color: "#111", marginBottom: "1rem" }}>Ready to Get Started?</h2>
          <p style={{ color: "#6b7280", marginBottom: "2.5rem", lineHeight: 1.7 }}>Contact us today for a free estimate. We serve {serviceArea || `${location} and surrounding areas`}.</p>
          {businessHours && (
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "2rem", textAlign: "left", display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
              <span style={{ color: accent, fontSize: "1.25rem", flexShrink: 0 }}>🕐</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "#111", marginBottom: "0.25rem" }}>Business Hours</div>
                <div style={{ fontSize: "0.875rem", color: "#6b7280", lineHeight: 1.6 }}>{businessHours}</div>
              </div>
            </div>
          )}
          <form style={{ display: "flex", flexDirection: "column", gap: "1rem", textAlign: "left" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <input type="text" placeholder="Your Name" style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: "10px", padding: "0.875rem 1rem", fontSize: "0.9rem", outline: "none" }} />
              <input type="email" placeholder="Your Email" style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: "10px", padding: "0.875rem 1rem", fontSize: "0.9rem", outline: "none" }} />
            </div>
            <input type="tel" placeholder="Your Phone" style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: "10px", padding: "0.875rem 1rem", fontSize: "0.9rem", outline: "none" }} />
            <textarea placeholder="Tell us about your project..." rows={4} style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: "10px", padding: "0.875rem 1rem", fontSize: "0.9rem", outline: "none", resize: "vertical" }} />
            <button type="button" style={{ background: accent, color: "#fff", fontWeight: 700, fontSize: "1rem", padding: "1rem", borderRadius: "10px", border: "none", cursor: "pointer", boxShadow: `0 8px 24px ${accentMid}` }}>Send Message</button>
          </form>
          {(contactEmail || contactPhone) && (
            <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginTop: "2rem", flexWrap: "wrap" }}>
              {contactEmail && <a href={`mailto:${contactEmail}`} style={{ fontSize: "0.875rem", color: "#6b7280", textDecoration: "none" }}>✉ {contactEmail}</a>}
              {contactPhone && <a href={`tel:${contactPhone}`} style={{ fontSize: "0.875rem", color: "#6b7280", textDecoration: "none" }}>✆ {contactPhone}</a>}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#111", color: "#9ca3af", padding: "3rem 1.5rem" }}>
        <div style={{ maxWidth, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "2rem", marginBottom: "2rem" }}>
            <div>
              <div style={{ fontFamily: font.heading, fontWeight: font.weight, fontSize: "1.25rem", color: "#fff", marginBottom: "0.5rem", letterSpacing: "-0.03em" }}>{businessName}</div>
              <div style={{ fontSize: "0.875rem", color: "#6b7280", maxWidth: "260px", lineHeight: 1.6 }}>{userTagline || c.tagline}</div>
            </div>
            {hasSocialLinks && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#4b5563", marginBottom: "0.5rem" }}>Follow Us</div>
                {facebookUrl && <a href={facebookUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.875rem", color: "#9ca3af", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}><span style={{ color: "#3b82f6" }}>f</span> Facebook</a>}
                {instagramUrl && <a href={instagramUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.875rem", color: "#9ca3af", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}><span style={{ color: "#ec4899" }}>◎</span> Instagram</a>}
                {googleBusinessUrl && <a href={googleBusinessUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.875rem", color: "#9ca3af", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}><span style={{ color: "#34d399" }}>G</span> Google Business</a>}
              </div>
            )}
            {(contactEmail || contactPhone) && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#4b5563", marginBottom: "0.5rem" }}>Contact</div>
                {contactEmail && <a href={`mailto:${contactEmail}`} style={{ fontSize: "0.875rem", color: "#9ca3af", textDecoration: "none" }}>✉ {contactEmail}</a>}
                {contactPhone && <a href={`tel:${contactPhone}`} style={{ fontSize: "0.875rem", color: "#9ca3af", textDecoration: "none" }}>✆ {contactPhone}</a>}
              </div>
            )}
          </div>
          <div style={{ borderTop: "1px solid #1f2937", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
            <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>© {new Date().getFullYear()} {businessName}. All rights reserved. · {location}</div>
            <div style={{ fontSize: "0.7rem", color: "#374151" }}>Built with <a href="https://baileyagents.com" style={{ color: "#10b981", textDecoration: "none" }}>BaileyAgents</a></div>
          </div>
        </div>
      </footer>

      {site.enableChat && <SiteChat site={site} />}
    </div>
  );
}

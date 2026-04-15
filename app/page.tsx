import TemplatePreviews from "@/components/TemplatePreviews";
import HeroSection from "@/components/HeroSection";
import DealBanner from "@/components/DealBanner";

// ── TAC SECTION HEADER ──────────────────────────────────────────────────────
function TacSectionLabel({ code, title, sub }: { code: string; title: string; sub?: string }) {
  return (
    <div className="text-center mb-14">
      <div
        className="inline-flex items-center gap-2 mb-4"
        style={{ fontFamily: "var(--font-tactical)" }}
      >
        <span style={{ fontSize: "9px", color: "#4b5320", letterSpacing: "0.2em", border: "1px solid rgba(75,83,32,0.3)", padding: "2px 8px" }}>
          {code}
        </span>
        <span style={{ width: "24px", height: "1px", background: "rgba(75,83,32,0.4)" }} />
        <span style={{ fontSize: "9px", color: "#ffb000", letterSpacing: "0.15em" }}>CLASSIFIED</span>
      </div>
      <h2
        className="text-3xl md:text-4xl font-black uppercase tracking-widest"
        style={{ fontFamily: "var(--font-tactical)", color: "#e5e5e0", letterSpacing: "0.08em" }}
      >
        {title}
      </h2>
      {sub && (
        <p
          className="mt-3 max-w-xl mx-auto text-sm leading-relaxed"
          style={{ color: "#6b7280", fontFamily: "var(--font-tactical)", letterSpacing: "0.04em" }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

// ── TAC DIVIDER ─────────────────────────────────────────────────────────────
function TacDivider() {
  return <div className="tac-divider my-0" />;
}

export default function Home() {
  return (
    <div
      style={{
        background: "#0a0b0c",
        color: "#e5e5e0",
        overflowX: "hidden",
        fontFamily: "var(--font-tactical)",
      }}
    >
      <DealBanner />

      {/* ── SECTION 1: HERO ──────────────────────────────────────────────────── */}
      <HeroSection />

      <TacDivider />

      {/* ── SYSTEM STATUS ROW ────────────────────────────────────────────────── */}
      <section style={{ background: "#0d0e0f", padding: "14px 24px" }}>
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-6 md:gap-12">
          {[
            { code: "SYS-01", label: "60-SECOND SETUP" },
            { code: "SYS-02", label: "5 PREMIUM TEMPLATES" },
            { code: "SYS-03", label: "REAL LEAD FINDER" },
            { code: "SYS-04", label: "AI CHAT INCLUDED" },
            { code: "SYS-05", label: "STRIPE SECURED" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span style={{ fontSize: "9px", color: "#4b5320", fontFamily: "var(--font-tactical)", letterSpacing: "0.1em", border: "1px solid rgba(75,83,32,0.3)", padding: "1px 5px" }}>
                {s.code}
              </span>
              <span style={{ fontSize: "11px", color: "#6b7280", fontFamily: "var(--font-tactical)", letterSpacing: "0.12em" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <TacDivider />

      {/* ── SECTION 2: TEMPLATE PREVIEWS ─────────────────────────────────────── */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <TacSectionLabel
          code="INTEL-002"
          title="MISSION ASSETS"
          sub="5 TACTICAL TEMPLATES, EACH AI-BUILT AND READY TO DEPLOY ON CONTACT."
        />
        <TemplatePreviews />
      </section>

      <TacDivider />

      {/* ── SECTION 3: HOW IT WORKS — 3 STEPS ───────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: "#0d0e0f" }}>
        <div className="max-w-5xl mx-auto">
          <TacSectionLabel
            code="OPS-003"
            title="DEPLOYMENT SEQUENCE"
          />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: "01", title: "IDENTIFY TARGET", desc: "State your business name, sector, and objectives. Briefing takes under 60 seconds." },
              { n: "02", title: "AI CONSTRUCTS ASSET", desc: "Autonomous AI generates a full custom site with real imagery, copy, and brand calibration." },
              { n: "03", title: "GO LIVE IMMEDIATELY", desc: "Asset deployed to custom subdomain. Share it. Convert with it. Scale from it." },
            ].map((step) => (
              <div key={step.n} className="text-center relative">
                {/* Step indicator */}
                <div
                  className="mx-auto mb-5 flex items-center justify-center"
                  style={{
                    width: "56px",
                    height: "56px",
                    border: "1px solid rgba(75,83,32,0.5)",
                    background: "#0a0b0c",
                    clipPath: "polygon(8px 0%, calc(100% - 8px) 0%, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0% calc(100% - 8px), 0% 8px)",
                    position: "relative",
                  }}
                >
                  <span style={{ fontSize: "16px", fontWeight: 900, color: "#ffb000", fontFamily: "var(--font-tactical)" }}>{step.n}</span>
                </div>
                <h3
                  className="font-black mb-2 uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-tactical)", fontSize: "12px", color: "#e5e5e0", letterSpacing: "0.12em" }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: "12px", color: "#6b7280", lineHeight: 1.6, fontFamily: "var(--font-tactical)" }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TacDivider />

      {/* ── SECTION: LIVE EXAMPLES ───────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <TacSectionLabel
            code="FIELD-004"
            title="DEPLOYED ASSETS"
            sub="EVERY SITE BELOW WAS GENERATED BY AI IN UNDER 2 MINUTES. FULLY OPERATIONAL."
          />
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                name: "CHUBBYS FITNESS",
                url: "https://chubbys-fitness.baileyagents.com",
                tag: "GYM · ROCKFORD, IL · CYBERPUNK",
                code: "ASSET-F01",
                color: "#ff6b35",
              },
              {
                name: "VELVET & VINE",
                url: "https://velvet-vine.baileyagents.com",
                tag: "WINE BAR · NASHVILLE, TN · CINEMATIC",
                code: "ASSET-F02",
                color: "#ffb000",
              },
              {
                name: "IRON & OAK BARBERSHOP",
                url: "https://iron-oak-barbershop.baileyagents.com",
                tag: "BARBERSHOP · CHICAGO, IL · LUXURY",
                code: "ASSET-F03",
                color: "#00d4ff",
              },
            ].map((site) => (
              <a
                key={site.name}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-4 transition-all"
                style={{
                  background: "#0d0e0f",
                  borderLeft: `3px solid ${site.color}`,
                  borderTop: "1px solid rgba(75,83,32,0.2)",
                  borderRight: "1px solid rgba(75,83,32,0.15)",
                  borderBottom: "1px solid rgba(75,83,32,0.15)",
                  padding: "20px",
                  clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 0 20px rgba(75,83,32,0.2)`;
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(75,83,32,0.05)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLAnchorElement).style.background = "#0d0e0f";
                }}
              >
                <span style={{ fontSize: "9px", color: "#4b5320", fontFamily: "var(--font-tactical)", letterSpacing: "0.15em", border: "1px solid rgba(75,83,32,0.3)", padding: "2px 6px", display: "inline-block" }}>
                  {site.code}
                </span>
                <div>
                  <h3
                    className="font-bold uppercase tracking-widest mb-1"
                    style={{ fontFamily: "var(--font-tactical)", fontSize: "13px", color: "#e5e5e0" }}
                  >
                    {site.name}
                  </h3>
                  <p style={{ fontSize: "9px", color: "#4b5563", fontFamily: "var(--font-tactical)", letterSpacing: "0.1em" }}>{site.tag}</p>
                </div>
                <span
                  className="text-xs font-bold uppercase tracking-widest transition-colors"
                  style={{ color: site.color, fontFamily: "var(--font-tactical)" }}
                >
                  ▶ VIEW LIVE →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <TacDivider />

      {/* ── SECTION 4: HOW IT WORKS ──────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-20 px-6"
        style={{ background: "#0d0e0f" }}
      >
        <div className="max-w-7xl mx-auto">
          <TacSectionLabel code="PROC-005" title="OPERATIONAL PROTOCOL" />

          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%]" style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(75,83,32,0.4), rgba(255,176,0,0.3), rgba(75,83,32,0.4), transparent)" }} />

            <div className="grid md:grid-cols-4 gap-8">
              {[
                { n: "01", title: "INTEL GATHERING", desc: "Describe your business, goals, and requirements. 2 minutes total." },
                { n: "02", title: "AI BUILDS", desc: "Autonomous agents deploy — website, content, automations — all configured." },
                { n: "03", title: "REVIEW & REFINE", desc: "Walk through deliverables and calibrate until mission parameters satisfied." },
                { n: "04", title: "MISSION LAUNCH", desc: "Site goes live. Agents activate. Revenue begins deployment." },
              ].map((step) => (
                <div key={step.n} className="text-center relative">
                  <div
                    className="mx-auto mb-5 flex items-center justify-center relative z-10"
                    style={{
                      width: "48px",
                      height: "48px",
                      border: "1px solid rgba(75,83,32,0.5)",
                      background: "#0a0b0c",
                      clipPath: "polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)",
                    }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: 900, color: "#ffb000", fontFamily: "var(--font-tactical)" }}>{step.n}</span>
                  </div>
                  <h3
                    className="font-black mb-2 uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-tactical)", fontSize: "11px", color: "#e5e5e0", letterSpacing: "0.12em" }}
                  >
                    {step.title}
                  </h3>
                  <p style={{ fontSize: "11px", color: "#6b7280", lineHeight: 1.6, fontFamily: "var(--font-tactical)" }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TacDivider />

      {/* ── SECTION 6: DASHBOARD MOCKUP ──────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: "#0d0e0f" }}>
        <div className="max-w-7xl mx-auto">
          <TacSectionLabel
            code="SYS-006"
            title="COMMAND CENTER"
            sub="MONITOR ASSETS, AGENTS, AND REVENUE FROM ONE UNIFIED TACTICAL DASHBOARD."
          />

          {/* Mockup */}
          <div
            className="max-w-5xl mx-auto overflow-hidden"
            style={{
              background: "#0a0b0c",
              border: "1px solid rgba(75,83,32,0.4)",
              boxShadow: "0 0 60px rgba(75,83,32,0.1)",
            }}
          >
            {/* App chrome */}
            <div
              className="flex items-center gap-2 px-4 py-2.5"
              style={{ borderBottom: "1px solid rgba(75,83,32,0.3)", background: "rgba(75,83,32,0.06)" }}
            >
              <div style={{ width: "8px", height: "8px", background: "#ff6b35", borderRadius: "1px" }} />
              <div style={{ width: "8px", height: "8px", background: "#ffb000", borderRadius: "1px" }} />
              <div style={{ width: "8px", height: "8px", background: "#4b5320", borderRadius: "1px" }} />
              <div className="flex-1 flex items-center gap-2 ml-3">
                <div style={{ background: "rgba(75,83,32,0.12)", borderRadius: "2px", height: "18px", width: "180px" }} />
                <span style={{ fontSize: "9px", color: "#4b5320", fontFamily: "var(--font-tactical)", letterSpacing: "0.1em" }}>BAILEY-CMD v2.1 ■ SECURE</span>
              </div>
            </div>

            <div className="flex min-h-[380px]">
              {/* Sidebar */}
              <div
                className="w-48 p-4 hidden md:block"
                style={{ borderRight: "1px solid rgba(75,83,32,0.25)" }}
              >
                <div className="flex items-center gap-2 mb-5 px-2">
                  <div style={{ width: "20px", height: "20px", background: "rgba(255,176,0,0.15)", border: "1px solid rgba(255,176,0,0.3)" }} />
                  <div style={{ height: "2px", background: "rgba(75,83,32,0.3)", flex: 1 }} />
                </div>
                <div className="space-y-0.5">
                  {["OVERVIEW", "MY SITES", "AI AGENTS", "ANALYTICS", "BILLING", "SETTINGS"].map((item, i) => (
                    <div
                      key={item}
                      className="flex items-center gap-2.5 px-2 py-1.5"
                      style={{
                        background: i === 0 ? "rgba(255,176,0,0.08)" : "transparent",
                        borderLeft: i === 0 ? "2px solid #ffb000" : "2px solid transparent",
                      }}
                    >
                      <div style={{ width: "14px", height: "14px", background: i === 0 ? "rgba(255,176,0,0.2)" : "rgba(75,83,32,0.1)", border: `1px solid ${i === 0 ? "rgba(255,176,0,0.3)" : "rgba(75,83,32,0.2)"}` }} />
                      <span style={{ fontSize: "9px", color: i === 0 ? "#ffb000" : "#4b5563", fontFamily: "var(--font-tactical)", letterSpacing: "0.08em" }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main content */}
              <div className="flex-1 p-5">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div style={{ height: "3px", background: "rgba(75,83,32,0.3)", width: "120px", marginBottom: "6px" }} />
                    <div style={{ height: "2px", background: "rgba(75,83,32,0.15)", width: "80px" }} />
                  </div>
                  <div
                    style={{
                      background: "#ffb000",
                      color: "#0a0b0c",
                      fontSize: "9px",
                      fontWeight: 700,
                      padding: "4px 12px",
                      fontFamily: "var(--font-tactical)",
                      letterSpacing: "0.1em",
                      clipPath: "polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)",
                    }}
                  >
                    + DEPLOY ASSET
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: "ACTIVE SITES", value: "4", color: "#ffb000" },
                    { label: "TOTAL LEADS", value: "247", color: "#00d4ff" },
                    { label: "REVENUE", value: "$8.4K", color: "#4b5320" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      style={{
                        background: "#0d0e0f",
                        border: "1px solid rgba(75,83,32,0.25)",
                        padding: "12px",
                        borderLeft: `2px solid ${stat.color}`,
                      }}
                    >
                      <p style={{ fontSize: "8px", color: "#4b5563", fontFamily: "var(--font-tactical)", letterSpacing: "0.1em", marginBottom: "4px" }}>{stat.label}</p>
                      <p style={{ fontSize: "20px", fontWeight: 900, color: stat.color, fontFamily: "var(--font-tactical)" }}>{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Site list */}
                <div className="space-y-2">
                  <p style={{ fontSize: "8px", color: "#4b5320", fontFamily: "var(--font-tactical)", letterSpacing: "0.2em", marginBottom: "8px" }}>■ DEPLOYED ASSETS</p>
                  {[
                    { name: "APEX FITNESS", status: "LIVE", traffic: "1.2K/MO" },
                    { name: "NEON LEGAL", status: "LIVE", traffic: "890/MO" },
                    { name: "SWIFT REALTY", status: "BUILDING", traffic: "—" },
                  ].map((site) => (
                    <div
                      key={site.name}
                      className="flex items-center justify-between px-3 py-2"
                      style={{ background: "#0d0e0f", border: "1px solid rgba(75,83,32,0.2)" }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div style={{ width: "28px", height: "28px", background: "rgba(75,83,32,0.1)", border: "1px solid rgba(75,83,32,0.2)" }} />
                        <div>
                          <p style={{ fontSize: "10px", fontWeight: 700, color: "#e5e5e0", fontFamily: "var(--font-tactical)", letterSpacing: "0.06em" }}>{site.name}</p>
                          <p style={{ fontSize: "8px", color: "#4b5563", fontFamily: "var(--font-tactical)", letterSpacing: "0.08em" }}>{site.traffic} VISITORS</p>
                        </div>
                      </div>
                      <span style={{
                        fontSize: "8px",
                        padding: "2px 8px",
                        fontFamily: "var(--font-tactical)",
                        letterSpacing: "0.1em",
                        background: site.status === "LIVE" ? "rgba(255,176,0,0.08)" : "rgba(255,176,0,0.04)",
                        color: site.status === "LIVE" ? "#ffb000" : "#6b7280",
                        border: `1px solid ${site.status === "LIVE" ? "rgba(255,176,0,0.3)" : "rgba(75,83,32,0.2)"}`,
                      }}>
                        {site.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TacDivider />

      {/* ── SECTION: FIELD REPORTS / TESTIMONIALS ────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: "#0d0e0f" }}>
        <div className="max-w-7xl mx-auto">
          <TacSectionLabel
            code="INTEL-007"
            title="FIELD REPORTS"
            sub="VERIFIED MISSION RESULTS FROM 2,400+ DEPLOYED OPERATORS."
          />

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                quote: "Bailey built my plumbing website in under 2 minutes. I got 3 new customer calls the first week it went live.",
                name: "DEREK M.",
                role: "PLUMBING OPERATOR",
                rating: "★★★★★",
                code: "RPT-001",
                color: "#10b981",
              },
              {
                quote: "The Lead Hunter found me 40 local restaurants to pitch in 5 minutes. Closed my first deal within 48 hours.",
                name: "PRIYA S.",
                role: "MARKETING AGENCY",
                rating: "★★★★★",
                code: "RPT-002",
                color: "#ffb000",
              },
              {
                quote: "Cancelled my $180/month web agency the same day I found BaileyAgents. Never looking back.",
                name: "TONY R.",
                role: "RESTAURANT OPERATOR",
                rating: "★★★★★",
                code: "RPT-003",
                color: "#00d4ff",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="flex flex-col gap-4 transition-all"
                style={{
                  background: "#0a0b0c",
                  borderLeft: `3px solid ${t.color}`,
                  borderTop: "1px solid rgba(75,83,32,0.2)",
                  borderRight: "1px solid rgba(75,83,32,0.15)",
                  borderBottom: "1px solid rgba(75,83,32,0.15)",
                  padding: "20px",
                  clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: "9px", color: "#4b5320", fontFamily: "var(--font-tactical)", letterSpacing: "0.15em", border: "1px solid rgba(75,83,32,0.3)", padding: "2px 6px" }}>
                    {t.code}
                  </span>
                  <span style={{ color: t.color, fontSize: "11px", letterSpacing: "2px" }}>{t.rating}</span>
                </div>

                <p style={{ color: "#9ca3af", fontSize: "12px", lineHeight: 1.7, fontFamily: "var(--font-tactical)", flex: 1 }}>
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div
                  style={{ borderTop: "1px solid rgba(75,83,32,0.2)", paddingTop: "12px" }}
                >
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "#e5e5e0", fontFamily: "var(--font-tactical)", letterSpacing: "0.1em" }}>{t.name}</p>
                  <p style={{ fontSize: "9px", color: "#4b5563", fontFamily: "var(--font-tactical)", letterSpacing: "0.12em" }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TacDivider />

      {/* ── SECTION 7: CTA BANNER ────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="relative overflow-hidden"
            style={{
              background: "#0d0e0f",
              border: "1px solid rgba(75,83,32,0.4)",
              padding: "64px 48px",
              boxShadow: "0 0 60px rgba(75,83,32,0.08)",
            }}
          >
            {/* Corner markers */}
            {[
              "top-0 left-0",
              "top-0 right-0 rotate-90",
              "bottom-0 right-0 rotate-180",
              "bottom-0 left-0 -rotate-90",
            ].map((pos, i) => (
              <div
                key={i}
                className={`absolute ${pos}`}
                style={{ pointerEvents: "none" }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M1 10 L1 1 L10 1" stroke="#4b5320" strokeWidth="1" strokeLinecap="round" />
                </svg>
              </div>
            ))}

            {/* Glow */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(75,83,32,0.1) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            <div style={{ position: "relative", zIndex: 1 }}>
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 mb-6"
                style={{
                  background: "rgba(255,176,0,0.08)",
                  border: "1px solid rgba(255,176,0,0.3)",
                  padding: "4px 16px",
                  fontFamily: "var(--font-tactical)",
                }}
              >
                <span className="tac-blink" style={{ width: "6px", height: "6px", background: "#ffb000", borderRadius: "1px", display: "block" }} />
                <span style={{ fontSize: "9px", color: "#ffb000", letterSpacing: "0.2em" }}>MISSION BRIEFING AVAILABLE</span>
              </div>

              <h2
                className="font-black uppercase tracking-widest mb-5"
                style={{ fontFamily: "var(--font-tactical)", fontSize: "clamp(1.5rem, 4vw, 2.5rem)", color: "#e5e5e0", letterSpacing: "0.06em" }}
              >
                YOUR BUSINESS DESERVES TO<br />
                GO LIVE <span style={{ color: "#ffb000" }}>TODAY</span>
              </h2>

              <p
                className="text-sm mb-10 max-w-lg mx-auto"
                style={{ color: "#6b7280", fontFamily: "var(--font-tactical)", letterSpacing: "0.06em", lineHeight: 1.7 }}
              >
                STOP WAITING. DEPLOY FAST. SHIP RIGHT. RESULTS GUARANTEED.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/login"
                  className="font-bold uppercase tracking-widest text-xs px-8 py-4 transition-all"
                  style={{
                    background: "#ffb000",
                    color: "#0a0b0c",
                    fontFamily: "var(--font-tactical)",
                    clipPath: "polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 20px rgba(255,176,0,0.4)";
                    (e.currentTarget as HTMLAnchorElement).style.background = "#e09e00";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                    (e.currentTarget as HTMLAnchorElement).style.background = "#ffb000";
                  }}
                >
                  ▶ REQUEST BRIEFING →
                </a>
                <a
                  href="mailto:Lilianajs27@gmail.com"
                  className="font-bold uppercase tracking-widest text-xs px-8 py-4 transition-all"
                  style={{
                    border: "1px solid rgba(75,83,32,0.5)",
                    color: "#9ca3af",
                    fontFamily: "var(--font-tactical)",
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "#ffb000";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#ffb000";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(75,83,32,0.5)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#9ca3af";
                  }}
                >
                  OPEN COMMS
                </a>
              </div>

              <p
                className="text-[10px] mt-5 uppercase tracking-widest"
                style={{ color: "#374151", fontFamily: "var(--font-tactical)" }}
              >
                7-DAY FREE TRIAL · CANCEL ANYTIME · NO QUESTIONS ASKED
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

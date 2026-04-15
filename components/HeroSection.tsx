"use client";

import { HeroInput } from "@/components/HeroInput";
import HeroHeadline from "@/components/HeroHeadline";

export default function HeroSection() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0b0c",
      }}
    >
      {/* Blueprint grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(75,83,32,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(75,83,32,0.07) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          zIndex: 0,
        }}
      />

      {/* Radial fade center */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(75,83,32,0.12) 0%, transparent 70%)",
          zIndex: 1,
        }}
      />

      {/* Corner bracket — top left */}
      <div style={{ position: "absolute", top: "72px", left: "24px", zIndex: 2, pointerEvents: "none" }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M2 20 L2 2 L20 2" stroke="#4b5320" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="2" cy="2" r="2" fill="#ffb000" />
        </svg>
      </div>
      {/* Corner bracket — top right */}
      <div style={{ position: "absolute", top: "72px", right: "24px", zIndex: 2, pointerEvents: "none" }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M38 20 L38 2 L20 2" stroke="#4b5320" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="38" cy="2" r="2" fill="#ffb000" />
        </svg>
      </div>
      {/* Corner bracket — bottom left */}
      <div style={{ position: "absolute", bottom: "32px", left: "24px", zIndex: 2, pointerEvents: "none" }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M2 20 L2 38 L20 38" stroke="#4b5320" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="2" cy="38" r="2" fill="#4b5320" />
        </svg>
      </div>
      {/* Corner bracket — bottom right */}
      <div style={{ position: "absolute", bottom: "32px", right: "24px", zIndex: 2, pointerEvents: "none" }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M38 20 L38 38 L20 38" stroke="#4b5320" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="38" cy="38" r="2" fill="#4b5320" />
        </svg>
      </div>

      {/* Center crosshair */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          zIndex: 0,
          pointerEvents: "none",
          opacity: 0.06,
        }}
      >
        <svg width="600" height="600" viewBox="0 0 600 600" fill="none">
          <circle cx="300" cy="300" r="240" stroke="#ffb000" strokeWidth="1" strokeDasharray="4 8" />
          <circle cx="300" cy="300" r="160" stroke="#4b5320" strokeWidth="1" />
          <circle cx="300" cy="300" r="80" stroke="#ffb000" strokeWidth="1" />
          <circle cx="300" cy="300" r="8" stroke="#ffb000" strokeWidth="1.5" />
          <line x1="0" y1="300" x2="260" y2="300" stroke="#4b5320" strokeWidth="1" />
          <line x1="340" y1="300" x2="600" y2="300" stroke="#4b5320" strokeWidth="1" />
          <line x1="300" y1="0" x2="300" y2="260" stroke="#4b5320" strokeWidth="1" />
          <line x1="300" y1="340" x2="300" y2="600" stroke="#4b5320" strokeWidth="1" />
        </svg>
      </div>

      {/* Side data panels (decorative) */}
      <div style={{ position: "absolute", left: "24px", top: "50%", transform: "translateY(-50%)", zIndex: 2, pointerEvents: "none" }} className="hidden xl:flex flex-col gap-2">
        {["SYS: ONLINE", "AI: ACTIVE", "OPS: READY"].map((line, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "6px", height: "6px", background: i === 0 ? "#ffb000" : "#4b5320", borderRadius: "1px" }} />
            <span style={{ fontSize: "9px", color: "#4b5320", fontFamily: "var(--font-tactical)", letterSpacing: "0.15em" }}>{line}</span>
          </div>
        ))}
        <div style={{ marginTop: "8px", width: "1px", height: "40px", background: "linear-gradient(to bottom, rgba(75,83,32,0.6), transparent)", marginLeft: "2.5px" }} />
      </div>
      <div style={{ position: "absolute", right: "24px", top: "50%", transform: "translateY(-50%)", zIndex: 2, pointerEvents: "none" }} className="hidden xl:flex flex-col gap-2 items-end">
        {["TARGET: ACQUIRED", "LAUNCH: ARMED", "STATUS: GO"].map((line, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "9px", color: "#4b5320", fontFamily: "var(--font-tactical)", letterSpacing: "0.15em" }}>{line}</span>
            <div style={{ width: "6px", height: "6px", background: i === 2 ? "#ffb000" : "#4b5320", borderRadius: "1px" }} />
          </div>
        ))}
        <div style={{ marginTop: "8px", width: "1px", height: "40px", background: "linear-gradient(to bottom, rgba(75,83,32,0.6), transparent)", marginLeft: "auto", marginRight: "2.5px" }} />
      </div>

      {/* Hero content */}
      <div style={{ position: "relative", zIndex: 3, width: "100%" }}>
        <div className="max-w-4xl mx-auto text-center px-6 pt-24 pb-16">

          {/* Tactical badge */}
          <div
            className="inline-flex items-center gap-3 mb-8"
            style={{
              background: "rgba(10,11,12,0.9)",
              border: "1px solid rgba(75,83,32,0.6)",
              padding: "6px 16px",
              fontFamily: "var(--font-tactical)",
              boxShadow: "0 0 20px rgba(75,83,32,0.15)",
            }}
          >
            <span
              className="tac-blink"
              style={{ display: "block", width: "8px", height: "8px", background: "#ffb000", borderRadius: "1px" }}
            />
            <span style={{ fontSize: "10px", color: "#9ca3af", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              TACTICAL AI PLATFORM · UNIT BAILEY-001
            </span>
            <span style={{ fontSize: "10px", color: "#4b5320", letterSpacing: "0.1em" }}>■ CLASSIFIED</span>
          </div>

          {/* H1 */}
          <HeroHeadline />

          {/* Subheadline */}
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{
              color: "#6b7280",
              fontFamily: "var(--font-tactical)",
              letterSpacing: "0.04em",
            }}
          >
            Generate a complete website, find leads, and create content — all powered by AI.
            No code. No designers. Just results.
          </p>

          {/* AI Input */}
          <HeroInput />

          {/* Social proof */}
          <div className="mt-6 flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <span
                style={{ fontSize: "9px", color: "#4b5563", fontFamily: "var(--font-tactical)", letterSpacing: "0.15em" }}
              >
                ▮ TRUSTED BY 2,400+ BUSINESSES
              </span>
              <span style={{ color: "rgba(75,83,32,0.4)", fontSize: "10px" }}>│</span>
              <span
                style={{ fontSize: "9px", color: "#4b5563", fontFamily: "var(--font-tactical)", letterSpacing: "0.15em" }}
              >
                SITES LIVE IN UNDER 3 MINUTES
              </span>
            </div>
            <span style={{ fontSize: "9px", color: "#374151", fontFamily: "var(--font-tactical)", letterSpacing: "0.1em" }}>
              CANCEL ANYTIME · NO QUESTIONS ASKED · 7-DAY FREE TRIAL
            </span>
          </div>

          {/* Bottom HUD readout */}
          <div
            className="flex items-center justify-center gap-6 mt-10"
            style={{ borderTop: "1px solid rgba(75,83,32,0.2)", paddingTop: "16px" }}
          >
            {[
              { label: "RESPONSE TIME", value: "38s" },
              { label: "PROJECTS DEPLOYED", value: "50+" },
              { label: "HOURS AUTOMATED", value: "760+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div style={{ fontSize: "18px", fontWeight: 900, color: "#ffb000", fontFamily: "var(--font-tactical)", letterSpacing: "0.05em" }}>{stat.value}</div>
                <div style={{ fontSize: "8px", color: "#4b5563", letterSpacing: "0.2em", fontFamily: "var(--font-tactical)" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

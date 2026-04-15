"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/sites/")) return null;

  return (
    <footer
      className="footer-section py-14 px-6"
      style={{
        background: "#0a0b0c",
        borderTop: "1px solid rgba(75,83,32,0.4)",
        boxShadow: "0 -1px 0 rgba(255,176,0,0.05)",
      }}
    >
      {/* Top CAD divider line */}
      <div className="tac-divider mb-10 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10">
          {/* Logo + tagline */}
          <div className="max-w-xs">
            <div
              className="flex items-center gap-2 mb-3"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: "#ffb000", flexShrink: 0 }}>
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span
                className="text-sm font-black uppercase tracking-widest footer-heading"
                style={{ fontFamily: "var(--font-tactical)", color: "#e5e5e0" }}
              >
                BAILEY<span style={{ color: "#ffb000" }}>AGENTS</span>
              </span>
            </div>
            <p
              className="text-xs leading-relaxed footer-text"
              style={{ color: "#6b7280", fontFamily: "var(--font-tactical)", letterSpacing: "0.05em" }}
            >
              AI-POWERED BUSINESS PLATFORM. CUSTOM AGENTS, WEBSITES, APPS, AND AUTOMATION FOR BUSINESSES READY TO DEPLOY.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <span
                className="system-status-dot"
                style={{ width: "6px", height: "6px", background: "#ffb000", borderRadius: "1px", flexShrink: 0 }}
              />
              <span
                className="text-xs system-status-text footer-text"
                style={{ fontFamily: "var(--font-tactical)", letterSpacing: "0.1em" }}
              >
                ACCEPTING NEW MISSIONS
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-12">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-4 footer-heading"
                style={{ color: "#4b5320", fontFamily: "var(--font-tactical)" }}
              >
                ◈ SERVICES
              </p>
              <ul className="space-y-2">
                {[
                  { label: "AI AGENTS", href: "#agents" },
                  { label: "WEBSITES", href: "#pricing" },
                  { label: "AUTOMATION", href: "#pricing" },
                  { label: "CONSULTING", href: "/consulting" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="footer-link text-xs uppercase tracking-widest transition-colors flex items-center gap-1"
                      style={{ color: "#6b7280", fontFamily: "var(--font-tactical)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#ffb000"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#6b7280"; }}
                    >
                      <span style={{ color: "#4b5320" }}>›</span> {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-4 footer-heading"
                style={{ color: "#4b5320", fontFamily: "var(--font-tactical)" }}
              >
                ◈ PRODUCT
              </p>
              <ul className="space-y-2">
                {[
                  { label: "BAILEY PRO", href: "/pro" },
                  { label: "BAILEY ELITE", href: "/elite" },
                  { label: "DASHBOARD", href: "/dashboard" },
                  { label: "LOGIN", href: "/login" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="footer-link text-xs uppercase tracking-widest transition-colors flex items-center gap-1"
                      style={{ color: "#6b7280", fontFamily: "var(--font-tactical)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#ffb000"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#6b7280"; }}
                    >
                      <span style={{ color: "#4b5320" }}>›</span> {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-4 footer-heading"
                style={{ color: "#4b5320", fontFamily: "var(--font-tactical)" }}
              >
                ◈ COMMS
              </p>
              <ul className="space-y-2">
                <li>
                  <a
                    href="mailto:Lilianajs27@gmail.com"
                    className="footer-link text-xs uppercase tracking-widest transition-colors flex items-center gap-1"
                    style={{ color: "#6b7280", fontFamily: "var(--font-tactical)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#ffb000"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#6b7280"; }}
                  >
                    <span style={{ color: "#4b5320" }}>›</span> EMAIL HQ
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+17798956325"
                    className="footer-link text-xs uppercase tracking-widest transition-colors flex items-center gap-1"
                    style={{ color: "#6b7280", fontFamily: "var(--font-tactical)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#ffb000"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#6b7280"; }}
                  >
                    <span style={{ color: "#4b5320" }}>›</span> 779-895-6325
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/profile.php?id=61588084179508"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link text-xs uppercase tracking-widest transition-colors flex items-center gap-1"
                    style={{ color: "#6b7280", fontFamily: "var(--font-tactical)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#ffb000"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#6b7280"; }}
                  >
                    <span style={{ color: "#4b5320" }}>›</span> FACEBOOK
                  </a>
                </li>
                <li>
                  <span
                    className="text-xs uppercase tracking-widest"
                    style={{ color: "#374151", fontFamily: "var(--font-tactical)" }}
                  >
                    ◌ MACHESNEY PARK, IL
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-5 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(75,83,32,0.2)" }}
        >
          <div
            className="flex flex-wrap items-center gap-2 text-[10px] footer-copyright uppercase tracking-widest"
            style={{ color: "#374151", fontFamily: "var(--font-tactical)" }}
          >
            <span>© {new Date().getFullYear()} BAILEY AGENTS — ALL RIGHTS RESERVED</span>
            <span style={{ color: "rgba(75,83,32,0.4)" }}>│</span>
            <Link href="/privacy" className="hover:text-[#ffb000] transition-colors">PRIVACY</Link>
            <span style={{ color: "rgba(75,83,32,0.4)" }}>│</span>
            <Link href="/terms" className="hover:text-[#ffb000] transition-colors">TERMS</Link>
            <span style={{ color: "rgba(75,83,32,0.4)" }}>│</span>
            <Link href="/data-deletion" className="hover:text-[#ffb000] transition-colors">DATA DELETION</Link>
          </div>
          <p
            className="text-[10px] uppercase tracking-widest"
            style={{ color: "#374151", fontFamily: "var(--font-tactical)" }}
          >
            SE HABLA ESPAÑOL · MACHESNEY PARK, IL · 42°20′N 89°02′W
          </p>
        </div>
      </div>
    </footer>
  );
}

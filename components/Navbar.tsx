"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

interface NavbarProps {
  initialLoggedIn?: boolean;
}

export default function Navbar({ initialLoggedIn = false }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(initialLoggedIn);
  const [authChecked, setAuthChecked] = useState(initialLoggedIn);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then((data) => {
        if (data.session) {
          setIsLoggedIn(true);
          setAuthChecked(true);
        } else if (!initialLoggedIn) {
          setIsLoggedIn(false);
          setAuthChecked(true);
        } else {
          setAuthChecked(true);
        }
      })
      .catch(() => {
        setAuthChecked(true);
      });
  }, [initialLoggedIn]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (pathname.startsWith("/sites/")) return null;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setIsLoggedIn(false);
    setDropdownOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: "#0a0b0c",
        borderBottom: "1px solid rgba(75,83,32,0.5)",
        boxShadow: "0 1px 0 rgba(255,176,0,0.05), 0 4px 20px rgba(0,0,0,0.6)",
      }}
    >
      {/* Top accent line */}
      <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, #4b5320 20%, #ffb000 50%, #4b5320 80%, transparent)" }} />

      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          {/* Crosshair icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ color: "#ffb000" }}>
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span
            className="text-base font-black tracking-widest uppercase"
            style={{ color: "#e5e5e0", fontFamily: "var(--font-tactical)", letterSpacing: "0.2em" }}
          >
            BAILEY<span style={{ color: "#ffb000" }}>AGENTS</span>
          </span>
          <span
            className="hidden md:block tac-blink text-[10px] ml-1"
            style={{ color: "#4b5320", fontFamily: "var(--font-tactical)" }}
          >
            ▮
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink href="/agents">Agents</NavLink>
          <NavLink href="#how-it-works">Ops</NavLink>
          <NavLink href="/team">Team</NavLink>
          <NavLink href="/pricing">Pricing</NavLink>
          <NavLink href="/pro">Pro</NavLink>
          <NavLink href="/elite">Elite</NavLink>
          <a
            href="https://agentsxbook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 transition-all"
            style={{
              color: "#ffb000",
              border: "1px solid rgba(255,176,0,0.4)",
              background: "rgba(255,176,0,0.06)",
              fontFamily: "var(--font-tactical)",
              letterSpacing: "0.15em",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,176,0,0.15)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 12px rgba(255,176,0,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,176,0,0.06)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
            }}
          >
            ◈ AGENTXBOOK
          </a>
        </div>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          {!authChecked ? (
            <div className="w-32 h-8 rounded-none animate-pulse" style={{ background: "rgba(75,83,32,0.15)" }} />
          ) : isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest transition-all px-4 py-2"
                style={{
                  color: "#0a0b0c",
                  background: "#ffb000",
                  border: "1px solid #ffb000",
                  fontFamily: "var(--font-tactical)",
                  clipPath: "polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#e09e00"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#ffb000"; }}
              >
                ◈ COMMAND
                <svg className={`w-3 h-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-1 w-44 overflow-hidden z-50"
                  style={{
                    background: "#0a0b0c",
                    border: "1px solid rgba(75,83,32,0.5)",
                    boxShadow: "0 0 20px rgba(75,83,32,0.2), 0 8px 32px rgba(0,0,0,0.6)",
                  }}
                >
                  {[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "My Sites", href: "/dashboard" },
                    { label: "Billing", href: "/dashboard/billing" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-widest transition-colors"
                      style={{ color: "#9ca3af", fontFamily: "var(--font-tactical)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#ffb000"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(75,83,32,0.15)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#9ca3af"; (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
                    >
                      <span style={{ color: "#4b5320" }}>›</span> {item.label}
                    </Link>
                  ))}
                  <div style={{ borderTop: "1px solid rgba(75,83,32,0.3)" }} />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-xs uppercase tracking-widest transition-colors"
                    style={{ color: "#ef4444", fontFamily: "var(--font-tactical)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.05)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                  >
                    <span>⊗</span> Disconnect
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-bold uppercase tracking-widest px-4 py-2 transition-all"
                style={{
                  color: "#9ca3af",
                  border: "1px solid rgba(75,83,32,0.4)",
                  background: "transparent",
                  fontFamily: "var(--font-tactical)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#ffb000"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "#ffb000"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 10px rgba(255,176,0,0.2)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#9ca3af"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(75,83,32,0.4)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none"; }}
              >
                Access
              </Link>
              <Link
                href="/login"
                className="text-xs font-bold uppercase tracking-widest px-5 py-2 transition-all"
                style={{
                  color: "#0a0b0c",
                  background: "#ffb000",
                  fontFamily: "var(--font-tactical)",
                  clipPath: "polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#e09e00"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 15px rgba(255,176,0,0.4)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#ffb000"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none"; }}
              >
                ▶ Deploy
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          style={{ color: "#9ca3af" }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden px-6 py-4 flex flex-col gap-3"
          style={{
            background: "#0a0b0c",
            borderTop: "1px solid rgba(75,83,32,0.4)",
          }}
        >
          <MobileLink href="/agents" onClick={() => setMobileOpen(false)}>▹ AGENTS</MobileLink>
          <MobileLink href="#how-it-works" onClick={() => setMobileOpen(false)}>▹ OPS BRIEFING</MobileLink>
          <MobileLink href="/team" onClick={() => setMobileOpen(false)}>▹ TEAM</MobileLink>
          <MobileLink href="/pricing" onClick={() => setMobileOpen(false)}>▹ PRICING</MobileLink>
          <MobileLink href="/pro" onClick={() => setMobileOpen(false)}>▹ PRO</MobileLink>
          <MobileLink href="/elite" onClick={() => setMobileOpen(false)}>▹ ELITE</MobileLink>
          <a
            href="https://agentsxbook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold uppercase tracking-widest py-1.5"
            style={{ color: "#ffb000", fontFamily: "var(--font-tactical)", letterSpacing: "0.15em" }}
            onClick={() => setMobileOpen(false)}
          >
            ◈ AGENTXBOOK ↗
          </a>
          <div className="flex flex-col gap-2 pt-2" style={{ borderTop: "1px solid rgba(75,83,32,0.3)" }}>
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="text-center text-xs font-bold uppercase tracking-widest py-2 transition-all" style={{ color: "#0a0b0c", background: "#ffb000", fontFamily: "var(--font-tactical)" }} onClick={() => setMobileOpen(false)}>
                  ◈ COMMAND CENTER →
                </Link>
                <button onClick={() => { setMobileOpen(false); handleLogout(); }} className="text-center text-xs font-bold uppercase tracking-widest py-2 transition-all" style={{ color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", fontFamily: "var(--font-tactical)", background: "transparent" }}>
                  ⊗ DISCONNECT
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-center text-xs font-bold uppercase tracking-widest py-2" style={{ color: "#9ca3af", border: "1px solid rgba(75,83,32,0.4)", fontFamily: "var(--font-tactical)" }} onClick={() => setMobileOpen(false)}>ACCESS TERMINAL</Link>
                <Link href="/login" className="text-center text-xs font-bold uppercase tracking-widest py-2" style={{ color: "#0a0b0c", background: "#ffb000", fontFamily: "var(--font-tactical)" }} onClick={() => setMobileOpen(false)}>▶ DEPLOY NOW</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-xs font-bold uppercase tracking-widest px-3 py-2 transition-all relative"
      style={{ color: "#6b7280", fontFamily: "var(--font-tactical)" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.color = "#ffb000";
        (e.currentTarget as HTMLAnchorElement).style.textShadow = "0 0 10px rgba(255,176,0,0.5)";
        (e.currentTarget as HTMLAnchorElement).style.background = "rgba(75,83,32,0.1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.color = "#6b7280";
        (e.currentTarget as HTMLAnchorElement).style.textShadow = "none";
        (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
      }}
    >
      {children}
    </Link>
  );
}

function MobileLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-xs font-bold uppercase tracking-widest py-1.5 transition-colors"
      style={{ color: "#6b7280", fontFamily: "var(--font-tactical)" }}
    >
      {children}
    </Link>
  );
}

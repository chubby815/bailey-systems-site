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

  // Must be above the early return to comply with React Rules of Hooks
  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then((data) => {
        if (data.session) {
          // Fetch confirms logged in — always trust this
          setIsLoggedIn(true);
          setAuthChecked(true);
        } else if (!initialLoggedIn) {
          // Server also said not logged in — confirmed logged out
          setIsLoggedIn(false);
          setAuthChecked(true);
        } else {
          // Server said logged in but fetch returned null —
          // trust the server-confirmed value, don't downgrade
          setAuthChecked(true);
        }
      })
      .catch(() => {
        // Fetch failed — trust whatever the server already told us
        setAuthChecked(true);
      });
  }, [initialLoggedIn]);

  // Close dropdown when clicking outside — also above early return
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Never render the Bailey Agents navbar on customer-generated sites
  if (pathname.startsWith("/sites/")) return null;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setIsLoggedIn(false);
    setDropdownOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.07] bg-[#08090a]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-0.5 text-xl font-black tracking-tight font-syne">
          <span className="text-[#f0f0f0]">Bailey</span>
          <span className="text-[#00e5a0]">Agents</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="#agents">Agents</NavLink>
          <NavLink href="#how-it-works">How It Works</NavLink>
          <NavLink href="/pricing">Pricing</NavLink>
          <NavLink href="/pro">Pro</NavLink>
          <NavLink href="/elite">Elite 👑</NavLink>
        </div>

        {/* CTA buttons — swap based on auth state */}
        <div className="hidden md:flex items-center gap-3">
          {!authChecked ? (
            <div className="w-32 h-9 rounded-xl bg-white/[0.04] animate-pulse" />
          ) : isLoggedIn ? (
            // ── Logged-in dropdown ──
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-1.5 text-sm font-bold text-black bg-[#00e5a0] hover:bg-[#00ffb2] transition-colors px-5 py-2 rounded-xl"
              >
                Dashboard
                <svg
                  className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-[#111214] border border-white/[0.1] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden z-50">
                  {[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "My Sites", href: "/dashboard" },
                    { label: "Billing", href: "/dashboard/billing" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-[#9ca3af] hover:text-white hover:bg-white/[0.05] transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="border-t border-white/[0.07]" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-[#6b7280] hover:text-[#f0f0f0] transition-colors px-4 py-2 rounded-xl border border-white/10 hover:border-white/20"
              >
                Log In
              </Link>
              <Link
                href="/login"
                className="text-sm font-bold text-black bg-[#00e5a0] hover:bg-[#00ffb2] transition-colors px-4 py-2 rounded-xl"
              >
                Start Free →
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#6b7280] hover:text-[#f0f0f0]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="md:hidden border-t border-white/[0.07] bg-[#08090a] px-6 py-4 flex flex-col gap-4">
          <MobileLink href="#agents" onClick={() => setMobileOpen(false)}>Agents</MobileLink>
          <MobileLink href="#how-it-works" onClick={() => setMobileOpen(false)}>How It Works</MobileLink>
          <MobileLink href="/pricing" onClick={() => setMobileOpen(false)}>Pricing</MobileLink>
          <MobileLink href="/pro" onClick={() => setMobileOpen(false)}>Pro</MobileLink>
          <MobileLink href="/elite" onClick={() => setMobileOpen(false)}>Elite 👑</MobileLink>
          <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.07]">
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-center text-sm font-bold text-black bg-[#00e5a0] py-2 rounded-xl"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard →
                </Link>
                <Link
                  href="/dashboard/billing"
                  className="text-center text-sm font-semibold text-[#6b7280] py-2 rounded-xl border border-white/10"
                  onClick={() => setMobileOpen(false)}
                >
                  Billing
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                  className="text-center text-sm font-semibold text-red-400 py-2 rounded-xl border border-red-500/20 hover:bg-red-500/5 transition-colors"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-center text-sm font-semibold text-[#6b7280] py-2 rounded-xl border border-white/10" onClick={() => setMobileOpen(false)}>Log In</Link>
                <Link href="/login" className="text-center text-sm font-bold text-black bg-[#00e5a0] py-2 rounded-xl" onClick={() => setMobileOpen(false)}>Start Free →</Link>
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
      className="text-sm text-[#6b7280] hover:text-[#f0f0f0] transition-colors font-medium"
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
      className="text-sm text-[#6b7280] hover:text-[#f0f0f0] transition-colors font-medium py-1"
    >
      {children}
    </Link>
  );
}

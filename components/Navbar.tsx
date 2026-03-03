"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then((data) => setIsLoggedIn(!!data.session))
      .catch(() => setIsLoggedIn(false))
      .finally(() => setAuthChecked(true));
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.07] bg-[#08090a]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-0.5 text-xl font-black tracking-tight font-syne">
          <span className="text-[#f0f0f0]">Bailey</span>
          <span className="text-[#00e5a0]">Systems</span>
          <span className="text-[#f0f0f0]">AI</span>
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
            // Skeleton to prevent layout shift while checking
            <div className="w-32 h-9 rounded-xl bg-white/[0.04] animate-pulse" />
          ) : isLoggedIn ? (
            <Link
              href="/dashboard"
              className="text-sm font-bold text-black bg-[#00e5a0] hover:bg-[#00ffb2] transition-colors px-5 py-2 rounded-xl"
            >
              Dashboard →
            </Link>
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
              <Link
                href="/dashboard"
                className="text-center text-sm font-bold text-black bg-[#00e5a0] py-2 rounded-xl"
                onClick={() => setMobileOpen(false)}
              >
                Dashboard →
              </Link>
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

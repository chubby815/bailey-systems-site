"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-[#faf9f6] border-b-4 border-black py-4 shadow-[0_4px_0_#0a0a0a]">
      <div className="max-w-[90%] mx-auto flex items-center justify-between">
        <div className="text-3xl font-black bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] bg-clip-text text-transparent animate-pulse navbar-logo" style={{ letterSpacing: '-0.03em' }}>
          Bailey Systems AI
        </div>

        <div className="flex items-center gap-8 text-base">
          <NavLink href="/">Home</NavLink>
          <NavLink href="#services">Services</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
          <NavLink href="#team">Team</NavLink>
          <NavLink href="#about">About</NavLink>
          <NavLink href="/consulting">Consulting</NavLink>
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-black font-semibold hover:text-[#0EA5E9] transition-colors duration-150 uppercase text-sm navbar-link" style={{ letterSpacing: '-0.02em' }}
    >
      {children}
    </Link>
  );
}

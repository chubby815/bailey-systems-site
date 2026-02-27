"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-[#faf9f6] border-b-4 border-black py-4 shadow-[0_4px_0_#0a0a0a]">
      <div className="max-w-[90%] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-xl font-black tracking-tight text-black">
            Bailey Systems AI
          </div>
          <span className="inline-flex items-center gap-1 bg-[#00c48c]/10 border border-[#00c48c]/30 text-[#00c48c] text-xs font-bold px-2 py-1 rounded-full">
            🇲🇽 Se habla español
          </span>
        </div>

        <div className="flex items-center gap-8 text-base">
          <NavLink href="/">Home</NavLink>
          <NavLink href="#services">Services</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
          <NavLink href="#team">Team</NavLink>
          <NavLink href="#about">About</NavLink>
          <NavLink href="/consulting">Consulting</NavLink>
          <a href="/pro" className="text-sm font-bold text-purple-500 hover:text-purple-400 transition uppercase" style={{ letterSpacing: '-0.02em' }}>Pro</a>
          <a href="/elite" className="text-sm font-bold text-yellow-500 hover:text-yellow-400 transition uppercase" style={{ letterSpacing: '-0.02em' }}>Elite 👑</a>
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

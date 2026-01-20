"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-[#faf9f6] border-b-4 border-black py-4 px-6 flex items-center justify-between shadow-[0_4px_0_#0a0a0a]">
      <div className="text-2xl font-bold tracking-tight text-black">
        Bailey Systems AI
      </div>

      <div className="flex items-center gap-8 text-base">
        <NavLink href="/">Home</NavLink>
        <NavLink href="#pricing">Pricing</NavLink>
        <NavLink href="#about">About</NavLink>
        <NavLink href="#contact">Contact</NavLink>
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
      className="text-black font-semibold hover:text-[#F4C430] transition-colors duration-150 uppercase tracking-wide text-sm"
    >
      {children}
    </Link>
  );
}

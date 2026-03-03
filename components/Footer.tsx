import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-[#08090a] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          {/* Logo + tagline */}
          <div className="max-w-xs">
            <div className="text-xl font-black tracking-tight font-syne mb-3">
            <span className="text-[#f0f0f0]">Bailey</span>
            <span className="text-[#00e5a0]">Systems</span>
            <span className="text-[#f0f0f0]">AI</span>
            </div>
            <p className="text-sm text-[#6b7280] leading-relaxed">
              Custom AI agents, websites, apps, and automation systems for businesses ready to grow.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <span className="w-2 h-2 rounded-full bg-[#00e5a0] animate-pulse" />
              <span className="text-xs text-[#6b7280]">Available for new projects</span>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#6b7280] mb-4">Services</p>
              <ul className="space-y-2.5 text-sm text-[#9ca3af]">
                <li><Link href="#agents" className="hover:text-[#00e5a0] transition-colors">AI Agents</Link></li>
                <li><Link href="#pricing" className="hover:text-[#00e5a0] transition-colors">Websites</Link></li>
                <li><Link href="#pricing" className="hover:text-[#00e5a0] transition-colors">Automation</Link></li>
                <li><Link href="/consulting" className="hover:text-[#00e5a0] transition-colors">Consulting</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#6b7280] mb-4">Product</p>
              <ul className="space-y-2.5 text-sm text-[#9ca3af]">
                <li><Link href="/pro" className="hover:text-[#00e5a0] transition-colors">Bailey Pro</Link></li>
                <li><Link href="/elite" className="hover:text-[#00e5a0] transition-colors">Bailey Elite</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#00e5a0] transition-colors">Dashboard</Link></li>
                <li><Link href="/login" className="hover:text-[#00e5a0] transition-colors">Log In</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#6b7280] mb-4">Contact</p>
              <ul className="space-y-2.5 text-sm text-[#9ca3af]">
                <li><a href="mailto:Lilianajs27@gmail.com" className="hover:text-[#00e5a0] transition-colors">Lilianajs27@gmail.com</a></li>
                <li><a href="tel:+17798956325" className="hover:text-[#00e5a0] transition-colors">779-895-6325</a></li>
                <li><a href="https://www.facebook.com/profile.php?id=61588084179508" target="_blank" rel="noopener noreferrer" className="hover:text-[#00e5a0] transition-colors">Facebook</a></li>
                <li><span className="text-[#6b7280]">Machesney Park, IL</span></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.07] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#4b5563]">
            © {new Date().getFullYear()} BaileySystemsAI. All rights reserved.
          </p>
          <p className="text-xs text-[#4b5563]">
            🇲🇽 Se habla español · Machesney Park, IL
          </p>
        </div>
      </div>
    </footer>
  );
}

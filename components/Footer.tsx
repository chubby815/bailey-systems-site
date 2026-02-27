export function Footer() {
  return (
    <footer className="mt-20 border-t-4 border-black py-10 bg-[#faf9f6] footer-section">
      <div className="max-w-[65%] ml-0 px-4 grid md:grid-cols-4 gap-8 md:pr-56 mr-[200px]">
        {/* ABOUT */}
        <div>
          <h3 className="text-lg font-black text-black footer-heading" style={{ letterSpacing: '-0.04em' }}>
            Bailey Systems AI
          </h3>
          <p className="text-black text-sm mt-2 leading-relaxed footer-text">
            Custom AI agents, websites, apps, and automation systems for
            businesses and creators.
          </p>
        </div>

        {/* SERVICES */}
        <div>
          <h3 className="text-lg font-black text-black footer-heading" style={{ letterSpacing: '-0.04em' }}>
            Services
          </h3>
          <ul className="mt-2 text-black text-sm space-y-1 footer-text">
            <li>AI Agents</li>
            <li>Websites</li>
            <li>Apps</li>
            <li>Automation Systems</li>
          </ul>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="text-lg font-black text-black footer-heading" style={{ letterSpacing: '-0.04em' }}>
            Quick Links
          </h3>
          <ul className="mt-2 text-black text-sm space-y-1 footer-text">
            <li>
              <a href="#pricing" className="hover:text-[#0EA5E9] transition-colors footer-link">Pricing</a>
            </li>
            <li>
              <a href="#about" className="hover:text-[#0EA5E9] transition-colors footer-link">About</a>
            </li>
            <li>
              <a href="/consulting" className="hover:text-[#0EA5E9] transition-colors footer-link">Contact</a>
            </li>
            <li>
              <a href="https://www.facebook.com/profile.php?id=61588084179508" target="_blank" rel="noopener noreferrer" className="hover:text-[#0EA5E9] transition-colors footer-link flex items-center gap-1">
                📘 Facebook
              </a>
            </li>
          </ul>
        </div>

        {/* WORK WITH ME - Amazon Yellow Bento */}
        <div className="border-4 border-black bg-[#F4C430] p-6 footer-cta">
          <h3 className="text-lg font-black text-black footer-heading" style={{ letterSpacing: '-0.04em' }}>
            Work With Me
          </h3>
          <p className="text-black text-sm mt-2 leading-relaxed footer-text">
            Ready to build something? Let's get started.
          </p>
          <a
            href="/consulting"
            className="inline-block mt-4 px-6 py-3 bg-black text-white border-4 border-black font-bold hover:translate-x-1 hover:translate-y-1 transition-all uppercase text-sm footer-button"
            style={{ letterSpacing: '-0.02em' }}
          >
            Start a Project
          </a>
        </div>
      </div>

      {/* SYSTEM STATUS INDICATOR */}
      <div className="flex items-center justify-center gap-3 mt-10 mb-4">
        <div className="w-2 h-2 rounded-full bg-green-600 system-status-dot"></div>
        <span className="text-xs font-bold system-status-text" style={{ fontFamily: 'Courier New, Monaco, Consolas, monospace', letterSpacing: '0.05em' }}>
          BAILEY_OS: ACTIVE
        </span>
      </div>

      <div className="text-center text-black text-sm font-semibold footer-copyright" style={{ fontFamily: 'Courier New, Monaco, Consolas, monospace' }}>
        © {new Date().getFullYear()} Bailey Systems AI. All rights reserved.
      </div>
    </footer>
  );
}

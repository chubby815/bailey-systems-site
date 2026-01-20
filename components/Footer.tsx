export function Footer() {
  return (
    <footer className="mt-20 border-t-4 border-black py-10 bg-[#faf9f6]">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-4 gap-10 text-black">
        {/* ABOUT */}
        <div>
          <h3 className="text-lg font-bold">Bailey Systems AI</h3>
          <p className="text-black/70 text-sm mt-2 leading-relaxed">
            Custom AI agents, websites, apps, and automation systems for
            businesses and creators.
          </p>
        </div>

        {/* SERVICES */}
        <div>
          <h3 className="text-lg font-bold">Services</h3>
          <ul className="mt-2 text-black/70 text-sm space-y-1">
            <li>AI Agents</li>
            <li>Websites</li>
            <li>Apps</li>
            <li>Automation Systems</li>
          </ul>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="text-lg font-bold">Quick Links</h3>
          <ul className="mt-2 text-black/70 text-sm space-y-1">
            <li>
              <a href="#pricing" className="hover:text-[#F4C430] transition-colors">Pricing</a>
            </li>
            <li>
              <a href="#about" className="hover:text-[#F4C430] transition-colors">About</a>
            </li>
            <li>
              <a href="/contact" className="hover:text-[#F4C430] transition-colors">Contact</a>
            </li>
          </ul>
        </div>

        {/* START PROJECT */}
        <div>
          <h3 className="text-lg font-bold">Work With Me</h3>
          <p className="text-black/70 text-sm mt-2 leading-relaxed">
            Ready to build something? Let's get started.
          </p>
          <a
            href="#pricing"
            className="inline-block mt-4 px-6 py-3 bg-[#F4C430] text-black border-4 border-black font-bold hover:bg-[#E6B800] hover:translate-x-1 hover:translate-y-1 shadow-[4px_4px_0_#0a0a0a] hover:shadow-[2px_2px_0_#0a0a0a] transition-all uppercase tracking-wide text-sm"
          >
            Start a Project
          </a>
        </div>
      </div>

      <div className="text-center text-black/60 text-sm mt-10 font-semibold">
        © {new Date().getFullYear()} Bailey Systems AI. All rights reserved.
      </div>
    </footer>
  );
}

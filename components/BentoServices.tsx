"use client";

import Link from "next/link";

const services = [
  {
    title: "AI Agents",
    description: "Custom AI workers: customer support, coding agents, fitness coach, sales agents and more.",
    icon: "🤖",
    size: "large", // Takes 2 columns
    href: "/services/ai-agents"
  },
  {
    title: "Websites",
    description: "Fast, modern, and optimized websites built with Next.js, Tailwind, and AI automation.",
    icon: "🌐",
    size: "medium",
    href: "/services/websites"
  },
  {
    title: "Apps",
    description: "Mobile and desktop apps powered by smart AI features and automation.",
    icon: "📱",
    size: "medium",
    href: "/services/apps"
  },
  {
    title: "Automations",
    description: "Streamline workflows and eliminate repetitive tasks with custom automation solutions.",
    icon: "⚡",
    size: "small",
    href: "/services/automations"
  },
  {
    title: "Consulting",
    description: "Expert guidance on AI integration and digital transformation.",
    icon: "💡",
    size: "small",
    href: "/contacts"
  },
];

export function BentoServices() {
  return (
    <section id="services" className="w-full max-w-6xl text-center mb-32">
      <div className="space-y-6 mb-12">
        <h2 className="text-5xl font-bold tracking-tight relative inline-block">
          Our AI Services
          <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#F4C430]"></span>
        </h2>
        <p className="text-xl text-black/70 max-w-2xl mx-auto">
          Choose from custom AI Agents, Websites, Apps, and Automations built
          just for you.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px]">
        {services.map((service, index) => (
          <Link
            key={service.title}
            href={service.href}
            className={`
              group relative overflow-hidden
              border-4 border-black bg-white
              shadow-[6px_6px_0_rgba(0,0,0,1)]
              hover:shadow-[0_0_20px_#F4C430]
              transition-all duration-300
              hover:scale-[1.02]
              hover:border-[#F4C430]
              p-6
              flex flex-col justify-between
              ${service.size === "large" ? "md:col-span-2 md:row-span-2" : ""}
              ${service.size === "medium" ? "md:col-span-2" : ""}
              ${service.size === "small" ? "md:col-span-1" : ""}
            `}
          >
            {/* Neon Glow Background on Hover */}
            <div className="absolute inset-0 bg-[#F4C430]/0 group-hover:bg-[#F4C430]/5 transition-all duration-300 pointer-events-none" />
            
            {/* Icon */}
            <div className={`text-6xl mb-4 ${service.size === "large" ? "md:text-8xl" : ""}`}>
              {service.icon}
            </div>

            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-2 text-black group-hover:text-[#F4C430] transition-colors">
                {service.title}
              </h3>
              <p className={`text-sm text-black/70 ${service.size === "small" ? "hidden md:block" : ""}`}>
                {service.description}
              </p>
            </div>

            {/* Hover Arrow */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-2xl">→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

"use client";

import { Terminal, Cpu, Shield, Globe, Zap } from "lucide-react";

const services = [
  {
    title: "AI Agents",
    description: "Custom AI workers for customer support, coding assistance, sales automation, and specialized business tasks.",
    icon: Terminal,
  },
  {
    title: "Websites",
    description: "Fast, modern, and optimized websites built with Next.js, Tailwind CSS, and seamless AI integration.",
    icon: Globe,
  },
  {
    title: "Apps",
    description: "Mobile and desktop applications powered by intelligent AI features and robust automation systems.",
    icon: Cpu,
  },
  {
    title: "Automations",
    description: "Streamline workflows and eliminate repetitive tasks with custom automation solutions tailored to your needs.",
    icon: Zap,
  },
  {
    title: "Security",
    description: "Enterprise-grade security solutions with AI-driven threat detection and 24/7 monitoring capabilities.",
    icon: Shield,
  },
];

export function ProfessionalServices() {
  return (
    <section id="services" className="w-full max-w-6xl text-center mb-32">
      <div className="space-y-6 mb-12">
        <h2 className="text-5xl font-bold tracking-tight relative inline-block">
          Our Services
          <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#F4C430]"></span>
        </h2>
        <p className="text-xl text-black/70 max-w-2xl mx-auto">
          Professional AI solutions and software development services for modern businesses.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.title}
              className="border-4 border-black bg-white p-8 shadow-[6px_6px_0_rgba(0,0,0,1)] transition-all hover:shadow-[8px_8px_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
            >
              <div className="mb-6">
                <Icon size={48} className="mx-auto text-[#F4C430]" strokeWidth={2} />
              </div>
              
              <h3 className="text-2xl font-black mb-4 text-black">
                {service.title}
              </h3>
              
              <p className="text-sm text-black/70 leading-relaxed">
                {service.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

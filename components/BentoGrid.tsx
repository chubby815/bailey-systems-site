"use client";

import Image from "next/image";

export function BentoGrid() {
  return (
    <section className="w-full max-w-6xl mb-32">
      <div className="grid grid-cols-12 gap-4">

        {/* Javier Bio */}
        <div className="col-span-12 md:col-span-5 bg-[#f5f5f5] rounded-3xl p-8 flex flex-col gap-4">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg shrink-0">
            <Image
              src="/profile-photo.jpg"
              alt="Javier Sandoval"
              fill
              className="object-cover"
              sizes="96px"
              priority
            />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#00c48c] mb-1">Lead Engineer</p>
            <h3 className="text-3xl font-black text-black mb-2">Javier Sandoval</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Full-stack engineer specializing in custom AI agents and production-ready systems.
              Alumnus of McHenry County College (2025) and Software Engineer at Amazon.
            </p>
          </div>
          <div className="flex gap-3 mt-2 flex-wrap">
            <a
              href="mailto:Lilianajs27@gmail.com"
              className="bg-black text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-gray-800 transition"
            >
              Work With Me
            </a>
            <a
              href="#pricing"
              className="border border-black text-black text-xs font-bold px-4 py-2 rounded-full hover:bg-black hover:text-white transition"
            >
              View Pricing
            </a>
          </div>
        </div>

        {/* Bailey Agent card */}
        <div className="col-span-12 md:col-span-4 bg-black text-white rounded-3xl p-8 flex flex-col justify-between min-h-[280px]">
          <div className="text-4xl mb-4">🤖</div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#00c48c] mb-1">AI Assistant</p>
            <h3 className="text-2xl font-black mb-2">Bailey</h3>
            <p className="text-gray-400 text-sm">
              Your AI-powered business agent. Handles customer service,
              lead capture, and automation 24/7.
            </p>
          </div>
          <a href="#pricing" className="mt-4 text-[#00c48c] text-sm font-bold hover:underline">
            Add to your site →
          </a>
        </div>

        {/* Stats card */}
        <div className="col-span-12 md:col-span-3 bg-[#00c48c] rounded-3xl p-8 flex flex-col justify-between min-h-[280px]">
          <div className="text-4xl mb-4">📈</div>
          <div className="space-y-4">
            <div>
              <div className="text-4xl font-black text-black">38s</div>
              <div className="text-black/70 text-xs font-semibold uppercase tracking-wide">Avg response time</div>
            </div>
            <div>
              <div className="text-4xl font-black text-black">50+</div>
              <div className="text-black/70 text-xs font-semibold uppercase tracking-wide">Projects delivered</div>
            </div>
            <div>
              <div className="text-4xl font-black text-black">760+</div>
              <div className="text-black/70 text-xs font-semibold uppercase tracking-wide">Hours automated</div>
            </div>
          </div>
        </div>

        {/* Service: Websites */}
        <div className="col-span-6 md:col-span-3 bg-[#f5f5f5] rounded-3xl p-6 flex flex-col gap-3 hover:bg-black hover:text-white transition-all duration-300 group cursor-pointer">
          <div className="text-3xl">🌐</div>
          <h4 className="font-black text-lg group-hover:text-white">Websites</h4>
          <p className="text-gray-500 text-xs group-hover:text-gray-300">
            Custom-built, mobile-first sites that convert visitors into clients.
          </p>
        </div>

        {/* Service: AI Agents */}
        <div className="col-span-6 md:col-span-3 bg-[#f5f5f5] rounded-3xl p-6 flex flex-col gap-3 hover:bg-black hover:text-white transition-all duration-300 group cursor-pointer">
          <div className="text-3xl">🧠</div>
          <h4 className="font-black text-lg group-hover:text-white">AI Agents</h4>
          <p className="text-gray-500 text-xs group-hover:text-gray-300">
            Intelligent agents that handle tasks, answer questions, and close leads.
          </p>
        </div>

        {/* Service: Automations */}
        <div className="col-span-6 md:col-span-3 bg-[#f5f5f5] rounded-3xl p-6 flex flex-col gap-3 hover:bg-black hover:text-white transition-all duration-300 group cursor-pointer">
          <div className="text-3xl">⚡</div>
          <h4 className="font-black text-lg group-hover:text-white">Automations</h4>
          <p className="text-gray-500 text-xs group-hover:text-gray-300">
            Eliminate repetitive work. Email flows, CRM sync, scheduling — automated.
          </p>
        </div>

        {/* Service: Apps */}
        <div className="col-span-6 md:col-span-3 bg-[#f5f5f5] rounded-3xl p-6 flex flex-col gap-3 hover:bg-black hover:text-white transition-all duration-300 group cursor-pointer">
          <div className="text-3xl">📱</div>
          <h4 className="font-black text-lg group-hover:text-white">Apps</h4>
          <p className="text-gray-500 text-xs group-hover:text-gray-300">
            Full-stack web apps built for performance, scale, and real users.
          </p>
        </div>

        {/* Wide CTA card */}
        <div className="col-span-12 md:col-span-8 bg-black text-white rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#00c48c] mb-2">Ready to build?</p>
            <h3 className="text-3xl font-black mb-2">Let's work together.</h3>
            <p className="text-gray-400 text-sm max-w-md">
              From a simple landing page to a full AI-powered system —
              BaileySystemsAI delivers production-ready results fast.
            </p>
          </div>
          <a
            href="mailto:Lilianajs27@gmail.com?subject=Let's Work Together"
            className="shrink-0 bg-[#00c48c] text-black font-black px-8 py-4 rounded-2xl hover:bg-white transition text-sm whitespace-nowrap"
          >
            Start a Project →
          </a>
        </div>

        {/* Location card */}
        <div className="col-span-12 md:col-span-4 bg-[#f5f5f5] rounded-3xl p-6 flex flex-col justify-between min-h-[160px]">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Based in</p>
            <h4 className="text-xl font-black text-black">Machesney Park, IL</h4>
            <p className="text-gray-500 text-sm mt-1">Serving clients nationwide &amp; globally.</p>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <div className="w-2 h-2 rounded-full bg-[#00c48c] animate-pulse"></div>
            <span className="text-xs font-semibold text-gray-500">Available for new projects</span>
          </div>
        </div>

      </div>
    </section>
  );
}

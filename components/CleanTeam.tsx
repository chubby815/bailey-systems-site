"use client";

import Image from "next/image";

export function CleanTeam() {
  return (
    <section id="team" className="w-full max-w-6xl mb-32">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-black tracking-tight relative inline-block mb-6" style={{ fontFamily: 'Inter, Arial Black, sans-serif' }}>
          Meet The Team
          <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#F4C430]"></span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Javier Card */}
        <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0_#0a0a0a]">
          <div className="mb-6 border-4 border-black shadow-[6px_6px_0_#0a0a0a] overflow-hidden aspect-square relative">
            <Image
              src="/profile-photo.jpg"
              alt="Javier Sandoval"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              loading="eager"
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-3xl font-black text-black mb-2">Javier Sandoval</h3>
              <p className="text-lg font-bold text-[#F4C430] uppercase tracking-wide">Lead Engineer</p>
            </div>
            
            <p className="text-base text-black/80 leading-relaxed">
              Javier Sandoval — Lead Engineer specializing in custom AI agents and full-stack systems. 
              Alumnus of McHenry County College (2025) and Software Engineer at Amazon.
            </p>
          </div>
        </div>

        {/* Bailey Card */}
        <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0_#0a0a0a]">
          <div className="mb-6 border-4 border-black shadow-[6px_6px_0_#0a0a0a] overflow-hidden aspect-square relative">
            <Image
              src="/vee.png"
              alt="Bailey"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              loading="eager"
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-3xl font-black text-black mb-2">Bailey</h3>
              <p className="text-lg font-bold text-[#F4C430] uppercase tracking-wide">Lead Security Agent</p>
            </div>
            
            <p className="text-base text-black/80 leading-relaxed">
              Bailey — Lead Security Agent & Automated Mascot. Focused on system integrity and 24/7 AI-driven support.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

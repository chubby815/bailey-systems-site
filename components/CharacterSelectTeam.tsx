"use client";

import Image from "next/image";
import { useState } from "react";

const teamMembers = [
  {
    name: "Javier Sandoval",
    title: "Lead Engineer",
    role: "ENGINEER",
    image: "/profile-photo.jpg",
    stats: {
      coffee: 100,
      code: "MAX"
    },
    bio: "Based in Machesney Park, IL. Computer Science alumnus of McHenry County College (2008) and current Senior Software Engineer at Amazon.",
    special: "Full Stack Mastery"
  },
  {
    name: "Bailey",
    title: "Lead Security",
    role: "GUARDIAN",
    image: "/placeholder.jpg",
    stats: {
      barks: "∞",
      loyalty: 100
    },
    bio: "Professional good boy. Expert in perimeter security, threat detection (squirrels), and maintaining team morale.",
    special: "Infinite Treats Protocol"
  }
];

export function CharacterSelectTeam() {
  const [selectedChar, setSelectedChar] = useState(0);

  return (
    <section id="team" className="w-full max-w-6xl mb-32">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-black tracking-tight relative inline-block mb-6 uppercase" style={{ fontFamily: 'Inter, Arial Black, sans-serif' }}>
          ⚔️ Select Character ⚔️
          <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#F4C430]"></span>
        </h2>
        <p className="text-lg text-black/70 uppercase tracking-wider font-bold">Choose your fighter</p>
      </div>

      {/* Character Select Grid */}
      <div className="border-8 border-black bg-gradient-to-br from-black via-gray-900 to-black p-8 shadow-[12px_12px_0_#0a0a0a] relative overflow-hidden">
        
        {/* Scanlines Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-10" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #F4C430 2px, #F4C430 4px)'
        }}></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              onClick={() => setSelectedChar(index)}
              className={`
                relative cursor-pointer transition-all duration-300
                border-4 p-6
                ${selectedChar === index 
                  ? 'border-[#F4C430] shadow-[0_0_30px_#F4C430] scale-105' 
                  : 'border-gray-600 hover:border-white'
                }
                bg-black/80
              `}
            >
              {/* SELECTED Badge */}
              {selectedChar === index && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#F4C430] border-2 border-black px-4 py-1 z-20">
                  <span className="font-black text-black text-sm uppercase tracking-widest">SELECTED</span>
                </div>
              )}

              {/* Character Portrait */}
              <div className="relative mb-4 border-4 border-[#F4C430] overflow-hidden aspect-square">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                
                {/* Level Badge */}
                <div className="absolute top-2 right-2 bg-black/90 border-2 border-[#F4C430] px-3 py-1">
                  <span className="text-[#F4C430] font-black text-xs">LVL 99</span>
                </div>
              </div>

              {/* Character Info */}
              <div className="space-y-3">
                {/* Name & Title */}
                <div className="border-b-2 border-[#F4C430] pb-2">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">{member.name}</h3>
                  <p className="text-[#F4C430] font-bold text-sm uppercase tracking-widest">{member.title}</p>
                </div>

                {/* Stats */}
                <div className="space-y-2 bg-black/50 p-3 border-2 border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-white text-xs font-bold uppercase">Stats:</span>
                    <span className="text-[#F4C430] text-xs font-black">{member.role}</span>
                  </div>
                  
                  {Object.entries(member.stats).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="text-white text-xs uppercase font-semibold w-20">{key}:</span>
                      <div className="flex-1 bg-gray-800 h-4 border border-gray-600 relative overflow-hidden">
                        <div 
                          className="absolute inset-0 bg-gradient-to-r from-[#F4C430] to-yellow-600 animate-pulse"
                          style={{ 
                            width: typeof value === 'number' ? `${value}%` : '100%' 
                          }}
                        ></div>
                      </div>
                      <span className="text-[#F4C430] text-xs font-black w-12 text-right">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Special Move */}
                <div className="bg-gradient-to-r from-black to-gray-900 border-2 border-[#F4C430] p-2">
                  <span className="text-[#F4C430] text-xs font-black uppercase">⚡ {member.special}</span>
                </div>

                {/* Bio */}
                <p className="text-white/70 text-sm leading-relaxed">{member.bio}</p>
              </div>

              {/* Press Start Animation */}
              {selectedChar === index && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-pulse">
                  <span className="text-[#F4C430] text-xs font-black uppercase tracking-widest">▶ READY ◀</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Bar - Arcade Style */}
        <div className="mt-8 border-4 border-[#F4C430] bg-black p-4 text-center">
          <p className="text-white font-black text-lg uppercase tracking-widest animate-pulse">
            INSERT COIN TO CONTINUE
          </p>
        </div>
      </div>
    </section>
  );
}

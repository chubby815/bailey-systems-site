"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect } from "react";
import { HERO_MARKERS, STATS } from "@/utils/constants";
import { Button } from "./Button";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
        videoRef.current.playbackRate = 1.0;
        videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
    }
  }, []);

  const handleMouseEnter = () => {
    if (videoRef.current) videoRef.current.muted = false;
  };

  const handleMouseLeave = () => {
    if (videoRef.current) videoRef.current.muted = true;
  };

  return (
    // Z-INDEX FIX: Added 'z-0' so it stays BEHIND the navbar
    <section className="relative overflow-hidden border-4 border-black bg-white p-8 shadow-[12px_12px_0_#0a0a0a] md:p-16 z-0">
      <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8 text-black">
          <div className="inline-flex items-center gap-2 border-2 border-black bg-[#F4C430] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-black">
            <span className="h-2 w-2 bg-black" />
            AI-powered systems
          </div>
          <div className="space-y-6">
            <h1 className="text-5xl font-black leading-tight tracking-tight md:text-6xl" style={{ fontFamily: 'Inter, Arial Black, sans-serif' }}>
              Custom <span className="relative inline-block">
                AI agents
                <span className="absolute -bottom-1 left-0 w-full h-2 bg-[#F4C430]"></span>
              </span> and websites for <span className="relative inline-block">
                modern businesses
                <span className="absolute -bottom-1 left-0 w-full h-2 bg-[#F4C430]"></span>
              </span>.
            </h1>
            <p className="text-xl text-black/70 md:text-2xl leading-relaxed">
              Production-ready software that handles real work. AI agents, custom websites, 
              and automation tools built to solve actual problems.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href="#pricing">Start a project</Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="#about">Learn more</Link>
            </Button>
          </div>
          <dl className="grid gap-6 sm:grid-cols-3">
            {STATS.map((stat) => (
              <div key={stat.label} className="border-4 border-black bg-white/50 p-4">
                <dt className="text-sm text-black/60 font-semibold uppercase tracking-wide">{stat.label}</dt>
                <dd className="text-3xl font-bold text-black mt-1 relative inline-block">
                  {stat.value}
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#F4C430]"></span>
                </dd>
                <p className="text-xs text-black/50 mt-2">{stat.detail}</p>
              </div>
            ))}
          </dl>
        </div>
        
        {/* RIGHT COLUMN - VIDEO */}
        <div className="relative">
          <div 
            className="relative border-4 border-black bg-white p-0 shadow-[8px_8px_0_#0a0a0a] overflow-hidden rounded-lg group cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            
            <video
              ref={videoRef}
              src="/avatar.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto object-cover"
            />

            {/* --- HEAVY FOG (Hides Watermark) --- */}
            <div className="absolute bottom-0 left-0 w-full h-16 bg-white z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white via-white/90 to-transparent z-10 pointer-events-none"></div>

            {/* --- TINY BADGE (Replaced the Huge One) --- */}
            {/* Now it's small (text-[10px]) and sits lower */}
            <div className="absolute bottom-4 left-4 z-20 pointer-events-none transform rotate-[0deg]">
                <div className="bg-[#F4C430] border border-black px-2 py-1 shadow-[2px_2px_0_rgba(0,0,0,1)]">
                    <span className="text-black font-black text-[10px] uppercase tracking-widest whitespace-nowrap">BAILEY SYSTEMS</span>
                </div>
            </div>
            
            <div className="absolute top-4 right-4 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                🔊 Sound On
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
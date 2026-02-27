"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { HERO_MARKERS, STATS } from "@/utils/constants";
import { Button } from "./Button";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
        videoRef.current.playbackRate = 1.0;
        videoRef.current.volume = 1.0;
        // Try to play with sound
        videoRef.current.muted = false;
        videoRef.current.play().catch(e => {
            // autoplay with sound blocked by browser, falling back to muted
            // Fallback to muted autoplay
            if (videoRef.current) {
                videoRef.current.muted = true;
                setIsMuted(true);
                videoRef.current.play();
            }
        });
        
        // Check if it's actually muted after a moment
        setTimeout(() => {
            if (videoRef.current && !videoRef.current.muted) {
                setIsMuted(false);
            }
        }, 100);
    }
  }, []);
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    // Z-INDEX FIX: Added 'z-0' so it stays BEHIND the navbar
    <section className="relative overflow-hidden border-4 border-black bg-white p-8 shadow-[12px_12px_0_#0a0a0a] md:p-16 z-0">
      <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8 text-black">
          <div className="inline-flex items-center gap-2 border-2 border-black bg-[#0EA5E9] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white">
            <span className="h-2 w-2 bg-white" />
            AI-powered systems
          </div>
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl font-black leading-[1.1] md:leading-[1.1]" style={{ letterSpacing: '-0.04em', fontWeight: 900 }}>
              Custom <span className="relative inline-block">
                SaaS products
                <span className="absolute -bottom-1 left-0 w-full h-2 bg-[#0EA5E9]"></span>
              </span> and websites for <span className="relative inline-block">
                modern businesses
                <span className="absolute -bottom-1 left-0 w-full h-2 bg-[#0EA5E9]"></span>
              </span>.
            </h1>
            <p className="text-xl text-gray-600 md:text-2xl leading-relaxed font-medium">
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
                <dt className="text-xs text-gray-500 font-bold uppercase tracking-wider">{stat.label}</dt>
                <dd className="text-4xl font-black text-black mt-1 relative inline-block" style={{ letterSpacing: '-0.02em' }}>
                  {stat.value}
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#0EA5E9]"></span>
                </dd>
                <p className="text-xs text-gray-500 mt-2 font-medium">{stat.detail}</p>
              </div>
            ))}
          </dl>
        </div>
        
        {/* RIGHT COLUMN - VIDEO */}
        <div className="relative">
          <div 
            className="relative border-4 border-black bg-white p-0 shadow-[8px_8px_0_#0a0a0a] overflow-hidden rounded-lg group"
          >
            
            <video
              ref={videoRef}
              src="/avatar.mp4"
              autoPlay
              loop
              playsInline
              preload="auto"
              poster="/placeholder.jpg"
              disablePictureInPicture
              controlsList="nodownload nofullscreen noremoteplayback"
              onContextMenu={(e) => e.preventDefault()}
              className="w-full h-auto object-cover"
            />

            {/* --- HEAVY FOG (Hides Watermark) --- */}
            <div className="absolute bottom-0 left-0 w-full h-16 bg-white z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white via-white/90 to-transparent z-10 pointer-events-none"></div>

            {/* --- TINY BADGE (Replaced the Huge One) --- */}
            {/* Now it's small (text-[10px]) and sits lower */}
            <div className="absolute bottom-4 left-4 z-20 pointer-events-none transform rotate-[0deg]">
                <div className="bg-[#0EA5E9] border border-black px-2 py-1 shadow-[2px_2px_0_rgba(0,0,0,1)]">
                    <span className="text-black font-black text-[10px] uppercase tracking-widest whitespace-nowrap">BAILEY SYSTEMS</span>
                </div>
            </div>
            
            {/* Sound Toggle Button */}
            <button
              onClick={toggleMute}
              className="absolute top-4 right-4 z-20 bg-black/80 hover:bg-[#0EA5E9] text-white hover:text-white text-xs px-3 py-2 rounded border border-black transition-all shadow-[2px_2px_0_rgba(0,0,0,1)] hover:shadow-[1px_1px_0_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? "🔇 Click for Sound" : "🔊 Sound On"}
            </button>

          </div>
        </div>
      </div>
    </section>
  );
}
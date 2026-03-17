"use client";

import { HeroInput } from "@/components/HeroInput";
import HeroHeadline from "@/components/HeroHeadline";

export default function HeroSection() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "92vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
          transform: "scale(0.85)",
          transformOrigin: "center center",
          zIndex: 0,
        }}
      >
        <source src="/Trim.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.75))",
          zIndex: 1,
        }}
      />

      {/* Hero content — sits above video */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
        }}
      >
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 pt-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#111214] border border-white/10 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#00e5a0] animate-pulse" />
            <span className="text-sm text-[#9ca3af] font-medium">AI-Powered Business Platform</span>
          </div>

          {/* H1 */}
          <HeroHeadline />

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-[#6b7280] max-w-2xl mx-auto mb-10 leading-relaxed">
            Generate a complete website, find leads, and create content — all powered by AI.
            No code. No designers. Just results.
          </p>

          {/* AI Input */}
          <HeroInput />

          {/* Social proof */}
          <p className="text-sm text-[#4b5563] mt-4">
            Trusted by 2,400+ businesses · Sites live in under 3 minutes
          </p>
          <p className="text-xs text-[#374151] mt-1">Cancel anytime · No questions asked</p>
        </div>
      </div>
    </section>
  );
}

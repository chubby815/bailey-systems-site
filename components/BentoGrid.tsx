"use client";

import Image from "next/image";
import Link from "next/link";
import { Terminal, Cpu, Shield, Globe, Zap, Lock, Share2, Copy, Search, AlertTriangle } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const services = [
  { title: "AI Agents", icon: Terminal, href: "/ai-agents" },
  { title: "Websites", icon: Globe, href: "/websites" },
  { title: "Apps", icon: Cpu, href: "/automations" },
  { title: "Automations", icon: Zap, href: "/automations" },
  { title: "Security", icon: Shield, href: "/automations" },
];

export function BentoGrid() {
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47388.19876543281!2d-89.04036844863282!3d42.34702907366098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8808909f8df8c0a9%3A0x7c5c7c7c7c7c7c7c!2sMachesney%20Park%2C%20IL!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus`;
  
  // Easter Egg 1: Vee Spin
  const [isSpinning, setIsSpinning] = useState(false);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Easter Egg 3: Locked Referral
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Agent 1: Corporate Espionage Scanner
  const [targetUrl, setTargetUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState("");

  // Agent 2: Vee Mood Ring (time-based)
  const [veeStatus, setVeeStatus] = useState("");

  // Agent 3: Chaos Engineer
  const [isChaosMode, setIsChaosMode] = useState(false);

  // Update Vee status based on time
  useEffect(() => {
    const updateVeeStatus = () => {
      const hour = new Date().getHours();
      if (hour >= 9 && hour < 17) {
        setVeeStatus("JAVIER @ AMAZON");
      } else {
        setVeeStatus("LAB_MODE_ACTIVE");
      }
    };
    updateVeeStatus();
    const interval = setInterval(updateVeeStatus, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const handleVeeClick = () => {
    clickCountRef.current += 1;

    if (clickCountRef.current === 1) {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 2000);
    }

    if (clickCountRef.current === 3) {
      setIsSpinning(true);
      console.log('SYSTEM: VEE_PROTOCOL_ACTIVATED. WOOF.');
      
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      clickCountRef.current = 0;

      setTimeout(() => setIsSpinning(false), 1000);
    }
  };

  const handleUnlock = () => {
    setIsUnlocked(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    handleUnlock();
  };

  // Corporate Espionage Scanner
  const handleScan = () => {
    if (!targetUrl) return;
    setIsScanning(true);
    setScanResult("SCANNING...");
    
    setTimeout(() => {
      setScanResult("⚠️ VULNERABILITIES DETECTED: 47");
      setTimeout(() => {
        setIsScanning(false);
        setScanResult("");
        setTargetUrl("");
      }, 3000);
    }, 3000);
  };

  // Chaos Engineer
  const handleChaosButton = () => {
    setIsChaosMode(true);
    setTimeout(() => {
      setIsChaosMode(false);
    }, 5000);
  };

  return (
    <section className="w-full max-w-7xl mb-32">
      {/* Bento Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-auto">
        
        {/* LARGE CARD: Javier's Bio */}
        <div className="md:col-span-2 md:row-span-2 border-4 border-black bg-white p-8 shadow-[8px_8px_0_#0a0a0a] hover:shadow-[12px_12px_0_#0a0a0a] transition-all">
          <div className="h-full flex flex-col">
            <div className="mb-6">
              <div className="relative w-48 h-48 mx-auto border-4 border-black shadow-[6px_6px_0_#0a0a0a] overflow-hidden">
                <Image
                  src="/profile-photo.jpg"
                  alt="Javier Sandoval"
                  fill
                  className="object-cover"
                  sizes="192px"
                  priority
                  loading="eager"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-4xl font-black text-black tracking-tight">Javier Sandoval</h3>
              <p className="text-sm font-bold text-[#0EA5E9] uppercase tracking-wider">LEAD ENGINEER</p>
              <p className="text-base text-gray-600 leading-relaxed font-medium">
                Javier Sandoval — Lead Engineer specializing in custom AI agents and full-stack systems. 
                Alumnus of McHenry County College (2025) and Software Engineer at Amazon.
              </p>
            </div>
          </div>
        </div>

        {/* MEDIUM CARD: Bailey Mascot - EASTER EGG 1 */}
        <div className="md:col-span-1 md:row-span-2 border-4 border-black bg-white p-6 shadow-[8px_8px_0_#0a0a0a] hover:shadow-[12px_12px_0_#0a0a0a] transition-all">
          <div className="h-full flex flex-col items-center justify-center">
            <div 
              className={`relative w-full aspect-square border-4 border-black shadow-[6px_6px_0_#0a0a0a] overflow-hidden mb-4 cursor-pointer ${isSpinning ? 'vee-spin' : ''}`}
              onClick={handleVeeClick}
            >
              <Image
                src="/vee.png"
                alt="Bailey"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 25vw"
                priority
                loading="eager"
              />
            </div>
            <h3 className="text-3xl font-black text-black text-center tracking-tight">Bailey</h3>
            <p className="text-xs font-bold text-[#0EA5E9] uppercase tracking-wider text-center">SECURITY AGENT</p>
          </div>
        </div>

        {/* SMALL CARDS: Services */}
        {services.slice(0, 3).map((service) => {
          const Icon = service.icon;
          return (
            <Link
              key={service.title}
              href={service.href}
              className="md:col-span-1 border-4 border-black bg-white p-6 shadow-[6px_6px_0_#0a0a0a] hover:shadow-[8px_8px_0_#0a0a0a] hover:scale-105 transition-all cursor-pointer"
            >
              <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                <Icon size={40} className="text-[#0EA5E9] mb-2" strokeWidth={2.5} />
                <h3 className="text-base font-bold text-black tracking-tight">{service.title}</h3>
              </div>
            </Link>
          );
        })}

        {/* LARGE CARD: Map */}
        <div className="relative md:col-span-3 md:row-span-2 border-4 border-black bg-white p-0 shadow-[8px_8px_0_#0a0a0a] overflow-hidden hover:shadow-[12px_12px_0_#0a0a0a] transition-all">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ 
              border: 0,
              minHeight: '400px'
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Machesney Park, Illinois Location"
          ></iframe>
          
          {/* Location Badge */}
          <div className="absolute bottom-4 left-4 bg-white border-4 border-black px-6 py-3 shadow-[6px_6px_0_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📍</span>
              <div>
                <p className="font-black text-black text-xs uppercase tracking-wider">BAILEY SYSTEMS AI</p>
                <p className="text-xs text-[#0EA5E9] font-semibold">Machesney Park, IL</p>
              </div>
            </div>
          </div>
        </div>

        {/* SMALL CARDS: Remaining Services */}
        {services.slice(3).map((service) => {
          const Icon = service.icon;
          return (
            <Link
              key={service.title}
              href={service.href}
              className="md:col-span-1 border-4 border-black bg-white p-6 shadow-[6px_6px_0_#0a0a0a] hover:shadow-[8px_8px_0_#0a0a0a] hover:scale-105 transition-all cursor-pointer"
            >
              <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                <Icon size={40} className="text-[#0EA5E9] mb-2" strokeWidth={2.5} />
                <h3 className="text-base font-bold text-black tracking-tight">{service.title}</h3>
              </div>
            </Link>
          );
        })}

        {/* EASTER EGG 3: Locked Referral Card */}
        <div className="md:col-span-1 border-4 border-black bg-white p-6 shadow-[6px_6px_0_#0a0a0a] hover:shadow-[12px_12px_0_#0a0a0a] transition-all relative">
          {!isUnlocked ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <Lock size={40} className="text-gray-400 mb-2" strokeWidth={2.5} />
              <h3 className="text-sm font-bold text-gray-400 tracking-tight uppercase" style={{ fontFamily: 'Courier New, Monaco, monospace', letterSpacing: '-0.02em' }}>
                ENCRYPTED_DATA
              </h3>
              <div className="absolute inset-0 backdrop-blur-sm bg-white/60 flex flex-col items-center justify-center p-4">
                <p className="text-xs font-bold text-black mb-3" style={{ fontFamily: 'Courier New, Monaco, monospace' }}>
                  SHARE TO UNLOCK PRIORITY ACCESS
                </p>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0EA5E9] text-white border-2 border-black font-bold text-xs"
                  style={{ fontFamily: 'Courier New, Monaco, monospace' }}
                >
                  <Copy size={14} />
                  COPY LINK
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3 animate-in fade-in">
              <Shield size={40} className="text-[#0EA5E9] mb-2" strokeWidth={2.5} />
              <h3 className="text-xs font-black text-[#0EA5E9] tracking-tight uppercase" style={{ fontFamily: 'Courier New, Monaco, monospace', letterSpacing: '-0.02em' }}>
                REFERRAL BOUNTY
              </h3>
              <p className="text-xs font-bold text-black" style={{ fontFamily: 'Courier New, Monaco, monospace', letterSpacing: '-0.01em' }}>
                Get $500 off if a friend books a project
              </p>
            </div>
          )}
        </div>

        {/* AGENT 1: Corporate Espionage Scanner */}
        <div className="md:col-span-2 border-4 border-black bg-white p-6 shadow-[6px_6px_0_#0a0a0a] hover:shadow-[8px_8px_0_#0a0a0a] transition-all">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Search size={24} className="text-[#0EA5E9]" strokeWidth={2.5} />
              <h3 className="text-lg font-black text-black tracking-tight uppercase" style={{ fontFamily: 'Courier New, Monaco, monospace', letterSpacing: '-0.04em' }}>
                Corporate Espionage
              </h3>
            </div>
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="TARGET_URL"
              disabled={isScanning}
              className="w-full p-3 border-2 border-black bg-white text-black outline-none font-mono text-sm"
              style={{ fontFamily: 'Courier New, Monaco, monospace' }}
            />
            <button
              onClick={handleScan}
              disabled={isScanning || !targetUrl}
              className="w-full py-2 bg-[#0EA5E9] text-white border-2 border-black font-bold uppercase text-xs disabled:opacity-50"
              style={{ fontFamily: 'Courier New, Monaco, monospace', letterSpacing: '-0.01em' }}
            >
              {isScanning ? "SCANNING..." : "RUN VULNERABILITY SCAN"}
            </button>
            {scanResult && (
              <div className="mt-3 p-3 bg-black border-2 border-[#00ff41] text-[#00ff41] text-xs font-bold animate-pulse" style={{ fontFamily: 'Courier New, Monaco, monospace' }}>
                {scanResult}
              </div>
            )}
          </div>
        </div>

        {/* AGENT 2: Vee Mood Ring */}
        <div className="md:col-span-1 border-4 border-black bg-white p-6 shadow-[6px_6px_0_#0a0a0a] hover:shadow-[8px_8px_0_#0a0a0a] transition-all">
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
            <div className="relative w-20 h-20 border-4 border-black overflow-hidden">
              <Image
                src="/vee.png"
                alt="Vee Status"
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <h3 className="text-xs font-black text-black tracking-tight uppercase" style={{ fontFamily: 'Courier New, Monaco, monospace', letterSpacing: '-0.02em' }}>
              VEE MOOD RING
            </h3>
            <div className="px-3 py-2 bg-black border-2 border-[#0EA5E9]">
              <p className="text-xs font-bold text-[#0EA5E9]" style={{ fontFamily: 'Courier New, Monaco, monospace', letterSpacing: '0.05em' }}>
                {veeStatus || "INITIALIZING..."}
              </p>
            </div>
          </div>
        </div>

        {/* AGENT 3: Chaos Engineer */}
        <div className="md:col-span-1 border-4 border-black bg-white p-6 shadow-[6px_6px_0_#0a0a0a] hover:shadow-[8px_8px_0_#0a0a0a] transition-all relative">
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <AlertTriangle size={40} className="text-red-600 mb-2" strokeWidth={2.5} />
            <h3 className="text-xs font-black text-black tracking-tight uppercase" style={{ fontFamily: 'Courier New, Monaco, monospace', letterSpacing: '-0.02em' }}>
              Chaos Engineer
            </h3>
            <button
              onClick={handleChaosButton}
              disabled={isChaosMode}
              className="px-6 py-3 bg-red-600 text-white border-4 border-black font-black uppercase text-xs shadow-[4px_4px_0_#0a0a0a] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_#0a0a0a] transition-all disabled:opacity-50"
              style={{ fontFamily: 'Courier New, Monaco, monospace', letterSpacing: '-0.01em' }}
            >
              DO NOT PRESS
            </button>
            {isChaosMode && (
              <div className="absolute inset-0 bg-black/90 flex items-center justify-center chaos-glitch">
                <p className="text-[#00ff41] text-2xl font-black animate-pulse" style={{ fontFamily: 'Courier New, Monaco, monospace' }}>
                  CHAOS_MODE_ACTIVE
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";

export function KonamiCode() {
  const [showDiscount, setShowDiscount] = useState(false);
  const [sequence, setSequence] = useState<string[]>([]);

  const konamiCode = [
    "arrowup", "arrowup", "arrowdown", "arrowdown",
    "arrowleft", "arrowright", "arrowleft", "arrowright",
    "b", "a"
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Guard: ensure key exists
      if (!e.key) return;
      
      const key = e.key.toLowerCase();
      
      setSequence((prev) => {
        const newSequence = [...prev, key].slice(-10);
        
        // Check if sequence matches Konami Code
        const matches = konamiCode.every((code, i) => code === newSequence[i]);
        
        if (matches) {
          setShowDiscount(true);
          // easter egg activated
          return [];
        }
        
        return newSequence;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!showDiscount) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative border-4 border-[#00ff41] bg-black p-12 shadow-[0_0_30px_rgba(0,255,65,0.6)] max-w-lg glitch-card">
        {/* Close Button */}
        <button
          onClick={() => setShowDiscount(false)}
          className="absolute top-4 right-4 text-[#00ff41] hover:text-white text-2xl font-bold"
          aria-label="Close"
        >
          ×
        </button>

        {/* Content */}
        <div className="text-center space-y-6">
          <div className="text-sm font-bold text-[#00ff41] uppercase tracking-widest" style={{ fontFamily: 'Courier New, Monaco, monospace', letterSpacing: '-0.02em' }}>
            ⚠️ SYSTEM_BREACH DETECTED ⚠️
          </div>
          
          <h3 className="text-4xl font-black text-[#00ff41] glitch-text" style={{ fontFamily: 'Courier New, Monaco, monospace', letterSpacing: '-0.03em' }}>
            50% OFF UNLOCKED
          </h3>
          
          <div className="bg-[#00ff41]/10 border-2 border-[#00ff41] p-6">
            <p className="text-lg font-bold text-[#00ff41] mb-2" style={{ fontFamily: 'Courier New, Monaco, monospace' }}>
              Use code:
            </p>
            <div className="bg-black border-2 border-[#00ff41] px-6 py-3 inline-block">
              <code className="text-2xl font-black text-[#00ff41] tracking-wider" style={{ fontFamily: 'Courier New, Monaco, monospace' }}>
                AMZ_DEAL
              </code>
            </div>
          </div>

          <p className="text-xs text-[#00ff41]/80" style={{ fontFamily: 'Courier New, Monaco, monospace' }}>
            Enter this code in the contact form to claim your discount.
          </p>
        </div>
      </div>
    </div>
  );
}

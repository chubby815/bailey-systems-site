"use client";

import { useEffect, useState } from "react";

export function HackerToggle() {
  const [hackerMode, setHackerMode] = useState(false);

  useEffect(() => {
    if (hackerMode) {
      document.documentElement.classList.add("hacker-mode");
    } else {
      document.documentElement.classList.remove("hacker-mode");
    }
  }, [hackerMode]);

  return (
    <button
      onClick={() => setHackerMode(!hackerMode)}
      className={`fixed top-20 right-4 z-[9999] px-4 py-2 border-2 font-bold text-sm transition-all ${
        hackerMode
          ? "bg-black border-[#00ff41] text-[#00ff41] shadow-[0_0_10px_#00ff41]"
          : "bg-[#0EA5E9] border-black text-white shadow-[3px_3px_0_rgba(0,0,0,1)]"
      }`}
      aria-label={hackerMode ? "Disable Hacker Mode" : "Enable Hacker Mode"}
    >
      {hackerMode ? "⚡ CYBER MODE" : "💻 CYBER MODE"}
    </button>
  );
}

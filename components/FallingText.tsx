"use client";

import { useState, useEffect } from "react";

type FallingTextProps = {
  variations: string[];
  className?: string;
};

export function FallingText({ variations, className = "" }: FallingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFalling, setIsFalling] = useState(false);
  const currentText = variations[currentIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % variations.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [variations.length]);

  const handleMouseEnter = () => {
    setIsFalling(true);
    setTimeout(() => setIsFalling(false), 600);
  };

  return (
    <span
      className={`relative inline-block cursor-pointer ${className}`}
      onMouseEnter={handleMouseEnter}
    >
      <span className="relative overflow-hidden inline-block">
        {currentText.split("").map((char, i) => (
          <span
            key={`${currentIndex}-${i}`}
            className={`inline-block ${isFalling ? "animate-fall" : ""}`}
            style={{
              animationDelay: isFalling ? `${i * 30}ms` : "0ms",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
      <span className="absolute -bottom-1 left-0 w-full h-2 bg-[#F4C430]"></span>
    </span>
  );
}

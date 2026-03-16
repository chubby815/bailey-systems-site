"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

type Props = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words" | "lines" | "chars,words" | "chars,lines" | "words,lines" | "chars,words,lines";
  from?: Record<string, unknown>;
  to?: Record<string, unknown>;
  threshold?: number;
  rootMargin?: string;
  textAlign?: string;
  tag?: string;
  onLetterAnimationComplete?: () => void;
};

export default function SplitText({
  text,
  className = "",
  delay = 100,
  duration = 0.6,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  tag = "p",
  onLetterAnimationComplete,
}: Props) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const split = new GSAPSplitText(el, { type: splitType });
      const elements =
        splitType === "chars"
          ? split.chars
          : splitType === "words"
          ? split.words
          : split.lines;

      gsap.set(elements, from as gsap.TweenVars);

      ScrollTrigger.create({
        trigger: el,
        start: `top bottom${rootMargin ? " " + rootMargin : ""}`,
        once: false,
        onEnter: () => {
          gsap.to(elements, {
            ...(to as gsap.TweenVars),
            duration,
            ease,
            stagger: delay / 1000,
            onComplete: onLetterAnimationComplete,
          });
        },
        onLeaveBack: () => {
          gsap.set(elements, from as gsap.TweenVars);
        },
      });

      return () => {
        split.revert();
      };
    },
    { scope: containerRef }
  );

  const Tag = tag as React.ElementType;

  return (
    <Tag
      ref={containerRef}
      className={className}
      style={{ textAlign: textAlign as React.CSSProperties["textAlign"] }}
    >
      {text}
    </Tag>
  );
}

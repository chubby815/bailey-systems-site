"use client";
/**
 * HeroReveal — GSAP word-by-word headline animation.
 * Only animates opacity + translateY (GPU-accelerated, no layout shift).
 * Respects prefers-reduced-motion. Cleanup via gsap.context().
 */
import { useEffect, useRef, type CSSProperties } from "react";

type Props = {
  children:  string;
  style?:    CSSProperties;
  /** Seconds between each word reveal */
  stagger?:  number;
  /** Animation duration per word */
  duration?: number;
  /** Initial Y offset in px */
  yOffset?:  number;
  /** Extra delay before animation starts */
  delay?:    number;
};

export function HeroReveal({
  children,
  style,
  stagger  = 0.08,
  duration = 0.65,
  yOffset  = 32,
  delay    = 0.15,
}: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect user preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.querySelectorAll<HTMLElement>(".hr-word").forEach((w) => {
        w.style.opacity   = "1";
        w.style.transform = "none";
      });
      return;
    }

    let ctx: { revert: () => void } | null = null;

    import("gsap").then(({ default: gsap }) => {
      ctx = gsap.context(() => {
        gsap.fromTo(
          el.querySelectorAll(".hr-word"),
          { opacity: 0, y: yOffset },
          {
            opacity:  1,
            y:        0,
            duration,
            stagger,
            ease:     "power2.out",
            delay,
          }
        );
      }, el);
    });

    return () => { ctx?.revert(); };
  }, [children, stagger, duration, yOffset, delay]);

  return (
    <h1 ref={ref} style={style}>
      {children.split(" ").map((word, i, arr) => (
        <span
          key={i}
          className="hr-word"
          style={{
            display:    "inline-block",
            opacity:    0,
            willChange: "transform, opacity",
          }}
        >
          {word}{i < arr.length - 1 ? "\u00a0" : ""}
        </span>
      ))}
    </h1>
  );
}

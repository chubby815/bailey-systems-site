"use client";
/**
 * StatCounter — GSAP ScrollTrigger count-up animation.
 * Triggers once when element enters the viewport (85% threshold).
 * Only animates numeric leading digits; preserves prefix/suffix like "+", "★", "k".
 * Cleanup via gsap.context().
 */
import { useEffect, useRef, type CSSProperties } from "react";

type Props = {
  value: string;
  style?: CSSProperties;
};

export function StatCounter({ value, style }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const match = value.match(/^(\d+)/);
    if (!match) return;

    const target = parseInt(match[1], 10);
    const suffix = value.slice(match[1].length); // e.g. "+", "★", " yrs"

    let ctx: { revert: () => void } | null = null;

    Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val:      target,
          duration: 2,
          ease:     "power2.out",
          scrollTrigger: {
            trigger: el,
            start:   "top 85%",
            once:    true,
          },
          onUpdate() {
            if (el) el.textContent = String(Math.round(obj.val)) + suffix;
          },
          onComplete() {
            if (el) el.textContent = value; // restore exact original
          },
        });
      }, el);
    });

    return () => { ctx?.revert(); };
  }, [value]);

  return (
    <span ref={ref} style={style}>
      {value}
    </span>
  );
}

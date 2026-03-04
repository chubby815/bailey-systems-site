"use client";
/**
 * ScrollAnimator — wraps children with a fade-in-on-scroll effect.
 * Requires .fade-in / .visible CSS classes (added to globals.css).
 * Elements already in the viewport on mount are revealed immediately.
 * Respects prefers-reduced-motion via CSS.
 */
import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Optional delay in ms — useful for staggered card grids */
  delay?: number;
  style?: React.CSSProperties;
};

export function ScrollAnimator({ children, className = "", delay = 0, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reveal = () => {
      if (delay > 0) {
        setTimeout(() => el.classList.add("visible"), delay);
      } else {
        el.classList.add("visible");
      }
    };

    // If already in viewport on mount, reveal immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`fade-in ${className}`} style={style}>
      {children}
    </div>
  );
}

"use client";

import {
  ButtonHTMLAttributes,
  cloneElement,
  isValidElement,
  ReactElement,
} from "react";
import { clsx } from "clsx";

const variantStyles = {
  primary:
    "bg-[#ffb000] text-[#0a0b0c] border border-[#ffb000] hover:bg-[#e09e00] hover:shadow-[0_0_15px_rgba(255,176,0,0.4)] transition-all button-primary",
  secondary:
    "border border-[rgba(75,83,32,0.6)] bg-transparent text-[#e5e5e0] hover:border-[#ffb000] hover:text-[#ffb000] hover:shadow-[0_0_10px_rgba(255,176,0,0.2)] transition-all button-secondary",
  ghost: "text-[#9ca3af] hover:text-[#ffb000] hover:bg-[rgba(75,83,32,0.1)]",
};

const sizeStyles = {
  sm: "text-xs px-4 py-1.5",
  md: "text-xs px-5 py-2",
  lg: "text-xs px-6 py-3",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  loading?: boolean;
  asChild?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  asChild = false,
  disabled,
  ...props
}: ButtonProps) {
  const styles = clsx(
    "inline-flex items-center justify-center font-bold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb000] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;
    return cloneElement(child, {
      className: clsx(child.props.className, styles),
    });
  }

  return (
    <button
      className={styles}
      disabled={disabled || loading}
      style={{ fontFamily: "var(--font-tactical)" }}
      {...props}
    >
      {loading && (
        <span className="mr-2 h-2.5 w-2.5 animate-spin rounded-none border-2 border-[rgba(255,176,0,0.4)] border-t-[#ffb000]" />
      )}
      {children}
    </button>
  );
}

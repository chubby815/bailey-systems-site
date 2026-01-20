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
    "bg-[#F4C430] text-black border-4 border-black shadow-[4px_4px_0_#0a0a0a] hover:bg-[#E6B800] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_#0a0a0a] transition-all",
  secondary:
    "border-4 border-black bg-white text-black shadow-[4px_4px_0_#0a0a0a] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_#0a0a0a]",
  ghost: "text-black hover:text-black/70 hover:bg-black/5",
};

const sizeStyles = {
  sm: "text-sm px-4 py-2",
  md: "text-sm px-5 py-2.5",
  lg: "text-base px-6 py-3",
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
    "inline-flex items-center justify-center font-bold transition-all focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement;
    return cloneElement(child, {
      className: clsx(child.props.className, styles),
    });
  }

  return (
    <button
      className={styles}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {children}
    </button>
  );
}


"use client";

import {
  forwardRef,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { clsx } from "clsx";

type FieldRef = HTMLInputElement | HTMLTextAreaElement;

type InputProps = (
  | InputHTMLAttributes<HTMLInputElement>
  | TextareaHTMLAttributes<HTMLTextAreaElement>
) & {
  label?: string;
  helperText?: string;
  error?: string;
  multiline?: boolean;
  hint?: string;
};

export const Input = forwardRef<FieldRef, InputProps>(
  (
    {
      label,
      helperText,
      error,
      className,
      multiline = false,
      hint,
      ...props
    },
    ref,
  ) => {
    const Component = multiline ? "textarea" : "input";
    return (
      <label className="flex w-full flex-col gap-2 text-sm font-medium text-white/80">
        {label && <span>{label}</span>}
        <Component
          ref={ref as never}
          className={clsx(
            "w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none",
            multiline && "min-h-[140px] resize-none leading-relaxed",
            error && "border-red-400/60",
            className,
          )}
          {...(props as Record<string, unknown>)}
        />
        <div className="flex flex-wrap items-center justify-between text-xs text-white/60">
          <span>{error || helperText}</span>
          {hint && <span className="font-semibold text-brand-accent">{hint}</span>}
        </div>
      </label>
    );
  },
);

Input.displayName = "Input";


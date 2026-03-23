"use client";

import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";

const variantClass: Record<Variant, string> = {
  primary:
    "rounded-xl bg-[#6a5acd] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#5a4abd] disabled:opacity-50",
  secondary:
    "rounded-xl bg-[#6a5acd] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#5a4abd] disabled:opacity-50",
  outline:
    "rounded-xl border border-[#6a5acd] bg-white px-4 py-2 text-sm font-semibold text-[#6a5acd] shadow-sm transition-colors hover:bg-[#6a5acd]/5 disabled:opacity-50",
  ghost:
    "rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50",
  danger:
    "rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-600 disabled:opacity-50",
};

export function EditorButton({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
}) {
  return (
    <button
      {...props}
      className={`${variantClass[variant]} ${className}`.trim()}
    />
  );
}


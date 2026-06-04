"use client";

import { cn } from "@/lib/utils";

interface GoldButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  loading?: boolean;
}

export function GoldButton({
  children,
  onClick,
  className,
  type = "button",
  disabled = false,
  loading = false,
}: GoldButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "bg-gradient-to-r from-yellow-500 to-yellow-300 text-black font-bold px-8 py-3 rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

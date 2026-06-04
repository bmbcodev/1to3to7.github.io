"use client";

import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function GlassCard({ children, className, onClick, hover = true }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "backdrop-blur-xl bg-white/5 border border-yellow-500/15 rounded-2xl shadow-xl transition-all duration-300",
        hover && "hover:border-yellow-500/40 hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:scale-[1.02]",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

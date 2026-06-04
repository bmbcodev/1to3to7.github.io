"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: "gold" | "purple" | "cyan" | "green" | "red";
  onClick?: () => void;
}

const colorMap = {
  gold: "text-gold bg-gold/10 border-gold/20",
  purple: "text-purple bg-purple/10 border-purple/20",
  cyan: "text-cyan bg-cyan/10 border-cyan/20",
  green: "text-green-400 bg-green-500/10 border-green-500/20",
  red: "text-red-400 bg-red-500/10 border-red-500/20",
};

export function StatsCard({ title, value, icon, color = "gold", onClick }: StatsCardProps) {
  return (
    <GlassCard
      onClick={onClick}
      className={cn("p-5 flex items-center gap-4", colorMap[color])}
    >
      <div className="p-3 rounded-xl bg-white/5">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-heading font-bold">{value}</p>
        <p className="text-sm text-gray-400 font-body">{title}</p>
      </div>
    </GlassCard>
  );
}

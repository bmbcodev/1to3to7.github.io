"use client";

import { useFollowers } from "@/hooks/useFollowers";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  large?: boolean;
  className?: string;
}

export function FollowButton({ large = false, className }: FollowButtonProps) {
  const { count, isFollowing, toggleFollow, isLoading } = useFollowers();

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <button
        onClick={toggleFollow}
        disabled={isLoading}
        className={cn(
          "font-bold rounded-full transition-all duration-300 border-2",
          large ? "px-10 py-4 text-lg" : "px-6 py-2 text-sm",
          isFollowing
            ? "bg-cyan-500/20 text-cyan-400 border-cyan-400 hover:bg-cyan-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]"
            : "bg-gold/10 text-gold border-gold/50 hover:bg-gold/20 hover:shadow-[0_0_30px_rgba(255,215,0,0.5)]"
        )}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </span>
        ) : isFollowing ? (
          <span className="tracking-widest">✦ FOLLOWING ✦</span>
        ) : (
          <span className="tracking-widest">✦ FOLLOW ✦</span>
        )}
      </button>
      <span className="text-sm text-gray-400 font-body">
        {count.toLocaleString()} {count === 1 ? "follower" : "followers"}
      </span>
    </div>
  );
}

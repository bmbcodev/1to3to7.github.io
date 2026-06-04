"use client";

import { useEffect, useState } from "react";
import { getOrCreateFingerprint } from "@/lib/fingerprint";

interface ReactionData {
  emoji: string;
  count: number;
  reacted: boolean;
}

const EMOJIS = ["❤️", "🔥", "🚀", "💡", "👍", "🎯"];

interface ProjectReactionsProps {
  projectId: string;
}

export function ProjectReactions({ projectId }: ProjectReactionsProps) {
  const [reactions, setReactions] = useState<Record<string, ReactionData>>({});
  const [loading, setLoading] = useState(true);

  const fetchReactions = async () => {
    try {
      const fingerprint = getOrCreateFingerprint();
      const res = await fetch(`/api/reactions?project_id=${projectId}&fingerprint=${fingerprint}`);
      const data = await res.json();
      if (data.reactions) setReactions(data.reactions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReactions(); }, [projectId]);

  const toggleReaction = async (emoji: string) => {
    const fingerprint = getOrCreateFingerprint();
    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: projectId, fingerprint, emoji }),
      });
      const data = await res.json();
      if (data.removed) {
        setReactions((prev) => {
          const next = { ...prev };
          if (next[emoji]) {
            next[emoji] = { ...next[emoji], count: next[emoji].count - 1, reacted: false };
            if (next[emoji].count <= 0) delete next[emoji];
          }
          return next;
        });
      } else {
        setReactions((prev) => {
          const next = { ...prev };
          if (next[emoji]) {
            next[emoji] = { ...next[emoji], count: next[emoji].count + 1, reacted: true };
          } else {
            next[emoji] = { emoji, count: 1, reacted: true };
          }
          return next;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {EMOJIS.map((emoji) => {
        const data = reactions[emoji];
        const isActive = data?.reacted;
        return (
          <button
            key={emoji}
            onClick={() => toggleReaction(emoji)}
            disabled={loading}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all duration-300 border ${
              isActive
                ? "bg-gold/20 border-gold/50 text-gold scale-105"
                : "bg-white/5 border-white/10 text-gray-400 hover:border-gold/30 hover:text-white"
            }`}
          >
            <span className="text-base">{emoji}</span>
            {data && data.count > 0 && (
              <span className="text-xs font-bold">{data.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

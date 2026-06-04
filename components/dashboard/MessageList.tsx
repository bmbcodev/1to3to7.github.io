"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { GlassCard } from "@/components/ui/GlassCard";
import { Mail, ChevronDown, Check } from "lucide-react";
import { format } from "date-fns";
import type { Message } from "@/types";

interface MessageListProps {
  messages: Message[];
  onRefresh: () => void;
}

export function MessageList({ messages, onRefresh }: MessageListProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const markAsRead = async (id: string) => {
    await supabase.from("messages").update({ is_read: true }).eq("id", id);
    onRefresh();
  };

  return (
    <div className="space-y-3">
      {messages.length === 0 ? (
        <GlassCard className="p-8 text-center">
          <Mail className="w-12 h-12 mx-auto text-gray-500 mb-3" />
          <p className="text-gray-400 font-body">No messages yet</p>
        </GlassCard>
      ) : (
        messages.map((msg) => (
          <GlassCard key={msg.id} className="p-4">
            <div
              className="flex items-start justify-between cursor-pointer"
              onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {!msg.is_read && <span className="w-2 h-2 rounded-full bg-gold" />}
                  <h3 className="text-white font-body font-semibold">{msg.name}</h3>
                  <span className="text-xs text-gray-500">{format(new Date(msg.created_at), "MMM d, yyyy")}</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{msg.subject || "No subject"}</p>
              </div>
              <div className="flex items-center gap-2">
                {!msg.is_read && (
                  <button
                    onClick={(e) => { e.stopPropagation(); markAsRead(msg.id); }}
                    className="p-1.5 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expanded === msg.id ? "rotate-180" : ""}`} />
              </div>
            </div>
            <AnimatePresence>
              {expanded === msg.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-gold/10 mt-4">
                    <p className="text-sm text-gray-300 mb-2">
                      <span className="text-gray-500">From:</span> {msg.email}
                    </p>
                    <p className="text-gray-300 font-body leading-relaxed whitespace-pre-wrap">{msg.body}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        ))
      )}
    </div>
  );
}

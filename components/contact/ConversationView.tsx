"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getOrCreateFingerprint } from "@/lib/fingerprint";
import { GlassCard } from "@/components/ui/GlassCard";
import { MessageCircle, User, Bot } from "lucide-react";
import { format } from "date-fns";
import type { Conversation } from "@/types";

export function ConversationView() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const fingerprint = getOrCreateFingerprint();
        const [convRes, sessionRes] = await Promise.all([
          fetch(`/api/conversations?fingerprint=${fingerprint}`),
          fetch(`/api/sessions?fingerprint=${fingerprint}`),
        ]);
        const convData = await convRes.json();
        const sessionData = await sessionRes.json();

        if (convData.conversations && convData.conversations.length > 0) {
          setConversations(convData.conversations);
        }
        if (sessionData.session) {
          setHasSession(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return null;
  if (conversations.length === 0) return null;

  const allMessages = conversations.flatMap((conv) => {
    const msgs: { id: string; sender: "user" | "founder"; body: string; created_at: string }[] = [
      {
        id: conv.message.id + "-msg",
        sender: "user",
        body: conv.message.body,
        created_at: conv.message.created_at,
      },
      ...conv.replies.map((r) => ({
        id: r.id,
        sender: r.sender === "founder" ? ("founder" as const) : ("user" as const),
        body: r.body,
        created_at: r.created_at,
      })),
    ];
    return msgs;
  }).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-5 h-5 text-gold" />
          <h2 className="text-lg font-heading font-semibold text-white">Your Conversation History</h2>
        </div>
        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
          {allMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === "user" ? "" : "flex-row-reverse"}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.sender === "founder"
                  ? "bg-gold/20 border border-gold/30"
                  : "bg-purple/20 border border-purple/30"
              }`}>
                {msg.sender === "founder" ? (
                  <Bot className="w-4 h-4 text-gold" />
                ) : (
                  <User className="w-4 h-4 text-purple" />
                )}
              </div>
              <div className={`max-w-[80%] ${msg.sender === "founder" ? "text-right" : ""}`}>
                <div className={`px-4 py-2 rounded-2xl text-sm font-body ${
                  msg.sender === "founder"
                    ? "bg-gold/10 border border-gold/20 text-white"
                    : "bg-purple/10 border border-purple/20 text-gray-200"
                }`}>
                  {msg.body}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {msg.sender === "founder" ? "BIZIMANA FILS" : "You"} &middot;{" "}
                  {format(new Date(msg.created_at), "MMM d, HH:mm")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { PageTransition } from "@/components/ui/PageTransition";
import { GlassCard } from "@/components/ui/GlassCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { Send, User, Bot, MessageSquare, ChevronLeft, Circle } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import type { Message, MessageReply } from "@/types";

export default function DashboardMessagesPage() {
  const [messages, setMessages] = useState<(Message & { replies?: MessageReply[] })[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    try {
      const { data } = await getSupabaseAdmin()
        .from("messages")
        .select("*, message_replies(*)")
        .order("created_at", { ascending: false });
      if (data) setMessages(data as (Message & { replies?: MessageReply[] })[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedId, messages]);

  const selected = messages.find((m) => m.id === selectedId);
  const allChatMessages = selected
    ? [
        { id: selected.id + "-msg", sender: "user" as const, body: selected.body, created_at: selected.created_at },
        ...(selected.replies || []).map((r) => ({
          id: r.id,
          sender: r.sender === "founder" ? ("founder" as const) : ("user" as const),
          body: r.body,
          created_at: r.created_at,
        })),
      ].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    : [];

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedId) return;
    setSending(true);
    try {
      const res = await fetch("/api/replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message_id: selectedId, body: replyText, sender: "founder" }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setReplyText("");
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-gold to-yellow-300 bg-clip-text text-transparent mb-4">
          Messages
        </h1>

        <div className="flex-1 flex gap-4 min-h-0">
          {/* Conversation list */}
          <div className={`w-full lg:w-80 flex-shrink-0 overflow-y-auto space-y-2 ${selectedId ? "hidden lg:block" : "block"}`}>
            {messages.length === 0 ? (
              <GlassCard className="p-6 text-center">
                <MessageSquare className="w-8 h-8 mx-auto text-gray-500 mb-2" />
                <p className="text-gray-400 text-sm font-body">No messages yet</p>
              </GlassCard>
            ) : (
              messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => setSelectedId(msg.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                    selectedId === msg.id
                      ? "bg-gold/10 border-gold/30"
                      : "bg-white/5 border-gold/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-body font-semibold text-sm flex items-center gap-2">
                      {!msg.is_read && <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />}
                      {msg.name}
                    </span>
                    <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{msg.subject || msg.body}</p>
                  {(msg.replies && msg.replies.length > 0) && (
                    <p className="text-xs text-gold/60 mt-1">{msg.replies.length} reply{msg.replies.length > 1 ? "ies" : "y"}</p>
                  )}
                </button>
              ))
            )}
          </div>

          {/* Chat view */}
          <div className={`flex-1 flex flex-col ${!selectedId ? "hidden lg:flex" : "flex"}`}>
            {selected ? (
              <>
                {/* Chat header */}
                <div className="flex items-center gap-3 p-3 border-b border-gold/10 mb-3">
                  <button onClick={() => setSelectedId(null)} className="lg:hidden text-gray-400 hover:text-gold">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-purple/20 border border-purple/30 flex items-center justify-center">
                    <User className="w-5 h-5 text-purple" />
                  </div>
                  <div>
                    <p className="text-white font-body font-semibold">{selected.name}</p>
                    <p className="text-xs text-gray-500">{selected.email} &middot; {format(new Date(selected.created_at), "MMM d, yyyy")}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1 text-xs text-gray-500">
                    <Circle className="w-2 h-2 text-green-400 fill-green-400" />
                    Seen recently
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {allChatMessages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.sender === "founder" ? "flex-row-reverse" : ""}`}>
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
                      <div className={`max-w-[75%] ${msg.sender === "founder" ? "text-right" : ""}`}>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm font-body ${
                          msg.sender === "founder"
                            ? "bg-gradient-to-r from-gold/20 to-yellow-500/10 border border-gold/20 text-white"
                            : "bg-white/5 border border-white/10 text-gray-200"
                        }`}>
                          {msg.body}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {msg.sender === "founder" ? "You" : selected.name} &middot;{" "}
                          {format(new Date(msg.created_at), "MMM d, HH:mm")}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Reply input */}
                <div className="flex gap-2 pt-3 border-t border-gold/10 mt-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your reply... (Enter to send)"
                    rows={2}
                    className="flex-1 px-4 py-2 bg-white/5 border border-gold/20 rounded-xl text-white font-body placeholder:text-gray-500 focus:outline-none focus:border-gold/50 resize-none text-sm"
                  />
                  <GoldButton onClick={handleSendReply} loading={sending} className="!px-4 !py-2 !text-sm self-end">
                    <Send className="w-4 h-4" />
                  </GoldButton>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 mx-auto text-gray-500 mb-3" />
                  <p className="text-gray-400 font-body">Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

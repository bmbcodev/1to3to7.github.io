"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle, Languages, Copy, Check, Trash2 } from "lucide-react";
import { AIIcon } from "./AIIcon";
import { findAnswer } from "@/lib/aiKnowledge";
import { languages, getLanguageName } from "@/lib/languages";

type Tab = "chat" | "translate";

interface ChatMessage {
  role: "user" | "ai";
  text: string;
}

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("chat");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "ai", text: "Hello! I'm the BIA CO AI Assistant. Ask me anything about BIA CO or use the translator!" },
  ]);
  const [transInput, setTransInput] = useState("");
  const [transOutput, setTransOutput] = useState("");
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("en");
  const [translating, setTranslating] = useState(false);
  const [copyDone, setCopyDone] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChat = () => {
    const q = chatInput.trim();
    if (!q) return;
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setChatLoading(true);
    setTimeout(() => {
      const answer = findAnswer(q);
      setMessages((prev) => [...prev, { role: "ai", text: answer }]);
      setChatLoading(false);
    }, 500 + Math.random() * 500);
    setChatInput("");
  };

  const handleTranslate = async () => {
    if (!transInput.trim()) return;
    setTranslating(true);
    setTransOutput("");
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: transInput, source: sourceLang, target: targetLang }),
      });
      const data = await res.json();
      setTransOutput(data.translatedText || "Translation failed");
    } catch {
      setTransOutput("Translation service unavailable");
    }
    setTranslating(false);
  };

  const handleCopy = async () => {
    if (!transOutput) return;
    try {
      await navigator.clipboard.writeText(transOutput);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    } catch { /* ignore */ }
  };

  const clearChat = () => {
    setMessages([
      { role: "ai", text: "Chat cleared. How can I help you?" },
    ]);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full
          bg-gradient-to-r from-amber-500 via-purple-600 to-cyan-500 text-white shadow-lg
          hover:shadow-xl hover:scale-105 transition-all duration-300 group"
        aria-label="Open AI Assistant"
      >
        <AIIcon className="w-5 h-5" />
        <span className="text-sm font-semibold">AI</span>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] max-h-[600px] 
              bg-gray-900/95 backdrop-blur-xl border border-amber-500/30 rounded-2xl shadow-2xl
              flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-purple-600/10 to-cyan-500/10">
              <div className="flex items-center gap-2">
                <AIIcon className="w-5 h-5" />
                <span className="text-white font-semibold text-sm">BIA CO AI</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-amber-500/20">
              <button
                onClick={() => setTab("chat")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
                  tab === "chat"
                    ? "text-amber-400 border-b-2 border-amber-400 bg-amber-500/5"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <MessageCircle size={14} />
                Chat
              </button>
              <button
                onClick={() => setTab("translate")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
                  tab === "translate"
                    ? "text-amber-400 border-b-2 border-amber-400 bg-amber-500/5"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <Languages size={14} />
                Translate
              </button>
            </div>

            {/* Body */}
            {tab === "chat" ? (
              <>
                <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[300px] max-h-[350px]">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-gradient-to-r from-amber-500/20 to-purple-600/20 text-white border border-amber-500/20 rounded-br-md"
                            : "bg-gray-800/80 text-gray-200 border border-gray-700/50 rounded-bl-md"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-800/80 rounded-2xl rounded-bl-md px-3.5 py-2 border border-gray-700/50">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEnd} />
                </div>
                <div className="flex items-center gap-2 p-3 border-t border-amber-500/20">
                  <button
                    onClick={clearChat}
                    className="text-gray-500 hover:text-red-400 transition-colors"
                    title="Clear chat"
                  >
                    <Trash2 size={16} />
                  </button>
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleChat()}
                    placeholder="Ask about BIA CO..."
                    className="flex-1 bg-gray-800/60 text-white text-sm rounded-full px-4 py-2 outline-none
                      border border-gray-700/50 focus:border-amber-500/50 transition-colors placeholder-gray-500"
                  />
                  <button
                    onClick={handleChat}
                    disabled={!chatInput.trim()}
                    className="p-2 rounded-full bg-gradient-to-r from-amber-500 to-purple-600 text-white
                      disabled:opacity-40 hover:opacity-90 transition-opacity"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[300px] max-h-[350px]">
                  {/* Source */}
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <select
                        value={sourceLang}
                        onChange={(e) => setSourceLang(e.target.value)}
                        className="bg-gray-800 text-gray-300 text-xs rounded-lg px-2 py-1.5 border border-gray-700/50 outline-none focus:border-amber-500/50"
                      >
                        {languages.map((l) => (
                          <option key={l.code} value={l.code}>
                            {l.native} ({l.name})
                          </option>
                        ))}
                      </select>
                      {sourceLang !== "auto" && (
                        <span className="text-[10px] text-gray-500">{getLanguageName(sourceLang)}</span>
                      )}
                    </div>
                    <textarea
                      value={transInput}
                      onChange={(e) => setTransInput(e.target.value)}
                      placeholder="Type or paste text to translate..."
                      rows={3}
                      className="w-full bg-gray-800/60 text-white text-sm rounded-xl px-3 py-2 outline-none
                        border border-gray-700/50 focus:border-amber-500/50 transition-colors resize-none placeholder-gray-500"
                    />
                  </div>

                  {/* Swap & Translate */}
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        if (sourceLang !== "auto") {
                          const tmp = sourceLang;
                          setSourceLang(targetLang);
                          setTargetLang(tmp);
                          setTransInput(transOutput);
                          setTransOutput(transInput);
                        }
                      }}
                      className="text-gray-400 hover:text-amber-400 transition-colors"
                      title="Swap languages"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 16l-4-4 4-4" /><path d="M17 8l4 4-4 4" /><path d="M3 12h18" />
                      </svg>
                    </button>
                    <button
                      onClick={handleTranslate}
                      disabled={!transInput.trim() || translating}
                      className="px-4 py-1.5 text-xs font-medium rounded-full bg-gradient-to-r from-amber-500 to-purple-600
                        text-white disabled:opacity-40 hover:opacity-90 transition-opacity"
                    >
                      {translating ? "Translating..." : "Translate"}
                    </button>
                  </div>

                  {/* Target */}
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <select
                        value={targetLang}
                        onChange={(e) => setTargetLang(e.target.value)}
                        className="bg-gray-800 text-gray-300 text-xs rounded-lg px-2 py-1.5 border border-gray-700/50 outline-none focus:border-amber-500/50"
                      >
                        {languages.filter((l) => l.code !== "auto").map((l) => (
                          <option key={l.code} value={l.code}>
                            {l.native} ({l.name})
                          </option>
                        ))}
                      </select>
                      <span className="text-[10px] text-gray-500">{getLanguageName(targetLang)}</span>
                    </div>
                    <div className="relative">
                      <textarea
                        value={transOutput}
                        readOnly
                        rows={3}
                        placeholder="Translation will appear here..."
                        className="w-full bg-gray-800/60 text-white text-sm rounded-xl px-3 py-2 outline-none
                          border border-amber-500/20 resize-none placeholder-gray-500"
                      />
                      {transOutput && (
                        <button
                          onClick={handleCopy}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-gray-700/80 hover:bg-gray-600 transition-colors"
                          title="Copy translation"
                        >
                          {copyDone ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-gray-300" />}
                        </button>
                      )}
                    </div>
                    {transOutput && (
                      <p className="text-[10px] text-gray-500 mt-1">
                        {sourceLang === "auto"
                          ? "Language auto-detected"
                          : `From: ${getLanguageName(sourceLang)}`}{" "}
                        → {getLanguageName(targetLang)}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

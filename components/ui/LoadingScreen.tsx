"use client";

import { motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] bg-bg flex flex-col items-center justify-center"
    >
      <h1 className="text-4xl md:text-6xl font-heading font-bold bg-gradient-to-r from-gold via-yellow-300 to-gold bg-clip-text text-transparent mb-6">
        BIA CO
      </h1>
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 border-2 border-gold/20 rounded-full" />
        <div className="absolute inset-0 border-2 border-t-gold rounded-full animate-spin" />
      </div>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";

export function RwandaEntrance() {
  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: "-100%" }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[90] pointer-events-none flex flex-col"
    >
      <div className="flex-1 bg-[#00A551]" />
      <div className="flex-1 bg-[#FAD201]" />
      <div className="flex-1 bg-[#E61C20]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8] }}
          transition={{ duration: 0.6, times: [0, 0.2, 0.7, 1] }}
          className="text-3xl md:text-5xl font-heading font-bold text-white drop-shadow-2xl"
        >
          RWANDA
        </motion.span>
      </div>
    </motion.div>
  );
}

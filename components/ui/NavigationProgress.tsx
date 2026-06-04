"use client";

import { motion, AnimatePresence } from "framer-motion";

interface NavigationProgressProps {
  visible: boolean;
}

export function NavigationProgress({ visible }: NavigationProgressProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed top-0 left-0 right-0 z-[200] h-0.5 bg-gradient-to-r from-amber-500 via-purple-600 to-cyan-500 origin-left"
          style={{ transformOrigin: "left" }}
        />
      )}
    </AnimatePresence>
  );
}

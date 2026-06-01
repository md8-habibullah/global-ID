"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#020202] text-primary flex flex-col items-center justify-center select-none cursor-wait">
      <div className="relative flex items-center justify-center">
        {/* Soft background glow */}
        <div className="absolute w-48 h-48 bg-primary/20 rounded-full blur-[60px]" />
        
        {/* Simple elegant spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border-[3px] border-primary/20 border-t-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]"
        />
        
        {/* Inner static dot */}
        <div className="absolute w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
      </div>

      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="mt-8 text-sm tracking-[0.3em] font-light text-primary uppercase"
      >
        Loading
      </motion.div>
    </div>
  );
}
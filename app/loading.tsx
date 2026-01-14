"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Terminal, Cpu, ShieldCheck, Server } from "lucide-react";

const loadingTexts = [
  "INITIALIZING_KERNEL...",
  "LOADING_MODULES...",
  "VERIFYING_SECURITY_PROTOCOLS...",
  "ESTABLISHING_UPLINK...",
  "DECRYPTING_ASSETS...",
  "MOUNTING_VIRTUAL_DOM...",
  "COMPILING_SOURCE...",
  "SYSTEM_READY",
];

export default function Preloader() {
  const [currentText, setCurrentText] = useState(0);

  // Cycle through loading texts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % loadingTexts.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] overflow-hidden cursor-wait">
      {/* 1. BACKGROUND GRID (Moving Perspective) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ffc81a_1px,transparent_1px),linear-gradient(to_bottom,#00ffc81a_1px,transparent_1px)] bg-[size:4rem_4rem] [transform:perspective(500px)_rotateX(60deg)_translateY(-100px)_scale(2)]" />
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]" />
      </div>

      {/* 2. CENTRAL REACTOR CORE */}
      <div className="relative flex items-center justify-center scale-150 md:scale-100">
        {/* Outer Ring - Slow Rotate */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute w-64 h-64 border border-primary/20 rounded-full border-dashed"
        />

        {/* Middle Ring - Fast Reverse Rotate */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="absolute w-48 h-48 border-2 border-primary/10 rounded-full border-t-primary/80 border-b-primary/80"
        />

        {/* Inner Core - Pulse */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-32 h-32 bg-primary/5 rounded-full backdrop-blur-md border border-primary/40 flex items-center justify-center shadow-[0_0_50px_rgba(0,255,200,0.2)]"
        >
          <Cpu className="w-12 h-12 text-primary animate-pulse" />
        </motion.div>

        {/* Orbiting Particles */}
        <div className="absolute w-64 h-64 animate-[spin_3s_linear_infinite]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_#00ffc8]" />
        </div>
      </div>

      {/* 3. LOADING TEXT & LOGS */}
      <div className="mt-12 text-center space-y-4 relative z-10">
        {/* Main Status */}
        <div className="h-8 overflow-hidden">
          <motion.div
            key={currentText}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="text-primary font-mono font-bold tracking-[0.2em] text-lg md:text-xl"
          >
            {loadingTexts[currentText]}
          </motion.div>
        </div>

        {/* Fake System Specs */}
        <div className="flex items-center justify-center gap-6 text-[10px] text-muted-foreground font-mono uppercase tracking-widest opacity-60">
          <div className="flex items-center gap-2">
            <Server className="w-3 h-3" />
            <span>Mem: 64GB OK</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3 h-3" />
            <span>Secure: TRUE</span>
          </div>
          <div className="flex items-center gap-2">
            <Terminal className="w-3 h-3" />
            <span>Root: ACTIVE</span>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM PROGRESS BAR (Full Width) */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/10">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="h-full bg-primary shadow-[0_0_20px_#00ffc8]"
        />
      </div>

      {/* 5. SCANLINE OVERLAY */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[110] bg-[length:100%_2px,3px_100%] opacity-20" />
    </div>
  );
}

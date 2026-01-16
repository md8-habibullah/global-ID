"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Wifi, Zap } from "lucide-react";

// --- CONFIG: "Matrix" Style Logs ---
const BOOT_SEQUENCE = [
  "bios_check: PASS",
  "allocating_memory: 64GB... OK",
  "decrypting_core: AES-256",
  "mounting_volumes: /dev/sda1",
  "loading_kernel_modules...",
  "bypassing_firewall_layer_3",
  "optimizing_neural_net",
  "establishing_uplink: SECURE",
  "rendering_virtual_dom",
  "injecting_styles...",
  "compiling_shaders...",
  "system_ready: TRUE",
];

export default function ArchitectPreloader() {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  // 1. Progress Bar & Log Logic (ACCELERATED)
  useEffect(() => {
    let step = 0;
    // Speed: 120ms (Was 350ms) -> Super fast scrolling
    const interval = setInterval(() => {
      if (step < BOOT_SEQUENCE.length) {
        setLogs((prev) => [...prev.slice(-5), BOOT_SEQUENCE[step]]);
        step++;
      }
      // Fills up fast
      setProgress((prev) => Math.min(prev + 8, 100));
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#020202] text-primary font-mono overflow-hidden flex flex-col items-center justify-center select-none cursor-wait">

      {/* === 1. BACKGROUND LAYER: Grid & Scanline === */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:30px_30px]" />
        {/* Moving Scanline (Speed: 1.5s) */}
        <motion.div
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 w-full h-[2px] bg-primary shadow-[0_0_20px_rgba(var(--primary),0.5)] opacity-50"
        />
      </div>

      {/* === 2. HUD CORNERS === */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 flex flex-col gap-1 z-20">
        <div className="flex items-center gap-2 text-xs md:text-sm font-bold tracking-widest opacity-80">
          <Cpu className="w-4 h-4 animate-pulse" />
          <span>SYSTEM_ARCHITECT // V.4.0</span>
        </div>
        <div className="text-[10px] text-primary/50">ID: 884-XJ-99</div>
      </div>

      <div className="absolute top-4 right-4 md:top-8 md:right-8 flex flex-col items-end gap-1 z-20 text-right hidden sm:flex">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest opacity-80">
          <span>NET_UPLINK</span>
          <Wifi className="w-4 h-4" />
        </div>
        <div className="text-[10px] text-primary/50">PING: 14ms | STABLE</div>
      </div>

      {/* === 3. CENTER REACTOR === */}
      <div className="relative flex items-center justify-center scale-[0.85] md:scale-100">

        {/* Ring 1: Base (Fast Spin: 10s) */}
        <div className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full border border-primary/10 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-primary/20 border-dashed opacity-30 animate-[spin_10s_linear_infinite]" />
        </div>

        {/* Ring 2: Data Sectors (Speed: 5s) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="absolute w-[260px] h-[260px] md:w-[340px] md:h-[340px] opacity-60"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            <path d="M 50 50 m -45 0 a 45 45 0 1 0 90 0 a 45 45 0 1 0 -90 0" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="20 40" />
            <path d="M 50 50 m -35 0 a 35 35 0 1 0 70 0 a 35 35 0 1 0 -70 0" fill="none" stroke="currentColor" strokeWidth="0.2" strokeDasharray="10 10" />
          </svg>
        </motion.div>

        {/* Ring 3: Fast Spinner (Speed: 1.5s) */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute w-[220px] h-[220px] md:w-[280px] md:h-[280px] rounded-full border-t-2 border-l-2 border-primary/80 border-r-transparent border-b-transparent opacity-80 shadow-[0_0_15px_rgba(var(--primary),0.2)]"
        />

        {/* Core: Data Stream */}
        <div className="absolute w-32 h-32 md:w-40 md:h-40 bg-black/80 backdrop-blur-md rounded-full border border-primary/30 flex flex-col items-center justify-center overflow-hidden z-10 shadow-[0_0_40px_rgba(var(--primary),0.1)]">
          <Zap className="w-8 h-8 text-primary mb-2 animate-pulse" />
          <div className="text-[10px] leading-tight text-primary/70 text-center w-24">
            <div className="flex justify-center gap-1">
              <span className="animate-pulse">0x4F</span>
              <span>0xA2</span>
              <span className="opacity-50">0x11</span>
            </div>
            <div className="flex justify-center gap-1 mt-0.5">
              <span className="opacity-50">0x99</span>
              <span className="animate-pulse">0xBB</span>
              <span>0x00</span>
            </div>
          </div>
        </div>
      </div>

      {/* === 4. TERMINAL LOG (Bottom Left) === */}
      <div className="absolute bottom-20 left-4 md:left-8 md:bottom-8 w-64 md:w-80 h-32 flex flex-col justify-end pointer-events-none">
        <div className="text-[10px] text-primary/40 mb-1 border-b border-primary/20 pb-1 w-full flex justify-between">
          <span>TERMINAL_OUTPUT</span>
          <span>./root</span>
        </div>
        <div className="flex flex-col gap-1 overflow-hidden">
          <AnimatePresence mode="popLayout">
            {logs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20, filter: "blur(5px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.1 }}
                className="text-xs md:text-sm text-primary/90 truncate font-bold"
              >
                <span className="text-primary/40 mr-2">{`>`}</span>
                {log}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* === 5. PROGRESS BAR === */}
      <div className="absolute bottom-0 left-0 w-full">
        <div className="flex items-center justify-between px-4 pb-2 text-[10px] text-primary/60">
          <span>LOADING_ASSETS...</span>
          <span>{Math.min(progress, 100)}%</span>
        </div>
        <div className="h-1 bg-primary/10 w-full">
          <motion.div
            className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.6)]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.2 }}
          />
        </div>
      </div>

    </div>
  );
}
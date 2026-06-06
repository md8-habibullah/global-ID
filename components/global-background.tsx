"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function GlobalBackground() {
  const { scrollYProgress } = useScroll();

  // Slow, subtle parallax movement for different layers
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* 1. Cyber Grid Layer */}
      <div 
        className="absolute inset-0 opacity-[0.005] dark:opacity-[0.008]"
        style={{
          backgroundImage: `
            linear-gradient(var(--border) 1px, transparent 1px), 
            linear-gradient(90deg, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* 2. Ambient Glows (The \"Design\" you liked) */}
      
      {/* Top Left - Primary Theme Glow */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/[0.01] rounded-full blur-[120px] dark:bg-primary/[0.005]"
      />

      {/* Center Right - Secondary/Accent Glow */}
      <motion.div
        style={{ y: y2 }}
        className="absolute top-[20%] right-[-5%] w-[45%] h-[55%] bg-blue-500/[0.005] rounded-full blur-[100px] dark:bg-blue-400/[0.005]"
      />

      {/* Bottom Left - Soft Primary Glow */}
      <motion.div
        style={{ y: y3 }}
        className="absolute bottom-[-10%] left-[5%] w-[50%] h-[50%] bg-primary/[0.01] rounded-full blur-[130px] dark:bg-primary/[0.005]"
      />

      {/* 3. Global Noise Texture (Subtle Premium Feel) */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      
      {/* 4. Bottom Fade to Black (Subtler for Footer Visibility) */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}

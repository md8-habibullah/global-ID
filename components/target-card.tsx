"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TargetCardProps {
  children: React.ReactNode
  className?: string
}

export default function TargetCard({ children, className }: TargetCardProps) {
  return (
    // Removed 'cursor-crosshair' here
    <div className={cn("relative group", className)}>
      {/* The content container */}
      <div className="relative z-10 h-full">{children}</div>

      {/* Top Left Corner */}
      <motion.div
        className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-primary z-20 opacity-0 group-hover:opacity-100 transition-opacity"
        initial={{ x: -10, y: -10 }}
        whileHover={{ x: 0, y: 0 }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Top Right Corner */}
      <motion.div
        className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-primary z-20 opacity-0 group-hover:opacity-100 transition-opacity"
        initial={{ x: 10, y: -10 }}
        whileHover={{ x: 0, y: 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* Bottom Left Corner */}
      <motion.div
        className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-primary z-20 opacity-0 group-hover:opacity-100 transition-opacity"
        initial={{ x: -10, y: 10 }}
        whileHover={{ x: 0, y: 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* Bottom Right Corner */}
      <motion.div
        className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-primary z-20 opacity-0 group-hover:opacity-100 transition-opacity"
        initial={{ x: 10, y: 10 }}
        whileHover={{ x: 0, y: 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* Optional: Full "Fire" Border Glow */}
      <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/50 rounded-xl transition-colors duration-500 pointer-events-none" />
    </div>
  )
}
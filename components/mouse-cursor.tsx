"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function MouseCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    // Only run on desktop to avoid interfering with mobile touch
    if (window.matchMedia("(min-width: 768px)").matches) {
      // Create a style element to hide the cursor globally
      const style = document.createElement('style')
      style.id = 'hide-cursor-style'
      style.innerHTML = `
        * { cursor: none !important; }
      `
      document.head.appendChild(style)

      const updateMousePosition = (e: MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY })
      }

      const handleMouseEnter = () => setIsHovering(true)
      const handleMouseLeave = () => setIsHovering(false)

      const clickables = document.querySelectorAll('a, button, [role="button"], input, textarea')
      
      clickables.forEach((el) => {
        el.addEventListener("mouseenter", handleMouseEnter)
        el.addEventListener("mouseleave", handleMouseLeave)
      })

      window.addEventListener("mousemove", updateMousePosition)

      return () => {
        window.removeEventListener("mousemove", updateMousePosition)
        clickables.forEach((el) => {
          el.removeEventListener("mouseenter", handleMouseEnter)
          el.removeEventListener("mouseleave", handleMouseLeave)
        })
        // Cleanup: Bring back the cursor if this component unmounts
        const existingStyle = document.getElementById('hide-cursor-style')
        if (existingStyle) {
          existingStyle.remove()
        }
      }
    }
  }, [])

  // Variants for the cursor animation
  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      height: 32,
      width: 32,
      backgroundColor: "transparent",
      border: "2px solid #10b981", // Primary green
    },
    hover: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      height: 48,
      width: 48,
      backgroundColor: "rgba(16, 185, 129, 0.1)", // Green tint on hover
      border: "2px solid #10b981",
    },
  }

  // Only render on desktop (hidden md:block) to prevent issues on mobile
  return (
    <>
      <motion.div
        className="fixed top-0 left-0 z-[9999] rounded-full pointer-events-none hidden md:block mix-blend-difference"
        variants={variants}
        animate={isHovering ? "hover" : "default"}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5
        }}
      />
      {/* Center Dot */}
      <div 
        className="fixed top-0 left-0 z-[9999] w-2 h-2 bg-primary rounded-full pointer-events-none hidden md:block"
        style={{ 
          transform: `translate(${mousePosition.x - 4}px, ${mousePosition.y - 4}px)` 
        }}
      />
    </>
  )
}
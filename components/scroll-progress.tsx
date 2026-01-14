"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useScroll, useTransform } from "framer-motion";
import { ChevronUp } from "lucide-react";

export default function ScrollProgress() {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    // Hook to get scroll progress from 0 to 1
    const { scrollYProgress } = useScroll();

    // Smooth out the progress value for the SVG stroke
    const pathLength = useSpring(scrollYProgress, { stiffness: 400, damping: 90 });

    // Map background fill opacity based on scroll
    const bgOpacity = useTransform(scrollYProgress, [0, 1], [0.05, 0.2]);

    useEffect(() => {
        const updateProgress = () => {
            // Calculate percentage for text
            const currentProgress = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

            if (scrollHeight) {
                const percent = Number((currentProgress / scrollHeight).toFixed(2));
                setProgress(Math.round(percent * 100));

                // Only show after scrolling down a bit
                setIsVisible(window.scrollY > 50);
            }
        };

        window.addEventListener("scroll", updateProgress);
        return () => window.removeEventListener("scroll", updateProgress);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{
                x: isVisible ? 0 : -100,
                opacity: isVisible ? 1 : 0
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            // DRAG PHYSICS
            drag
            dragConstraints={{ left: 0, right: 300, top: -300, bottom: 300 }}
            dragElastic={0.2}
            dragSnapToOrigin={true} // Snaps back to left wall
            whileDrag={{ scale: 1.1, cursor: "grabbing" }}
            className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex items-center touch-none"
        >
            {/* THE D-SHAPE CONTAINER 
         - Mobile: w-10 h-20 (Smaller/Compact)
         - Desktop: md:w-16 md:h-32 (Standard)
         - Large Screen: lg:w-20 lg:h-40 (Bigger/HUD Style)
      */}
            <motion.div
                className="relative flex items-center justify-center 
                   w-10 h-20             
                   md:w-16 md:h-32 
                   lg:w-20 lg:h-40
                   bg-background/80 backdrop-blur-md 
                   border-r border-t border-b border-primary/20
                   rounded-r-full shadow-[0_0_20px_rgba(0,255,200,0.1)]
                   group hover:border-primary/50 transition-colors duration-300
                   cursor-grab active:cursor-grabbing overflow-hidden"
                onClick={scrollToTop}
                style={{ backgroundColor: `rgba(10, 10, 10, ${bgOpacity})` }}
            >

                {/* SEMI-CIRCLE PROGRESS BAR SVG */}
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 50 100"
                    preserveAspectRatio="none"
                >
                    {/* Background Track */}
                    <path
                        d="M 1 5 Q 50 50 1 95"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-muted-foreground/10"
                    />

                    {/* Active Progress Line */}
                    <motion.path
                        d="M 1 5 Q 50 50 1 95"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="text-primary drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                        style={{ pathLength }}
                    />
                </svg>

                {/* INNER FILL EFFECT (Liquid Fill Top -> Bottom) */}
                {/* Changed 'bottom-0' to 'top-0' so it grows downwards */}
                <motion.div
                    className="absolute top-0 left-0 w-full bg-primary/10 -z-10"
                    style={{ height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
                />

                {/* TEXT CONTENT */}
                <div className="flex flex-col items-center justify-center z-10 pr-1 md:pr-2">
                    <span className="text-[9px] md:text-xs lg:text-sm font-mono font-bold text-primary/80 group-hover:hidden">
                        {progress}
                        <span className="text-[8px] md:text-[10px]">%</span>
                    </span>
                    <ChevronUp className="w-4 h-4 md:w-6 md:h-6 hidden group-hover:block animate-bounce text-primary" />
                </div>

                {/* Tech Decor: The 'Hinge' on the wall */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 md:w-1 h-6 md:h-10 bg-primary/30 rounded-r-md" />

            </motion.div>

            {/* Floating Label (Desktop Only) */}
            <div className="hidden md:block absolute left-full ml-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                <span className="text-[9px] font-mono text-primary bg-black/90 px-2 py-1 rounded border border-primary/20 backdrop-blur">
                    SCROLL_SYS
                </span>
            </div>

        </motion.div>
    );
}
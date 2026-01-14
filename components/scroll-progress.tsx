"use client";

import { useEffect, useState } from "react";
import {
    motion,
    useSpring,
    useScroll,
    useTransform,
    useAnimation,
} from "framer-motion";
import { ChevronUp } from "lucide-react";

export default function ScrollProgress() {
    const [progress, setProgress] = useState(0);

    // Scroll Progress Logic
    const { scrollYProgress } = useScroll();
    const pathLength = useSpring(scrollYProgress, {
        stiffness: 400,
        damping: 90,
    });
    const bgOpacity = useTransform(scrollYProgress, [0, 1], [0.1, 0.3]);

    useEffect(() => {
        const updateProgress = () => {
            const currentProgress = window.scrollY;
            const scrollHeight =
                document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight) {
                const percent = Number((currentProgress / scrollHeight).toFixed(2));
                setProgress(Math.round(percent * 100));
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
            // FIXED POSITION: Left side, 65% down from top
            className="fixed left-0 top-[65%] -translate-y-1/2 z-50 flex items-center touch-none"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
        >
            {/* THE D-SHAPE CONTAINER */}
            <motion.div
                className={`relative flex items-center justify-center 
                   w-10 h-20             /* Mobile/Tablet Size */
                   lg:w-16 lg:h-32       /* Desktop Size */
                   bg-background/80 backdrop-blur-md 
                   border-t border-b border-r border-primary/20
                   shadow-[0_0_20px_rgba(0,255,200,0.15)]
                   rounded-r-full
                   group hover:border-primary/50 transition-colors duration-300
                   cursor-pointer overflow-hidden`}
                onClick={scrollToTop}
                style={{ backgroundColor: `rgba(10, 10, 10, ${bgOpacity})` }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* === INTERNAL GLOW SCANNER === */}
                <motion.div
                    animate={{ top: ["-20%", "120%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent shadow-[0_0_15px_#00ffc8] z-0 pointer-events-none"
                />

                {/* PROGRESS SVG */}
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 50 100"
                    preserveAspectRatio="none"
                >
                    {/* Track */}
                    <path
                        d="M 1 5 Q 50 50 1 95"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-muted-foreground/10"
                    />
                    {/* Active Line */}
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

                {/* LIQUID FILL (Top -> Bottom) */}
                <motion.div
                    className="absolute top-0 left-0 w-full bg-primary/10 -z-10"
                    style={{
                        height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
                    }}
                />

                {/* TEXT CONTENT */}
                <div className="flex flex-col items-center justify-center z-10 pr-1 lg:pr-2">
                    <span className="text-[9px] lg:text-sm font-mono font-bold text-primary/80 group-hover:hidden">
                        {progress}
                        <span className="text-[8px] lg:text-[10px]">%</span>
                    </span>
                    <ChevronUp className="w-4 h-4 lg:w-6 lg:h-6 hidden group-hover:block animate-bounce text-primary" />
                </div>

                {/* DECORATIVE HINGE */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 lg:w-1 h-6 lg:h-10 bg-primary/30 rounded-r-md" />
            </motion.div>

            {/* FLOATING LABEL (Hidden on mobile) */}
            <div className="hidden lg:block absolute left-full ml-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                <span className="text-[9px] font-mono text-primary bg-black/90 px-2 py-1 rounded border border-primary/20 backdrop-blur">
                    SYSTEM_HUD
                </span>
            </div>
        </motion.div>
    );
}
"use client";

import { useEffect, useRef, useState } from "react";

interface GlobalSpiderProps {
    color?: string; // e.g., "0, 255, 200"
}

// === HELPER: Secure Random Generator ===
const getSecureRandom = () => {
    if (typeof window === "undefined") return 0.5;
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return values[0] / 4294967296;
};

// === PARTICLE CLASS (Defined Outside Component) ===
class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;

    constructor(width: number, height: number) {
        this.x = getSecureRandom() * width;
        this.y = getSecureRandom() * height;
        this.vx = (getSecureRandom() - 0.5) * 0.5;
        this.vy = (getSecureRandom() - 0.5) * 0.5;
        this.size = getSecureRandom() * 1.5 + 0.5;
    }

    update(width: number, height: number, mouse: any, attractor: any, mouseDist: number) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Skip complex targeting logic if mouse/attractor is far (Optimization)
        let targetX = -1000, targetY = -1000, distLimit = 0;

        if (mouse.isActive) {
            targetX = mouse.x;
            targetY = mouse.y;
            distLimit = mouseDist;
        } else if (typeof window !== "undefined" && window.scrollY < height * 0.8) {
            targetX = attractor.x;
            targetY = attractor.y;
            distLimit = mouseDist + 80;
        }

        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < distLimit) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (distLimit - distance) / distLimit;
            const strength = mouse.isActive ? 0.04 : 0.01;

            this.vx += forceDirectionX * force * strength;
            this.vy += forceDirectionY * force * strength;
        }
    }

    draw(ctx: CanvasRenderingContext2D, color: string) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, 0.5)`;
        ctx.fill();
    }
}

export default function GlobalSpider({ color = "0, 255, 200" }: GlobalSpiderProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isMobile, setIsMobile] = useState(true); // Default to true for safety

    // 1. Mobile Detection Strategy
    useEffect(() => {
        const checkMobile = () => {
            // Check both screen width AND touch capability
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
        };
        checkMobile();

        let timeoutId: NodeJS.Timeout;
        const debouncedCheck = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(checkMobile, 200);
        };

        window.addEventListener("resize", debouncedCheck);
        return () => window.removeEventListener("resize", debouncedCheck);
    }, []);

    // 2. Animation Logic
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // === MOBILE OPTIMIZATION: STOP EARLY ===
        // If mobile, clear canvas and do nothing.
        // This completely saves the CPU.
        if (isMobile) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }

        let width = window.innerWidth;
        let height = window.innerHeight;

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        handleResize();

        // === DESKTOP CONFIGURATION ===
        // Density logic is simpler now since we only run on desktop
        const density = 13000;
        const particleCount = Math.floor((width * height) / density);
        const connectionDist = 150;
        const mouseDist = 200;

        const attractor = {
            x: width * 0.75,
            y: height * 0.35
        };

        const mouse = { x: -1000, y: -1000, isActive: false };

        // Initialize Particles
        const particles: Particle[] = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(width, height));
        }

        let animationId: number;

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Attractor Position logic
            attractor.x = width * 0.75;
            attractor.y = height * 0.35;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.update(width, height, mouse, attractor, mouseDist);
                p.draw(ctx, color);

                // 1. Connect Particle-to-Particle
                // Optimization: Start j from i+1 to avoid double checking
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;

                    // Optimization: Check squared distance first to avoid Math.sqrt
                    const distSq = dx * dx + dy * dy;
                    const connDistSq = connectionDist * connectionDist;

                    if (distSq < connDistSq) {
                        ctx.beginPath();
                        const dist = Math.sqrt(distSq);
                        const opacity = 1 - (dist / connectionDist);
                        ctx.strokeStyle = `rgba(${color}, ${opacity * 0.2})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }

                // 2. Connect to Target (Mouse or Attractor)
                let targetX = -1000, targetY = -1000;

                if (mouse.isActive) {
                    targetX = mouse.x;
                    targetY = mouse.y;
                } else if (typeof window !== "undefined" && window.scrollY < height * 0.8) {
                    targetX = attractor.x;
                    targetY = attractor.y;
                }

                const dx = p.x - targetX;
                const dy = p.y - targetY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const limit = mouse.isActive ? mouseDist : mouseDist + 50;

                if (dist < limit) {
                    ctx.beginPath();
                    const opacity = 1 - (dist / limit);
                    ctx.strokeStyle = `rgba(${color}, ${opacity * 0.4})`;
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(targetX, targetY);
                    ctx.stroke();
                }
            }
            animationId = requestAnimationFrame(animate);
        };

        animate();

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.isActive = true;
        };

        const handleMouseLeave = () => {
            mouse.isActive = false;
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseout", handleMouseLeave);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseout", handleMouseLeave);
            cancelAnimationFrame(animationId);
        };
    }, [isMobile, color]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none block"
            style={{ opacity: 1 }}
        />
    );
}
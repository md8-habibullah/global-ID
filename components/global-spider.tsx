"use client";

import { useEffect, useRef, useState } from "react";

interface GlobalSpiderProps {
    color?: string; // e.g., "0, 255, 200"
}

export default function GlobalSpider({ color = "0, 255, 200" }: GlobalSpiderProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    // 1. Mobile Detection
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // 2. Animation Logic
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        handleResize();

        // === CONFIGURATION: "Small & Lighter" Mode ===
        // Density: Medium-High (enough for many wires, but not crowded)
        const density = isMobile ? 18000 : 13000;
        const particleCount = Math.floor((width * height) / density);

        // Connections: Kept wide to maintain "More Wires" look
        const connectionDist = isMobile ? 110 : 150;
        const mouseDist = isMobile ? 140 : 200;

        // === ATTRACTOR POSITION ===
        const attractor = {
            x: isMobile ? width * 0.5 : width * 0.75,
            y: isMobile ? height * 0.3 : height * 0.35
        };

        const mouse = { x: -1000, y: -1000, isActive: false };

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                // SPEED: "Low" (Slower, calmer movement)
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                // SIZE: "Small" (Tiny, elegant dots)
                this.size = Math.random() * 1.5 + 0.5;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // === TARGETING LOGIC ===
                let targetX = -1000, targetY = -1000, distLimit = 0;

                if (mouse.isActive) {
                    targetX = mouse.x;
                    targetY = mouse.y;
                    distLimit = mouseDist;
                } else if (window.scrollY < height * 0.8) {
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

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                // LIGHTER: 0.5 Opacity (Visible but not heavy)
                ctx.fillStyle = `rgba(${color}, 0.5)`;
                ctx.fill();
            }
        }

        const particles: Particle[] = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        let animationId: number;
        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            attractor.x = isMobile ? width * 0.5 : width * 0.75;
            attractor.y = isMobile ? height * 0.3 : height * 0.35;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.update();
                p.draw();

                // 1. Connect Particle-to-Particle
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDist) {
                        ctx.beginPath();
                        const opacity = 1 - (dist / connectionDist);
                        // LIGHTER WIRES:
                        // Width: 0.5 (Very thin silk)
                        // Opacity: 0.2 max (Subtle web)
                        ctx.strokeStyle = `rgba(${color}, ${opacity * 0.2})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }

                // 2. Connect to Target
                let targetX = -1000, targetY = -1000;

                if (mouse.isActive) {
                    targetX = mouse.x;
                    targetY = mouse.y;
                } else if (window.scrollY < height * 0.8) {
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
                    // Interaction lines: Slightly stronger (0.4) but still light
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
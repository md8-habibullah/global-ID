// "use client";

// import { useEffect, useRef } from "react";

// interface SpiderCanvasProps {
//     color?: string; // Color of the particles/lines
//     limit?: number; // Distance limit for connections
//     particleCount?: number; // Number of particles
// }

// export default function SpiderCanvas({
//     color = "0, 255, 200", // Default to your primary cyan (#00ffc8)
//     limit = 120,           // Connection distance
//     particleCount = 40,    // Number of dots
// }: SpiderCanvasProps) {
//     const canvasRef = useRef<HTMLCanvasElement>(null);

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         if (!canvas) return;

//         const ctx = canvas.getContext("2d");
//         if (!ctx) return;

//         let width = (canvas.width = canvas.offsetWidth);
//         let height = (canvas.height = canvas.offsetHeight);

//         // Track mouse position relative to canvas
//         let mouse = { x: -1000, y: -1000 };

//         // Particle Class
//         class Particle {
//             x: number;
//             y: number;
//             vx: number;
//             vy: number;
//             size: number;

//             constructor() {
//                 this.x = Math.random() * width;
//                 this.y = Math.random() * height;
//                 // Random velocity between -0.5 and 0.5 for smooth "floating"
//                 this.vx = (Math.random() - 0.5) * 1.5;
//                 this.vy = (Math.random() - 0.5) * 1.5;
//                 this.size = Math.random() * 2 + 1;
//             }

//             update() {
//                 this.x += this.vx;
//                 this.y += this.vy;

//                 // Bounce off edges
//                 if (this.x < 0 || this.x > width) this.vx *= -1;
//                 if (this.y < 0 || this.y > height) this.vy *= -1;
//             }

//             draw() {
//                 if (!ctx) return;
//                 ctx.beginPath();
//                 ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
//                 ctx.fillStyle = `rgba(${color}, 0.5)`;
//                 ctx.fill();
//             }
//         }

//         // Initialize Particles
//         const particles: Particle[] = [];
//         for (let i = 0; i < particleCount; i++) {
//             particles.push(new Particle());
//         }

//         // Animation Loop
//         const animate = () => {
//             ctx.clearRect(0, 0, width, height);

//             // Update and Draw Particles
//             particles.forEach((p, index) => {
//                 p.update();
//                 p.draw();

//                 // Connect particles to each other
//                 for (let j = index + 1; j < particles.length; j++) {
//                     const p2 = particles[j];
//                     const dx = p.x - p2.x;
//                     const dy = p.y - p2.y;
//                     const distance = Math.sqrt(dx * dx + dy * dy);

//                     if (distance < limit) {
//                         ctx.beginPath();
//                         ctx.strokeStyle = `rgba(${color}, ${1 - distance / limit})`;
//                         ctx.lineWidth = 0.5;
//                         ctx.moveTo(p.x, p.y);
//                         ctx.lineTo(p2.x, p2.y);
//                         ctx.stroke();
//                     }
//                 }

//                 // Connect particles to mouse
//                 const dx = p.x - mouse.x;
//                 const dy = p.y - mouse.y;
//                 const distance = Math.sqrt(dx * dx + dy * dy);

//                 if (distance < limit + 50) { // Slightly larger range for mouse interaction
//                     ctx.beginPath();
//                     ctx.strokeStyle = `rgba(${color}, ${1 - distance / (limit + 50)})`;
//                     ctx.lineWidth = 0.8;
//                     ctx.moveTo(p.x, p.y);
//                     ctx.lineTo(mouse.x, mouse.y);
//                     ctx.stroke();
//                 }
//             });

//             requestAnimationFrame(animate);
//         };

//         animate();

//         // Event Listeners
//         const handleResize = () => {
//             if (canvas) {
//                 width = canvas.width = canvas.offsetWidth;
//                 height = canvas.height = canvas.offsetHeight;
//             }
//         };

//         const handleMouseMove = (e: MouseEvent) => {
//             if (canvas) {
//                 const rect = canvas.getBoundingClientRect();
//                 mouse.x = e.clientX - rect.left;
//                 mouse.y = e.clientY - rect.top;
//             }
//         };

//         const handleMouseLeave = () => {
//             mouse.x = -1000;
//             mouse.y = -1000;
//         };

//         window.addEventListener("resize", handleResize);
//         // Listen to mouse events on the canvas specifically, or window if you prefer global tracking
//         canvas.addEventListener("mousemove", handleMouseMove);
//         canvas.addEventListener("mouseleave", handleMouseLeave);

//         return () => {
//             window.removeEventListener("resize", handleResize);
//             canvas.removeEventListener("mousemove", handleMouseMove);
//             canvas.removeEventListener("mouseleave", handleMouseLeave);
//         };
//     }, [color, limit, particleCount]);

//     return (
//         <canvas
//             ref={canvasRef}
//             className="absolute inset-0 w-full h-full pointer-events-auto z-0"
//             style={{ background: "transparent" }}
//         />
//     );
// }
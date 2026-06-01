"use client";

import { useState, useEffect } from "react";
import HackerText from "./HackerText";
// import SpiderCanvas from "./spider-canvas";
import {
  Github,
  Linkedin,
  Mail,
  MessageCircle,
  Terminal,
  Download,
  X
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { DevToIcon } from "@/components/icon/dev.to";

const socialLinks = [
  { href: "https://github.com/md8-habibullah", label: "GitHub", Icon: Github },
  {
    href: "https://www.linkedin.com/in/md-habibullahs",
    label: "LinkedIn",
    Icon: Linkedin,
  },
  // === Swapped Facebook for Dev.to ===
  {
    href: "https://dev.to/md8_habibullah",
    label: "Dev.to",
    Icon: DevToIcon,
  },
  {
    href: "https://habibullah.dev/whatsapp/",
    label: "WhatsApp",
    Icon: MessageCircle,
  },
  { href: "mailto:hello@habibullah.dev", label: "Email", Icon: Mail },
];

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };
    
    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  return (
    <section className="section-spacing min-h-[calc(100vh-80px)] flex items-center justify-center cursor-target overflow-hidden relative py-12 md:py-0">


      <div className="grid md:grid-cols-2 gap-8 lg:gap-20 items-center max-w-6xl w-full cursor-target relative z-10 px-4 md:px-0">

        {/* Left: Profile Image with SPIDER Effect */}
        <div
          className="relative flex justify-center md:justify-end animate-fade-in-up cursor-target order-first md:order-last p-10"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="relative cursor-target w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] group">

            {/* Rotating Tech Ring */}
            <div className="absolute inset-[-15px] md:inset-[-20px] rounded-full border border-primary/20 border-dashed md:animate-[spin_10s_linear_infinite] pointer-events-none" />
            <div className="absolute inset-[-8px] md:inset-[-10px] rounded-full border border-primary/10 md:animate-[spin_15s_linear_infinite_reverse] pointer-events-none" />

            {/* Background Glow */}
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl md:blur-3xl md:animate-pulse-slow group-hover:bg-primary/30 transition-all duration-500 cursor-target" />

            {/* Image Container with Mask */}
            <div 
              className="relative w-full h-full rounded-full overflow-hidden border-2 border-primary/50 shadow-[0_0_30px_rgba(0,255,200,0.2)] group-hover:scale-105 transition-transform duration-500 bg-background cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <Image
                src="/logo.png"
                alt="MD. HABIBULLAH SHARIF"
                className="object-cover"
                fill
                sizes="(max-width: 768px) 50vw, 30vw"
                priority
              />

            </div>

            {/* Tech Brackets */}
            <div className="absolute top-0 right-0 w-6 h-6 md:w-8 md:h-8 border-t-2 border-r-2 border-primary/60 rounded-tr-xl opacity-80" />
            <div className="absolute bottom-0 left-0 w-6 h-6 md:w-8 md:h-8 border-b-2 border-l-2 border-primary/60 rounded-bl-xl opacity-80" />

          </div>
        </div>

        {/* Right: Content */}
        <div
          className="space-y-6 md:space-y-8 animate-fade-in-up cursor-target order-last md:order-first text-center md:text-left"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="space-y-4 cursor-target">
            <div className="flex items-center justify-center md:justify-start gap-2 text-primary/80 font-mono text-sm tracking-widest uppercase">
              <Terminal className="w-4 h-4" />
              <span>Initialize_Portfolio.sh</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              MD. HABIBULLAH
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-blue-500 animate-gradient-x">
                SHARIF
              </span>
            </h1>

            <div className="flex justify-center md:justify-start">
              <HackerText
                text="Full-Stack Developer & DevOps Engineer || Security Enthusiast --"
                className="text-base sm:text-xl font-medium text-muted-foreground font-mono cursor-target block min-h-[50px] md:min-h-[60px]"
              />
            </div>
          </div>

          <p className="section-subtitle text-sm sm:text-lg cursor-target max-w-lg leading-relaxed text-muted-foreground/80 mx-auto md:mx-0">
            Building scalable, secure web applications with modern technologies.
            Full-stack development expertise combined with DevOps automation and
            security-first mindset.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2 md:pt-4 cursor-target">
            <a href="#projects" className="fire-button group">
              <span className="relative z-10">View Projects</span>
            </a>

            <div className="relative group w-full sm:w-auto">
              {/* Decorative Tech logic: outer brackets */}
              <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-primary/40 group-hover:border-primary transition-colors duration-500" />
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-primary/40 group-hover:border-primary transition-colors duration-500" />

              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="liquid-button relative px-8 py-4 flex items-center justify-center gap-3 group bg-transparent border border-primary/20 hover:border-primary transition-all duration-500 rounded-lg overflow-hidden"
              >
                {/* Magical Liquid Waves */}
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>

                <span className="relative z-10 text-xs font-black tracking-[0.3em] uppercase text-primary group-hover:text-primary-foreground transition-colors duration-500">
                  Download_CV
                </span>
                <div className="relative z-10 w-8 h-px bg-primary/30 group-hover:bg-primary-foreground/30 group-hover:w-12 transition-all duration-500" />
                <Download className="relative z-10 w-5 h-5 text-primary group-hover:text-primary-foreground transition-all duration-500 group-hover:animate-bounce" />
              </a>
            </div>
          </div>

          <div className="socialLinks bg-transparent cursor-target mt-2 md:mt-4">
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4 cursor-target">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group relative flex items-center gap-2 px-3 py-2 rounded-lg border border-border/20 bg-card/60
                             overflow-hidden transition-all duration-500 ease-out
                             hover:w-auto hover:border-primary hover:bg-primary hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  <div className="relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 cursor-target">
                    <Icon className="w-5 h-5 text-muted-foreground transition-colors duration-300 group-hover:text-black" />
                  </div>

                  <div className="flex items-center max-w-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:max-w-[200px] group-hover:ml-1 cursor-target">
                    <span className="text-sm font-medium text-foreground whitespace-nowrap opacity-0 transition-opacity duration-300 delay-75 group-hover:opacity-100 group-hover:text-black font-bold font-mono">
                      {label}
                    </span>
                  </div>

                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/0 transition-all duration-300 group-hover:border-black/50 cursor-target" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/0 transition-all duration-300 group-hover:border-black/50 cursor-target" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full Size Image Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <button 
            className="absolute top-4 right-4 md:top-8 md:right-8 p-3 bg-white/10 hover:bg-primary/40 rounded-full text-white transition-colors border border-white/20 z-[110]"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(false);
            }}
          >
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-[60vh] sm:h-[75vh] md:h-[90vh] max-w-6xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src="/logo.png"
              alt="MD. HABIBULLAH SHARIF Full Size"
              className="object-contain"
              fill
              sizes="100vw"
              priority
            />
          </motion.div>
        </div>
      )}
    </section>
  );
}

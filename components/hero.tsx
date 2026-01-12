"use client";

import HackerText from "./HackerText";
import {
  Github,
  Linkedin,
  Mail,
  Facebook,
  MessageCircle,
  Terminal,
} from "lucide-react";
import Image from "next/image";

const socialLinks = [
  { href: "https://github.com/md8-habibullah", label: "GitHub", Icon: Github },
  {
    href: "https://www.linkedin.com/in/md-habibullahs",
    label: "LinkedIn",
    Icon: Linkedin,
  },
  {
    href: "https://www.facebook.com/md8.habibullah",
    label: "Facebook",
    Icon: Facebook,
  },
  {
    href: "https://habibullah.dev/whatsapp/",
    label: "WhatsApp",
    Icon: MessageCircle,
  },
  { href: "mailto:hello@habibullah.dev", label: "Email", Icon: Mail },
];

export default function Hero() {
  return (
    <section className="section-spacing min-h-[calc(100vh-80px)] flex items-center justify-center cursor-target overflow-hidden">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl w-full cursor-target">
        {/* Left: Profile Image (Optimized & Tech-Styled) */}
        <div
          className="flex justify-center md:justify-end animate-fade-in-up cursor-target"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="relative cursor-target w-56 h-56 md:w-64 md:h-64 group">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-3xl animate-pulse-slow group-hover:bg-primary/30 transition-all duration-500 cursor-target" />

            <Image
              src="https://avatars.githubusercontent.com/u/149287500?v=4&s=400"
              alt="MD. HABIBULLAH SHARIF"
              className="profile-pic animate-float-up border border-primary/50 rounded-2xl shadow-lg relative z-10 group-hover:scale-105 transition-transform duration-500"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              style={{ objectFit: "cover" }}
            />

            {/* Tech Corners (Full Scanner Bracket Effect) */}

            {/* Top-Left */}
            {/*<div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-primary/50 opacity-50 group-hover:opacity-100 transition-all duration-300 group-hover:-top-5 group-hover:-left-5" />*/}

            {/* Top-Right (ADDED) */}
            <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-primary/50 opacity-50 group-hover:opacity-100 transition-all duration-300 group-hover:-top-5 group-hover:-right-5 cursor-target" />

            {/* Bottom-Left (ADDED) */}
            <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-primary/50 opacity-50 group-hover:opacity-100 transition-all duration-300 group-hover:-bottom-5 group-hover:-left-5 cursor-target" />

            {/* Bottom-Right */}
            {/*<div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-primary/50 opacity-50 group-hover:opacity-100 transition-all duration-300 group-hover:-bottom-5 group-hover:-right-5" />*/}
          </div>
        </div>

        {/* Right: Content */}
        <div
          className="space-y-8 animate-fade-in-up cursor-target"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="space-y-4 cursor-target">
            <div className="accent-line cursor-target" />
            <h1 className="section-title cursor-target">
              MD. HABIBULLAH
              <br />
              <span className="text-primary">SHARIF</span>
            </h1>

            <HackerText
              text="Full-Stack Developer & DevOps Engineer || Security Enthusiast --"
              className="text-xl sm:text-2xl font-semibold text-muted-foreground font-mono cursor-target"
            />
          </div>

          <p className="section-subtitle text-base sm:text-lg cursor-target">
            Building scalable, secure web applications with modern technologies.
            Full-stack development expertise combined with DevOps automation and
            security-first mindset. Computer Science student from Northern
            University Bangladesh.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 cursor-target">
            <a href="#projects" className="fire-button group">
              <span className="relative z-10">View My Work</span>
            </a>
            <a
              href="https://github.com/md8-habibullah"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold border border-primary/50 text-primary hover:bg-primary/10 hover:border-primary transition-all duration-300"
            >
              GitHub Profile
            </a>
          </div>

          {/* === THE NEW TECH DIVIDER & SMART SOCIALS === */}
          <div className="pt-8 cursor-target">
            {/* Tech Divider with Legend Tag */}
            <div className="relative flex items-center justify-center py-4 opacity-80 hover:opacity-100 transition-opacity duration-300 cursor-target">
              <div
                className="absolute inset-0 flex items-center cursor-target"
                aria-hidden="true"
              >
                <div className="w-full border-t border-border/60 cursor-target"></div>
              </div>

              <div className="relative flex justify-center cursor-target">
                <span className="bg-background px-4 text-xs font-mono text-muted-foreground uppercase tracking-widest border border-border/50 rounded-full flex items-center gap-2 group hover:border-primary/50 hover:text-primary transition-all duration-300 cursor-help select-none">
                  <Terminal className="w-3 h-3 text-primary animate-pulse" />
                  <span className="hidden sm:inline">System_Link</span>
                  <span className="sm:hidden">Link</span>
                  <span>::</span>
                  <span className="text-primary font-bold">CONTACT_ME</span>
                </span>
              </div>
            </div>

            {/* Smart "Chip" Social Buttons */}
            <div className="flex flex-wrap gap-3 mt-4 cursor-target">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group relative flex items-center gap-2 px-3 py-2 rounded-lg border border-border/40 bg-card/30
                             overflow-hidden transition-all duration-500 ease-out
                             hover:w-auto hover:border-primary/50 hover:bg-primary/5 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                >
                  {/* Icon Wrapper */}
                  <div className="relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 cursor-target">
                    <Icon className="w-5 h-5 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
                  </div>

                  {/* Smart Reveal Text */}
                  <div className="flex items-center max-w-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:max-w-[200px] group-hover:ml-1 cursor-target">
                    <span className="text-sm font-medium text-foreground whitespace-nowrap opacity-0 transition-opacity duration-300 delay-75 group-hover:opacity-100 font-mono">
                      {label}
                    </span>
                  </div>

                  {/* Tech Corners (Tiny details for the 'Harder' feel) */}
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/0 transition-all duration-300 group-hover:border-primary/50 cursor-target" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/0 transition-all duration-300 group-hover:border-primary/50 cursor-target" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

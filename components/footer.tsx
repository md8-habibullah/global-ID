"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  Terminal,
  Facebook,
  MessageCircle,
  GitBranch,
  Globe,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";

const socialLinks = [
  {
    href: "https://www.linkedin.com/in/md-habibullahs",
    label: "LinkedIn",
    Icon: Linkedin,
  },
  { href: "https://github.com/md8-habibullah", label: "GitHub", Icon: Github },
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

export default function Footer() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Dhaka",
        }),
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <footer className="relative border-t border-border/50 bg-background overflow-hidden cursor-target">
      {/* Cyber Grid Background */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] cursor-target"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--foreground) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 py-16 sm:py-20 px-4 sm:px-8 lg:px-12 cursor-target"
      >
        <div className="max-w-6xl mx-auto cursor-target">
          <div className="grid md:grid-cols-3 gap-12 mb-16 cursor-target">
            {/* 1. Brand / Identity */}
            <motion.div variants={itemVariants} className="space-y-6 cursor-target">
              <div className="flex items-center gap-3 group cursor-target">
                <div className="p-2 bg-primary/10 rounded-lg border border-primary/20 group-hover:bg-primary/20 transition-colors duration-300 cursor-target">
                  <Terminal className="w-6 h-6 text-primary" />
                </div>
                <div className="cursor-target">
                  <h3 className="text-lg font-bold tracking-tighter font-mono">
                    MD.Habibullah
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono cursor-target">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span>System Online</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs font-mono">
                &gt; Initializing full-stack protocols...
                <br />
                &gt; Loading devops modules...
                <br />
                &gt; Ready to deploy.
              </p>
            </motion.div>

            {/* 2. Directory Links */}
            <motion.div variants={itemVariants} className="space-y-6 cursor-target">
              <h4 className="font-mono text-xs font-bold text-primary tracking-widest uppercase">
                [ DIR : LINKS ]
              </h4>
              <ul className="space-y-3 font-mono text-sm cursor-target">
                {["About", "Skills", "Projects"].map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase()}`}
                      className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <span className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-primary">
                        &gt;
                      </span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        ~/ {link.toLowerCase()}
                      </span>
                    </a>
                  </li>
                ))}
                <li>
                  <Link
                    href="/blog"
                    className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-primary">
                      &gt;
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      ~/ blog.sh
                    </span>
                  </Link>
                </li>
              </ul>
            </motion.div>

            {/* 3. Connect (UPDATED: Grid Layout + Always Visible) */}
            <motion.div variants={itemVariants} className="space-y-6 cursor-target">
              <h4 className="font-mono text-xs font-bold text-primary tracking-widest uppercase">
                [ NET : CONNECT ]
              </h4>

              {/* Grid Logic: Use 2 columns if > 3 items */}
              <div
                className={`grid gap-3 cursor-target ${socialLinks.length > 3 ? "grid-cols-2" : "grid-cols-1"}`}
              >
                {socialLinks.map(({ href, label, Icon }, index) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    // ADD THIS LOGIC: If it's the last item and the total is odd, span 2 columns
                    className={`group flex items-center gap-3 px-3 py-2 rounded-lg border border-border/40 bg-card/50
                               transition-all duration-300 ease-out
                               hover:border-primary/50 hover:bg-primary/5 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]
                               ${index === socialLinks.length - 1 && socialLinks.length % 2 !== 0 ? "col-span-2 justify-center" : ""}
                    `}
                  >
                    <Icon className="w-4 h-4 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
                    <span className="text-xs font-medium text-muted-foreground transition-colors duration-300 group-hover:text-primary font-mono">
                      {label}
                    </span>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Tech Divider */}
          <div className="relative h-px w-full bg-border/40 mb-8 overflow-hidden cursor-target">
            <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-[shimmer_2s_infinite] cursor-target" />
          </div>

          {/* Bottom Status Bar */}
          <motion.div
            variants={containerVariants}
            className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground/60 cursor-target"
          >
            {/* Left: Copyright */}
            <div className="flex items-center gap-4 cursor-target">
              <p>© {new Date().getFullYear()} HABIBULLAH.DEV</p>
            </div>

            {/* Right: System Stats */}
            <div className="flex items-center gap-6 border border-border/20 px-4 py-1 rounded-full bg-background/50 md:backdrop-blur-sm cursor-target">
              <div className="flex items-center gap-2 cursor-target">
                <GitBranch className="w-3 h-3" />
                <span>main</span>
              </div>
              <div className="w-px h-3 bg-border/40" />
              <div className="flex items-center gap-2 cursor-target">
                <Globe className="w-3 h-3" />
                <span>Dhaka, BD</span>
              </div>
              <div className="w-px h-3 bg-border/40" />
              <div className="flex items-center gap-4 text-xs cursor-target">
                <Clock className="w-3 h-3" />
                <span>{time} UTC+6</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </footer>
  );
}

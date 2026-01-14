"use client";

import { motion } from "framer-motion";
import { Terminal, Cpu, Code2, Globe, ShieldCheck, Activity } from "lucide-react";

const stats = [
  { value: "50+", label: "CONTRIB_COUNT", icon: <Code2 className="w-4 h-4" /> },
  { value: "03+", label: "YEARS_UPTIME", icon: <Globe className="w-4 h-4" /> },
  {
    value: "100%",
    label: "SYS_SECURITY",
    icon: <ShieldCheck className="w-4 h-4" />,
  },
];

const whatIDo = [
  {
    title: "Web_Development",
    desc: "Deploying responsive, production-grade interfaces using Next.js/React standard protocols.",
  },
  {
    title: "Backend_Architecture",
    desc: "Engineering robust REST/GraphQL pipelines with Node.js & PostgreSQL databases.",
  },
  {
    title: "DevOps_Automation",
    desc: "Configuring CI/CD flows, Docker containerization, and automated deployment scripts.",
  },
  {
    title: "Security_Protocol",
    desc: "Executing vulnerability assessments and implementing strict secure coding standards.",
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="section-spacing relative overflow-hidden cursor-target"
    >
      {/* Background Decor: Cyber Grid */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none cursor-target"
        style={{
          backgroundImage:
            "linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10 cursor-target">
        {/* Terminal Header */}
        <div className="flex items-center gap-3 mb-12 animate-fade-in-up cursor-target">
          <Terminal className="w-6 h-6 text-primary animate-pulse" />
          <h2 className="text-xl md:text-2xl font-mono font-bold tracking-tight">
            <span className="text-primary">root@habibullah</span>
            <span className="text-muted-foreground">:</span>
            <span className="text-blue-500">~/about</span>
            <span className="text-muted-foreground">$</span>
            <span className="ml-2 animate-blink-cursor inline-block w-3 h-5 bg-primary align-middle" />
          </h2>
        </div>

        <div className="grid md:grid-cols-12 gap-12 cursor-target">
          {/* LEFT: System Logs (Bio) */}
          <div
            className="md:col-span-7 space-y-10 animate-fade-in-up cursor-target"
            style={{ animationDelay: "0.1s" }}
          >
            {/* Bio Box with Alive Data Line */}
            <div className="relative pl-8 cursor-target">

              {/* ANIMATED LINE LEFT */}
              <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-primary/10 overflow-hidden">
                <motion.div
                  animate={{ top: ["-50%", "150%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-transparent via-primary to-transparent shadow-[0_0_10px_#00ffc8]"
                />
              </div>

              {/* Decorative Square top-left */}
              <div className="absolute top-0 left-[-4px] w-2 h-2 border border-primary bg-background z-10" />

              <p className="text-lg text-muted-foreground leading-relaxed font-mono relative z-10">
                &gt; Initializing user profile... <br />
                <br />I am{" "}
                <strong className="text-foreground">Habibullah</strong>, a
                Full-Stack Engineer and CS Graduate engineered to build{" "}
                <strong className="text-primary">
                  secure, scalable systems
                </strong>
                . My core kernel logic revolves around clean architecture,
                automation, and eliminating manual inefficiencies.
              </p>
            </div>

            {/* "What I Do" Log */}
            <div className="space-y-4 cursor-target">
              <div className="flex items-center gap-2 text-sm font-mono text-primary/80 uppercase tracking-widest border-b border-border/40 pb-2 cursor-target">
                <Activity className="w-4 h-4 animate-pulse" />
                [ ACTIVE_PROCESSES ]
              </div>

              <ul className="space-y-4 cursor-target">
                {whatIDo.map(({ title, desc }) => (
                  <li
                    key={title}
                    className="group relative bg-card/40 p-4 rounded-lg border border-border/40 hover:border-primary/50 transition-all duration-300 cursor-target overflow-hidden"
                  >
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-baseline gap-2 cursor-target">
                      <span className="font-mono text-primary text-sm whitespace-nowrap flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="font-bold">{title}</span>
                      </span>
                      <span className="hidden sm:inline text-muted-foreground/30">
                        --
                      </span>
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        {desc}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quote Block */}
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-md font-mono text-sm text-primary/80 flex gap-3 items-start cursor-target">
              <span className="text-xl leading-none">"</span>
              <span>
                Code with purpose, learn with curiosity, build with ethics.
              </span>
            </div>
          </div>

          {/* RIGHT: System Status (Stats) */}
          <div className="md:col-span-5 relative cursor-target">
            <div
              className="sticky top-24 space-y-6 animate-fade-in-up cursor-target"
              style={{ animationDelay: "0.2s" }}
            >
              {/* Stats Panel with SCANNER Effect */}
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 relative overflow-hidden group cursor-target">

                {/* SCANNER ANIMATION */}
                <motion.div
                  animate={{ top: ["-10%", "110%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_20px_rgba(0,255,200,0.5)] z-0 pointer-events-none"
                />

                <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2 relative z-10">
                  <Cpu className="w-4 h-4" /> System_Diagnostics
                </h3>

                <div className="space-y-6 relative z-10 cursor-target">
                  {stats.map((stat, i) => (
                    <div key={stat.label} className="relative cursor-target">
                      <div className="flex justify-between items-end mb-2 font-mono text-sm cursor-target">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          {stat.icon} {stat.label}
                        </span>
                        <span className="text-primary font-bold text-lg">
                          {stat.value}
                        </span>
                      </div>
                      {/* Progress Bar Visual */}
                      <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden cursor-target">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: i === 2 ? "100%" : "75%" }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] relative cursor-target"
                        >
                          <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 animate-pulse cursor-target" />
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Decorative Tech Elements */}
                <div className="mt-8 pt-4 border-t border-dashed border-border/40 grid grid-cols-2 gap-4 text-[10px] font-mono text-muted-foreground/60 uppercase cursor-target relative z-10">
                  <div className="cursor-target">
                    <span className="block text-primary/40">KERNEL</span>
                    Linux 7.x.5-custom-y
                  </div>
                  <div className="text-right cursor-target">
                    <span className="block text-primary/40">UPTIME</span>
                    99.98%
                  </div>
                </div>
              </div>

              {/* Additional Info / Badge */}
              <div className="flex items-center gap-4 p-4 border border-primary/20 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors cursor-help cursor-target">
                <div className="w-10 h-10 rounded-md bg-primary/20 flex items-center justify-center text-primary cursor-target relative overflow-hidden">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-primary/20"
                  />
                  <ShieldCheck className="w-5 h-5 relative z-10" />
                </div>
                <div className="cursor-target">
                  <div className="text-sm font-bold text-foreground">
                    Open to Collaboration
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    status: AVAILABLE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
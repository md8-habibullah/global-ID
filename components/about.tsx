"use client";

import { Terminal, Cpu, Code2, Globe, ShieldCheck } from "lucide-react";
import HackerText from "./HackerText";

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
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Terminal Header */}
        <div className="flex items-center gap-3 mb-12 animate-fade-in-up">
          <Terminal className="w-6 h-6 text-primary animate-pulse" />
          <h2 className="text-xl md:text-2xl font-mono font-bold tracking-tight">
            <span className="text-primary">root@habibullah</span>
            <span className="text-muted-foreground">:</span>
            <span className="text-blue-500">~/about</span>
            <span className="text-muted-foreground">$</span>
            <span className="ml-2 animate-blink-cursor inline-block w-3 h-5 bg-primary align-middle" />
          </h2>
        </div>

        {/* Added 'items-start' to fix sticky behavior */}
        <div className="grid md:grid-cols-12 gap-12 items-start">
          {/* LEFT: System Logs (Bio) */}
          <div
            className="md:col-span-7 space-y-8 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            {/* Bio Box */}
            <div className="border-l-2 border-primary/30 pl-6 relative">
              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-background border-2 border-primary rounded-full" />
              <p className="text-lg text-muted-foreground leading-relaxed font-mono">
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
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-mono text-primary/80 uppercase tracking-widest border-b border-border/40 pb-2">
                [ ACTIVE_PROCESSES ]
              </div>

              <ul className="space-y-4">
                {whatIDo.map(({ title, desc }) => (
                  <li
                    key={title}
                    className="group relative bg-card/40 p-4 rounded-lg border border-border/40 hover:border-primary/50 transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                      {/* REMOVED ID NUMBERS HERE */}
                      <span className="font-mono text-primary text-sm whitespace-nowrap">
                        <span className="mr-2">::</span>
                        <span className="font-bold">{title}</span>
                      </span>
                      <span className="hidden sm:inline text-muted-foreground/30">
                        --
                      </span>
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        {desc}
                      </span>
                    </div>
                    {/* Hover Corner Effect */}
                    <div className="absolute top-0 right-0 w-0 h-0 border-t-[10px] border-r-[10px] border-t-transparent border-r-primary/0 group-hover:border-r-primary transition-all duration-300" />
                  </li>
                ))}
              </ul>
            </div>

            {/* Quote Block */}
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-md font-mono text-sm text-primary/80 flex gap-3 items-start">
              <span className="text-xl leading-none">"</span>
              <span>
                Code with purpose, learn with curiosity, build with ethics.
              </span>
            </div>
          </div>

          {/* RIGHT: System Status (Stats) */}
          {/* Added 'sticky top-24' so it stays visible and fills the visual gap */}
          <div
            className="md:col-span-5 space-y-6 sticky top-24 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            {/* Stats Panel */}
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

              <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                <Cpu className="w-4 h-4" /> System_Diagnostics
              </h3>

              <div className="space-y-6">
                {stats.map((stat, i) => (
                  <div key={stat.label} className="relative">
                    <div className="flex justify-between items-end mb-2 font-mono text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        {stat.icon} {stat.label}
                      </span>
                      <span className="text-primary font-bold text-lg">
                        {stat.value}
                      </span>
                    </div>
                    {/* Progress Bar Visual */}
                    <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] relative"
                        style={{ width: i === 2 ? "100%" : "75%" }} // Just for visual effect
                      >
                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Decorative Tech Elements */}
              <div className="mt-8 pt-4 border-t border-dashed border-border/40 grid grid-cols-2 gap-4 text-[10px] font-mono text-muted-foreground/60 uppercase">
                <div>
                  <span className="block text-primary/40">KERNEL</span>
                  Linux 6.8.1-arch1-1
                </div>
                <div className="text-right">
                  <span className="block text-primary/40">UPTIME</span>
                  99.98%
                </div>
              </div>
            </div>

            {/* Additional Info / Badge */}
            <div className="flex items-center gap-4 p-4 border border-primary/20 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors cursor-help">
              <div className="w-10 h-10 rounded-md bg-primary/20 flex items-center justify-center text-primary">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
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
    </section>
  );
}

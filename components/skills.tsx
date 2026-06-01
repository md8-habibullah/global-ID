"use client";

import { motion } from "framer-motion";
import {
  Terminal,
  Cpu,
  Database,
  Layout,
  Server,
  Globe,
  Users,
  ShieldCheck
} from "lucide-react";

export default function Skills() {
  const categories = [
    {
      name: "Frontend_Stack",
      icon: <Layout className="w-4 h-4" />,
      skills: [
        { name: "React.js / Next.js", progress: 98 },
        { name: "TypeScript", progress: 90 },
        { name: "Tailwind CSS", progress: 95 },
        { name: "Framer Motion", progress: 85 },
      ],
    },
    {
      name: "Backend_Core",
      icon: <Server className="w-4 h-4" />,
      skills: [
        { name: "Node.js & Express", progress: 98 },
        { name: "Python", progress: 90 },
        { name: "Redis (Caching)", progress: 92 },
        { name: "REST & GraphQL", progress: 95 },
      ],
    },
    {
      name: "Database_&_ORM",
      icon: <Database className="w-4 h-4" />,
      skills: [
        { name: "PostgreSQL", progress: 98 },
        { name: "MongoDB", progress: 96 },
        { name: "Prisma ORM", progress: 97 },
        { name: "Supabase / Firebase", progress: 88 },
      ],
    },
    {
      name: "DevOps_&_Cloud",
      icon: <Cpu className="w-4 h-4" />,
      skills: [
        { name: "Docker & Compose", progress: 95 },
        { name: "Cloud (AWS/Azure/Linode)", progress: 90 },
        { name: "CI/CD Pipelines", progress: 92 },
        { name: "Linux (Manjaro/Server)", progress: 99 },
      ],
    },
    {
      name: "Infrastructure_&_Net",
      icon: <Globe className="w-4 h-4" />,
      skills: [
        { name: "Coolify (Self-Host)", progress: 95 },
        { name: "Nginx / Caddy", progress: 94 },
        { name: "System Hardening", progress: 90 },
        { name: "Reverse Proxies", progress: 96 },
      ],
    },
    {
      name: "R&D_&_Workflow",
      icon: <Users className="w-4 h-4" />,
      skills: [
        { name: "Open Source Scouting (300+)", progress: 100 },
        { name: "Mentorship & Team Lead", progress: 95 },
        { name: "Rapid Prototyping", progress: 92 },
        { name: "Tech Exploration", progress: 100 },
      ],
    },
  ];

  return (
    <section
      id="skills"
      className="section-spacing relative overflow-hidden cursor-target"
    >

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        {/* Terminal Header */}
        <div className="flex items-center gap-3 animate-fade-in-up cursor-target">
          <Terminal className="w-6 h-6 text-primary animate-pulse" />
          <h2 className="text-xl md:text-2xl font-mono font-bold tracking-tight">
            <span className="text-primary">root@habibullah</span>
            <span className="text-muted-foreground">:</span>
            <span className="text-blue-500">~/skills</span>
            <span className="text-muted-foreground">$</span>
            <span className="ml-3 text-sm text-muted-foreground/60 font-normal hidden sm:inline-block">
              ./list_packages.sh --count=300+
            </span>
            <span className="ml-2 animate-blink-cursor inline-block w-2 h-4 bg-primary align-middle" />
          </h2>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 cursor-target">
          {categories.map((category, idx) => (
            <div
              key={category.name}
              className="animate-fade-in-up group cursor-target"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="bg-card/20 backdrop-blur-md border border-border/30 rounded-xl overflow-hidden hover:border-primary/40 hover:bg-card/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-all duration-500 cursor-target h-full">

                {/* Category Header */}
                <div className="bg-primary/5 border-b border-border/30 px-6 py-3 flex items-center justify-between cursor-target">
                  <div className="flex items-center gap-2 font-mono text-primary font-bold tracking-wide cursor-target">
                    {category.icon}
                    {category.name.replace(/_/g, " ")}
                  </div>
                </div>

                {/* Skills List */}
                <div className="p-6 space-y-5 cursor-target">
                  {category.skills.map((skill, sIdx) => (
                    <div key={skill.name} className="space-y-1.5 cursor-target">
                      <div className="flex justify-between text-sm font-mono cursor-target">
                        <span className="text-foreground/80 group-hover:text-foreground transition-colors duration-300">{skill.name}</span>
                        <span className="text-muted-foreground/60 text-xs font-bold">
                          {skill.progress}%
                        </span>
                      </div>

                      {/* Progress Bar Container */}
                      <div className="h-1.5 w-full bg-background/50 rounded-full overflow-hidden border border-border/20 cursor-target">
                        {/* Animated Bar */}
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.progress}%` }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 1.2,
                            ease: "easeOut",
                            delay: idx * 0.1 + sIdx * 0.1
                          }}
                          className="h-full bg-primary/80 group-hover:bg-primary relative cursor-target"
                        >
                          {/* Shimmer Effect overlay */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] cursor-target" />
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
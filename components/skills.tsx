"use client";

import { Terminal, Cpu, Database, Layout, Server, Shield } from "lucide-react";

export default function Skills() {
  const categories = [
    {
      name: "Frontend_Stack",
      icon: <Layout className="w-4 h-4" />,
      skills: [
        { name: "React.js", progress: 95 },
        { name: "Next.js", progress: 90 },
        { name: "TypeScript", progress: 85 },
        { name: "Tailwind", progress: 95 },
      ],
    },
    {
      name: "Backend_Core",
      icon: <Server className="w-4 h-4" />,
      skills: [
        { name: "Node.js", progress: 90 },
        { name: "Express", progress: 85 },
        { name: "Python", progress: 80 },
        { name: "REST APIs", progress: 95 },
      ],
    },
    {
      name: "Database_&_ORM",
      icon: <Database className="w-4 h-4" />,
      skills: [
        { name: "PostgreSQL", progress: 85 },
        { name: "Prisma", progress: 90 },
        { name: "MongoDB", progress: 80 },
      ],
    },
    {
      name: "DevOps_&_Cloud",
      icon: <Cpu className="w-4 h-4" />,
      skills: [
        { name: "Docker", progress: 85 },
        { name: "Linux", progress: 80 },
        { name: "AWS (EC2)", progress: 75 },
        { name: "CI/CD", progress: 85 },
      ],
    },
  ];

  return (
    <section
      id="skills"
      className="section-spacing relative overflow-hidden cursor-target"
    >
      {/* Matrix Background */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#10b981 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        {/* Terminal Header */}
        <div className="flex items-center gap-3 animate-fade-in-up">
          <Terminal className="w-6 h-6 text-primary animate-pulse" />
          <h2 className="text-xl md:text-2xl font-mono font-bold tracking-tight">
            <span className="text-primary">root@habibullah</span>
            <span className="text-muted-foreground">:</span>
            <span className="text-blue-500">~/skills</span>
            <span className="text-muted-foreground">$</span>
            <span className="ml-3 text-sm text-muted-foreground/60 font-normal hidden sm:inline-block">
              ./list_packages.sh --all
            </span>
            <span className="ml-2 animate-blink-cursor inline-block w-2 h-4 bg-primary align-middle" />
          </h2>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {categories.map((category, idx) => (
            <div
              key={category.name}
              className="animate-fade-in-up group"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="bg-card/30 border border-border/40 rounded-xl overflow-hidden hover:border-primary/50 transition-colors duration-300">
                {/* Category Header */}
                <div className="bg-muted/10 border-b border-border/40 px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-primary font-bold tracking-wide">
                    {category.icon}
                    {category.name}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-mono">
                    [ MODULE_LOADED ]
                  </div>
                </div>

                {/* Skills List */}
                <div className="p-6 space-y-5">
                  {category.skills.map((skill) => (
                    <div key={skill.name} className="space-y-1.5">
                      <div className="flex justify-between text-sm font-mono">
                        <span className="text-foreground/90">{skill.name}</span>
                        {/* REPLACED VERSION WITH PERCENTAGE */}
                        <span className="text-muted-foreground text-xs font-bold opacity-70">
                          {skill.progress}%
                        </span>
                      </div>

                      {/* Progress Bar Container */}
                      <div className="h-1.5 w-full bg-background/50 rounded-full overflow-hidden border border-border/20">
                        <div
                          className="h-full bg-primary/80 group-hover:bg-primary transition-all duration-500 relative"
                          style={{ width: `${skill.progress}%` }}
                        >
                          {/* Shimmer Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                        </div>
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

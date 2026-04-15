"use client";

import { motion } from "framer-motion";
import ProjectCard from "./project-card";
import { Terminal, Github } from "lucide-react";

export default function Projects() {
  const projects = [
    {
      title: "Neurootix_Rebuild",
      description:
        "Full-stack commercial website for an IT firm. Integrated Hashnode Headless API for blogging, advanced routing, and SEO optimization. 100% production ready.",
      tags: ["Next.js", "GraphQL", "API", "Production"],
      github: "https://github.com/md8-habibullah/neurootix-rebuild.git",
      demo: "https://www.neurootix.com/",
      featured: true,
    },
    {
      title: "Shadow_Logger",
      description:
        "Stealth key capture tool for forensic analysis. Lightweight C implementation focusing on low-level system hooks, silent operation, and input tracking.",
      tags: ["C", "Security", "Forensics", "Low-Level"],
      github: "https://github.com/md8-habibullah/Shadow-Logger.git",
      featured: true,
    },
    {
      title: "Vehicle_Rental_API",
      description:
        "Robust backend API with complex business logic. Features RBAC (Admin/Customer), automated pricing algorithms, and PostgreSQL inventory management.",
      tags: ["Node.js", "PostgreSQL", "Express", "Backend"],
      github: "https://github.com/md8-habibullah/vehicle_rental.git",
      demo: "https://vehicle-rental-ebon.vercel.app/",
    },
    {
      title: "Ledger_Tracker_Local",
      description:
        "Privacy-focused financial management system. Offline-first architecture using IndexedDB for secure, local-only data storage without server dependencies.",
      tags: ["React", "IndexedDB", "Privacy", "OpenSource"],
      github: "https://github.com/md8-habibullah/ledger-tracker.git",
      demo: "https://ledger.habibullah.dev/",
    },
    {
      title: "Linux_Power_Auto",
      description:
        "DevOps automation script for GNOME. Dynamically switches power profiles based on charging state (Boot/Wake/Plug) to optimize battery vs performance.",
      tags: ["Bash", "Linux", "Automation", "DevOps"],
      github: "https://github.com/md8-habibullah/power-mode-switcher.git",
    },
    {
      title: "E-Commerce_CLI_C",
      description:
        "Terminal-based inventory management system. Built in C with SQLite3 integration. Demonstrates memory management, pointers, and command-line logic.",
      tags: ["C", "SQLite3", "CLI", "System"],
      github: "https://github.com/md8-habibullah/E-commerce-Book.git",
    },
  ];

  return (
    <section id="projects" className="section-spacing relative overflow-hidden cursor-target">

      {/* Left Animated Line */}
      <div className="absolute top-0 bottom-0 left-4 md:left-10 w-[1px] bg-primary/10 hidden md:block">
        <motion.div
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-[2px] h-32 bg-gradient-to-b from-transparent via-primary/50 to-transparent shadow-[0_0_15px_#00ffc8]"
        />
      </div>

      <div className="max-w-6xl mx-auto space-y-16 cursor-target relative z-10">

        {/* Terminal Header */}
        <div className="flex items-center gap-3 animate-fade-in-up cursor-target">
          <Terminal className="w-6 h-6 text-primary animate-pulse" />
          <h2 className="text-xl md:text-2xl font-mono font-bold tracking-tight">
            <span className="text-primary">root@habibullah</span>
            <span className="text-muted-foreground">:</span>
            <span className="text-blue-500">~/projects</span>
            <span className="text-muted-foreground">$</span>
            <span className="ml-3 text-sm text-muted-foreground/60 font-normal hidden sm:inline-block">
              ls -la ./production_builds
            </span>
            <span className="ml-2 animate-blink-cursor inline-block w-2 h-4 bg-primary align-middle" />
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 cursor-target">
          {projects.map((project, index) => (
            <div
              key={project.title}
              style={{ animationDelay: `${index * 0.1}s` }}
              className="animate-fade-in-up cursor-target"
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        <div className="text-center pt-12 cursor-target">
          <div className="relative group inline-block">
            {/* Decorative Tech logic: outer brackets */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-primary/40 group-hover:border-primary transition-colors duration-500" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-primary/40 group-hover:border-primary transition-colors duration-500" />

            <a
              href="https://github.com/md8-habibullah"
              target="_blank"
              rel="noopener noreferrer"
              className="fire-button relative px-8 py-4 flex items-center justify-center gap-3 group !bg-transparent hover:!bg-primary/5 border border-primary/20 hover:border-primary transition-all duration-500 rounded-lg overflow-hidden"
            >
              <span className="text-xs font-black tracking-[0.3em] uppercase text-primary transition-colors duration-500">
                &gt; git checkout all_repositories
              </span>
              <div className="w-8 h-px bg-primary/30 group-hover:w-12 transition-all duration-500" />
              <Github className="w-5 h-5 text-primary transition-all duration-500 group-hover:scale-110" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
"use client";

import ProjectCard from "./project-card";
import { Terminal } from "lucide-react";

export default function Projects() {
  const projects = [
    {
      title: "E-Commerce_Platform",
      description:
        "Production-ready e-commerce architecture. Implements secure payment gateways (Stripe), real-time inventory locking, and order processing queues.",
      tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
      github: "https://github.com/md8-habibullah",
      featured: true,
    },
    {
      title: "DevOps_Pipeline_Auto",
      description:
        "Enterprise CI/CD orchestration. Docker containerization, automated regression testing, and multi-environment deployment strategies using GitHub Actions.",
      tags: ["Docker", "GitHub_Actions", "CI/CD", "Linux"],
      github: "https://github.com/md8-habibullah",
      featured: true,
    },
    {
      title: "Real-Time_Analytics",
      description:
        "High-frequency data visualization dashboard. Utilizes WebSocket protocols for sub-second latency updates and interactive chart rendering.",
      tags: ["React", "WebSocket", "Socket.IO", "D3.js"],
      github: "https://github.com/md8-habibullah",
    },
    {
      title: "K8s_Cluster_Ops",
      description:
        "Kubernetes infrastructure management suite. Features auto-scaling policies, pod health monitoring, and resource optimization scripts.",
      tags: ["Kubernetes", "Docker", "Cloud", "Infra"],
      github: "https://github.com/md8-habibullah",
    },
    {
      title: "IaC_Terraform_AWS",
      description:
        "Infrastructure as Code automation. Multi-region AWS provisioning with drift detection, disaster recovery protocols, and secure VPC subnets.",
      tags: ["Terraform", "AWS", "IaC", "Security"],
      github: "https://github.com/md8-habibullah",
    },
    {
      title: "Secure_App_Core",
      description:
        "Security-first application boilerplate. End-to-end encryption, JWT rotation, RBAC implementation, and SQL injection prevention layers.",
      tags: ["Node.js", "PostgreSQL", "OWASP", "Security"],
      github: "https://github.com/md8-habibullah",
    },
  ];

  return (
    <section id="projects" className="section-spacing bg-card/10 cursor-target">
      <div className="max-w-6xl mx-auto space-y-16 cursor-target">
        {/* Terminal Header */}
        <div className="flex items-center gap-3 animate-fade-in-up">
          <Terminal className="w-6 h-6 text-primary animate-pulse" />
          <h2 className="text-xl md:text-2xl font-mono font-bold tracking-tight">
            <span className="text-primary">root@habibullah</span>
            <span className="text-muted-foreground">:</span>
            <span className="text-blue-500">~/projects</span>
            <span className="text-muted-foreground">$</span>
            <span className="ml-3 text-sm text-muted-foreground/60 font-normal hidden sm:inline-block">
              ./deploy_showcase.sh
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

        <div className="text-center pt-12">
          <a
            href="https://github.com/md8-habibullah"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-primary/30 bg-primary/5 text-primary font-mono text-sm hover:bg-primary/10 hover:border-primary transition-all duration-300"
          >
            <span className="group-hover:translate-x-1 transition-transform">
              &gt; git checkout github_profile
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Server, ShieldAlert, Cpu, Bot, Zap } from "lucide-react";

export default function Roadmap() {
    const roadmapItems = [
        {
            year: "Q2 2026",
            title: "AWS_Infrastructure_Mastery",
            description: "Moving from console to code. Implementing multi-region VPC peering, Transit Gateways, and immutable infrastructure patterns.",
            tech: ["Terraform", "CloudFormation", "VPC", "Lambda"],
            icon: Server,
        },
        {
            year: "Q3 2026",
            title: "Kubernetes_Orchestration",
            description: "Deep dive into cluster management. Building self-healing pods, setting up Ingress Controllers, and Service Mesh architecture.",
            tech: ["Docker", "K8s", "Helm", "Istio"],
            icon: Cpu,
        },
        {
            year: "Q4 2026",
            title: "Offensive_Security_OSCP",
            description: "Ethical Hacking certification prep. Advanced buffer overflows, privilege escalation, and active directory exploitation.",
            tech: ["Black Arch", "Metasploit", "Recon", "Pentesting"],
            icon: ShieldAlert,
        },
        {
            year: "2027",
            title: "AI_DevOps_Integration",
            description: "Building automated pipelines that self-correct using LLM logic. AI-driven log analysis and anomaly detection.",
            tech: ["LLM Ops", "Python", "VectorDB", "Data Visualization"],
            icon: Bot,
        },
        {
            year: "2027+",
            title: "Future_Tech_Exploration",
            description: "Exploring emerging technologies like quantum computing, blockchain scalability solutions, and next-gen AI frameworks.",
            tech: ["Quantum", "Blockchain", "AI Frameworks", "Edge Computing"],
            icon: Zap,
        }
    ];

    return (
        <section id="roadmap" className="section-spacing relative overflow-hidden py-12 cursor-target">

            <div className="max-w-6xl mx-auto px-4 relative z-10 cursor-target">
                {/* Header */}
                <div className="text-center mb-12 space-y-2 cursor-target">
                    <div className="inline-flex items-center gap-2 text-primary font-mono text-sm tracking-wider uppercase opacity-80">
                        <Zap className="w-4 h-4" />
                        <span>Kernel_Update_Schedule</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        System <span className="text-primary">Evolution_Path</span>
                    </h2>
                </div>

                <div className="relative cursor-target">
                    {/* CENTRAL WIRE (The Spine) */}
                    {/* Mobile: Left aligned / Desktop: Centered */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2 cursor-target">
                        {/* Moving signal light */}
                        <motion.div
                            animate={{ top: ["0%", "100%"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-24 bg-gradient-to-b from-transparent via-primary to-transparent shadow-[0_0_15px_#00ffc8]"
                        />
                    </div>

                    {/* Reduced gap from space-y-24 to space-y-12 */}
                    <div className="space-y-8 md:space-y-12 cursor-target">
                        {roadmapItems.map((item, index) => {
                            const isEven = index % 2 === 0;

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    className={`relative flex items-center cursor-target md:justify-between ${isEven ? "md:flex-row-reverse" : ""
                                        }`}
                                >
                                    {/* EMPTY SPACE for alignment on desktop */}
                                    {/* Widen the content area slightly */}
                                    <div className="hidden md:block w-[45%]" />

                                    {/* CONNECTION NODE (The Dot on the Wire) */}
                                    <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-6 h-6 rounded-full border border-primary/50 bg-background z-20 shadow-[0_0_10px_rgba(0,255,200,0.3)]">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    </div>

                                    {/* HORIZONTAL TRACE (Wire to Card) */}
                                    <div className={`absolute h-px bg-primary/30 top-1/2 hidden md:block w-[5%] ${isEven ? "right-1/2 translate-x-3" : "left-1/2 -translate-x-3"}`} />

                                    {/* CONTENT CARD */}
                                    <div className="w-full md:w-[45%] pl-20 md:pl-0">
                                        <div className="group relative bg-card/40 md:backdrop-blur-sm border border-border/50 hover:border-primary/40 p-5 rounded-xl transition-all duration-300 cursor-target">

                                            {/* Hover Gradient Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />

                                            <div className="relative z-10">
                                                {/* Date & Icon Header */}
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="font-mono text-xs text-primary/80 border border-primary/20 px-2 py-0.5 rounded bg-primary/5">
                                                        {item.year}
                                                    </span>
                                                    <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                                </div>

                                                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                                                    {item.title}
                                                </h3>

                                                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                                                    {item.description}
                                                </p>

                                                {/* Tech Tags */}
                                                <div className="flex flex-wrap gap-2">
                                                    {item.tech.map((t) => (
                                                        <span key={t} className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70 bg-secondary/30 px-2 py-1 rounded">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
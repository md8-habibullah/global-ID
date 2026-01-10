"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Laptop,
  Coins,
  CalendarClock,
  LayoutGrid,
  ShieldCheck,
  Network,
} from "lucide-react";
import "./style.css"; // Import the shared styles here

const tools = [
  {
    name: "System Intelligence",
    path: "/info/system",
    icon: <Laptop className="w-4 h-4" />,
  },
  {
    name: "Currency Converter",
    path: "/info/currency",
    icon: <Coins className="w-4 h-4" />,
  },
  {
    name: "Age Calculator",
    path: "/info/age",
    icon: <CalendarClock className="w-4 h-4" />,
  },
  {
    name: "GenPass", // New Tool
    path: "/info/password",
    icon: <ShieldCheck className="w-4 h-4" />,
  },
  {
    name: "IP Subnet",
    path: "/info/subnet",
    icon: <Network className="w-4 h-4" />,
  },
];

export default function InfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative font-sans cursor-target">
      <div className="scan-overlay cursor-target" />
      <Header />

      <main className="flex-1 px-4 py-8 md:px-8 max-w-7xl mx-auto w-full z-10 cursor-target">
        {/* Page Title */}
        <div className="mb-8 cursor-target">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 cursor-target">
            Tools <span className="text-primary">Kit</span>
          </h1>
          <p className="text-muted-foreground max-w-lg cursor-target">
            A collection of utilities for diagnostics, calculation, and data.
          </p>
        </div>

        {/* Tools Navigation Bar */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-border/20 pb-4 cursor-target">
          {tools.map((tool) => {
            const isActive = pathname === tool.path;
            return (
              <Link
                key={tool.path}
                href={tool.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  isActive
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "hover:bg-white/5 border-transparent hover:border-white/10 text-muted-foreground"
                }`}
              >
                {tool.icon}
                {tool.name}
              </Link>
            );
          })}
        </div>

        {/* The Selected Tool Renders Here */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 cursor-target">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

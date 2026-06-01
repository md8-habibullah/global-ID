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
  QrCode,
  Dices,
  MoonStar,
  ArrowRight,
} from "lucide-react";
import "./style.css";

const tools = [
  {
    name: "Prayer Times",
    path: "/kits/prayer",
    icon: <MoonStar className="w-4 h-4" />,
    description:
      "Accurate daily prayer times and schedules based on your location.",
  },
  {
    name: "System Info.",
    path: "/kits/system",
    icon: <Laptop className="w-4 h-4" />,
    description:
      "View detailed information about your device, browser, and OS.",
  },
  {
    name: "IP Subnet",
    path: "/kits/subnet",
    icon: <Network className="w-4 h-4" />,
    description: "Calculate IP ranges, subnet masks, and CIDR notation easily.",
  },
  {
    name: "QR Code",
    path: "/kits/qrcode",
    icon: <QrCode className="w-4 h-4" />,
    description: "Generate downloadable QR codes for links, text, or Wi-Fi.",
  },
  {
    name: "GenPass",
    path: "/kits/password",
    icon: <ShieldCheck className="w-4 h-4" />,
    description: "Create strong, secure, and random passwords instantly.",
  },
  {
    name: "Randomizer",
    path: "/kits/picker",
    icon: <Dices className="w-4 h-4" />,
    description: "Pick random numbers, roll dice, or make quick decisions.",
  },
  {
    name: "Currency Conv.",
    path: "/kits/currency",
    icon: <Coins className="w-4 h-4" />,
    description:
      "Convert between global currencies with real-time exchange rates.",
  },
  {
    name: "Age Calc.",
    path: "/kits/age",
    icon: <CalendarClock className="w-4 h-4" />,
    description:
      "Calculate your exact age in years, months, days, and even seconds.",
  },
];

export default function KitsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    // bg-background commented out to remove solid background color
    <div className="min-h-screen text-foreground flex flex-col relative font-sans cursor-target">
      <div className="scan-overlay cursor-target" />
      <Header />

      <main className="flex-1 px-4 pt-24 pb-8 md:px-8 md:pt-28 max-w-7xl mx-auto w-full z-10 cursor-target">
        {/* Page Title */}
        <div className="mb-8 cursor-target">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 cursor-target">
            Tools & <span className="text-primary">Kit</span>
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
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${isActive
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
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 cursor-target min-h-[300px]">
          {children}
        </div>

        {/* BOTTOM SECTION: About & Navigation Grid */}
        <div className="mt-20 pt-10 border-t border-border/20">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-primary" />
            Explore All Utilities
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map((tool) => {
              const isActive = pathname === tool.path;
              return (
                <Link
                  key={tool.path}
                  href={tool.path}
                  className={`group relative p-4 rounded-xl border transition-all duration-300 overflow-hidden ${isActive
                    ? "bg-primary/5 border-primary/20"
                    : "bg-card/30 border-border/40 hover:bg-card/80 hover:border-primary/40"
                    }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`p-2 rounded-lg transition-colors ${isActive
                        ? "bg-primary/20 text-primary"
                        : "bg-primary/10 text-muted-foreground group-hover:text-primary group-hover:bg-primary/20"
                        }`}
                    >
                      {tool.icon}
                    </div>
                    {!isActive && (
                      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    )}
                  </div>

                  <h3
                    className={`font-medium mb-1 transition-colors ${isActive
                      ? "text-primary"
                      : "text-foreground group-hover:text-primary"
                      }`}
                  >
                    {tool.name}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {tool.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  Menu,
  X,
  NotebookPen,
  Wrench,
  Terminal,
  Calendar, // Imported Calendar Icon
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SiteFakeUptime from "./SiteFakeUptime";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle Click Outside & Scroll to close menu
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (menuRef.current &&
          event.target instanceof Node &&
          menuRef.current.contains(event.target)) ||
        (buttonRef.current &&
          event.target instanceof Node &&
          buttonRef.current.contains(event.target))
      )
        return;
      setIsMenuOpen(false);
    };
    const handleScroll = () => setIsMenuOpen(false);
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMenuOpen]);

  // Scroll Spy Logic
  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    const handleScrollSpy = () => {
      if (window.innerWidth < 768) return;
      const sections = ["about", "skills", "projects"];
      let current = "";

      if (window.scrollY < 100) {
        setActiveSection("");
        return;
      }

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScrollSpy);
    handleScrollSpy();
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, [pathname]);

  if (!mounted) return null;

  const blog = "/blog";
  const isDark = theme === "dark";
  const isKitsPage = pathname?.startsWith("/kits");
  const isCalendarPage = pathname === "/calendar";

  // Helper for Link Classes
  const getNavLinkClass = (id: string) =>
    `nav-link relative px-3 py-1.5 text-sm font-mono font-medium transition-colors rounded-md hover:bg-primary/10 hover:text-primary ${pathname === "/" && activeSection === id
      ? "active text-primary bg-primary/5"
      : "text-muted-foreground"
    }`;

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-border/40 bg-background/95 md:bg-background/80 md:backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between cursor-target">
        {/* === LEFT: SYSTEM IDENTITY === */}
        <Link href="/#" className="group block">
          <div className="flex items-center gap-3 cursor-target">
            <div className="relative w-9 h-9 overflow-hidden rounded-lg border border-primary/20 group-hover:border-primary/50 transition-colors shadow-sm cursor-target">
              <Image
                src="https://avatars.githubusercontent.com/u/149287500?v=4&s=100"
                alt="MD. Habibullah Sharif"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                fill
                sizes="40px"
              />
              {/* Scanline overlay */}
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity cursor-target" />
            </div>
            <div className="flex flex-col cursor-target">
              <h1 className="text-sm font-bold tracking-tight font-mono flex items-center gap-2 group-hover:text-primary transition-colors">
                <Terminal className="w-3 h-3 text-primary" />
                ~/MD.HABIBULLAH
              </h1>
              <div className="flex items-center gap-1.5 cursor-target">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                  System_Ready
                </p>
              </div>
            </div>
          </div>
        </Link>

        {/* === CENTER: COMMAND DOCK (Desktop) === */}
        <nav className="hidden md:flex items-center gap-1 bg-card/40 px-2 py-1.5 rounded-full border border-border/40 md:backdrop-blur-sm shadow-sm cursor-target">
          <Link href="/#" className={getNavLinkClass("")}>
            _home
          </Link>
          <Link href="/#about" className={getNavLinkClass("about")}>
            _about
          </Link>
          <Link href="/#projects" className={getNavLinkClass("projects")}>
            _projects
          </Link>

          <div className="w-px h-4 bg-border/50 mx-2 cursor-target" />

          <Link
            href={blog}
            className="px-3 py-1.5 text-sm font-mono font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
          >
            <NotebookPen className="w-3.5 h-3.5" />
            blog.sh
          </Link>

          <Link
            href="/kits"
            className={`px-4 py-2 text-sm font-mono font-medium rounded-lg transition-all duration-500 flex items-center gap-2 group relative border-2 ${isKitsPage
              ? "bg-gradient-to-r from-primary/20 to-green-400/20 text-primary border-primary/50 shadow-lg shadow-primary/25"
              : "text-muted-foreground hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-green-400/10 border-transparent hover:border-primary/30 hover:shadow-md hover:shadow-primary/20"
              }`}
          >
            <div className="relative flex items-center">
              {/* Pulsing background glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/40 to-green-400/40 rounded-full blur-md opacity-60 animate-pulse" />

              <Wrench
                className={`w-4 h-4 relative z-10 transition-all duration-300 ${isKitsPage
                  ? "text-primary drop-shadow-[0_0_8px_rgba(16,185,129,1)] animate-pulse"
                  : "group-hover:text-primary group-hover:drop-shadow-[0_0_6px_rgba(16,185,129,0.8)] group-hover:scale-110"
                  }`}
              />
            </div>

            <span className="relative z-10 font-semibold">/kits</span>

            {/* Notification dot */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
          </Link>
        </nav>

        {/* === RIGHT: UTILITIES === */}
        <div className="flex items-center gap-3 sm:gap-4 cursor-target">
          <div className="hidden sm:block cursor-target">
            <SiteFakeUptime />
          </div>

          <div className="h-6 w-px bg-border/40 hidden sm:block cursor-target" />

          {/* === 1. CALENDAR BUTTON (Next to Theme Switcher) === */}
          <Link
            href="/calendar"
            title="Global Schedule"
            className={`relative p-2 rounded-lg border transition-all group ${isCalendarPage
              ? "border-primary/50 bg-primary/10 text-primary"
              : "border-border/40 hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary"
              }`}
          >
            <Calendar className="w-5 h-5 transition-transform group-hover:scale-110" />
          </Link>

          {/* === 2. THEME TOGGLE === */}
          <button
            className="relative p-2 rounded-lg border border-border/40 hover:border-primary/50 hover:bg-primary/5 transition-all group"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Moon className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-500 group-hover:rotate-90 transition-transform" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            ref={buttonRef}
            className="md:hidden p-2 rounded-lg border border-border/40 hover:bg-primary/5 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-primary" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* === MOBILE MENU (SYSTEM DROPDOWN) === */}
      <div
        ref={menuRef}
        className={`
          absolute top-[65px] right-0 left-0 bg-background/95 backdrop-blur-xl border-b border-border/40 shadow-2xl
          transition-all duration-300 ease-in-out origin-top
          md:hidden
          ${isMenuOpen
            ? "opacity-100 scale-y-100 translate-y-0"
            : "opacity-0 scale-y-0 -translate-y-4 pointer-events-none"
          }
        `}
      >
        <div className="p-4 space-y-4">
          {/* Mobile Header Stat */}
          <div className="flex items-center justify-between px-4 pb-4 border-b border-border/30 text-xs font-mono text-muted-foreground">
            <span>STATUS: ONLINE</span>
            <SiteFakeUptime compact />
          </div>

          <nav className="flex flex-col gap-2">
            {[
              {
                name: "_home",
                href: "/#",
                active: pathname === "/" && activeSection === "",
              },
              {
                name: "_about",
                href: "/#about",
                active: pathname === "/" && activeSection === "about",
              },
              {
                name: "_projects",
                href: "/#projects",
                active: pathname === "/" && activeSection === "projects",
              },
            ].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`
                    group flex items-center gap-3 px-4 py-3 rounded-lg border font-mono transition-all
                    ${link.active
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-card/50 border-transparent hover:border-primary/30 hover:bg-primary/5"
                  }
                  `}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${link.active
                    ? "bg-primary"
                    : "bg-muted-foreground/30 group-hover:bg-primary/50"
                    }`}
                />
                {link.name}
                {link.active && (
                  <span className="ml-auto text-[10px] opacity-70">
                    &lt;CURRENT&gt;
                  </span>
                )}
              </Link>
            ))}

            {/* Mobile Utils Grid - Updated to include Calendar */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              <Link
                href="/calendar"
                onClick={() => setIsMenuOpen(false)}
                className={`flex flex-col items-center justify-center gap-1 p-3 rounded-lg border font-mono text-xs transition-all ${isCalendarPage
                  ? "border-primary/30 bg-primary/5 text-primary"
                  : "border-border/40 bg-card/50 hover:border-primary/30 hover:text-primary"
                  }`}
              >
                <Calendar className="w-4 h-4" />
                <span>/cal</span>
              </Link>
              <Link
                href={blog}
                onClick={() => setIsMenuOpen(false)}
                className="flex flex-col items-center justify-center gap-1 p-3 rounded-lg border border-border/40 bg-card/50 hover:border-primary/30 hover:text-primary font-mono text-xs"
              >
                <NotebookPen className="w-4 h-4" />
                <span>blog.sh</span>
              </Link>
              <Link
                href="/kits"
                onClick={() => setIsMenuOpen(false)}
                className={`flex flex-col items-center justify-center gap-1 p-3 rounded-lg border font-mono text-xs transition-all ${isKitsPage
                  ? "border-primary/30 bg-primary/5 text-primary"
                  : "border-border/40 bg-card/50 hover:border-primary/30 hover:text-primary"
                  }`}
              >
                <Wrench className="w-4 h-4" />
                <span>/kits</span>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
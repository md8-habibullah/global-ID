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
  Cpu,
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
  const menuRef = useRef<HTMLElement>(null);
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

  // Helper for Link Classes
  const getNavLinkClass = (id: string) =>
    `nav-link relative px-3 py-1.5 text-sm font-mono font-medium transition-colors rounded-md hover:bg-primary/10 hover:text-primary ${
      pathname === "/" && activeSection === id
        ? "active text-primary bg-primary/5"
        : "text-muted-foreground"
    }`;

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between cursor-target">
        {/* === LEFT: SYSTEM IDENTITY === */}
        <Link href="/#" className="group block">
          <div className="flex items-center gap-3 cursor-target">
            <div className="relative w-9 h-9 overflow-hidden rounded-lg border border-primary/20 group-hover:border-primary/50 transition-colors shadow-sm">
              <Image
                src="https://avatars.githubusercontent.com/u/149287500?v=4&s=100"
                alt="MD. Habibullah Sharif"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                fill
                sizes="40px"
              />
              {/* Scanline overlay */}
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-bold tracking-tight font-mono flex items-center gap-2 group-hover:text-primary transition-colors">
                <Terminal className="w-3 h-3 text-primary" />
                ~/MD.HABIBULLAH
              </h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                  System_Ready
                </p>
              </div>
            </div>
          </div>
        </Link>

        {/* === CENTER: COMMAND DOCK (Desktop) === */}
        <nav className="hidden md:flex items-center gap-1 bg-card/40 px-2 py-1.5 rounded-full border border-border/40 backdrop-blur-sm shadow-sm">
          <Link href="/#" className={getNavLinkClass("")}>
            _home
          </Link>
          <Link href="/#about" className={getNavLinkClass("about")}>
            _about
          </Link>
          <Link href="/#projects" className={getNavLinkClass("projects")}>
            _projects
          </Link>

          <div className="w-px h-4 bg-border/50 mx-2" />

          <Link
            href={blog}
            className="px-3 py-1.5 text-sm font-mono font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
          >
            <NotebookPen className="w-3.5 h-3.5" />
            blog.sh
          </Link>

          <Link
            href="/kits"
            className={`px-3 py-1.5 text-sm font-mono font-medium rounded-md transition-colors flex items-center gap-2 ${
              isKitsPage
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-primary hover:bg-primary/5"
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            /kits
          </Link>
        </nav>

        {/* === RIGHT: UTILITIES === */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:block">
            <SiteFakeUptime />
          </div>

          <div className="h-6 w-px bg-border/40 hidden sm:block" />

          {/* Theme Toggle (Switch Style) */}
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
          ${isMenuOpen ? "opacity-100 scale-y-100 translate-y-0" : "opacity-0 scale-y-0 -translate-y-4 pointer-events-none"}
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
                    ${
                      link.active
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-card/50 border-transparent hover:border-primary/30 hover:bg-primary/5"
                    }
                  `}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${link.active ? "bg-primary" : "bg-muted-foreground/30 group-hover:bg-primary/50"}`}
                />
                {link.name}
                {link.active && (
                  <span className="ml-auto text-[10px] opacity-70">
                    &lt;CURRENT&gt;
                  </span>
                )}
              </Link>
            ))}

            <div className="grid grid-cols-2 gap-2 mt-2">
              <Link
                href={blog}
                onClick={() => setIsMenuOpen(false)} // Add this so the menu closes when clicked!
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border/40 bg-card/50 hover:border-primary/30 font-mono text-sm"
              >
                <NotebookPen className="w-4 h-4 text-primary" />
                blog.sh
              </Link>
              <Link
                href="/kits"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border font-mono text-sm transition-all ${
                  isKitsPage
                    ? "border-primary/30 bg-primary/5 text-primary"
                    : "border-border/40 bg-card/50 hover:border-primary/30"
                }`}
              >
                <Wrench className="w-4 h-4 text-primary" />
                /kits
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

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
  MoonStar,
} from "lucide-react"; // [!code focus]
import Image from "next/image";
import Link from "next/link";
import SiteFakeUptime from "./SiteFakeUptime";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

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
  }, []);

  if (!mounted) return null;

  const blog = "https://blog.habibullah.dev";
  const isDark = theme === "dark";

  const getNavLinkClass = (id: string) =>
    `nav-link ${activeSection === id ? "active" : ""} transition-colors`;

  return (
    <header className="header-bar relative cursor-target">
      {/* Logo */}
      <Link href="/#">
        <div className="flex items-center gap-4 cursor-target">
          <div className="relative w-10 h-10">
            <Image
              src="https://avatars.githubusercontent.com/u/149287500?v=4&s=100"
              alt="MD. Habibullah Sharif"
              className="rounded-lg object-cover shadow-lg"
              fill
              sizes="40px"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">HABIBULLAH</h1>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Full-Stack Dev
            </p>
          </div>
        </div>
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-6 cursor-target">
        {/* Main Links */}
        <Link href="/#" className={getNavLinkClass("")}>
          Home
        </Link>
        <Link href="/#about" className={getNavLinkClass("about")}>
          About
        </Link>
        <Link href="/#projects" className={getNavLinkClass("projects")}>
          Projects
        </Link>
        {/* Separator */}
        <div className="h-5 w-px bg-border/40 mx-2" />
        {/* Extra Tools */}
        <a
          href={blog}
          target="_blank"
          className="nav-link flex items-center gap-2 group text-sm font-medium opacity-80 hover:opacity-100"
        >
          <NotebookPen className="w-4 h-4 text-primary" />
          <span>Blog</span>
        </a>
        <Link
          href="/info"
          className="nav-link flex items-center gap-2 group text-sm font-medium opacity-80 hover:opacity-100"
        >
          <Wrench className="w-4 h-4 text-primary" />
          <span>Kits</span>
        </Link>
        <Link // [!code focus:start]
          href="/prayer"
          className="nav-link flex items-center gap-2 group text-sm font-medium opacity-80 hover:opacity-100"
        >
          <MoonStar className="w-4 h-4 text-primary" />
          <span>Prayer</span>
        </Link>{" "}
      </nav>

      {/* Right-side Icons */}
      <div className="flex items-center gap-4 sm:gap-6 cursor-target">
        <div className="hidden md:block">
          <SiteFakeUptime />
        </div>
        <div className="md:hidden">
          <SiteFakeUptime compact />
        </div>

        <button
          className="theme-toggle-btn p-2 rounded-full border border-border/30 hover:bg-primary/10 transition cursor-pointer"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label="Toggle theme"
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? (
            <Moon className="w-5 h-5 text-primary" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-400" />
          )}
        </button>

        <button
          ref={buttonRef}
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <nav
        ref={menuRef}
        className={`
          absolute top-full left-0 w-full bg-background/95 backdrop-blur-sm z-50
          flex flex-col items-center gap-6 py-8 border-b border-border/10
          md:hidden ${isMenuOpen ? "flex" : "hidden"}
        `}
      >
        <Link
          href="/#"
          className={`nav-link text-lg ${activeSection === "" ? "active" : ""}`}
          onClick={() => setIsMenuOpen(false)}
        >
          Home
        </Link>
        <Link
          href="/#about"
          className={`nav-link text-lg ${activeSection === "about" ? "active" : ""}`}
          onClick={() => setIsMenuOpen(false)}
        >
          About
        </Link>
        <Link
          href="/#projects"
          className={`nav-link text-lg ${activeSection === "projects" ? "active" : ""}`}
          onClick={() => setIsMenuOpen(false)}
        >
          Projects
        </Link>
        <div className="w-12 h-px bg-border/20 my-2" />
        <a
          href={blog}
          target="_blank"
          className="nav-link text-lg flex items-center gap-2"
          onClick={() => setIsMenuOpen(false)}
        >
          <NotebookPen className="w-5 h-5 text-primary" />
          <span>Blog</span>
        </a>
        <Link
          href="/info"
          className="nav-link text-lg flex items-center gap-2"
          onClick={() => setIsMenuOpen(false)}
        >
          <Wrench className="w-5 h-5 text-primary" />
          <span>Kits</span>
        </Link>
        <Link // [!code focus:start]
          href="/prayer"
          className="nav-link text-lg flex items-center gap-2"
          onClick={() => setIsMenuOpen(false)}
        >
          <MoonStar className="w-5 h-5 text-primary" />
          <span>Prayer</span>
        </Link>{" "}
      </nav>
    </header>
  );
}

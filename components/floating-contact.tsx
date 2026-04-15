"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  MessageCircle,
  Facebook,
  Instagram,
  X,
  Copy,
  ExternalLink,
  Check,
  ShieldCheck, // Secure icon
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { DevToIcon } from "@/components/icon/dev.to";
import { MediumIcon } from "@/components/icon/medium";

// Renamed to 'connectList' for better semantics
const connectList = [
  {
    id: 1,
    label: "Email",
    value: "hello@habibullah.dev",
    copyValue: "hello@habibullah.dev",
    href: "mailto:hello@habibullah.dev",
    icon: Mail,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    darkBg: "dark:bg-blue-950/30",
    description: "Drop me a line", // Polished text
  },
  {
    id: 2,
    label: "WhatsApp",
    value: "habibullah.dev/whatsapp",
    copyValue: "+8801329876070",
    href: "https://habibullah.dev/whatsapp/",
    icon: MessageCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
    darkBg: "dark:bg-green-950/30",
    description: "Direct message", // Polished text
  },
  {
    id: 3,
    label: "LinkedIn",
    value: "linkedin.com/in/md-habibullahs",
    copyValue: "https://www.linkedin.com/in/md-habibullahs",
    href: "https://www.linkedin.com/in/md-habibullahs",
    icon: Linkedin,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    darkBg: "dark:bg-blue-950/30",
    description: "Professional network", // Polished text
  },
  {
    id: 4,
    label: "GitHub",
    value: "github.com/md8-habibullah",
    copyValue: "https://github.com/md8-habibullah",
    href: "https://github.com/md8-habibullah",
    icon: Github,
    color: "text-gray-700",
    bgColor: "bg-gray-50",
    darkBg: "dark:bg-gray-950/30",
    description: "Check my code", // Polished text
  },
  // Swapped Facebook for Dev.to
  {
    id: 5,
    label: "Dev.to",
    value: "dev.to/md8_habibullah",
    copyValue: "https://dev.to/md8_habibullah",
    href: "https://dev.to/md8_habibullah",
    icon: DevToIcon,
    color: "text-gray-800 dark:text-white", // Brand correct colors
    bgColor: "bg-gray-100",
    darkBg: "dark:bg-white/10",
    description: "Read my articles",
  },
  {
    id: 6,
    label: "Medium",
    value: "@md8.habibullah",
    copyValue: "https://medium.com/@md8.habibullah",
    href: "https://medium.com/@md8.habibullah",
    icon: MediumIcon,
    color: "text-black dark:text-white",
    bgColor: "bg-gray-100",
    darkBg: "dark:bg-white/10",
    description: "Read my insights",
  },
  {
    id: 7,
    label: "Facebook",
    value: "md8.habibullah",
    copyValue: "https://www.facebook.com/md8.habibullah/",
    href: "https://www.facebook.com/md8.habibullah/",
    icon: Facebook,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    darkBg: "dark:bg-blue-900/30",
    description: "Follow my updates",
  },
  {
    id: 8,
    label: "Instagram",
    value: "@md8.habibullah",
    copyValue: "https://www.instagram.com/md8.habibullah",
    href: "https://www.instagram.com/md8.habibullah",
    icon: Instagram,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    darkBg: "dark:bg-pink-900/30",
    description: "Behind the scenes",
  },
];

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = async (text: string, id: number, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success(`${label} copied!`, {
        description: "Ready to share",
        duration: 2000,
      });

      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const handleDirectClick = (href: string, external: boolean = true) => {
    if (external) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = href;
    }
  };
  
  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  return (
    <>
      {/* Floating Connect Button */}
      <motion.div
        className="fixed bottom-14 right-8 md:bottom-12 md:right-10 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Glowing background ring - Heavy Reduction */}
        <motion.div
          className="hidden md:block absolute inset-0 rounded-2xl bg-primary/10 blur-xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            relative 
            h-14 w-14 flex items-center justify-center rounded-full
            md:h-auto md:w-auto md:px-6 md:py-4 md:rounded-2xl
            
            md:backdrop-blur-xl bg-background/30 md:bg-background/20
            font-mono text-sm font-semibold
            transition-all duration-500 ease-out
            shadow-xl hover:shadow-primary/10
            border bg-transparent
            ${isOpen
              ? "border-primary bg-primary/10 text-primary scale-105 shadow-primary/20"
              : "border-primary/20 text-primary hover:border-primary/50 hover:scale-105 hover:bg-primary/5"
            }
          `}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Breathing pulse effect */}
          {!isOpen && (
            <motion.div
              className="hidden md:block absolute inset-0 rounded-2xl border-2 border-primary/30"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          )}

          <div className="flex items-center gap-3">
            <motion.div
              animate={{
                rotate: isOpen ? 180 : [0, 10, -10, 0],
                scale: isOpen ? 1.1 : [1, 1.1, 1]
              }}
              transition={{
                rotate: { duration: isOpen ? 0.3 : 2, repeat: isOpen ? 0 : Infinity, ease: "easeInOut" },
                scale: { duration: 1.5, repeat: isOpen ? 0 : Infinity, ease: "easeInOut" }
              }}
            >
              {isOpen ? (
                <X className="w-6 h-6 md:w-5 md:h-5" />
              ) : (
                <MessageSquare className="w-6 h-6 md:w-5 md:h-5" />
              )}
            </motion.div>

            {/* CASUAL TEXT */}
            <div className="hidden md:flex flex-col items-start leading-none font-sans">
              <span className="text-sm font-bold">{isOpen ? "Close Menu" : "Let's Connect"}</span>
              <span className="text-xs opacity-80">{isOpen ? "Hide contact" : "Let's talk"}</span>
            </div>
          </div>

          {/* Notification badge */}
          <motion.div
            className="absolute top-0 right-0 md:-top-2 md:-right-2 w-4 h-4 md:w-6 md:h-6 bg-green-500 rounded-full border-2 md:border-3 border-white dark:border-gray-900 flex items-center justify-center"
            animate={{
              scale: [1, 1.2, 1],
              boxShadow: [
                "0 0 0 0 rgba(34, 197, 94, 0.4)",
                "0 0 0 10px rgba(34, 197, 94, 0)",
                "0 0 0 0 rgba(34, 197, 94, 0.4)"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          >
            <span className="text-white text-[10px] md:text-xs font-bold">1</span>
          </motion.div>
        </motion.button>

        {/* Floating tooltip - Updated Text */}
        {!isOpen && (
          <motion.div
            className="hidden md:block absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs rounded-lg shadow-lg whitespace-nowrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: [10, 0, 0, 10]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatDelay: 6,
              ease: "easeInOut",
            }}
          >
            Let's talk
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-primary/20" />
          </motion.div>
        )}
      </motion.div>

      {/* Connect Popup */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/40 md:bg-black/20 md:backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Connect Panel */}
            <motion.div
              className="fixed bottom-32 left-4 right-4 md:left-auto md:right-10 md:w-96 z-50"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="bg-background/80 md:backdrop-blur-2xl rounded-3xl border border-primary/20 shadow-2xl overflow-hidden">
                {/* Header - Updated */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-primary/10 rounded-2xl">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Let's Connect
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Reach out on your favorite platform
                      </p>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Close contact menu"
                  >
                    <X className="w-6 h-6 text-foreground/70" />
                  </motion.button>
                </div>

                {/* Connect List */}
                <div className="p-4 space-y-3 max-h-[60vh] md:max-h-96 overflow-y-auto">
                  {connectList.map((contact, index) => (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`
                        group relative p-4 rounded-2xl border border-gray-200/50 dark:border-gray-700/50
                        ${contact.bgColor} ${contact.darkBg}
                        transition-all duration-200 hover:shadow-md hover:scale-[1.02]
                        cursor-pointer
                      `}
                      onClick={() => handleDirectClick(contact.href)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className={`p-3 rounded-2xl ${contact.color} bg-white dark:bg-gray-800 shadow-sm`}>
                            <contact.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-base font-semibold text-gray-900 dark:text-white">
                                {contact.label}
                              </span>
                              <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 truncate mb-1">
                              {contact.value}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {contact.description}
                            </p>
                          </div>
                        </div>

                        {/* Copy Button */}
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(contact.copyValue, contact.id, contact.label);
                          }}
                          className="
                            p-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                            hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200
                            shadow-sm hover:shadow-md
                          "
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title={`Copy ${contact.label}`}
                        >
                          {copiedId === contact.id ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer with Polished Pulse */}
                <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50 space-y-4">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                    <span>Available for new opportunities</span>
                  </div>

                  {/* Mobile-only secondary close button for Android accessibility */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="md:hidden w-full py-4 rounded-2xl bg-primary/10 text-primary font-bold text-sm border border-primary/20 hover:bg-primary/20 transition-all flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Close Menu
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
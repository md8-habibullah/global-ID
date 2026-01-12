"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  MessageCircle,
  Facebook,
  X,
  Copy,
  ExternalLink,
  Check,
  MessageSquare,
  User,
} from "lucide-react";
import { toast } from "sonner";

const contactList = [
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
    description: "Send me an email",
  },
  {
    id: 2,
    label: "WhatsApp",
    value: "+880 1521-205602",
    copyValue: "+8801521205602",
    href: "https://habibullah.dev/whatsapp/",
    icon: MessageCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
    darkBg: "dark:bg-green-950/30",
    description: "Chat on WhatsApp",
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
    description: "Connect on LinkedIn",
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
    description: "View my repositories",
  },
  {
    id: 5,
    label: "Facebook",
    value: "facebook.com/md8.habibullah",
    copyValue: "https://www.facebook.com/md8.habibullah",
    href: "https://www.facebook.com/md8.habibullah",
    icon: Facebook,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    darkBg: "dark:bg-blue-950/30",
    description: "Follow on Facebook",
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
        description: "Ready to use anywhere",
        duration: 2000,
      });
      
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleDirectClick = (href: string, external: boolean = true) => {
    if (external) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = href;
    }
  };

  return (
    <>
      {/* Floating Contact Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 400, damping: 25 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            relative p-4 rounded-full border backdrop-blur-md
            font-sans text-sm font-semibold
            transition-all duration-300 ease-out
            shadow-lg hover:shadow-xl
            ${
              isOpen
                ? "border-primary bg-primary text-white scale-105 shadow-primary/20"
                : "border-border bg-background/90 text-foreground hover:bg-primary/5 hover:border-primary/30 hover:scale-105"
            }
          `}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Subtle pulse when closed */}
          {!isOpen && (
            <motion.div
              className="absolute inset-0 rounded-full border border-primary/20"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
          
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5" />
            <span className="hidden sm:inline">Get in Touch</span>
            <span className="sm:hidden">Contact</span>
          </div>

          {/* Online status indicator */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
        </motion.button>
      </motion.div>

      {/* Contact Popup */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Contact Panel */}
            <motion.div
              className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] z-50"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-primary/10 rounded-2xl">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Contact Me
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Let's connect and collaborate
                      </p>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </motion.button>
                </div>

                {/* Contact List */}
                <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                  {contactList.map((contact, index) => (
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

                        {/* Copy Button - Always visible */}
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

                {/* Footer */}
                <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Available for new opportunities</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
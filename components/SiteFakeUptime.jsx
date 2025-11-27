"use client";

import { useState, useEffect, useRef } from "react";
import {
  Globe,
  Zap,
  User,
  Monitor,
  Languages,
  History,
  Eye,
} from "lucide-react";

// --- Safe localStorage Helper Functions ---
const safeGetStorage = (key) => {
  if (typeof window === "undefined") return null;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.warn(`Error reading from localStorage (${key}):`, error.message);
    return null;
  }
};

const safeSetStorage = (key, value) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error writing to localStorage (${key}):`, error.message);
  }
};

// --- Helper function to format time ---
const formatUptime = (totalSeconds) => {
  const SECONDS_IN_MINUTE = 60;
  const SECONDS_IN_HOUR = 3600;
  const SECONDS_IN_DAY = 86400;

  const days = Math.floor(totalSeconds / SECONDS_IN_DAY);
  let remainingSeconds = totalSeconds % SECONDS_IN_DAY;

  const hours = Math.floor(remainingSeconds / SECONDS_IN_HOUR);
  remainingSeconds %= SECONDS_IN_HOUR;

  const minutes = Math.floor(remainingSeconds / SECONDS_IN_MINUTE);
  const seconds = remainingSeconds % SECONDS_IN_MINUTE;

  const timeString = [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ${timeString}`;
  }
  if (totalSeconds >= SECONDS_IN_HOUR) {
    return timeString;
  }
  return [
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");
};

const formatLoadTime = (ms) => {
  if (ms === null) return "...";
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
};

export default function SiteFakeUptime({ compact = false }) {
  // --- States ---
  const [bdTime, setBdTime] = useState("--:--:--");
  const [visitorTime, setVisitorTime] = useState("--:--:--");
  const [totalUptime, setTotalUptime] = useState(0);

  const [pageLoadTime, setPageLoadTime] = useState(null);
  const [platform, setPlatform] = useState(null);
  const [language, setLanguage] = useState(null);
  const [pageVisits, setPageVisits] = useState(0);

  const popoverRef = useRef(null);

  useEffect(() => {
    setPageLoadTime(Math.round(performance.now()));
    setPlatform(navigator.platform || "Unknown");
    setLanguage(navigator.language || "Unknown");

    const visits = safeGetStorage("habibullah:pageVisits") || 0;
    const newVisits = visits + 1;
    safeSetStorage("habibullah:pageVisits", newVisits);
    setPageVisits(newVisits);

    const initialTotal = safeGetStorage("habibullah:totalUptime") || 0;
    setTotalUptime(initialTotal);

    const updateTimes = () => {
      setTotalUptime((prevTotal) => {
        const newTotal = prevTotal + 1;
        if (newTotal % 5 === 0) {
          safeSetStorage("habibullah:totalUptime", newTotal);
        }
        return newTotal;
      });

      const bdNow = new Date().toLocaleTimeString("en-US", {
        timeZone: "Asia/Dhaka",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setBdTime(bdNow);
      const visitorNow = new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setVisitorTime(visitorNow);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const popoverPositionClass = compact
    ? "absolute top-full left-1/2 transform -translate-x-1/2 mt-2"
    : "absolute top-full right-0 mt-2";

  return (
    <div className="relative group" ref={popoverRef}>
      
      {/* --- 1. The Visible Timer (Now a Link) --- */}
      {/* CHANGED: Swapped div for 'a' tag, added href, removed onClick state toggle */}
      <a
        href="https://status.habibullah.dev"
        target="_blank"
        rel="noopener noreferrer"
        title="View Real System Status"
        className={`
          ${compact ? "flex items-center gap-2 text-sm" : "flex items-center gap-3 text-xl"}
          font-mono text-muted-foreground 
          hover:text-primary transition-colors duration-200 
          cursor-pointer no-underline
        `}
      >
        <div className={`relative flex items-center justify-center ${compact ? 'w-4 h-4' : 'w-6 h-6'}`}>
          <div 
            className="broadcast-dot" 
            style={{ width: compact ? 6 : 8, height: compact ? 6 : 8 }} 
          />
        </div>
        <span>{formatUptime(totalUptime)}</span>
      </a>

      {/* --- 2. The Hover Popover --- */}
      <div
        className={`
          ${popoverPositionClass}
          z-50 max-w-[90vw] sm:w-56 ${compact ? 'p-2' : 'p-3'}
          bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl 
          text-xs text-muted-foreground
          transition-all duration-200 ease-in-out
          origin-top-right
          
          /* Logic: Hidden by default, Visible on Group Hover */
          opacity-0 scale-95 pointer-events-none invisible
          group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto group-hover:visible
        `}
      >
        <div className="space-y-2">
          {/* --- Host Info --- */}
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5 opacity-80">
              <Globe className="w-3 h-3" />
              BD Local
            </span>
            <span className="font-mono text-white">{bdTime}</span>
          </div>

          <hr className="border-neutral-700/50 my-2" />

          {/* --- Visitor Info --- */}
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5 opacity-80">
              <User className="w-3 h-3" />
              Your Local
            </span>
            <span className="font-mono text-white">{visitorTime}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5 opacity-80">
              <Monitor className="w-3 h-3" />
              Platform
            </span>
            <span className="font-mono text-white truncate max-w-[80px]">
              {platform || "..."}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5 opacity-80">
              <Languages className="w-3 h-3" />
              Language
            </span>
            <span className="font-mono text-white truncate max-w-[80px]">
              {language || "..."}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5 opacity-80">
              <Zap className="w-3 h-3" />
              Page Load
            </span>
            <span className="font-mono text-white">
              {formatLoadTime(pageLoadTime)}
            </span>
          </div>

          <hr className="border-neutral-700/50 my-2" />

          {/* --- Total Uptime Row --- */}
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5 opacity-80">
              <History className="w-3 h-3" />
              Total Time
            </span>
            <span className="font-mono text-white">
              {formatUptime(totalUptime)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5 opacity-80">
              <Eye className="w-3 h-3" />
              Page Visits
            </span>
            <span className="font-mono text-white">{pageVisits}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
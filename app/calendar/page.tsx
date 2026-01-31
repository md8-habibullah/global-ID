"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Calendar as CalIcon, List, Clock, Loader2, Globe, LayoutGrid } from "lucide-react";

export default function CalendarPage() {
    const [view, setView] = useState<"month" | "week" | "schedule">("month");
    const [isLoading, setIsLoading] = useState(true);

    // Fake loading delay to ensure smooth transition
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleLoad = () => {
        setIsLoading(false);
    };

    // Base configuration
    // NOTE: We force showNav=1 and showDate=1 so you can actually navigate months/weeks.
    // showTitle=0 and showTabs=0 keeps it looking like YOUR site, not Google's.
    const baseUrl = "https://calendar.google.com/calendar/embed";
    const commonParams = [
        "height=600",
        "wkst=1",
        "bgcolor=%23ffffff",
        "ctz=Asia%2FDhaka",
        "showPrint=0",
        "showTitle=0",       // Hides "Google Calendar" title
        "showTabs=0",        // Hides "Week/Month/Agenda" tabs (we built our own)
        "showCalendars=0",   // Hides sidebar list
        "showTz=0",          // Hides timezone footer text
        "hl=en",             // Force English
        "src=bWQ4LmhhYmlidWxsYWhAZ21haWwuY29t",
        "color=%234285f4",
        "src=ZW4uYmQjaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20",
        "color=%230b8043",
    ].join("&");

    return (
        <main className="min-h-screen bg-background relative selection:bg-primary/20 cursor-target">
            <Header />

            <section className="pt-32 pb-20 px-4 sm:px-8">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* 1. Page Header */}
                    <div className="flex flex-col items-center text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                            <Globe className="w-3 h-3" />
                            <span>Asia / Dhaka</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            Global <span className="text-primary">Schedule</span>
                        </h1>
                    </div>

                    {/* 2. Controls Toolbar */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-card/50 p-2 rounded-xl border border-white/5 backdrop-blur-sm sticky top-24 z-30 shadow-2xl">
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground px-3">
                                <Clock className="w-4 h-4 text-primary" />
                                <span className="hidden sm:inline">Synced: Real-time</span>
                                <span className="sm:hidden">Live</span>
                            </span>
                        </div>

                        {/* View Switcher */}
                        <div className="flex bg-black/40 p-1 rounded-lg border border-white/5 overflow-x-auto max-w-full">
                            <button
                                onClick={() => setView("month")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all duration-300 whitespace-nowrap ${view === "month"
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <CalIcon className="w-4 h-4" />
                                Month
                            </button>
                            <button
                                onClick={() => setView("week")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all duration-300 whitespace-nowrap ${view === "week"
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                                Week
                            </button>
                            <button
                                onClick={() => setView("schedule")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all duration-300 whitespace-nowrap ${view === "schedule"
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <List className="w-4 h-4" />
                                Agenda
                            </button>
                        </div>
                    </div>

                    {/* 3. Calendar Container */}
                    {/* We apply a CSS Filter to invert colors for Dark Mode effect */}
                    <div className="relative w-full bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl shadow-primary/5 min-h-[650px] border border-white/10 group">

                        {/* Tech Decoration */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

                        {/* Loading State */}
                        {isLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-20">
                                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                                <p className="text-sm text-muted-foreground animate-pulse">Decrypting Schedule...</p>
                            </div>
                        )}

                        {/* DARK MODE MAGIC: 
              filter: invert(0.9) hue-rotate(180deg) 
              - Invert turns white bg to dark gray/black.
              - Hue-rotate flips the inverted colors back to (roughly) their original hue so Blue stays Blue-ish.
            */}
                        <div className="w-full h-full filter invert-[.92] hue-rotate-180 contrast-[.95] saturate-[.85]">

                            {/* MONTH VIEW */}
                            <div className={view === "month" ? "block h-full" : "hidden h-full"}>
                                <iframe
                                    src={`${baseUrl}?${commonParams}&mode=MONTH&showNav=1&showDate=1`}
                                    style={{ borderWidth: 0 }}
                                    width="100%"
                                    height="700"
                                    frameBorder="0"
                                    scrolling="no"
                                    onLoad={handleLoad}
                                    className="w-full min-h-[650px]"
                                ></iframe>
                            </div>

                            {/* WEEK VIEW */}
                            <div className={view === "week" ? "block h-full" : "hidden h-full"}>
                                <iframe
                                    src={`${baseUrl}?${commonParams}&mode=WEEK&showNav=1&showDate=1`}
                                    style={{ borderWidth: 0 }}
                                    width="100%"
                                    height="700"
                                    frameBorder="0"
                                    scrolling="no"
                                    onLoad={handleLoad}
                                    className="w-full min-h-[650px]"
                                ></iframe>
                            </div>

                            {/* AGENDA / SCHEDULE VIEW */}
                            <div className={view === "schedule" ? "block h-full" : "hidden h-full"}>
                                <iframe
                                    src={`${baseUrl}?${commonParams}&mode=AGENDA&showNav=1&showDate=1`}
                                    style={{ borderWidth: 0 }}
                                    width="100%"
                                    height="700"
                                    frameBorder="0"
                                    scrolling="no"
                                    onLoad={handleLoad}
                                    className="w-full min-h-[650px]"
                                ></iframe>
                            </div>

                        </div>

                    </div>

                    {/* 4. Legend */}
                    <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2">
                            {/* We use the 'inverted' color to match what shows on screen after filter */}
                            <span className="w-2 h-2 rounded-full bg-[#4285f4] shadow-[0_0_8px_#4285f4]"></span>
                            <span className="font-mono uppercase tracking-wider">Personal</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#0b8043] shadow-[0_0_8px_#0b8043]"></span>
                            <span className="font-mono uppercase tracking-wider">Holidays</span>
                        </div>
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
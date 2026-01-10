"use client";

import { useState, useEffect } from "react";
import {
  MoonStar,
  MapPin,
  Calendar,
  Search,
  Sunrise,
  Sunset,
  Sun,
  Cloud,
  CloudRain,
  CloudSun,
  Wind,
  Droplets,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/header";
import Footer from "@/components/footer";

// --- Configuration & Types ---
const BD_HOLIDAYS = [
  { name: "Language Martyrs' Day", date: "02-21" },
  { name: "Independence Day", date: "03-26" },
  { name: "Bengali New Year", date: "04-14" },
  { name: "May Day", date: "05-01" },
  { name: "Victory Day", date: "12-16" },
];

interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Midnight: string;
  [key: string]: string;
}

interface HijriDate {
  day: string;
  month: { en: string; ar: string };
  year: string;
  weekday: { en: string; ar: string };
}

interface WeatherData {
  temp: number;
  code: number;
  wind: number;
  humidity: number;
}

interface TimeStatus {
  status: "active" | "forbidden" | "pending";
  currentPrayer: string;
  nextPrayer: string;
  timeLeft: string; // HH:MM:SS
  progress: number; // 0-100
  message: string;
  isForbidden: boolean;
  totalWindow?: string;
  elapsed?: string;
}

// --- Utilities ---

// Convert 24h to 12h
const to12h = (time: string) => {
  if (!time) return "--:--";
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
};

// Add minutes to HH:MM time
const addMinutes = (time: string, mins: number) => {
  if (!time) return "--:--";
  const [h, m] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m + mins);
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
};

// Bangla Date Logic
const getBanglaDate = (date: Date) => {
  const weekDays = [
    "রবিবার",
    "সোমবার",
    "মঙ্গলবার",
    "বুধবার",
    "বৃহস্পতিবার",
    "শুক্রবার",
    "শনিবার",
  ];
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const banglaYear =
    month < 3 || (month === 3 && day < 14) ? year - 594 : year - 593;

  // Simplified Month Logic
  const months = [
    "পৌষ",
    "মাঘ",
    "ফাল্গুন",
    "চৈত্র",
    "বৈশাখ",
    "জ্যৈষ্ঠ",
    "আষাঢ়",
    "শ্রাবণ",
    "ভাদ্র",
    "আশ্বিন",
    "কার্তিক",
    "অগ্রহায়ু",
  ];
  let mIndex = (month + 10) % 12;
  if (day >= 15) mIndex = (mIndex + 1) % 12;

  const banglaMonth = months[mIndex];

  // Suffix
  let suffix = "ই";
  if (day === 1) suffix = "লা";
  else if (day === 2 || day === 3) suffix = "রা";
  else if (day === 4) suffix = "ঠা";
  else if (day >= 19) suffix = "শে";

  const convertDigit = (n: number) =>
    n.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);

  return `${weekDays[date.getDay()]}, ${convertDigit(day)}${suffix} ${banglaMonth} ${convertDigit(banglaYear)} বঙ্গাব্দ`;
};

// --- Main Component ---

export default function PrayerDashboard() {
  // Use null initially to prevent hydration mismatch
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  // Location
  const [city, setCity] = useState("Dhaka");
  const [searchCity, setSearchCity] = useState("Dhaka");
  const [coords, setCoords] = useState({ lat: 23.8103, lon: 90.4125 }); // Default Dhaka

  // Data
  const [timings, setTimings] = useState<PrayerTimings | null>(null);
  const [hijri, setHijri] = useState<HijriDate | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [holidays, setHolidays] = useState<any[]>([]);

  // Time Engine Status
  const [status, setStatus] = useState<TimeStatus>({
    status: "pending",
    currentPrayer: "",
    nextPrayer: "",
    timeLeft: "",
    progress: 0,
    message: "Loading...",
    isForbidden: false,
  });

  // 1. Initialize Clock on Client Only
  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Fetch Prayer & Holidays
  const fetchPrayerData = async () => {
    try {
      const now = new Date();
      // Fetch Timings
      const res = await fetch(
        `https://api.aladhan.com/v1/timingsByCity/${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}?city=${searchCity}&country=Bangladesh&method=1`,
      );
      const json = await res.json();

      if (json.data) {
        setTimings(json.data.timings);
        setHijri(json.data.date.hijri);
        setCity(searchCity);
        // Update Coords for Weather
        if (json.data.meta) {
          setCoords({
            lat: json.data.meta.latitude,
            lon: json.data.meta.longitude,
          });
        }
      }

      // Fetch Islamic Holidays
      const holRes = await fetch(
        `https://api.aladhan.com/v1/holidays/${now.getFullYear()}?country=BD`,
      );
      const holJson = await holRes.json();

      // Normalize API Holidays (Handle DD-MM-YYYY format safely)
      const apiHolidays = (holJson.data || []).map((h: any) => {
        let isoDate = "";
        // Check if date is in gregorian object (AlAdhan standard)
        if (h.gregorian && h.gregorian.date) {
          const [d, m, y] = h.gregorian.date.split("-");
          isoDate = `${y}-${m}-${d}`;
        }
        // Fallback if structure differs
        else if (typeof h.date === "string") {
          isoDate = h.date;
        }

        return {
          name: h.name.en || h.name, // Handle localized name object
          date: { iso: isoDate },
          type: "Islamic",
        };
      });

      // Merge with BD Fixed Holidays
      const fixedHolidays = BD_HOLIDAYS.map((h) => ({
        name: h.name,
        date: { iso: `${now.getFullYear()}-${h.date}` },
        type: "National",
      }));

      const allHolidays = [...apiHolidays, ...fixedHolidays];

      // Filter Upcoming
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcoming = allHolidays
        .filter((h: any) => {
          if (!h.date.iso) return false;
          return new Date(h.date.iso) >= today;
        })
        .sort(
          (a: any, b: any) =>
            new Date(a.date.iso).getTime() - new Date(b.date.iso).getTime(),
        )
        .slice(0, 5);

      setHolidays(upcoming);
    } catch (e) {
      console.error("Prayer Fetch Error", e);
    }
  };

  // 3. Fetch Weather
  const fetchWeather = async () => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m`,
      );
      const json = await res.json();
      if (json.current) {
        setWeather({
          temp: json.current.temperature_2m,
          code: json.current.weather_code,
          wind: json.current.wind_speed_10m,
          humidity: json.current.relative_humidity_2m,
        });
      }
    } catch (e) {
      console.error("Weather Error", e);
    }
  };

  useEffect(() => {
    fetchPrayerData();
  }, []);

  useEffect(() => {
    if (coords.lat) fetchWeather();
  }, [coords]);

  // 4. Time Engine Logic
  useEffect(() => {
    if (!timings || !currentTime) return;
    calculateStatus(currentTime, timings);
  }, [currentTime, timings]);

  const calculateStatus = (now: Date, times: PrayerTimings) => {
    const toMins = (t: string) => {
      if (!t) return 0;
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };

    const nowMins = now.getHours() * 60 + now.getMinutes();
    const nowSecs = now.getSeconds();

    const fajr = toMins(times.Fajr);
    const sunrise = toMins(times.Sunrise);
    const dhuhr = toMins(times.Dhuhr);
    const asr = toMins(times.Asr);
    const maghrib = toMins(times.Maghrib);
    const isha = toMins(times.Isha);

    let currentP = "Isha";
    let nextP = "Fajr";
    let nextTime = fajr + 24 * 60;
    let isForbidden = false;
    let forbiddenMsg = "";

    // Determine Cycle
    if (nowMins >= fajr && nowMins < sunrise) {
      currentP = "Fajr";
      nextP = "Sunrise";
      nextTime = sunrise;
    } else if (nowMins >= sunrise && nowMins < sunrise + 15) {
      isForbidden = true;
      forbiddenMsg = "Sunrise (Forbidden)";
      currentP = "Ishraq";
      nextP = "Dhuhr";
      nextTime = dhuhr;
    } else if (nowMins >= sunrise + 15 && nowMins < dhuhr - 10) {
      currentP = "Ishraq";
      nextP = "Dhuhr";
      nextTime = dhuhr;
    } else if (nowMins >= dhuhr - 10 && nowMins < dhuhr) {
      isForbidden = true;
      forbiddenMsg = "Zawaal (Forbidden)";
      currentP = "Zawaal";
      nextP = "Dhuhr";
      nextTime = dhuhr;
    } else if (nowMins >= dhuhr && nowMins < asr) {
      currentP = "Dhuhr";
      nextP = "Asr";
      nextTime = asr;
    } else if (nowMins >= asr && nowMins < maghrib - 15) {
      currentP = "Asr";
      nextP = "Maghrib";
      nextTime = maghrib;
    } else if (nowMins >= maghrib - 15 && nowMins < maghrib) {
      isForbidden = true;
      forbiddenMsg = "Sunset (Forbidden)";
      currentP = "Asr";
      nextP = "Maghrib";
      nextTime = maghrib;
    } else if (nowMins >= maghrib && nowMins < isha) {
      currentP = "Maghrib";
      nextP = "Isha";
      nextTime = isha;
    } else if (nowMins >= isha) {
      currentP = "Isha";
      nextP = "Fajr";
      nextTime = fajr + 24 * 60;
    } else {
      currentP = "Isha";
      nextP = "Fajr";
      nextTime = fajr;
    }

    // Time Maths
    const diffMins = nextTime - nowMins - 1;
    const h = Math.floor(diffMins / 60);
    const m = diffMins % 60;
    const s = 60 - nowSecs;

    // Calculate Window Start
    let startTime = 0;
    if (currentP === "Fajr") startTime = fajr;
    else if (currentP === "Ishraq") startTime = sunrise;
    else if (currentP === "Dhuhr") startTime = dhuhr;
    else if (currentP === "Asr") startTime = asr;
    else if (currentP === "Maghrib") startTime = maghrib;
    else if (currentP === "Isha") startTime = isha;
    else startTime = isha - 24 * 60;

    const totalWindowMins = nextTime - startTime;
    const elapsedMins = nowMins - startTime;
    const progressPct = Math.min(
      100,
      Math.max(0, (elapsedMins / totalWindowMins) * 100),
    );

    const elapsedH = Math.floor(elapsedMins / 60);
    const elapsedM = Math.floor(elapsedMins % 60);

    setStatus({
      status: "active",
      currentPrayer: currentP,
      nextPrayer: nextP,
      timeLeft: `${h}h ${m}m ${s}s`,
      progress: progressPct,
      isForbidden,
      message: isForbidden ? forbiddenMsg : `Time Remaining for ${currentP}`,
      totalWindow: `${Math.floor(totalWindowMins / 60)}h ${totalWindowMins % 60}m`,
      elapsed: `${elapsedH}h ${elapsedM}m`,
    });
  };

  const WeatherIcon = ({ code }: { code: number }) => {
    if (code <= 1) return <Sun className="w-8 h-8 text-yellow-400" />;
    if (code <= 3) return <CloudSun className="w-8 h-8 text-gray-400" />;
    if (code <= 60) return <Cloud className="w-8 h-8 text-gray-500" />;
    return <CloudRain className="w-8 h-8 text-blue-400" />;
  };

  return (
    <div>
      <Header></Header>
      <div className="min-h-screen  text-white font-sans selection:bg-emerald-500/30 pb-20">
        {/* --- TOP BAR: Global Status --- */}
        <div className=" border-b border-white/5 sticky top-0 z-20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
            {/* Date Display */}
            <div className="flex flex-col text-xs md:text-sm">
              <span className="text-emerald-400 font-bold">
                {currentTime ? getBanglaDate(currentTime) : "Loading..."}
              </span>
              <span className="text-white/60 font-mono flex gap-2">
                <span>
                  {hijri
                    ? `${hijri.day} ${hijri.month.en}, ${hijri.year} AH`
                    : "..."}
                </span>
                <span className="text-white/20">|</span>
                <span>
                  {currentTime
                    ? currentTime.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "..."}
                </span>
              </span>
            </div>

            {/* Weather Widget */}
            {weather && (
              <div className="flex items-center gap-4 bg-black/20 px-4 py-2 rounded-full border border-white/5">
                <WeatherIcon code={weather.code} />
                <div className="flex flex-col leading-none">
                  <span className="text-xl font-bold">{weather.temp}°C</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider flex gap-2">
                    <span className="flex items-center gap-1">
                      <Wind className="w-3 h-3" /> {weather.wind}km/h
                    </span>
                    <span className="flex items-center gap-1">
                      <Droplets className="w-3 h-3" /> {weather.humidity}%
                    </span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          {/* --- HERO SECTION: The "Orb" & Forbidden Logic --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Centerpiece: Time Engine */}
            <div className="lg:col-span-8 relative">
              <div
                className={`relative rounded-3xl p-8 border overflow-hidden transition-colors duration-500 min-h-[450px] flex flex-col items-center justify-center ${
                  status.isForbidden
                    ? "bg-red-950/20 border-red-500/30"
                    : "bg-emerald-950/10 border-emerald-500/20"
                }`}
              >
                {/* Decorative Islamic Pattern Overlay (CSS only) */}
                <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />

                {/* Main Circular Progress */}
                <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
                  {/* Background Circle */}
                  <svg className="w-full h-full -rotate-90 drop-shadow-2xl">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-white/5"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="40%"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="15"
                      className="text-black/30"
                    />
                    {/* Active Progress */}
                    <motion.circle
                      cx="50%"
                      cy="50%"
                      r="40%"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="15"
                      className={`${status.isForbidden ? "text-red-500" : "text-emerald-500"} drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]`}
                      strokeDasharray="251.2" // approx 2*pi*40
                      strokeDashoffset={251.2 - (251.2 * status.progress) / 100}
                      strokeLinecap="round"
                      initial={{ strokeDashoffset: 251.2 }}
                      animate={{
                        strokeDashoffset:
                          251.2 - (251.2 * status.progress) / 100,
                      }}
                      transition={{ duration: 1 }}
                    />
                  </svg>

                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
                    {status.isForbidden && (
                      <div className="flex items-center gap-1 text-red-400 font-bold uppercase tracking-widest text-xs mb-2 animate-pulse">
                        <AlertTriangle className="w-4 h-4" /> Forbidden Time
                      </div>
                    )}
                    <div className="text-sm text-white/50 uppercase tracking-widest mb-1">
                      {status.isForbidden ? status.message : "Next Prayer In"}
                    </div>
                    <div
                      className={`text-5xl md:text-7xl font-black font-mono tracking-tighter ${status.isForbidden ? "text-red-100" : "text-white"}`}
                    >
                      {status.timeLeft}
                    </div>
                    <div className="mt-4 text-emerald-400 font-medium text-lg flex items-center gap-2">
                      {status.nextPrayer}{" "}
                      <span className="text-white/30 text-xs">starts at</span>{" "}
                      {timings
                        ? to12h(
                            timings[
                              status.nextPrayer === "Sunrise"
                                ? "Sunrise"
                                : status.nextPrayer
                            ],
                          )
                        : "--:--"}
                    </div>
                  </div>
                </div>

                {/* Stats Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent flex justify-between text-xs md:text-sm font-mono text-white/60">
                  <div>
                    <span className="block text-white/30 uppercase text-[10px]">
                      Elapsed
                    </span>
                    {status.elapsed}
                  </div>
                  <div className="text-center">
                    <span className="block text-white/30 uppercase text-[10px]">
                      Current Window
                    </span>
                    <span className="text-emerald-400 font-bold">
                      {status.currentPrayer}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-white/30 uppercase text-[10px]">
                      Total Duration
                    </span>
                    {status.totalWindow}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar: Search & Holidays */}
            <div className="lg:col-span-4 space-y-6">
              {/* Location Search */}
              <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl">
                <h3 className="text-xs font-bold uppercase text-muted-foreground mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Location
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    fetchPrayerData();
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-colors"
                    placeholder="Enter city..."
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-lg transition-colors"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </form>
                <div className="mt-4 flex items-center justify-between text-sm text-white/80">
                  <span>{city}</span>
                  <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                    Active
                  </span>
                </div>
              </div>

              {/* Holidays List */}
              <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl flex-1">
                <h3 className="text-xs font-bold uppercase text-muted-foreground mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Upcoming Holidays
                </h3>
                <div className="space-y-4">
                  {holidays.length > 0 ? (
                    holidays.map((h, i) => (
                      <div key={i} className="flex gap-4 items-start group">
                        <div className="flex-shrink-0 w-12 text-center bg-white/5 rounded-lg p-1 border border-white/5 group-hover:border-emerald-500/30 transition-colors">
                          <span className="block text-xs text-white/40 uppercase">
                            {new Date(h.date.iso).toLocaleString("default", {
                              month: "short",
                            })}
                          </span>
                          <span className="block text-lg font-bold text-white">
                            {new Date(h.date.iso).getDate()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                            {h.name}
                          </div>
                          <div className="text-xs text-white/40">
                            {h.type || "Islamic"} Holiday
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-white/30 text-sm italic py-4 text-center">
                      No upcoming holidays found
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* --- PRAYER GRID --- */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sun className="text-emerald-500 w-5 h-5" /> Prayer Schedule
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {timings &&
                [
                  {
                    name: "Tahajjud",
                    time: "03:45",
                    icon: MoonStar,
                    color: "text-indigo-400",
                  }, // Simple approximation
                  {
                    name: "Fajr",
                    time: timings.Fajr,
                    icon: Sunrise,
                    color: "text-cyan-400",
                  },
                  {
                    name: "Ishraq",
                    time: addMinutes(timings.Sunrise, 15),
                    icon: Sun,
                    color: "text-yellow-400",
                  },
                  {
                    name: "Dhuhr",
                    time: timings.Dhuhr,
                    icon: Sun,
                    color: "text-orange-400",
                  },
                  {
                    name: "Asr",
                    time: timings.Asr,
                    icon: Sun,
                    color: "text-orange-500",
                  },
                  {
                    name: "Maghrib",
                    time: timings.Maghrib,
                    icon: Sunset,
                    color: "text-red-400",
                  },
                  {
                    name: "Isha",
                    time: timings.Isha,
                    icon: MoonStar,
                    color: "text-blue-400",
                  },
                  {
                    name: "Midnight",
                    time: timings.Midnight,
                    icon: MoonStar,
                    color: "text-slate-400",
                  },
                ].map((p, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border border-white/5 bg-zinc-900/50 flex items-center justify-between group hover:border-emerald-500/30 transition-all ${status.currentPrayer === p.name ? "ring-1 ring-emerald-500 bg-emerald-500/5" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-black/40 ${p.color}`}>
                        <p.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {p.name}
                        </div>
                        {status.currentPrayer === p.name && (
                          <div className="text-[10px] text-emerald-500 uppercase font-bold tracking-wider">
                            Active Now
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xl font-mono font-bold text-white/80">
                      {to12h(p.time)}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

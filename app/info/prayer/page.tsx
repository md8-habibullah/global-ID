"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  Moon,
  Sunrise,
  Sunset,
  ChevronDown,
} from "lucide-react";

export default function PrayerPage() {
  const [mounted, setMounted] = useState(false);
  const [times, setTimes] = useState<any>(null);
  const [next, setNext] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [progress, setProgress] = useState(0);
  const [city, setCity] = useState("Dhaka");
  const [dateInfo, setDateInfo] = useState<any>({});

  // Bangladesh Cities
  const cities = [
    "Dhaka",
    "Chittagong",
    "Sylhet",
    "Rajshahi",
    "Khulna",
    "Barisal",
    "Rangpur",
    "Mymensingh",
  ];

  // Fetch Prayer Times
  const fetchPrayerTimes = async () => {
    try {
      // Method 1 = Karachi (Standard for BD), School 1 = Hanafi
      const res = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Bangladesh&method=1&school=1`,
      );
      const data = await res.json();
      if (data.data) {
        setTimes(data.data.timings);
        setDateInfo(data.data.date);
      }
    } catch (e) {
      console.error("Prayer fetch failed");
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchPrayerTimes();
  }, [city]);

  // Timer Logic
  useEffect(() => {
    if (!times) return;

    const timer = setInterval(() => {
      const now = new Date();
      const timeStr = (t: string) => {
        const [h, m] = t.split(":").map(Number);
        const d = new Date();
        d.setHours(h, m, 0, 0);
        return d;
      };

      const prayerList = [
        { name: "Fajr", time: timeStr(times.Fajr) },
        { name: "Sunrise", time: timeStr(times.Sunrise) },
        { name: "Dhuhr", time: timeStr(times.Dhuhr) },
        { name: "Asr", time: timeStr(times.Asr) },
        { name: "Maghrib", time: timeStr(times.Maghrib) },
        { name: "Isha", time: timeStr(times.Isha) },
      ];

      // Find next prayer
      let nextP = null;
      let currP = null;

      for (let i = 0; i < prayerList.length; i++) {
        if (prayerList[i].time > now) {
          nextP = prayerList[i];
          currP = i > 0 ? prayerList[i - 1] : prayerList[prayerList.length - 1]; // Previous day Isha if Fajr is next
          break;
        }
      }

      // If no next prayer found today, it's Fajr tomorrow
      if (!nextP) {
        nextP = {
          name: "Fajr",
          time: new Date(prayerList[0].time.getTime() + 86400000),
        };
        currP = prayerList[prayerList.length - 1];
      }

      setNext(nextP);

      // Countdown
      const diff = nextP.time.getTime() - now.getTime();
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);

      // Progress Circle (Total Waqt Duration vs Time Passed)
      if (currP) {
        let startTime = currP.time.getTime();
        // Handle edge case where current prayer was yesterday (e.g. after midnight before Fajr)
        if (startTime > now.getTime()) startTime -= 86400000;

        const totalDuration = nextP.time.getTime() - startTime;
        const elapsed = now.getTime() - startTime;
        const pct = (elapsed / totalDuration) * 100;
        setProgress(Math.min(100, Math.max(0, pct)));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [times]);

  // Bengali Date Formatter
  const getBengaliDate = () => {
    if (!mounted) return "";
    try {
      return new Intl.DateTimeFormat("bn-BD-u-ca-beng", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date());
    } catch (e) {
      return "Bangla Date Unavailable";
    }
  };

  if (!mounted) return null;

  // Circle Config
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* HEADER: Location & Date */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Moon className="text-primary fill-primary/20" /> Prayer{" "}
            <span className="text-muted-foreground font-normal">
              Intelligence
            </span>
          </h2>
          <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm font-mono">
            <Calendar className="w-4 h-4" />
            <span>
              {dateInfo?.hijri?.day} {dateInfo?.hijri?.month?.en}{" "}
              {dateInfo?.hijri?.year} • {getBengaliDate()}
            </span>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="pl-10 pr-10 py-2 bg-white/5 border border-white/10 rounded-lg appearance-none cursor-pointer hover:bg-white/10 transition-colors outline-none focus:border-primary text-sm font-bold uppercase tracking-wider"
          >
            {cities.map((c) => (
              <option key={c} value={c} className="bg-zinc-950">
                {c}, BD
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none opacity-50">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT: VISUAL TIMER */}
        <div className="info-card flex flex-col items-center justify-center py-12 relative overflow-hidden min-h-[400px]">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

          <div className="relative">
            {/* SVG Progress Circle */}
            <svg width="300" height="300" className="-rotate-90">
              {/* Track */}
              <circle
                cx="150"
                cy="150"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                className="text-white/5"
                fill="none"
              />
              {/* Progress */}
              <circle
                cx="150"
                cy="150"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                className="text-primary transition-all duration-1000 ease-linear"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="text-xs uppercase font-bold text-muted-foreground tracking-widest mb-2">
                Upcoming
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-1">
                {next?.name || "Loading..."}
              </div>
              <div className="text-xl font-mono text-primary font-bold tabular-nums">
                -{timeLeft}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center space-y-1">
            <div className="text-xs text-muted-foreground uppercase">
              Next Prayer Time
            </div>
            <div className="text-xl font-bold">
              {next?.time?.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: PRAYER LIST & HOLIDAYS */}
        <div className="space-y-6">
          {/* Times List */}
          <div className="info-card p-0 overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-white/5 font-bold flex justify-between items-center">
              <span>Today's Schedule</span>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="divide-y divide-white/5">
              {times &&
                ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"].map(
                  (name) => {
                    const isNext = next?.name === name;
                    return (
                      <div
                        key={name}
                        className={`flex justify-between items-center p-4 transition-colors ${isNext ? "bg-primary/10" : "hover:bg-white/5"}`}
                      >
                        <div className="flex items-center gap-3">
                          {name === "Sunrise" ? (
                            <Sunrise className="w-4 h-4 text-orange-400" />
                          ) : name === "Maghrib" ? (
                            <Sunset className="w-4 h-4 text-orange-500" />
                          ) : (
                            <div
                              className={`w-2 h-2 rounded-full ${isNext ? "bg-primary animate-pulse" : "bg-white/20"}`}
                            />
                          )}
                          <span
                            className={`font-medium ${isNext ? "text-primary" : ""}`}
                          >
                            {name}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-muted-foreground">
                          {new Date(
                            `2000-01-01 ${times[name]}`,
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    );
                  },
                )}
            </div>
          </div>

          {/* Upcoming Holidays (Mock Data or fetched if available) */}
          <div className="info-card p-0 overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-white/5 font-bold flex justify-between items-center">
              <span>Upcoming Holidays</span>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="p-4 space-y-4">
              {/* Example Static Holidays - You can dynamic this later */}
              <HolidayRow
                date="27 Ramadan"
                name="Laylat al-Qadr"
                timeLeft="~2 Months"
              />
              <HolidayRow
                date="1 Shawwal"
                name="Eid al-Fitr"
                timeLeft="~2.5 Months"
              />
              <HolidayRow
                date="10 Dhul Hijjah"
                name="Eid al-Adha"
                timeLeft="~5 Months"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const HolidayRow = ({ date, name, timeLeft }: any) => (
  <div className="flex justify-between items-center">
    <div>
      <div className="font-bold text-sm">{name}</div>
      <div className="text-xs text-muted-foreground">{date}</div>
    </div>
    <div className="text-xs font-mono bg-white/10 px-2 py-1 rounded text-primary/80">
      {timeLeft}
    </div>
  </div>
);

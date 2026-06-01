"use client";

import { useState, useEffect, useMemo } from "react";
import {
  MoonStar,
  MapPin,
  Sunrise,
  Sunset,
  Sun,
  CloudSun,
  AlertTriangle,
  ShieldAlert,
  Wifi,
  WifiOff,
  Coffee,
  Utensils,
  Clock,
  Wind,
  Droplets,
  Thermometer,
} from "lucide-react";

// --- ACCURATE COORDINATES FOR WEATHER ---
const DISTRICT_DATA: Record<string, { lat: number; lon: number }> = {
  Dhaka: { lat: 23.8103, lon: 90.4125 },
  Chittagong: { lat: 22.3569, lon: 91.7832 },
  Khulna: { lat: 22.8456, lon: 89.5403 },
  Rajshahi: { lat: 24.3636, lon: 88.6241 },
  Sylhet: { lat: 24.8949, lon: 91.8687 },
  Barisal: { lat: 22.701, lon: 90.3535 },
  Rangpur: { lat: 25.7439, lon: 89.2752 },
  Mymensingh: { lat: 24.7471, lon: 90.4203 },
  Comilla: { lat: 23.4607, lon: 91.1809 },
  Gazipur: { lat: 24.0023, lon: 90.4264 },
  Narayanganj: { lat: 23.6238, lon: 90.5 },
  Bogra: { lat: 24.8481, lon: 89.373 },
  Jessore: { lat: 23.1634, lon: 89.2182 },
  "Cox's Bazar": { lat: 21.4272, lon: 92.0058 },
  Feni: { lat: 23.0186, lon: 91.3966 },
  Faridpur: { lat: 23.6071, lon: 89.8429 },
  Dinajpur: { lat: 25.6217, lon: 88.6355 },
  Pabna: { lat: 24.004, lon: 89.25 },
  Tangail: { lat: 24.2513, lon: 89.9167 },
  Kushtia: { lat: 23.9013, lon: 89.1204 },
  Noakhali: { lat: 22.8724, lon: 91.0973 },
  Gopalganj: { lat: 23.0051, lon: 89.8267 },
  Kishoreganj: { lat: 24.4449, lon: 90.7765 },
  Jamalpur: { lat: 24.9375, lon: 89.9378 },
  Sherpur: { lat: 25.0205, lon: 90.0153 },
  Netrokona: { lat: 24.8709, lon: 90.7279 },
  Munshiganj: { lat: 23.5422, lon: 90.5305 },
  Manikganj: { lat: 23.8617, lon: 90.0003 },
  Narsingdi: { lat: 23.9229, lon: 90.7177 },
  Bagerhat: { lat: 22.6516, lon: 89.7859 },
  Satkhira: { lat: 22.7185, lon: 89.0705 },
  Bhola: { lat: 22.6859, lon: 90.6482 },
  Patuakhali: { lat: 22.3596, lon: 90.3299 },
};

const DISTRICT_NAMES = Object.keys(DISTRICT_DATA).sort();

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
}
interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  code: number;
  desc: string;
}

// --- Utilities ---
const to12h = (time: string | undefined) => {
  if (!time) return "--:--";
  const [h, m] = time.split(":").map(Number);
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

const parseTime = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const adjustTime = (time: string, mins: number) => {
  const [h, m] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m + mins);
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
};

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
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const banglaYear =
    month < 3 || (month === 3 && day < 14) ? year - 594 : year - 593;
  let mIndex = (month + 10) % 12;
  if (day >= 15) mIndex = (mIndex + 1) % 12;
  if (month === 3 && day >= 14) mIndex = 4;
  const convertDigit = (n: number) =>
    n.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);
  return `${weekDays[date.getDay()]}, ${convertDigit(day)} ${months[mIndex]} ${convertDigit(banglaYear)}`;
};

const getWeatherDesc = (code: number) => {
  if (code === 0) return "Clear Sky";
  if (code <= 3) return "Partly Cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 67) return "Rainy";
  if (code <= 77) return "Snow/Hail";
  if (code <= 82) return "Heavy Rain";
  if (code <= 99) return "Thunderstorm";
  return "Unknown";
};

// --- Main Component ---
export default function PrayerDashboard() {
  const [now, setNow] = useState<Date | null>(null);
  const [timeOffset, setTimeOffset] = useState(0);
  const [isSynced, setIsSynced] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Dhaka");
  // Default Coords
  const [coords, setCoords] = useState(DISTRICT_DATA["Dhaka"]);

  const [timings, setTimings] = useState<PrayerTimings | null>(null);
  const [hijri, setHijri] = useState<HijriDate | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // Time Sync
  useEffect(() => {
    const frame = requestAnimationFrame(() => setNow(new Date()));
    const sync = async () => {
      try {
        const res = await fetch(
          "https://worldtimeapi.org/api/timezone/Asia/Dhaka",
        );
        const data = await res.json();
        const offset = new Date(data.datetime).getTime() - Date.now();
        setTimeOffset(offset);
        setIsSynced(true);
      } catch (e) {
        setIsSynced(false);
      }
    };
    sync();
    return () => cancelAnimationFrame(frame);
  }, []);

  // Clock Tick
  useEffect(() => {
    const tick = () => setNow(new Date(Date.now() + timeOffset));
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [timeOffset]);

  // Handle Location Change (INSTANT UPDATE)
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value;
    setSelectedCity(city);
    // Update Coords immediately from local data
    if (DISTRICT_DATA[city]) {
      setCoords(DISTRICT_DATA[city]);
    }
  };

  // Data Fetch (Prayer)
  useEffect(() => {
    const fetchPrayer = async () => {
      try {
        const d = new Date();
        // Use exact lat/lon for precision prayer times
        const res = await fetch(
          `https://api.aladhan.com/v1/timings/${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}?latitude=${coords.lat}&longitude=${coords.lon}&method=1&school=1`,
        );
        const json = await res.json();
        if (json.data) {
          setTimings(json.data.timings);
          setHijri(json.data.date.hijri);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchPrayer();
  }, [coords]); // Re-run when coords change

  // Weather Fetch (Detailed)
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`,
        );
        const data = await res.json();
        if (data.current) {
          setWeather({
            temp: Math.round(data.current.temperature_2m),
            feelsLike: Math.round(data.current.apparent_temperature),
            humidity: data.current.relative_humidity_2m,
            windSpeed: data.current.wind_speed_10m,
            code: data.current.weather_code,
            desc: getWeatherDesc(data.current.weather_code),
          });
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchWeather();
  }, [coords]); // Re-run when coords change

  const { status, displayEvents } = useMemo(() => {
    if (!timings || !now) return { status: null, displayEvents: [] };

    const events = [
      {
        id: "tahajjud",
        name: "Tahajjud",
        time: adjustTime(timings.Fajr, -90),
        icon: MoonStar,
        type: "optional",
      },
      {
        id: "sahur",
        name: "Sahur Ends",
        time: timings.Fajr,
        icon: Coffee,
        type: "alert",
      },
      {
        id: "fajr",
        name: "Fajr",
        time: timings.Fajr,
        icon: Sunrise,
        type: "fard",
      },
      {
        id: "sunrise",
        name: "Sunrise",
        time: timings.Sunrise,
        icon: Sun,
        type: "forbidden",
      },
      {
        id: "ishraq",
        name: "Ishraq",
        time: adjustTime(timings.Sunrise, 15),
        icon: Sun,
        type: "optional",
      },
      {
        id: "zawaal",
        name: "Zawaal",
        time: adjustTime(timings.Dhuhr, -10),
        icon: ShieldAlert,
        type: "forbidden",
      },
      {
        id: "dhuhr",
        name: "Dhuhr",
        time: timings.Dhuhr,
        icon: Sun,
        type: "fard",
      },
      { id: "asr", name: "Asr", time: timings.Asr, icon: Sun, type: "fard" },
      {
        id: "sunset",
        name: "Sunset",
        time: timings.Maghrib,
        icon: Sunset,
        type: "forbidden",
      },
      {
        id: "maghrib",
        name: "Maghrib",
        time: timings.Maghrib,
        icon: Utensils,
        type: "fard",
      },
      {
        id: "isha",
        name: "Isha",
        time: timings.Isha,
        icon: MoonStar,
        type: "fard",
      },
      {
        id: "midnight",
        name: "Midnight",
        time: timings.Midnight,
        icon: Clock,
        type: "optional",
      },
    ];

    const nowMins = now.getHours() * 60 + now.getMinutes();
    let activeIndex = events.length - 1;
    for (let i = 0; i < events.length - 1; i++) {
      if (
        nowMins >= parseTime(events[i].time) &&
        nowMins < parseTime(events[i + 1].time)
      ) {
        activeIndex = i;
        break;
      }
    }
    if (nowMins < parseTime(events[0].time)) activeIndex = events.length - 1;

    const activeEvent = events[activeIndex];
    const nextEvent = events[(activeIndex + 1) % events.length];

    let nextMins = parseTime(nextEvent.time);
    if (nextMins < nowMins) nextMins += 1440;

    const diff = nextMins * 60 - (nowMins * 60 + now.getSeconds());
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;

    const startMins = parseTime(activeEvent.time);
    let total = nextMins - startMins;
    if (total < 0) total += 1440;
    const elapsed =
      (nowMins < startMins ? nowMins + 1440 : nowMins) - startMins;
    const progress = Math.min(100, Math.max(0, (elapsed / total) * 100));

    const count = events.length;
    const indices = [
      (activeIndex - 2 + count) % count,
      (activeIndex - 1 + count) % count,
      activeIndex,
      (activeIndex + 1) % count,
      (activeIndex + 2) % count,
      (activeIndex + 3) % count,
    ];

    return {
      status: {
        ...activeEvent,
        timeLeft: `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`,
        progress,
        nextName: nextEvent.name,
        nextTime: nextEvent.time,
        isForbidden: activeEvent.type === "forbidden",
      },
      displayEvents: indices.map((i) => ({
        ...events[i],
        isRef: i === activeIndex,
      })),
    };
  }, [now, timings]);

  if (!now)
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        Initializing Clock...
      </div>
    );

  return (
    // MAIN CONTAINER: Fixed Height for Desktop [650px]
    <div className="w-full h-full lg:h-[650px] flex flex-col lg:flex-row bg-background/50 rounded-3xl overflow-hidden border border-border/10 shadow-sm cursor-target">
      {/* === LEFT: DASHBOARD (45%) === */}
      <div className="lg:w-[45%] relative flex flex-col items-center justify-center p-6 bg-gradient-to-br from-secondary/5 to-transparent border-b lg:border-b-0 lg:border-r border-border/10 cursor-target">
        {/* TOP HEADER: DATES */}
        <div className="w-full flex justify-between items-start absolute top-4 md:top-8 px-4 md:px-8 cursor-target">
          <div className="flex flex-col">
            <h2 className="text-xl md:text-4xl font-black tracking-tighter text-foreground cursor-target">
              {now.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
              })}
            </h2>
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 mt-1 cursor-target">
              <span className="text-[10px] md:text-base text-muted-foreground font-bangla font-medium">
                {getBanglaDate(now)}
              </span>
              <span className="hidden md:inline text-border/40">|</span>
              <span className="text-[10px] md:text-base text-muted-foreground font-mono">
                {hijri ? `${hijri.day} ${hijri.month.en} ${hijri.year}` : "..."}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-secondary/20 px-2 py-1 rounded text-[10px] md:text-xs font-bold uppercase tracking-wider text-muted-foreground cursor-target">
            {isSynced ? (
              <Wifi className="w-3 h-3 md:w-4 md:h-4 text-emerald-500" />
            ) : (
              <WifiOff className="w-3 h-3 md:w-4 md:h-4 text-red-500" />
            )}
            {isSynced ? "LIVE" : "SYS"}
          </div>
        </div>

        {/* TIMER CIRCLE */}
        <div className="relative w-56 h-56 md:w-80 md:h-80 flex items-center justify-center mt-6 md:mt-12 cursor-target">
          <div className="absolute inset-0 rounded-full border-[8px] md:border-[12px] border-secondary/10" />
          <div
            className="absolute inset-0 rounded-full transition-all duration-1000 ease-linear"
            style={{
              background: `conic-gradient(${status?.isForbidden ? "#ef4444" : "#10b981"} ${status?.progress || 0}%, transparent 0)`,
              maskImage: "radial-gradient(transparent 68%, black 69%)",
              WebkitMaskImage: "radial-gradient(transparent 68%, black 69%)",
            }}
          />
          <div className="flex flex-col items-center z-10 text-center cursor-target">
            <span
              className={`text-[9px] md:text-xs font-bold uppercase tracking-widest mb-1 md:mb-3 ${status?.isForbidden ? "text-red-500" : "text-emerald-500"}`}
            >
              {status?.isForbidden ? "FORBIDDEN" : "REMAINING"}
            </span>
            <span className="text-4xl md:text-6xl font-mono font-black tracking-tighter tabular-nums text-foreground">
              {status?.timeLeft}
            </span>
            {status && (
              <div className="mt-2 md:mt-4 flex items-center gap-2 bg-secondary/20 px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-border/5">
                <span className="text-[9px] md:text-xs uppercase text-muted-foreground font-bold">
                  Next:
                </span>
                <span className="text-[10px] md:text-sm font-bold text-foreground">
                  {status.nextName}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM CONTROLS (EXPANDED WEATHER) */}
        <div className="absolute bottom-4 md:bottom-8 left-0 right-0 flex flex-col items-center gap-2 cursor-target">
          {/* Location Selector */}
          <div className="cursor-target flex items-center gap-2 bg-secondary/10 md:backdrop-blur-sm px-1 py-1 rounded-full border border-border/10">
            <select
              value={selectedCity}
              onChange={handleCityChange}
              className="bg-transparent text-[10px] md:text-xs pl-3 pr-1 py-1 md:py-1.5 rounded-full appearance-none focus:outline-none cursor-pointer font-bold uppercase"
            >
              {DISTRICT_NAMES.map((d) => (
                <option key={d} value={d} className="bg-background">
                  {d}
                </option>
              ))}
            </select>
            <MapPin className="w-3 h-3 md:w-4 md:h-4 text-emerald-500 mr-2" />
          </div>

          {/* Detailed Weather Stats */}
          {weather && (
            <div className="cursor-target flex items-center gap-3 md:gap-4 text-[10px] md:text-xs font-bold text-muted-foreground bg-secondary/5 px-4 py-2 rounded-xl border border-border/5">
              <div className="flex items-center gap-1.5">
                <CloudSun className="w-3 h-3 md:w-4 md:h-4 text-yellow-500" />
                <span className="text-foreground">{weather.temp}°</span>
                <span className="font-normal opacity-70">({weather.desc})</span>
              </div>
              <div className="w-px h-3 bg-border/20" />
              <div className="flex items-center gap-1.5">
                <Thermometer className="w-3 h-3 md:w-4 md:h-4 text-orange-400" />
                <span>Feel {weather.feelsLike}°</span>
              </div>
              <div className="w-px h-3 bg-border/20 hidden md:block" />
              <div className="hidden md:flex items-center gap-1.5">
                <Droplets className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
                <span>{weather.humidity}%</span>
              </div>
              <div className="hidden md:flex items-center gap-1.5">
                <Wind className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                <span>{weather.windSpeed}km</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* === RIGHT: ROTARY SCHEDULE (55%) === */}
      <div className="cursor-target lg:w-[55%] relative flex flex-col justify-center bg-card/30">
        <div className="w-full cursor-target max-w-sm md:max-w-md mx-auto px-4 space-y-2 py-4">
          {displayEvents.map((event, i) => {
            const isCenter = event.isRef;
            return (
              <div
                key={`${event.id}-${i}`}
                className={`cursor-target flex items-center justify-between px-4 md:px-6 rounded-xl border border-transparent transition-all duration-500 ${isCenter ? "bg-emerald-500/10 border-emerald-500/20 py-3 md:py-5 scale-100 opacity-100 shadow-md" : "py-1.5 md:py-3 scale-95 opacity-50 grayscale"} ${event.type === "forbidden" && isCenter ? "bg-red-500/10 border-red-500/20" : ""}`}
              >
                <div className="flex cursor-target items-center gap-3 md:gap-5">
                  <div
                    className={`p-1.5 md:p-3 rounded-lg ${isCenter ? (event.type === "forbidden" ? "bg-red-500 text-white" : "bg-emerald-500 text-white") : "bg-secondary/20"}`}
                  >
                    <event.icon className="w-3.5 h-3.5 md:w-6 md:h-6" />
                  </div>
                  <span
                    className={`text-xs md:text-lg font-bold uppercase ${isCenter ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {event.name}
                  </span>
                </div>
                <span
                  className={`font-mono font-bold ${isCenter ? "text-xl md:text-3xl text-foreground" : "text-sm md:text-lg text-muted-foreground"}`}
                >
                  {to12h(event.time)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

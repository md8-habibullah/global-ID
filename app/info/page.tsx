"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Wifi,
  Cpu,
  Monitor,
  Battery,
  Globe,
  Shield,
  Smartphone,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import "./style.css";

export default function DeviceInfoPage() {
  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [ping, setPing] = useState<number | null>(null);

  // Data State
  const [sysData, setSysData] = useState<any>(null);
  const [netData, setNetData] = useState<any>(null);
  const [tzMatch, setTzMatch] = useState<boolean | null>(null);

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Main Data Fetcher
  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    setLoading(true);

    // 1. Run Ping Test (Real Latency)
    const start = performance.now();
    try {
      // We fetch a tiny resource from the current origin to test RTT
      await fetch("/favicon.ico", { method: "HEAD", cache: "no-store" });
      setPing(Math.round(performance.now() - start));
    } catch (e) {
      setPing(null); // Failed to ping
    }

    // 2. Browser APIs
    const nav = navigator as any;
    const connection =
      nav.connection || nav.mozConnection || nav.webkitConnection;

    // GPU Fingerprint
    let gpu = "Integrated / Unknown";
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl");
      const debugInfo = gl?.getExtension("WEBGL_debug_renderer_info");
      if (gl && debugInfo) {
        gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      }
    } catch (e) {}

    // Battery
    let battery = { level: "N/A", status: "N/A" };
    if (nav.getBattery) {
      try {
        const b = await nav.getBattery();
        battery = {
          level: `${Math.round(b.level * 100)}%`,
          status: b.charging ? "Charging" : "Discharging",
        };
      } catch (e) {}
    }

    setSysData({
      os: {
        platform: nav.platform,
        userAgent: nav.userAgent,
        cores: nav.hardwareConcurrency || 2,
        memory: nav.deviceMemory ? `~${nav.deviceMemory} GB` : "Unknown",
        gpu: gpu,
      },
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        depth: window.screen.colorDepth,
        pixelRatio: window.devicePixelRatio,
        touch: nav.maxTouchPoints > 0 ? "Yes" : "No",
        orientation: window.screen.orientation?.type || "Unknown",
      },
      netAPI: {
        type: connection?.effectiveType?.toUpperCase() || "WIFI/LAN",
        downlink: connection?.downlink
          ? `~${connection.downlink} Mbps`
          : "Unknown",
      },
      battery: battery,
    });

    // 3. IP & Security Analysis
    try {
      const res = await fetch("https://ipwho.is/");
      const ipJson = await res.json();
      setNetData(ipJson);

      // Timezone Match Logic
      if (ipJson.timezone?.id) {
        const systemTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTzMatch(systemTz === ipJson.timezone.id);
      }
    } catch (e) {
      console.error("IP Analysis failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative font-sans">
      <div className="scan-overlay" />
      <Header />

      <main className="flex-1 px-4 py-12 md:px-8 max-w-7xl mx-auto w-full z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">
              System <span className="text-primary">Intelligence</span>
            </h1>
            <p className="text-muted-foreground max-w-lg">
              Advanced diagnostics, network latency triangulation, and
              environment fingerprinting.
            </p>
          </div>

          <div className="info-card flex items-center gap-4 py-3 px-6 cursor-target border-primary/20">
            <Clock className="w-5 h-5 text-primary animate-pulse" />
            <div className="text-right">
              <div className="text-xs text-muted-foreground font-mono">
                LOCAL SYSTEM TIME
              </div>
              <div className="text-xl font-mono font-bold">
                {format(time, "HH:mm:ss")}
              </div>
            </div>
          </div>
        </div>

        {/* --- GRID LAYOUT --- */}
        <div className="info-grid">
          {/* 1. Network Identity & Latency */}
          <div className="info-card col-span-1 md:col-span-8 cursor-target">
            <div className="flex items-center gap-3 mb-6 border-b border-border/20 pb-4">
              <Globe className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-bold">Network & Latency</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <InfoItem
                label="Public IP"
                value={netData?.ip}
                loading={loading}
                highlight
              />
              <InfoItem
                label="ISP"
                value={netData?.connection?.isp}
                loading={loading}
              />
              <InfoItem
                label="Real Latency (Ping)"
                value={ping ? `${ping} ms` : loading ? "Pinging..." : "Timeout"}
                className={
                  ping && ping < 100 ? "text-green-500" : "text-yellow-500"
                }
              />

              <InfoItem
                label="Connection Type"
                value={sysData?.netAPI?.type}
                loading={loading}
              />
              <InfoItem
                label="Est. Bandwidth"
                value={sysData?.netAPI?.downlink}
                loading={loading}
              />
              <InfoItem
                label="Location"
                value={
                  netData ? `${netData.city}, ${netData.country_code}` : null
                }
                loading={loading}
              />
            </div>
          </div>

          {/* 2. Security Analysis */}
          <div className="info-card col-span-1 md:col-span-4 cursor-target border-l-4 border-l-primary/50">
            <div className="flex items-center gap-3 mb-6 border-b border-border/20 pb-4">
              <Shield className="w-5 h-5 text-red-400" />
              <h2 className="text-lg font-bold">Security Analysis</h2>
            </div>

            <div className="space-y-4">
              {/* VPN/Proxy/Tor Detection */}
              <SecurityRow
                label="VPN Tunnel"
                isDetected={netData?.security?.vpn}
                loading={loading}
              />
              <SecurityRow
                label="Proxy Server"
                isDetected={netData?.security?.proxy}
                loading={loading}
              />
              <SecurityRow
                label="Tor Exit Node"
                isDetected={netData?.security?.tor}
                loading={loading}
              />
              <SecurityRow
                label="Data Center IP"
                isDetected={netData?.security?.hosting}
                loading={loading}
              />

              {/* Timezone Intelligence */}
              <div className="pt-4 border-t border-border/10 mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    Location Consistency
                  </span>
                </div>
                {loading ? (
                  <span className="text-xs text-muted-foreground">
                    Analyzing...
                  </span>
                ) : tzMatch === false ? (
                  <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 p-2 rounded text-xs font-bold border border-yellow-500/20">
                    <AlertTriangle className="w-4 h-4" />
                    MISMATCH (System vs IP)
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-500 bg-green-500/10 p-2 rounded text-xs font-bold border border-green-500/20">
                    <CheckCircle className="w-4 h-4" />
                    VERIFIED (Consistent)
                  </div>
                )}
                {!loading && netData && (
                  <div className="text-[10px] text-muted-foreground mt-1 font-mono">
                    IP: {netData.timezone?.id} <br />
                    SYS: {Intl.DateTimeFormat().resolvedOptions().timeZone}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Hardware Core */}
          <div className="info-card col-span-1 md:col-span-6 cursor-target">
            <div className="flex items-center gap-3 mb-6 border-b border-border/20 pb-4">
              <Cpu className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">Hardware Core</h2>
            </div>
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <InfoItem
                label="OS Platform"
                value={sysData?.os?.platform}
                loading={loading}
              />
              <InfoItem
                label="CPU Threads"
                value={sysData?.os?.cores}
                loading={loading}
              />
              <InfoItem
                label="Memory (RAM)"
                value={sysData?.os?.memory}
                loading={loading}
              />
              <InfoItem
                label="GPU Renderer"
                value={sysData?.os?.gpu}
                loading={loading}
                className="col-span-2 text-xs font-mono opacity-80"
              />
            </div>
          </div>

          {/* 4. Display & Power */}
          <div className="info-card col-span-1 md:col-span-6 cursor-target">
            <div className="flex items-center gap-3 mb-6 border-b border-border/20 pb-4">
              <Monitor className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-bold">Display & Power</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <InfoItem
                label="Resolution"
                value={
                  sysData
                    ? `${sysData.screen.width} x ${sysData.screen.height}`
                    : null
                }
                loading={loading}
              />
              <InfoItem
                label="Color Depth"
                value={sysData ? `${sysData.screen.depth}-bit` : null}
                loading={loading}
              />
              <InfoItem
                label="Pixel Ratio"
                value={sysData?.screen?.pixelRatio}
                loading={loading}
              />

              <div className="col-span-2 flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5 mt-2">
                <Battery
                  className={
                    sysData?.battery?.status === "Charging"
                      ? "text-green-400"
                      : "text-yellow-400"
                  }
                />
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground">
                    Battery Status
                  </div>
                  {loading ? (
                    <span className="text-xs">Scanning...</span>
                  ) : (
                    <div className="font-mono font-bold text-sm">
                      {sysData?.battery?.level} • {sysData?.battery?.status}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 5. User Agent */}
          <div className="info-card col-span-1 md:col-span-12 cursor-target">
            <div className="flex items-center gap-3 mb-2">
              <Smartphone className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-bold text-muted-foreground uppercase">
                Fingerprint / User Agent
              </span>
            </div>
            <div className="font-mono text-xs text-primary/70 break-all bg-black/20 p-3 rounded border border-white/5 leading-relaxed">
              {sysData?.os?.userAgent || "Initializing..."}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// --- Reusable Logic Components ---

const InfoItem = ({ label, value, loading, highlight, className }: any) => (
  <div className="flex flex-col">
    <span className="data-label">{label}</span>
    {loading ? (
      <div className="h-5 w-24 bg-white/5 rounded animate-pulse mt-1" />
    ) : (
      <span
        className={`data-value ${highlight ? "text-primary" : ""} ${className}`}
      >
        {value || "Unknown"}
      </span>
    )}
  </div>
);

const SecurityRow = ({
  label,
  isDetected,
  loading,
}: {
  label: string;
  isDetected: boolean | undefined;
  loading: boolean;
}) => {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
      {loading ? (
        <span className="text-xs text-muted-foreground animate-pulse">
          Scanning...
        </span>
      ) : isDetected === true ? (
        <div className="flex items-center gap-1 text-red-500 bg-red-500/10 px-2 py-0.5 rounded text-[10px] font-bold border border-red-500/20">
          <AlertTriangle className="w-3 h-3" /> DETECTED
        </div>
      ) : isDetected === false ? (
        <div className="flex items-center gap-1 text-green-500/70 text-[10px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
          SAFE
        </div>
      ) : (
        <span className="text-xs text-muted-foreground">N/A</span>
      )}
    </div>
  );
};

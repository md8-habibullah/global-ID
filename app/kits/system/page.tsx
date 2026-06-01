"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Wifi,
  Cpu,
  Monitor,
  Globe,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export default function DeviceInfoPage() {
  // FIX: Initialize with null to prevent hydration mismatch
  const [time, setTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [ping, setPing] = useState<number | null>(null);

  // Data State
  const [sysData, setSysData] = useState<any>(null);
  const [netData, setNetData] = useState<any>(null);
  const [tzMatch, setTzMatch] = useState<boolean | null>(null);

  // Real-time clock
  useEffect(() => {
    // Set initial time only on client mount
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Main Data Fetcher
  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    setLoading(true);

    // 1. Run Ping Test
    const start = performance.now();
    try {
      await fetch("/favicon.ico", { method: "HEAD", cache: "no-store" });
      setPing(Math.round(performance.now() - start));
    } catch (e) {
      setPing(null);
    }

    // 2. Browser APIs
    const nav = navigator as any;
    const connection =
      nav.connection || nav.mozConnection || nav.webkitConnection;

    let gpu = "Integrated / Unknown";
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl");
      const debugInfo = gl?.getExtension("WEBGL_debug_renderer_info");
      if (gl && debugInfo) {
        gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      }
    } catch (e) { }

    let battery = { level: "N/A", status: "N/A" };
    if (nav.getBattery) {
      try {
        const b = await nav.getBattery();
        battery = {
          level: `${Math.round(b.level * 100)}%`,
          status: b.charging ? "Charging" : "Discharging",
        };
      } catch (e) { }
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

    // 3. IP & Security
    try {
      const res = await fetch("https://ipwho.is/");
      const ipJson = await res.json();

      if (ipJson.success === false) {
        setNetData({ failed: true, message: ipJson.message });
      } else {
        setNetData(ipJson);
        if (ipJson.timezone?.id) {
          const systemTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          setTzMatch(systemTz === ipJson.timezone.id);
        }
      }
    } catch (e) {
      console.error("IP Analysis failed");
      setNetData({ failed: true, message: "Network blocked or failed" });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 cursor-target">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-6 cursor-target">
        <div className="cursor-target">
          <h2 className="text-2xl font-bold">System Intelligence</h2>
          <p className="text-muted-foreground text-sm">
            Real-time diagnostics and fingerprinting.
          </p>
        </div>
        <div className="info-card flex items-center gap-4 py-3 px-6 cursor-target border-primary/20 cursor-target">
          <Clock className="w-5 h-5 text-primary animate-pulse cursor-target" />
          <div className="text-right cursor-target">
            <div className="text-xs text-muted-foreground font-mono">
              LOCAL TIME
            </div>
            <div className="text-xl font-mono font-bold min-w-[100px] text-right">
              {/* FIX: Only render time if available, otherwise show skeleton to avoid layout shift */}
              {time ? (
                format(time, "HH:mm:ss")
              ) : (
                <span className="opacity-50">--:--:--</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="info-grid cursor-target">
        {/* 1. Network Identity */}
        <div className="info-card col-span-1 md:col-span-8 cursor-target">
          <div className="flex items-center gap-3 mb-6 border-b border-border/20 pb-4 cursor-target">
            <Globe className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold">Network & Latency</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 cursor-target">
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
              label="Ping"
              value={ping ? `${ping} ms` : "..."}
              className={
                ping && ping < 100 ? "text-green-500" : "text-yellow-500"
              }
            />
            <InfoItem
              label="Type"
              value={sysData?.netAPI?.type}
              loading={loading}
            />
            <InfoItem
              label="Speed (Est.)"
              value={sysData?.netAPI?.downlink}
              loading={loading}
            />
            <InfoItem
              label="Location"
              value={
                netData && !netData.failed && netData.city
                  ? `${netData.city}, ${netData.country_code}`
                  : netData?.failed ? "API Blocked" : null
              }
              loading={loading}
            />
          </div>
        </div>

        {/* 2. Security Analysis */}
        <div className="info-card col-span-1 md:col-span-4 border-l-4 border-l-primary/50 cursor-target">
          <div className="flex items-center gap-3 mb-6 border-b border-border/20 pb-4">
            <Shield className="w-5 h-5 text-red-400" />
            <h2 className="text-lg font-bold">Security Analysis</h2>
          </div>
          <div className="space-y-4">
            <SecurityRow
              label="VPN Tunnel"
              isDetected={netData?.security?.vpn}
              loading={loading}
              failed={netData?.failed || !netData?.security}
            />
            <SecurityRow
              label="Proxy Server"
              isDetected={netData?.security?.proxy}
              loading={loading}
              failed={netData?.failed || !netData?.security}
            />
            <SecurityRow
              label="Tor Exit Node"
              isDetected={netData?.security?.tor}
              loading={loading}
              failed={netData?.failed || !netData?.security}
            />

            <div className="pt-4 border-t border-border/10 mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted-foreground uppercase">
                  Location Consistency
                </span>
              </div>
              {loading ? (
                <span className="text-xs text-muted-foreground">
                  Checking...
                </span>
              ) : netData?.failed || tzMatch === null ? (
                <div className="flex items-center gap-2 text-gray-500 text-xs font-bold">
                  UNKNOWN
                </div>
              ) : tzMatch === false ? (
                <div className="flex items-center gap-2 text-yellow-500 text-xs font-bold">
                  <AlertTriangle className="w-3 h-3" /> MISMATCH
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-500 text-xs font-bold">
                  <CheckCircle className="w-3 h-3" /> VERIFIED
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Hardware */}
        <div className="info-card col-span-1 md:col-span-6 cursor-target">
          <div className="flex items-center gap-3 mb-6 border-b border-border/20 pb-4">
            <Cpu className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Hardware Core</h2>
          </div>
          <div className="grid grid-cols-2 gap-y-6">
            <InfoItem
              label="Platform"
              value={sysData?.os?.platform}
              loading={loading}
            />
            <InfoItem
              label="Cores"
              value={sysData?.os?.cores}
              loading={loading}
            />
            <InfoItem
              label="RAM"
              value={sysData?.os?.memory}
              loading={loading}
            />
            <InfoItem
              label="GPU"
              value={sysData?.os?.gpu}
              loading={loading}
              className="col-span-2 text-xs font-mono opacity-80"
            />
          </div>
        </div>

        {/* 4. Power & Display */}
        <div className="info-card col-span-1 md:col-span-6 cursor-target">
          <div className="flex items-center gap-3 mb-6 border-b border-border/20 pb-4">
            <Monitor className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold">Display & Power</h2>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <InfoItem
              label="Res"
              value={
                sysData
                  ? `${sysData.screen.width}x${sysData.screen.height}`
                  : null
              }
              loading={loading}
            />
            <InfoItem
              label="Battery"
              value={sysData?.battery?.level}
              loading={loading}
            />
            <InfoItem
              label="State"
              value={sysData?.battery?.status}
              loading={loading}
            />
            <InfoItem
              label="Touch"
              value={sysData?.screen?.touch}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Sub-components
const InfoItem = ({ label, value, loading, highlight, className }: any) => (
  <div className="flex flex-col cursor-target">
    <span className="data-label">{label}</span>
    {loading ? (
      <div className="h-5 w-16 bg-white/5 rounded animate-pulse mt-1" />
    ) : (
      <span
        className={`data-value ${highlight ? "text-primary" : ""} ${className}`}
      >
        {value || "Unknown"}
      </span>
    )}
  </div>
);

const SecurityRow = ({ label, isDetected, loading, failed }: any) => (
  <div className="flex justify-between items-center cursor-target">
    <span className="text-sm text-muted-foreground font-medium">{label}</span>
    {loading ? (
      <span className="text-xs text-muted-foreground animate-pulse">
        Scanning...
      </span>
    ) : failed ? (
      <span className="text-gray-500 text-xs font-bold opacity-70" title="API blocked or failed">UNKNOWN</span>
    ) : isDetected ? (
      <span className="text-red-500 text-xs font-bold">DETECTED</span>
    ) : (
      <span className="text-green-500/70 text-xs font-bold">SAFE</span>
    )}
  </div>
);

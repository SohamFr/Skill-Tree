import React, { useState } from "react";
import { motion } from "framer-motion";
import { WordsPullUpMultiStyle } from "./WordsPullUpMultiStyle";

interface DeploymentResult {
  deployment: {
    url: string;
    isAccessible: boolean;
    statusCode: number;
    responseTime: number;
    isHttps: boolean;
    finalUrl: string;
    serverHeader: string | null;
    contentType: string | null;
  };
  pageSpeed: {
    performanceScore: number;
    accessibilityScore: number;
    seoScore: number;
    fcp: string;
    lcp: string;
    tbt: string;
    cls: string;
  } | null;
  overallScore: number;
}

function parseMetricValue(value: string): number {
  const num = parseFloat(value);
  if (value.includes("ms")) return num;
  if (value.includes("s")) return num * 1000;
  return num;
}

function metricStatus(value: string, type: "fcp" | "lcp" | "tbt" | "cls"): { label: string; color: string } {
  const num = parseMetricValue(value);
  switch (type) {
    case "fcp":
      if (num < 1800) return { label: "Good", color: "text-green-400 bg-green-500/10" };
      if (num < 3000) return { label: "Improve", color: "text-yellow-400 bg-yellow-500/10" };
      return { label: "Poor", color: "text-red-400 bg-red-500/10" };
    case "lcp":
      if (num < 2500) return { label: "Good", color: "text-green-400 bg-green-500/10" };
      if (num < 4000) return { label: "Improve", color: "text-yellow-400 bg-yellow-500/10" };
      return { label: "Poor", color: "text-red-400 bg-red-500/10" };
    case "tbt":
      if (num < 200) return { label: "Good", color: "text-green-400 bg-green-500/10" };
      if (num < 600) return { label: "Improve", color: "text-yellow-400 bg-yellow-500/10" };
      return { label: "Poor", color: "text-red-400 bg-red-500/10" };
    case "cls":
      if (num < 0.1) return { label: "Good", color: "text-green-400 bg-green-500/10" };
      if (num < 0.25) return { label: "Improve", color: "text-yellow-400 bg-yellow-500/10" };
      return { label: "Poor", color: "text-red-400 bg-red-500/10" };
  }
}

const ScoreCircle: React.FC<{ score: number; label: string }> = ({ score, label }) => {
  const strokeColor = score >= 90 ? "#22c55e" : score >= 50 ? "#eab308" : "#ef4444";
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 80 80" className="w-20 h-20">
        <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
        <circle
          cx="40" cy="40" r="30" fill="none"
          stroke={strokeColor}
          strokeWidth="6"
          strokeDasharray={`${(score / 100) * 188.5} 188.5`}
          strokeLinecap="round"
          transform="rotate(-90 40 40)"
        />
        <text x="40" y="44" textAnchor="middle" fill="#E1E0CC" fontSize="16" fontWeight="bold">{score}</text>
      </svg>
      <span className="text-gray-500 text-[10px] font-mono uppercase mt-2">{label}</span>
    </div>
  );
};

export const DeploymentVerifier: React.FC = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DeploymentResult | null>(null);

  const handleVerify = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch("/api/deployment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), developerId: "anonymous" }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Verification failed");
      }
      const json = await res.json();
      const result: DeploymentResult = json.success ? json.data : json;
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const d = data?.deployment;
  const ps = data?.pageSpeed;

  return (
    <section id="deployments" className="bg-[#060606] py-24 px-4 md:px-8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#DEDBC8]/3 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <span className="text-[#DEDBC8]/60 text-[10px] tracking-[0.25em] uppercase font-mono mb-6 inline-block py-1.5 px-4 rounded-full border border-white/10 bg-white/5">
            DEPLOYMENT VERIFICATION
          </span>
          <WordsPullUpMultiStyle
            segments={[
              { text: "Is your app", className: "text-[#DEDBC8] font-normal" },
              { text: "actually live?", className: "font-serif italic text-[#DEDBC8]" }
            ]}
            containerClassName="inline-flex flex-wrap text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 justify-center"
          />
          <p className="text-gray-500 text-sm md:text-base font-light mb-12">
            We validate uptime, HTTPS, response time, and Core Web Vitals using Google PageSpeed.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-[#101010] border border-white/5 rounded-2xl p-2 flex items-center gap-3 shadow-2xl">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-gray-500 ml-3 shrink-0">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
            </svg>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              placeholder="https://your-app.vercel.app"
              className="flex-1 bg-transparent text-[#DEDBC8] font-mono text-sm placeholder:text-gray-600 outline-none px-2 py-3"
            />
            <button
              onClick={handleVerify}
              disabled={loading || !url.trim()}
              className="bg-[#DEDBC8] text-black font-semibold text-sm px-6 py-3 rounded-xl hover:bg-white transition-colors disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify Now"}
            </button>
          </div>
          {error && <p className="text-red-400 text-sm text-center mt-3">{error}</p>}
        </div>

        {data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Top Row — Status Banner */}
            <div className="bg-[#101010] border border-white/5 rounded-2xl p-6 flex items-center justify-between mb-6 shadow-2xl">
              <div className="flex items-center gap-3">
                {d?.isAccessible ? (
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping opacity-75" />
                    </div>
                    <span className="font-mono text-green-400 text-sm">LIVE</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="font-mono text-red-400 text-sm">OFFLINE</span>
                  </div>
                )}
              </div>
              <div className="font-mono text-[#DEDBC8]/60 text-sm truncate max-w-md">{d?.url}</div>
              <div className="flex items-center gap-3">
                <span className="bg-black/50 rounded-lg px-3 py-1 font-mono text-xs text-[#DEDBC8]">{d?.responseTime}ms</span>
                {d?.isHttps ? (
                  <svg viewBox="0 0 24 24" fill="#22c55e" className="w-4 h-4">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="#ef4444" className="w-4 h-4">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                  </svg>
                )}
                <span className="bg-green-500/10 text-green-400 rounded px-2 py-0.5 text-xs font-mono">{d?.statusCode}</span>
              </div>
            </div>

            {/* Bottom Row — 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left — PageSpeed Scores */}
              <div className="bg-[#101010] border border-white/5 rounded-2xl p-6 shadow-2xl">
                <div className="text-[#DEDBC8]/50 font-mono text-[10px] tracking-widest mb-6">PageSpeed Insights</div>
                {ps ? (
                  <div className="flex justify-around">
                    <ScoreCircle score={ps.performanceScore} label="Performance" />
                    <ScoreCircle score={ps.accessibilityScore} label="Accessibility" />
                    <ScoreCircle score={ps.seoScore} label="SEO" />
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">PageSpeed data unavailable — check PAGESPEED_API_KEY in .env</p>
                )}
              </div>

              {/* Right — Core Web Vitals */}
              <div className="bg-[#101010] border border-white/5 rounded-2xl p-6 shadow-2xl">
                <div className="text-[#DEDBC8]/50 font-mono text-[10px] tracking-widest mb-6">Core Web Vitals</div>
                {ps ? (
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "FCP", key: "fcp" as const, value: ps.fcp },
                      { label: "LCP", key: "lcp" as const, value: ps.lcp },
                      { label: "TBT", key: "tbt" as const, value: ps.tbt },
                      { label: "CLS", key: "cls" as const, value: ps.cls },
                    ].map((m) => {
                      const status = metricStatus(m.value, m.key);
                      return (
                        <div key={m.key} className="bg-black/50 rounded-xl p-4 border border-white/5">
                          <div className="text-gray-500 text-[10px] font-mono uppercase mb-2">{m.label}</div>
                          <div className="text-[#E1E0CC] text-2xl font-mono font-bold">{m.value}</div>
                          <span className={`inline-block rounded-full text-[10px] px-2 py-0.5 mt-1 font-mono ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">PageSpeed data unavailable — check PAGESPEED_API_KEY in .env</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

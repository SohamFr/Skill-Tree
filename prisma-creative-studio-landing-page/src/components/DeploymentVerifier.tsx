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
    error?: string;
    method?: string;
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
  verifiedAt?: string;
}

interface VerifySuccessResponse {
  success: true;
  data: DeploymentResult;
}

interface VerifyErrorResponse {
  success?: false;
  error?: string;
  details?: string;
}

type VerifyResponse = VerifySuccessResponse | VerifyErrorResponse | null;

const parseJsonSafe = <T,>(text: string): T | null => {
  try {
    return text ? (JSON.parse(text) as T) : null;
  } catch {
    return null;
  }
};

function parseMetricValue(value: string): number {
  const num = parseFloat(value);
  if (Number.isNaN(num)) return 0;
  if (value.includes("ms")) return num;
  if (value.includes("s")) return num * 1000;
  return num;
}

function metricStatus(
  value: string,
  type: "fcp" | "lcp" | "tbt" | "cls"
): { label: string; color: string } {
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
    <div className="text-center">
      <div className="relative w-24 h-24 mx-auto mb-3">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke={strokeColor}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 264} 264`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-[#E1E0CC] font-bold text-xl">
          {score}
        </div>
      </div>
      <div className="text-[10px] tracking-widest uppercase text-gray-500 font-mono">
        {label}
      </div>
    </div>
  );
};

export const DeploymentVerifier: React.FC = () => {
  const API_BASE = String(import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DeploymentResult | null>(null);

  const handleVerify = async () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;

    if (!API_BASE) {
      setError("Frontend API base URL is not configured.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE}/api/deployment/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: trimmedUrl }),
      });

      const text = await res.text();
      const json = parseJsonSafe<VerifyResponse>(text);

      if (!res.ok) {
        const message =
          (json && "error" in json && json.error) ||
          (json && "details" in json && json.details) ||
          `Verification failed (${res.status})`;
        setError(message);
        return;
      }

      if (!json || !("data" in json) || !json.data) {
        setError("Backend returned an empty or invalid response.");
        return;
      }

      setResult(json.data);
    } catch (err: unknown) {
      if (err instanceof TypeError) {
        setError("Cannot connect to backend.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const pageSpeed = result?.pageSpeed;
  const deployment = result?.deployment;

  return (
    <section id="deployment" className="bg-black py-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[#DEDBC8]/60 text-[10px] tracking-[0.25em] uppercase font-mono mb-6 inline-block py-1.5 px-4 rounded-full border border-white/10 bg-white/5">
            DEPLOYMENT VERIFICATION
          </span>

          <WordsPullUpMultiStyle
            segments={[
              { text: "Is your app", className: "text-[#DEDBC8] font-normal" },
              { text: "actually live?", className: "font-serif italic text-[#DEDBC8]" },
            ]}
            containerClassName="inline-flex flex-wrap text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 justify-center"
          />

          <p className="text-gray-500 text-sm md:text-base font-light mb-12">
            We validate uptime, HTTPS, response time, and Core Web Vitals using Google PageSpeed.
          </p>

          <div className="max-w-3xl mx-auto">
            <div className="bg-[#101010] border border-white/5 rounded-2xl p-2 flex items-center gap-3 shadow-2xl">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-6 h-6 text-gray-500 ml-3 shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>

              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void handleVerify();
                }}
                placeholder="https://your-site.com"
                className="flex-1 bg-transparent text-[#DEDBC8] text-sm placeholder:text-gray-600 outline-none px-2 py-3 font-mono"
              />

              <button
                type="button"
                onClick={() => void handleVerify()}
                disabled={loading || !url.trim()}
                className="bg-[#DEDBC8] text-black font-semibold text-sm px-6 py-3 rounded-xl hover:bg-white transition-colors disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify Now"}
              </button>
            </div>

            {error && (
              <div className="mt-6 max-w-3xl mx-auto bg-red-500/5 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm font-mono text-center">
                ⚠ {error}
              </div>
            )}
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#101010] rounded-2xl h-40 border border-white/5 animate-pulse"
              />
            ))}
          </div>
        )}

        {result && deployment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-[#101010] border border-white/5 rounded-2xl p-6 shadow-2xl">
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-2">
                  Accessible
                </div>
                <div className="text-2xl font-bold text-[#E1E0CC]">
                  {deployment.isAccessible ? "Yes" : "No"}
                </div>
              </div>

              <div className="bg-[#101010] border border-white/5 rounded-2xl p-6 shadow-2xl">
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-2">
                  Status
                </div>
                <div className="text-2xl font-bold text-[#E1E0CC]">
                  {deployment.statusCode || 0}
                </div>
              </div>

              <div className="bg-[#101010] border border-white/5 rounded-2xl p-6 shadow-2xl">
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-2">
                  HTTPS
                </div>
                <div className="text-2xl font-bold text-[#E1E0CC]">
                  {deployment.isHttps ? "Yes" : "No"}
                </div>
              </div>

              <div className="bg-[#101010] border border-white/5 rounded-2xl p-6 shadow-2xl">
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-2">
                  Response Time
                </div>
                <div className="text-2xl font-bold text-[#E1E0CC]">
                  {deployment.responseTime}ms
                </div>
              </div>
            </div>

            <div className="bg-[#101010] border border-[#DEDBC8]/10 rounded-2xl p-8 shadow-2xl mb-8">
              <div className="text-[#DEDBC8]/50 font-mono text-[10px] tracking-widest mb-6">
                OVERALL SCORE
              </div>

              <div className="flex justify-center">
                <ScoreCircle score={result.overallScore} label="Live Score" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#101010] border border-white/5 rounded-2xl p-6 shadow-2xl">
                <div className="text-[#DEDBC8]/50 font-mono text-[10px] tracking-widest mb-4">
                  Request Details
                </div>

                <div className="space-y-3 text-sm">
                  <div className="text-gray-400">
                    <span className="text-gray-500">Final URL:</span> {deployment.finalUrl}
                  </div>
                  <div className="text-gray-400">
                    <span className="text-gray-500">Method:</span> {deployment.method || "N/A"}
                  </div>
                  <div className="text-gray-400">
                    <span className="text-gray-500">Server:</span>{" "}
                    {deployment.serverHeader || "Unknown"}
                  </div>
                  <div className="text-gray-400">
                    <span className="text-gray-500">Content-Type:</span>{" "}
                    {deployment.contentType || "Unknown"}
                  </div>
                  {deployment.error && (
                    <div className="text-red-400">
                      <span className="text-red-300">Error:</span> {deployment.error}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-[#101010] border border-white/5 rounded-2xl p-6 shadow-2xl">
                <div className="text-[#DEDBC8]/50 font-mono text-[10px] tracking-widest mb-4">
                  PageSpeed
                </div>

                {pageSpeed ? (
                  <div className="grid grid-cols-3 gap-4">
                    <ScoreCircle score={pageSpeed.performanceScore} label="Performance" />
                    <ScoreCircle score={pageSpeed.accessibilityScore} label="Accessibility" />
                    <ScoreCircle score={pageSpeed.seoScore} label="SEO" />
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    PageSpeed data unavailable — check PAGESPEED_API_KEY in backend env.
                  </p>
                )}
              </div>
            </div>

            {pageSpeed && (
              <div className="bg-[#101010] border border-white/5 rounded-2xl p-6 shadow-2xl">
                <div className="text-[#DEDBC8]/50 font-mono text-[10px] tracking-widest mb-4">
                  Core Web Vitals
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: "FCP", value: pageSpeed.fcp, type: "fcp" as const },
                    { label: "LCP", value: pageSpeed.lcp, type: "lcp" as const },
                    { label: "TBT", value: pageSpeed.tbt, type: "tbt" as const },
                    { label: "CLS", value: pageSpeed.cls, type: "cls" as const },
                  ].map((metric) => {
                    const status = metricStatus(metric.value, metric.type);

                    return (
                      <div
                        key={metric.label}
                        className="bg-black/30 border border-white/5 rounded-xl p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[#DEDBC8] font-mono text-sm">
                            {metric.label}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-1 rounded-full font-mono ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </div>
                        <div className="text-gray-300 text-sm">{metric.value}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};
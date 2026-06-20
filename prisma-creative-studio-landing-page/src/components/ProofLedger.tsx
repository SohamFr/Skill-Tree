import React, { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Code, Globe, Activity, Zap } from "lucide-react";
import { WordsPullUpMultiStyle } from "./WordsPullUpMultiStyle";

interface LedgerData {
  developer: {
    id: string;
    githubUsername: string;
    name: string | null;
    avatarUrl: string | null;
    bio: string | null;
    createdAt: string;
    updatedAt: string;
    repositories: Array<{
      id: string;
      repoName: string;
      repoUrl: string;
      stars: number;
      forks: number;
      language: string | null;
      topics: string[];
      complexity: number | null;
      contributionScore: number | null;
    }>;
    deployments: Array<{
      id: string;
      url: string;
      status: string | null;
      responseTime: number | null;
      isHttps: boolean | null;
      isAccessible: boolean | null;
      lighthouseScore: number | null;
      verifiedAt: string;
    }>;
    skills: Array<{
      id: string;
      name: string;
      level: string | null;
      verified: boolean;
      evidence: string | null;
    }>;
    credentials: Array<{
      id: string;
      title: string;
      issuer: string | null;
      verifiedAt: string | null;
      proofUrl: string | null;
    }>;
  };
  stats: {
    totalRepos: number;
    verifiedDeployments: number;
    topLanguages: Array<{ language: string; count: number }>;
    avgComplexityScore: number;
    avgLighthouseScore: number;
    totalCommits: number;
    verifiedSkills: Array<{
      id: string;
      name: string;
      level: string | null;
      verified: boolean;
      evidence: string | null;
    }>;
    activityScore: number;
  };
}

export const ProofLedger: React.FC = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LedgerData | null>(null);
  const [copied, setCopied] = useState(false);

  const handleLoad = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`/api/ledger/${encodeURIComponent(username.trim())}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Developer not found");
        const err = await res.json();
        throw new Error(err.error || "Failed to load ledger");
      }
      const json = await res.json();
      setData(json.success ? json.data : json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(`https://skilltree.dev/proof/${data.developer.githubUsername}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const s = data?.stats;
  const dev = data?.developer;
  const topLang = s?.topLanguages[0]?.language || null;

  return (
    <section id="ledger" className="bg-black py-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[#DEDBC8]/60 text-[10px] tracking-[0.25em] uppercase font-mono mb-6 inline-block py-1.5 px-4 rounded-full border border-white/10 bg-white/5">
            PROOF LEDGER
          </span>
          <WordsPullUpMultiStyle
            segments={[
              { text: "Your verified", className: "text-[#DEDBC8] font-normal" },
              { text: "developer identity.", className: "font-serif italic text-[#DEDBC8]" }
            ]}
            containerClassName="inline-flex flex-wrap text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 justify-center"
          />
          <p className="text-gray-500 text-sm md:text-base font-light mb-12">
            Every skill, every commit, every deployment — cryptographically timestamped and publicly verifiable.
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="bg-[#101010] border border-white/5 rounded-2xl p-2 flex items-center gap-3 shadow-2xl">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-gray-500 ml-3 shrink-0">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLoad()}
                placeholder="Enter GitHub username"
                className="flex-1 bg-transparent text-[#DEDBC8] text-sm placeholder:text-gray-600 outline-none px-2 py-3 font-mono"
              />
              <button
                onClick={handleLoad}
                disabled={loading || !username.trim()}
                className="bg-[#DEDBC8] text-black font-semibold text-sm px-6 py-3 rounded-xl hover:bg-white transition-colors disabled:opacity-50"
              >
                {loading ? "Loading..." : "Load Ledger"}
              </button>
            </div>
            {error && (
              <div className="mt-6 max-w-2xl mx-auto space-y-3">
                <div className="bg-[#DEDBC8]/5 border border-[#DEDBC8]/10 rounded-2xl p-6 text-center">
                  {error.includes('Database') ? (
                    <>
                      <p className="text-[#DEDBC8]/60 font-mono text-xs uppercase tracking-widest mb-2">
                        Ledger Not Found
                      </p>
                      <p className="text-[#DEDBC8]/40 text-sm mb-4">
                        This profile hasn't been analyzed yet.
                      </p>
                      <p className="text-gray-600 text-xs font-mono">
                        → First use the Analyzer section above to scan this GitHub profile.
                        Then come back here to view the full ledger.
                      </p>
                    </>
                  ) : (
                    <p className="text-red-400/80 text-sm font-mono">⚠ {error}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {loading && (
          <div className="flex justify-center">
            <div className="w-full max-w-md mx-auto">
              <div className="bg-[#101010] rounded-3xl h-64 border border-white/5 animate-pulse" />
            </div>
          </div>
        )}

        {data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Identity Card */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[#DEDBC8]/10 rounded-3xl p-8 w-full max-w-md mx-auto mb-12 relative overflow-hidden shadow-2xl">
              <div className="absolute bg-[#DEDBC8]/3 w-64 h-64 rounded-full -bottom-20 -right-20 blur-2xl pointer-events-none" />

              <div className="flex items-start justify-between mb-8 relative z-10">
                <span className="font-mono text-[10px] text-[#DEDBC8]/30 tracking-widest">SKILLTREE</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-[10px] font-mono text-green-400">VERIFIED</span>
                </div>
              </div>

              <div className="text-center mb-8 relative z-10">
                <img
                  src={dev?.avatarUrl || `https://avatars.githubusercontent.com/${dev?.githubUsername}`}
                  alt={dev?.name || ""}
                  className="w-20 h-20 rounded-full border-2 border-[#DEDBC8]/20 mx-auto mb-4"
                />
                <h3 className="text-[#E1E0CC] text-xl font-medium">{dev?.name || dev?.githubUsername}</h3>
                <p className="text-gray-500 font-mono text-sm">@{dev?.githubUsername}</p>
              </div>

              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="text-gray-500 text-[10px] font-mono uppercase tracking-wider">Activity Score</div>
                  <div className="text-[#E1E0CC] text-3xl font-bold font-mono">{s?.activityScore}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-[10px] font-mono uppercase tracking-wider mb-1">Top Language</div>
                  {topLang ? (
                    <span className="bg-[#DEDBC8]/10 text-[#DEDBC8] text-xs px-3 py-1 rounded-full font-mono">{topLang}</span>
                  ) : (
                    <span className="text-gray-600 text-xs font-mono">—</span>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-[#101010] border border-white/5 rounded-2xl p-6 shadow-2xl">
                <Code className="w-5 h-5 text-[#DEDBC8]/40 mb-3" />
                <div className="text-3xl font-bold text-[#E1E0CC] font-mono">{s?.totalRepos}</div>
                <div className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Repos Analyzed</div>
              </div>
              <div className="bg-[#101010] border border-white/5 rounded-2xl p-6 shadow-2xl">
                <Globe className="w-5 h-5 text-[#DEDBC8]/40 mb-3" />
                <div className="text-3xl font-bold text-[#E1E0CC] font-mono">{s?.verifiedDeployments}</div>
                <div className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Live Deployments</div>
              </div>
              <div className="bg-[#101010] border border-white/5 rounded-2xl p-6 shadow-2xl">
                <Zap className="w-5 h-5 text-[#DEDBC8]/40 mb-3" />
                <div className="text-3xl font-bold text-[#E1E0CC] font-mono">{s?.avgComplexityScore.toFixed(1)}</div>
                <div className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Avg Complexity</div>
              </div>
              <div className="bg-[#101010] border border-white/5 rounded-2xl p-6 shadow-2xl">
                <Activity className="w-5 h-5 text-[#DEDBC8]/40 mb-3" />
                <div className="text-3xl font-bold text-[#E1E0CC] font-mono">{s?.activityScore}</div>
                <div className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Activity Score</div>
              </div>
            </div>

            {/* Two Column Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Language Bars */}
              <div className="bg-[#101010] rounded-2xl p-6 border border-white/5 shadow-2xl">
                <div className="text-[#DEDBC8]/50 font-mono text-[10px] tracking-widest mb-4">Top Languages</div>
                {s?.topLanguages.map((lang) => (
                  <div key={lang.language} className="flex items-center gap-3 mb-3 last:mb-0">
                    <span className="text-gray-400 text-xs w-24 font-mono truncate shrink-0">{lang.language}</span>
                    <div className="flex-1 h-0.5 bg-white/5 rounded-full">
                      <div
                        className="h-0.5 bg-[#DEDBC8]/50 rounded-full transition-all duration-700"
                        style={{ width: `${Math.max((lang.count / Math.max(...s.topLanguages.map((l) => l.count))) * 100, 5)}%` }}
                      />
                    </div>
                    <span className="text-gray-500 text-[10px] font-mono w-8 text-right">{lang.count}</span>
                  </div>
                ))}
                {(!s?.topLanguages || s.topLanguages.length === 0) && (
                  <p className="text-gray-500 text-xs">No language data</p>
                )}
              </div>

              {/* Repository Timeline */}
              <div className="bg-[#101010] rounded-2xl p-6 border border-white/5 shadow-2xl">
                <div className="text-[#DEDBC8]/50 font-mono text-[10px] tracking-widest mb-4">Recent Repositories</div>
                <div className="flex overflow-x-auto gap-3 pb-2" style={{ scrollbarWidth: "none" }}>
                  {data.developer.repositories.map((repo) => (
                    <a
                      key={repo.id}
                      href={repo.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#101010] rounded-xl p-4 w-56 shrink-0 border border-white/5 hover:border-white/20 transition-colors block"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[#DEDBC8] text-sm font-mono truncate mr-2">{repo.repoName}</span>
                        <ExternalLink className="w-3 h-3 text-gray-500 shrink-0" />
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        {repo.language && (
                          <span className="bg-[#DEDBC8]/10 text-[#DEDBC8] text-[10px] px-2 py-0.5 rounded-full">{repo.language}</span>
                        )}
                        <span className="text-gray-500 text-[10px]">★ {repo.stars}</span>
                      </div>
                      <div className="mt-2 h-0.5 bg-white/5 rounded-full">
                        <div className="h-0.5 bg-[#DEDBC8]/60 rounded-full" style={{ width: `${Math.min(repo.complexity || 0, 100)}%` }} />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Shareable Proof Link */}
            <div className="bg-[#101010] border border-[#DEDBC8]/10 rounded-2xl p-6 flex items-center justify-between shadow-2xl">
              <div>
                <div className="font-mono text-[10px] tracking-widest text-[#DEDBC8]/50 mb-1">SHAREABLE PROOF LINK</div>
                <div className="font-mono text-[#DEDBC8] text-sm">skilltree.dev/proof/{data.developer.githubUsername}</div>
              </div>
              <button
                onClick={handleCopy}
                className="bg-[#DEDBC8] text-black text-xs font-semibold px-4 py-2 rounded-lg hover:bg-white transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

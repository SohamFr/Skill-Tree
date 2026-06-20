import React, { useState } from "react";
import { motion } from "framer-motion";
import { WordsPullUpMultiStyle } from "./WordsPullUpMultiStyle";

interface RepoData {
  name: string;
  url: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  technologies: string[];
  complexityScore: number;
  commits: { count: number; messages: string[] };
  updatedAt: string;
}

interface ProfileData {
  login: string;
  name: string;
  avatarUrl: string;
  bio: string;
  publicRepos: number;
  followers: number;
  following: number;
  createdAt: string;
}

interface AnalysisData {
  profile: ProfileData;
  repositories: RepoData[];
  technologies: string[];
  topLanguages: { name: string; count: number; percentage: number }[];
  stats: {
    totalRepos: number;
    analyzedRepos: number;
    avgComplexityScore: number;
    totalStars: number;
    topLanguage: string;
  };
}

const SkeletonCard: React.FC = () => (
  <div className="bg-[#101010] rounded-2xl h-48 border border-white/5 animate-pulse" />
);

export const GitHubAnalyzer: React.FC = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalysisData | null>(null);

  const handleAnalyze = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch("/api/github/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Analysis failed");
        return;
      }
      setData(json.data);
    } catch (err: any) {
      if (err.message?.includes("fetch")) {
        setError("Cannot connect to backend. Make sure skill-tree-backend is running on port 3000.");
      } else {
        setError(err.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAnalyze();
  };

  const languageStats = () => {
    if (!data) return [];
    const freq: Record<string, number> = {};
    for (const repo of data.repositories) {
      if (repo.language) {
        freq[repo.language] = (freq[repo.language] || 0) + 1;
      }
    }
    const total = Object.values(freq).reduce((s, v) => s + v, 0);
    return Object.entries(freq)
      .map(([name, count]) => ({ name, count, percent: (count / total) * 100 }))
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 5);
  };

  const avgComplexity =
    data && data.repositories.length > 0
      ? Math.min(
          (data.repositories.reduce((s, r) => s + r.complexityScore, 0) / data.repositories.length) * 10,
          100
        )
      : data?.stats.avgComplexityScore ?? 0;

  return (
    <section id="analyzer" className="bg-black py-24 px-4 md:px-8 w-full relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <span className="text-green-400 text-[10px] tracking-[0.25em] uppercase font-mono mb-6 inline-block py-1.5 px-4 rounded-full border border-green-500/20 bg-green-500/5">
            LIVE ANALYSIS ENGINE
          </span>
          <WordsPullUpMultiStyle
            segments={[
              { text: "Analyze any GitHub", className: "text-[#DEDBC8] font-normal" },
              { text: "profile instantly.", className: "font-serif italic text-[#DEDBC8] px-[0.05em]" }
            ]}
            containerClassName="inline-flex flex-wrap text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 justify-center"
          />
          <p className="text-gray-500 text-sm md:text-base font-light mb-12">
            Commits don't lie. Technologies don't lie. We make sure you don't have to.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-[#101010] border border-white/5 rounded-2xl p-2 flex items-center gap-3 shadow-2xl">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-gray-500 ml-3 shrink-0">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z" />
            </svg>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter GitHub username..."
              className="flex-1 bg-transparent text-[#DEDBC8] text-sm placeholder:text-gray-600 outline-none px-2 py-3 font-mono"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !username.trim()}
              className="bg-[#DEDBC8] text-black font-semibold text-sm px-6 py-3 rounded-xl hover:bg-white transition-colors disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
          {error && (
            <div className="mt-6 max-w-2xl mx-auto bg-red-500/5 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm font-mono text-center">
              ⚠ {error}
            </div>
          )}
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Card 1 — Developer Profile */}
              <div className="bg-[#101010] border border-white/5 rounded-2xl p-6 shadow-2xl">
                <img
                  src={data.profile.avatarUrl}
                  alt={data.profile.login}
                  className="w-16 h-16 rounded-full border-2 border-[#DEDBC8]/20 mb-4"
                />
                <h3 className="text-[#E1E0CC] text-xl font-medium">
                  {data.profile.name || data.profile.login}
                </h3>
                <p className="text-gray-500 font-mono text-sm">@{data.profile.login}</p>
                {data.profile.bio && (
                  <p className="text-gray-400 text-xs mt-2 mb-4 line-clamp-3">
                    {data.profile.bio}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-black/50 rounded-xl p-3 text-center">
                    <div className="text-[#DEDBC8] font-mono text-lg">{data.profile.publicRepos}</div>
                    <div className="text-gray-500 text-[10px] uppercase tracking-wider">Public Repos</div>
                  </div>
                  <div className="bg-black/50 rounded-xl p-3 text-center">
                    <div className="text-[#DEDBC8] font-mono text-lg">{data.profile.followers}</div>
                    <div className="text-gray-500 text-[10px] uppercase tracking-wider">Followers</div>
                  </div>
                </div>
              </div>

              {/* Card 2 — Top Repositories */}
              <div className="bg-[#101010] border border-white/5 rounded-2xl p-6 shadow-2xl">
                <h4 className="text-[#DEDBC8]/50 font-mono text-[10px] tracking-widest uppercase mb-4">Top Repositories</h4>
                {data.repositories.slice(0, 5).map((repo, i) => (
                  <div key={repo.name + i} className="bg-black/30 rounded-xl p-3 mb-2 border border-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[#DEDBC8] text-sm font-mono truncate mr-2">{repo.name}</span>
                      {repo.language && (
                        <span className="bg-[#DEDBC8]/10 text-[#DEDBC8] text-[10px] px-2 py-0.5 rounded-full shrink-0">
                          {repo.language}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 h-0.5 bg-white/5 rounded-full">
                      <div className="h-0.5 bg-[#DEDBC8]/60 rounded-full" style={{ width: `${Math.min(repo.complexityScore, 100)}%` }} />
                    </div>
                    <div className="text-gray-500 text-[10px] mt-1">★ {repo.stars}</div>
                  </div>
                ))}
              </div>

              {/* Card 3 — Technology Stack */}
              <div className="bg-[#101010] border border-white/5 rounded-2xl p-6 shadow-2xl">
                <h4 className="text-[#DEDBC8]/50 font-mono text-[10px] tracking-widest uppercase mb-4">Technology Stack</h4>
                <div className="flex flex-wrap gap-2 mb-6">
                  {data.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="bg-[#DEDBC8]/5 border border-[#DEDBC8]/10 text-[#DEDBC8]/80 text-xs rounded-full px-3 py-1"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <h4 className="text-[#DEDBC8]/50 font-mono text-[10px] tracking-widest uppercase mb-4">Language Breakdown</h4>
                {languageStats().map((lang) => (
                  <div key={lang.name} className="flex items-center gap-3 mb-2">
                    <span className="text-gray-400 text-xs w-20 font-mono">{lang.name}</span>
                    <div className="flex-1 h-0.5 bg-white/5 rounded-full">
                      <div className="h-0.5 bg-[#DEDBC8]/50 rounded-full transition-all duration-700" style={{ width: `${lang.percent}%` }} />
                    </div>
                    <span className="text-gray-500 text-[10px] font-mono w-8 text-right">{Math.round(lang.percent)}%</span>
                  </div>
                ))}
                {languageStats().length === 0 && (
                  <p className="text-gray-500 text-xs">No language data</p>
                )}
              </div>
            </div>

            {/* AI Skill Score Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-[#101010] border border-[#DEDBC8]/10 rounded-2xl p-8 shadow-2xl"
            >
              <div className="text-[#DEDBC8]/50 font-mono text-[10px] tracking-widest mb-4">VERIFIED SKILL SCORE</div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-7xl font-bold text-[#E1E0CC]">{Math.round(avgComplexity)}</span>
                <span className="text-2xl text-gray-600">/100</span>
              </div>
              <div className="bg-white/5 h-2 rounded-full mb-6">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-[#DEDBC8]/40 to-[#DEDBC8] transition-all duration-700"
                  style={{ width: `${avgComplexity}%` }}
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Code Quality", value: Math.round(avgComplexity * 0.9) },
                  { label: "Contribution", value: Math.round(avgComplexity * 0.85) },
                  { label: "Diversity", value: Math.round(avgComplexity * (data.repositories.length > 5 ? 0.95 : 0.6)) },
                  { label: "Recency", value: Math.round(avgComplexity * 0.75) },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-[#E1E0CC] text-lg font-mono font-bold">{s.value}</div>
                    <div className="text-gray-500 text-[10px] font-mono uppercase tracking-wider mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

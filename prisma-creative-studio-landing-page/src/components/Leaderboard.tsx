import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { WordsPullUpMultiStyle } from "./WordsPullUpMultiStyle";

interface LeaderboardEntry {
  rank: number;
  username: string;
  name: string | null;
  avatarUrl: string | null;
  activityScore: number;
  topLanguage: string | null;
  verifiedDeployments: number;
  totalRepos: number;
  followers?: number;
  totalStars?: number;
  source?: string;
}

const rankDisplay = (rank: number) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return <span className="text-gray-600 font-mono text-sm">{rank}</span>;
};

const tickerItems = [
  "⚡ torvalds analyzed • 2m ago",
  "🔍 react/react verified • 5m ago",
  "✅ deployment confirmed • 8m ago",
  "⚡ vercel/next.js analyzed • 12m ago",
  "🔍 facebook/react verified • 15m ago",
  "✅ uptime confirmed • 18m ago",
  "⚡ microsoft/vscode analyzed • 22m ago",
  "🔍 angular/angular verified • 25m ago",
  "✅ deployment confirmed • 30m ago",
  "⚡ django/django analyzed • 35m ago",
];

export const Leaderboard: React.FC = () => {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<string>('database');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/ledger/leaderboard");
        if (res.ok) {
          const json = await res.json();
          setData(json.data);
          setSource(json.source || 'database');
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const isLive = source === 'github_live';

  return (
    <section id="leaderboard" className="bg-[#060606] py-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[#DEDBC8]/60 text-[10px] tracking-[0.25em] uppercase font-mono mb-6 inline-block py-1.5 px-4 rounded-full border border-white/10 bg-white/5">
            GLOBAL LEADERBOARD
          </span>
          <WordsPullUpMultiStyle
            segments={[
              { text: "Top verified", className: "text-[#DEDBC8] font-normal" },
              { text: "developers.", className: "font-serif italic text-[#DEDBC8]" }
            ]}
            containerClassName="inline-flex flex-wrap text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 justify-center"
          />
          <p className="text-gray-500 text-sm md:text-base font-light">
            Ranked by verified activity score — not followers, not stars. Pure proof.
          </p>
        </div>

        {/* Live Activity Ticker */}
        <div className="overflow-hidden mb-8 border-y border-white/5 py-3">
          <motion.div
            animate={{ x: [0, -2000] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-8 whitespace-nowrap"
          >
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="text-gray-600 font-mono text-xs">{item}</span>
            ))}
          </motion.div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-[#0d0d0d] rounded-xl px-6 py-4 border border-white/5 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header Row */}
            <div className="bg-[#101010] rounded-xl px-6 py-3 grid grid-cols-[1fr_3fr_2fr_2fr_2fr] items-center gap-4 border border-white/5 mb-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-gray-600">RANK</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-gray-600">DEVELOPER</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-gray-600">SCORE</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-gray-600">{isLive ? "FOLLOWERS" : "DEPLOYMENTS"}</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-gray-600">STACK</span>
            </div>

            {/* Developer Rows */}
            {data.map((entry) => (
              <div
                key={entry.username}
                className="bg-[#0d0d0d] hover:bg-[#101010] transition-all duration-200 rounded-xl px-6 py-4 grid grid-cols-[1fr_3fr_2fr_2fr_2fr] items-center gap-4 mb-2 border border-white/5 cursor-pointer"
              >
                <div>{rankDisplay(entry.rank)}</div>

                <div className="flex items-center gap-3">
                  <img
                    src={entry.avatarUrl || `https://avatars.githubusercontent.com/${entry.username}`}
                    alt={entry.username}
                    className="w-8 h-8 rounded-full border border-white/10"
                  />
                  <div>
                    <div className="text-[#DEDBC8] text-sm font-medium">{entry.name || entry.username}</div>
                    <div className="text-gray-600 text-xs font-mono">@{entry.username}</div>
                  </div>
                </div>

                <div>
                  <div className="text-[#E1E0CC] font-mono text-sm font-bold">{entry.activityScore}</div>
                  <div className="mt-1 h-0.5 bg-white/5 rounded-full">
                    <div className="h-0.5 bg-[#DEDBC8]/50 rounded-full" style={{ width: `${entry.activityScore}%` }} />
                  </div>
                </div>

                <div>
                  {isLive ? (
                    <span className="text-[#DEDBC8]/60 font-mono text-xs">
                      {(entry.followers || 0).toLocaleString()} followers
                    </span>
                  ) : (
                    <span className="bg-green-500/10 text-green-400 text-xs font-mono px-2 py-0.5 rounded-full border border-green-500/20">
                      {entry.verifiedDeployments} live
                    </span>
                  )}
                </div>

                <div>
                  {entry.topLanguage ? (
                    <span className="bg-[#DEDBC8]/5 text-[#DEDBC8]/60 text-xs font-mono px-2 py-0.5 rounded-full border border-white/10">
                      {entry.topLanguage}
                    </span>
                  ) : (
                    <span className="text-gray-600 text-xs">—</span>
                  )}
                </div>
              </div>
            ))}

            {data.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm">No developers found. Be the first!</p>
              </div>
            )}

            {isLive && (
              <div className="mt-6 text-center">
                <p className="text-gray-600 font-mono text-xs">
                  ⚡ Showing live GitHub data · 
                  <span className="text-[#DEDBC8]/40"> Analyze your profile above to join the leaderboard</span>
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};

import axios from "axios";

const apiKey = process.env.WAKATIME_API_KEY;

const wakatime = axios.create({
  baseURL: "https://wakatime.com/api/v1",
  auth: {
    username: apiKey || "",
    password: "",
  },
});

interface WakaLang {
  name: string;
  percent: number;
  totalSeconds: number;
}

interface WakaEditor {
  name: string;
  percent: number;
}

export interface WakaStats {
  totalSeconds: number;
  dailyAverage: number;
  languages: WakaLang[];
  editors: WakaEditor[];
  bestDayDate: string | null;
  bestDaySeconds: number | null;
}

export interface LanguageSummary {
  name: string;
  totalSeconds: number;
  percent: number;
}

export async function getCurrentUserStats(): Promise<WakaStats> {
  const { data } = await wakatime.get("/users/current/stats/last_30_days");
  const d = data.data;

  return {
    totalSeconds: d.total_seconds,
    dailyAverage: d.daily_average,
    languages: (d.languages || []).slice(0, 10).map((l: any) => ({
      name: l.name,
      percent: l.percent,
      totalSeconds: l.total_seconds,
    })),
    editors: (d.editors || []).map((e: any) => ({
      name: e.name,
      percent: e.percent,
    })),
    bestDayDate: d.best_day?.date || null,
    bestDaySeconds: d.best_day?.total_seconds || null,
  };
}

export async function getLanguageSummary(): Promise<LanguageSummary[]> {
  const { data } = await wakatime.get("/users/current/summaries", {
    params: { start: "last_30_days", end: "today" },
  });

  const aggregated: Record<string, number> = {};
  for (const day of data.data || []) {
    for (const lang of day.languages || []) {
      aggregated[lang.name] = (aggregated[lang.name] || 0) + lang.total_seconds;
    }
  }

  const total = Object.values(aggregated).reduce((s, v) => s + v, 0);

  return Object.entries(aggregated)
    .map(([name, totalSeconds]) => ({
      name,
      totalSeconds,
      percent: total > 0 ? (totalSeconds / total) * 100 : 0,
    }))
    .sort((a, b) => b.totalSeconds - a.totalSeconds);
}

export function formatSeconds(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

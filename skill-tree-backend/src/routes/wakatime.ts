import { Router, Request, Response } from "express";
import {
  getCurrentUserStats,
  getLanguageSummary,
  formatSeconds,
} from "../services/wakatimeService";

const router = Router();

router.get("/stats", async (_req: Request, res: Response) => {
  try {
    const stats = await getCurrentUserStats();
    return res.json(stats);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/languages", async (_req: Request, res: Response) => {
  try {
    const languages = await getLanguageSummary();
    return res.json(languages);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/summary", async (_req: Request, res: Response) => {
  try {
    const [stats, languages] = await Promise.all([
      getCurrentUserStats(),
      getLanguageSummary(),
    ]);

    return res.json({
      stats,
      languages,
      formatted: {
        totalTime: formatSeconds(stats.totalSeconds),
        dailyAverage: formatSeconds(stats.dailyAverage),
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;

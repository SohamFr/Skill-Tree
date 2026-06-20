import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/leaderboard', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const developers = await prisma.developer.findMany({
      include: { repositories: true, deployments: true },
      take: 20,
    });

    if (developers.length > 0) {
      const ranked = developers
        .map((dev) => {
          const verifiedDeployments = dev.deployments.filter((d) => d.isAccessible).length;
          const avgComplexity = dev.repositories.length > 0
            ? dev.repositories.reduce((s, r) => s + (r.complexity || 0), 0) / dev.repositories.length
            : 0;
          const activityScore = Math.min(
            Math.round(
              Math.min(dev.repositories.length * 3, 25) +
              Math.min(verifiedDeployments * 10, 25) +
              Math.min(avgComplexity * 0.25, 25)
            ),
            100
          );
          const langFreq: Record<string, number> = {};
          dev.repositories.forEach((r) => {
            if (r.language) langFreq[r.language] = (langFreq[r.language] || 0) + 1;
          });
          const topLanguage = Object.entries(langFreq)
            .sort(([,a],[,b]) => b - a)[0]?.[0] || 'N/A';
          return {
            username: dev.githubUsername,
            name: dev.name,
            avatarUrl: dev.avatarUrl,
            activityScore,
            verifiedDeployments,
            topLanguage,
            totalRepos: dev.repositories.length,
            isReal: true,
          };
        })
        .sort((a, b) => b.activityScore - a.activityScore)
        .map((dev, i) => ({ rank: i + 1, ...dev }));
      return res.json({ success: true, data: ranked, source: 'database' });
    }
  } catch {
    // DB unavailable, fall through to GitHub API
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN?.trim();
  const headers: Record<string, string> = {
    'User-Agent': 'SkillTree-App',
    'Accept': 'application/vnd.github.v3+json',
  };
  if (GITHUB_TOKEN) headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;

  const famousDevs = [
    'torvalds', 'gaearon', 'sindresorhus', 'tj', 'yyx990803',
    'addyosmani', 'nicolo-ribaudo', 'antfu', 'mattpocock', 'wesbos',
    'kentcdodds', 'tannerlinsley', 'Rich-Harris', 'ThePrimeagen', 'bradtraversy'
  ];

  try {
    const results = await Promise.allSettled(
      famousDevs.map(async (username) => {
        const res = await fetch(`https://api.github.com/users/${username}`, { headers });
        if (!res.ok) throw new Error(`Failed for ${username}`);
        const user = await res.json();

        const reposRes = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=30&sort=updated`,
          { headers }
        );
        const repos = reposRes.ok ? await reposRes.json() : [];

        const langFreq: Record<string, number> = {};
        (Array.isArray(repos) ? repos : []).forEach((r: any) => {
          if (r.language) langFreq[r.language] = (langFreq[r.language] || 0) + 1;
        });
        const topLanguage = Object.entries(langFreq)
          .sort(([,a],[,b]) => b - a)[0]?.[0] || 'N/A';

        const totalStars = (Array.isArray(repos) ? repos : [])
          .reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0);

        const activityScore = Math.min(
          Math.round(
            Math.min(user.public_repos * 0.5, 25) +
            Math.min(Math.log10(user.followers + 1) * 10, 25) +
            Math.min(Math.log10(totalStars + 1) * 8, 25) +
            (user.blog ? 10 : 0) +
            (repos.some((r: any) => {
              const updated = new Date(r.updated_at);
              const thirtyDays = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
              return updated > thirtyDays;
            }) ? 15 : 0)
          ),
          100
        );

        return {
          username: user.login,
          name: user.name || user.login,
          avatarUrl: user.avatar_url,
          activityScore,
          verifiedDeployments: 0,
          topLanguage,
          totalRepos: user.public_repos,
          followers: user.followers,
          totalStars,
          isReal: true,
          source: 'github_live',
        };
      })
    );

    const successful = results
      .filter((r) => r.status === 'fulfilled')
      .map((r: any) => r.value)
      .sort((a, b) => b.activityScore - a.activityScore)
      .map((dev, i) => ({ rank: i + 1, ...dev }));

    return res.json({
      success: true,
      data: successful,
      source: 'github_live',
      note: 'Showing top GitHub developers. Analyze your profile to appear here.',
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/:username', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    return res.status(503).json({
      error: 'Database unavailable',
      suggestion: 'First analyze a GitHub profile using the Analyzer section above',
    });
  }
  try {
    const username = req.params.username as string;
    const developer = await prisma.developer.findUnique({
      where: { githubUsername: username.toLowerCase() },
      include: { repositories: true, deployments: true, skills: true, credentials: true },
    });
    if (!developer) {
      return res.status(404).json({
        error: `No ledger found for "${username}"`,
        suggestion: 'Analyze this GitHub profile first using the Analyzer section',
      });
    }
    const verifiedDeployments = developer.deployments.filter((d) => d.isAccessible).length;
    const avgComplexity = developer.repositories.length > 0
      ? developer.repositories.reduce((s, r) => s + (r.complexity || 0), 0) / developer.repositories.length
      : 0;
    const langFreq: Record<string, number> = {};
    developer.repositories.forEach((r) => {
      if (r.language) langFreq[r.language] = (langFreq[r.language] || 0) + 1;
    });
    const topLanguages = Object.entries(langFreq)
      .sort(([,a],[,b]) => b - a)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / developer.repositories.length) * 100),
      }));
    const activityScore = Math.min(
      Math.round(
        Math.min(developer.repositories.length * 3, 25) +
        Math.min(verifiedDeployments * 10, 25) +
        Math.min(avgComplexity * 0.25, 25)
      ),
      100
    );
    return res.json({
      success: true,
      data: {
        ...developer,
        topLanguages,
        stats: {
          totalRepos: developer.repositories.length,
          verifiedDeployments,
          avgComplexityScore: Math.round(avgComplexity * 10) / 10,
          activityScore,
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;

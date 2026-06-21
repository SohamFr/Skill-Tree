import { Router, Request, Response } from 'express';
import {
  getUserProfile,
  getUserRepos,
  getRepoLanguages,
  getRepoCommits,
  calculateComplexityScore,
  detectTechnologies,
} from '../services/githubService';
import prisma from '../lib/prisma';

const router = Router();

router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { username } = req.body;

    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const cleanUsername = username.trim().toLowerCase();

    let profile: any;
    try {
      profile = await getUserProfile(cleanUsername);
    } catch (err: any) {
      if (err.message?.includes('404') || err.response?.status === 404) {
        return res.status(404).json({ error: `GitHub user "${cleanUsername}" not found` });
      }

      if (err.message?.includes('403') || err.response?.status === 403) {
        return res.status(429).json({ error: 'GitHub rate limit exceeded. Try again in 1 hour.' });
      }

      throw err;
    }

    const repos = await getUserRepos(cleanUsername);

    const analyzedRepos = await Promise.allSettled(
      repos.slice(0, 10).map(async (repo: any) => {
        const [languages, commits] = await Promise.allSettled([
          getRepoLanguages(cleanUsername, repo.name),
          getRepoCommits(cleanUsername, repo.name),
        ]);

        const langData = languages.status === 'fulfilled' ? languages.value : {};
        const commitData =
          commits.status === 'fulfilled'
            ? commits.value
            : { count: 0, messages: [] };

        const complexity = calculateComplexityScore(repo);
        const technologies = detectTechnologies(langData, repo.topics || []);

        return {
          name: repo.name,
          url: repo.html_url,
          description: repo.description,
          stars: repo.stargazers_count ?? 0,
          forks: repo.forks_count ?? 0,
          language: repo.language ?? null,
          topics: repo.topics || [],
          languages: langData,
          technologies,
          complexityScore: complexity ?? 0,
          commits: commitData,
          updatedAt: repo.updated_at,
        };
      })
    );

    const successfulRepos = analyzedRepos
      .filter((r) => r.status === 'fulfilled')
      .map((r: any) => r.value);

    const allTech = new Set<string>();
    successfulRepos.forEach((r) => {
      r.technologies.forEach((t: string) => allTech.add(t));
    });

    const langFreq: Record<string, number> = {};
    successfulRepos.forEach((r) => {
      if (r.language) {
        langFreq[r.language] = (langFreq[r.language] || 0) + 1;
      }
    });

    const topLanguages = Object.entries(langFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([name, count]) => ({
        name,
        count,
        percentage: successfulRepos.length
          ? Math.round((count / successfulRepos.length) * 100)
          : 0,
      }));

    const avgComplexity =
      successfulRepos.length > 0
        ? successfulRepos.reduce((sum, r) => sum + r.complexityScore, 0) / successfulRepos.length
        : 0;

    const responseData = {
      profile: {
        login: profile.login,
        name: profile.name,
        avatarUrl: profile.avatar_url,
        bio: profile.bio,
        publicRepos: profile.public_repos,
        followers: profile.followers,
        following: profile.following,
        createdAt: profile.created_at,
        location: profile.location,
        blog: profile.blog,
        company: profile.company,
      },
      repositories: successfulRepos,
      technologies: Array.from(allTech),
      topLanguages,
      stats: {
        totalRepos: profile.public_repos,
        analyzedRepos: successfulRepos.length,
        avgComplexityScore: Math.round(avgComplexity * 10) / 10,
        totalStars: successfulRepos.reduce((sum, r) => sum + r.stars, 0),
        topLanguage: topLanguages[0]?.name || 'N/A',
      },
    };

    try {
      await prisma.$transaction(async (tx) => {
        const developer = await tx.developer.upsert({
          where: { githubUsername: cleanUsername },
          update: {
            name: profile.name || cleanUsername,
            avatarUrl: profile.avatar_url,
            bio: profile.bio || '',
            updatedAt: new Date(),
          },
          create: {
            githubUsername: cleanUsername,
            name: profile.name || cleanUsername,
            avatarUrl: profile.avatar_url,
            bio: profile.bio || '',
          },
        });

        await tx.repository.deleteMany({
          where: { developerId: developer.id },
        });

        await tx.repository.createMany({
          data: successfulRepos.map((repo) => ({
            developerId: developer.id,
            repoName: repo.name,
            repoUrl: repo.url,
            stars: repo.stars,
            forks: repo.forks,
            language: repo.language,
            topics: repo.topics || [],
            complexity: repo.complexityScore,
            contributionScore: repo.commits?.count || 0,
          })),
        });
      });
    } catch (dbErr) {
      console.warn('DB save skipped (DB unavailable):', (dbErr as Error).message);
    }

    return res.json({ success: true, data: responseData });
  } catch (error: any) {
    console.error('GitHub analyze error:', error.message);
    return res.status(500).json({
      error: 'Analysis failed',
      details: error.message,
    });
  }
});

router.get('/profile/:username', async (req: Request, res: Response) => {
  try {
    const username = req.params.username as string;
    const profile = await getUserProfile(username);
    const repos = await getUserRepos(username);

    return res.json({ success: true, data: { profile, repositories: repos } });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
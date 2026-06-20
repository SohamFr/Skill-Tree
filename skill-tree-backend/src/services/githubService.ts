import axios from 'axios';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const github = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'SkillTree-App',
  },
  timeout: 15000,
});

export async function getUserProfile(username: string) {
  const res = await github.get(`/users/${username}`);
  return res.data;
}

export async function getUserRepos(username: string) {
  const res = await github.get(`/users/${username}/repos`, {
    params: { per_page: 100, sort: 'updated', type: 'owner' },
  });
  return res.data;
}

export async function getRepoLanguages(username: string, repo: string): Promise<Record<string, number>> {
  try {
    const res = await github.get(`/repos/${username}/${repo}/languages`);
    return res.data;
  } catch {
    return {};
  }
}

export async function getRepoCommits(username: string, repo: string): Promise<{ count: number; messages: string[] }> {
  try {
    const res = await github.get(`/repos/${username}/${repo}/commits`, {
      params: { author: username, per_page: 100 },
    });
    return {
      count: res.data.length,
      messages: res.data.slice(0, 5).map((c: any) => c.commit?.message || ''),
    };
  } catch {
    return { count: 0, messages: [] };
  }
}

export function calculateComplexityScore(repo: any): number {
  let score = 0;
  score += Math.min((repo.stargazers_count || 0) * 2, 30);
  score += Math.min((repo.size || 0) / 100, 20);
  score += Math.min((repo.topics?.length || 0) * 3, 15);
  score += Math.min((repo.forks_count || 0) * 1.5, 20);
  const updatedAt = new Date(repo.updated_at);
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  if (updatedAt > ninetyDaysAgo) score += 15;
  return Math.min(Math.round(score), 100);
}

export function detectTechnologies(languages: Record<string, number>, topics: string[]): string[] {
  const tech = new Set<string>();
  Object.keys(languages).forEach((lang) => tech.add(lang));
  topics.forEach((topic) => tech.add(topic));
  return Array.from(tech).map((t) => t.toLowerCase()).filter(Boolean);
}

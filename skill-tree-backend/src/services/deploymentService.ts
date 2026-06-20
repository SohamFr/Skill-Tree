import fetch from "node-fetch";
import prisma from "../lib/prisma";

interface DeploymentResult {
  url: string;
  isAccessible: boolean;
  statusCode: number;
  responseTime: number;
  isHttps: boolean;
  finalUrl: string;
  serverHeader: string | null;
  contentType: string | null;
}

type PageSpeedResult = {
  performanceScore: number;
  accessibilityScore: number;
  seoScore: number;
  fcp: string;
  lcp: string;
  tbt: string;
  cls: string;
} | null;

interface FullVerification {
  deployment: DeploymentResult;
  pageSpeed: PageSpeedResult;
  overallScore: number;
}

export async function checkDeploymentStatus(url: string): Promise<DeploymentResult> {
  const normalized = url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `https://${url}`;

  const start = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(normalized, {
      signal: controller.signal as any,
      redirect: "follow",
    });

    const responseTime = Date.now() - start;
    const isAccessible = response.status >= 200 && response.status < 400;

    return {
      url: normalized,
      isAccessible,
      statusCode: response.status,
      responseTime,
      isHttps: normalized.startsWith("https"),
      finalUrl: response.url,
      serverHeader: response.headers.get("server"),
      contentType: response.headers.get("content-type"),
    };
  } catch {
    return {
      url: normalized,
      isAccessible: false,
      statusCode: 0,
      responseTime: Date.now() - start,
      isHttps: normalized.startsWith("https"),
      finalUrl: normalized,
      serverHeader: null,
      contentType: null,
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function runPageSpeedAnalysis(url: string): Promise<PageSpeedResult> {
  const apiKey = process.env.PAGESPEED_API_KEY;
  if (!apiKey) return null;

  try {
    const params = new URLSearchParams();
    params.append("url", url);
    params.append("key", apiKey);
    params.append("strategy", "mobile");
    params.append("category", "performance");
    params.append("category", "accessibility");
    params.append("category", "seo");

    const psController = new AbortController();
    const psTimeout = setTimeout(() => psController.abort(), 15000);

    const res = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`,
      { signal: psController.signal as any }
    );
    clearTimeout(psTimeout);
    const data: any = await res.json();
    const lh = data.lighthouseResult;

    if (!lh) return null;

    return {
      performanceScore: Math.round(lh.categories.performance.score * 100),
      accessibilityScore: Math.round(lh.categories.accessibility.score * 100),
      seoScore: Math.round(lh.categories.seo.score * 100),
      fcp: lh.audits["first-contentful-paint"]?.displayValue || "N/A",
      lcp: lh.audits["largest-contentful-paint"]?.displayValue || "N/A",
      tbt: lh.audits["total-blocking-time"]?.displayValue || "N/A",
      cls: lh.audits["cumulative-layout-shift"]?.displayValue || "N/A",
    };
  } catch {
    return null;
  }
}

export async function verifyDeployment(
  url: string,
  developerId: string
): Promise<FullVerification> {
  const [deployment, pageSpeed] = await Promise.all([
    checkDeploymentStatus(url),
    runPageSpeedAnalysis(url),
  ]);

  let overallScore = 0;
  overallScore += deployment.isAccessible ? 40 : 0;
  overallScore += deployment.isHttps ? 20 : 0;

  if (deployment.responseTime < 1000) {
    overallScore += 20;
  } else if (deployment.responseTime < 2000) {
    overallScore += 10;
  }

  if (pageSpeed) {
    overallScore += Math.min(pageSpeed.performanceScore * 0.2, 20);
  }

  await prisma.deployment.create({
    data: {
      developerId,
      url: deployment.url,
      status: `${deployment.statusCode}`,
      responseTime: deployment.responseTime,
      isHttps: deployment.isHttps,
      isAccessible: deployment.isAccessible,
      lighthouseScore: pageSpeed ? pageSpeed.performanceScore : null,
    },
  });

  return { deployment, pageSpeed, overallScore: Math.round(overallScore) };
}

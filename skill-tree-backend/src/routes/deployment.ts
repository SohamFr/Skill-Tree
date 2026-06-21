import { Router, Request, Response } from 'express';
import axios from 'axios';
import https from 'https';

const router = Router();

interface DeploymentCheckResult {
  isAccessible: boolean;
  statusCode: number;
  responseTime: number;
  finalUrl: string;
  isHttps: boolean;
  contentType: string;
  serverHeader: string;
  method?: string;
  error?: string;
}

interface PageSpeedResponse {
  lighthouseResult?: {
    categories?: {
      performance?: { score?: number };
      accessibility?: { score?: number };
      seo?: { score?: number };
    };
    audits?: {
      'first-contentful-paint'?: { displayValue?: string };
      'largest-contentful-paint'?: { displayValue?: string };
      'total-blocking-time'?: { displayValue?: string };
      'cumulative-layout-shift'?: { displayValue?: string };
    };
  };
}

interface PageSpeedResult {
  performanceScore: number;
  accessibilityScore: number;
  seoScore: number;
  fcp: string;
  lcp: string;
  tbt: string;
  cls: string;
}

async function checkUrl(url: string): Promise<DeploymentCheckResult> {
  const start = Date.now();
  const methods: Array<'HEAD' | 'GET'> = ['HEAD', 'GET'];

  for (const method of methods) {
    try {
      const response = await axios({
        method,
        url,
        timeout: 10000,
        maxRedirects: 5,
        validateStatus: () => true,
        httpsAgent: new https.Agent({ family: 4 }),
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });

      const responseTime = Date.now() - start;

      if (method === 'HEAD' && response.status === 405) {
        continue;
      }

      const isAccessible = response.status < 500;

      return {
        isAccessible,
        statusCode: response.status,
        responseTime,
        finalUrl: response.request?.res?.responseUrl || url,
        isHttps: url.startsWith('https://'),
        contentType: response.headers['content-type'] || '',
        serverHeader: response.headers['server'] || '',
        method,
      };
    } catch (err: any) {
      console.log(`Axios ${method} error for ${url}:`, err.message);

      if (method === 'GET') {
        return {
          isAccessible: false,
          statusCode: 0,
          responseTime: Date.now() - start,
          finalUrl: url,
          isHttps: url.startsWith('https://'),
          contentType: '',
          serverHeader: '',
          error: err.message,
          method,
        };
      }
    }
  }

  return {
    isAccessible: false,
    statusCode: 0,
    responseTime: Date.now() - start,
    finalUrl: url,
    isHttps: url.startsWith('https://'),
    contentType: '',
    serverHeader: '',
    error: 'All connection methods failed',
  };
}

async function runPageSpeed(url: string): Promise<PageSpeedResult | null> {
  const key = process.env.PAGESPEED_API_KEY?.trim();
  console.log('PageSpeed key present:', !!key, 'length:', key?.length);

  if (!key) return null;

  try {
    const apiUrl =
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed` +
      `?url=${encodeURIComponent(url)}` +
      `&key=${key}` +
      `&strategy=mobile` +
      `&category=performance` +
      `&category=accessibility` +
      `&category=seo`;

    const res = await fetch(apiUrl, { signal: AbortSignal.timeout(30000) });

    if (!res.ok) return null;

    const data = (await res.json()) as PageSpeedResponse;
    const cats = data.lighthouseResult?.categories;
    const audits = data.lighthouseResult?.audits;

    if (!cats) return null;

    return {
      performanceScore: Math.round((cats.performance?.score || 0) * 100),
      accessibilityScore: Math.round((cats.accessibility?.score || 0) * 100),
      seoScore: Math.round((cats.seo?.score || 0) * 100),
      fcp: audits?.['first-contentful-paint']?.displayValue || 'N/A',
      lcp: audits?.['largest-contentful-paint']?.displayValue || 'N/A',
      tbt: audits?.['total-blocking-time']?.displayValue || 'N/A',
      cls: audits?.['cumulative-layout-shift']?.displayValue || 'N/A',
    };
  } catch {
    return null;
  }
}

router.post('/verify', async (req: Request, res: Response) => {
  try {
    let { url } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    console.log('Verifying URL:', url);

    const [status, pagespeed] = await Promise.all([
      checkUrl(url),
      runPageSpeed(url),
    ]);

    console.log('Status result:', JSON.stringify(status));
    console.log('PageSpeed result:', JSON.stringify(pagespeed));

    let overallScore = 0;

    if (status.isAccessible) overallScore += 40;
    if (status.isHttps) overallScore += 20;
    if (status.responseTime < 1000) overallScore += 20;
    else if (status.responseTime < 2000) overallScore += 10;

    if (pagespeed?.performanceScore) {
      overallScore += Math.min(Math.round(pagespeed.performanceScore * 0.2), 20);
    }

    return res.json({
      success: true,
      data: {
        deployment: status,
        pageSpeed: pagespeed,
        overallScore,
        verifiedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/history/:developerId', async (_req: Request, res: Response) => {
  return res.json({ success: true, data: [] });
});

export default router;
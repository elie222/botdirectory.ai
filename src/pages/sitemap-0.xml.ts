import type { APIRoute } from 'astro';
import { SITE } from '../config';
import { CATEGORIES } from '../lib/constants';
import { getBots } from '../lib/data';
import { botLastModified, categorySlug, listIntegrations, newestBotDate } from '../lib/seo';
import { escapeXml } from '../lib/xml';

interface SitemapEntry {
  path: string;
  lastmod?: string;
}

function entryXml(entry: SitemapEntry): string {
  const lastmod = entry.lastmod ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : '';
  return `  <url>\n    <loc>${escapeXml(`${SITE.url}${entry.path}`)}</loc>${lastmod}\n  </url>`;
}

export const GET: APIRoute = async () => {
  const bots = await getBots();
  const newest = newestBotDate(bots);
  const integrations = listIntegrations(bots);
  const latestByCategory = new Map<string, string>();
  const latestByIntegration = new Map<string, string>();
  let collectionLastmod: string | undefined;

  const recordLatest = (dates: Map<string, string>, key: string, date: string) => {
    if (date > (dates.get(key) ?? '')) dates.set(key, date);
  };
  for (const bot of bots) {
    const date = botLastModified(bot);
    recordLatest(latestByCategory, bot.category, date);
    for (const integration of bot.integrations) recordLatest(latestByIntegration, integration, date);
    if (bot.slug.includes('chief-of-staff') && date > (collectionLastmod ?? '')) collectionLastmod = date;
  }

  const entries: SitemapEntry[] = [
    { path: '/', lastmod: newest },
    { path: '/categories/', lastmod: newest },
    { path: '/integrations/', lastmod: newest },
    { path: '/sources/', lastmod: newest },
    { path: '/collections/chief-of-staff/', lastmod: collectionLastmod },
    { path: '/api/' },
    { path: '/grokbot/' },
    { path: '/sponsor/' },
    ...CATEGORIES.map((category) => ({
      path: `/categories/${categorySlug(category)}/`,
      lastmod: latestByCategory.get(category),
    })),
    ...integrations.map((integration) => ({
      path: `/integrations/${integration.slug}/`,
      lastmod: latestByIntegration.get(integration.name),
    })),
    ...bots.map((bot) => ({ path: `/bots/${bot.slug}/`, lastmod: botLastModified(bot) })),
  ];

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.map(entryXml).join('\n')}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};

import type { APIRoute } from 'astro';
import { SITE } from '../config';
import { getBots } from '../lib/data';
import { promptExcerpt } from '../lib/text';
import { escapeXml } from '../lib/xml';

export const GET: APIRoute = async () => {
  const bots = [...(await getBots())]
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt) || a.name.localeCompare(b.name))
    .slice(0, 50);
  const items = bots.map((bot) => {
    const url = `${SITE.url}/bots/${bot.slug}/`;
    return `    <item>
      <title>${escapeXml(bot.name)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${new Date(bot.addedAt).toUTCString()}</pubDate>
      <category>${escapeXml(bot.category)}</category>
      <description>${escapeXml(promptExcerpt(bot.prompt, 320))}</description>
    </item>`;
  });

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE.wordmark)} — new bot prompts</title>
    <link>${SITE.url}/</link>
    <description>${escapeXml(SITE.tagline)}</description>
    <language>en</language>
${items.join('\n')}
  </channel>
</rss>
`,
    { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } },
  );
};

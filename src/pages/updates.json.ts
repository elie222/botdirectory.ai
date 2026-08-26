import type { APIRoute } from 'astro';
import { SITE } from '../config';
import { getBots } from '../lib/data';
import { sourcePlatformName } from '../lib/sources';
import { promptExcerpt } from '../lib/text';

/** Lightweight directory metadata for recurring agent checks. */
export const GET: APIRoute = async () => {
  const bots = [...(await getBots())].sort(
    (a, b) => b.addedAt.localeCompare(a.addedAt) || a.name.localeCompare(b.name),
  );

  return new Response(
    JSON.stringify({
      version: 1,
      generatedAt: new Date().toISOString(),
      count: bots.length,
      items: bots.map((bot) => ({
        slug: bot.slug,
        name: bot.name,
        summary: promptExcerpt(bot.prompt, 240),
        category: bot.category,
        integrations: bot.integrations,
        addedAt: bot.addedAt,
        detailUrl: `${SITE.url}/bots/${bot.slug}/`,
        sources: bot.sources.map((source) => ({
          platform: sourcePlatformName(source.kind),
          url: source.url,
        })),
      })),
    }),
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=60',
      },
    },
  );
};

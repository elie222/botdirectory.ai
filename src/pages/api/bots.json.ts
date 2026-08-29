import { SITE } from '../../config';
import { getBots } from '../../lib/data';

/** Public, machine-readable directory feed. Listings are newest first. */
export async function GET() {
  const bots = [...(await getBots())].sort(
    (a, b) => b.addedAt.localeCompare(a.addedAt) || a.name.localeCompare(b.name),
  );

  return new Response(
    JSON.stringify({
      version: 1,
      bots: bots.map((bot) => ({
        slug: bot.slug,
        name: bot.name,
        category: bot.category,
        addedAt: bot.addedAt,
        integrations: bot.integrations,
        // prompt is null when the listing only has a public description (not copy-paste instructions).
        prompt: bot.prompt.trim() ? bot.prompt : null,
        description: bot.description?.trim() ? bot.description : null,
        contributor: bot.contributor ?? null,
        sourceUrl: bot.url ?? null,
        grokShareUrl: bot.grokShareUrl ?? null,
        sources: bot.sources,
        detailUrl: `${SITE.url}/bots/${bot.slug}/`,
      })),
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
      },
    },
  );
}

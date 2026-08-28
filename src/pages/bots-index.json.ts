import { getBots } from '../lib/data';

/**
 * Machine-readable dedupe index for the X mention bot: one request replaces
 * per-file GitHub reads. Regenerated on every deploy.
 */
export async function GET() {
  const bots = await getBots();
  return new Response(
    JSON.stringify({
      bots: bots.map((b) => ({
        slug: b.slug,
        url: b.url ?? null,
        grokShareUrl: b.grokShareUrl ?? null,
      })),
    }),
    { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' } },
  );
}

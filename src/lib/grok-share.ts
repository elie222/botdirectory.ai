/**
 * Official Grok Bot public share links.
 * Contract (matched with elie222/botdirectory-automation):
 *   frontmatter: grok_share_url
 *   public JSON:  grokShareUrl
 *   pattern only: https://x.ai/bot/<nanoid-style-id>
 *
 * Recipients open the link, preview on x.ai, and click "Add to Grok Bot".
 * Link only — never scrape or rehost packed configs/skills.
 * See https://docs.x.ai/grok-bot/bots and https://x.ai/legal/bot-sharing-terms.
 */

/** Nanoid URL-safe alphabet; length floor keeps marketing path segments out. */
const GROK_SHARE_PATH = /^\/bot\/([A-Za-z0-9_-]{8,64})$/;

const RESERVED_BOT_IDS = new Set([
  'download',
  'guides',
  'overview',
  'pricing',
  'share',
  'shared',
  'preview',
  'invite',
  'import',
  'legal',
  'docs',
]);

/**
 * True when `value` is exactly an official Grok Bot share URL:
 * `https://x.ai/bot/<nanoid-style-id>` (no www, query, hash, or trailing slash).
 */
export function isOfficialGrokShareUrl(value: string): boolean {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }

  if (url.protocol !== 'https:') return false;
  if (url.hostname.toLowerCase() !== 'x.ai') return false;
  if (url.search !== '' || url.hash !== '') return false;
  // Exact contract: no trailing slash on the id segment.
  if (url.pathname.endsWith('/')) return false;

  const match = url.pathname.match(GROK_SHARE_PATH);
  if (!match) return false;

  const id = match[1]!;
  if (RESERVED_BOT_IDS.has(id.toLowerCase())) return false;

  return true;
}

export const GROK_SHARE_URL_MESSAGE =
  'Must be an official Grok Bot share URL: https://x.ai/bot/<id> (nanoid-style id only)';

/** OpenAPI / docs pattern for the public JSON field. */
export const GROK_SHARE_URL_PATTERN = '^https://x\\.ai/bot/[A-Za-z0-9_-]{8,64}$';

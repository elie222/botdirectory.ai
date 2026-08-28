/**
 * Official Grok Bot public share / preview links live on x.ai.
 * Recipients open the link, preview the bot, and click "Add to Grok Bot".
 * See https://docs.x.ai/grok-bot/bots and https://x.ai/legal/bot-sharing-terms.
 *
 * botdirectory.ai indexes these URLs only — it must not scrape or rehost packed
 * configs/skills. Tweets and other non-share surfaces are rejected.
 */

const X_AI_HOSTS = new Set(['x.ai', 'www.x.ai']);
const TWEET_HOSTS = new Set(['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com']);

/** Bare marketing / docs surfaces that are not a share preview. */
const REJECTED_PATHS = new Set([
  '/',
  '/bot',
  '/bots',
  '/grok',
  '/about',
  '/blog',
  '/news',
  '/careers',
  '/api',
  '/contact',
  '/download',
]);

function parsedUrl(value: string): URL | null {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function normalizedPath(url: URL): string {
  const path = url.pathname.replace(/\/+$/, '');
  return path === '' ? '/' : path;
}

/**
 * True when `value` is an official HTTPS Grok Bot share/preview URL on x.ai.
 * Intentionally rejects tweets and plain marketing pages.
 */
export function isOfficialGrokShareUrl(value: string): boolean {
  const url = parsedUrl(value);
  if (!url) return false;
  if (url.protocol !== 'https:') return false;

  const host = url.hostname.toLowerCase();
  if (TWEET_HOSTS.has(host)) return false;
  if (!X_AI_HOSTS.has(host)) return false;

  if (/\/status\/\d+/.test(url.pathname)) return false;

  const path = normalizedPath(url);
  const hasShareQuery = /[?&](share|shareId|share_id|shareToken|token)=/i.test(url.search);

  // Share query on the product surface still counts as a share link.
  if (hasShareQuery && (path === '/bot' || path === '/bots' || path.startsWith('/bot/'))) {
    return true;
  }

  if (REJECTED_PATHS.has(path)) return false;
  if (path.startsWith('/legal')) return false;
  if (path.startsWith('/bot/guides')) return false;
  if (path.startsWith('/tools')) return false;

  // Share / preview shaped paths (exact product path may evolve; keep flexible).
  if (/\/(share|shared|preview|invite|import)(\/|$)/i.test(path)) return true;
  if (/^\/bot\/s\//i.test(path)) return true;
  if (/^\/b\/[A-Za-z0-9_-]+/i.test(path)) return true;
  if (/^\/bots\/[A-Za-z0-9_-]+/i.test(path)) return true;
  if (hasShareQuery) return true;

  // Deep link under /bot/… with a non-trivial id segment (not a known docs slug).
  const botDeep = path.match(/^\/bot\/([A-Za-z0-9_-]{8,})$/i);
  if (botDeep && !['download', 'guides', 'overview', 'pricing'].includes(botDeep[1]!.toLowerCase())) {
    return true;
  }

  return false;
}

export const GROK_SHARE_URL_MESSAGE =
  'Must be an official HTTPS Grok Bot share/preview URL on x.ai (not a tweet or marketing page)';

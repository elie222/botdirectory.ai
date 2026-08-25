export const SOURCE_KINDS = ['x', 'youtube', 'web'] as const;

export type SourceKind = (typeof SOURCE_KINDS)[number];

export interface Source {
  kind: SourceKind;
  url: string;
  /** Optional YouTube start time for the part that inspired the bot. */
  startSeconds?: number;
}

interface SourceBackedBot {
  slug: string;
  name: string;
  addedAt: string;
  sources: Source[];
}

export interface SourceGroup<T extends SourceBackedBot = SourceBackedBot> extends Source {
  key: string;
  bots: T[];
  latestAddedAt: string;
}

const X_HOSTS = new Set(['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com']);
const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtu.be',
  'www.youtu.be',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
]);

function parsedUrl(value: string): URL | null {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

export function inferSourceKind(url: string): SourceKind {
  const parsed = parsedUrl(url);
  if (!parsed) return 'web';
  const host = parsed.hostname.toLowerCase();
  if (X_HOSTS.has(host) && /\/status\/\d+/.test(parsed.pathname)) return 'x';
  if (YOUTUBE_HOSTS.has(host) && youtubeVideoId(url)) return 'youtube';
  return 'web';
}

export function sourceMatchesKind(source: Source): boolean {
  if (source.kind === 'web') return true;
  return inferSourceKind(source.url) === source.kind;
}

export function xPostId(url: string): string | null {
  const parsed = parsedUrl(url);
  if (!parsed || !X_HOSTS.has(parsed.hostname.toLowerCase())) return null;
  return parsed.pathname.match(/\/status\/(\d+)/)?.[1] ?? null;
}

export function xAuthor(url: string): string | null {
  const parsed = parsedUrl(url);
  if (!parsed || !X_HOSTS.has(parsed.hostname.toLowerCase())) return null;
  const author = parsed.pathname.split('/').filter(Boolean)[0];
  return author && author !== 'i' ? author : null;
}

export function youtubeVideoId(url: string): string | null {
  const parsed = parsedUrl(url);
  if (!parsed || !YOUTUBE_HOSTS.has(parsed.hostname.toLowerCase())) return null;

  const host = parsed.hostname.toLowerCase();
  if (host === 'youtu.be' || host === 'www.youtu.be') {
    return parsed.pathname.split('/').filter(Boolean)[0] ?? null;
  }

  if (parsed.pathname === '/watch') return parsed.searchParams.get('v');
  return parsed.pathname.match(/^\/(?:embed|shorts|live)\/([^/?#]+)/)?.[1] ?? null;
}

function parseTime(value: string | null): number | null {
  if (!value) return null;
  if (/^\d+$/.test(value)) return Number(value);
  const match = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i);
  if (!match) return null;
  return Number(match[1] ?? 0) * 3600 + Number(match[2] ?? 0) * 60 + Number(match[3] ?? 0);
}

export function youtubeStartSeconds(source: Source): number | null {
  if (source.kind !== 'youtube') return null;
  if (Number.isInteger(source.startSeconds) && (source.startSeconds ?? -1) >= 0) {
    return source.startSeconds ?? null;
  }
  const parsed = parsedUrl(source.url);
  return parsed ? parseTime(parsed.searchParams.get('start') ?? parsed.searchParams.get('t')) : null;
}

export function youtubeEmbedUrl(source: Source): string | null {
  const id = youtubeVideoId(source.url);
  if (!id) return null;
  const embed = new URL(`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`);
  embed.searchParams.set('rel', '0');
  embed.searchParams.set('playsinline', '1');
  const start = youtubeStartSeconds(source);
  if (start && start > 0) embed.searchParams.set('start', String(start));
  return embed.href;
}

export function sourceKey(source: Source): string {
  const externalId = source.kind === 'x' ? xPostId(source.url) : source.kind === 'youtube' ? youtubeVideoId(source.url) : null;
  if (externalId) return `${source.kind}:${externalId}`;
  const parsed = parsedUrl(source.url);
  if (!parsed) return `${source.kind}:${source.url}`;
  parsed.hash = '';
  return `${source.kind}:${parsed.href.replace(/\/$/, '')}`;
}

export function resolveSources(explicit: Source[] | undefined, addedVia?: string): Source[] {
  const sources = [...(explicit ?? [])];
  if (addedVia) sources.push({ kind: inferSourceKind(addedVia), url: addedVia });

  const unique = new Map<string, Source>();
  for (const source of sources) {
    const key = sourceKey(source);
    // Explicit entries come first and may carry a useful YouTube timestamp.
    if (!unique.has(key)) unique.set(key, source);
  }
  return [...unique.values()];
}

export function groupSources<T extends SourceBackedBot>(bots: T[]): SourceGroup<T>[] {
  const groups = new Map<string, SourceGroup<T>>();
  for (const bot of bots) {
    for (const source of bot.sources) {
      const key = sourceKey(source);
      const current = groups.get(key);
      if (current) {
        if (!current.bots.some((item) => item.slug === bot.slug)) current.bots.push(bot);
        if (bot.addedAt > current.latestAddedAt) current.latestAddedAt = bot.addedAt;
      } else {
        groups.set(key, { ...source, key, bots: [bot], latestAddedAt: bot.addedAt });
      }
    }
  }
  return [...groups.values()].sort(
    (a, b) => b.latestAddedAt.localeCompare(a.latestAddedAt) || a.key.localeCompare(b.key),
  );
}

export function sourcePlatformName(kind: SourceKind): string {
  if (kind === 'x') return 'X';
  if (kind === 'youtube') return 'YouTube';
  return 'Web';
}

export function sourceContentName(kind: SourceKind): string {
  if (kind === 'x') return 'post';
  if (kind === 'youtube') return 'video';
  return 'source';
}

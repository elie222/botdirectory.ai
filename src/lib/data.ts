import { getCollection } from 'astro:content';
import { slugify, type Category } from './constants';
import { COPIES_API } from '../config';
import sponsorsJson from '../../data/sponsors.json';
import promosJson from '../../data/promos.json';
import { resolveSources, type Source } from './sources';

export interface SponsorCopyVariant {
  id: string;
  tagline: string;
}

export interface Sponsor {
  name: string;
  initial: string;
  family: string;
  tagline: string;
  cta: string;
  url: string;
  /** Path under public/ to a real logo; falls back to the initial tile. */
  logo?: string;
  /** Sticky per-visitor copy test. `tagline` is the no-JS fallback (variant A). */
  ab?: SponsorCopyVariant[];
}

export function sponsorAbAttrs(s: Sponsor): Record<string, string> {
  if (!s.ab?.length) return {};
  return {
    'data-ab-taglines': JSON.stringify(s.ab),
  };
}

export interface Promo {
  at: number;
  name: string;
  category: string;
  family: string;
  integrations: string[];
  contributor: string;
  href: string;
  note: string;
}

export interface Bot {
  slug: string;
  name: string;
  category: Category;
  addedAt: string;
  updatedAt?: string;
  /** Whose setup/prompt this is. Absent for anonymous/deleted sources. */
  contributor?: string;
  /** Where the contributor handle links (X profile, blog…). Defaults to GitHub. */
  contributorUrl?: string;
  /** X handle of whoever tagged/submitted someone else's setup. */
  scoutedBy?: string;
  copies: number;
  integrations: string[];
  prompt: string;
  url?: string;
  addedVia?: string;
  sources: Source[];
}

export const SPONSORS = sponsorsJson as Sponsor[];
export const PROMOS = promosJson as Promo[];

/**
 * Icons that scripts/fetch-icons.ts has mirrored into public/icons/, keyed by
 * file stem (`slack`, `github-dark`, …). Discovered at build time so the
 * extension (svg/png/ico) never has to be known here.
 */
const ICON_FILES = new Map<string, string>();
for (const path of Object.keys(import.meta.glob('../../public/icons/*'))) {
  const file = path.slice(path.lastIndexOf('/') + 1);
  ICON_FILES.set(file.slice(0, file.lastIndexOf('.')), `/icons/${file}`);
}

export interface ToolIcon {
  /** Path under public/ for light backgrounds. */
  light: string;
  /** Variant for the dark theme — only mono logos ship one. */
  dark?: string;
}

let copyCountsPromise: Promise<Record<string, number>> | undefined;

/** Fetch the global, deduplicated copy totals once per build. */
async function getCopyCounts(): Promise<Record<string, number>> {
  if (!COPIES_API.enabled) return {};
  copyCountsPromise ??= fetch(COPIES_API.endpoint, { headers: { Accept: 'application/json' } })
    .then(async (response) => {
      if (!response.ok) throw new Error(`copies API returned ${response.status}`);
      const payload = (await response.json()) as { counts?: unknown };
      if (!payload.counts || typeof payload.counts !== 'object') throw new Error('copies API returned invalid data');
      return payload.counts as Record<string, number>;
    })
    .catch((error) => {
      console.warn('Could not load copy counts; using zeroes for this build.', error);
      return {};
    });
  return copyCountsPromise;
}

/** Brand icon for a tool, or null when we don't have one (the chip then shows just the name). */
export function toolIcon(name: string): ToolIcon | null {
  const slug = slugify(name);
  const light = ICON_FILES.get(slug);
  if (!light) return null;
  const dark = ICON_FILES.get(`${slug}-dark`);
  return dark ? { light, dark } : { light };
}

/** All bots in a stable A–Z build order; the browser applies the selected sort. */
export async function getBots(): Promise<Bot[]> {
  const [entries, copyCounts] = await Promise.all([getCollection('bots'), getCopyCounts()]);
  const bots = entries.map((e) => {
    const explicitSources = e.data.sources?.map((source) => ({
      kind: source.kind,
      url: source.url,
      startSeconds: source.start_seconds,
    }));
    return {
      slug: e.id,
      name: e.data.name,
      category: e.data.category,
      addedAt: e.data.added_at,
      updatedAt: e.data.updated_at,
      contributor: e.data.contributor,
      contributorUrl: e.data.contributor_url,
      scoutedBy: e.data.scouted_by,
      // Counts live server-side (copies API), never in the repo markdown.
      copies: Number.isFinite(copyCounts[e.id]) ? copyCounts[e.id] : 0,
      integrations: e.data.integrations,
      prompt: (e.body ?? '').trim(),
      url: e.data.url,
      addedVia: e.data.added_via,
      sources: resolveSources(explicitSources, e.data.added_via),
    };
  });
  return bots.sort((a, b) => a.name.localeCompare(b.name));
}

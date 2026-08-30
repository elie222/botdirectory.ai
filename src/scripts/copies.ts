// Global copy totals come from the copies API. The browser remembers whether
// it has already copied each slug so repeat clicks never inflate the local UI;
// the API independently enforces one counted copy per (slug, IP).
import { COPIES_API } from '../config';
import { fmt } from '../lib/constants';

const KEY = 'openbots-copies';
const knownCounts = new Map<string, number>();
const copiedThisPage = new Set<string>();

function local(): Record<string, number | boolean> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

function markCopied(slug: string): boolean {
  const copied = local();
  const alreadyCopied = copiedThisPage.has(slug) || Boolean(copied[slug]);
  copiedThisPage.add(slug);
  copied[slug] = true;
  try {
    localStorage.setItem(KEY, JSON.stringify(copied));
  } catch {
    /* private mode */
  }
  return alreadyCopied;
}

function currentCopyCount(slug: string, root: ParentNode = document): number {
  const known = knownCounts.get(slug);
  if (known !== undefined) return known;
  // Prefer the copies badge seed. Do not use bare [data-slug] nodes (e.g. the
  // article wrapper) — they lack data-copies and would read as 0.
  const label = root.querySelector<HTMLElement>(`[data-copies-slug="${slug}"]`);
  if (label) return Number(label.dataset.copiesSeed || '0');
  const row = root.querySelector<HTMLElement>(`[data-slug="${slug}"][data-copies]`);
  return Number(row?.dataset.copies || '0');
}

function setCopyCount(slug: string, copies: number, root: ParentNode = document): void {
  if (!Number.isFinite(copies) || copies < 0) return;
  const value = Math.floor(copies);
  knownCounts.set(slug, value);
  root.querySelectorAll<HTMLElement>(`[data-slug="${slug}"]`).forEach((row) => {
    row.dataset.copies = String(value);
  });
  root.querySelectorAll<HTMLElement>(`[data-copies-slug="${slug}"]`).forEach((label) => {
    label.dataset.copiesSeed = String(value);
    label.textContent = `${fmt(value)} copies`;
  });
}

/** Refresh live totals and row sort values from the global counter. */
export async function loadCopyCounts(root: ParentNode = document): Promise<void> {
  if (!COPIES_API.enabled) return;
  try {
    const response = await fetch(COPIES_API.endpoint, { headers: { Accept: 'application/json' } });
    if (!response.ok) return;
    const payload = (await response.json()) as { counts?: Record<string, number> };
    if (!payload.counts || typeof payload.counts !== 'object') return;
    for (const [slug, copies] of Object.entries(payload.counts)) {
      // A POST response is newer than a GET that may have been cached for 60s.
      if (!copiedThisPage.has(slug)) setCopyCount(slug, copies, root);
    }
  } catch {
    /* build-time totals remain as the fallback */
  }
}

export function trackCopy(slug: string): void {
  if (!slug) return;
  const alreadyCopied = markCopied(slug);
  if (!alreadyCopied) setCopyCount(slug, currentCopyCount(slug) + 1);

  if (COPIES_API.enabled) {
    try {
      fetch(COPIES_API.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
        keepalive: true,
      })
        .then(async (response) => {
          if (!response.ok) return;
          const result = (await response.json()) as { copies?: number };
          if (typeof result.copies === 'number') setCopyCount(slug, result.copies);
        })
        .catch(() => {});
    } catch {
      /* fire and forget */
    }
  }
}

/**
 * Refresh every element carrying data-copies-slug/data-copies-seed.
 */
export function refreshCopyLabels(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-copies-slug]').forEach((el) => {
    const slug = el.dataset.copiesSlug || '';
    const seed = Number(el.dataset.copiesSeed || '0');
    el.textContent = `${fmt(knownCounts.get(slug) ?? seed)} copies`;
  });
}

export { fmt };

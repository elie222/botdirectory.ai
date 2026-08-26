/**
 * Every branded string, URL and knob for the site lives here — nowhere else.
 * Change the repo URL / handles / sponsor numbers in this one file.
 */

export type SponsorMode = 'rail' | 'both' | 'inline';

export const SITE_URL = 'https://botdirectory.ai';
export const API_URL = 'https://api.botdirectory.ai';
export const SITE_INFO_LAST_MODIFIED = '2026-08-26';

export const SITE = {
  /** Wordmark shown in the header, footer and `<title>` suffix. */
  wordmark: 'botdirectory.ai',
  /** Canonical origin (no trailing slash). */
  url: SITE_URL,
  /** Default meta description / footer blurb. */
  tagline: 'Ready-to-use prompts for Grok Bot, Rakazo, and other AI agents. Copy one, connect your tools, done.',
  /** X handle the mention bot listens on. */
  xHandle: '@botdirectoryai',
  xUrl: 'https://x.com/botdirectoryai',
  contactEmail: 'elie@getinboxzero.com',

  /** Public GitHub repository. */
  repoUrl: 'https://github.com/elie222/botdirectory.ai',
  contributingUrl: 'https://github.com/elie222/botdirectory.ai/blob/main/CONTRIBUTING.md',

  /** Products linked from the header / footer / copy. */
  rakazoUrl: 'https://rakazo.com?utm_source=botdirectory.ai&utm_medium=referral',
  grokBotUrl: 'https://x.ai/bot?utm_source=botdirectory.ai&utm_medium=referral',
  grokUrl: 'https://grok.com?utm_source=botdirectory.ai&utm_medium=referral',
  inboxZeroUrl: 'https://getinboxzero.com?utm_source=botdirectory.ai&utm_medium=referral',

  copyrightHolder: 'Inbox Zero Inc.',
  copyrightYear: 2026,

  /** Where "Sponsor" points until a real booking flow exists. */
  sponsorContactUrl: 'mailto:elie@getinboxzero.com',
} as const;

export const SPONSORING = {
  /**
   * Slot layout. 'rail' (default): right rail next to the list.
   * 'both': sticky page-edge columns ≥1440px. 'inline': promos spliced
   * into the list at fixed indexes (data/promos.json).
   */
  mode: 'both' as SponsorMode,
  /**
   * Edge-card look (design prop `sponsorCardStyle`). 'plain': white card,
   * colored logo tile. 'tinted': full-card color wash per sponsor family
   * (TrustMRR-style).
   */
  cardStyle: 'tinted' as 'plain' | 'tinted',
  /** "3 of 6 taken" line next to the rail. */
  slotsTaken: 3,
  slotsTotal: 6,
  /** "N of M taken" when mode === 'both'. */
  slotsTakenBoth: 14,
  slotsTotalBoth: 15,
  /** Stripe payment link for booking a slot. */
  paymentUrl: 'https://buy.stripe.com/bJedRa7U18bw9tH7Gi4ko04',
  /** Current monthly price in USD — rises as slots fill. */
  priceMonthly: 1200,
  /** Copy inside the "Your tool here" empty slot. */
  railPitch: 'Reach people setting up bots right now. $1200/mo.',
} as const;

export const COPIES_API = {
  /**
   * When true, every prompt copy also fires a fire-and-forget
   * POST { slug } to `endpoint` so counts aggregate globally.
   * The endpoint is the Cloudflare Worker in ../botdirectory-automation/api —
   * flip on once it's deployed and `endpoint` points at it.
   */
  enabled: true,
  endpoint: `${API_URL}/api/copies`,
} as const;

export const NEWSLETTER_API = {
  /** Public, keyless endpoint used by people and bots to subscribe an email. */
  endpoint: `${API_URL}/api/newsletter`,
  /** Keep local form submissions in the local D1 database during development. */
  localEndpoint: 'http://localhost:8787/api/newsletter',
} as const;

/**
 * Contextual sponsor in the bot pages' "Connect first" section — separate
 * inventory from the sidebar slots (not part of sponsors.json rotation).
 */
export const CONNECT_SPONSOR = {
  enabled: true,
  name: 'Executor',
  logo: '/images/sponsors/executor.png',
  url: 'https://executor.sh',
  copy: 'Tired of signing in to each service for every harness? Executor signs you in once — every client shares the credentials.',
  cta: 'Try Executor →',
} as const;

export const FEATURES = {
  /**
   * Show copy counts (table column, card meta, bot-page badge) and the
   * "Most copied" sort. Totals come from the deduplicated copies API.
   */
  showCopies: true,
} as const;

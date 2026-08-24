import { slugify, type Category } from './constants';
import type { Bot } from './data';
import { SITE } from '../config';

export const MIN_INTEGRATION_HUB_BOTS = 5;

interface CategoryPageCopy {
  title: string;
  description: string;
  intro: string;
}

export const CATEGORY_PAGE_COPY: Record<Category, CategoryPageCopy> = {
  Productivity: {
    title: 'Productivity Grok Bot Prompts',
    description: 'Copy productivity Grok Bot prompts for planning, research, meetings, inboxes, and daily work.',
    intro: 'Turn recurring personal and team work into a bot you can run on demand or on a schedule. These prompts cover planning, research, meetings, inboxes, and everyday execution.',
  },
  Sales: {
    title: 'Sales Grok Bot Prompts',
    description: 'Copy sales Grok Bot prompts for prospecting, account research, follow-up, CRM work, and pipeline reviews.',
    intro: 'Build repeatable sales workflows for research, outreach, meeting preparation, follow-up, and pipeline management. Each prompt names the tools it needs before you start.',
  },
  Marketing: {
    title: 'Marketing Grok Bot Prompts',
    description: 'Copy marketing Grok Bot prompts for content, SEO, social media, campaigns, research, and reporting.',
    intro: 'Use these prompts to turn research, content, SEO, campaign, and reporting workflows into reusable bots. Copy one as written or adapt it to your team and channels.',
  },
  Ops: {
    title: 'Operations Grok Bot Prompts',
    description: 'Copy operations Grok Bot prompts for triage, reporting, handoffs, support, and recurring business workflows.',
    intro: 'Keep recurring operational work moving with bots for triage, reporting, handoffs, coordination, and internal processes. Every listing includes the full setup prompt.',
  },
  Success: {
    title: 'Customer Success Grok Bot Prompts',
    description: 'Copy customer success Grok Bot prompts for onboarding, account health, support, renewals, and follow-up.',
    intro: 'Create consistent customer workflows for onboarding, support, account health, renewals, and follow-up. The prompts are ready to copy and easy to adjust to your playbook.',
  },
  Personal: {
    title: 'Personal Grok Bot Prompts',
    description: 'Copy personal Grok Bot prompts for planning, travel, learning, shopping, health routines, and daily life.',
    intro: 'Set up practical bots for planning, travel, learning, shopping, routines, and the rest of daily life. Start with a complete prompt, then personalize it as the bot walks you through setup.',
  },
};

export function categorySlug(category: Category): string {
  return slugify(category);
}

export function integrationSlug(integration: string): string {
  return slugify(integration);
}

export function listIntegrations(bots: Bot[], minimum = MIN_INTEGRATION_HUB_BOTS) {
  const counts = new Map<string, number>();
  for (const bot of bots) {
    for (const integration of bot.integrations) {
      counts.set(integration, (counts.get(integration) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .filter(([, count]) => count >= minimum)
    .map(([name, count]) => ({ name, slug: integrationSlug(name), count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function integrationDescription(integration: string, count: number): string {
  return `Browse ${count} ready-to-copy Grok Bot prompts that use ${integration}. Compare workflows, required tools, and full setup instructions.`;
}

export function relatedBots(bot: Bot, bots: Bot[], limit = 3): Bot[] {
  const tools = new Set(bot.integrations);
  const ranked: Array<{ candidate: Bot; score: number }> = [];
  const compare = (a: (typeof ranked)[number], b: (typeof ranked)[number]) =>
    b.score - a.score ||
    b.candidate.copies - a.candidate.copies ||
    b.candidate.addedAt.localeCompare(a.candidate.addedAt) ||
    a.candidate.name.localeCompare(b.candidate.name);

  for (const candidate of bots) {
    if (candidate.slug === bot.slug) continue;
    const score =
      candidate.integrations.filter((integration) => tools.has(integration)).length * 3 +
      (candidate.category === bot.category ? 1 : 0);
    if (score === 0) continue;
    ranked.push({ candidate, score });
    ranked.sort(compare);
    if (ranked.length > limit) ranked.pop();
  }

  return ranked.map(({ candidate }) => candidate);
}

export function botDescription(bot: Bot): string {
  const tools = bot.integrations.slice(0, 3).join(', ');
  const more = bot.integrations.length > 3 ? ` and ${bot.integrations.length - 3} more` : '';
  const detailed = `Copy the ${bot.name} Grok Bot prompt. Set up a ${bot.category.toLowerCase()} workflow with ${tools}${more}, then review it before the bot runs.`;
  return detailed.length <= 165
    ? detailed
    : `Copy the ${bot.name} Grok Bot prompt for a ${bot.category.toLowerCase()} workflow. See the required integrations, setup steps, and approval guardrails.`;
}

export function botLastModified(bot: Bot): string {
  return bot.updatedAt ?? bot.addedAt;
}

export function newestBotDate(bots: Bot[]): string | undefined {
  return bots.reduce<string | undefined>((newest, bot) => {
    const date = botLastModified(bot);
    return !newest || date > newest ? date : newest;
  }, undefined);
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function collectionStructuredData(options: {
  name: string;
  url: string;
  description: string;
  bots: Bot[];
  breadcrumbs: BreadcrumbItem[];
}) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: options.name,
      url: options.url,
      description: options.description,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: options.bots.length,
        itemListElement: options.bots.map((bot, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: bot.name,
          url: `${SITE.url}/bots/${bot.slug}/`,
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: options.breadcrumbs.map((breadcrumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: breadcrumb.name,
        item: breadcrumb.url,
      })),
    },
  ];
}

import type { APIRoute } from 'astro';
import { SITE } from '../config';
import { CATEGORIES } from '../lib/constants';
import { getBots } from '../lib/data';
import { categorySlug, listIntegrations } from '../lib/seo';

export const GET: APIRoute = async () => {
  const bots = await getBots();
  const integrations = listIntegrations(bots);
  const text = `# ${SITE.wordmark}

> A public directory of ready-to-copy prompts for Grok Bot, Rakazo, and other AI agents.

## Main resources

- [Browse all ${bots.length} bot prompts](${SITE.url}/)
- [Prompt categories](${SITE.url}/categories/)
- [Prompts by integration](${SITE.url}/integrations/)
- [Chief of Staff prompt collection](${SITE.url}/collections/chief-of-staff/)
- [Public API documentation](${SITE.url}/api/)
- [Full JSON feed](${SITE.url}/api/bots.json)
- [RSS feed](${SITE.url}/rss.xml)
- [Source repository](${SITE.repoUrl})

## Categories

${CATEGORIES.map((category) => `- [${category}](${SITE.url}/categories/${categorySlug(category)}/)`).join('\n')}

## Popular integrations

${integrations.slice(0, 20).map((integration) => `- [${integration.name} (${integration.count} prompts)](${SITE.url}/integrations/${integration.slug}/)`).join('\n')}
`;

  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

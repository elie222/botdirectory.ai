import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CATEGORIES } from './lib/constants';

const httpsUrl = z.string().url().refine((value) => value.startsWith('https://'), 'Must use HTTPS');

const bots = defineCollection({
  loader: glob({ pattern: '*.md', base: './bots' }),
  schema: z.object({
    name: z.string().min(1),
    category: z.enum(CATEGORIES),
    /** UTC timestamp when the listing was added to the directory. */
    added_at: z.string().datetime(),
    /** Update when the prompt or listing changes materially after publication. */
    updated_at: z.string().datetime().optional(),
    /** Whose setup this is. Optional — some sources are anonymous. */
    contributor: z.string().min(1).optional(),
    /** Where the contributor handle links. Defaults to github.com/<contributor>. */
    contributor_url: z.string().url().optional(),
    /** X handle of whoever tagged/submitted someone else's setup. */
    scouted_by: z.string().min(1).optional(),
    integrations: z.array(z.string().min(1)).min(1),
    /** Official integration homepages, used only to retrieve favicons at deploy time. */
    integration_urls: z.record(z.string().min(1), httpsUrl).optional(),
    /** Optional canonical homepage/GitHub of the bot (dedupe key). */
    url: z.string().url().optional(),
    /** Optional source tweet URL when added by the X mention bot. */
    added_via: z.string().url().optional(),
  }).superRefine((bot, ctx) => {
    if (bot.updated_at && bot.updated_at < bot.added_at) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['updated_at'],
        message: 'Must be on or after added_at',
      });
    }
    for (const name of Object.keys(bot.integration_urls ?? {})) {
      if (!bot.integrations.includes(name)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['integration_urls', name],
          message: 'Must match a name in integrations',
        });
      }
    }
  }),
});

export const collections = { bots };

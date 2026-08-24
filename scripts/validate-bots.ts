/**
 * Validates every file in bots/ against the contribution contract.
 * Run with: pnpm validate
 *
 * Checks: frontmatter schema (including `added_at`), filename = slug(name),
 * unique slug, known category, non-empty prompt body, unique `url` (dedupe key).
 * Integrations are free-form strings — any tool name is welcome; entries
 * in data/tool-icons.json only add a brand icon. Copy counts are server-side
 * (the copies API), never in the repo markdown.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import { CATEGORIES, slugify } from '../src/lib/constants';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BOTS_DIR = join(ROOT, 'bots');

const httpsUrl = z.string().url().refine((value) => value.startsWith('https://'), 'Must use HTTPS');

const schema = z
  .object({
    name: z.string().min(1),
    category: z.enum(CATEGORIES),
    added_at: z.string().datetime(),
    updated_at: z.string().datetime().optional(),
    contributor: z.string().min(1).optional(),
    contributor_url: z.string().url().optional(),
    scouted_by: z.string().min(1).optional(),
    integrations: z.array(z.string().min(1)).min(1),
    integration_urls: z.record(z.string().min(1), httpsUrl).optional(),
    url: z.string().url().optional(),
    added_via: z.string().url().optional(),
  })
  .strict()
  .superRefine((bot, ctx) => {
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
  });

const errors: string[] = [];
const seenSlugs = new Map<string, string>();
const seenUrls = new Map<string, string>();

const files = readdirSync(BOTS_DIR).filter((f) => f.endsWith('.md')).sort();
if (files.length === 0) errors.push('bots/ contains no markdown files');

for (const file of files) {
  const raw = readFileSync(join(BOTS_DIR, file), 'utf8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    errors.push(`${file}: missing frontmatter block (--- ... ---)`);
    continue;
  }

  let data: unknown;
  try {
    data = parseYaml(match[1]!);
  } catch (e) {
    errors.push(`${file}: invalid YAML frontmatter — ${(e as Error).message}`);
    continue;
  }

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      errors.push(`${file}: ${issue.path.join('.') || 'frontmatter'} — ${issue.message}`);
    }
    continue;
  }
  const bot = parsed.data;

  const slug = slugify(bot.name);
  const stem = file.replace(/\.md$/, '');
  if (stem !== slug) {
    errors.push(`${file}: filename must equal the slug of the name — expected "${slug}.md"`);
  }
  const dupe = seenSlugs.get(slug);
  if (dupe) errors.push(`${file}: slug "${slug}" already used by ${dupe}`);
  else seenSlugs.set(slug, file);

  const body = raw.slice(match[0].length).trim();
  if (!body) errors.push(`${file}: prompt body is empty`);

  if (bot.url) {
    const urlDupe = seenUrls.get(bot.url);
    if (urlDupe) errors.push(`${file}: url "${bot.url}" already used by ${urlDupe} (duplicate bot?)`);
    else seenUrls.set(bot.url, file);
  }
}

if (errors.length) {
  console.error(`✖ ${errors.length} problem${errors.length === 1 ? '' : 's'} found:\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`✓ ${files.length} bot files valid`);

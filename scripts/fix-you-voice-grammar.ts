/**
 * Fix subject-verb agreement after bulk "You ${verb}s" conversion.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const BOTS_DIR = join(resolve(dirname(fileURLToPath(import.meta.url)), '..'), 'bots');

const verbMap: Record<string, string> = {
  builds: 'build',
  runs: 'run',
  sends: 'send',
  watches: 'watch',
  finds: 'find',
  keeps: 'keep',
  turns: 'turn',
  handles: 'handle',
  manages: 'manage',
  drafts: 'draft',
  launches: 'launch',
  closes: 'close',
  persists: 'persist',
  tells: 'tell',
  operates: 'operate',
  acts: 'act',
  records: 'record',
  fills: 'fill',
  stays: 'stay',
  helps: 'help',
  creates: 'create',
  audits: 'audit',
  monitors: 'monitor',
  tracks: 'track',
  scans: 'scan',
  pulls: 'pull',
  writes: 'write',
  reads: 'read',
  reviews: 'review',
  scores: 'score',
  generates: 'generate',
  coordinates: 'coordinate',
  surfaces: 'surface',
  flags: 'flag',
  prepares: 'prepare',
  compares: 'compare',
  checks: 'check',
  interprets: 'interpret',
  identifies: 'identify',
  gives: 'give',
  accepts: 'accept',
  clarifies: 'clarify',
  suggests: 'suggest',
  improves: 'improve',
  returns: 'return',
  exists: 'exist',
  specializes: 'specialize',
  questions: 'question',
  uses: 'use',
};

let fixed = 0;
for (const file of readdirSync(BOTS_DIR).filter((f) => f.endsWith('.md'))) {
  const path = join(BOTS_DIR, file);
  const raw = readFileSync(path, 'utf8');
  const match = raw.match(/^(---\r?\n[\s\S]*?\r?\n---\r?\n?)([\s\S]*)$/);
  if (!match) continue;
  let body = match[2] ?? '';
  const before = body;

  body = body.replace(/\bYou ([a-z]+)\b/g, (full, verb: string) => {
    const base = verbMap[verb];
    return base ? `You ${base}` : full;
  });

  body = body.replace(/\bso I never reconstructs\b/g, 'so I never reconstruct');
  body = body.replace(/\band me explicitly approves\b/g, 'and I explicitly approve');
  body = body.replace(/\band me explicitly\b/g, 'and I explicitly');
  body = body.replace(/\buntil me explicitly\b/g, 'until I explicitly');
  body = body.replace(/\bme explicitly approves\b/g, 'I explicitly approve');

  if (/^You exist to\b/m.test(body)) {
    body = body.replace(/\bIt never\b/g, 'You never');
    body = body.replace(/\bIt specializes\b/g, 'You specialize');
    body = body.replace(/\bIt always\b/g, 'You always');
    body = body.replace(/\bIt questions\b/g, 'You question');
    body = body.replace(/\bIt uses\b/g, 'You use');
    body = body.replace(/\bIt is critical\b/g, 'You are critical');
  }

  if (file === 'gatekeeper.md') {
    body = body.replace(
      /\bWhen they bring a new idea, do not help them do it first\./,
      'When I bring a new idea, do not help me do it first.',
    );
    body = body.replace(
      /\bthings they deliberately did not pursue\./,
      'things I deliberately did not pursue.',
    );
  }

  if (body !== before) {
    writeFileSync(path, match[1] + body.replace(/^\n*/, '\n').replace(/\n*$/, '\n'));
    fixed++;
  }
}

console.log(`fixed ${fixed} files`);

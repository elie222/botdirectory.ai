/**
 * One-shot migration:
 * 1) Move public x.ai blurbs (share-URL listings that are not real prompts)
 *    into frontmatter `description` and clear the markdown body.
 * 2) Rewrite real prompt bodies that still use "Set up a new bot…" or clear
 *    third-person voice into second-person You-voice.
 *
 * Preserves original frontmatter bytes except when inserting `description`.
 *
 * Run: pnpm exec tsx scripts/migrate-prompt-description.ts
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BOTS_DIR = join(ROOT, 'bots');

const stats = {
  relabeled: 0,
  youVoice: 0,
  untouched: 0,
  skipped: 0,
};

function yamlDoubleQuoted(value: string): string {
  // Always a single-line YAML double-quoted scalar (safe for colons, etc.).
  return `"${value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, ' ')
    .replace(/\r/g, '')
    .replace(/\t/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()}"`;
}

function looksLikeRealPrompt(body: string): boolean {
  const text = body.trim();
  if (!text) return false;
  const words = text.split(/\s+/).length;

  if (/^you\b/i.test(text)) return true;
  if (/^set up\b/i.test(text)) return true;
  if (/\bwalk me through\b/i.test(text)) return true;
  if (/\bon first run\b/i.test(text)) return true;
  if (/\bask me (which|what|when|where|how|if)\b/i.test(text)) return true;
  if (/\bdo a supervised\b/i.test(text)) return true;
  if (words > 100) return true;

  // Medium bodies with clear instruction verbs still count as prompts.
  if (
    words > 70 &&
    /\b(configure|spawn|approval|never (post|send|delete|join))\b/i.test(text)
  ) {
    return true;
  }

  // Short share-page marketing blurbs (incl. "Installs…", "walks first-run setup" product copy).
  return false;
}

function youVoiceDescription(text: string): string {
  let t = text.trim().replace(/\s+/g, ' ');
  t = t.replace(/^This bot\s+/i, 'You ');
  t = t.replace(/\bfor the user\b/gi, 'for you');
  // Keep "the user" inside Isolated safety lines as-is in descriptions if any.
  return t;
}

function rewriteSetUpOpener(body: string): string | null {
  const trimmed = body.trim();
  if (!/^set up\b/i.test(trimmed)) return null;

  const match = trimmed.match(/^([^.!?]+)([.!?]?)(\s*[\s\S]*)$/);
  if (!match) return null;
  const first = match[1]!.trim();
  const punct = match[2] || '.';
  const rest = match[3] ?? '';

  let rewritten: string | null = null;

  let m = first.match(/^Set up a new bot for me to act as (.+)$/i);
  if (m) rewritten = `You act as ${m[1]}`;

  if (!rewritten) {
    m = first.match(/^Set up a new bot for me whose only job is to (.+)$/i);
    if (m) rewritten = `You ${m[1]}`;
  }

  if (!rewritten) {
    m = first.match(/^Set up a new bot for me I can trigger to (.+?)(?:, in its own dedicated chat)?$/i);
    if (m) {
      const job = m[1]!.replace(/,\s*$/, '');
      rewritten = /dedicated chat/i.test(first)
        ? `You ${job} when I ask, in your own dedicated chat`
        : `You ${job} when I ask`;
    }
  }

  if (!rewritten) {
    m = first.match(/^Set up a new bot for me I can trigger for (.+?)(?:, in its own dedicated chat)?$/i);
    if (m) {
      rewritten = /dedicated chat/i.test(first)
        ? `You handle ${m[1]} when I ask, in your own dedicated chat`
        : `You handle ${m[1]} when I ask`;
    }
  }

  if (!rewritten) {
    m = first.match(/^Set up a new bot for me I can trigger (whenever|when) (.+)$/i);
    if (m) rewritten = `You help me when ${m[2]}`;
  }

  if (!rewritten) {
    m = first.match(/^Set up a new bot for me in its own dedicated chat (?:to help |that )?(.+)$/i);
    if (m) rewritten = `You ${m[1]}, in your own dedicated chat`;
  }

  if (!rewritten) {
    m = first.match(/^Set up a new bot for me dedicated to (.+?)(?:, in its own chat)?$/i);
    if (m) rewritten = `You are dedicated to ${m[1]}, in your own chat`;
  }

  if (!rewritten) {
    m = first.match(/^Set up a new bot for me that (.+)$/i);
    if (m) rewritten = `You ${m[1]}`;
  }

  if (!rewritten) {
    m = first.match(/^Set up a new bot for me on (?:a )?(.+)$/i);
    if (m) rewritten = `You run on ${m[1]}`;
  }

  if (!rewritten && /^Set up a new bot for me$/i.test(first)) {
    rewritten = 'You run this workflow for me';
  }

  if (!rewritten) {
    m = first.match(/^Set up a new bot for me,\s*(.+)$/i);
    if (m) rewritten = `You ${m[1]}`;
  }

  if (!rewritten) {
    m = first.match(/^Set up an always[- ]on teammate that (.+)$/i);
    if (m) rewritten = `You are an always-on teammate that ${m[1]}`;
  }

  if (!rewritten) {
    m = first.match(/^Set up a new bot that (.+)$/i);
    if (m) rewritten = `You ${m[1]}`;
  }

  if (!rewritten) {
    m = first.match(/^Set up a weekly bot that (.+)$/i);
    if (m) rewritten = `You ${m[1]} each week`;
  }

  if (!rewritten) {
    m = first.match(/^Set up a new bot I can ask to (.+)$/i);
    if (m) rewritten = `You ${m[1]} when I ask`;
  }

  if (!rewritten) {
    m = first.match(/^Set up (?:a new bot|an? .+?)(?: for me)?(?:\s+)?(.+)$/i);
    if (m && m[1]) {
      let tail = m[1].trim();
      if (/^that\b/i.test(tail)) tail = tail.replace(/^that\s+/i, '');
      if (/^to\b/i.test(tail)) tail = tail.replace(/^to\s+/i, '');
      rewritten = `You ${tail}`;
    }
  }

  if (!rewritten) return null;

  rewritten = rewritten.replace(/^You You\b/i, 'You');
  rewritten = rewritten.replace(/^You that\b/i, 'You');
  rewritten = rewritten.replace(/\bin its own dedicated chat\b/gi, 'in your own dedicated chat');
  rewritten = rewritten.replace(/\bin its own chat\b/gi, 'in your own chat');

  return `${rewritten}${punct}${rest}`;
}

/** Replace "the user" with second-person owner voice, preserving Isolated safety lines. */
function rewriteTheUser(text: string): string {
  // Possessive first.
  let t = text.replace(/\bthe user's\b/gi, 'my');
  t = t.replace(/\bYou are my\b/g, 'You are my'); // no-op normalize

  // Phrase-level fixes before bare "the user".
  t = t.replace(/^This bot exists to\b/i, 'You exist to');
  t = t.replace(/^This bot\b/i, 'You');
  t = t.replace(/\bMake the user confront\b/g, 'Make me confront');
  t = t.replace(/\bWhen the user is stuck\b/g, 'When I am stuck');
  t = t.replace(/\bso the user never\b/g, 'so I never');
  t = t.replace(/\bfor the user\b/g, 'for me');
  t = t.replace(/\bthings the user wants\b/g, 'things I want');
  t = t.replace(/\bin the user's language\b/g, 'in my language');
  t = t.replace(/\bThe user has a Bot organization\b/g, 'I have a Bot organization');
  t = t.replace(/\buntil the user explicitly\b/g, 'until I explicitly');
  t = t.replace(/\bonly in a user-approved source\b/g, 'only in a source I approve');
  t = t.replace(/\buser-provided claims\b/g, 'claims I provide');
  t = t.replace(/\bthe user deletes\b/g, 'I delete');
  t = t.replace(/\bThe user gives\b/g, 'I give');
  t = t.replace(/\bAsk the user\b/g, 'Ask me');
  t = t.replace(/\bask the user\b/g, 'ask me');
  t = t.replace(/\bHelp the user\b/g, 'Help me');
  t = t.replace(/\bhelp the user\b/g, 'help me');
  t = t.replace(/\bgive the user\b/gi, 'give me');
  t = t.replace(/\btell the user\b/gi, 'tell me');
  t = t.replace(/\bshow the user\b/gi, 'show me');
  t = t.replace(/\bwhat the user\b/gi, 'what I');
  t = t.replace(/\bif the user\b/gi, 'if I');
  t = t.replace(/\bwhen the user\b/gi, 'when I');
  t = t.replace(/\bunless the user\b/gi, 'unless I');

  // Remaining bare "the user" — skip Isolated / talk-only constraints.
  t = t.replace(/\bthe user\b/gi, (match, offset, full: string) => {
    const before = full.slice(Math.max(0, offset - 48), offset).toLowerCase();
    if (before.includes('talk only to')) return match;
    if (/isolated:\s*$/.test(before) || before.endsWith('isolated: ')) return match;
    return 'me';
  });

  return t;
}

function rewriteThirdPersonPrompt(body: string): string {
  let t = rewriteTheUser(body);

  t = t.replace(/^Give the owner\b/i, 'When I give you');
  t = t.replace(/^Get the owner to\b/i, 'Get me to');
  t = t.replace(
    /^Find important assumptions the owner is operating on\b/i,
    'Find important assumptions I am operating on',
  );
  t = t.replace(/^Remember why important decisions were made so me never\b/i, 'Remember why important decisions were made so I never');
  t = t.replace(/^Investigate unexplained changes[\s\S]*?\./i, (s) => s); // leave opener; already You-imperative

  // Fix awkward "Make me confront what they would"
  t = t.replace(
    /^Make me confront what they would have to delay, drop, or sacrifice when they add something new\./i,
    'Make me confront what I would have to delay, drop, or sacrifice when I add something new.',
  );

  t = t.replace(/\bin its own dedicated chat\b/gi, 'in your own dedicated chat');
  t = t.replace(/\bin its own chat\b/gi, 'in your own chat');

  // Cleanup grammar glitches from bulk replace.
  t = t.replace(/\bme's\b/g, 'my');
  t = t.replace(/\bgovern my Grok Bot organization\b/g, 'govern my Grok Bot organization');
  t = t.replace(/\bso me never\b/g, 'so I never');
  t = t.replace(/\bMake me confront what they\b/g, 'Make me confront what I');

  return t;
}

function needsYouVoice(body: string): boolean {
  const t = body.trim();
  if (/^set up\b/i.test(t)) return true;
  if (/^this bot\b/i.test(t)) return true;
  if (/^make the user\b/i.test(t)) return true;
  if (/^when the user\b/i.test(t)) return true;
  if (/^give the owner\b/i.test(t)) return true;
  if (/^get the owner\b/i.test(t)) return true;
  if (/^find important assumptions the owner\b/i.test(t)) return true;
  if (/^remember why important decisions were made so the user\b/i.test(t)) return true;
  if (/\bthe user(?:'s)?\b/i.test(body)) {
    // Still rewrite even if Isolated lines exist — those lines are preserved in rewriteTheUser.
    return true;
  }
  if (/\bfor the user\b/i.test(body)) return true;
  return false;
}

function applyYouVoice(body: string): string {
  let next = rewriteSetUpOpener(body) ?? body;
  next = rewriteThirdPersonPrompt(next);
  return next;
}

function insertDescription(frontmatterInner: string, description: string): string {
  const trimmed = frontmatterInner.replace(/\s+$/, '');
  return `${trimmed}\ndescription: ${yamlDoubleQuoted(description)}\n`;
}

const files = readdirSync(BOTS_DIR).filter((f) => f.endsWith('.md')).sort();
const report = { relabeled: [] as string[], youVoice: [] as string[] };

for (const file of files) {
  const path = join(BOTS_DIR, file);
  const raw = readFileSync(path, 'utf8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    stats.skipped++;
    continue;
  }

  let fm: Record<string, unknown>;
  try {
    fm = parseYaml(match[1]!) as Record<string, unknown>;
  } catch {
    stats.skipped++;
    continue;
  }

  const body = raw.slice(match[0].length).trim();
  const hasShare = typeof fm.grok_share_url === 'string' && fm.grok_share_url.length > 0;
  const existingDescription = typeof fm.description === 'string' ? String(fm.description).trim() : '';

  if (!body && existingDescription) {
    stats.untouched++;
    continue;
  }

  const isBlurb = hasShare && Boolean(body) && !looksLikeRealPrompt(body) && !existingDescription;

  if (isBlurb) {
    const description = youVoiceDescription(body);
    const newFm = insertDescription(match[1]!, description);
    const next = `---\n${newFm}---\n`;
    writeFileSync(path, next);
    stats.relabeled++;
    report.relabeled.push(file);
    continue;
  }

  if (body && needsYouVoice(body)) {
    const after = applyYouVoice(body);
    if (after !== body) {
      const next = `---\n${match[1]!}\n---\n\n${after.trimEnd()}\n`;
      writeFileSync(path, next);
      stats.youVoice++;
      report.youVoice.push(file);
      continue;
    }
  }

  stats.untouched++;
}

console.log(
  JSON.stringify(
    {
      relabeled: stats.relabeled,
      youVoiceRewritten: stats.youVoice,
      untouched: stats.untouched,
      skipped: stats.skipped,
      relabeledFiles: report.relabeled,
      youVoiceTotal: report.youVoice.length,
    },
    null,
    2,
  ),
);

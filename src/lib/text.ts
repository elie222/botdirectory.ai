/** Compact excerpt for cards, feeds, and search summaries. */
export function promptExcerpt(text: string, maxLength = 220): string {
  const compact = text.replace(/\s+/g, ' ').trim();
  if (!compact) return '';
  if (compact.length <= maxLength) return compact;
  const clipped = compact.slice(0, maxLength + 1);
  const boundary = clipped.lastIndexOf(' ');
  return `${clipped.slice(0, boundary > maxLength * 0.7 ? boundary : maxLength).trim()}…`;
}

/** Prefer the real prompt for excerpts; fall back to the public description. */
export function listingExcerpt(
  bot: { prompt: string; description?: string },
  maxLength = 220,
): string {
  return promptExcerpt(bot.prompt || bot.description || '', maxLength);
}

export function promptExcerpt(prompt: string, maxLength = 220): string {
  const compact = prompt.replace(/\s+/g, ' ').trim();
  if (compact.length <= maxLength) return compact;
  const clipped = compact.slice(0, maxLength + 1);
  const boundary = clipped.lastIndexOf(' ');
  return `${clipped.slice(0, boundary > maxLength * 0.7 ? boundary : maxLength).trim()}…`;
}

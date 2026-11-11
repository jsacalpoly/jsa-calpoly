/** Helpers shared by the era cards (desktop) and the era timeline (phone). */

/**
 * Older headings include the year, e.g. "21-22 : Kanpai Jidai". Keep only the era name,
 * and fall back to "JSA Board" for eras that never had a name.
 */
export function eraTitle(heading: string): string {
  const afterColon = heading.includes(":") ? heading.slice(heading.indexOf(":") + 1).trim() : heading.trim();
  const isYearOnly = /^\d{4}\s*[-–]\s*\d{4}$/.test(afterColon);
  return (isYearOnly ? "" : afterColon) || "JSA Board";
}

/** "2024-2025" becomes "2024–2025". */
export function eraYear(year: string): string {
  return year.replace("-", "–");
}

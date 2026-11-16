// Shared by the project cards and popups.

/** The CSS color for each accent, and the text color that reads well on top of it. */
export const accents = {
  coral: { color: "var(--color-coral)", on: "var(--color-ink)" },
  orange: { color: "var(--color-orange)", on: "var(--color-ink)" },
  pink: { color: "var(--color-pink)", on: "var(--color-ink)" },
  green: { color: "var(--color-green)", on: "var(--color-white)" },
} as const;

export type Accent = keyof typeof accents;

/** "Ethan & Jenna" from ["Ethan", "Jenna"]. */
export function leadNames(leads: string[]) {
  return leads.join(" & ");
}

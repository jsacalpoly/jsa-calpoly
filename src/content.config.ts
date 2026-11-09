import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// One file per board year, e.g. src/content/boards/2026-2027.json
const boards = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/boards" }),
  schema: ({ image }) =>
    z.object({
      year: z.string(),
      eraName: z.string().default(""),
      members: z.array(
        z.object({
          name: z.string(),
          role: z.string(),
          // "executive" members get the large cards at the top of the page.
          tier: z.enum(["executive", "member"]).default("member"),
          photo: image(),
        }),
      ),
    }),
});

// One Markdown file per photo gallery event. `order` runs newest first; odd orders fill the left column
// of the Photos page and even orders the right column, matching the Wix layout.
const events = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/events" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      order: z.number(),
      cover: image(),
    }),
});

// One file per past board era, shown on the Eras page.
const eras = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/eras" }),
  schema: z.object({
    year: z.string(),
    /** Heading under the officers. Older eras include the year, e.g. "21-22 : Kanpai Jidai". */
    heading: z.string(),
    /** "large" cards feature the four most recent eras; "small" cards are the archive. */
    size: z.enum(["large", "small"]),
    order: z.number(),
    president: z.string(),
    vicePresident: z.string(),
    roles: z.array(
      z.object({
        title: z.string(),
        names: z.string(),
        icon: z.enum(["treasurer", "secretary", "events", "sports", "media", "cultural", "historian"]),
        /** Use the smaller 9px names size for long lists. */
        compact: z.boolean().default(false),
      }),
    ),
  }),
});

export const collections = { boards, eras, events };

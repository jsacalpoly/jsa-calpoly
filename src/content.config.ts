import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// One file per board year, e.g. src/content/boards/2026-2027.json
const boards = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/boards" }),
  schema: ({ image }) =>
    z.object({
      year: z.string(),
      members: z.array(
        z.object({
          name: z.string(),
          role: z.string(),
          // "executive" members get the large cards at the top of the page.
          tier: z.enum(["executive", "member"]).default("member"),
          photo: image(),
          // Shown in the "About ..." panel when the card is hovered.
          about: z
            .object({
              // Name used in the panel title, e.g. "Zach" for Zachariah.
              nickname: z.string().optional(),
              year: z.string(),
              hometown: z.string(),
              food: z.string(),
            })
            .optional(),
        }),
      ),
    }),
});

// One Markdown file per photo gallery event. The Photos page sorts by date, newest first, so adding an album is
// one image plus one file here. The body of the file is the description shown on the back of the polaroid.
const events = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/events" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** When the event happened (YYYY-MM-DD). Used to sort the page. */
      date: z.coerce.date(),
      /** Set to false when the real date is not known; the date is then only used for sorting. */
      showDate: z.boolean().default(true),
      cover: image(),
      /** Google Photos album for this event. */
      album: z.string().url().optional(),
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
      }),
    ),
  }),
});

export const collections = { boards, eras, events };

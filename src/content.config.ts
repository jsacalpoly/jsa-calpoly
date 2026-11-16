import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { presetIds } from "./utils/calendar";

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

// One Markdown file per calendar event, shown on the Forecast page (/calendar). The week builds itself from these:
// a normal event appears on its date, `repeat: weekly` puts it on that weekday every week, and `featured: true` adds
// it to the "Coming up" tickets (a featured event may leave out `date` while the date is still to be decided).
const calendar = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/calendar" }),
  schema: z
    .object({
      title: z.string(),
      /** Decides the card's color, border and doodle. */
      preset: z.enum(presetIds),
      /** The day it happens (YYYY-MM-DD). For a repeating event, the first day. */
      date: z.coerce.date().optional(),
      /** Last day of an event that runs over several days. */
      endDate: z.coerce.date().optional(),
      /** Written as it should read on the card, e.g. "7:00 PM" or "6:30 – 8:30 PM". */
      time: z.string().optional(),
      place: z.string().optional(),
      repeat: z.enum(["weekly"]).optional(),
      /** Last day a repeating event happens. Leave out to repeat forever. */
      until: z.coerce.date().optional(),
      featured: z.boolean().default(false),
    })
    .refine((event) => event.date || event.featured, {
      message: "An event needs a date, unless it is featured and the date is still to be decided.",
    }),
});

// One Markdown file per project, shown on the Projects page (/projects) and, for a few, on the home page.
// The front matter is the card; the Markdown body is the longer description shown in the popup.
const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** "program" is the one featured block at the top (Big-Little), "major" projects get big paper cards, and
       *  "regular" ones are the smaller recurring meetups. */
      type: z.enum(["program", "major", "regular"]),
      /** Sort order within its type, lowest first. */
      order: z.number(),
      /** A paused project is kept here but left off the page until it comes back. */
      status: z.enum(["active", "paused"]).default("active"),
      /** Use the Japanese font for the title (GenKey). */
      jpTitle: z.boolean().default(false),
      /** A second title in Japanese, shown beside the title (the program). */
      subtitleJp: z.string().optional(),
      image: image(),
      /** Which part of the photo stays in view when it is cropped, e.g. "50% 0%" to keep the top. */
      imageFocus: z.string().optional(),
      /** The project's color: the paper behind a major project, the schedule tag on a regular one. */
      accent: z.enum(["coral", "orange", "pink", "green"]),
      /** One short sentence, used on the home page cards. */
      summary: z.string(),
      /** The longer card text on the Projects page (major projects and the program). */
      blurb: z.string().optional(),
      /** Small label above the program's title, e.g. "Big-Little program". */
      eyebrow: z.string().optional(),
      /** A handwritten line on the program block. */
      note: z.string().optional(),
      /** The highlighted line at the top of the popup. Defaults to the schedule (regular) or "Major project". */
      tag: z.string().optional(),
      /** When it meets, written as it should read on the card, e.g. "Sundays · around 2 PM". */
      schedule: z.string().optional(),
      /** The short where/how line on a regular project's card. */
      detail: z.string().optional(),
      /** First names of the project leads. */
      leads: z.array(z.string()).default([]),
      /** Label and value rows in the popup, e.g. WHERE / Building 52, Room 22. */
      facts: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
      /** The button in the popup. Leave out `href` to link the GroupMe; leave out `cta` for no button. */
      cta: z.object({ label: z.string(), href: z.string().url().optional() }).optional(),
      /** Show on the home page, in this order (lowest first). */
      homeOrder: z.number().optional(),
      /** How the paper and photo are tilted and staggered, in degrees and px. */
      photoTilt: z.number().default(0),
      paperTilt: z.number().default(0),
      offset: z.number().default(0),
    }),
});

export const collections = { boards, eras, events, calendar, projects };

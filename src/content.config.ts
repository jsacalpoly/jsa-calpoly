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

export const collections = { boards };

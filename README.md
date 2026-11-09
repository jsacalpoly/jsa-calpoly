# Cal Poly JSA Website

The official website of the Japanese Student Association at Cal Poly San Luis Obispo, rebuilt from Wix as a static site with Astro and plain CSS, hosted on Cloudflare Workers.

**Design reference:** [Figma — Cal Poly JSA Wix Site Recreation](https://www.figma.com/design/shOcawf7ftNzUNCOFnU6Is)

---

## Tech stack

| Layer           | Choice                                    | Purpose                                                                                      |
| --------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------- |
| Framework       | [Astro](https://astro.build)              | Builds static HTML from reusable components                                                  |
| Styling         | Plain CSS                                 | Design tokens as CSS custom properties; flexbox and grid for layout; component-scoped styles |
| Fonts           | Google Fonts                              | Loaded through font variables so they can be swapped in one place                            |
| Content         | Astro content collections (Markdown/JSON) | Board members, eras, photo events and projects stored as data                                |
| Images          | `astro:assets`                            | Resizes and compresses images at build time                                                  |
| Contact form    | Cloudflare Worker (or Formspree)          | Sends submissions to jsacalpoly@gmail.com                                                    |
| Embeds          | Google Calendar, Instagram                | Calendar and social content                                                                  |
| Version control | GitHub (`jsacalpoly` organization)        | Pull-request workflow                                                                        |
| Hosting         | Cloudflare Workers (static assets)        | Builds on every push via Workers Builds; production deploys on merge to `main`               |

---

## Getting started

### Requirements

- [Node.js](https://nodejs.org) (current LTS)
- npm (comes with Node)
- Git

### Run locally

```bash
git clone https://github.com/jsacalpoly/<repo-name>.git
cd <repo-name>
npm install
npm run dev
```

The site runs at `http://localhost:4321` and reloads as you edit.

### Commands

| Command            | What it does                                              |
| ------------------ | --------------------------------------------------------- |
| `npm run dev`      | Start the local dev server                                |
| `npm run build`    | Build the production site into `dist/`                    |
| `npm run preview`  | Serve the built site locally to check it before deploying |
| `npx wrangler dev` | Preview the built site in Cloudflare's local runtime      |

---

## Project structure

```
/
├── public/                  # Static files served as-is (favicon, robots.txt)
├── src/
│   ├── assets/              # Images processed by astro:assets
│   │   ├── board/
│   │   ├── events/
│   │   └── projects/
│   ├── components/          # Reusable pieces (match the Figma components)
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── BoardCard.astro
│   │   ├── PhotoEventCard.astro
│   │   └── ProjectCard.astro
│   ├── content/             # Site data (edit these to update content)
│   │   ├── boards/          # One file per board year
│   │   ├── events/          # One file per photo gallery event
│   │   └── projects/        # Torii, GenKey, Cookbook
│   ├── layouts/
│   │   └── BaseLayout.astro # Shared <head>, header and footer
│   ├── pages/               # Each file becomes a route
│   │   ├── index.astro
│   │   ├── board.astro
│   │   ├── eras.astro
│   │   ├── events.astro
│   │   ├── photos.astro
│   │   ├── projects.astro
│   │   └── contact.astro
│   └── styles/
│       ├── tokens.css       # Colors, fonts, spacing, type scale
│       └── global.css       # Resets and base element styles
├── astro.config.mjs
├── wrangler.jsonc           # Cloudflare Workers config
└── package.json
```

---

## Styling conventions

All shared values live in `src/styles/tokens.css` as CSS custom properties. Use the variables instead of hard-coding values so the palette and fonts stay consistent.

```css
:root {
  /* Brand palette */
  --color-red: #ed4545;
  --color-coral: #fe6161;
  --color-orange: #f5ae5d;
  --color-pink: #e6999b;
  --color-mint: #abd9d6;
  --color-ink: #181818;
  --color-white: #ffffff;

  /* Fonts (replace with Google Fonts once imported) */
  --font-body: "Poppins", system-ui, sans-serif;
  --font-display: "Poppins", system-ui, sans-serif;
}
```

- **Component styles** go in a `<style>` block inside the `.astro` component. Astro scopes these to that component automatically, so they won't leak into other pages.
- **Class names** describe what an element is, like `board-card` or `event-title`, not how it looks.
- **Fonts:** import Google Fonts in `BaseLayout.astro`, then update the font variables in `tokens.css`.

---

## Updating content

Most yearly updates are edits to files in `src/content/`, not page code.

**Example: adding a board member** (`src/content/boards/2026-2027.json`)

```json
{
  "year": "2026-2027",
  "eraName": "",
  "members": [
    {
      "name": "Lorraina Uyeno",
      "role": "President",
      "photo": "../../assets/board/lorraina-uyeno.jpg"
    }
  ]
}
```

**Example: adding a photo event** (`src/content/events/pismo-2026.md`)

```markdown
---
title: "Pismo! 11.7.26"
date: 2026-11-07
cover: ../../assets/events/pismo-2026.jpg
---

This weekend JSA took a trip down to Pismo Beach!
```

Put images in the matching folder under `src/assets/`. Astro resizes them automatically during the build.

---

## Deployment

The site deploys to Cloudflare Workers as static assets, connected to this GitHub repository through Workers Builds. It's a static site, so no Astro adapter is needed.

### `wrangler.jsonc`

```jsonc
{
  "name": "jsa-calpoly",
  // Set this to the date you first deploy
  "compatibility_date": "YYYY-MM-DD",
  "assets": {
    "directory": "./dist",
  },
}
```

### Cloudflare dashboard setup

1. Go to **Workers & Pages** and select **Create**.
2. Under **Import a repository**, connect the `jsacalpoly` GitHub organization and select this repo.
3. Use these settings:

| Setting           | Value                 |
| ----------------- | --------------------- |
| Build command     | `npx astro build`     |
| Deploy command    | `npx wrangler deploy` |
| Production branch | `main`                |

The site goes live at a `*.workers.dev` address. A custom domain can be attached later under the Worker's **Settings → Domains & Routes**.

Pushes to `main` deploy to production. Pushes to other branches build a preview version with its own URL, so changes can be checked before merging.

---

## Contributing

1. Create a branch from `main` (for example, `update-board-2027`).
2. Make your changes and check them with `npm run dev`.
3. Open a pull request from your personal GitHub account.
4. Check the Cloudflare preview URL for your branch.
5. Merge once it looks right; the site deploys automatically.

Please don't commit directly to `main`.

---

## Roadmap

### Phase 1: Exact replica

- Rebuild every page of the current Wix desktop site to match the Figma reference.
- Restore the contact form, Google Calendar and Instagram embeds.
- Re-upload images that are broken on the Wix site.

### Phase 2: Improvements

- Mobile layouts for every page.
- One shared board template for every year, with the Eras page as an index.
- Minimum readable text sizes and improved color contrast.
- Tap-friendly cards instead of hover-only content.
- Photo gallery with enlargeable images per event.
- Sticky navigation that highlights the current page.
- Remove unused pages (Embed Test, duplicates, Blog).

---

## Contact

Japanese Student Association, Cal Poly SLO
jsacalpoly@gmail.com · Instagram [@calpolyjsa](https://www.instagram.com/calpolyjsa)

# Cal Poly JSA Website

The official website of the Japanese Student Association (JSA) at Cal Poly San Luis Obispo.

**Visit the site:** [jsacalpoly.org](https://jsacalpoly.org)  
**Design in Figma:** [Figma Design](https://www.figma.com/design/shOcawf7ftNzUNCOFnU6Is)

---

## About

JSA is a community for students who love Japanese culture, food, language and friendship, and everyone is welcome. This site is where members find out who we are, what we do and when we meet.

## What's on the site

| Page                 | What you'll find                                         |
| -------------------- | -------------------------------------------------------- |
| **Home** (`/`)       | An overview of JSA and some of our projects              |
| **About** (`/board`) | Who we are and what a year with JSA looks like           |
| **26-27**            | This year's board                                        |
| **Eras**             | Past boards and the history of the club                  |
| **Projects**         | Recurring meetups, big events and the Big-Little program |
| **Photos**           | Photo albums from our events                             |
| **Calendar**         | What's coming up                                         |
| **Links**            | One page with all of our important links                 |

## Get involved

- Follow us on Instagram: [@calpolyjsa](https://www.instagram.com/calpolyjsa)
- Email us: jsacalpoly@gmail.com
- Check the **Projects** and **Calendar** pages for upcoming meetups.

## Helping with the site

You don't need to be a developer to keep the site current. Most yearly updates (board members, photo albums, projects and calendar events) are edits to small data files, with no page code involved. See [Updating the content](#updating-the-content) and the [contributing steps](#contributing).

---

## For developers

Everything below is technical: how the site is built, run, styled and deployed. It is a static site built with Astro and plain CSS, hosted on Cloudflare Workers.

### Updating the content

Most yearly updates are edits to files in `src/content/`, not page code.

**Example: adding a board member** (`src/content/boards/2026-2027.json`)

```json
{
  "year": "2026-2027",
  "members": [
    {
      "name": "Lorraina Uyeno",
      "role": "President",
      "tier": "executive",
      "photo": "../../assets/board/lorraina-uyeno.png"
    }
  ]
}
```

**Example: adding a photo event** (`src/content/events/pismo-2026.md`)

```markdown
---
title: "Pismo!"
date: 2026-11-07
cover: ../../assets/events/pismo-2026.jpg
album: https://photos.app.goo.gl/JeKWkxqGPSBRFiBp6 # the Google Photos album
---

this weekend jsa took a trip down to pismo beach!!
```

**Example: adding a project** (`src/content/projects/jseigakan.md`)

A project is a card on the Projects page, and its popup. The front matter is the card; the text underneath is the longer description in the popup. `type` is `major` (a big paper card), `regular` (a small recurring meetup), or `program` (the featured Big-Little block). Set `status: paused` to keep a project in the files but off the page.

```markdown
---
title: Jseigakan
type: regular
order: 1
image: ../../assets/events/first-gen-meeting-2026.jpg
accent: orange # coral, orange, pink, or green
summary: JSA’s movie night. # one short sentence, used on the home page
schedule: Some Thursdays · 6:30–8 PM
detail: Bldg 52, Room 22
leads: [Noah]
facts: # the label and value rows in the popup
  - label: WHERE
    value: Building 52, Room 22
cta: # the popup button; leave out `href` to link the GroupMe
  label: Join the GroupMe for dates
---

Jseigakan is JSA’s movie night. It runs on some Thursdays, and the dates are posted on the GroupMe.
```

To show a project on the home page, give it a `homeOrder`. A popup opens from the card and has its own link, like `/projects#jseigakan`.

The weekend events and sports section is not a collection: it is written directly in `src/pages/projects.astro`, because it is about the whole club and nothing in it is clickable.

Put images in the matching folder under `src/assets/`. Astro resizes them automatically during the build.

---

### Contributing

1. Create a branch from `main` (for example, `update-board-2027`).
2. Make your changes and check them with `npm run dev`.
3. Open a pull request from your personal GitHub account.
4. Check the Cloudflare preview URL for your branch.
5. Merge once it looks right; the site deploys automatically.

Please don't commit directly to `main`.

---

### Tech stack

| Layer           | Choice                                    | Purpose                                                                                      |
| --------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------- |
| Framework       | [Astro](https://astro.build)              | Builds static HTML from reusable components                                                  |
| Styling         | Plain CSS                                 | Design tokens as CSS custom properties; flexbox and grid for layout; component-scoped styles |
| Fonts           | Google Fonts                              | Loaded through font variables so they can be swapped in one place                            |
| Content         | Astro content collections (Markdown/JSON) | Board members, eras, photo events, calendar events and projects stored as data               |
| Images          | `astro:assets`                            | Resizes and compresses images at build time                                                  |
| Version control | GitHub (`jsacalpoly` organization)        | Pull-request workflow                                                                        |
| Hosting         | Cloudflare Workers (static assets)        | Builds on every push via Workers Builds; production deploys on merge to `main`               |

---

### Getting started

#### Requirements

- [Node.js](https://nodejs.org) (current LTS)
- npm (comes with Node)
- Git

#### Run locally

```bash
git clone https://github.com/jsacalpoly/<repo-name>.git
cd <repo-name>
npm install
npm run dev
```

The site runs at `http://localhost:4321` and reloads as you edit.

#### Commands

| Command            | What it does                                                      |
| ------------------ | ----------------------------------------------------------------- |
| `npm run dev`      | Start the local dev server                                        |
| `npm run build`    | Build the production site into `dist/`                            |
| `npm run preview`  | Serve the built site locally to check it before deploying         |
| `npx wrangler dev` | Preview the built site in Cloudflare's local runtime              |
| `npm run format`   | Format all files with Prettier                                    |
| `npm run lint`     | Check the code with ESLint (`npm run lint:fix` fixes what it can) |

#### Checks

Every pull request runs `npm run format:check`, `npm run lint` and `npm run build` in GitHub Actions (`.github/workflows/ci.yml`). Run `npm run format` and `npm run lint` before you push so the checks pass.

---

### Project structure

```
/
├── public/                  # Static files served as-is (favicons)
├── src/
│   ├── assets/              # Images processed by astro:assets (one folder per page or section)
│   ├── components/          # Reusable pieces (match the Figma components)
│   ├── content/             # Site data (edit these to update content)
│   │   ├── boards/          # One file per board year
│   │   ├── calendar/        # One file per event on the Forecast calendar (/calendar)
│   │   ├── eras/            # One file per past board era
│   │   ├── events/          # One file per photo gallery album
│   │   └── projects/        # One file per project, shown on /projects (and some on the home page)
│   ├── data/                # Small shared lists (navigation links, contact details)
│   ├── layouts/
│   │   └── BaseLayout.astro # Shared <head>, header and footer
│   ├── pages/               # Each file becomes a route
│   │   ├── index.astro      # Home
│   │   ├── board.astro      # About
│   │   ├── 26-27.astro      # This year's board
│   │   ├── eras.astro       # Previous eras
│   │   ├── projects.astro
│   │   ├── photos.astro
│   │   ├── calendar.astro   # Forecast
│   │   └── links.astro      # Standalone link page (no header or footer)
│   ├── utils/               # Helpers for the calendar, eras and projects
│   └── styles/
│       ├── tokens.css       # Colors, fonts, spacing, type scale
│       └── global.css       # Resets, base element styles and the scroll-in animations
├── astro.config.mjs
├── wrangler.jsonc           # Cloudflare Workers config
└── package.json
```

---

### Styling conventions

All shared values live in `src/styles/tokens.css` as CSS custom properties. Use the variables instead of hard-coding values so the palette and fonts stay consistent.

```css
:root {
  /* Brand palette */
  --color-red: #ed4545;
  --color-coral: #fe6161;
  --color-orange: #f5ae5d;
  --color-pink: #e6999b;
  --color-ink: #181818;
  --color-white: #ffffff;

  /* Fonts */
  --font-body: "Poppins", system-ui, sans-serif;
  --font-hand: "Caveat", "Segoe Script", cursive;
}
```

- **Component styles** go in a `<style>` block inside the `.astro` component. Astro scopes these to that component automatically, so they won't leak into other pages.
- **Class names** describe what an element is, like `board-card` or `event-title`, not how it looks.
- **Fonts:** import Google Fonts in `BaseLayout.astro`, then update the font variables in `tokens.css`.

---

### Deployment

The site deploys to Cloudflare Workers as static assets, connected to this GitHub repository through Workers Builds. It's a static site, so no Astro adapter is needed.

#### `wrangler.jsonc`

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

#### Cloudflare dashboard setup

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

### Roadmap

#### Phase 1: Exact replica

- Rebuild every page of the current Wix desktop site to match the Figma reference.
- Restore the contact form, Google Calendar and Instagram embeds.
- Re-upload images that are broken on the Wix site.

#### Phase 2: Improvements

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

Lead developer: [Ethan Ikenaga](https://github.com/ethanikenaga) on GitHub

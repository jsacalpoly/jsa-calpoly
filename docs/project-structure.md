# Project structure

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

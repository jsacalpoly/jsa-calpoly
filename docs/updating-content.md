# Updating the content

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

# Deployment

The site deploys to Cloudflare Workers as static assets, connected to this GitHub repository through Workers Builds. It's a static site, so no Astro adapter is needed.

## `wrangler.jsonc`

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

## Cloudflare dashboard setup

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

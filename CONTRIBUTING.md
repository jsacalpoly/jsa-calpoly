# Contributing to the JSA website

1. Create a branch from `main` (for example, `update-board-2027`).
2. Make your changes and check them with `npm run dev`.
3. Open a pull request from your personal GitHub account.
4. Check the Cloudflare preview URL for your branch.
5. Merge once it looks right; the site deploys automatically.

Please don't commit directly to `main`.

## Checks before you push

Every pull request runs `npm run format:check`, `npm run lint` and `npm run build` in GitHub Actions (`.github/workflows/ci.yml`). Run `npm run format` and `npm run lint` before you push so the checks pass.

## More help

See the [developer docs](docs/) for how to update content, where files live, styling conventions and deployment.

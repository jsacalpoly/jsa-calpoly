# Styling conventions

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

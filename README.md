# Carly's Handmade Blankets & Art

A single-page, no-build storefront for Carly's handmade blankets, crochet, and paintings. Open `index.html` in a browser, or host the repo root on any static host.

**Live site:** https://williammalone.github.io/carlys-shop/ — deployed by `.github/workflows/pages.yml` on every push to `main`.

Read `HANDOFF.md` for status and next steps.

- `index.html` — the page. Open it directly in a browser, or host it anywhere static (GitHub Pages, Netlify, etc.).
- `products.js` — the only file you edit. Set `title`, `tagline`, `contact` (phone for SMS or email), and the `items` list.

Top level also takes `eyebrow` (small line above the title) and `payment` (text in step 3 of How buying works).

Each item: `name`, `category` (filter chip label), `price` (number; `0` shows "Free", `null` shows "Ask"), `condition`, `description`, `image` (URL or path) or `images` (list; first is the main photo, the rest show as clickable thumbnails), `sold` (`true` hides it by default and shows a SOLD badge).

The "I'm interested" button opens a pre-filled text message (if `contact.sms` is set) or email (if `contact.email` is set).

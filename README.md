# Shop

A single-page, no-build storefront for listing items for sale.

- `index.html` — the page. Open it directly in a browser, or host it anywhere static (GitHub Pages, Netlify, etc.).
- `products.js` — the only file you edit. Set `title`, `tagline`, `contact` (phone for SMS or email), and the `items` list.

Each item: `name`, `price` (number; `0` shows "Free"), `condition`, `description`, `image` (URL or path), `sold` (`true` hides it by default and shows a SOLD badge).

The "I'm interested" button opens a pre-filled text message (if `contact.sms` is set) or email (if `contact.email` is set).

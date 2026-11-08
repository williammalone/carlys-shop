# Handoff: "Carly's stuff" for-sale website

**Status:** Photos are in and the catalog is written. The site needs William to set prices and a contact method, then it can be hosted.
**Repo:** `williammalone/carlys-shop` (moved out of `williammalone/xeriscaping`, where it lived under `shop/` until Nov 8, 2026). Branch `main`.
**Last updated:** November 8, 2026 (fifth session)

## What this is

A simple static website to sell handmade items Carly sent William by text. Carly's 45 photos (two batches, saved to Photos on Nov 6) are now in `images/` as 1200px JPEGs with descriptive names, and `products.js` lists 26 items built from them: three chunky knit blankets, crochet wearables (sweater, hooded scarf, two beanies, slippers, bottle sling), two cat beds, coasters, crochet potted flowers, cat measuring cups, eleven paintings and drawings, and made-to-order pop-up cards.

**How the photos finally arrived.** Four cloud sessions could not reach the Mac. In the fifth, William made an iCloud Link of the 45 photos from Photos (`https://share.icloud.com/photos/03cyMsbZQRQQOuDZQduWbREag`, expires Dec 6). The session resolved it through the iCloud web app's CloudKit API in headless Chromium and downloaded the originals. The iCloud hosts it needed were added to the `xeriscaping` cloud environment's network allowlist, so a future cloud session can do the same for another iCloud Link.

## What already exists

- `index.html` — single-page storefront, no build step. Redesigned Nov 8 after a UX review, then restyled "cute" at William's request (pastel palette, Fredoka and Nunito, crochet scallop edge, stitched card borders, sticker price tags):  category filter chips, hanging price tags, a detail sheet per item (all photos, full description, contact button; opens from a `#item-slug` link so a single piece can be texted to someone), a "How buying works" section, light and dark themes, 44px tap targets. Art uses `object-fit: contain` so paintings aren't cropped (override per item with `fit: "cover"`). `price: null` shows "Ask us"; `0` shows "Free". The "Hide sold" toggle appears only once something is marked sold. A notice under the tagline explains missing prices or contact and disappears once they're set.
- **Live preview:** https://claude.ai/artifact/XZAMg6wNMpucLADSY3mBd2 (private to William until shared from the page's Share menu). Republish from the repo's the repo root after edits, or host on GitHub Pages for a public URL.
- `products.js` — the only file to edit. Top-level fields: `title`, `tagline`, `eyebrow`, `payment`, `url` (public site URL used for share links), `about` (title, text, image, alt for the About Carly card; the text was drafted by Claude from the photos, William or Carly should edit), `custom` (title, text for the "Want something custom?" card), `contact`, `items`. Sets `title`, `tagline`, `contact`, and the `items` array. Fully populated. Prices were set on Nov 8 from market research (Etsy asking prices for comparable handmade chenille blankets $75–300, granny-square sweaters $80–150, chunky cat beds $35–50, hooded scarves $25–85, beanies $20–55, slippers $19–30; small original paintings by emerging artists $100–300, discounted here for a local hobbyist sale). Total catalog value: about $1,600. William should adjust anything that feels off. `contact.email` is set to William's Gmail (Nov 8), so "I'm interested" opens a pre-filled email. Add `contact.sms` if he'd rather get texts; texts take over the button and email becomes the fallback line.
- `images/` — 45 photos, 8.7 MB total. 38 are used by items. The other 7 are prefixed `extra-` and are not products: five balloon-arch photos from an "almost married" party, a man in a Flash mask, and a floral ice bucket. Delete them or leave them.
- `images/social.png` — 1200x630 link-preview card (Open Graph). `images/icon-*.png`, `apple-touch-icon.png`, `favicon-32.png` and `site.webmanifest` make the site installable to a phone home screen. Regenerate from `logo.svg` if the logo changes.
- `images/thumbs/` — 600px versions of the product photos, served to cards via `srcset`; the full 1200px files are used in the detail sheet. Regenerate with Pillow (`im.thumbnail((600,600))`) when photos change.
- `images/logo.svg` — the logo: a pink ball of yarn with cat ears and a heart on the loose strand. Inlined in the masthead and footer of `index.html` and used as the favicon. Edit the SVG file and re-paste if the mark changes.
- `README.md` — field reference for `products.js`.
- `tools/resize-images.py` — resizes JPEG/PNG/HEIC to 1200px, strips EXIF/GPS. `--stub` prints item stubs.
- `tools/export-from-photos.sh` — Mac-only AppleScript export from Photos (album, date, or `--selection`). Not needed now, kept for future batches.

## Next session: do this

1. **Review prices.** They're market-based estimates in `products.js`; confirm with Carly.
2. **Contact** is set to email. Optionally add `contact.sms` (E.164, e.g. `"+13035551234"`) for texts.
3. **Check descriptions.** They were written from the photos. Sizes (blanket dimensions, sweater fit, canvas sizes marked "roughly") are estimates; confirm with Carly or remove.
4. **Mark anything already sold** with `sold: true`.
5. **Hosting** is automatic: `.github/workflows/pages.yml` deploys to GitHub Pages on every push to `main`, at https://williammalone.github.io/carlys-shop/. The claude.ai artifact link is a second copy that must be republished by hand.
6. Open `index.html` locally to check. The fifth session verified it renders at desktop and phone widths with no broken images or console errors.

## Taking payment

The site has no server, so payment works one of three ways. All three are already supported by `index.html`; only `products.js` needs filling in.

1. **Claim form (live now).** "Claim this piece" collects name, pickup time, and payment method (from `payments.accepted`, currently Cash and Venmo) and opens a complete email to William. Payment happens at pickup.
2. **Venmo / Cash App / PayPal links.** Fill `payments.venmo`, `payments.cashapp`, or `payments.paypal` with the handle and "Pay $X with Venmo" buttons appear in every detail view, prefilled with price and item name. Zero fees. Buyers are told to claim first so nothing sells twice.
3. **Stripe Payment Links (cards, Apple Pay).** William declined to share a Stripe API key on Nov 8, so links were not created automatically. To do it by hand: Stripe Dashboard > Payment Links > New link > add the item as a product with its price > under Advanced, turn on "Limit the number of payments" and set it to 1 > create, copy the URL into that item's `buy` field. The card then shows "Buy now" and step 1 of How buying works rewrites itself. Mark the item `sold: true` after it sells.

## Open questions for William

- Prices for each item (none were in Carly's messages).
- Contact method on the site: text, email, or both?
- Pickup only, or shipping too? Footer says "Cash or Venmo at pickup. First come, first served."
- Should the seven `extra-` photos be deleted?
- Is this a one-time sale, or will Carly add items over time? (If ongoing, the pop-up cards entry is already "made to order".)

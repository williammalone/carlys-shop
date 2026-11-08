# Handoff: "Carly's stuff" for-sale website

**Status:** Photos are in and the catalog is written. The site needs William to set prices and a contact method, then it can be hosted.
**Branch:** `claude/confident-thompson-navxwa` in `williammalone/xeriscaping`
**Last updated:** November 8, 2026 (fifth session)

## What this is

A simple static website to sell handmade items Carly sent William by text. Carly's 45 photos (two batches, saved to Photos on Nov 6) are now in `shop/images/` as 1200px JPEGs with descriptive names, and `shop/products.js` lists 26 items built from them: three chunky knit blankets, crochet wearables (sweater, hooded scarf, two beanies, slippers, bottle sling), two cat beds, coasters, crochet potted flowers, cat measuring cups, eleven paintings and drawings, and made-to-order pop-up cards.

**How the photos finally arrived.** Four cloud sessions could not reach the Mac. In the fifth, William made an iCloud Link of the 45 photos from Photos (`https://share.icloud.com/photos/03cyMsbZQRQQOuDZQduWbREag`, expires Dec 6). The session resolved it through the iCloud web app's CloudKit API in headless Chromium and downloaded the originals. The iCloud hosts it needed were added to the `xeriscaping` cloud environment's network allowlist, so a future cloud session can do the same for another iCloud Link.

## What already exists

- `shop/index.html` — single-page storefront, no build step. Redesigned Nov 8 after a UX review, then restyled "cute" at William's request (pastel palette, Fredoka and Nunito, crochet scallop edge, stitched card borders, sticker price tags):  category filter chips, hanging price tags, a detail sheet per item (all photos, full description, contact button; opens from a `#item-slug` link so a single piece can be texted to someone), a "How buying works" section, light and dark themes, 44px tap targets. Art uses `object-fit: contain` so paintings aren't cropped (override per item with `fit: "cover"`). `price: null` shows "Ask us"; `0` shows "Free". The "Hide sold" toggle appears only once something is marked sold. A notice under the tagline explains missing prices or contact and disappears once they're set.
- **Live preview:** https://claude.ai/artifact/XZAMg6wNMpucLADSY3mBd2 (private to William until shared from the page's Share menu). Republish from the repo's `shop/` after edits, or host on GitHub Pages for a public URL.
- `shop/products.js` — the only file to edit. Sets `title`, `tagline`, `contact`, and the `items` array. Fully populated. **All 26 prices are `null`** and `contact.sms` / `contact.email` are empty, so every card currently shows "Ask" and a disabled "Add contact info in products.js" button.
- `shop/images/` — 45 photos, 8.7 MB total. 38 are used by items. The other 7 are prefixed `extra-` and are not products: five balloon-arch photos from an "almost married" party, a man in a Flash mask, and a floral ice bucket. Delete them or leave them.
- `shop/images/thumbs/` — 600px versions of the product photos, served to cards via `srcset`; the full 1200px files are used in the detail sheet. Regenerate with Pillow (`im.thumbnail((600,600))`) when photos change.
- `shop/images/logo.svg` — the logo: a pink ball of yarn with cat ears and a heart on the loose strand. Inlined in the masthead and footer of `index.html` and used as the favicon. Edit the SVG file and re-paste if the mark changes.
- `shop/README.md` — field reference for `products.js`.
- `shop/tools/resize-images.py` — resizes JPEG/PNG/HEIC to 1200px, strips EXIF/GPS. `--stub` prints item stubs.
- `shop/tools/export-from-photos.sh` — Mac-only AppleScript export from Photos (album, date, or `--selection`). Not needed now, kept for future batches.

## Next session: do this

1. **Set prices.** Ask William for Carly's prices, or propose them. Edit each `price: null` in `shop/products.js`.
2. **Set the contact.** Fill `contact.sms` (E.164, e.g. `"+13035551234"`) or `contact.email`. The "I'm interested" button is disabled until one is set.
3. **Check descriptions.** They were written from the photos. Sizes (blanket dimensions, sweater fit, canvas sizes marked "roughly") are estimates; confirm with Carly or remove.
4. **Mark anything already sold** with `sold: true`.
5. **Host it.** Easiest: enable GitHub Pages on the repo for this branch with `/shop` as the folder, or drag the `shop/` folder onto Netlify Drop. Or merge to `main` first and point Pages at `main` + `/shop`.
6. Open `shop/index.html` locally to check. The fifth session verified it renders at desktop and phone widths with no broken images or console errors.

## Open questions for William

- Prices for each item (none were in Carly's messages).
- Contact method on the site: text, email, or both?
- Pickup only, or shipping too? Footer says "Cash or Venmo at pickup. First come, first served."
- Should the seven `extra-` photos be deleted?
- Is this a one-time sale, or will Carly add items over time? (If ongoing, the pop-up cards entry is already "made to order".)

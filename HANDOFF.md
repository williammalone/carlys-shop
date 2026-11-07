# Handoff: "Carly's stuff" for-sale website

**Status:** Storefront is built and pushed. It is waiting on the real item list. Everything in `shop/products.js` is a placeholder.
**Branch:** `claude/gracious-darwin-6mrazt` in `williammalone/xeriscaping`
**Last updated:** November 7, 2026

## What this is

William wants a simple website to sell items that Carly sent him by text message. Carly sent 23 photos via iCloud link (expires Dec 6). William saved all 23 to the Photos app on his Mac. From the one screenshot seen so far, the items look like handmade crochet blankets (chevron pattern, green/blue/grey). No prices or descriptions have been seen yet.

The previous session ran in a cloud container and could not reach the Mac, so the photos never arrived. That is the only blocker.

## What already exists

- `shop/index.html` — single-page storefront, no build step, no dependencies. Renders item cards (photo, name, price, condition, description), a SOLD badge, sort by price or name, and a "Hide sold" toggle. Light and dark mode. Works opened from disk or on any static host.
- `shop/products.js` — the only file to edit. Sets `title`, `tagline`, `contact` (phone for SMS, or email), and the `items` array. Three placeholder items are in it now.
- `shop/README.md` — field reference for `products.js`.
- The "I'm interested" button on each card opens a pre-filled text (if `contact.sms` is set) or email (if `contact.email` is set).

## Next session: do this

Run from the Mac (Claude desktop app, or `claude remote-control` in the repo folder) so the photos are reachable.

1. **Get the photos.** In Photos, select the 23 items Carly sent, File > Export > Export Unmodified Originals (or JPEG, size Large). Save to `shop/images/` in this repo. Rename to something readable, e.g. `blanket-chevron-green.jpg`. Convert HEIC to JPEG if Photos didn't.
2. **Read Carly's texts** for any prices, names, sizes, materials, or which items are already spoken for. If William can paste the thread, use that. If not, write descriptions from the photos and leave `price` as a number William confirms.
3. **Fill `shop/products.js`.** One entry per item. Set `image` to the relative path (`images/filename.jpg`). Set `title` and `tagline` to suit (e.g. "Carly's Handmade Blankets"). Set `contact.sms` to William's number, or `contact.email` if he prefers email, and `contact.location` (currently "Erie, CO").
4. **Resize images** so the page stays fast: roughly 1200px on the long side, JPEG quality ~80. `sips -Z 1200 file.jpg` works on macOS.
5. **Check it.** Open `shop/index.html` in a browser. Confirm every card has a photo, price, and working "I'm interested" link. Check phone width.
6. **Commit and push** to `claude/gracious-darwin-6mrazt`.
7. **Host it** if William wants a public link. Easiest: enable GitHub Pages on the repo for this branch with `/shop` as the folder, or drag the `shop/` folder onto Netlify Drop.

## Open questions for William

- Prices: did Carly give any, or should they be set now?
- Contact method on the site: text, email, or both?
- Pickup only, or shipping too? (Footer currently says "Cash or Venmo at pickup. First come, first served.")
- Site name: "For Sale" is the placeholder.
- Is this a one-time sale, or will more items be added over time?

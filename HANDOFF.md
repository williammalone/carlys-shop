# Handoff: "Carly's stuff" for-sale website

**Status:** Storefront is built and pushed. It is waiting on the real item list. Everything in `shop/products.js` is a placeholder.
**Branch:** `claude/confident-thompson-navxwa` in `williammalone/xeriscaping` (supersedes `claude/gracious-darwin-6mrazt`, which is merged in)
**Last updated:** November 8, 2026

## What this is

William wants a simple website to sell items that Carly sent him by text message. Carly texted photos of chunky knit blankets in two batches (22 and 23 photos, 45 total), which William saved to the Photos app on his Mac on Nov 6. From the one screenshot seen so far, the items look like handmade blankets (chevron pattern, green/blue/grey). No prices or descriptions have been seen yet.

Three sessions so far (Nov 7, Nov 7, Nov 8) ran in cloud containers and could not reach the Mac, so the photos never arrived. The second session also checked Gmail for the iCloud link or a message from Carly and found nothing. The third session confirmed no Mac folder is shared with cloud sessions via Remote Control and that no branch in the repo has the photos. Photos are the only blocker.

## What already exists

- `shop/index.html` — single-page storefront, no build step, no dependencies. Renders item cards (photo, name, price, condition, description), a SOLD badge, sort by price or name, and a "Hide sold" toggle. Light and dark mode. Works opened from disk or on any static host.
- `shop/products.js` — the only file to edit. Sets `title`, `tagline`, `contact` (phone for SMS, or email), and the `items` array. Three placeholder items are in it now.
- `shop/README.md` — field reference for `products.js`.
- `shop/images/` — empty, ready for the resized photos.
- `shop/tools/resize-images.py` — resizes a folder of exported JPEGs to 1200px long side, JPEG q80, auto-rotates, strips EXIF/GPS, writes to `shop/images/`. `--stub` prints a `products.js` item per photo to paste in. Needs Pillow (`python3 -m pip install pillow`); already present in cloud containers. Does not read HEIC, so export from Photos as JPEG.
- The "I'm interested" button on each card opens a pre-filled text (if `contact.sms` is set) or email (if `contact.email` is set).

## Next session: do this

Get the photos into the repo first. Any one of these works:

- **Run from the Mac.** Open the repo in the Claude desktop app, or run `claude remote-control` in the repo folder, so the session can read the exported files directly. (A cloud session can only reach the Mac if a folder is shared under Settings > Claude Code > Remote Control in the desktop app; none was shared as of Nov 8.)
- **Attach them to the chat.** In a cloud session, drop the exported JPEGs into a message. They land in the container and can be moved into `shop/images/`.
- **Upload on GitHub.** On github.com, switch to the branch above, open `shop/`, use Add file > Upload files, and put them in `shop/images/`. Then start a session and say the photos are there.

1. **Export the photos.** In Photos, select the 45 items Carly sent (Nov 6, two batches), File > Export > Export 45 Photos, Kind: JPEG, Size: Large. Rename to something readable, e.g. `blanket-chevron-green.jpg`. Export as JPEG, not Unmodified Originals (those are HEIC, which the resize script can't read).
2. **Read Carly's texts** for any prices, names, sizes, materials, or which items are already spoken for. If William can paste the thread, use that. If not, write descriptions from the photos and leave `price` as a number William confirms.
3. **Fill `shop/products.js`.** One entry per item. Set `image` to the relative path (`images/filename.jpg`). Set `title` and `tagline` to suit (e.g. "Carly's Handmade Blankets"). Set `contact.sms` to William's number, or `contact.email` if he prefers email, and `contact.location` (currently "Erie, CO").
4. **Resize images** so the page stays fast: `python3 shop/tools/resize-images.py <exported-folder> --stub`. Writes 1200px JPEGs into `shop/images/` and prints item stubs for `products.js`. (`sips -Z 1200 file.jpg` also works on macOS, but doesn't strip location data.)
5. **Check it.** Open `shop/index.html` in a browser. Confirm every card has a photo, price, and working "I'm interested" link. Check phone width.
6. **Commit and push** to `claude/confident-thompson-navxwa`.
7. **Host it** if William wants a public link. Easiest: enable GitHub Pages on the repo for this branch with `/shop` as the folder, or drag the `shop/` folder onto Netlify Drop.

## Open questions for William

- Prices: did Carly give any, or should they be set now?
- Contact method on the site: text, email, or both?
- Pickup only, or shipping too? (Footer currently says "Cash or Venmo at pickup. First come, first served.")
- Site name: "For Sale" is the placeholder.
- Is this a one-time sale, or will more items be added over time?

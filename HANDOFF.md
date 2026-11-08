# Handoff: "Carly's stuff" for-sale website

**Status:** Storefront is built and pushed. It is waiting on the real item list. Everything in `shop/products.js` is a placeholder.
**Branch:** `claude/confident-thompson-navxwa` in `williammalone/xeriscaping` (supersedes `claude/gracious-darwin-6mrazt`, which is merged in)
**Last updated:** November 8, 2026 (fourth session)

## What this is

William wants a simple website to sell items that Carly sent him by text message. Carly texted photos of chunky knit blankets in two batches (22 and 23 photos, 45 total), which William saved to the Photos app on his Mac on Nov 6. **The items are not only blankets.** A Messages screenshot William sent on Nov 8 (the thread's Photos pane) shows chunky knit blankets (navy/teal/sage, worn like a wrap; a grey one) *and* paintings: a watercolor deer with paint splatter, a pencil cat sketch, an orange tabby watercolor, two husky/dog watercolors, an acrylic husky on green, a purple octopus, and a sunburst canvas in rainbow stripes. Expect a mix of blankets and small canvases/paper art. The thread says "Sent via iCloud, Expires Dec 6": the full-resolution copies in Messages go away after that date, but the 45 photos are already saved to Photos. No prices or descriptions have been seen yet.

Four sessions so far (Nov 7, Nov 7, Nov 8, Nov 8) ran in cloud containers and could not reach the Mac, so the photos never arrived. The second session also checked Gmail for the iCloud link or a message from Carly and found nothing. The third session confirmed no Mac folder is shared with cloud sessions via Remote Control and that no branch in the repo has the photos. The fourth session found three folders in the Mac's Remote Control list (`tappable`, `omnissiah`, `assistant`) but the Mac does not offer any of them to cloud sessions, and none is this repo or the Photos library anyway. It added `shop/tools/export-from-photos.sh` so the Mac-side step is one command. Photos are the only blocker, and they will stay blocked until a session runs on the Mac itself or the JPEGs are attached to a chat message or uploaded on GitHub.

## What already exists

- `shop/index.html` — single-page storefront, no build step, no dependencies. Renders item cards (photo, name, price, condition, description), a SOLD badge, sort by price or name, and a "Hide sold" toggle. Light and dark mode. Works opened from disk or on any static host.
- `shop/products.js` — the only file to edit. Sets `title`, `tagline`, `contact` (phone for SMS, or email), and the `items` array. Three placeholder items are in it now.
- `shop/README.md` — field reference for `products.js`.
- `shop/images/` — empty, ready for the resized photos.
- `shop/tools/export-from-photos.sh` — **run on the Mac, from the repo root.** Drives the Photos app via AppleScript to export an album (default name `Carly blankets`) as JPEG into `shop/tools/export/` (git-ignored), pauses so files can be renamed, then runs `resize-images.py --stub`. `--date 2026-11-06` filters by capture date instead, but texted photos carry Carly's capture date, so the album is more reliable. First run asks for permission to control Photos.
- `shop/tools/resize-images.py` — resizes a folder of exported JPEGs to 1200px long side, JPEG q80, auto-rotates, strips EXIF/GPS, writes to `shop/images/`. `--stub` prints a `products.js` item per photo to paste in. Needs Pillow (`python3 -m pip install pillow`); already present in cloud containers. Reads HEIC too when pillow-heif is installed (it is in cloud containers after `python3 -m pip install pillow-heif`), so files uploaded straight from Photos work.
- The "I'm interested" button on each card opens a pre-filled text (if `contact.sms` is set) or email (if `contact.email` is set).

## Next session: do this

**Do not start another cloud session for this until the photos are in reach.** Get the photos into the repo first. Any one of these works:

- **Run from the Mac (fastest).** Open the repo folder in the Claude desktop app, or run `claude remote-control` in the repo folder. Then: in Photos, select the 45 photos, right-click > Add to > New Album named `Carly blankets`. Run `bash shop/tools/export-from-photos.sh`. It exports, resizes into `shop/images/`, and prints the `products.js` stubs. Skip to step 2 below. (A cloud session can only reach the Mac if a folder is shared under Settings > Claude Code > Remote Control in the desktop app and the Mac serves it to cloud sessions; as of Nov 8 the three listed folders are not served, and none is this repo.)
- **No repo on the Mac? Export with one Terminal command, then upload.** In Photos, select the 45 photos (click the first, shift-click the last). Paste this in Terminal (it asks once for permission to control Photos):

  ```bash
  mkdir -p ~/Desktop/carly-export && osascript -e 'set outFolder to (POSIX file (POSIX path of (path to desktop folder) & "carly-export")) as alias
  tell application "Photos"
    set sel to selection
    if (count of sel) is 0 then error "Nothing selected in Photos. Click the first photo, shift-click the last, then run again."
    with timeout of 1800 seconds
      export sel to outFolder using originals false
    end timeout
    return ((count of sel) as text) & " photos exported to ~/Desktop/carly-export"
  end tell' && open ~/Desktop/carly-export
  ```

  Then drag everything in that folder onto the GitHub upload page for `shop/images/` on this branch (`https://github.com/williammalone/xeriscaping/upload/claude/confident-thompson-navxwa/shop/images`), commit, and tell the session. The cloud session resizes and fills `products.js` from there. (`export-from-photos.sh --selection` does the same thing when the repo is on the Mac.)
- **Attach them to the chat.** In a cloud session, drop the exported JPEGs into a message. They land in the container and can be moved into `shop/images/`.
- **Upload on GitHub.** On github.com, switch to the branch above, open `shop/`, use Add file > Upload files, and put them in `shop/images/`. Then start a session and say the photos are there.

1. **Export the photos.** In Photos, select the 45 items Carly sent (Nov 6, two batches), File > Export > Export 45 Photos, Kind: JPEG, Size: Large. Rename to something readable, e.g. `blanket-chevron-green.jpg`. Either Kind: JPEG or Unmodified Originals (HEIC) works now; the resize script reads both.
2. **Read Carly's texts** for any prices, names, sizes, materials, or which items are already spoken for. If William can paste the thread, use that. If not, write descriptions from the photos and leave `price` as a number William confirms.
3. **Fill `shop/products.js`.** One entry per item. Set `image` to the relative path (`images/filename.jpg`). Set `title` and `tagline` to suit (e.g. "Carly's Handmade Blankets & Art"). Use `condition` for medium/size on art (e.g. "Watercolor on paper, 9x12") and for yarn/size on blankets. Set `contact.sms` to William's number, or `contact.email` if he prefers email, and `contact.location` (currently "Erie, CO").
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

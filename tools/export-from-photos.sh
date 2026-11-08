#!/usr/bin/env bash
# Export Carly's photos from the macOS Photos app as JPEG, resize them to 1200px,
# and print products.js item stubs. Run this ON THE MAC, from the repo root:
#
#   bash tools/export-from-photos.sh                 # exports album "Carly blankets"
#   bash tools/export-from-photos.sh --album "Name"  # a different album
#   bash tools/export-from-photos.sh --date 2026-11-06   # by capture date instead
#   bash tools/export-from-photos.sh --selection  # whatever is selected in Photos right now
#
# Before running: in Photos, select the 45 photos Carly texted, right-click >
# Add to > New Album, and name it "Carly blankets" (top level, not inside a folder).
# An album is more reliable than a date filter: Photos only exposes the capture
# date to scripts, and photos texted from someone else carry THEIR capture date,
# not the day you saved them.
#
# The first run asks for permission to control Photos; click OK.
# Exports go to tools/export/ (git-ignored). Resized JPEGs go to images/.
set -euo pipefail

ALBUM="Carly blankets"
DATE=""
SELECTION=""
while [ $# -gt 0 ]; do
  case "$1" in
    --album) ALBUM="$2"; shift 2 ;;
    --date)  DATE="$2";  shift 2 ;;
    --selection) SELECTION=1; shift ;;
    -h|--help) sed -n '2,17p' "$0"; exit 0 ;;
    *) echo "Unknown option: $1" >&2; exit 2 ;;
  esac
done

if [ "$(uname)" != "Darwin" ]; then
  echo "This script drives the macOS Photos app and must run on the Mac." >&2
  exit 1
fi

cd "$(dirname "$0")/.."        # repo root
EXPORT_DIR="$PWD/tools/export"
mkdir -p "$EXPORT_DIR"
rm -f "$EXPORT_DIR"/*.jpeg "$EXPORT_DIR"/*.jpg "$EXPORT_DIR"/*.JPG "$EXPORT_DIR"/*.JPEG 2>/dev/null || true

if [ -n "$SELECTION" ]; then
  echo "Exporting the photos currently selected in Photos ..."
  osascript - "$EXPORT_DIR" <<'APPLESCRIPT'
on run argv
  set outFolder to (POSIX file (item 1 of argv)) as alias
  tell application "Photos"
    set theItems to selection
    if (count of theItems) is 0 then error "Nothing is selected in Photos. Click the first photo, shift-click the last, then run this again."
    with timeout of 1800 seconds
      export theItems to outFolder using originals false
    end timeout
    return (count of theItems)
  end tell
end run
APPLESCRIPT
elif [ -n "$DATE" ]; then
  IFS=- read -r Y M D <<< "$DATE"
  echo "Exporting photos captured on $DATE ..."
  osascript - "$EXPORT_DIR" "$Y" "$M" "$D" <<'APPLESCRIPT'
on run argv
  set outFolder to (POSIX file (item 1 of argv)) as alias
  set startDate to current date
  set day of startDate to 1
  set year of startDate to (item 2 of argv) as integer
  set month of startDate to (item 3 of argv) as integer
  set day of startDate to (item 4 of argv) as integer
  set time of startDate to 0
  set endDate to startDate + (1 * days)
  tell application "Photos"
    set theItems to (every media item whose date ≥ startDate and date < endDate)
    if (count of theItems) is 0 then error "No photos with a capture date on that day. Try --album instead."
    with timeout of 1800 seconds
      export theItems to outFolder using originals false
    end timeout
    return (count of theItems)
  end tell
end run
APPLESCRIPT
else
  echo "Exporting album \"$ALBUM\" ..."
  osascript - "$EXPORT_DIR" "$ALBUM" <<'APPLESCRIPT'
on run argv
  set outFolder to (POSIX file (item 1 of argv)) as alias
  set albumName to item 2 of argv
  tell application "Photos"
    if not (exists album albumName) then error "No album named \"" & albumName & "\". Create it in Photos (top level) with the photos Carly sent, or pass --album with the right name."
    set theItems to media items of album albumName
    if (count of theItems) is 0 then error "Album \"" & albumName & "\" is empty."
    with timeout of 1800 seconds
      export theItems to outFolder using originals false
    end timeout
    return (count of theItems)
  end tell
end run
APPLESCRIPT
fi

N=$(find "$EXPORT_DIR" -maxdepth 1 -type f \( -iname '*.jpg' -o -iname '*.jpeg' \) | wc -l | tr -d ' ')
echo "Exported $N JPEG(s) to $EXPORT_DIR"
if [ "$N" = "0" ]; then
  echo "Nothing exported. If Photos wrote HEIC files, open Photos > Settings and check the export settings, or export manually: File > Export > Export Photos, Kind: JPEG." >&2
  exit 1
fi

echo
echo "Optional: rename the files in $EXPORT_DIR to something readable now (e.g. blanket-chevron-green.jpg)."
echo "The names become the image filenames and the default item names. Press Enter when ready, or Ctrl-C to stop."
read -r _ || true

echo "Resizing to 1200px into images/ ..."
python3 tools/resize-images.py "$EXPORT_DIR" --out images --stub | tee "$EXPORT_DIR/stubs.txt"
echo
echo "Done. Item stubs are above and in $EXPORT_DIR/stubs.txt. Paste them into the items array in products.js,"
echo "then fill in price and description for each. Open index.html to check."

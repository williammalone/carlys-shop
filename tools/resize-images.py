#!/usr/bin/env python3
"""Resize exported photos for the shop and (optionally) print products.js item stubs.

Usage:
  python3 shop/tools/resize-images.py <input-dir> [--out shop/images] [--max 1200] [--quality 80] [--stub]

- Reads JPEG/PNG, and HEIC/HEIF when pillow-heif is installed (python3 -m pip install pillow-heif).
- Auto-rotates from EXIF, strips all metadata (incl. GPS), fits the long side to --max px.
- Writes <out>/<slugified-name>.jpg. Existing files are overwritten.
- --stub prints one products.js item per image to paste into shop/products.js.

Requires Pillow:  python3 -m pip install pillow   (plus pillow-heif for HEIC)
"""
import argparse, json, re, sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow is required: python3 -m pip install pillow")

EXTS = {".jpg", ".jpeg", ".png"}
try:
    import pillow_heif
    pillow_heif.register_heif_opener()
    EXTS |= {".heic", ".heif"}
except ImportError:
    pass  # HEIC files will be skipped; install pillow-heif or export as JPEG

def slug(stem: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", stem.lower()).strip("-")
    return s or "photo"

def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("input")
    p.add_argument("--out", default="shop/images")
    p.add_argument("--max", type=int, default=1200)
    p.add_argument("--quality", type=int, default=80)
    p.add_argument("--stub", action="store_true")
    a = p.parse_args()

    src = Path(a.input)
    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    files = sorted(f for f in src.iterdir() if f.suffix.lower() in EXTS)
    if not files:
        sys.exit(f"No JPEG/PNG{'/HEIC' if '.heic' in EXTS else ''} files in {src}")

    stubs = []
    for f in files:
        im = ImageOps.exif_transpose(Image.open(f)).convert("RGB")
        im.thumbnail((a.max, a.max), Image.LANCZOS)
        dest = out / f"{slug(f.stem)}.jpg"
        im.save(dest, "JPEG", quality=a.quality, optimize=True, progressive=True)
        print(f"{f.name} -> {dest} ({im.width}x{im.height}, {dest.stat().st_size // 1024} KB)")
        stubs.append({
            "name": f.stem.replace("-", " ").replace("_", " ").strip().title(),
            "price": 0,
            "condition": "New, handmade",
            "description": "",
            "image": f"images/{dest.name}",
            "sold": False,
        })

    if a.stub:
        print("\n// Paste into the items array in shop/products.js:")
        print(json.dumps(stubs, indent=2)[1:-1].strip())
    return 0

if __name__ == "__main__":
    raise SystemExit(main())

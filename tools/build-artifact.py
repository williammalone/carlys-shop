#!/usr/bin/env python3
"""Builds the single-file copy published on claude.ai: inlines styles.css and app.js,
drops the document wrapper (the host adds its own), and serves JPEG only."""
import re, sys
from pathlib import Path
root = Path(__file__).resolve().parent.parent
s = (root / "index.html").read_text()
css = (root / "styles.css").read_text(); js = (root / "app.js").read_text()
js = js.replace('var WEBP = (function(){ try { return document.createElement("canvas").toDataURL("image/webp").indexOf("data:image/webp") === 0; } catch (e) { return false; } })();', 'var WEBP = false;')
js = js.replace('img.srcset = variant(src, "small") + " 360w, " + variant(src, "thumbs") + " 600w, " + full(src) + " 1200w";', 'img.srcset = variant(src, "thumbs") + " 600w, " + full(src) + " 1200w";')
title = re.search(r"<title>.*?</title>", s, re.S).group(0)
head = re.search(r"<head>(.*?)</head>", s, re.S).group(1)
links = "\n".join(l for l in re.findall(r'<link rel="(?:icon|preconnect|preload|stylesheet)"[^>]*>|<noscript>.*?</noscript>', head, re.S) if 'styles.css' not in l and 'as="image"' not in l)
body = re.search(r"<body>(.*)</body>", s, re.S).group(1).replace('<script src="app.js"></script>', "<script>\n" + js + "\n</script>")
body = re.sub(r'images/small/[^ "]+ 360w, ', '', body)
body = re.sub(r'\.js\?v=[a-f0-9]+"', '.js"', body)
out = title + '\n<meta name="claude:viewport-fit-sides" content="cover">\n' + links + "\n<style>\n" + css + "\n</style>\n" + body.strip() + "\n"
dest = Path(sys.argv[1]) if len(sys.argv) > 1 else root / "dist-artifact.html"
dest.write_text(out); print("wrote", dest, len(out)//1024, "KB")

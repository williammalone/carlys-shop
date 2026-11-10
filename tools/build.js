#!/usr/bin/env node
// Build step, run before deploy (and any time products.js or photos change):  node tools/build.js
//  1. p/<slug>/index.html  — one tiny page per item with its own link-preview tags (Open Graph),
//     which redirects to the shop with the item open. Share links point here so a texted link
//     shows that piece's photo, name and price instead of the generic shop card.
//  2. lqip.js — tiny blurred placeholders (data URIs) shown behind each photo while it loads.
const fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");
const root = path.resolve(__dirname, "..");
const window = {}; eval(fs.readFileSync(path.join(root, "products.js"), "utf8"));
const S = window.SHOP, items = S.items || [];
const base = (S.url || "").replace(/\/?$/, "/");
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmt = n => n == null ? "Price on request" : n === 0 ? "Free" : "$" + n;

// 1. per-item pages
fs.rmSync(path.join(root, "p"), { recursive: true, force: true });
let n = 0;
for (const it of items) {
  const sl = slug(it.name), pic = (it.images && it.images[0]) || it.image || "";
  const dir = path.join(root, "p", sl); fs.mkdirSync(dir, { recursive: true });
  const title = `${it.name} · ${fmt(it.price)} · ${S.title || "Shop"}`;
  const desc = (it.sold ? "Sold. " : "") + (it.description || "") + (S.contact && S.contact.location ? ` Local pickup in ${S.contact.location}.` : "");
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(base)}#${sl}">
<meta property="og:type" content="product"><meta property="og:site_name" content="${esc(S.title || "")}">
<meta property="og:title" content="${esc(it.name + " · " + fmt(it.price))}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(base)}p/${sl}/">
<meta property="og:image" content="${esc(base + pic)}">
<meta property="product:price:amount" content="${it.price == null ? "" : it.price}"><meta property="product:price:currency" content="USD">
<meta property="product:availability" content="${it.sold ? "out of stock" : "in stock"}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(it.name + " · " + fmt(it.price))}"><meta name="twitter:image" content="${esc(base + pic)}">
<meta http-equiv="refresh" content="0; url=../../#${sl}">
<link rel="icon" type="image/svg+xml" href="../../images/logo.svg">
<style>body{font-family:system-ui,sans-serif;background:#fdf3f7;color:#4a3a55;margin:0;display:grid;place-items:center;min-height:100vh;text-align:center;padding:24px}img{max-width:min(90vw,420px);border-radius:18px}a{color:#b8365f;font-weight:700}</style>
</head><body><div><img src="../../${esc(pic)}" alt=""><h1>${esc(it.name)}</h1><p>${esc(fmt(it.price))}</p><p><a href="../../#${sl}">Open in the shop</a></p></div>
<script>location.replace("../../#${sl}");</script></body></html>`;
  fs.writeFileSync(path.join(dir, "index.html"), html); n++;
}
console.log(`wrote ${n} item pages in p/`);
if (base) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [base, base + "flyer.html", ...items.map(it => base + "p/" + slug(it.name) + "/")];
  fs.writeFileSync(path.join(root, "sitemap.xml"), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.map(u => `  <url><loc>${esc(u)}</loc><lastmod>${today}</lastmod></url>`).join("\n") + "\n</urlset>\n");
  fs.writeFileSync(path.join(root, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /kit.html\nSitemap: ${base}sitemap.xml\n`);
  console.log(`wrote sitemap.xml (${urls.length} urls) and robots.txt`);
}

// 1b. static picks shelf + preload hint, so the first paint already has the polaroids
{
  const picks = items.filter(it => it.featured && !it.sold).slice(0, 4);
  const rots = [-4, 2.5, -1.5, 3];
  const variant = (src, dir) => src.replace(/^images\//, "images/" + dir + "/");
  const html = picks.map((it, k) => {
    const src = (it.images && it.images[0]) || it.image || "", sl = slug(it.name);
    const fit = it.fit || (it.category === "Art" ? "contain" : "cover");
    const price = it.price == null ? "Ask us" : it.price === 0 ? "Free" : "$" + it.price;
    return `<button type="button" class="polaroid" data-slug="${sl}" style="--r:${rots[k % rots.length]}deg;--k:${k}"><span class="tape t${k % 3}" aria-hidden="true"></span><span class="pframe${fit === "contain" ? " contain" : ""}"><img alt="" loading="eager" decoding="async"${k === 0 ? ' fetchpriority="high"' : ""} src="${esc(variant(src, "thumbs"))}" srcset="${esc(variant(src, "small"))} 360w, ${esc(variant(src, "thumbs"))} 600w, ${esc(src)} 1200w" sizes="(max-width:700px) 72vw, 300px"></span><span class="pcap"><span class="hand">${esc(it.name)} <i class="doodle" aria-hidden="true">♡</i></span>${it.pickNote ? `<small>${esc(it.pickNote)}</small>` : ""}</span><span class="psticker"><span>${esc(price)}</span></span></button>`;
  }).join("");
  let idx = fs.readFileSync(path.join(root, "index.html"), "utf8");
  idx = idx.replace(/<!-- shelf:start -->[\s\S]*?<!-- shelf:end -->/, "<!-- shelf:start -->" + html + "<!-- shelf:end -->");
  const first = picks[0] && ((picks[0].images && picks[0].images[0]) || picks[0].image);
  const pre = first ? `<link rel="preload" as="image" href="${esc(variant(first, "thumbs"))}" imagesrcset="${esc(variant(first, "small"))} 360w, ${esc(variant(first, "thumbs"))} 600w, ${esc(first)} 1200w" imagesizes="(max-width:700px) 72vw, 300px" fetchpriority="high">` : "";
  idx = idx.replace(/<!-- preload:start -->[\s\S]*?<!-- preload:end -->/, "<!-- preload:start -->" + pre + "<!-- preload:end -->");
  const ebHtml = v => { const p = String(v).split(" · "); return esc(p.slice(0, 2).join(" · ")) + (p.length > 2 ? `<span class="eb-more"> · ${esc(p.slice(2).join(" · "))}</span>` : ""); };
  // static masthead text so nothing grows after first paint
  const t = S.title || "For Sale", m = t.match(/^(.*?)(\s+(?:Blankets|Art|Knits|Crochet|Paintings|Shop|Sale)\b.*)$/i);
  const titleHtml = m ? esc(m[1]) + "<em>" + esc(m[2].trim()) + "</em>" : esc(t);
  idx = idx.replace(/<h1 id="title">[\s\S]*?<\/h1>/, `<h1 id="title">${titleHtml}</h1>`);
  idx = idx.replace(/<span id="eyebrow">[\s\S]*?<\/span>/, `<span id="eyebrow">${ebHtml(S.eyebrow || "Handmade · one of each")}</span>`);
  idx = idx.replace(/<p class="tag" id="tagline">[\s\S]*?<\/p>/, `<p class="tag" id="tagline">${esc(S.tagline || "")}</p>`);
  idx = idx.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(t)}</title>`);
  fs.writeFileSync(path.join(root, "index.html"), idx);
  console.log(`injected static shelf (${picks.length} picks), masthead text and preload hint into index.html`);
}

// 1c. cache busting: hash the site's own files, stamp ?v= on asset links and the service-worker version
{
  const crypto = require("crypto");
  const files = ["styles.css", "app.js", "products.js", "lqip.js", "index.html"].filter(f => fs.existsSync(path.join(root, f)));
  const hash = crypto.createHash("sha1"); for (const f of files) hash.update(fs.readFileSync(path.join(root, f)));
  const v = hash.digest("hex").slice(0, 10);
  let idx = fs.readFileSync(path.join(root, "index.html"), "utf8");
  idx = idx.replace(/href="styles\.css(\?v=[^"]*)?"/, `href="styles.css?v=${v}"`).replace(/src="(app|products|lqip)\.js(\?v=[^"]*)?"/g, (m, n) => `src="${n}.js?v=${v}"`);
  fs.writeFileSync(path.join(root, "index.html"), idx);
  const swPath = path.join(root, "sw.js");
  fs.writeFileSync(swPath, fs.readFileSync(swPath, "utf8").replace(/const VERSION = "[^"]*";/, `const VERSION = "${v}";`));
  console.log(`stamped asset version ${v} into index.html and sw.js`);
}

// 2. blurred placeholders via Pillow (tiny 20px JPEGs as data URIs)
const pics = [...new Set(items.flatMap(it => (it.images && it.images.length ? it.images : [it.image]).filter(Boolean)))];
const py = `
import base64, io, json, sys
from PIL import Image, ImageFilter
out = {}
for p in sys.argv[1:]:
    im = Image.open(p).convert("RGB"); im.thumbnail((24, 24)); im = im.filter(ImageFilter.GaussianBlur(1))
    b = io.BytesIO(); im.save(b, "JPEG", quality=40, optimize=True)
    out[p] = "data:image/jpeg;base64," + base64.b64encode(b.getvalue()).decode()
print(json.dumps(out))`;
try {
  const json = execFileSync("python3", ["-c", py, ...pics], { cwd: root, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
  fs.writeFileSync(path.join(root, "lqip.js"), "// generated by tools/build.js — blurred placeholders shown while photos load\nwindow.LQIP = " + json.trim() + ";\n");
  console.log(`wrote lqip.js for ${pics.length} photos (${(fs.statSync(path.join(root, "lqip.js")).size / 1024).toFixed(1)} KB)`);
} catch (e) { console.warn("lqip skipped:", e.message.split("\n")[0]); }

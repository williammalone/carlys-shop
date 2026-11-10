#!/usr/bin/env node
// Generates ready-to-post images for every piece:  node tools/build-social.js
//   images/social/<slug>.jpg        1080x1080 square (Instagram, Facebook, Nextdoor)
//   images/social/<slug>-story.jpg  1080x1920 story (Instagram/Facebook stories)
// Uses the installed Playwright Chromium. Run by the Pages deploy; files are not committed.
const fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const root = path.resolve(__dirname, "..");
const window = {}; eval(fs.readFileSync(path.join(root, "products.js"), "utf8"));
const S = window.SHOP, items = (S.items || []).filter(i => !i.sold);
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const fmt = n => n == null ? "Ask" : n === 0 ? "Free" : "$" + n;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const b64 = p => "data:image/jpeg;base64," + fs.readFileSync(path.join(root, p)).toString("base64");
const logo = fs.readFileSync(path.join(root, "images/logo.svg"), "utf8").replace('width="168" height="164"', 'width="150" height="146"');
const site = (S.url || "").replace(/^https?:\/\//, "").replace(/\/$/, "");
const tpl = (it, story) => {
  const pic = (it.images && it.images[0]) || it.image, W = 1080, H = story ? 1920 : 1080;
  return `<html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600&family=Nunito:wght@700;800&display=swap"></head>
<body style="margin:0;width:${W}px;height:${H}px;background:#fdf3f7;font-family:Nunito,sans-serif;color:#4a3a55;position:relative;overflow:hidden">
<div style="position:absolute;inset:0 0 auto 0;height:${story ? 22 : 16}px;background:linear-gradient(90deg,#f7b1c9 0 20%,#ffe28f 20% 40%,#bdebd8 40% 60%,#dccdf7 60% 80%,#c3e5f8 80%)"></div>
<div style="position:absolute;left:${story ? 70 : 60}px;top:${story ? 90 : 56}px;display:flex;align-items:center;gap:18px">${logo.replace('width="150" height="146"', story ? 'width="120" height="117"' : 'width="92" height="90"')}<div style="font:600 ${story ? 44 : 34}px/1.05 Fredoka">Carly's Handmade<br><span style="color:#b8365f">Blankets &amp; Art</span></div></div>
<img src="${b64(pic)}" style="position:absolute;left:${story ? 70 : 60}px;right:${story ? 70 : 60}px;top:${story ? 260 : 190}px;height:${story ? 1120 : 620}px;width:${W - (story ? 140 : 120)}px;object-fit:${(it.category === "Art") ? "contain" : "cover"};border-radius:40px;background:#f8e9f0;border:5px dashed #f1dbe6">
<div style="position:absolute;left:${story ? 70 : 60}px;right:${story ? 70 : 60}px;top:${story ? 1420 : 840}px;display:flex;justify-content:space-between;align-items:flex-start;gap:30px">
  <div style="font:600 ${story ? 56 : 44}px/1.08 Fredoka;max-width:${story ? 760 : 720}px">${esc(it.name)}</div>
  <div style="font:600 ${story ? 60 : 48}px/1 Fredoka;color:#4a3a55;background:#ffe28f;border-radius:999px;padding:${story ? 18 : 14}px ${story ? 34 : 28}px;white-space:nowrap;transform:rotate(-4deg)">${fmt(it.price)}</div>
</div>
<div style="position:absolute;left:${story ? 70 : 60}px;right:${story ? 70 : 60}px;bottom:${story ? 110 : 56}px;display:flex;justify-content:space-between;align-items:center;font:800 ${story ? 30 : 24}px Nunito;color:#6a5b74">
  <span style="background:#bdebd8;color:#13261f;border-radius:999px;padding:${story ? 14 : 10}px ${story ? 24 : 18}px">Local pickup · ${esc((S.contact && S.contact.location) || "")}</span><span>${esc(site)}</span>
</div></body></html>`;
};
(async () => {
  const out = path.join(root, "images/social"); fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {}); // PW_CHANNEL=chrome uses the runner's preinstalled Chrome const page = await browser.newPage({ viewport: { width: 1080, height: 1080 } });
  let n = 0;
  for (const it of items) {
    const sl = slug(it.name);
    for (const story of [false, true]) {
      if (story && !it.featured) continue; // stories only for featured picks, to keep the set small
      await page.setViewportSize({ width: 1080, height: story ? 1920 : 1080 });
      await page.setContent(tpl(it, story), { waitUntil: "load" }); await page.waitForTimeout(250);
      await page.screenshot({ path: path.join(out, sl + (story ? "-story" : "") + ".jpg"), type: "jpeg", quality: 82 }); n++;
    }
  }
  await browser.close(); console.log(`wrote ${n} social images to images/social/`);
})();

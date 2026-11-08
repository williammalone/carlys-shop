#!/usr/bin/env node
// Smoke test + accessibility audit for the shop. Run from the repo root:  node tools/check.js
// Needs Playwright with Chromium (npm i -D playwright && npx playwright install chromium) and axe-core (npm i -D axe-core).
const path = require("path"); const fs = require("fs");
const { chromium } = require("playwright");
(async () => {
  const url = "file://" + path.resolve(__dirname, "..", "index.html");
  let axe = null; try { axe = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8"); } catch (e) {}
  const browser = await chromium.launch(); let failed = 0;
  const check = (name, ok, extra) => { console.log((ok ? "  ok   " : "  FAIL ") + name + (extra ? "  " + extra : "")); if (!ok) failed++; };
  for (const [label, vp, scheme] of [["desktop light", { width: 1280, height: 900 }, "light"], ["phone dark", { width: 390, height: 844 }, "dark"]]) {
    console.log(label);
    const page = await browser.newPage({ viewport: vp, colorScheme: scheme }); const errors = [];
    page.on("pageerror", e => errors.push(e.message)); page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
    await page.goto(url); await page.waitForTimeout(2000);
    check("no console errors", errors.length === 0, errors.join(" | "));
    check("cards rendered", (await page.locator(".card:not(.custom)").count()) > 0);
    check("no sideways scroll", !(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)));
    check("no broken images", (await page.evaluate(() => Array.from(document.querySelectorAll(".card img")).filter(i => i.complete && i.naturalWidth === 0).length)) === 0);
    await page.locator(".card .ph").first().click(); await page.waitForTimeout(400);
    check("detail sheet opens", await page.evaluate(() => document.getElementById("sheet").open));
    if (axe) { await page.addScriptTag({ content: axe }); const res = await page.evaluate(async () => (await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] } })).violations.map(v => v.id + " x" + v.nodes.length)); check("accessibility (axe WCAG AA)", res.length === 0, res.join(", ")); }
    await page.close();
  }
  await browser.close(); console.log(failed ? `\n${failed} check(s) failed` : "\nAll checks passed"); process.exit(failed ? 1 : 0);
})();

// SEO: JSON-LD dagi savol-javoblar sahifadagi <details> bilan bir xil bölişi, robots va sitemap kanonik manzilni körsatişi.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const web = new URL("../", import.meta.url);
const html = readFileSync(new URL("index.html", web), "utf8");

// Teglarni olib taşlab, Google körgandek oddiy matnga aylantiramiz.
export function plain(fragment) {
  return fragment
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export function visibleFaq(source) {
  return [...source.matchAll(/<details[^>]*>\s*<summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g)].map(([, q, a]) => ({
    q: plain(q),
    a: [...a.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(([, p]) => plain(p)).join(" "),
  }));
}

function graph() {
  const block = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(block, "JSON-LD bloki yöq");
  return JSON.parse(block[1])["@graph"];
}

test("FAQPage sahifadagi savollar bilan bir xil", () => {
  const faq = graph().find((n) => n["@type"] === "FAQPage");
  assert.ok(faq, "FAQPage yöq");
  const ld = faq.mainEntity.map((e) => ({ q: e.name, a: e.acceptedAnswer.text }));
  assert.deepEqual(ld, visibleFaq(html));
});

test("kanonik manzil, robots va sitemap bir-biriga mos", () => {
  const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
  assert.equal(canonical, "https://yozgich.uz/");
  const robots = readFileSync(new URL("robots.txt", web), "utf8");
  assert.match(robots, /^Sitemap: https:\/\/yozgich\.uz\/sitemap\.xml$/m);
  const sitemap = readFileSync(new URL("sitemap.xml", web), "utf8");
  assert.ok(sitemap.includes(`<loc>${canonical}</loc>`));
});

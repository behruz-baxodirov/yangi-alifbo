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

// Bosh sahifaning 4 versiyasi: yangi lotin, eski lotin, kirill, rus.
const VERSIYALAR = [["", "index.html"], ["eski/", "eski/index.html"], ["kr/", "kr/index.html"], ["ru/", "ru/index.html"]];
const read = (p) => readFileSync(new URL(p, web), "utf8");

function graphOf(source) {
  const block = source.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(block, "JSON-LD bloki yöq");
  return JSON.parse(block[1])["@graph"];
}

test("FAQPage sahifadagi savollar bilan bir xil (har versiyada)", () => {
  for (const [, file] of VERSIYALAR) {
    const source = read(file);
    const faq = graphOf(source).find((n) => n["@type"] === "FAQPage");
    assert.ok(faq, `FAQPage yöq: ${file}`);
    const ld = faq.mainEntity.map((e) => ({ q: e.name, a: e.acceptedAnswer.text }));
    assert.ok(ld.length >= 10, file);
    assert.deepEqual(ld, visibleFaq(source), file);
  }
});

test("kanonik manzil, robots va sitemap bir-biriga mos (har versiyada)", () => {
  const robots = read("robots.txt");
  assert.match(robots, /^Sitemap: https:\/\/yozgich\.uz\/sitemap\.xml$/m);
  const sitemap = read("sitemap.xml");
  for (const [prefix, file] of VERSIYALAR) {
    const canonical = read(file).match(/<link rel="canonical" href="([^"]+)">/)?.[1];
    assert.equal(canonical, `https://yozgich.uz/${prefix}`);
    assert.ok(sitemap.includes(`<loc>${canonical}</loc>`), canonical);
  }
});

// Odamlar hali eski lotin va kirillda qidiradi, Google esa "uchun" ni "uçun" deb tanimaydi
// (site:yozgich.uz uchun, yozish, o'rnatish, клавиатура: 2026-10-24 da natija yöq edi).
// Şu sözlar ham körinadigan matnda bölişi kerak, JSON-LD keywords hisobga olinmaydi.
export function visibleText(source) {
  const body = source.slice(source.indexOf("<body"));
  return plain(body.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " "));
}

test("eski lotin va kirill so'rovlari körinadigan matnda bor", () => {
  const text = visibleText(html).toLowerCase();
  for (const query of [
    "yangi o'zbek alifbosi",
    "uchun klaviatura",
    "harflarini kompyuterda yozish",
    "yuklab olish",
    "o'rnatish",
    "kirill-lotin konvertor",
    "янги ўзбек алифбоси",
    "клавиатура",
    "кирилл-лотин конвертор",
  ]) {
    assert.ok(text.includes(query), `körinadigan matnda yöq: ${query}`);
  }
});

// Butun sayt: generator yasagan har bir sahifa.
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { localizeHtml } from "../../site/lib/html.mjs";

const webDir = fileURLToPath(web);
function pages(dir = webDir, rel = "") {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (e.isDirectory()) return pages(join(dir, e.name), `${rel}${e.name}/`);
    return e.name === "index.html" ? [rel] : [];
  });
}
const ALL = pages().sort();
const load = (rel) => readFileSync(join(webDir, rel, "index.html"), "utf8");

test("every page: one canonical equal to its own address", () => {
  assert.ok(ALL.length > 3000, String(ALL.length));
  for (const rel of ALL) {
    const canon = [...load(rel).matchAll(/<link rel="canonical" href="([^"]+)">/g)].map((m) => m[1]);
    assert.deepEqual(canon, [`https://yozgich.uz/${rel}`], rel);
  }
});

test("hreflang alternates point back to each other", () => {
  const sample = ALL.filter((rel, i) => i % 25 === 0 || !rel.includes("soz/"));
  for (const rel of sample) {
    const alts = [...load(rel).matchAll(/<link rel="alternate" hreflang="([^"]+)" href="https:\/\/yozgich\.uz\/([^"]*)">/g)];
    assert.equal(alts.length, 4, rel);
    for (const [, , target] of alts) {
      const back = [...load(target).matchAll(/hreflang="[^"]+" href="https:\/\/yozgich\.uz\/([^"]*)"/g)].map((m) => m[1]);
      const own = rel.startsWith("eski/") ? rel.slice(5) : rel;
      assert.ok(back.includes(own) || back.includes(rel), `${target} → ${rel}`);
    }
  }
});

test("the sitemap lists every page exactly once", () => {
  const locs = [...read("sitemap.xml").matchAll(/<loc>https:\/\/yozgich\.uz\/([^<]*)<\/loc>/g)].map((m) => m[1]).sort();
  assert.deepEqual(locs, ALL);
});

test("old-Latin pages have no new letters outside examples", () => {
  const bad = [];
  for (const rel of ALL.filter((r) => r.startsWith("eski/"))) {
    const html = load(rel);
    const body = html.slice(html.indexOf("<body"));
    let hit = "";
    localizeHtml(body, (s) => {
      const text = s.replaceAll("Yozgiç", ""); // brend nomi har versiyada bir xil
      if (!hit && /[öğşçÖĞŞÇ]/.test(text)) hit = text.trim().slice(0, 40);
      return s;
    });
    if (hit) bad.push(`${rel}: ${hit}`);
  }
  assert.deepEqual(bad, []);
});

test("Russian pages are marked as Russian, and the footer links every section and version", () => {
  for (const rel of ALL.filter((r) => r.startsWith("ru/"))) assert.match(load(rel), /<html lang="ru"/, rel);
  for (const rel of ["", "eski/", "kr/", "ru/", "soz/", "ru/mashq/"]) {
    const footer = load(rel).match(/<footer[\s\S]*<\/footer>/)[0];
    for (const path of ["fayl/", "soz/", "ism/", "mashq/", "maqola/", "vidjet/"]) assert.match(footer, new RegExp(`href="/${rel.match(/^(eski|kr|ru)\//)?.[0] ?? ""}${path}"`), `${rel} → ${path}`);
    for (const p of ["/", "/eski/", "/kr/", "/ru/"]) assert.ok(footer.includes(`data-til="`) && footer.includes(`href="${p}`), `${rel} til ${p}`);
  }
});

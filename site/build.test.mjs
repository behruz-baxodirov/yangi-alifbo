import { test } from "node:test";
import assert from "node:assert/strict";
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderSite, TILLAR } from "./build.mjs";

const fixture = fileURLToPath(new URL("./fixture", import.meta.url));
const files = await renderSite({ siteDir: fixture });
const page = (p) => {
  assert.ok(files.has(p), `${p} yasalmagan`);
  return files.get(p);
};

test("four versions of every page", () => {
  for (const p of ["index.html", "mashq/index.html", "savol/index.html"]) {
    for (const { prefix } of TILLAR) page(prefix + p);
  }
});

test("lang, til and canonical per version", () => {
  const kr = page("kr/mashq/index.html");
  assert.match(kr, /<html lang="uz-Cyrl" data-til="kr">/);
  assert.match(kr, /<link rel="canonical" href="https:\/\/yozgich\.uz\/kr\/mashq\/">/);
  assert.match(page("eski/index.html"), /<html lang="uz" data-til="eski">/);
  assert.match(page("ru/index.html"), /<html lang="ru" data-til="ru">/);
});

test("hreflang alternates in every version, none for eski", () => {
  for (const { prefix } of TILLAR) {
    const html = page(`${prefix}mashq/index.html`);
    assert.match(html, /hreflang="uz" href="https:\/\/yozgich\.uz\/mashq\/"/);
    assert.match(html, /hreflang="uz-Cyrl" href="https:\/\/yozgich\.uz\/kr\/mashq\/"/);
    assert.match(html, /hreflang="ru" href="https:\/\/yozgich\.uz\/ru\/mashq\/"/);
    assert.match(html, /hreflang="x-default" href="https:\/\/yozgich\.uz\/mashq\/"/);
    assert.doesNotMatch(html, /hreflang="[^"]*" href="https:\/\/yozgich\.uz\/eski\//);
  }
});

test("text converted per version, Russian from its twin", () => {
  assert.match(page("mashq/index.html"), /şahar/);
  assert.match(page("eski/mashq/index.html"), /shahar/);
  assert.match(page("kr/mashq/index.html"), /шаҳар/);
  assert.match(page("ru/mashq/index.html"), /город/);
  assert.match(page("eski/mashq/index.html"), /<title>Mashq<\/title>/);
  assert.match(page("kr/index.html"), /"name": "Yozgiç шаҳар"/);
  assert.match(page("ru/index.html"), /<title>Главная<\/title>/);
});

test("internal page links get the prefix, assets do not", () => {
  const kr = page("kr/mashq/index.html");
  assert.match(kr, /href="\/kr\/mashq\/"/);
  assert.match(kr, /href="\/kr\/#konverter"/);
  assert.match(kr, /href="\/styles\.css\?v=1"/);
  assert.match(kr, /href="\/img\/a\.webp"/);
  assert.match(kr, /<a href="\/kr\/">/);
});

test("language switcher points at the same page in each version", () => {
  const kr = page("kr/mashq/index.html");
  assert.match(kr, /data-til="yangi" href="\/mashq\/"/);
  assert.match(kr, /data-til="eski" href="\/eski\/mashq\/"/);
  assert.match(kr, /data-til="kr" href="\/kr\/mashq\/" aria-current="page"/);
  assert.match(kr, /data-til="ru" href="\/ru\/mashq\/"/);
  assert.match(kr, />Yangi<\/a>/);
});

test("data-faqat elements stay only in their version", () => {
  assert.match(page("index.html"), /faqat yangi/);
  assert.doesNotMatch(page("eski/index.html"), /faqat/);
  assert.doesNotMatch(page("kr/index.html"), /data-faqat/);
});

test("generated files start with doctype and the generator note", () => {
  for (const [p, html] of files) {
    if (!p.endsWith(".html")) continue;
    assert.ok(html.startsWith("<!doctype html>\n<!-- Bu faylni site/build.mjs yasagan. site/ dagi manbani tahrirlang. -->\n"), p);
  }
});

test("sitemap lists each page once per version with its updated date", () => {
  const sitemap = page("sitemap.xml");
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.equal(locs.length, 12);
  assert.equal(new Set(locs).size, 12);
  assert.match(sitemap, /<loc>https:\/\/yozgich\.uz\/eski\/mashq\/<\/loc>\s*<lastmod>2026-10-20<\/lastmod>/);
});

test("rendering is deterministic", async () => {
  const again = await renderSite({ siteDir: fixture });
  assert.deepEqual([...again], [...files]);
});

test("a page without a Russian twin fails the build", async () => {
  const dir = mkdtempSync(join(tmpdir(), "yozgich-"));
  try {
    cpSync(fixture, dir, { recursive: true });
    rmSync(join(dir, "ru", "mashq.html"));
    await assert.rejects(renderSite({ siteDir: dir }), /ru manbasi yöq: \/mashq\//);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("text inside ⟦⟧ is kept as is and the brackets are dropped", () => {
  assert.match(page("savol/index.html"), /<meta name="description" content="Yozing: o' → ö">/);
  assert.match(page("eski/savol/index.html"), /<meta name="description" content="Yozing: o' → ö">/);
  assert.match(page("kr/savol/index.html"), /"description": "o' ёзсангиз ö бўлади"/);
  assert.doesNotMatch(page("savol/index.html"), /⟦|⟧/);
});

test("FAQPage JSON-LD is built from the visible questions of each version", () => {
  const faq = (html) => JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])["@graph"].find((n) => n["@type"] === "FAQPage").mainEntity;
  assert.deepEqual(faq(page("eski/savol/index.html")), [{ "@type": "Question", name: "Shahar qanday yoziladi?", acceptedAnswer: { "@type": "Answer", text: "Mana: ş bilan. Ikkinchi qism." } }]);
  assert.equal(faq(page("ru/savol/index.html"))[0].name, "Как писать?");
});

test("current version name in the header", () => {
  assert.match(page("kr/index.html"), /<b data-lotin>Кирилл<\/b>/);
  assert.match(page("index.html"), /<b data-lotin>Yangi<\/b>/);
});

test("no placeholder is left unfilled", () => {
  for (const [p, html] of files) assert.doesNotMatch(html, /\{\{[\w:-]+\}\}/, p);
});

test("web/ matches a fresh build of site/", async () => {
  const site = fileURLToPath(new URL(".", import.meta.url));
  const web = fileURLToPath(new URL("../web/", import.meta.url));
  const fresh = await renderSite({ siteDir: site });
  const stale = [...fresh].filter(([p, html]) => !existsSync(join(web, p)) || readFileSync(join(web, p), "utf8") !== html).map(([p]) => p);
  assert.deepEqual(stale, [], "npm run build ni işlating");
});

test("examples keep their script in every version", () => {
  const web = (p) => readFileSync(fileURLToPath(new URL(`../web/${p}`, import.meta.url)), "utf8");
  assert.match(web("eski/index.html"), /<span data-lotin>özbek<\/span>/);
  assert.match(web("kr/index.html"), /<span data-lotin>o'zbek<\/span>/);
  assert.match(web("kr/index.html"), /<b data-lotin>ö<\/b>/);
});

test("the real site builds word pages, the index and the search list", async () => {
  const site = await renderSite({ siteDir: fileURLToPath(new URL(".", import.meta.url)) });
  for (const p of ["soz/index.html", "kr/soz/index.html", "soz/shahzod/index.html", "ru/soz/shahzod/index.html", "soz/sozlar.json"]) {
    assert.ok(site.has(p), p);
  }
  assert.match(site.get("eski/soz/shahzod/index.html"), /<title>Shahzod yangi alifboda: Şahzod · Yozgiç<\/title>/);
  assert.match(site.get("sitemap.xml"), /<loc>https:\/\/yozgich\.uz\/kr\/soz\/shahzod\/<\/loc>/);
  assert.match(site.get("index.html"), /href="\/soz\/"/);
});

const MAQOLALAR = ["nima-ozgardi", "qonun", "sh-qoidasi", "tutuq", "kirilldan", "ismlar"];

test("every article has one Article JSON-LD whose headline is its h1, in every version", async () => {
  const site = await renderSite({ siteDir: fileURLToPath(new URL(".", import.meta.url)) });
  const plainText = (s) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
  for (const slug of MAQOLALAR) {
    for (const { prefix, lang } of TILLAR) {
      const html = site.get(`${prefix}maqola/${slug}/index.html`);
      assert.ok(html, `${prefix}maqola/${slug}`);
      const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
      const articles = blocks.filter((b) => b["@type"] === "Article");
      assert.equal(articles.length, 1, `${prefix}${slug}`);
      assert.equal(articles[0].headline, plainText(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)[1]), `${prefix}${slug}`);
      assert.match(articles[0].datePublished, /^\d{4}-\d{2}-\d{2}$/);
      assert.equal(articles[0].inLanguage, lang);
    }
  }
  assert.ok(site.has("maqola/index.html") && site.has("ru/maqola/index.html"));
});

test("articles stay within checked facts", () => {
  const dir = fileURLToPath(new URL(".", import.meta.url));
  for (const base of ["pages/maqola", "ru/maqola"]) {
    for (const slug of MAQOLALAR) {
      const src = readFileSync(join(dir, base, `${slug}.html`), "utf8");
      assert.doesNotMatch(src, /pasport|паспорт|2031|Senat|Сенат/i, `${base}/${slug}`);
    }
  }
});

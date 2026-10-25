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
  assert.match(kr, /href="\/kr\/ism\/\?n=x"/);
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

test("current version name and mark in the header", () => {
  assert.match(page("kr/index.html"), /<span class="til-nomi" data-lotin>Кирилл<\/span>/);
  assert.match(page("kr/index.html"), /<span class="til-belgi" data-lotin>Ў<\/span>/);
  assert.match(page("index.html"), /<span class="til-belgi" data-lotin>ö<\/span>/);
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

// Haqiqiy sayt qobiği (header, footer) bir marta yasaladi.
const real = renderSite({ siteDir: fileURLToPath(new URL(".", import.meta.url)) });
const header = (html) => html.match(/<header class="bar">[\s\S]*?<\/header>/)[0];

test("real header: one switcher, no founder pill, section marked current", async () => {
  const site = await real;
  const soz = header(site.get("soz/index.html"));
  assert.equal(soz.match(/<details class="til">/g)?.length, 1);
  assert.equal(soz.match(/<details class="site-menu">/g)?.length, 1);
  assert.doesNotMatch(soz, /nav-founder|class="tillar/);
  assert.match(header(site.get("fayl/index.html")), /href="\/fayl\/" aria-current="page"/);
  const nav = header(site.get("index.html")).match(/<nav class="bar-nav"[\s\S]*?<\/nav>/)[0];
  assert.doesNotMatch(nav, /aria-current/);
});

test("kr switcher keeps names, converts labels", async () => {
  const h = header((await real).get("kr/fayl/index.html"));
  assert.match(h, /<b>Yangi alifbo<\/b>/);
  assert.match(h, /<small>o' g' sh ch<\/small>/);
  assert.match(h, /Сайт ёзуви: /);
});

const footer = (html) => html.match(/<footer class="close">[\s\S]*?<\/footer>/)[0];

test("real footer: four columns, founder, versions, old-script text", async () => {
  const site = await real;
  const f = footer(site.get("index.html"));
  assert.match(f, /class="close-cols"/);
  assert.match(f, /<a class="close-founder" href="\/#asoschi">[\s\S]*?<img src="\/img\/asoschi\.webp"/);
  for (const til of ["yangi", "eski", "kr", "ru"]) assert.match(f, new RegExp(`class="close-tillar"[\\s\\S]*data-til="${til}"`));
  assert.match(f, /https:\/\/taps\.uz\/baxodirov_ai\/d/);
  assert.match(f, /class="close-alt"/);
  assert.match(footer(site.get("ru/index.html")), /Бесплатно,<br>для всех/);
});

test("phone page: two tabs, three closed methods each, every version", async () => {
  const site = await real;
  for (const { prefix } of TILLAR) assert.ok(site.has(`${prefix}telefon/index.html`), `${prefix}telefon`);
  const main = site.get("telefon/index.html").match(/<main[\s\S]*<\/main>/)[0];
  assert.match(main, /role="tablist"/);
  assert.equal(main.match(/<details class="usul"/g)?.length, 6);
  assert.doesNotMatch(main, /<details class="usul"[^>]*\bopen\b/);
  assert.equal(main.match(/Tavsiya/g)?.length, 2);
  assert.match(site.get("kr/telefon/index.html"), /<h1[^>]*>Телефонда ёзиш<\/h1>/);
  assert.match(site.get("ru/telefon/index.html"), /<h1[^>]*>Как писать на телефоне<\/h1>/);
});

test("rules page: three headed sections, table, check and countdown", async () => {
  const site = await real;
  for (const { prefix } of TILLAR) assert.ok(site.has(`${prefix}qoidalar/index.html`), `${prefix}qoidalar`);
  const main = site.get("qoidalar/index.html").match(/<main[\s\S]*<\/main>/)[0];
  assert.deepEqual([...main.matchAll(/<h2 id="([^"]+)"/g)].map((m) => m[1]), ["h-jadval", "h-soz", "h-qonun"]);
  assert.equal(main.match(/<tr data-rule=/g)?.length, 6);
  for (const id of ["soz-tekshir", "soz", "soz-natija", "kunlar", "sanoq"]) assert.match(main, new RegExp(`id="${id}"`));
  assert.match(site.get("ru/qoidalar/index.html"), /<h2 id="h-jadval"[^>]*>Что изменилось<\/h2>/);
});

test("quiz page opens on an intro that names it a test", async () => {
  const site = await real;
  for (const { prefix } of TILLAR) assert.ok(site.has(`${prefix}test/index.html`), `${prefix}test`);
  const main = site.get("test/index.html").match(/<main[\s\S]*<\/main>/)[0];
  assert.match(main, /id="test-intro"[\s\S]*Test · 10 savol · 1 daqiqa[\s\S]*id="test-start"/);
  assert.match(main, /<h1 class="test-title">Yangi alifboni qançalik bilasiz\?<\/h1>/);
  assert.match(main, /<section class="quiz-sec" id="test"[^>]*hidden/);
  assert.match(site.get("ru/test/index.html"), /<h1 class="test-title">Насколько хорошо вы знаете новый алфавит\?<\/h1>/);
});

test("home links to the three pages and no longer hosts them", async () => {
  const home = (await real).get("index.html").match(/<main[\s\S]*<\/main>/)[0];
  for (const id of ["telefonda", "qoidalar", "test"]) assert.doesNotMatch(home, new RegExp(`id="${id}"`));
  const yana = home.match(/<section class="yana" id="yana"[\s\S]*?<\/section>/)?.[0] ?? "";
  for (const href of ["/telefon/", "/qoidalar/", "/test/"]) assert.match(yana, new RegExp(`href="${href}"`));
  const sources = ["pages/index.html", "ru/index.html", "pages/maqola/sh-qoidasi.html", "ru/maqola/sh-qoidasi.html", "pages/maqola/qonun.html", "ru/maqola/qonun.html"]
    .map((p) => readFileSync(fileURLToPath(new URL(p, import.meta.url)), "utf8")).join("\n");
  assert.doesNotMatch(sources, /href="\/?#(telefonda|qoidalar|test|soz-tekshir)"/);
});

test("header marks the new sections and drops Fayl", async () => {
  const site = await real;
  assert.match(header(site.get("test/index.html")), /href="\/test\/" aria-current="page"/);
  assert.match(header(site.get("telefon/index.html")), /href="\/telefon\/" aria-current="page"/);
  assert.match(header(site.get("qoidalar/index.html")), /href="\/qoidalar\/" aria-current="page"/);
  const nav = header(site.get("index.html")).match(/<nav class="bar-nav"[\s\S]*?<\/nav>/)[0];
  assert.deepEqual([...nav.matchAll(/href="([^"]+)"/g)].map((m) => m[1]), ["/#konverter", "/telefon/", "/qoidalar/", "/test/", "/mashq/", "/soz/"]);
});

test("home hero carries the stage in its final state", async () => {
  const home = (await real).get("index.html");
  const stage = home.match(/<div class="stage" aria-hidden="true">[\s\S]*?<p class="shift"/)?.[0] ?? "";
  assert.match(stage, /id="screen"[\s\S]*<span class="new">ö<\/span>zbek/);
  assert.match(stage, /<span class="kc merged">ö<\/span>/);
  assert.match(stage, /id="non-center"/);
  assert.match((await real).get("ru/index.html"), /<p class="stage-label">Вы набираете<\/p>/);
});

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

test("home has the time race in its final state", async () => {
  const site = await real;
  const vaqt = site.get("index.html").match(/<section class="vaqt" id="vaqt"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.match(vaqt, /<h2 id="vaqt-sarlavha" class="vaqt-title">Qölda 6 soniya, Yozgiç bilan bir zumda<\/h2>/);
  assert.match(vaqt, /<span class="clock slow" id="vaqt-c1" data-lotin>6,4 s<\/span>/);
  assert.match(vaqt, /<span class="clock" id="vaqt-c2" data-lotin>0,4 s<\/span>/);
  assert.match(vaqt, /<input type="range" id="vaqt-n" min="10" max="200" step="10" value="40">/);
  const home = site.get("index.html");
  assert.ok(home.indexOf('id="konverter"') < home.indexOf('id="vaqt"') && home.indexOf('id="vaqt"') < home.indexOf('id="yana"'));
  assert.match(site.get("ru/index.html"), /class="vaqt-title">Вручную 6 секунд, с Yozgiç мгновенно<\/h2>/);
});

test("every generated page has exactly one switcher and one menu", async () => {
  const site = await real;
  for (const [p, html] of site) {
    if (!p.endsWith(".html") || !html.includes('<header class="bar">')) continue;
    const h = header(html);
    assert.equal(h.match(/<details class="til">/g)?.length, 1, p);
    assert.equal(h.match(/<details class="site-menu">/g)?.length, 1, p);
  }
});

test("Russian name card label is the same in header and footer", () => {
  const read = (f) => readFileSync(fileURLToPath(new URL(f, import.meta.url)), "utf8");
  assert.match(read("ru/partials/header.html"), />Карточка с именем</);
  assert.doesNotMatch(read("ru/partials/header.html"), /Карточка имени/);
});

const mainOf = (html) => html.match(/<main id="main">([\s\S]*?)<\/main>/)[1];
const pageHead = (html) => mainOf(html).match(/^\s*<div class="page-head">[\s\S]*?<\/div>/)?.[0];

test("inner pages open with one page head in the band", async () => {
  const site = await real;
  for (const slug of ["fayl", "mashq", "ism", "vidjet", "telefon", "qoidalar", "maqola"]) {
    for (const { prefix } of TILLAR) {
      const p = `${prefix}${slug}/index.html`;
      const head = pageHead(site.get(p));
      assert.ok(head, `${p}: main starts with page-head`);
      assert.equal(head.match(/<h1 class="page-title/g)?.length, 1, p);
    }
  }
  for (const p of ["index.html", "test/index.html"]) assert.doesNotMatch(site.get(p), /class="page-head"/, p);
});

const pageHeadFull = (html) => mainOf(html).match(/^\s*<div class="page-head">[\s\S]*?<\/div>\s*<(section|article)/)?.[0];

test("word index, word pages and articles open with the page head", async () => {
  const site = await real;
  assert.match(pageHeadFull(site.get("soz/index.html")) ?? "", /id="soz-q"/);
  const word = pageHeadFull(site.get("soz/shahzod/index.html")) ?? "";
  assert.match(word, /<a class="page-crumb" href="\/soz\/">/);
  assert.match(word, /<h1 class="page-title page-title--text">/);
  const art = pageHeadFull(site.get("maqola/tutuq/index.html")) ?? "";
  assert.match(art, /<a class="page-crumb" href="\/maqola\/">/);
  assert.match(art, /page-title page-title--text/);
  assert.match(art, /class="maqola-meta"/);
  assert.match(pageHeadFull(site.get("ru/soz/index.html")) ?? "", /<h1 class="page-title">Слова и имена на новом алфавите<\/h1>/);
});

test("file page: main column with the drop zone, side card with the Word notes", async () => {
  const site = await real;
  for (const p of ["fayl/index.html", "ru/fayl/index.html"]) {
    const m = mainOf(site.get(p));
    const main = m.match(/<div class="fayl-main">[\s\S]*?<\/ul>/)?.[0] ?? "";
    for (const id of ["fayl-drop", "fayl-tutuq", "fayl-list"]) assert.match(main, new RegExp(`id="${id}"`), `${p} ${id}`);
    const side = m.match(/<aside class="fayl-side">[\s\S]*?<\/aside>/)?.[0] ?? "";
    assert.match(side, /<h2/, p);
    assert.match(side, /href="\/(ru\/)?#konverter"/, p);
    assert.equal(m.match(/class="fayl-fmt"/g)?.length, 6, p);
  }
});

test("word groups carry a big letter with a count; article index is a card grid", async () => {
  const site = await real;
  const soz = mainOf(site.get("soz/index.html"));
  assert.match(soz, /<section class="harf" id="harf-a"><h2 class="harf-h"><span data-lotin>A<\/span><span class="harf-n">\d+ ta<\/span><\/h2>/);
  assert.match(soz, /<h2 class="harf-h harf-h--text"><span data-lotin>Ğ<\/span>/);
  assert.match(mainOf(site.get("ru/soz/index.html")), /<span class="harf-n">\d+ шт\.<\/span>/);
  for (const p of ["maqola/index.html", "ru/maqola/index.html"]) {
    const m = mainOf(site.get(p));
    assert.equal(m.match(/<a class="maqola-card/g)?.length, 6, p);
    assert.match(m, /<a class="maqola-card maqola-card--top"/, p);
    assert.equal(m.match(/class="maqola-tag"/g)?.length, 6, p);
  }
});

test("name page: live card beside the field; widget page: steps beside the demo", async () => {
  const site = await real;
  for (const pre of ["", "ru/"]) {
    const ism = mainOf(site.get(`${pre}ism/index.html`));
    assert.match(ism.match(/<div class="ism-main">[\s\S]*?<\/div>/)?.[0] ?? "", /id="ism-q"/, pre);
    const side = ism.match(/<aside class="ism-side">[\s\S]*?<\/aside>/)?.[0] ?? "";
    assert.match(side, /id="ism-card"[\s\S]*class="ism-card-name/, pre);
    assert.match(side, /id="ism-story"/, pre);
    assert.match(side, /<button type="button" class="btn btn-line" id="ism-save" disabled>/, pre);
    const vid = mainOf(site.get(`${pre}vidjet/index.html`));
    assert.equal(vid.match(/<ol class="vidjet-steps">[\s\S]*?<\/ol>/)?.[0].match(/<li><span class="step-n"/g)?.length, 3, pre);
    assert.match(vid.match(/<aside class="vidjet-side">[\s\S]*?<\/aside>/)?.[0] ?? "", /class="vidjet-demo"/, pre);
  }
});

test("story button is disabled until a name is typed", async () => {
  const site = await real;
  for (const p of ["ism/index.html", "ru/ism/index.html"]) assert.match(site.get(p), /<button type="button" class="btn btn-ink" id="ism-story" disabled>/, p);
});

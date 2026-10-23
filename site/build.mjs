// Sahifa generatori: site/ dagi yangi lotin manbalardan web/ ga 4 versiya (yangi, eski, kirill, rus) yozadi.
// Işlatiş: npm run build. Bog'liqlik yöq; natija commit qilinadi, GitHub Pages uni öziday beradi.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { localizeHtml } from "./lib/html.mjs";
import { convert } from "../web/converter.js";
import { toCyrillic } from "../web/kirill.js";
import { toOldLatin } from "../web/eski.js";
import { parseSozlar, sozIndexPages, sozJson, sozPages } from "./lib/sozlar.mjs";
import { bundleVidjet } from "./lib/bundle.mjs";

export const SITE = "https://yozgich.uz";
export const ASSET_V = "24";
export const TILLAR = [
  { til: "yangi", prefix: "", lang: "uz", hreflang: "uz" },
  { til: "eski", prefix: "eski/", lang: "uz", hreflang: null },
  { til: "kr", prefix: "kr/", lang: "uz-Cyrl", hreflang: "uz-Cyrl" },
  { til: "ru", prefix: "ru/", lang: "ru", hreflang: "ru" },
];
const CONVERT = { yangi: (s) => s, eski: toOldLatin, kr: toCyrillic };
const NOMI = { yangi: "Yangi", eski: "Eski", kr: "Кирилл", ru: "Рус" };

// ⟦…⟧ içi (masalan, «o' → ö» misoli) hamma versiyada özgarmaydi, qavslar olib taşlanadi.
const keepMarked = (fn) => (text) => text.split(/⟦([^⟧]*)⟧/).map((part, i) => (i % 2 ? part : fn(part))).join("");

// Teglarni olib taşlab, Google körgandek oddiy matn (web/test/seo.test.mjs dagi plain bilan bir xil).
const plain = (html) => html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

// FAQPage savollari qölda yozilmaydi: har versiyaning körinadigan <details> bloklaridan yiğiladi.
// Tili va @id si ham şu versiyaniki (kirill savollar "uz-Cyrl", /kr/ manzilida).
function syncFaq(head, main, lang, pageUrl) {
  if (!head.includes('"FAQPage"')) return head;
  const entities = [...main.matchAll(/<details[^>]*>\s*<summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g)].map(([, q, a]) => ({
    "@type": "Question",
    name: plain(q),
    acceptedAnswer: { "@type": "Answer", text: [...a.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(([, x]) => plain(x)).join(" ") },
  }));
  return head.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/, (all, open, json, close) => {
    const ld = JSON.parse(json);
    for (const node of ld["@graph"] ?? [ld]) {
      if (node["@type"] !== "FAQPage") continue;
      node["@id"] = `${pageUrl}#${node["@id"]?.split("#")[1] ?? "savollar"}`;
      node.inLanguage = lang;
      node.mainEntity = entities;
    }
    return open + JSON.stringify(ld, null, 1) + close;
  });
}
const NOTE = "<!doctype html>\n<!-- Bu faylni site/build.mjs yasagan. site/ dagi manbani tahrirlang. -->\n";

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : e.name.endsWith(".html") ? [join(dir, e.name)] : []);
}

// <!--meta {json} --> va ixtiyoriy <!--head-->…<!--/head--> bloki, qolgani — sahifa tanasi.
export function parseSource(src, file) {
  const m = src.match(/^<!--meta\s*([\s\S]*?)-->\s*/);
  if (!m) throw new Error(`meta bloki yöq: ${file}`);
  const meta = JSON.parse(m[1]);
  let rest = src.slice(m[0].length);
  let head = "";
  const h = rest.match(/^<!--head-->([\s\S]*?)<!--\/head-->\s*/);
  if (h) {
    head = h[1];
    rest = rest.slice(h[0].length);
  }
  return { meta, head, main: rest.trim() };
}

const outPath = (prefix, path) => `${prefix}${path.slice(1)}index.html`;
const url = (prefix, path) => `${SITE}/${prefix}${path.slice(1)}`;

// data-faqat="<til>" bölgan element faqat öşa versiyada qoladi.
function keepOnly(html, til) {
  return html.replace(/<(\w+)[^>]*\bdata-faqat="(\w+)"[^>]*>[\s\S]*?<\/\1>\s*/g, (all, tag, only) =>
    only === til ? all : "");
}

// Içki sahifa havolalari versiya prefiksini oladi; fayllar (css, rasm) va boşqa versiyalarga havolalar olmaydi.
function prefixLinks(html, prefix) {
  if (!prefix) return html;
  // Til tanlagiç havolalari (data-til) allaqaçon aniq versiyaga olib boradi.
  return html.replace(/<[a-z][^>]*>/g, (tag) => tag.includes("data-til=") ? tag : tag.replace(/href="(\/[^"]*)"/g, (all, href) => {
    if (/^\/(eski|kr|ru)\//.test(href)) return all;
    const page = href === "/" || /^\/[?#]/.test(href) || /\/([?#][^"]*)?$/.test(href);
    return page ? `href="/${prefix}${href.slice(1)}"` : all;
  }));
}

function alternates(path) {
  const links = TILLAR.filter((t) => t.hreflang).map((t) =>
    `<link rel="alternate" hreflang="${t.hreflang}" href="${url(t.prefix, path)}">`);
  links.push(`<link rel="alternate" hreflang="x-default" href="${url("", path)}">`);
  return links.join("\n");
}

function fill(template, values) {
  return template.replace(/\{\{([\w:-]+)\}\}/g, (all, key) => (key in values ? values[key] : all));
}

// Maqola: Article JSON-LD, sarlavhasi har versiyaning öz <h1> i.
function articleLd(page, meta, t) {
  const h1 = page.main.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: h1 ? plain(h1[1]) : page.title,
    description: page.description,
    datePublished: meta.article.published,
    dateModified: meta.updated,
    inLanguage: t.lang,
    mainEntityOfPage: url(t.prefix, meta.path),
    author: { "@type": "Person", name: "Behruz Baxodirov", url: `${SITE}/#asoschi` },
    publisher: { "@type": "Organization", name: "Yozgiç", url: `${SITE}/` },
  };
  return `\n<script type="application/ld+json">${JSON.stringify(ld, null, 1)}</script>`;
}

function renderPage({ layout, header, footer, page, t }) {
  const { path } = page;
  const hrefs = {};
  for (const x of TILLAR) {
    hrefs[`href:${x.til}`] = `/${x.prefix}${path.slice(1)}`;
    hrefs[`current:${x.til}`] = x.til === t.til ? ' aria-current="page"' : "";
  }
  hrefs.tilnomi = NOMI[t.til];
  const html = fill(layout, {
    lang: t.lang,
    til: t.til,
    title: page.title,
    description: page.description,
    canonical: url(t.prefix, path),
    alternates: alternates(path),
    head: page.head ?? "",
    header: fill(header, hrefs),
    main: page.main,
    footer: fill(footer, hrefs),
    script: page.script ? `<script type="module" src="/${page.script}?v=${ASSET_V}"></script>` : "",
    v: ASSET_V,
    oglocale: t.til === "ru" ? "ru_RU" : "uz_UZ",
    skip: t.til === "ru" ? "Перейти к содержанию" : CONVERT[t.til]("Asosiy qismga ötiş"),
  });
  return NOTE + prefixLinks(html, t.prefix);
}

function sitemap(entries) {
  const urls = entries.map(({ loc, updated }) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${updated}</lastmod>\n  </url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

// [bölim] sarlavhalari; [gaplar] da har qator bitta gap, qolganida sözlar böşliq bilan ajraladi.
export function mashqModule(text) {
  const out = {};
  let section = null;
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const m = line.match(/^\[(\w+)\]$/);
    if (m) { section = m[1]; out[section] = []; continue; }
    const items = section === "gaplar" ? [line] : line.split(/\s+/);
    out[section].push(...items.map((x) => convert(x)));
  }
  return "// Bu faylni site/build.mjs yasagan (site/mashq.txt dan). Qölda tahrirlamang.\n"
    + `export const MATN = ${JSON.stringify(out, null, 1)};\n`;
}

export async function renderSite({ siteDir, extraPages = [] }) {
  const read = (...p) => readFileSync(join(siteDir, ...p), "utf8");
  const layout = read("layout.html");
  const partials = {
    uz: { header: read("partials", "header.html"), footer: read("partials", "footer.html") },
    ru: { header: read("ru", "partials", "header.html"), footer: read("ru", "partials", "footer.html") },
  };
  const files = new Map();
  const locs = [];
  const pagesDir = join(siteDir, "pages");

  const sources = walk(pagesDir).sort().map((file) => {
    const rel = relative(pagesDir, file);
    const uz = parseSource(readFileSync(file, "utf8"), file);
    const ruFile = join(siteDir, "ru", rel);
    if (!existsSync(ruFile)) throw new Error(`ru manbasi yöq: ${uz.meta.path}`);
    const ru = parseSource(readFileSync(ruFile, "utf8"), ruFile);
    return { uz, ru };
  });

  for (const { uz, ru } of sources) {
    const { path, updated } = uz.meta;
    for (const t of TILLAR) {
      let page, header, footer;
      if (t.til === "ru") {
        page = { path, title: ru.meta.title, description: ru.meta.description, head: ru.head, main: ru.main, script: ru.meta.script ?? uz.meta.script };
        header = keepOnly(partials.ru.header, "ru");
        footer = keepOnly(partials.ru.footer, "ru");
        page.main = keepOnly(page.main, "ru");
      } else {
        const fn = keepMarked(CONVERT[t.til]);
        const loc = (html) => localizeHtml(keepOnly(html, t.til), fn);
        // title_kr kabi kalit bölsa, şu versiyaning sarlavhasi (yangi alifboda yoziladi, ögiriladi).
        page = { path, title: fn(uz.meta[`title_${t.til}`] ?? uz.meta.title), description: fn(uz.meta.description), head: loc(uz.head), main: loc(uz.main), script: uz.meta.script };
        header = loc(partials.uz.header);
        footer = loc(partials.uz.footer);
      }
      page.head = syncFaq(page.head, page.main, t.lang, url(t.prefix, path));
      if (uz.meta.article) page.head += articleLd(page, uz.meta, t);
      files.set(outPath(t.prefix, path), renderPage({ layout, header, footer, page, t }));
      locs.push({ loc: url(t.prefix, path), updated });
    }
  }

  // Vidjet sahifasi bor bölsa, web/vidjet.js ham yiğiladi.
  if (existsSync(join(siteDir, "pages", "vidjet"))) {
    const web = (f) => readFileSync(new URL(`../web/${f}`, import.meta.url), "utf8");
    files.set("vidjet.js", bundleVidjet(web("converter.js"), web("vidjet-src.js")));
  }

  // Maşq matnlari: site/mashq.txt → web/mashq-matn.js (yangi alifboda).
  const mashqFile = join(siteDir, "mashq.txt");
  if (existsSync(mashqFile)) files.set("mashq-matn.js", mashqModule(readFileSync(mashqFile, "utf8")));

  // Söz sahifalari: site/sozlar.txt bölsa (test fixture'da yöq).
  const sozFile = join(siteDir, "sozlar.txt");
  if (existsSync(sozFile)) {
    const entries = parseSozlar(readFileSync(sozFile, "utf8"));
    extraPages = [...sozIndexPages(entries), ...sozPages(entries), ...extraPages];
    files.set("soz/sozlar.json", sozJson(entries));
  }

  for (const page of extraPages) {
    const t = TILLAR.find((x) => x.til === page.til);
    const src = t.til === "ru" ? partials.ru : partials.uz;
    const fn = CONVERT[t.til] ?? ((s) => s);
    const header = t.til === "ru" ? src.header : localizeHtml(src.header, fn);
    const footer = t.til === "ru" ? src.footer : localizeHtml(src.footer, fn);
    files.set(outPath(t.prefix, page.path), renderPage({ layout, header, footer, page, t }));
    locs.push({ loc: url(t.prefix, page.path), updated: page.updated });
  }

  files.set("sitemap.xml", sitemap(locs));
  return files;
}

export function writeSite(files, webDir) {
  let written = 0;
  for (const [p, content] of files) {
    const file = join(webDir, p);
    if (existsSync(file) && readFileSync(file, "utf8") === content) continue;
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, content);
    written++;
  }
  return written;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const root = dirname(dirname(fileURLToPath(import.meta.url)));
  const files = await renderSite({ siteDir: join(root, "site") });
  const n = writeSite(files, join(root, "web"));
  console.log(`${files.size} fayl, ${n} tasi yangilandi`);
}

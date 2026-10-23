# Köp sahifali sayt Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn yozgich.uz into a multi-page site served in four versions (new Latin `/`, old Latin `/eski/`, Cyrillic `/kr/`, Russian `/ru/`) with word and name pages, a name card, typing practice, a file converter, articles and an embeddable widget.

**Architecture:** Page sources live in `site/` (new-Latin HTML fragments plus hand-written Russian twins). A dependency-free Node generator (`site/build.mjs`) wraps them in one layout, derives the old-Latin and Cyrillic versions by converting text nodes only, and writes plain HTML and `sitemap.xml` into `web/`, which is committed and deployed unchanged by the existing Pages workflow. Runtime JS strings go through `web/i18n.js` (Russian dictionary) and `web/yozuv.js` (live old-Latin or Cyrillic conversion of dynamic DOM).

**Tech Stack:** Static HTML/CSS/vanilla JS ES modules; Node ≥ 22 for the generator and `node --test`; browser `CompressionStream`/`DecompressionStream("deflate-raw")` for .docx; Canvas 2D + Web Share API; GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-10-24-kop-sahifali-sayt-design.md` — read it before every task; copy rules, URLs, event names and the article fact list come from it verbatim.

## Global Constraints

- Sources in `site/pages/**` and `site/partials/**` are written in the new alphabet (ö ğ ş ç, tutuq ʼ U+02BC). Old-Latin and Cyrillic versions are never hand-written. Russian lives only in `site/ru/**` and `web/i18n-ru.js`.
- No framework, no npm dependencies, no build step in GitHub Actions. Run `npm run build` before every commit that touches `site/` or a file the build reads; commit the generated `web/` output together with the source. `site/build.test.mjs` fails when `web/` is stale.
- Every generated HTML file starts with `<!doctype html>` followed by `<!-- Bu faylni site/build.mjs yasagan. site/ dagi manbani tahrirlang. -->`.
- Asset URLs in generated pages are root-absolute (`/styles.css?v=…`, `/img/…`, `/fonts/…`); the version string is the single constant `ASSET_V` in `site/build.mjs`. Bump it in every task that changes CSS or JS.
- Nothing leaves the device: no network calls in new code besides the existing `window.track`.
- DESIGN.md rules: 3px corners, no shadows, clay only on flour/dough, dots as the only decoration, no Doto line ending in "." and no "." or ":" inside Doto text, **no ğ in Doto** (use Onest 800 for any string containing ğ), Doto has no Cyrillic (Cyrillic headings use Onest 800).
- Phone first: check every new page at 375 px (no horizontal scroll) and 1280 px.
- Analytics: event names exactly as spec §10; the layout's `track` adds `til` to every event.
- Tests use plain commands so the TDD hook sees them: `node --test web/<file>.test.mjs`, `node --test site/<file>.test.mjs`, `node --test site/lib/<file>.test.mjs`. Full suite: `npm test`.
- Today's language surface (read from code, not memory): one UI language (new Latin) plus a runtime Cyrillic toggle — `applyScript` in `web/kirill.js`, the `#yozuv` block at the end of `web/app.js`, `html[data-yozuv="kirill"]` selectors in `web/styles.css`, `data-lotin` marks on examples that must stay Latin. Task 5 replaces the toggle; `data-lotin` keeps its meaning (excluded from conversion) in every version.
- Shared machine: preview with `preview_start {name: "web-8767"}` (serves on 8767); never stop servers you did not start.
- Push to `main` at the end of Tasks 5, 7, 8, 11 and 14 (owner rule `push-deploy-without-asking`).
- Article facts: only ЎРҚ-1184 (signed 21.10.2026, in force 22.04.2027), the letter mapping, the sʼh rule, ng unchanged, tutuq U+02BC, "rasmiy imlo qoidalari hali eʼlon qilinmagan". Nothing about passports, document replacement, textbook years or Senate dates.

## Review Focus

1. **New-alphabet examples inside old-Latin pages.** A `data-lotin` example such as «özbek» must stay «özbek» on `/eski/`, and an old example «o'zbek» must stay «o'zbek» on `/kr/`. Test in Task 2 (`localizeHtml` exclusion) and Task 4 (generated home).
2. **Language switch keeps the place.** Switching on `/soz/shahzod/` lands on `/kr/soz/shahzod/`, and `#konverter` survives the switch. Tests in Task 3 (alternate links) and Task 6 (same slug in every version).
3. **Apostrophe variants in files.** In .docx the apostrophe arrives as `'`, `’`, `ʻ` or the entity `&apos;`, and `o` and `'` may sit in different runs; all must become ö. Tests in Task 10.
4. **Yozgiç's in-between state in practice.** Yozgiç briefly shows `o'` before replacing it with `ö`; that must not count as an error, while a finished word typed as `o'g'il` without Yozgiç does count and shows the "Yozgiç yoqilmagan" hint. Tests in Task 8.
5. **Untranslated Russian.** A JS string added without a Russian entry, or a page without a `site/ru/` twin, must fail a test instead of shipping mixed copy. Tests in Tasks 3 and 5.

---

### Task 1: Old Latin conversion

**Files:**
- Create: `web/eski.js`, `web/eski.test.mjs`
- Modify: `web/kirill.js` (export the existing `PROTECTED` regexp; no behaviour change)

**Interfaces:**
- Produces: `toOldLatin(text: string): string` in `web/eski.js`. Consumes `PROTECTED` and `KEEP` from `web/kirill.js`.

- [ ] **Step 1: Write the failing tests** in `web/eski.test.mjs`:

```js
assert.equal(toOldLatin("özbek toğ şahar çoy"), "oʻzbek togʻ shahar choy");
assert.equal(toOldLatin("Özbek Ğani Şahar Çoy"), "Oʻzbek Gʻani Shahar Choy");
assert.equal(toOldLatin("ŞAHAR ÇOY ÖZBEK"), "SHAHAR CHOY OʻZBEK");
assert.equal(toOldLatin("maʼno Isʼhoq salom"), "maʼno Isʼhoq salom");
assert.equal(toOldLatin("Yozgiç https://yozgich.uz/ş a@b.uz"), "Yozgiç https://yozgich.uz/ş a@b.uz");
// round trip over every word of the home page's visible text (same extraction as kirill.test.mjs)
for (const w of words) if (convert(w) === w) assert.equal(convert(toOldLatin(w)), w, w);
```

- [ ] **Step 2: Run** `node --test web/eski.test.mjs` — Expected: FAIL (module missing).
- [ ] **Step 3: Implement `toOldLatin`.** Split on `PROTECTED` like `toCyrillic`; per word: keep if `KEEP.has(word)`; otherwise map ö→oʻ, ğ→gʻ, ş→sh, ç→ch (apostrophe U+02BB); an upper-case new letter becomes `Oʻ Gʻ Sh Ch`, or `SH CH` when the word has ≥ 2 letters and is all caps.
- [ ] **Step 4: Run** `node --test web/eski.test.mjs web/kirill.test.mjs` — Expected: PASS.
- [ ] **Step 5: Commit** `feat(web): yangi lotin → eski lotin (eski.js)`.

### Task 2: Text-only HTML localizer

**Files:**
- Create: `site/lib/html.mjs`, `site/lib/html.test.mjs`

**Interfaces:**
- Consumes: `EXCLUDE` string from `web/kirill.js`.
- Produces: `localizeHtml(html: string, fn: (text: string) => string): string`.

- [ ] **Step 1: Write the failing tests** (with `up = (s) => s.toUpperCase()`):

```js
assert.equal(localizeHtml("<p>şahar <code>ş</code></p>", up), "<p>ŞAHAR <code>ş</code></p>");
assert.equal(localizeHtml('<p data-lotin>a <b>b</b></p>c', up), '<p data-lotin>a <b>b</b></p>C');
assert.equal(localizeHtml('<span lang="ru">я</span><span lang="en">x</span>y', up), '<span lang="ru">я</span><span lang="en">x</span>Y');
assert.equal(localizeHtml('<div class="out">a</div>', up), '<div class="out">a</div>');
assert.equal(localizeHtml('<img alt="non" src="a.png">', up), '<img alt="NON" src="a.png">');
assert.equal(localizeHtml('<p>a &amp; b &#8217; c</p>', up), '<p>A &amp; B &#8217; C</p>');
assert.equal(localizeHtml('<!-- x --><meta charset="utf-8"><meta name="description" content="d">', up), '<!-- x --><meta charset="utf-8"><meta name="description" content="D">');
// JSON-LD: prose converted, technical keys and URLs untouched
const ld = '<script type="application/ld+json">{"@type":"FAQPage","name":"a","url":"https://x.uz/a"}</script>';
assert.match(localizeHtml(ld, up), /"name":"A"/); assert.match(localizeHtml(ld, up), /"url":"https:\/\/x\.uz\/a"/);
// every simple selector in EXCLUDE is honoured
for (const sel of EXCLUDE.split(",").map((s) => s.trim())) assert.ok(isExcludedSelectorSupported(sel), sel);
```

- [ ] **Step 2: Run** `node --test site/lib/html.test.mjs` — Expected: FAIL.
- [ ] **Step 3: Implement.** A small tokenizer (comment, doctype, tag, text) with an exclusion depth counter; exclusion when a start tag matches a simple selector from `EXCLUDE` (tag name, `[attr]`, `[attr="v"]`, `.class`); void elements never push. Converted attributes: `title alt placeholder aria-label`, and `content` only on `<meta name="description">`, `<meta property="og:title|og:description">`, `<meta name="twitter:title|twitter:description">`. Entities (`&\w+;`, `&#\d+;`) are split out of text and never passed to `fn`. JSON-LD: `JSON.parse`, convert every string value except keys `@context @type @id url image logo sameAs inLanguage contentUrl` and values starting with `http`; re-serialize with `JSON.stringify(obj, null, 1)`. Also export `isExcludedSelectorSupported(sel: string): boolean` for the test.
- [ ] **Step 4: Run** `node --test site/lib/html.test.mjs` — Expected: PASS.
- [ ] **Step 5: Commit** `feat(site): matn tugunlarini ögiradigan HTML lokalizator`.

### Task 3: Generator core

**Files:**
- Create: `site/build.mjs`, `site/build.test.mjs`, `site/fixture/` (minimal `layout.html`, `partials/header.html`, `partials/footer.html`, `pages/index.html`, `pages/mashq.html`, `ru/…` twins, used only by tests)
- Modify: `package.json` (scripts `"build": "node site/build.mjs"`, `"test": "node --test web/*.test.mjs web/test/*.test.mjs site/*.test.mjs site/lib/*.test.mjs"`), `.github/workflows/pages.yml` (test step runs `npm test`)

**Interfaces:**
- Consumes: `localizeHtml` (Task 2), `toOldLatin` (Task 1), `toCyrillic`.
- Produces (from `site/build.mjs`):
  - `TILLAR: Array<{til: "yangi"|"eski"|"kr"|"ru", prefix: ""|"eski/"|"kr/"|"ru/", lang: "uz"|"uz-Cyrl"|"ru", hreflang: string|null}>` with hreflang `uz`, `null`, `uz-Cyrl`, `ru` (spec §3.4).
  - `ASSET_V: string`.
  - `renderSite({siteDir: string, extraPages?: Array<PrebuiltPage>}): Promise<Map<string, string>>` — keys are paths relative to `web/` (`"index.html"`, `"eski/mashq/index.html"`, `"sitemap.xml"`); pure, writes nothing.
  - `PrebuiltPage = {path: string /* "/soz/shahzod/" */, til, title, description, main, head?: string, script?: string, updated: string}` — already localized; the build does not run `localizeHtml` on it.
  - `writeSite(files: Map<string,string>, webDir: string): void`; running the file directly builds `site/` into `web/`.
- Page source format (every file in `pages/` and `ru/`):

```html
<!--meta
{"title": "…", "description": "…", "path": "/mashq/", "script": "mashq.js", "updated": "2026-10-24"}
-->
<!--head--> optional extra <head> content (JSON-LD) <!--/head-->
…main HTML…
```

- Layout placeholders: `{{lang}} {{til}} {{title}} {{description}} {{canonical}} {{alternates}} {{head}} {{header}} {{main}} {{footer}} {{script}} {{v}}`, and in the header partial `{{href:yangi}} {{href:eski}} {{href:kr}} {{href:ru}}` (same page in each version) and `{{current:<til>}}` (`aria-current="page"` on the active one).

- [ ] **Step 1: Write the failing tests** against `site/fixture`:
  - four outputs per page: `index.html`, `eski/index.html`, `kr/index.html`, `ru/index.html`, and `mashq/index.html` etc.
  - `kr/mashq/index.html` contains `<html lang="uz-Cyrl" data-til="kr">` and `<link rel="canonical" href="https://yozgich.uz/kr/mashq/">`.
  - every version carries `hreflang="uz"`, `hreflang="uz-Cyrl"`, `hreflang="ru"`, `hreflang="x-default"` (→ `/`) alternates and no `hreflang` for `/eski/`.
  - fixture text `şahar` appears as `shahar` in `eski/`, `шаҳар` in `kr/`, and the Russian twin's text in `ru/`.
  - internal links: `href="/mashq/"` becomes `href="/kr/mashq/"` in `kr/`; `href="/#konverter"` becomes `href="/kr/#konverter"`; `href="/styles.css?v=…"` and `href="/img/a.webp"` are unchanged.
  - deleting `fixture/ru/mashq.html` (copy the fixture to a temp dir) makes `renderSite` reject with `ru manbasi yöq: /mashq/`.
  - two renders are identical; `sitemap.xml` lists each page once per version with the page's `updated` as `<lastmod>`.
  - every generated HTML starts with the doctype and the generator comment.
- [ ] **Step 2: Run** `node --test site/build.test.mjs` — Expected: FAIL.
- [ ] **Step 3: Implement `renderSite` and `writeSite`.** Order per page and version: read source → (eski/kr) `localizeHtml(main, fn)` and the same for header/footer partials and title/description → (ru) read the twin → fill layout → rewrite internal page links by prefix (rule: `href` values equal to `/`, starting `/#`, or ending in `/` or `/#…`) → prepend doctype and comment. `writeSite` creates directories and writes only changed files.
- [ ] **Step 4: Run** `node --test site/build.test.mjs site/lib/html.test.mjs` — Expected: PASS.
- [ ] **Step 5: Commit** `feat(site): sahifa generatori (4 til, canonical, hreflang, sitemap)`.

### Task 4: Home page through the generator, Russian home, language switcher

**Files:**
- Create: `site/layout.html`, `site/partials/header.html`, `site/partials/footer.html`, `site/pages/index.html` (the current `web/index.html` body and JSON-LD, unchanged copy), `site/ru/index.html`, `site/ru/partials/header.html`, `site/ru/partials/footer.html`
- Generated: `web/index.html`, `web/eski/index.html`, `web/kr/index.html`, `web/ru/index.html`, `web/sitemap.xml`
- Modify: `web/styles.css` (switcher styles; replace every `html[data-yozuv="kirill"]` selector with `html:is([lang="uz-Cyrl"], [lang="ru"])`; delete `.script-btn` rules), `web/test/seo.test.mjs` (FAQ parity, canonical and sitemap for all four home files), `site/build.test.mjs` (add "web is up to date": every file `renderSite({siteDir: "site"})` returns equals the file on disk), `site/build.mjs` (`ASSET_V`)

**Interfaces:**
- Consumes: Task 3 page format and placeholders.
- Produces: header markup `<nav class="tillar" aria-label="Til">` with four `<a data-til="…">` links (labels `Yangi`, `Eski`, `Кирилл`, `Рус`); on ≤ 640 px it collapses to a `<details class="tillar-m">` showing the current label. The `#yozuv` button is gone.

- [ ] **Step 1: Write the failing tests:** extend `seo.test.mjs` to loop over the four home files (FAQPage equals visible `<details>` per file; canonical `https://yozgich.uz/`, `/eski/`, `/kr/`, `/ru/`; each in sitemap); add the stale-output test to `build.test.mjs`; add to `build.test.mjs`: `web/eski/index.html` still contains `<span data-lotin>özbek</span>` and `web/kr/index.html` still contains `<span data-lotin>o'zbek</span>` (Review Focus 1).
- [ ] **Step 2: Run** `npm test` — Expected: FAIL (sources missing).
- [ ] **Step 3: Move the home page into `site/`.** `layout.html` takes the current `<head>` (analytics block extended so `window.track` merges `{til: document.documentElement.dataset.til}` into params) and wraps header/main/footer; `site/pages/index.html` holds everything inside `<main>` plus the JSON-LD block between `<!--head-->` markers; the existing SEO footer block (old-Latin + Cyrillic summary) stays in the new-Latin version only (wrap it in `<div data-faqat="yangi">`, which the build drops from the other versions).
- [ ] **Step 4: Write `site/ru/index.html` and the Russian partials** — full translation of the home page including JSON-LD FAQ, terms from spec §9 («новый алфавит», «старая латиница», «кириллица», «апостроф-тутук (ʼ)»); keep ids, classes and `data-*` hooks identical to the Uzbek source so `app.js` works unchanged.
- [ ] **Step 5: Run** `npm run build && npm test` — Expected: PASS.
- [ ] **Step 6: Commit** `feat(site): bosh sahifa generator orqali, 4 til va til tanlagiç`.

### Task 5: Runtime strings in four versions

**Files:**
- Create: `web/yozuv.js`, `web/i18n.js`, `web/i18n-ru.js`, `web/i18n.test.mjs`
- Modify: `web/kirill.js` (remove `applyScript` and its DOM state; keep pure functions), `web/app.js` (delete the `#yozuv` toggle block; wrap every user-visible string in `t()`; call `applyScript(document.body, til)` once at start; switcher behaviour), `web/test.js` and `web/soz.js` callers (`t()` on question, option, explanation and rule-note strings at render time), `site/build.mjs` (`ASSET_V`)

**Interfaces:**
- Produces:
  - `web/i18n.js`: `til: "yangi"|"eski"|"kr"|"ru"` (from `document.documentElement.dataset.til`, `"yangi"` when there is no `document`); `t(uz: string, params?: Record<string, string|number>): string` — returns `RU[uz]` on `ru`, otherwise `uz`; replaces `{name}` placeholders after lookup.
  - `web/i18n-ru.js`: `RU: Record<string, string>` keyed by the exact Uzbek source string.
  - `web/yozuv.js`: `applyScript(root: Node, til: string): void` — `kr` uses `toCyrillic`, `eski` uses `toOldLatin`, otherwise no-op; same text/attribute walk and `MutationObserver` as today's `kirill.js`, honouring `EXCLUDE`.
  - Switcher: clicking a `.tillar a` appends `location.hash`, stores `yozgich-til` in `localStorage` (try/catch), sends `track("til_almashtirildi", {til})`. No automatic redirect.
- Rule: `t()` takes a plain string literal or a literal with `{placeholders}`; template literals with `${}` inside `t()` are forbidden.

- [ ] **Step 1: Write the failing tests** in `web/i18n.test.mjs`: scan `web/*.js` except `*.test.mjs`, `i18n-ru.js` and generated files for `t("…")` / `t('…')` / `` t(`…`) `` calls; assert each key exists in `RU` and has a non-empty value; assert no `t(` argument contains `${`; assert `t("{n} ta harf özgardi", {n: 3})` returns `"3 ta harf özgardi"` when `til` is `yangi`; assert every string in `QUESTIONS` (question, options, explanation) and every `RULE_TEXT[*].note` has an `RU` entry.
- [ ] **Step 2: Run** `node --test web/i18n.test.mjs` — Expected: FAIL.
- [ ] **Step 3: Implement** `i18n.js`, `yozuv.js`, wrap the strings in `app.js`, `test.js`, `soz.js` callers, `tekshir` messages (`SINOV`), and write `RU`.
- [ ] **Step 4: Run** `npm run build && npm test` — Expected: PASS.
- [ ] **Step 5: Browser check** (`web-8767`): `/`, `/eski/`, `/kr/`, `/ru/` at 375 and 1280 px — converter, word check, quiz to the result, «Işladimi?» field and switcher (hash kept) work in each; console has no errors; on `/kr/` and `/ru/` headings render in Onest, not Doto.
- [ ] **Step 6: Commit and push** `feat(web): JS matnlari 4 tilda, eski kirill tugmasi örniga til tanlagiç` → `git push origin main`.

### Task 6: Word pages

**Files:**
- Create: `site/sozlar.txt`, `site/lib/sozlar.mjs`, `site/lib/sozlar.test.mjs`, `site/pages/soz/index.html`, `site/ru/soz/index.html`, `web/soz-izoh.js` (explanation rendering moved out of `app.js`), `web/soz-qidiruv.js`
- Generated: `web/soz/**`, `web/{eski,kr,ru}/soz/**`, `web/soz/sozlar.json`
- Modify: `site/build.mjs` (call `sozPages`, write `sozlar.json`), `web/app.js` (use `soz-izoh.js`), `site/partials/header.html` + Russian twin (nav link «Sözlar» / «Слова»), `web/styles.css`, `site/build.test.mjs`

**Interfaces:**
- Produces in `site/lib/sozlar.mjs`:
  - `parseSozlar(text: string): Array<{eski: string, tur: "soz"|"ism-e"|"ism-a"|"joy"}>` — one entry per line `eski | tur`, `#` starts a comment, blank lines ignored, apostrophes normalised to ʻ (after o/g) and ʼ (tutuq).
  - `slugify(eski: string): string` — lower case, `oʻ`/`gʻ` → `o`/`g`, ʼ and ʻ dropped, `sh`/`ch` kept, anything else outside `[a-z0-9]` → `-`, repeated `-` collapsed.
  - `sozPages(entries): PrebuiltPage[]` — four pages per entry (`/soz/<slug>/` with each prefix) plus nothing else; frame text localized per version, word forms inserted raw inside `data-lotin`.
- Produces in `web/soz-izoh.js`: `renderExplain(text: string): string` (the HTML `app.js` builds today for the word check, now shared).
- Word page content per spec §5.2: h1 `«{eski} yangi alifboda: {yangi}»` (Russian «{kirill} на новом алфавите: {yangi}»), three forms (old Latin, new Latin, Cyrillic = `toCyrillic(yangi)`), rule list from `explain`, six related words (next entries with the same first letter, wrapping), button «Ism kartasini yasang» → `/ism/?n=<yangi>` for `ism-*` entries, link to the converter. `/soz/` index: letters A–Z then Ö Ğ Ş Ç, search field driven by `sozlar.json` (`[{e, y, s, t}]`); a query not in the list shows `convert(query)` with `renderExplain`.
- List content (`site/sozlar.txt`, ~800 lines, written by Claude, nothing copied from other sites): ~350 everyday words containing oʻ, gʻ, sh, ch or a tutuq; ~150 male and ~150 female given names (popular ones, some unchanged like Anvar); ~150 places (14 regions, their centres, large cities and districts).

- [ ] **Step 1: Write the failing tests:**
  - `slugify("Oʻzbekiston") === "ozbekiston"`, `slugify("Gʻulom") === "gulom"`, `slugify("Isʼhoq") === "ishoq"`, `slugify("choʻpon") === "chopon"`.
  - `parseSozlar("Gʻulom | ism-e\n# x\n\nma'no | soz")` → `[{eski: "Gʻulom", tur: "ism-e"}, {eski: "maʼno", tur: "soz"}]`.
  - for every entry in `site/sozlar.txt`: `toOldLatin(convert(eski)) === eski` (catches misspelt old forms) and slugs are unique.
  - `sozPages` for `Shahzod`: the `yangi` page contains `Şahzod` and `Шаҳзод`; the `eski` page's h1 contains both `Shahzod` and `Şahzod`; the four pages share the slug `shahzod` and each links the other three (Review Focus 2).
- [ ] **Step 2: Run** `node --test site/lib/sozlar.test.mjs` — Expected: FAIL.
- [ ] **Step 3: Implement** `sozlar.mjs`, the list, the index pages, `soz-izoh.js`, `soz-qidiruv.js`; wire into the build; `track("soz_sahifa_qidiruv")` once on first search input.
- [ ] **Step 4: Run** `npm run build && npm test` — Expected: PASS; `du -sh web/soz web/*/soz` totals under 20 MB.
- [ ] **Step 5: Commit** `feat(site): söz va ism sahifalari (4 til)`.

### Task 7: Name card

**Files:**
- Create: `web/kanvas.js`, `web/ism-hisob.js`, `web/ism-hisob.test.mjs`, `web/ism.js`, `site/pages/ism/index.html`, `site/ru/ism/index.html`
- Modify: `web/story.js` (import shared helpers from `kanvas.js`; output unchanged), `web/i18n-ru.js`, `web/styles.css`, `site/build.mjs` (`ASSET_V`)

**Interfaces:**
- Produces:
  - `web/kanvas.js`: `C`, `W = 1080`, `H = 1920`, `loadFonts(sample: string): Promise<void>`, `dot(g, x, y, r)`, `logo(g, x, y)`, `non(g, cx, cy, R)`, `background(g)` (crust fill + dot grid as in `drawStory`).
  - `web/ism-hisob.js`: `ismKarta(input: string): {yangi: string, eski: string, changed: string[]} | null` — trims, caps first letter of each part, max 40 characters, Cyrillic or old Latin in, `changed` = new letters (ö ğ ş ç ʼ) present in `yangi`, in that order; `null` for empty input.
  - `web/ism.js`: `drawNameStory(canvas, card): Promise<void>` — name centred, Doto 900 shrunk to fit 880 px, **Onest 800 when the name contains ğ**; old form and the changed-letter pairs below; logo at the top.
- Page: input (prefilled from `?n=`), live card, «Storyga qöyiş» (share with `navigator.canShare({files})`, else download `ism-yozgich.png`). Events `ism_karta` (once, first card), `ism_story`.

- [ ] **Step 1: Write the failing tests:** `ismKarta("G'ulom")` → `{yangi: "Ğulom", eski: "Gʻulom", changed: ["ğ"]}`; `ismKarta("Шаҳзод").yangi === "Şahzod"`; `ismKarta("SHAHZOD").yangi === "ŞAHZOD"`; `ismKarta("  anvar ")` → `{yangi: "Anvar", eski: "Anvar", changed: []}`; `ismKarta("") === null`; a 60-character input returns a 40-character `yangi`.
- [ ] **Step 2: Run** `node --test web/ism-hisob.test.mjs` — Expected: FAIL.
- [ ] **Step 3: Implement** the modules and page; refactor `story.js` onto `kanvas.js`.
- [ ] **Step 4: Run** `npm run build && npm test` — Expected: PASS.
- [ ] **Step 5: Browser check:** `/ism/?n=Gʻulom` and `/ru/ism/?n=Shahzod` produce a story PNG (open it, confirm ğ is not drawn in Doto); the quiz story image still looks as before.
- [ ] **Step 6: Commit and push** `feat(web): ism kartasi va story rasm` → `git push origin main`.

### Task 8: Typing practice

**Files:**
- Create: `site/mashq.txt`, `web/mashq-hisob.js`, `web/mashq-hisob.test.mjs`, `web/mashq.js`, `site/pages/mashq/index.html`, `site/ru/mashq/index.html`
- Generated: `web/mashq-matn.js`
- Modify: `site/build.mjs` (convert `site/mashq.txt` into `web/mashq-matn.js`), header partials (nav «Maşq» / «Тренажёр»), `web/i18n-ru.js`, `web/styles.css`

**Interfaces:**
- Produces:
  - `site/mashq.txt`: sections `[o] [g] [sh] [ch] [aralash] [gaplar]`, old Latin, each with ≥ 60 words or ≥ 10 sentences, written by Claude.
  - `web/mashq-matn.js` (generated): `export const MATN = {o: string[], g: string[], sh: string[], ch: string[], aralash: string[], gaplar: string[]}` in the new alphabet.
  - `web/mashq-hisob.js`:
    - `liveOk(target: string, typed: string): boolean` — `convert(typed)` is a prefix of `target` (tolerates Yozgiç's in-between `o'`).
    - `judgeWord(target: string, typed: string): {ok: boolean, missed: string[]}` — exact NFC comparison; `missed` lists the target's new letters at positions where `typed` differs.
    - `summary(results: Array<{ok: boolean, missed: string[]}>, ms: number): {wpm: number, accuracy: number, worst: string|null}` — `wpm = round(okCount / (ms / 60000))`, `accuracy = round(100 * okCount / results.length)`, `worst` = most frequent missed letter.
- Page per spec §6: mode tabs, target text with the current word highlighted (`liveOk` → neutral, else red), timer from first input, each word judged when the following space (or the end) is typed, result block with «Storyga qöyiş» drawn with `kanvas.js`, best result and practice days in `localStorage` key `yozgich-mashq` (try/catch), hint from `checkTyping(...).verdict === "ishlamadi"`. Events `mashq_boshlandi {rejim}`, `mashq_tugadi {rejim, wpm}`, `mashq_story`.

- [ ] **Step 1: Write the failing tests:** `liveOk("öğil", "o'") === true`; `liveOk("öğil", "ox") === false`; `judgeWord("öğil", "öğil")` → `{ok: true, missed: []}`; `judgeWord("öğil", "o'g'il")` → `{ok: false, missed: ["ö", "ğ"]}` (Review Focus 4); `summary([{ok:true,missed:[]},{ok:false,missed:["ş"]},{ok:true,missed:[]},{ok:false,missed:["ş"]}], 60000)` → `{wpm: 2, accuracy: 50, worst: "ş"}`; every `MATN` entry contains no `o'`, `g'`, `sh`, `ch` outside sʼh.
- [ ] **Step 2: Run** `node --test web/mashq-hisob.test.mjs` — Expected: FAIL.
- [ ] **Step 3: Implement** scoring, texts, generator step, page.
- [ ] **Step 4: Run** `npm run build && npm test` — Expected: PASS.
- [ ] **Step 5: Browser check** at 375 and 1280 px: type a mode to the end with new letters typed directly; type `o'g'il` raw and confirm the hint; story PNG opens.
- [ ] **Step 6: Commit and push** `feat(web): tez yoziş maşqi` → `git push origin main`.

### Task 9: ZIP reader and writer

**Files:**
- Create: `web/zip.js`, `web/zip.test.mjs`, `core/fixtures/namuna.docx` (made once with `textutil -convert docx` from a text containing `O'zbekiston, g'alaba, shahar, choy, ma'no, Is'hoq`)
- Modify: `.github/workflows/pages.yml` (add `actions/setup-node@v4` with `node-version: "22"` before the test step — `deflate-raw` streams need it)

**Interfaces:**
- Produces in `web/zip.js`:
  - `readZip(bytes: Uint8Array): Promise<Array<{name: string, data: Uint8Array}>>` — stored (0) and deflate (8) entries via `DecompressionStream("deflate-raw")`; rejects with `Error("zip")` on a bad signature, encryption, ZIP64 or another method.
  - `writeZip(entries: Array<{name: string, data: Uint8Array}>): Promise<Uint8Array>` — deflate via `CompressionStream("deflate-raw")`, CRC-32, entry order preserved.

- [ ] **Step 1: Write the failing tests:** `readZip(await writeZip(entries))` deep-equals `entries` for a text and a binary entry; `readZip(namuna.docx)` contains `word/document.xml` whose text includes `zbekiston`; `readZip(new Uint8Array([1,2,3]))` rejects with message `zip`.
- [ ] **Step 2: Run** `node --test web/zip.test.mjs` — Expected: FAIL.
- [ ] **Step 3: Implement** using the central directory (not local headers) to find entries.
- [ ] **Step 4: Run** `node --test web/zip.test.mjs` — Expected: PASS.
- [ ] **Step 5: Commit** `feat(web): brauzerda ZIP öqiş va yoziş (docx uçun)`.

### Task 10: File conversion logic

**Files:**
- Create: `web/fayl-ogir.js`, `web/fayl-ogir.test.mjs`

**Interfaces:**
- Consumes: `readZip`, `writeZip` (Task 9), `convert`.
- Produces:
  - `convertText(text: string, opts: {tutuq: boolean}): {text: string, changed: number}` — UTF-8 BOM kept; `changed` = count of ö ğ ş ç ʼ in output minus input.
  - `convertSubtitle(text, opts): {text, changed}` — lines that are only digits, contain `-->`, start with `WEBVTT` or `NOTE`, or are blank stay byte-identical.
  - `convertDocxXml(xml: string, opts): {xml: string, changed: number}` — only `<w:t …>` contents change; `<w:instrText>` untouched.
  - `convertDocx(bytes: Uint8Array, opts): Promise<{bytes: Uint8Array, changed: number}>` — parts matching `^word/(document|header\d*|footer\d*|footnotes|endnotes|comments)\.xml$`.
  - `convertFile(file: {name: string, bytes: Uint8Array}, opts): Promise<{name: string, bytes: Uint8Array, changed: number}>` — dispatch by extension (`txt md csv` → text, `srt vtt` → subtitle, `docx`); output name `<base>-yangi.<ext>`; rejects `Error("format")` for other extensions and `Error("hajm")` above 20 MB.
- Run-boundary algorithm (not determined by the signatures): within each `<w:p>`, decode entities of each run's text; walking runs left to right, when a run ends in `[oOgG]` and the next starts with an apostrophe (`'`, `’`, `‘`, `ʻ`, `` ` ``, `´`), or ends in `[sScC]` and the next starts with `[hH]`, move that first character to the end of the earlier run; when a run ends in a letter and the next starts with an apostrophe followed by a letter, replace that apostrophe with ʼ (if `tutuq`) in place; then `convert` each run's text separately and re-encode `& < >`.

- [ ] **Step 1: Write the failing tests:**
  - `<w:p><w:r><w:t>O</w:t></w:r><w:r><w:t>'zbek</w:t></w:r></w:p>` → runs `Ö` and `zbek`.
  - the same with `&apos;` and with `’` → `Ö`.
  - `s` | `hahar` → `ş` | `ahar`; `ma` | `'no` → `ma` | `ʼno`.
  - `<w:instrText>HYPERLINK "sh"</w:instrText>` unchanged.
  - srt: `1\n00:00:01,000 --> 00:00:02,000\nshahar\n` → only the last line becomes `şahar`.
  - text with BOM and Cyrillic `Шаҳар` → BOM kept, `Şahar`.
  - `convertFile` on `namuna.docx` → name `namuna-yangi.docx`, its `word/document.xml` (via `readZip`) contains `Özbekiston` and `şahar`; `convertFile({name: "a.pdf", …})` rejects `format`.
- [ ] **Step 2: Run** `node --test web/fayl-ogir.test.mjs` — Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** `node --test web/fayl-ogir.test.mjs web/zip.test.mjs` — Expected: PASS.
- [ ] **Step 5: Commit** `feat(web): docx, srt va matn fayllarini ögiriş`.

### Task 11: File converter page

**Files:**
- Create: `web/fayl.js`, `site/pages/fayl/index.html`, `site/ru/fayl/index.html`
- Modify: header partials (nav «Fayl» / «Файлы»), `site/pages/index.html` + Russian twin (one line under the converter: «Word yoki subtitr faylini ögiriş» → `/fayl/`), `web/i18n-ru.js`, `web/styles.css`, `site/build.mjs` (`ASSET_V`)

**Interfaces:**
- Consumes: `convertFile` (Task 10).
- Page per spec §7: drop zone (`<label>` + `<input type="file" multiple accept=".txt,.md,.csv,.srt,.vtt,.docx">`, drag and drop), tutuq checkbox, one result row per file with «Yuklab oliş» (Blob URL, revoked after click) and the changed count. Error copy: `format` → «Bu format qöllanmaydi. .doc, .pdf yoki .xlsx faylni Word (.docx) yoki matn sifatida saqlab, qayta taşlang.»; `hajm` → «Fayl 20 MB dan katta.»; no `DecompressionStream` → «Brauzeringiz eski: docx uçun Chrome, Edge, Safari 16.4 yoki Firefoxʼning yangi versiyasi kerak.»; any other error → «Faylni ögirib bölmadi. Asl fayl özgarmadi.» Events `fayl_ogirildi {tur}`, `fayl_xato {sabab}`.

- [ ] **Step 1: Implement** the page and module.
- [ ] **Step 2: Run** `npm run build && npm test` — Expected: PASS.
- [ ] **Step 3: Browser check:** drop `core/fixtures/namuna.docx`, download the result, open it with `textutil -convert txt` and confirm `Özbekiston`; drop a `.pdf` and see the `format` message; 375 and 1280 px.
- [ ] **Step 4: Commit and push** `feat(web): fayl konvertori sahifasi` → `git push origin main`.

### Task 12: Articles

**Files:**
- Create: `site/pages/maqola/index.html` and `site/pages/maqola/{nima-ozgardi,qonun,sh-qoidasi,tutuq,kirilldan,ismlar}.html`, the seven Russian twins under `site/ru/maqola/`
- Modify: `site/build.mjs` (page meta field `"article": {"published": "YYYY-MM-DD"}` → `Article` JSON-LD with `headline` = the page's `<h1>` text, `datePublished`, `inLanguage`, `author` Behruz Baxodirov), header partials (nav «Maqolalar» / «Статьи»), `site/build.test.mjs`, `web/styles.css`

**Interfaces:**
- Article topics, order and slugs exactly as spec §8.1; facts limited to the Global Constraints list; every article ends with the unofficial-rules note and links to the converter and, where relevant, `/soz/` and `/ism/`.

- [ ] **Step 1: Write the failing test** in `site/build.test.mjs`: each of the 6 article pages in each version has one `Article` JSON-LD whose `headline` equals the plain text of its `<h1>` and whose `datePublished` matches `^\d{4}-\d{2}-\d{2}$`; no article source contains `pasport`, `2031` or `Senat`.
- [ ] **Step 2: Run** `node --test site/build.test.mjs` — Expected: FAIL.
- [ ] **Step 3: Write** the articles and implement the JSON-LD step.
- [ ] **Step 4: Run** `npm run build && npm test` — Expected: PASS.
- [ ] **Step 5: Commit** `feat(site): 6 ta maqola (4 til)`.

### Task 13: Widget

**Files:**
- Create: `web/vidjet-src.js`, `site/lib/bundle.mjs`, `site/lib/bundle.test.mjs`, `site/pages/vidjet/index.html`, `site/ru/vidjet/index.html`
- Generated: `web/vidjet.js`
- Modify: `site/build.mjs` (write the bundle), footer partials (link «Saytingiz uçun vidjet»), `web/i18n-ru.js`, `web/styles.css`

**Interfaces:**
- Produces:
  - `bundleVidjet(converterSrc: string, vidjetSrc: string): string` — `/* yozgich.uz vidjet — generator yasagan */\n(() => {\n<converter.js with "export " removed>\n<vidjet-src.js>\n})();`
  - `web/vidjet-src.js` behaviour (spec §8.2): for each `[data-yozgich]` insert a `<button type="button" class="yozgich-btn">` before it (after it when `data-yozgich-button="bottom"`), inline styles only; first click converts the element's text nodes with `convert` (skip `script style textarea input code pre [contenteditable]`), keeping originals in a `WeakMap`; second click restores; labels from `data-yozgich-label="A|B"`, default `Yangi alifboda|Eski yozuvda`. No network, no storage.
- Page: live demo block in old Latin with the widget attached, the two-line embed code with a copy button (`track("vidjet_kod_nusxa")`), the options list.

- [ ] **Step 1: Write the failing tests:** the bundle contains no line starting with `export ` or `import `; evaluating it in `node:vm` with a stub `document` (`{readyState: "complete", querySelectorAll: () => []}`) does not throw; `web/vidjet.js` on disk equals `bundleVidjet(read converter.js, read vidjet-src.js)`.
- [ ] **Step 2: Run** `node --test site/lib/bundle.test.mjs` — Expected: FAIL.
- [ ] **Step 3: Implement** bundle, widget, page.
- [ ] **Step 4: Run** `npm run build && npm test` — Expected: PASS.
- [ ] **Step 5: Browser check:** on `/vidjet/` the demo converts and restores; an `about:blank`-style test page served from the scratchpad with the embed code pointing at `http://localhost:8767/vidjet.js` works.
- [ ] **Step 6: Commit** `feat(web): saytlar uçun vidjet`.

### Task 14: Integration, SEO guards, design notes

**Files:**
- Modify: `site/partials/footer.html` + Russian twin (links to every page and the four versions), `web/test/seo.test.mjs`, `DESIGN.md` (components: Til tanlagiç, Söz sahifa, Ism karta, Maşq, Fayl, Vidjet), `site/build.mjs` (`ASSET_V`)

- [ ] **Step 1: Write the failing tests** in `seo.test.mjs`, over every generated HTML file: one canonical equal to `https://yozgich.uz/` + its path; hreflang alternates reciprocal (each alternate's page links back); `sitemap.xml` lists every page exactly once; no `/eski/` page contains ö ğ ş ç outside `EXCLUDE` elements; every `/ru/` page has `<html lang="ru"`.
- [ ] **Step 2: Run** `npm test` — Expected: FAIL until the footer and any stray copy are fixed; fix them.
- [ ] **Step 3: Run** `npm run build && npm test` — Expected: PASS.
- [ ] **Step 4: Browser pass** over `/`, `/soz/`, one word page, `/ism/`, `/mashq/`, `/fayl/`, `/maqola/` and one article, `/vidjet/` in all four versions at 375 and 1280 px: no horizontal scroll, no console errors, switcher keeps the page.
- [ ] **Step 5: Commit and push** `chore(site): footer, SEO testlari, DESIGN.md` → `git push origin main`; then confirm the live site serves `/kr/` and `/soz/shahzod/` (or another listed word) with HTTP 200.

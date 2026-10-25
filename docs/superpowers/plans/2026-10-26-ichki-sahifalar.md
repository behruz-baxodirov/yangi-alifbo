# Redesign stage 4: inner pages — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every inner page one page head inside the amber band (crumb, title, lede) and move the six inner pages to the approved two-column / grid layouts.

**Architecture:** A `div.page-head` becomes the first child of `<main>` in each inner page source (static pages in `site/pages/**` + `site/ru/**`; generated word and article index pages in `site/lib/sozlar.mjs`); CSS paints it with the band via `::before` like `.bar`/`.hero`, contiguous with the header. Page layouts are CSS grids around the existing markup; JS logic stays except two small additions (practice stats aside, name-card save button).

**Tech Stack:** Static HTML/CSS/vanilla JS ES modules, Node ≥ 22 generator, `node --test`, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-10-26-ichki-sahifalar-design.md`. Mockup: https://claude.ai/artifact/M2HRVAQ152A4KLUR3WaZPA (variant A).

## Global Constraints

- Sources in the new alphabet; `/eski/`, `/kr/` generated; Russian twins in `site/ru/**` updated in the same task; `data-lotin` for examples/formats.
- Never hand-edit `web/**/index.html`; `npm run build` before each commit touching `site/` or web CSS/JS; commit generated `web/`. Bump `ASSET_V` (now `"40"`) once per task that changes CSS/JS.
- DESIGN rules: 3px corners, no shadows, no Doto line ending in ".", no ğ in Doto, `.page-title` added to the Cyrillic/Russian Onest 800 list.
- Page head sizes exactly as spec §2.2. Breakpoint for one column: 860px.
- Tests with plain commands: `node --test site/build.test.mjs`, `node --test web/<file>.test.mjs`; full `npm test`.
- Shared machine: preview `preview_start {name: "web-8767"}`.
- Ship: `git fetch`, `npm test`, push `HEAD:main` (`push-deploy-without-asking`), check live.

## Review Focus

1. Band continuity: no flour gap between `.bar` and `.page-head` on any inner page at 375 and 1280 (section top paddings removed). → Task 1 browser check.
2. `/soz/` search results list opening inside the band stays readable and does not overflow on phones. → Task 2 browser check.
3. Kirill/rus: `.page-title` falls back to Onest 800; crumbs and tags translated in Russian. → Tasks 1–2 build tests.
4. Practice aside before any practice: shows «—», not 0 or NaN; 7-day dots handle an empty store. → Task 4 unit test.
5. Name page with empty input: card shows the sample in faded state; save button disabled until a name exists. → Task 6 browser check.

---

### Task 1: Page head component on static pages

**Files:** `web/styles.css` (new `.page-head` block; remove top padding of `.tel-page`, `.qoida-page`, `.fayl`, `.mashq`, `.ism`, `.maqola-index`, `.vidjet` sections), `site/pages/{fayl,mashq,ism,vidjet,telefon,qoidalar}/index.html`, `site/pages/maqola/index.html` and their `site/ru/**` twins, `site/build.mjs` (`ASSET_V` → `"41"`), test `site/build.test.mjs`.

**Interfaces:** Produces classes `.page-head`, `.page-crumb`, `.page-title`, `.page-title--text`, `.page-lede`.

- [ ] **Step 1: Failing test** `test("inner pages open with one page head in the band")`: for `["fayl","mashq","ism","vidjet","telefon","qoidalar","maqola"]` × every `TILLAR` prefix, the `<main id="main">` content starts (after whitespace) with `<div class="page-head">` and the page head holds exactly one `<h1 class="page-title`; `index.html` and `test/index.html` contain no `page-head`.
- [ ] **Step 2:** `node --test site/build.test.mjs` → FAIL.
- [ ] **Step 3:** Move each page's `h1` + lede into `div.page-head` placed before its `<section>`; `h1` class `page-title`, lede class `page-lede`. CSS per spec §2.2: `.page-head { position: relative; isolation: isolate; max-width: var(--max); margin: 0 auto; padding: 28px var(--gutter) 48px; display: grid; gap: 12px; }` with `::before` band (same as `.bar::before`); `.page-title` Doto 900 46px/1.05, max 22ch, balance; `--text` Onest 800 42px; `.page-lede` 19px char-soft max 60ch; `.page-crumb` 14px 700 underline; ≤860px: padding 20px/32px, title 32px (`--text` 30px), lede 17px. Following sections start 40px below (24px phone).
- [ ] **Step 4:** `npm run build && npm test` PASS; preview 375/1280: `/fayl/`, `/telefon/`, `/ru/maqola/` band continuous (`.bar` bottom == `.page-head` top), no horizontal scroll.
- [ ] **Step 5:** Commit `feat(web): umumiy sahifa boşi lentada`.

### Task 2: Page head on generated pages (word index, word pages, articles)

**Files:** `site/lib/sozlar.mjs` (index `main` at ~171-178, word page at ~114-116), `site/pages/maqola/*.html` + `site/ru/maqola/*.html` (6 + 6 articles), `web/styles.css` (search field inside band), test `site/build.test.mjs`, `site/lib/sozlar.test.mjs` if it pins the old markup.

- [ ] **Step 1: Failing tests:** `soz/index.html` starts main with `page-head` containing `id="soz-q"`; `soz/shahzod/index.html` page head has `<a class="page-crumb" href="/soz/">` and `page-title page-title--text`; `maqola/tutuq/index.html` page head has crumb to `/maqola/`, `page-title--text` and `class="maqola-meta"`; `ru/soz/index.html` crumb-less head with Russian title. Run → FAIL.
- [ ] **Step 2:** Implement: word index head = title, lede, the `check soz-qidir` block (label, field, results) moved inside; `nav.harflar` and groups follow in `section.soz-index`. Word page head = crumb «← Sözlar» (`str(til,"crumb")`, keep the letter link after it), title. Articles: `<p class="soz-crumb">` → head crumb «← Maqolalar», `h1.soz-h1` → `page-title page-title--text`, `maqola-meta` inside head. Search field in band: `--flour` field, max 560px; results list below it, flour background, 2px char border.
- [ ] **Step 3:** `npm run build && npm test` PASS (update pinned sozlar tests only where they assert the old class names; record each as a deviation). Preview `/soz/` 375: type «sha», results readable inside band.
- [ ] **Step 4:** Commit `feat(web): söz va maqola sahifalarida sahifa boşi`.

### Task 3: `/fayl/` two columns

**Files:** `site/pages/fayl/index.html`, `site/ru/fayl/index.html`, `web/styles.css`, test `site/build.test.mjs`.

- [ ] **Step 1: Failing test:** `fayl/index.html` has `class="fayl-grid"` with `class="fayl-main"` (contains `id="fayl-drop"`, `id="fayl-tutuq"`, `id="fayl-list"`) and `<aside class="fayl-side">` containing the «Word hujjat bilan nima böladi» heading and a link to `/#konverter`; six `class="fayl-fmt"` chips. FAIL.
- [ ] **Step 2:** Markup per spec §3.1 (drop icon inline SVG, `aria-hidden`; existing ids kept); side card char slab with the existing two paragraphs split into three list items; converter link card. CSS: grid `1.4fr 1fr`, gap 32px; drop 320px (phone 240px). `fayl.js` untouched (drop/input ids unchanged).
- [ ] **Step 3:** build+test PASS; preview: drop a `.txt` via the file input, result appears in the main column. **Step 4:** Commit `feat(web): /fayl/ ikki ustun`.

### Task 4: `/mashq/` two columns and stats aside

**Files:** `site/pages/mashq/index.html`, `site/ru/mashq/index.html`, `web/mashq.js`, `web/mashq-hisob.js`, `web/mashq-hisob.test.mjs`, `web/styles.css`, `web/i18n-ru.js` (new JS strings).

**Interfaces:** `lastDays(kunlar: string[], today: Date, n = 7) → boolean[]` (oldest first, true where practiced) in `mashq-hisob.js`.

- [ ] **Step 1: Failing tests** `web/mashq-hisob.test.mjs`: `lastDays([], new Date(2026, 9, 26))` → 7 × false; `lastDays(["2026-10-26","2026-10-24"], new Date(2026, 9, 26))` → `[false,false,false,false,true,false,true]`; days older than 7 ignored. FAIL.
- [ ] **Step 2:** Implement `lastDays`. Markup: `.mashq-grid` (main: mode chips in `.seg`-style frame, practice box, result block; `<aside class="mashq-side">`: two char stat cards `#mashq-wpm-k` / `#mashq-acc-k` showing «—» initially, best card `#mashq-best` text «Eng yaxşi natija: N söz/daqiqa», dots `#mashq-kunlar`, privacy note). `mashq.js`: after a run fills the cards from `last.wpm`/`last.accuracy`; on load and after a run renders best and `lastDays(store.kunlar, new Date())` dots.
- [ ] **Step 3:** tests PASS; preview: before practice «—»; after typing a run the cards update. **Step 4:** Commit `feat(web): /mashq/ ikki ustun, natija kartalari`.

### Task 5: `/soz/` grid and `/maqola/` cards

**Files:** `site/lib/sozlar.mjs`, `site/pages/maqola/index.html`, `site/ru/maqola/index.html`, `web/styles.css`, test `site/build.test.mjs`.

- [ ] **Step 1: Failing tests:** `soz/index.html` each `section.harf` holds `<h2 class="harf-h"` with the letter and a count span `N ta` (Russian «N шт.»), the letter `Ğ` heading carries class `harf-h--text`; `maqola/index.html` has `class="maqola-grid"` with 6 `<a class="maqola-card`, the first also `maqola-card--top`, each with a `maqola-tag`. FAIL.
- [ ] **Step 2:** Implement per spec §3.3–3.4: group layout `90px 1fr`; list grid 3/2/1 columns (≥1024 / 640–1023 / phone), item cells `--flour-deep` with old (char-soft) and new (700); `nav.harflar` `position: sticky; top: 0` with flour background. Article cards with tags from the spec table (Russian tags in the twin).
- [ ] **Step 3:** build+test PASS; preview: sticky letters while scrolling `/soz/`; cards at 1280 and 375. **Step 4:** Commit `feat(web): sözlar töri va maqola kartalari`.

### Task 6: `/ism/` live card and save, `/vidjet/` two columns

**Files:** `site/pages/ism/index.html`, `site/ru/ism/index.html`, `web/ism.js`, `site/pages/vidjet/index.html`, `site/ru/vidjet/index.html`, `web/styles.css`, `web/i18n-ru.js`.

- [ ] **Step 1: Failing test:** `ism/index.html` has `.ism-grid` with `.ism-main` (field `#ism-q`) and `<aside class="ism-side">` holding `#ism-card` (live card: `.ism-card-name`) and buttons `#ism-story`, `#ism-save` (disabled in markup); `vidjet/index.html` has `.vidjet-grid` with `<ol class="vidjet-steps">` (3 items) and `<aside class="vidjet-side">` containing `class="vidjet-demo"`. FAIL.
- [ ] **Step 2:** Implement per spec §3.5–3.6. `ism.js`: on input set `.ism-card-name` text to the converted name (sample «Ğulom», faded class, when empty); enable `#ism-save`; save = existing blob download path (the `a.download = "ism-yozgich.png"` branch) without share. Vidjet: steps from existing copy, demo block and code block moved, ids kept.
- [ ] **Step 3:** build+test PASS; preview: typing «G'ulom» updates the card to «Ğulom»; save downloads a PNG (check `story-prev` / blob created). **Step 4:** Commit `feat(web): /ism/ jonli karta, /vidjet/ ikki ustun`.

### Task 7: DESIGN.md, checks, review, ship

- [ ] DESIGN.md: «Page Head» component and inner-page grids. Copy check over changed sources with `convert()`. Browser pass 375/1280 across all inner pages + `/kr/fayl/`, `/ru/soz/`. Commit `docs(design): sahifa boşi va içki sahifa panjaralari`. Final whole-branch review (fresh reviewer), fix pass, ship and check live.

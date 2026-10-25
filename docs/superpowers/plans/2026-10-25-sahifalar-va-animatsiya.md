# Redesign stages 2+3: separate pages and the "how it works" animation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the phone guide, rules and quiz from the home page to `/telefon/`, `/qoidalar/`, `/test/` (four versions each), replace them on the home page with link cards, and add the keycap hero animation and the time race with its calculator.

**Architecture:** New page sources in `site/pages/<slug>/index.html` with Russian twins in `site/ru/<slug>/index.html`; each declares its own module via the meta `script` key, which `site/build.mjs:146` turns into a `<script type="module">`. Code that leaves `web/app.js` goes into small shared modules (`tablar.js`, `nusxa.js`) so the home page and the new pages share it. The two animations are pure step/state functions (`sahna.js`, `vaqt.js`, unit-tested) plus thin DOM mounts; markup carries the final state so no-JS and reduced-motion visitors see it.

**Tech Stack:** Static HTML/CSS/vanilla JS ES modules, Node ≥ 22 generator and `node --test`, GitHub Pages.

**Specs:** `docs/superpowers/specs/2026-10-25-alohida-sahifalar-design.md` (stage 2) and `docs/superpowers/specs/2026-10-25-qanday-ishlaydi-animatsiya-design.md` (stage 3). Approved visuals: mockup canvas https://claude.ai/artifact/7CkxYgsPY68Zrjh5fWfSDC, animation prototype https://claude.ai/artifact/C5kfwh1q8TU828RNhvZSCW (its source, the reference for markup/CSS/timings, is committed at `docs/superpowers/specs/2026-10-25-animatsiya-prototip.html`).

## Global Constraints

- Sources in the new alphabet (ö ğ ş ç, tutuq ʼ U+02BC); `/eski/` and `/kr/` are generated; every page needs a Russian twin or the build fails (`site/build.test.mjs` "a page without a Russian twin fails the build"). Examples, digits and clocks that must not convert sit in `data-lotin`.
- Language surface, read from code: `TILLAR` in `site/build.mjs` (yangi, eski, kr, ru); JS strings go through `t()`/`tx()` from `web/i18n.js` with Russian in `web/i18n-ru.js` (key = new-Latin source string).
- Never hand-edit `web/**/index.html`; `npm run build` before each commit touching `site/` or web CSS/JS; commit generated `web/` too. Bump `ASSET_V` in `site/build.mjs` (now `"31"`) once per task that changes CSS or JS.
- Moved copy is moved, not rewritten: phone steps, rules, notes, quiz questions keep their text (`site/pages/index.html:252-401`, `site/ru/index.html:252-401`).
- DESIGN rules: flour ground, amber band only behind header (+ hero on `/`), work panels `--flour-deep`, 3px corners, no shadows, no Doto line ending in ".", no ğ in Doto, Cyrillic/Russian headings fall back to Onest 800 (`web/styles.css` list at the `html:is([lang="uz-Cyrl"], [lang="ru"])` rule — add every new Doto heading class there).
- Decimal comma in clocks (`6,4 s`): Doto draws "." as a plus.
- Analytics event names exactly as the specs: existing `telefon_tab`, `soz_tekshirildi`, `test_boshlandi`, `test_tugadi`, `test_qayta`, `story_ulashildi`; new `vaqt_korsatildi`, `vaqt_qayta`, `vaqt_hisob`; section-reach `kordi_<id>`.
- Tests with plain commands: `node --test web/<file>.test.mjs`, `node --test site/build.test.mjs`; full `npm test`.
- Shared machine: preview with `preview_start {name: "web-8767"}`.
- Ship: after the final task, `git fetch`, rebase on `origin/main`, `npm test`, push `HEAD:main` (`push-deploy-without-asking`), check the live site.

## Review Focus

1. **Old links:** `/#telefonda`, `/#qoidalar`, `/#soz-tekshir`, `/#test` on every version prefix land on the matching new page (Instagram posts use them). → Task 1 unit test + Task 8 browser check.
2. **Phone first screen:** order stays headline → converter → stage → lede → slab; the stage must not push the converter below the fold or overflow 320px. → Task 6 CSS; Task 8 measures at 320/375.
3. **Converter restamp vs. stage loop:** typing a new letter in the converter restamps the non and pauses the stage 6 s without the two fighting over the non. → Task 6 browser check (type «choy», watch the non hold ç for 6 s).
4. **Reduced motion / no JS:** stage and race show their final state (markup), timers never start. → Tasks 6–7 markup tests; Task 8 emulation.
5. **`/kr/` and `/ru/`:** new Doto headings fall back to Onest 800; clocks and examples stay Latin; Russian pages have real Russian copy. → Tasks 2–5, 7 build tests; Task 8 browser.

---

### Task 1: Shared modules and old-link redirect

**Files:**
- Create: `web/tablar.js`, `web/nusxa.js`, `web/yonaltir.js`, `web/yonaltir.test.mjs`
- Modify: `web/app.js` (use the modules; remove the inlined `setupTabs` at ~99-125 and copy-button block at ~214-240)
- Modify: `site/build.mjs` (`ASSET_V` → `"32"`)

**Interfaces:**
- Produces: `setupTabs(list: Element, initialId: string): void` (moved verbatim from `app.js`); `setupCopy(root: ParentNode, device: "mac"|"windows"|"phone"): void` (wires every `[data-copy]` in `root`, body moved verbatim); `export const DEVICE` and `export function deviceOf(ua: string)` in `nusxa.js` (UA rule moved from `app.js:12-16`); `redirectFor(pathname: string, hash: string): string | null` in `yonaltir.js`.

- [ ] **Step 1: Failing test** `web/yonaltir.test.mjs`: `redirectFor("/", "#telefonda") === "/telefon/"`, `redirectFor("/", "#qoidalar") === "/qoidalar/"`, `redirectFor("/", "#soz-tekshir") === "/qoidalar/#soz-tekshir"`, `redirectFor("/", "#test") === "/test/"`, `redirectFor("/kr/", "#qoidalar") === "/kr/qoidalar/"`, `redirectFor("/eski/", "#test") === "/eski/test/"`, `redirectFor("/", "#konverter") === null`, `redirectFor("/fayl/", "#telefonda") === null` (only home paths `/`, `/eski/`, `/kr/`, `/ru/`).
- [ ] **Step 2:** `node --test web/yonaltir.test.mjs` → FAIL (module missing; start with a stub that throws).
- [ ] **Step 3:** Implement the three modules; `app.js` imports them and calls `const to = redirectFor(location.pathname, location.hash); if (to) location.replace(to);` as its first statement after imports.
- [ ] **Step 4:** `node --test web/yonaltir.test.mjs` PASS; `npm run build && npm test` PASS; home page tabs and copy buttons still work in the preview at 1280.
- [ ] **Step 5:** Commit `refactor(web): tablar, nusxa va eski havola yönaltiriş modullari`.

### Task 2: `/telefon/` page

**Files:**
- Create: `site/pages/telefon/index.html`, `site/ru/telefon/index.html`, `web/telefon.js`
- Modify: `web/styles.css` (segment tabs `.seg`, method disclosures `.usul`), `web/app.js` (drop phone tabs init and `telefon_tab` stays in `telefon.js`)
- Test: `site/build.test.mjs`

**Interfaces:** Consumes `setupTabs`, `DEVICE` (Task 1). Page meta: `"path": "/telefon/", "script": "telefon.js"`, title «Telefonda yangi alifboda yoziş: iPhone va Android · Yozgiç».

- [ ] **Step 1: Failing test** `test("phone page: two tabs, three closed methods each, every version")`: for each `TILLAR` prefix the real site has `<prefix>telefon/index.html`; `telefon/index.html` has `role="tablist"`, exactly 6 `<details class="usul"` and none with `open`; first summary of each panel contains `Tavsiya`; `kr/telefon/index.html` h1 is converted (`Телефонда ёзиш`); `ru/telefon/index.html` exists with Russian h1.
- [ ] **Step 2:** `node --test site/build.test.mjs` → FAIL.
- [ ] **Step 3:** Build the page per spec 3.1: h1/lede, `.seg` tablist (`tab-ios`, `tab-and`, panels `panel-ios`, `panel-and`), three `details.usul` per panel (summary: Doto number square, name, «Tavsiya» tag on #1, one-line «kimga mos» from the spec table; body: the existing steps/notes/keyrows/`look` table moved from `site/pages/index.html:263-326`, method 3 body = one sentence + link `/#konverter`), then the `guide-warn` block. Russian twin from `site/ru/index.html:252-329` with translated summary lines. `telefon.js`: `setupTabs(list, /Android/i.test(navigator.userAgent) ? "tab-and" : "tab-ios")`, `telefon_tab` tracking. CSS: `.usul` = `--flour-deep`, 2px char border, summary 18px padding, dot +/− via `summary::after` (reuse the FAQ dot glyph); `.seg` = 2-col grid in a 2px char frame, selected char/flour.
- [ ] **Step 4:** `npm run build && npm test` PASS; preview `/telefon/` 375 and 1280: tabs switch with arrows, each method opens.
- [ ] **Step 5:** Commit `feat(web): /telefon/ sahifasi — usullar yopiq röyxatda`.

### Task 3: `/qoidalar/` page

**Files:**
- Create: `site/pages/qoidalar/index.html`, `site/ru/qoidalar/index.html`, `web/qoidalar.js`
- Modify: `web/styles.css` (`.qoida-sec` layout), `web/app.js` (remove word check ~192-212 and countdown ~266-283 and their imports)
- Test: `site/build.test.mjs`

**Interfaces:** Consumes `setupCopy`, `DEVICE`. `qoidalar.js` moves the word-check block (ids `soz`, `soz-natija`, `soz-word`, `soz-why`, rows `.rule-table tr[data-rule]`, event `soz_tekshirildi`) and the countdown block (ids `kun`, `kunlar`, `sanoq-matn`, `sanoq`) verbatim. Page meta `"path": "/qoidalar/", "script": "qoidalar.js"`, title «Yangi alifbo qoidalari: ö ğ ş ç va tutuq · Yozgiç».

- [ ] **Step 1: Failing test** `test("rules page: three headed sections, table, check and countdown")`: `qoidalar/index.html` has three `<h2` with ids `h-jadval`, `soz-tekshir`, `h-qonun` in that order; contains `class="rule-table"` with 6 `data-rule` rows, `id="soz"`, `id="kunlar"`; every version exists.
- [ ] **Step 2:** FAIL. **Step 3:** Build per spec 3.2 (section 2's wrapper keeps `id="soz-tekshir"` so the redirect anchor lands; h2 texts «Nima özgardi», «Sözingizni tekşiring», «Qonun kuçga kirişiga»). Russian twin from `site/ru/index.html:331-369`. **Step 4:** `npm run build && npm test` PASS; preview: typing `Is'hoq` lights the s'h row and shows `Isʼhoq`. **Step 5:** Commit `feat(web): /qoidalar/ sahifasi — jadval, söz tekşiruv, sanoq alohida`.

### Task 4: `/test/` page with the intro screen

**Files:**
- Create: `site/pages/test/index.html`, `site/ru/test/index.html`, `web/test-sahifa.js`
- Modify: `web/test.js` (delete line 131 `test-rule`; delete the `started`/`test_boshlandi` lines 21/45), `web/styles.css` (`.test-intro`), `web/i18n-ru.js` if a new JS string appears, `web/app.js` (remove `mountTest`)
- Test: `site/build.test.mjs`, `web/test.test.mjs` stays green

**Interfaces:** Consumes `mountTest(section, track)` unchanged otherwise. `test-sahifa.js`: on `#test-start` click → hide `#test-intro`, show `#test` (remove `hidden`), `track("test_boshlandi")`, `mountTest(document.getElementById("test"), track)`, focus `#q`. Page meta `"path": "/test/", "script": "test-sahifa.js"`, title «Yangi alifbo testi: 10 savol · Yozgiç».

- [ ] **Step 1: Failing test** `test("quiz page opens on an intro that names it a test")`: `test/index.html` has `id="test-intro"` containing `Test · 10 savol · 1 daqiqa` and `id="test-start"`; `section id="test"` carries `hidden`; h1 `Yangi alifboni qançalik bilasiz?`; every version exists.
- [ ] **Step 2:** FAIL. **Step 3:** Intro per spec 3.3 (Doto h1 class `test-title`, added to the Cyrillic fallback list), quiz markup moved from `site/pages/index.html:371-399` with its h2 changed to a visually hidden label since the intro owns the h1. **Step 4:** `npm run build && npm test` PASS; preview: start → 10 questions → result → story image renders. **Step 5:** Commit `feat(web): /test/ sahifasi — kiriş ekrani bilan`.

### Task 5: Home cleanup, link cards, navigation

**Files:**
- Modify: `site/pages/index.html`, `site/ru/index.html` (remove `section.phone`, `section.rules`, `section.quiz-sec` and the `sec-rule` divs between them; add `section#yana` cards; FAQ/other `#telefonda`/`#qoidalar`/`#test` hrefs → new pages), `site/partials/header.html`, `site/ru/partials/header.html`, `site/partials/footer.html`, `site/ru/partials/footer.html`, `site/build.mjs` (`BOLIMLAR` += `telefon`, `qoidalar`, `test`), `web/app.js` (section-reach list → `["konverter", "vaqt", "yana", "savollar", "asoschi"]`; drop leftover imports), `web/styles.css` (`.yana` cards), `web/llms.txt`
- Test: `site/build.test.mjs`

**Interfaces:** Consumes Tasks 2–4 paths. Header nav exactly: Konverter `/#konverter`, Telefonda `/telefon/`, Qoidalar `/qoidalar/`, Test `/test/`, Maşq `/mashq/`, Sözlar `/soz/` (Russian: Конвертер, Телефон, Правила, Тест, Тренажёр, Слова). Menu and footer lists exactly as stage 2 spec §5.

- [ ] **Step 1: Failing tests**: `test("home links to the three pages and no longer hosts them")`: `index.html` has no `id="telefonda"`, `id="qoidalar"`, `id="test"`; has `section id="yana"` with links `/telefon/`, `/qoidalar/`, `/test/`; no `href="#telefonda"`/`#qoidalar`/`#test` anywhere in `site/pages/index.html`. `test("header marks the new sections")`: `test/index.html` header matches `href="/test/" aria-current="page"`; `telefon/index.html` matches `href="/telefon/" aria-current="page"`; header has no `href="/fayl/"` in `.bar-nav`.
- [ ] **Step 2:** FAIL. **Step 3:** Implement; cards per spec §4 table (desktop 3 columns, phone rows; whole card one `<a>`); `yana-title` Doto added to the Cyrillic list; llms.txt: Qoidalar link → `/qoidalar/`, add `/telefon/` and `/test/` lines. **Step 4:** `npm run build && npm test` PASS; preview 1280: header fits one row in `/ru/` at 1024 (if not, raise the menu breakpoint in `web/styles.css` and say so in the ledger). **Step 5:** Commit `feat(web): boş sahifada havola kartalari, yangi header bölimlari`.

### Task 6: Hero stage (keycap animation bound to the non)

**Files:**
- Create: `web/sahna.js`, `web/sahna.test.mjs`
- Modify: `site/pages/index.html`, `site/ru/index.html` (hero right column: `.stage` with label, `.screen#screen`, existing `.non`, `.keys#keys`, shift hint; final state in markup), `web/app.js` (remove the free-running `setInterval(tick…)`; mount the stage; `restamp` pauses it), `web/styles.css` (stage, `.key` states, phone order), `site/build.mjs` (`ASSET_V`)
- Test: `site/build.test.mjs`

**Interfaces:**
- `export const WORDS = [{ k: ["o","'","z","b","e","k"], at: 0, to: "ö" }, { k: ["c","h","o","y"], at: 0, to: "ç" }, { k: ["t","o","g","'"], at: 2, to: "ğ" }, { k: ["s","h","a","h","a","r"], at: 0, to: "ş" }]`
- `wordSteps(word) → Array<{ type: "press", i } | { type: "old", text } | { type: "merge", i, to } | { type: "screen", text }>`; the last `screen` step's text is the converted word.
- `mountSahna(root: Element, { onMerge(to: string): void, reduce: boolean }) → { pause(ms: number): void }`; skips while `document.hidden`.
- `app.js`: `const sahna = mountSahna(stageEl, { onMerge: (to) => showPair(PAIR_OF[to], true), reduce: reduceMotion })`; `restamp()` calls `sahna.pause(6000)`.

- [ ] **Step 1: Failing tests** `web/sahna.test.mjs`: for `WORDS[0]`: presses for i = 0..5 in order; an `old` step with text `o'` right after press 1; then `merge` `{ i: 0, to: "ö" }`; final `screen` text `özbek`. For `WORDS[2]` the merge is `{ i: 2, to: "ğ" }` and final screen `toğ`. Build test `test("home hero carries the stage in its final state")`: `index.html` has `class="stage"`, `id="screen"` containing `özbek`, a `key merged` with `ö`, and `aria-hidden="true"` on the stage.
- [ ] **Step 2:** FAIL. **Step 3:** Implement per stage 3 spec §2 (timings 500/110/200/320/1500/350 ms; shift taps every second word; CSS from the prototype adapted to tokens; phone sizes 46×50 keys, 150px non; phone grid areas `"head" "try" "stage" "lede" "dl"`). **Step 4:** `node --test web/sahna.test.mjs` PASS; `npm run build && npm test` PASS; preview: one full loop of four words, non stamps each letter; typing «choy» in the converter restamps ç and the stage pauses. **Step 5:** Commit `feat(web): hero sahnasi — tugmalar bosiladi, juftlik yangi harfga aylanadi`.

### Task 7: Time race and calculator

**Files:**
- Create: `web/vaqt.js`, `web/vaqt.test.mjs`
- Modify: `site/pages/index.html`, `site/ru/index.html` (`section#vaqt` after the converter, before `#yana`, final state in markup), `web/app.js` (`mountVaqt`), `web/styles.css` (race, calc; `.vaqt-title` in the Cyrillic list), `web/i18n-ru.js` (only if JS writes words), `site/build.mjs` (`ASSET_V`)
- Test: `site/build.test.mjs`

**Interfaces:**
- `raceAt(t: number) → { slow: { clock: string, text: string, step: -1|0|1|2|3, search: boolean, fill: number }, fast: { clock: string, text: string, chip: -1|0|1, done: boolean, fill: number }, finished: boolean }` with constants `SLOW = 6.4`, `FAST = 0.4`, `SCALE = 8`, steps `[[0.5,2.3],[2.3,3.6],[3.6,4.8],[4.8,6.4]]`; `fill` in 0..1.
- `savings(n: number) → { week: number, year: number, count: number }` (6 s per letter: `week = round(n*6*7/60)`, `year = round(n*6*365/3600)`, `count = n*365`).
- `mountVaqt(root: Element, track) → void`: starts once at 40% visibility (`vaqt_korsatildi`), replay button (`vaqt_qayta`), slider (`vaqt_hisob {harf}` once); reduced motion → `raceAt(SLOW)` and no timer.

- [ ] **Step 1: Failing tests** `web/vaqt.test.mjs`: `raceAt(0)` → both clocks `0,0 s`, slow text `""`; `raceAt(0.3)` → fast text `Ko'`, chip 1; `raceAt(1)` → fast done, clock `0,4 s`, slow step 0, search true; `raceAt(5)` → slow step 3; `raceAt(7)` → slow clock `6,4 s`, text `Kö`, step -1, finished true, fills 0.8 and 0.05; `savings(40)` deep-equals `{ week: 28, year: 24, count: 14600 }`; `savings(200).count === 73000`. Build test: `index.html` has `section id="vaqt"` with h2 `Qölda 6 soniya, Yozgiç bilan bir zumda`, clocks `6,4 s` and `0,4 s` inside `data-lotin`, `input type="range"` id `n` min 10 max 200 value 40.
- [ ] **Step 2:** FAIL. **Step 3:** Implement per stage 3 spec §3; markup and CSS from the prototype adapted to tokens; minute/hour units in markup, JS writes only numbers. **Step 4:** tests PASS; `npm run build && npm test` PASS; preview: race starts on scroll, replays, slider updates the three cards. **Step 5:** Commit `feat(web): vaqt poygasi va tejaliş kalkulyatori`.

### Task 8: DESIGN.md, checks, review, ship

**Files:** Modify `DESIGN.md` (components: Stage, Keycap, Race, Link cards, Method disclosure, Segment tabs; motion section: keycap press/merge and race timing; remove "One motion" claim → two named motions plus the non stamp); any file from Tasks 1–7 only if a check fails (ledger it as a deviation).

- [ ] **Step 1:** DESIGN.md update. **Step 2:** Copy check: run `convert()` from `web/converter.js` over visible text of every new/changed source page and partial; list each change as fixed or intentional. **Step 3:** Browser pass, one batched round + at most one fix round: `/`, `/telefon/`, `/qoidalar/`, `/test/`, `/kr/qoidalar/`, `/ru/test/` at 320, 375, 1280; Review Focus 1–5; reduced-motion emulation; `scrollWidth <= innerWidth`; screenshots of `/` hero and race at 375 and 1280 for the owner. **Step 4:** Commit `docs(design): sahna, poyga, yangi sahifa komponentlari`. **Step 5:** Final whole-branch review (fresh reviewer, most capable model), fix pass per executing-plans. **Step 6:** Ship per Global Constraints and check https://yozgich.uz/, /telefon/, /test/ live.

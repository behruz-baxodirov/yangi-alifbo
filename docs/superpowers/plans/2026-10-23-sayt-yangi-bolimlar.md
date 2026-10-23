# Sayt yangi bölimlari Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add five features to yozgich.uz (`web/`): phone typing guide, law countdown, word check, 10-question quiz with a story image, and a Cyrillic reading mode.

**Architecture:** Each feature's logic is a pure ES module with a `node --test` file (`sanoq.js`, `soz.js`, `test-savollar.js`, `kirill.js`); DOM wiring lives in small modules (`test.js`, `story.js`) or in `app.js`, which imports everything. Markup is added to `index.html`, styles to `styles.css`, in the existing "Non va çekiç" system.

**Tech Stack:** Static HTML/CSS/vanilla JS ES modules, no build step; `node --test`; Canvas 2D + Web Share API; GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-10-23-sayt-yangi-bolimlar-design.md` (all copy, question table, grades and rules are taken from it verbatim).

## Global Constraints

- Every visible string, JS-set label, `aria-label`, `alt`, `placeholder` is in the new alphabet (ö ğ ş ç, tutuq ʼ U+02BC). Before each commit run the copy check (Task 8 Step 1 script) over `web/index.html` and every new `web/*.js`; only intentional examples may change.
- Nothing is sent anywhere: no network calls in new code besides the existing analytics `window.track`.
- DESIGN.md rules: 3px corners, no shadows, clay only on flour/dough, no Doto line ending in "." and no "." or ":" inside Doto text (Doto draws "." as "+"), no ğ in Doto, dots as the only decoration.
- Phone first: check every UI change at 375px (no horizontal scroll) and at 1280px.
- Analytics names exactly as spec §9.
- Tests run with a plain command (the TDD hook only sees plain `node --test`): `node --test web/<file>.test.mjs`.
- Bump `?v=` on `styles.css`, `fonts/fonts.css` and `app.js` in `index.html` in the last task.
- The site UI has exactly one language today (Uzbek, new Latin; no i18n module — checked in `web/app.js`, `web/index.html`). Cyrillic mode is the first second script.

## Review Focus

- A visitor opens the site already in Cyrillic mode (stored choice) and then uses the converter, quiz and word check: every dynamic label must appear in Cyrillic, the converter output and quiz options must stay Latin. → Task 7 browser check list.
- Second tablist on the page: the existing tab code selects `[role="tab"]` globally and would hide the download panels when an iPhone/Android tab is clicked. → Task 2 scopes tabs per tablist; browser check clicks both lists.
- Instagram's in-app browser: `navigator.share` with files may be missing; the result must still show a long-press-savable image. → Task 5 fallback.
- Phone header at 375px with logo + script button + founder chip must not overflow. → Task 7 Step 7.
- Word check with mixed input (Cyrillic + lookalike + several words) must not throw and must list each rule once. → Task 3 tests.

---

### Task 1: Countdown (sanoq)

**Files:**
- Create: `web/sanoq.js`, `web/sanoq.test.mjs`
- Modify: `web/index.html` (inside `#qoidalar`, between `h2` and the table), `web/styles.css`, `web/app.js`

**Interfaces:**
- Produces: `export const SIGNED = "2026-10-21", IN_FORCE = "2027-04-22"`; `daysLeft(today: Date): number` (calendar days from local `today` to 22.04.2027, ≥ 0); `dayDots(today: Date): { total: number, passed: number }` (total = 183, passed clamped to [0, total]).

- [ ] **Step 1: Write failing tests** `web/sanoq.test.mjs`:
  - `daysLeft(new Date(2026, 9, 23)) === 181`; `daysLeft(new Date(2027, 3, 22)) === 0`; `daysLeft(new Date(2027, 5, 1)) === 0`.
  - `dayDots(new Date(2026, 9, 21))` → `{ total: 183, passed: 0 }`; `dayDots(new Date(2026, 9, 23)).passed === 2`; `dayDots(new Date(2028, 0, 1)).passed === 183`.
- [ ] **Step 2:** `node --test web/sanoq.test.mjs` → FAIL (module missing).
- [ ] **Step 3: Implement** `web/sanoq.js`. Count by local calendar date (`Date.UTC(y, m, d)` of each side, divide by 864e5, round), so DST cannot shift a day.
- [ ] **Step 4:** `node --test web/sanoq.test.mjs` → PASS.
- [ ] **Step 5: Markup + style + wiring.** In `#qoidalar` after the `h2`: a `div.count` with `hidden` containing `span.count-n#kun`, `span.count-u` "kun", `p.count-t` (spec §5.1 text), `div.days#days[aria-hidden=true]`, `div.days-cap`. `.count` spans the full grid row (`grid-column: 1 / -1`). Styles as the approved mockup (`.count-n` Doto 900 64px; dots 7px, gap 4px 3px; past = char fill, today = flour fill + char ring, rest = 1.5px ring at 60% char). In `app.js`: fill number and dots from `daysLeft`/`dayDots`, swap text per spec §5.1 for day 0 and after, remove `hidden`.
- [ ] **Step 6:** Open `features-web` preview at 375px and 1280px: dots wrap, no horizontal scroll.
- [ ] **Step 7: Commit** `feat(web): qonun kuçga kirişiga sanoq`.

### Task 2: Phone guide (Telefonda yoziş)

**Files:**
- Modify: `web/index.html` (new `section.phone#telefonda` + `.sec-rule` after `</section>` of `.hero`; FAQ item "Telefonda qanday yozaman?"), `web/styles.css`, `web/app.js` (tab code)

**Interfaces:**
- Produces: markup classes `.guide`, `.keyrow`, `.key`, `.pop`, `.pop .pick`, `.pop-cap`, `.look` (Android table); tabs with ids `tab-ios`/`panel-ios`, `tab-and`/`panel-and`.

- [ ] **Step 1: Scope tabs per tablist in `app.js`.** Replace the global `tabs` array with a loop over `[role="tablist"]`, each with its own `selectTab(list, tab, focus)`; keyboard handling unchanged. Download list keeps its device pre-selection; phone list pre-selects `tab-and` when UA matches `/Android/i`, else `tab-ios`. Track `telefon_tab {os: "iphone"|"android"}` on click.
- [ ] **Step 2: Markup** per spec §4: `h2.sec-title` "Telefonda yoziş", then `div.dl.phone-slab` holding the tablist (`aria-label="Telefoningiz"`), iPhone panel (lede, four `.keyrow` with the exact letters of spec §4, meta paragraph), Android panel (lede, `.look` table "Töğri" / "Öxşaş, lekin boşqa" with the spec's rows, fallback sentence linking `#konverter`), and the shared Turkish warning after the panels. The Android panel has `hidden` in HTML (no-JS shows iPhone). Popup letters are plain text in `span`s; the picked one has `class="pick"` and `aria-label` naming it the correct letter.
- [ ] **Step 3: Styles** from the approved mockup (`.key` 44×52 flour, `.pop span` 40×44 slab-well, `.pick` crust fill + 2px flour outline offset 2px, `.keyrow` light dot row at bottom). Section uses the `.rules/.faq` container rules (max width, gutter, 72px bottom; 48px on phone).
- [ ] **Step 4: FAQ answer** becomes: «Telefon klaviaturasida harfni bosib turing. Batafsil, rasmlari bilan: <a href="#telefonda">Telefonda yoziş</a>. Turk klaviaturasini qöşmang: unda i ning boş harfi İ (nuqtali) bölib qoladi, özbekçada esa I kerak.»
- [ ] **Step 5: Browser check:** at 375px click iPhone/Android tabs and the macOS/Windows tabs: each list only toggles its own panels; arrow keys work in both; Onest renders ğ with a breve and ş with a cedilla distinct from ș (zoomed screenshot of the popups).
- [ ] **Step 6: Commit** `feat(web): telefonda yoziş yöriqnomasi`.

### Task 3: Word check (söz tekşiruv)

**Files:**
- Create: `web/soz.js`, `web/soz.test.mjs`
- Modify: `web/index.html` (`.check` block in `#qoidalar` after the countdown; `data-rule` on table rows; `data-lotin` on `tbody`), `web/styles.css`, `web/app.js`

**Interfaces:**
- Consumes: `convert` from `web/converter.js`.
- Produces: `explain(text: string): { result: string, rules: string[], cyrillic: boolean, ok: boolean, ng: boolean, lookalikes: { bad: string, good: string, note: string }[] }` where `rules` ⊆ `["o","g","sh","ch","sh2","tutuq"]` in that order, each at most once; `result` = `convert(fixed)` where `fixed` is the input with lookalikes replaced; `ok` = no rule fired, no lookalike, and `result === text`. `RULE_TEXT: Record<rule, string>` with the spec §5.2 explanations; `LOOKALIKE_NOTE` per good letter.

- [ ] **Step 1: Write failing tests** `web/soz.test.mjs`:
  - `explain("Is'hoq")` → `result "Isʼhoq"`, `rules ["sh2"]`.
  - `explain("Işoq").rules` → `["sh2"]` (exception words count as sh2).
  - `explain("o'zbek choy shahar tog' ma'no")` → rules `["o","g","sh","ch","tutuq"]`, result `"özbek çoy şahar toğ maʼno"`.
  - `explain("Ўзбекистон")` → `cyrillic true`, rules `["o"]`, result `"Özbekiston"`; `explain("Исҳоқ").rules` → `["sh2"]`; `explain("маъно").rules` → `["tutuq"]`; `explain("шаҳар чой").rules` → `["sh","ch"]`.
  - `explain("işlaş")` (with U+0219) → lookalikes `[{ bad: "ș", good: "ş", note: "ostida ilmoq" }]`, result `"işlaş"`.
  - `explain("toġ")` → good `"ğ"`; `explain("İstanbul")` → good `"I"`; `explain("ıssiq")` → good `"i"`.
  - `explain("özbek").ok === true`; `explain("tong").ng === true`; `explain("")` → `{ result: "", rules: [], ok: false }`.
  - Repeated input `explain("o'g'il o'n")` lists `"o"` once.
- [ ] **Step 2:** `node --test web/soz.test.mjs` → FAIL.
- [ ] **Step 3: Implement** `web/soz.js`. Detect rules on the input (after lookalike replacement) with regexes over the converter's APOS set: `o` `/[oO][APOS]|[ўЎ]/`, `g` `/[gG][APOS]|[ғҒ]/`, `sh2` `/[sS][APOS][hH]|сҳ|СҲ|(?<!\p{L})(işoq|ishoq|aşob|ashob|muşaf|mushaf)/iu`, `sh` `/[sS][hH]|[шщШЩ]/` tested after removing sh2 matches, `ch` `/[cC][hH]|[чЧ]/`, `tutuq` letter+APOS+letter not preceded by o/g/s-before-h, or `ъ` not after `ў`. Lookalike map from spec §5.2; `İ`→`I`, `ı`→`i`.
- [ ] **Step 4:** `node --test web/soz.test.mjs` → PASS; `node --test web/converter.test.mjs` → PASS (untouched).
- [ ] **Step 5: UI.** `div.check[hidden]` with `label` «Bu söz qanday yoziladi?», `input#soz` (placeholder «Masalan: Is'hoq», `autocomplete=off`, `spellcheck=false`, `autocapitalize=off`), `div.check-out[data-lotin][hidden]` with `div.check-word` (changed letters in `mark`, same rendering rule as the converter's `render`), copy button `data-copy="soz-word"` (existing copy handler), `ul.check-why`, `div.check-bad` per lookalike. 150 ms debounce. Add `data-rule` to table rows: o', g', sh, ch, s'h, ma'no → `o g sh ch sh2 tutuq`; toggle `tr.lit` for `explain().rules`. Extra lines: «Kirill harflari lotinga ögirildi» first when `cyrillic`; «Bu söz yangi alifboda töğri yozilgan.» when `ok`; «ng özgarmaydi» when `ng`. Track `soz_tekshirildi` once per page load. Styles from the mockup (`.check`, `.check-field`, `.check-out`, `.check-word` 700 32px, `tr.lit` char background, flour text, slab-ink third cell; `overflow-wrap: anywhere` on `.check-word`).
- [ ] **Step 6: Browser check** at 375px: type `Is'hoq` → s'h row lit; paste a 300-character text → no overflow; clear → nothing lit.
- [ ] **Step 7: Commit** `feat(web): "bu söz qanday yoziladi?" tekşiruvi`.

### Task 4: Quiz data and logic

**Files:**
- Create: `web/test-savollar.js`, `web/test.test.mjs`

**Interfaces:**
- Produces: `QUESTIONS: { q: string, options: [string, string, string], why: string }[]` (10 items, `options[0]` correct, text verbatim from spec §6 table without the « » around option words); `grade(score: number): string` (spec §6 grades); `shuffle<T>(items: T[], rand = Math.random): T[]` (new array, Fisher–Yates).

- [ ] **Step 1: Failing tests:** `QUESTIONS.length === 10`; every item has 3 distinct options; `QUESTIONS[4].options[0] === "Isʼhoq"`; `QUESTIONS[9].options[0] === "22.04.2027"`; `grade(10)` starts `"Aʼlo!"`, `grade(7)` and `grade(9)` start `"Zör!"`, `grade(4)` starts `"Yomon emas."`, `grade(0)` starts `"Boşlaniş"`; `shuffle([1,2,3], () => 0)` is a permutation of `[1,2,3]` and does not mutate its input; every `q` and `why` passes `convert(x) === x` except substrings in « » (old spellings in questions are intentional — strip `«…»` before checking).
- [ ] **Step 2:** `node --test web/test.test.mjs` → FAIL.
- [ ] **Step 3: Implement** `web/test-savollar.js` with the spec table.
- [ ] **Step 4:** `node --test web/test.test.mjs` → PASS.
- [ ] **Step 5: Commit** `feat(web): test savollari va baholar`.

### Task 5: Quiz UI and story image

**Files:**
- Create: `web/test.js`, `web/story.js`
- Modify: `web/index.html` (`section.quiz-sec#test` + `.sec-rule` after `#qoidalar`; nav link «Test» between Qoidalar and Savollar), `web/styles.css`, `web/app.js` (import + `mountTest`)

**Interfaces:**
- Consumes: Task 4 exports.
- Produces: `story.js`: `drawStory(canvas: HTMLCanvasElement, score: number): Promise<void>` (loads fonts, then draws 1080×1920 per spec §7); `storyBlob(score): Promise<Blob>`. `test.js`: `mountTest(section: HTMLElement): void`.

- [ ] **Step 1: Markup:** `section#test` with `div.quiz` (flour) holding `.quiz-top` (`h2.quiz-title` «Test», `div.prog[role=img]` with 10 `i`), `p.q-n`, `p.q`, `div.opts[data-lotin]`, `p.why[hidden]`, `button.btn.btn-ink#next[hidden]` «Keyingi savol», and a `div.result[hidden]` (score, grade text + «Döstlaringiz ham sinab körsin.», buttons «Storyga qöyiş» `#story` and «Qaytadan boşlaş» `#restart`, `figure.story-prev[hidden]` with `img` alt «Test natijasi rasmi» and caption «Rasmni bosib turib saqlaşingiz mumkin», `p.story-err[hidden]` «Rasm yasab bölmadi. Qaytadan urinib köring.»). The section has `hidden` in HTML; `mountTest` removes it. A live region `p.sr-only[aria-live=polite]` announces «Töğri» / «Xato. Töğri javob: X».
- [ ] **Step 2: `test.js` behaviour** per spec §6: shuffled options per question; on answer disable options, mark `.right` with tag «Töğri», `.wrong` on a wrong pick, progress dot `ok`/`no`, show `why`, show and focus `#next` (on the 10th answer its label is «Natijani körsatiş»). Result view: score, `grade(score)`; `#restart` resets state and focuses the first option. Track `test_boshlandi` (first answer), `test_tugadi {ball}`, `test_qayta`.
- [ ] **Step 3: `story.js`** draws the approved A · Non layout (mockup `storyA`, final values in spec §7; domain in Onest 800, never Doto). Fonts: `await Promise.all([document.fonts.load("900 100px Doto", "yozgiç0123456789/"), document.fonts.load("500 40px Onest"), document.fonts.load("700 40px Onest"), document.fonts.load("800 40px Onest")])`, errors ignored.
- [ ] **Step 4: Share flow** for `#story`: `storyBlob` → `File([blob], "yozgich-test.png", { type: "image/png" })`; if `navigator.canShare?.({ files: [file] })` → `navigator.share({ files: [file] })` (AbortError ignored) and track `story_ulashildi {usul: "share"}`; else download through a temporary `a[download]` with an object URL, track `{usul: "yuklab"}`. In both cases set the preview `img.src` to the object URL and show the figure. Null blob → show `.story-err`.
- [ ] **Step 5: Styles** from the mockup (`.quiz`, `.prog`, `.opt` 54px, `.opt.right` dough, `.opt.wrong` clay line-through, `.why` 6% char tint, `.score-n` Doto 88px; `.story-prev img` 200px wide, 2px char border). Desktop: the quiz panel max-width 640px.
- [ ] **Step 6: Browser check:** play all 10 at 375px with keyboard only; restart; press «Storyga qöyiş» → preview shows; save the PNG via `javascript_tool` reading `canvas.toDataURL` size = 1080×1920 and look at one full-size screenshot of the canvas scaled into a 540×960 viewport: logo, «Yangi alifbo testi», the score in the non, «yozgich.uz» all legible; no "+" in the domain.
- [ ] **Step 7: Commit** `feat(web): 10 savollik test va story rasm`.

### Task 6: Onest with Cyrillic, 400–800

**Files:**
- Modify: `web/fonts/fonts.css`; replace `web/fonts/onest-400-latin.woff2`, `web/fonts/onest-400-latin-ext.woff2` with `onest-latin.woff2`, `onest-latin-ext.woff2`; add `onest-cyrillic.woff2`, `onest-cyrillic-ext.woff2`.

- [ ] **Step 1:** Fetch `https://fonts.googleapis.com/css2?family=Onest:wght@400..800&display=swap` with a desktop Chrome UA, download the four subset files (`latin`, `latin-ext`, `cyrillic`, `cyrillic-ext`), keep each `unicode-range` verbatim, `font-weight: 400 800`. Keep the OFL comment.
- [ ] **Step 2: Glyph sheet check** in the preview: a scratch page (not committed) rendering `ö ğ ş ç Ö Ğ Ş Ç ʼ ў ғ қ ҳ Ў Ғ Қ Ҳ ъ ё` at 17px/400, 32px/700, 31px/800; confirm `[...document.fonts].filter(f => f.family === "Onest").every(f => f.status !== "error")` and read the zoomed screenshot (breve on ğ, descender on қ ҳ).
- [ ] **Step 3: Commit** `chore(web): Onest kirill bilan, 400–800`.

### Task 7: Cyrillic reading mode

**Files:**
- Create: `web/kirill.js`, `web/kirill.test.mjs`
- Modify: `web/index.html` (script button in `.bar`; `lang="en"`/`lang="ru"` on English/Russian UI strings: `Open System Settings`, `Accessibility`, `Keep`, `Windows protected your PC`, `More info`, `Run anyway`, `Подробнее`, `Выполнить в любом случае`, `Конфиденциальность и безопасность → Универсальный доступ`, `damaged`, `System Settings → Privacy & Security → Accessibility`; `data-lotin` on hero lede `<b>` examples and `.non-pair`), `web/styles.css`, `web/app.js`

**Interfaces:**
- Consumes: `convert` (tests only).
- Produces: `toCyrillic(text: string): string`; `KEEP: Set<string>`; `applyScript(root: Element, script: "kirill" | "lotin"): void` (idempotent, reversible, also `aria-label`, `placeholder`, `document.title`); `watchScript(root): void` (MutationObserver that applies the current script to added/changed text); `EXCLUDE = 'code, kbd, pre, textarea, input, script, style, [lang="en"], [lang="ru"], [data-lotin], .out'`.

- [ ] **Step 1: Failing tests** `web/kirill.test.mjs`:
  - Pairs: `"Odatdagidek yozing, yangi harf özi çiqadi"` → `"Одатдагидек ёзинг, янги ҳарф ўзи чиқади"`; `"Isʼhoq"` → `"Исҳоқ"`; `"maʼno"` → `"маъно"`; `"eʼlon"` → `"эълон"`; `"Yetadi"` → `"Етади"`; `"poeziya"` → `"поэзия"`; `"tayyor"` → `"тайёр"`; `"Qoidalar"` → `"Қоидалар"`; `"ŞAHAR"` → `"ШАҲАР"`; `"Toğ"` → `"Тоғ"`.
  - Kept: `"Mac va Windows uçun"` → `"Mac ва Windows учун"`; `"macOSʼda"` → `"macOSʼда"`; `"yozgich.uz"`, `"@behruz_si"`, `"https://t.me/x"` unchanged; `"AI vositalari"` → `"AI воситалари"`; `"Yozgiç"` unchanged.
  - Round trip: every word from `web/index.html` body text (tags, `<script>`, `<style>` stripped) with `convert(w) === w` and `toCyrillic(w) !== w` satisfies `convert(toCyrillic(w)) === w`, except an explicit `LOSSY` list in the test with a comment per entry.
- [ ] **Step 2:** `node --test web/kirill.test.mjs` → FAIL.
- [ ] **Step 3: Implement `toCyrillic`.** Split on the converter's protected pattern (URLs, emails, @handles, domains) and on word boundaries; a word is kept if it is in `KEEP`, contains `c` (not ç) or `w`, has an uppercase letter after its first character while not being all caps, or is all-caps Latin of 2–4 letters; a kept word followed by `ʼ` + suffix keeps the word and transliterates the suffix. Letter map and contextual rules (yo/yu/ya, ye/e, sʼh, ʼ→ъ, case) exactly as spec §8. `KEEP` = Yozgiç, Mac, macOS, iOS, iPhone, Android, Gboard, Samsung, Windows, Terminal, Telegram, Instagram, GitHub, Apple, Silicon, Intel, Notepad, ChatGPT, Claude, AI, Space, Shift, Control, Enter, Ctrl, Alt, fn, beta. Personal names are transliterated (Behruz Baxodirov → Беҳруз Баходиров).
- [ ] **Step 4:** `node --test web/kirill.test.mjs` → PASS (iterate on `KEEP`/`LOSSY` only with a reason per entry).
- [ ] **Step 5: `applyScript` / `watchScript`** in the same module: walk text nodes with a `TreeWalker`, skip any node whose parent `closest(EXCLUDE)` matches; store originals in a `WeakMap<Text, string>`; when switching to `lotin` restore from the map; attributes stored in a `WeakMap<Element, Record<string,string>>`. The observer runs only in `kirill` mode and skips nodes whose text has nothing to change.
- [ ] **Step 6: Toggle + CSS.** `button.script-btn#yozuv[hidden][aria-pressed=false]` in `.bar` before `.nav-founder`, label «Кирилл» with `lang="uz-Cyrl"`, `aria-label` «Sahifani kirill yozuvida körsatiş»; in kirill mode label «Lotin» (`lang="uz"`), `aria-pressed=true`. `app.js`: read `localStorage["yozgich-yozuv"]` in try/catch, apply before the first paint of dynamic labels (call after `render(false)`), set `<html lang>` and `data-yozuv`, track `yozuv_almashtirildi {yozuv}`. CSS: `html[data-yozuv="kirill"] :is(.hero-head, .sec-title, .try-title, .founder-name, .close-big, .quiz-title, .count-n, .count-u) { font-family: Onest, system-ui, sans-serif; font-weight: 800; letter-spacing: -.015em; }`.
- [ ] **Step 7: Header at 375px:** logo + button + founder chip fit; if not, extend the existing `.nf-name` hide rule from `max-width: 370px` to `max-width: 420px`. Check `scrollWidth === innerWidth`.
- [ ] **Step 8: Browser check in kirill mode:** run in the page `[...walk text nodes outside EXCLUDE].filter(t => /[A-Za-zÖĞŞÇöğşç]/.test(t.data))` and review every remaining Latin word (allowed: KEEP words, URLs, examples). Then: convert a sample, copy, answer a quiz question, finish the quiz, use the word check, open a FAQ item: labels Cyrillic, converter output / options / word-check result Latin. Reload: mode persists. Switch back: page identical to before (compare `document.body.innerText` before/after a round trip).
- [ ] **Step 9: Commit** `feat(web): kirillda öqiş rejimi`.

### Task 8: Wire-up, docs, release checks

**Files:**
- Modify: `web/app.js` (IntersectionObserver ids add `telefonda`, `test`), `web/index.html` (`?v=` bumps: `fonts.css?v=10`, `styles.css?v=11`, `app.js?v=12`), `.github/workflows/pages.yml` (test step `node --test web/*.test.mjs`), `DESIGN.md` (components: Phone guide, Countdown, Word check, Quiz, Story image, Script button; Typography: "The Cyrillic Falls Back To Onest Rule"; Onest weights 400–800, four subsets)

- [ ] **Step 1: Copy check:** run the scratchpad `copycheck.mjs` (converter over visible words) on `web/index.html`, and on string literals of every new `web/*.js`; list each changed word as fixed or intentional.
- [ ] **Step 2:** `node --test web/*.test.mjs` → all PASS.
- [ ] **Step 3:** `impeccable detect --json web/index.html web/styles.css`; triage incumbent vs new findings (ui-audit-extras), fix new contrast/touch findings.
- [ ] **Step 4: Final browser pass** at 375px and 1280px, Latin and Cyrillic: whole page screenshot set, console has no errors, `scrollWidth === innerWidth`.
- [ ] **Step 5: Commit** `chore(web): versiyalar, testlar CI'da, DESIGN.md`.
- [ ] **Step 6: Sync with main** (`sync_with_base_branch`), resolve conflicts keeping the SEO session's `<head>`, FAQ entries and lede; re-run Steps 1–2 and a 375px check; merge to `main` and push; watch the Pages run and open https://yozgich.uz to confirm the new sections.

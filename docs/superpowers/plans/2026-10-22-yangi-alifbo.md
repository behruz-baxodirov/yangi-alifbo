# Yangi alifbo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** macOS input source + web converter/landing (+ Windows beta) that let people type the new Uzbek Latin alphabet with old habits (`o'`→`ö`, `sh`→`ş` …).

**Architecture:** One pure keystroke state machine (`AlifboCore.Composer`, Swift) drives a thin InputMethodKit controller; a JS text converter mirrors the same rules for the web. Both are pinned by one shared fixture file `core/fixtures/cases.json`.

**Tech Stack:** Swift 6 / SwiftPM / InputMethodKit / Carbon TIS; vanilla HTML+CSS+JS, `node --test`; bash installers; AutoHotkey v2 (Windows beta).

**Spec:** `docs/superpowers/specs/2026-10-22-yangi-alifbo-klaviatura-design.md`

## Global Constraints

- Mapping: `oʻ→ö gʻ→ğ sh→ş ch→ç`, capitals `Ö Ğ Ş Ç`; first letter decides case (`Sh`,`SH`→`Ş`; `sH`→`ş`).
- Apostrophe set APOS = `' \` ‘ ’ ʻ ʼ ´` (U+0027 U+0060 U+2018 U+2019 U+02BB U+02BC U+00B4).
- Tutuq output is `ʼ` U+02BC; only after a letter; option `tutuq` (default on).
- `s'h` → `sʼh`; `ng` untouched.
- Bundle id `uz.yangialifbo.inputmethod.YangiAlifbo`; display name `Yangi alifbo`; install dir `~/Library/Input Methods/YangiAlifbo.app`; macOS 12+, universal arm64+x86_64.
- Release asset URL: `https://github.com/behruz-baxodirov/yangi-alifbo/releases/latest/download/YangiAlifbo.zip`.
- Site copy is written in the NEW alphabet.
- Nothing is pushed/published without the owner's explicit yes.

## Review Focus

1. Pending letter + focus change / mouse click / ⌘-shortcut (Telegram ⌘Enter): pending must be committed first, never lost → `.other` and `flush()` tests (Task 1).
2. ALL CAPS: `O'ZBEKISTON SHAHRI` → `ÖZBEKISTON ŞAHRI` → fixtures (Task 1).
3. Apostrophe at word start / after space or digit stays ASCII (`'salom'` opening quote, `5'`) → fixtures.
4. Adjacent digraphs: `ishchi`→`işçi`, `mashhur`→`maşhur`, `o'g'il`→`öğil` → fixtures.
5. Backspace while a letter is pending deletes only that letter; tutuq after cursor moved by arrows uses the client's previous char → Composer tests with `before:` closure.

---

### Task 1: Shared fixtures + `AlifboCore.Composer` (TDD)

**Files:**
- Create: `core/fixtures/cases.json` — `[{"in": "...", "out": "...", "note": "..."}]`, 60+ cases covering every rule and each Review Focus line; all apply to both keystroke engine and bulk converter.
- Create: `mac/Package.swift` (tools 5.9, macOS 12; targets `AlifboCore`, executable `YangiAlifbo`, test `AlifboCoreTests`).
- Create: `mac/Sources/AlifboCore/Composer.swift`, `mac/Sources/AlifboCore/Typing.swift`
- Test: `mac/Tests/AlifboCoreTests/ComposerTests.swift`, `FixtureTests.swift` (reads `../../../core/fixtures/cases.json` via `#filePath`).

**Interfaces (Produces):**
```swift
public struct ComposerOptions { public var tutuq: Bool = true; public init(tutuq: Bool = true) }
public enum KeyInput: Equatable { case char(Character), backspace, other }
public struct ComposerOutput: Equatable { public var commit: String; public var consumed: Bool }
public struct Composer {
  public init(options: ComposerOptions = .init())
  public var options: ComposerOptions
  public private(set) var marked: String          // "" or the pending letter
  public mutating func handle(_ input: KeyInput, before: () -> Character? = { nil }) -> ComposerOutput
  public mutating func flush() -> String          // commit pending, context becomes unknown
}
public enum Typing { public static func simulate(_ text: String, options: ComposerOptions = .init()) -> String }
```
Semantics: `consumed == false` means the host lets the app handle the key after inserting `commit`. `before` is consulted only when an apostrophe arrives and the previous-char context is unknown (after `.other`, backspace without pending, `flush`).

- [ ] Step 1: write fixtures + failing tests: `testFixtures` (every case through `Typing.simulate`), `testBackspaceDropsPending` (`o`, backspace → marked "", consumed), `testOtherFlushesPending` (`s`, `.other` → commit "s", consumed false), `testTutuqOff` (`ma'no` → `ma'no`), `testApostropheUsesClientContextWhenUnknown` (`.other`, then `'` with before `{ "a" }` → commit `ʼ`; with `{ " " }` → pass-through).
- [ ] Step 2: `cd mac && swift test` → FAIL (no Composer).
- [ ] Step 3: implement Composer per spec §4 state machine.
- [ ] Step 4: `swift test` → all pass.
- [ ] Step 5: commit.

### Task 2: Input method app + build

**Files:**
- Create: `mac/Sources/YangiAlifbo/main.swift` (args `--install`, `--uninstall`, `--version`; else `IMKServer(name: "YangiAlifbo_Connection", bundleIdentifier:)` + `NSApplication.shared.run()`).
- Create: `mac/Sources/YangiAlifbo/InputController.swift` — `@objc(YangiAlifboInputController) final class InputController: IMKInputController`; overrides `handle(_:client:)`, `commitComposition(_:)`, `deactivateServer(_:)`, `menu()`; maps NSEvent: ⌘/⌃/⌥ → `.other`, keyCode 51 → `.backspace`, one printable char → `.char`, else `.other`. Marked text via `setMarkedText(_:selectionRange:replacementRange:)`; `before` reads `attributedSubstring(from:)` one char left of `selectedRange()`.
- Create: `mac/Sources/YangiAlifbo/Registration.swift` — TISRegisterInputSource / TISEnableInputSource / TISSelectInputSource / TISDisableInputSource by bundle id.
- Create: `mac/Resources/Info.plist` (keys: CFBundleIdentifier, InputMethodConnectionName, InputMethodServerControllerClass=`YangiAlifboInputController`, LSBackgroundOnly, LSUIElement, tsInputMethodCharacterRepertoireKey=[Latn], tsInputMethodIconFileKey=icon.tiff, TISIconIsTemplate, TISIntendedLanguage=uz, TICapsLockLanguageSwitchCapable, CFBundleName/DisplayName `Yangi alifbo`, LSMinimumSystemVersion 12.0).
- Create: `mac/scripts/make-icon.swift` (draws "Ö" 16pt/@2x → `mac/Resources/icon.tiff`), `mac/scripts/build.sh` → `dist/YangiAlifbo.app`, `dist/YangiAlifbo.zip`.

- [ ] Step 1: write files; `bash mac/scripts/build.sh`.
- [ ] Step 2: verify: `lipo -archs` shows `x86_64 arm64`; `plutil -lint`; `codesign -v`; `dist/YangiAlifbo.app/Contents/MacOS/YangiAlifbo --version` prints version.
- [ ] Step 3: commit.

### Task 3: install.sh / uninstall.sh

**Files:** Create `web/install.sh`, `web/uninstall.sh`.
- install: env `YA_ZIP_URL` overrides release URL; `YA_SKIP_REGISTER=1` skips `--install` (for tests); downloads with `curl -fsSL`, `ditto -x -k`, `pkill -x YangiAlifbo || true`, replaces bundle, runs `--install`, prints Uzbek next steps (🌐 / ⌃Space).
- uninstall: runs `--uninstall`, kills process, removes bundle.
- [ ] Step 1: test with `HOME=<scratch> YA_SKIP_REGISTER=1 YA_ZIP_URL=file://…/dist/YangiAlifbo.zip bash web/install.sh` → bundle present, no `com.apple.quarantine` xattr; uninstall removes it. `shellcheck` if available.
- [ ] Step 2: commit.

### Task 4: JS converter (TDD)

**Files:** Create `web/converter.js` (ES module), `web/converter.test.mjs`.
**Interfaces:** `export function convert(text: string, opts?: {tutuq?: boolean}): string` (auto-detects Cyrillic per char); `export function detectScript(text): 'cyrillic'|'latin'|'mixed'`.
- Tests: all fixtures; Cyrillic: `Ўзбекистон`→`Özbekiston`, `шаҳар`→`şahar`, `Исҳоқ`→`Isʼhoq`, `мўъжиза`→`möjiza`, `ёз`→`yoz`, `ер`→`yer`, `съезд`-like `ъе`→`ye`, `цирк`→`sirk`, `лицей`→`litsey`, `ЧИРОҚ`→`ÇIROQ`, `ЯНГИ`→`YANGI`; preserved: `https://shop.uz/ch`, `info@shosh.uz`, `@shoh_channel`; dictionary: `Ishoq`→`Isʼhoq`, `ashob`→`asʼhob`, `mushaf`→`musʼhaf`; idempotence `convert(convert(x)) === convert(x)` over fixtures.
- [ ] RED → implement → GREEN (`node --test web/`) → commit.

### Task 5: Landing page + converter UI (impeccable)

**Files:** Create `web/index.html`, `web/styles.css`, `web/app.js`, `web/assets/*`.
- Sections per spec §5; live demo textarea converts on input keeping caret (`convert(prefix).length`); converter with copy button; Mac install command with copy; shortcut table; rules table; phone tips; Windows beta block; footer with project credit and GitHub link.
- Design through impeccable (+ ui-audit-extras); check 375 px and desktop, light/dark, no horizontal scroll, keyboard focus visible.
- [ ] Build → browser check (built-in browser, local static server) → commit.

### Task 6: Windows beta

**Files:** Create `windows/YangiAlifbo.ahk` (AutoHotkey v2: InputHook-free hotkey state machine mirroring Composer; tray menu; `Ctrl+Alt+Space` toggle; tray icon state), `windows/README.md`, `.github/workflows/windows.yml` (windows-latest: install AutoHotkey v2 + Ahk2Exe, compile exe, smoke-type into Notepad and assert text, upload artifact).
- Untestable on this Mac; CI runs only after the owner allows pushing. Label beta everywhere.
- [ ] Write → commit.

### Task 7: README, release prep, end-to-end check

- Create `README.md` (Uzbek, new alphabet; install/uninstall; rules; build from source).
- E2E (with owner's yes): run install.sh from local zip, switch input source, type fixture sentences in TextEdit, verify output; uninstall works.
- Publish (with owner's yes): `gh repo create`, push, release with zip, enable Pages for `web/`.

### Task 8: Always-on menu-bar app (spec §10)

**Interfaces (Produces):**
```swift
public enum RewriteAction: Equatable { case pass; case replace(deleteBefore: Int, insert: String) }
public struct Rewriter {
  public init(options: ComposerOptions = .init())
  public var options: ComposerOptions
  public mutating func handle(_ input: KeyInput) -> RewriteAction   // .replace swallows the key
  public mutating func reset()
}
public enum RewriteTyping { public static func simulate(_ text: String, options: ComposerOptions = .init()) -> String }
```
- [ ] RED: `RewriterTests` (fixtures through `RewriteTyping.simulate`; disabled passes; backspace/other reset context; tutuq replace deletes the apostrophe).
- [ ] GREEN: implement `Rewriter`.
- [ ] App: `YangiAlifbo` executable becomes an LSUIElement app: NSStatusItem ("ö"/"A"), AXIsProcessTrustedWithOptions prompt, CGEventTap (keyDown, flagsChanged, mouse down), synthetic events tagged via eventSourceUserData and ignored, tap re-enabled on timeout.
- [ ] install.sh: uninstall old IME if present, install to ~/Applications, LaunchAgent `uz.yangialifbo.YangiAlifbo.plist`, start app; uninstall.sh reverses. install-stop test still passes.
- [ ] Owner grants Accessibility and tests in Telegram + Chrome; then release v2.0.0.

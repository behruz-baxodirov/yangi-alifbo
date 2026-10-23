# macOS yangi versiya xabari — reja

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ilova kuniga ko'pi bilan bir marta GitHub'dagi oxirgi versiyani tekshiradi va yangisi bo'lsa `ö↑`, bir martalik xabar va menyu punkti orqali ko'rinadigan Terminal yangilashini taklif qiladi.

**Architecture:** Sof mantiq (`AppVersion`, `UpdateCheck`) `AlifboCore` da, XCTest bilan. Tarmoq, taymer, `.command` fayl va oyna `YangiAlifbo/Updater.swift` da; `AppDelegate` faqat chaqiradi va chizadi.

**Tech Stack:** Swift 5.9, Cocoa, `URLSession` (ephemeral), XCTest; sayt: statik HTML, `node --test`.

**Spec:** `docs/superpowers/specs/2026-10-23-mac-yangilanish-tekshiruvi-design.md`

## Global Constraints

- Ilova UI faqat o'zbekcha (mavjud `AppDelegate.swift` matnlari, `Info.plist` `CFBundleDevelopmentRegion uz`); hamma yangi matn yangi alifboda va `web/converter.js` `convert()` dan o'zgarishsiz qaytadi.
- Aniq matnlar (spec 4-bo'lim): `Yangilanişni özi tekşirsin`, `Yangi versiya bor (X) — yangilaş…`, `Yangi versiya bor: X`, `ö ustida öng tugma → yangilaş`, `Yangi versiya X`, `Yangilaş`, `Nimalar yangi?`, `Keyinroq`, `Terminal oçilmadi. Buyruqni özingiz Terminalʼga yozing:`.
- So'rov: `HEAD https://github.com/behruz-baxodirov/yangi-alifbo/releases/latest`, yo'naltirishga ergashmaslik, `URLSessionConfiguration.ephemeral`, `User-Agent: YangiAlifbo/<versiya>`.
- Kuniga ko'pi bilan bitta javob olgan so'rov (24 soat); javobsiz urinish 1 soatdan keyin takrorlanadi; birinchi tekshiruv ishga tushgandan 60 s keyin.
- macOS 12+; yangi ruxsat (Automation va h.k.) so'ralmaydi.
- Sayt: FAQ `<details>` va JSON-LD javobi bir xil (`web/test/seo.test.mjs`); CI `node --test web/*.test.mjs web/test/*.test.mjs`.

## Review Focus

1. Teg `v2.0.10` vs joriy `2.0.9` — matn bo'yicha emas, son bo'yicha taqqoslanadi (Task 1 testi).
2. Joriy versiya `dev` (swift run) yoki teg `beta`/`v2.1.0-rc1` — yangilanish deb ko'rsatilmaydi (Task 1 testi).
3. Soat orqaga surilgan (`last` kelajakda) — tekshiruv abadiy to'xtab qolmaydi, darhol due (Task 1 testi).
4. Yangilangandan keyin eski `availableVersion` qolib ketmaydi — ishga tushganda joriydan katta bo'lmasa tozalanadi (Task 2, qo'lda tekshiruv: `defaults read`).
5. O'chirish belgisi olib tashlangan — so'rov umuman yuborilmaydi (Task 2, log `update check skipped`).

---

### Task 1: AlifboCore — versiya va jadval mantiqi

**Files:**
- Create: `mac/Sources/AlifboCore/Update.swift`
- Test: `mac/Tests/AlifboCoreTests/UpdateTests.swift`

**Interfaces:**
- Produces:
  - `public struct AppVersion: Comparable, CustomStringConvertible { public init?(_ text: String) }` — `v` prefiksini olib tashlaydi, faqat `[0-9]+(\.[0-9]+)*` qabul qiladi, yetishmagan qism 0 (`2.0` == `2.0.0`); `description` — `v` siz raqam.
  - `public enum UpdateCheck`:
    - `static let interval: TimeInterval = 24 * 3600`
    - `static func isDue(last: Date?, now: Date) -> Bool` — `last == nil`, `now - last >= interval` yoki `last > now` bo'lsa true.
    - `static func version(fromLocation: String) -> AppVersion?` — `…/releases/tag/<teg>` dagi oxirgi yo'l qismi.
    - `static func newer(latest: String, than current: String) -> AppVersion?` — ikkalasi ham o'qilsa va latest > current bo'lsa latest.

- [ ] **Step 1: Failing testlar**

```swift
func testParsesAndCompares() {
    XCTAssertEqual(AppVersion("v2.0.3")?.description, "2.0.3")
    XCTAssertTrue(AppVersion("2.0.10")! > AppVersion("2.0.9")!)
    XCTAssertEqual(AppVersion("2.0"), AppVersion("2.0.0"))
    XCTAssertNil(AppVersion("dev")); XCTAssertNil(AppVersion("v2.1.0-rc1")); XCTAssertNil(AppVersion(""))
}
func testNewer() {
    XCTAssertEqual(UpdateCheck.newer(latest: "v2.0.3", than: "2.0.2")?.description, "2.0.3")
    XCTAssertNil(UpdateCheck.newer(latest: "v2.0.2", than: "2.0.2"))
    XCTAssertNil(UpdateCheck.newer(latest: "v2.0.1", than: "2.0.2"))
    XCTAssertNil(UpdateCheck.newer(latest: "v9.0.0", than: "dev"))
}
func testVersionFromLocation() {
    XCTAssertEqual(UpdateCheck.version(fromLocation: "https://github.com/behruz-baxodirov/yangi-alifbo/releases/tag/v2.0.2")?.description, "2.0.2")
    XCTAssertNil(UpdateCheck.version(fromLocation: "https://github.com/behruz-baxodirov/yangi-alifbo/releases"))
}
func testIsDue() {
    let now = Date(timeIntervalSince1970: 1_000_000)
    XCTAssertTrue(UpdateCheck.isDue(last: nil, now: now))
    XCTAssertFalse(UpdateCheck.isDue(last: now.addingTimeInterval(-23 * 3600), now: now))
    XCTAssertTrue(UpdateCheck.isDue(last: now.addingTimeInterval(-24 * 3600), now: now))
    XCTAssertTrue(UpdateCheck.isDue(last: now.addingTimeInterval(3600), now: now))
}
```

- [ ] **Step 2:** stub (`nil`/`false` qaytaradi) bilan `cd mac && swift test --filter UpdateTests` — FAIL (assertion, kompilyatsiya emas).
- [ ] **Step 3:** `Update.swift` ni yozish.
- [ ] **Step 4:** `cd mac && swift test` — `Executed N tests, with 0 failures`.
- [ ] **Step 5:** commit `feat(core): versiya taqqoslaş va yangilaniş jadvali`.

### Task 2: Updater va menyu

**Files:**
- Create: `mac/Sources/YangiAlifbo/Updater.swift`
- Modify: `mac/Sources/YangiAlifbo/AppInfo.swift` (Settings: `autoUpdateCheck: Bool` standart true, `lastUpdateCheck: Date?`, `availableVersion: String?`, `announcedVersion: String?`; `AppInfo.releasesLatestURL`, `AppInfo.installCommand = "curl -fsSL https://yozgich.uz/install.sh | bash"`)
- Modify: `mac/Sources/YangiAlifbo/AppDelegate.swift` (belgi `↑`, menyu punktlari, `updater.start()`)

**Interfaces:**
- Consumes: Task 1 `UpdateCheck`, `AppVersion`.
- Produces: `final class Updater { var onChange: (() -> Void)?; var available: String? { get }; func start(); func offerUpdate() }`.

- [ ] **Step 1:** `Updater.start()`: ishga tushganda `available` ni tozalash (`newer(latest: saved, than: AppInfo.version) == nil` bo'lsa), 60 s keyin va har 3600 s da `checkIfDue()`. `checkIfDue()`: `Settings.autoUpdateCheck` false → `log.notice("update check skipped")`; `isDue` bo'lmasa qaytish; HEAD so'rov `URLSessionTaskDelegate.urlSession(_:task:willPerformHTTPRedirection:…)` da `completionHandler(nil)`; har qanday `HTTPURLResponse` → `lastUpdateCheck = now`; `Location` → `newer` → `availableVersion`, `onChange` main thread'da. Transport xatosi → hech narsa yozilmaydi.
- [ ] **Step 2:** yangi versiya `announcedVersion` dan farq qilsa: `hud.show(symbol: "↑", title: "Yangi versiya bor: X", subtitle: "ö ustida öng tugma → yangilaş", seconds: 5)` va `announcedVersion = X` (AppDelegate'da, `onChange` orqali).
- [ ] **Step 3:** `offerUpdate()`: `NSApp.activate(ignoringOtherApps: true)`, `NSAlert` (spec 4-bo'lim matni, uch tugma). `Yangilaş` → `~/Library/Caches/uz.yangialifbo.YangiAlifbo/yangilash.command` (`#!/bin/bash\n<installCommand>\n`, 0755) → `NSWorkspace.shared.open`; false qaytsa ikkinchi oyna + `NSPasteboard` ga buyruq. `Nimalar yangi?` → `https://github.com/behruz-baxodirov/yangi-alifbo/releases/latest`.
- [ ] **Step 4:** AppDelegate: `refresh()` sarlavhaga `↑` qo'shadi (ruxsat bor va `updater.available != nil`); `showMenu()` tepasida `Yangi versiya bor (X) — yangilaş…` + separator; `Yordam va yangilanişlar…` dan keyin `Yangilanişni özi tekşirsin` (state = setting, bosilganda toggle).
- [ ] **Step 5:** `cd mac && swift build` va `swift test` — xatosiz; matnlarni `converter.js` dan o'tkazib, o'zgarmaganini ko'rish.
- [ ] **Step 6:** qo'lda: `dist/` build, `defaults write uz.yangialifbo.YangiAlifbo availableVersion 9.9.9` bilan menyu va oyna ko'rinishi (egasining mashinasida — faqat egasi roziligi bilan, ishlayotgan nusxa o'rniga).
- [ ] **Step 7:** commit `feat(mac): yangi versiya xabari va Terminalʼda yangilaş`.

### Task 3: Sayt, versiya, reliz matni

**Files:**
- Modify: `web/index.html` ("Ruxsat sörayaptimi?" `<p>` va JSON-LD; `#yangilash` `<p>` va JSON-LD)
- Modify: `mac/Resources/Info.plist` (`2.0.3`, build `6`)
- Create: `docs/release-notes/2.0.3.md` (GitHub reliz matni)

- [ ] **Step 1:** FAQ matni spec 6-bo'limdan; `#yangilash` ga: `2.0.3 dan boşlab dastur yangi versiya çiqqanini özi aytadi: menyu-barda ö↑ körinadi, ö ustida öng tugma → “Yangi versiya bor” ni bosing.` Ikkala joyda bir xil.
- [ ] **Step 2:** `node --test web/*.test.mjs web/test/*.test.mjs` — hammasi pass.
- [ ] **Step 3:** reliz matni: 2.0.3 nima beradi (yangi versiya xabari, c b ⌫ h / cbh ← ⌫ tuzatishi), internet haqida halol jumla, buyruq, Accessibility eslatmasi; converter'dan o'tkazish.
- [ ] **Step 4:** commit `chore(mac): 2.0.3`.

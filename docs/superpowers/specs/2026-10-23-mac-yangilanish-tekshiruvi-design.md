# macOS: yangi versiya haqida xabar (dizayn)

Sana: 2026-10-23 · Holat: egasi dizaynni tasdiqladi, spec ko'rib chiqishga · Versiya: 2.0.3

## 1. Muammo va maqsad

O'rnatilgan Mac ilovasi o'zi yangilanmaydi: foydalanuvchi
`curl -fsSL https://yozgich.uz/install.sh | bash` ni qayta yurgizishi kerak
(saytdagi `#yangilash` savoli). Ikki kunda 4 ta versiya chiqdi, 2.0.2 tez
yozishdagi jiddiy xatoni tuzatdi, lekin eski nusxadagilar buni bilmaydi.

Maqsad: yangi versiya chiqsa, foydalanuvchi bilsin va bir bosishda yangilasin.
Hech narsa jimgina o'rnatilmaydi.

## 2. Egasining qarorlari (2026-10-23)

| Savol | Qaror |
|---|---|
| Internetga chiqish mumkinmi? | Ha: kuniga ko'pi bilan bir marta, menyuda o'chirib qo'yish mumkin |
| Xabar qanchalik ko'rinadi? | Belgi `ö↑`, har yangi versiya uchun bir marta ekrandagi xabar, menyu tepasida punkt |

"Matn hech qayerga yuborilmaydi" o'zgarmaydi. "Dastur internetga ulanmaydi"
o'rniga saytda aniq nima yuborilishi yoziladi (6-bo'lim).

## 3. Tekshiruv

- **So'rov:** `HEAD https://github.com/behruz-baxodirov/yangi-alifbo/releases/latest`,
  yo'naltirishga ergashmaydi; `Location` (`…/releases/tag/v2.0.2`) dan teg olinadi.
  API (`api.github.com`) emas: u IP boshiga soatiga 60 so'rov beradi, operator NAT
  ortidagi ko'p foydalanuvchi chegarani to'ldirib qo'yadi. `install.sh` ham shu
  `releases/latest` ga tayanadi, manba bitta.
- **Maxfiylik:** `URLSessionConfiguration.ephemeral` (cookie, kesh yo'q),
  `User-Agent: YangiAlifbo/<versiya>`, tana yo'q. GitHub IP manzil va shu
  sarlavhani ko'radi, boshqa hech narsa yuborilmaydi.
- **Jadval:** ishga tushgandan 1 daqiqa keyin (login paytida Wi-Fi hali ulanmagan
  bo'lishi mumkin) va keyin har soatda `Settings.lastUpdateCheck` dan 24 soat
  o'tganmi deb qaraladi. Server javob bersa (qanday javob bo'lmasin) vaqt yoziladi.
  Javob kelmasa (internet yo'q) vaqt yozilmaydi va keyingi soatda yana uriniladi —
  bunday so'rov serverga yetib bormagan bo'ladi. Demak GitHub kuniga ko'pi bilan
  bitta so'rov ko'radi.
- **O'chirish:** menyuda `Yangilanişni özi tekşirsin` (standart: yoqilgan).
  O'chiq bo'lsa so'rov umuman yuborilmaydi.
- **Xato:** 302 emas yoki teg o'qilmadi — jim, 24 soatdan keyin yana; tarmoq yo'q —
  jim, bir soatdan keyin yana.

## 4. Xabar va yangilash

- Topilgan versiya joriydan katta bo'lsa (`2.0.10 > 2.0.9`, `v` prefiksi va
  ortiqcha qismlar e'tiborga olinadi, raqam bo'lmagan teg — yangilanish emas),
  `Settings.availableVersion` ga yoziladi.
- Belgi: `ö↑` / `A↑` (ruxsat yo'q paytdagi `ö⚠︎` o'zgarmaydi).
- Shu versiya uchun birinchi marta: ekranda `Yangi versiya bor: 2.0.4`,
  ostida `ö ustida öng tugma → yangilaş` (5 soniya). `Settings.announcedVersion`
  qayta chiqishiga yo'l qo'ymaydi.
- Menyu tepasida: `Yangi versiya bor (2.0.4) — yangilaş…`.
- Bosilganda oyna: sarlavha `Yangi versiya 2.0.4`, matn
  `Terminal oçiladi va örnatiş buyruği işga tuşadi. Keyin macOS Accessibility
  ruxsatini qayta söraydi: Privacy & Security → Accessibility → "Yangi alifbo"ni yoqing.`
  Tugmalar: `Yangilaş` · `Nimalar yangi?` (reliz sahifasi) · `Keyinroq`.
- `Yangilaş`: `~/Library/Caches/uz.yangialifbo.YangiAlifbo/yangilash.command`
  (bajariladigan, ichida faqat buyruq) yoziladi va `NSWorkspace.open` bilan
  Terminal'da ochiladi — Automation ruxsati kerak emas, buyruq ko'rinib ishlaydi.
  Ochilmasa: oyna `Terminal oçilmadi. Buyruqni özingiz Terminalʼga yozing:` va
  buyruq, buyruq clipboard'ga ham ko'chiriladi.
- Ilova o'zini yangi versiya bilan tenglashgan deb biladi: ishga tushganda
  `availableVersion <= joriy` bo'lsa tozalanadi.

## 5. Kod tuzilishi

- `mac/Sources/AlifboCore/Update.swift` — sof mantiq, testlanadi:
  `AppVersion` (parse, taqqoslash), `UpdateCheck.version(fromLocation:)`,
  `UpdateCheck.isDue(last:now:)`, `UpdateCheck.newer(latest:than:)`.
- `mac/Sources/YangiAlifbo/Updater.swift` — tarmoq so'rovi, taymer, `.command`
  fayl, oyna. `AppDelegate` faqat chaqiradi va menyu/belgini chizadi.
- `AppInfo.swift` — yangi `Settings` kalitlari, `releasesLatestURL`, `installCommand`.
- Testlar: `mac/Tests/AlifboCoreTests/UpdateTests.swift`, `swift test`.

## 6. Sayt

- "Ruxsat sörayaptimi?" (ko'rinadigan `<p>` va JSON-LD bir xil, `seo.test.mjs`):
  `dastur internetga ulanmaydi` o'rniga
  `Matn heç qayerga yuborilmaydi. Dastur faqat kuniga bir marta GitHubʼdan yangi
  versiya raqamini tekşiradi (matn ham, sozlamalar ham yuborilmaydi); menyudagi
  "Yangilanişni özi tekşirsin" belgisini olib taşlasangiz, internetga umuman çiqmaydi.`
- `#yangilash`: 2.0.3 dan boshlab menyuda `Yangi versiya bor` chiqishi yoziladi.
- Barcha yangi matn `web/converter.js` dan o'tkaziladi.

## 7. Chegaralar

- Windows beta'ga tegilmaydi (keyingi ish).
- Avtomatik yuklab olish/o'rnatish yo'q; faqat xabar va ko'rinadigan buyruq.
- Hozirgi foydalanuvchilar 2.0.3 ga bir marta qo'lda yangilaydi; reliz matnida aytiladi.

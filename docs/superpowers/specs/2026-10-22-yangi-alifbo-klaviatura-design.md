# Yangi Alifbo — klaviatura va konverter (dizayn)

Sana: 2026-10-22 · Holat: ko'rib chiqishga

## 1. Maqsad

O'zbekiston yangilangan lotin alifbosiga o'tdi (ЎРҚ-1184-son Qonun, 21.10.2026
imzolangan, 22.04.2027 dan kuchga kiradi). Odamlar hozirgi odatlari bilan
(`o'`, `g'`, `sh`, `ch`) yozadi, dastur esa avtomatik yangi harflarni qo'yadi.
Dastur bepul, Instagram orqali hammaga tarqatiladi.

Muvaffaqiyat mezoni: oddiy foydalanuvchi bir daqiqada o'rnatadi, 🌐 yoki ⌃Space
bilan yoqadi va Telegram, Chrome, Notes, Word'da yangi alifboda xatosiz yozadi.

## 2. Qoidalar (manba: qonun va matbuot, rasmiy imlo qoidalari hali e'lon qilinmagan)

| Eski | Yangi | Misol |
|---|---|---|
| oʻ (o' o` o‘ o’ oʼ) | ö | o'zbek → özbek |
| gʻ | ğ | tog' → toğ |
| sh | ş | shahar → şahar |
| ch | ç | chiroq → çiroq |
| s'h (alohida tovush) | sʼh | Is'hoq → Isʼhoq, as'hob → asʼhob |
| harf + ' + harf (tutuq) | harf + ʼ + harf (U+02BC) | ma'no → maʼno |
| ng | o'zgarmaydi | tong → tong |

Katta harf: birinchi harf belgilaydi: `Sh`/`SH` → `Ş`, `sH` → `ş`, `O'` → `Ö`.

## 3. Tarkib

Uch qism. Mantiq hammasida bitta va umumiy test to'plami bilan tekshiriladi.

1. **macOS klaviaturasi** (1-bosqich): InputMethodKit asosidagi Input Source.
2. **Sayt** (2-bosqich): landing sahifa va onlayn konverter (eski lotin/kirill → yangi).
3. **Windows** (3-bosqich, beta): AutoHotkey v2 asosidagi tray dastur.

```
yangi-alifbo/
  core/fixtures/cases.json     # umumiy test holatlari: {input, expected}
  mac/                         # Swift package: AlifboCore + IME ilova
    Sources/AlifboCore/        # sof mantiq, UI'siz, test qilinadi
    Sources/YangiAlifbo/       # IMKInputController, main, --install/--uninstall
    Tests/AlifboCoreTests/
    Resources/                 # Info.plist, ikonka
    scripts/build.sh           # universal (arm64+x86_64) .app va zip yig'adi
  web/                         # statik sayt (GitHub Pages)
    index.html, converter.js, converter.test.mjs
    install.sh, uninstall.sh   # curl | bash orqali o'rnatish
  windows/                     # 3-bosqich
```

## 4. macOS klaviaturasi

**Texnologiya:** `~/Library/Input Methods/YangiAlifbo.app` (InputMethodKit). Ruxsat
so'ramaydi va barcha dasturlarda ishlaydi. Asos tartibi ABC (US), shuning uchun harflar
o'z joyida qoladi.

**Ishlash mantig'i (holat mashinasi, `AlifboCore.Composer`):**
- `pending`: kutilayotgan bitta harf (`o O g G s S c C`). Ekranda marked text bo'lib
  ko'rinadi, keyingi tugmagacha ostiga chizilgan holda turadi.
- `o/g` dan keyin apostrof (`' ` ‘ ’ ʻ ʼ ´`) kelsa `ö/ğ` yoziladi.
- `s/c` dan keyin `h` kelsa `ş/ç` yoziladi.
- `s` dan keyin apostrof kelsa `sʼ` yoziladi. Shuning uchun `s'h` → `sʼh` bo'ladi, buning
  uchun alohida qoida kerak emas.
- Harfdan keyin kelgan apostrof ham bir lahza kutib turadi: undan keyin harf kelsa `ʼ` bo'ladi, aks holda `'` o'zicha qoladi. Shunda qo'shtirnoq buzilmaydi (menyuda o'chirish mumkin).
  Bo'shliq yoki raqamdan keyin `'` o'zicha qoladi (qo'shtirnoq uchun).
- Boshqa har qanday tugmada pending yozib yuboriladi va tugma odatdagidek ishlaydi.
  Bu Enter, Tab, strelka, ⌘/⌃/⌥ kombinatsiyalari, sichqoncha bosish, oyna
  almashtirish uchun ham to'g'ri keladi.
- Pending bor paytda Backspace bosilsa, faqat pending o'chadi.
- Ma'lum cheklov: `o` dan keyin tutuq kerak bo'lgan juda kam uchraydigan so'zlar (`mato'`) ham `ö` bo'lib qoladi. Bunday holatda klaviaturani bir lahzaga o'chirib turish kerak.
- Natijada kod kam tegadi: trigger bo'lmagan tugmalar to'g'ridan-to'g'ri ilovaga o'tadi.

**Yoqish-o'chirish:** macOS standarti: 🌐 (Fn) yoki ⌃Space (ABC ↔ Yangi alifbo).
`TICapsLockLanguageSwitchCapable` yoqiladi, xohlaganlar Caps Lock bilan ham almashtiradi.

**Menyu (input menyusida):** "Tutuq belgisi ʼ" (belgilanadigan), "Sayt / yordam",
versiya. Sozlama UserDefaults'da saqlanadi.

**O'rnatish:** `curl -fsSL <sayt>/install.sh | bash`. Skript GitHub Releases'dan zip'ni
yuklaydi, `~/Library/Input Methods` ga qo'yadi va `YangiAlifbo --install` ni ishga
tushiradi (TISRegisterInputSource va TISEnableInputSource). curl orqali yuklangan faylga
quarantine belgisi qo'yilmaydi, shuning uchun Apple Developer ID ($99) shart emas.
`uninstall.sh` hammasini teskari tartibda olib tashlaydi. Yangilash uchun install.sh
qayta ishga tushiriladi.

**Yig'ish:** `swift build` (arm64 va x86_64) → lipo → .app → ad-hoc imzo → zip.
macOS 12+.

## 5. Sayt (2-bosqich)

Statik HTML/CSS/JS, freymvork yo'q, GitHub Pages'da turadi. **Sahifa matnining o'zi yangi
alifboda yoziladi.** Dizayn impeccable skill orqali qilinadi.
- Hero: "Yangi alifboda yozing — odatdagidek", jonli demo maydoni (yozganingiz shu
  zahoti o'giriladi).
- Mac o'rnatish: bitta buyruq va nusxa olish tugmasi, 3 qadam, shortcut'lar.
- Qoidalar jadvali, jumladan `s'h` istisnosi.
- Konverter: eski lotin yoki kirill matni (avtomatik aniqlanadi) → yangi alifbo, nusxa
  olish tugmasi. URL, email va @handle'larga tegilmaydi. Tutuqsiz yozilgan mashhur
  istisnolar (ishoq→isʼhoq, ashob→asʼhob, mushaf→musʼhaf) lug'at orqali tuzatiladi.
- Telefonda yozish bo'yicha maslahat: harfni bosib turish (o → ö, s → ş ...). Turk
  klaviaturasida `i/I` → `İ/ı` xatosi borligi haqida ogohlantirish.
- Windows: "beta" belgisi bilan yuklab olish (3-bosqichdan keyin).

## 6. Windows (3-bosqich, beta)

AutoHotkey v2 tray dastur, Ahk2Exe bilan bitta .exe qilib yig'iladi (GitHub Actions,
windows-latest). Mantiq macOS bilan bir xil, faqat orqaga o'chirish bilan ishlaydi:
`o` dan keyin `'` kelsa `{BS}ö` yuboriladi. Yoqish-o'chirish: `Ctrl+Alt+Space` va tray
ikonka. CI'da Notepad'ga yozib natijani tekshiradigan smoke test bo'ladi. Imzosiz exe
SmartScreen ogohlantirishini beradi, bu saytda tushuntiriladi.

## 7. Test

- `core/fixtures/cases.json`: 60+ holat (har bir qoida, katta harf, apostrof turlari,
  `s'h`, `mashhur` (ş+h), `ng`, tinish belgilari).
- Swift: `Composer` ga holat matni harfma-harf beriladi, natija kutilgan bilan
  solishtiriladi. Backspace, Enter va commit holatlari alohida testlanadi.
- JS: konverter o'sha fixtures ustida (`node --test`), qo'shimcha ravishda kirill va URL
  holatlari.
- Qo'lda: o'rnatilgan klaviatura TextEdit, Notes, Chrome, Telegram'da sinaladi.

## 8. Doiradan tashqari

Telefon klaviaturalari (iOS/Android ilova). Apple Developer ID bilan notarizatsiya
(keyin qo'shish mumkin). Imlo tekshiruvchi.

## 9. Ochiq savollar (faqat siz bilasiz)

- Dastur nomi: ishchi nomi **"Yangi alifbo"**, input menyusida "Yangi alifbo" bo'lib
  ko'rinadi.
- Hosting: `github.com/behruz-baxodirov/yangi-alifbo` (ochiq repo) va GitHub Pages.
  Push qilishdan oldin sizdan so'rayman.

## 10. Özgariş (2026-10-22): input source → fondagi menyu-bar dasturi

Egasi sinab kördi: input source faqat tanlangan payt işlaydi, ⌃Space uni boşqa tilga almaştiradi, Telegram'da tanlov yöqolib qoldi. Qaror (egasining sözi): "fonda doim işlaydigan menyu-bar dasturini qur. Accessibility ruxsati mayli."

- macOS: `YangiAlifbo.app` (LSUIElement, bundle id `uz.yangialifbo.YangiAlifbo`), `~/Applications` ga örnatiladi, LaunchAgent bilan tizimga kirganda işga tuşadi.
- CGEventTap (Accessibility ruxsati) tugmalarni köradi; `AlifboCore.Rewriter` "öçir + yoz" qarorini beradi: `o` dan keyin `'` → `{BS}ö`, `s`+`h` → `{BS}ş`, harf+`'`+harf → `{BS}ʼ`+harf. Qoidalar va `core/fixtures/cases.json` özgarmaydi.
- Yoqiş/öçiriş: menyu-bardagi `ö` (öçiq paytda `A`) belgisini bosiş. Parol maydonlarida macOS tapni özi öçiradi.
- install.sh eski input source'ni öçiradi (aks holda ikki marta ögiriladi).
- Narxi: Accessibility ruxsati; imzosiz dastur yangilanganda ruxsatni qayta beriş kerak bölişi mumkin.

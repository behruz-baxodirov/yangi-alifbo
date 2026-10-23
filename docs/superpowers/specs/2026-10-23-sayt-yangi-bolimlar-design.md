# Sayt: yangi bölimlar (dizayn)

Sana: 2026-10-23 · Holat: egasi körib çiqişiga
Maket (egasi maʼqullagan): https://claude.ai/artifact/H7gb8c4YgVkp7xknCbLWVk

## 1. Maqsad

yozgich.uz saytiga beş yangi qism qöşiladi. Saytga asosan Instagramʼdan telefon orqali kelişadi, şuning uçun asosiy foyda telefonda böladi:

1. **Telefonda yoziş** yöriqnomasi: iPhone va Androidʼda ö ğ ş ç ni qanday yoziş kerakligi, öxşaş xato harflardan ogohlantiriş bilan.
2. **Sanoq**: ЎРҚ-1184-son Qonun kuçga kirişiga (22.04.2027) qolgan kunlar.
3. **«Bu söz qanday yoziladi?»**: söz yozilsa, yangi yozilişi va qaysi qoida işlagani körsatiladi.
4. **10 savollik test**: natija Instagram story uçun rasm (1080×1920) böladi.
5. **Kirillda öqiş**: butun sahifani kirill yozuvida körsatadigan tugma.

Muvaffaqiyat mezoni:
- Telefondan kelgan odam öz telefonida ğ va ş ni töğri harf bilan yoza oladi.
- Test natijasini bir bosişda storyga qöya oladi.
- Kirillda öqiydigan odam sahifani töliq tuşunadi.

**Bu raundga kirmaydi** (egasi keyinga qoldirdi): ism kartasi, .docx/.txt fayl konverteri. PWA, fon rasmi, Telegram bot va Chrome kengaytmasi ham kirmaydi.

## 2. Özgarmas tamoyillar

- Saytdagi har bir yozuv yangi alifboda (ö ğ ş ç, tutuq ʼ U+02BC). JS örnatadigan matnlar ham, alt matnlar ham. Eski yozuv faqat ataylab berilgan misollarda bölişi mumkin. Ötkaziş oldidan har bir yangi matn `web/converter.js` dan ötkaziladi.
- Heç narsa qurilmadan çiqmaydi. Söz tekşiruv, test va rasm faqat brauzerda işlaydi.
- Halollik: rasmiy emasmiz, foydalanuvçi sonini tuqimaymiz. Tekşira olmagan narsani (Android menyusi) ehtiyotkor yozamiz.
- Dizayn mavjud «Non va çekiç» tizimida qoladi (`DESIGN.md`): 3px burçak, soya yöq, nuqtalar yagona bezak, clay faqat flour va dough ustida, Doto qatori nuqta bilan tugamaydi, ğ Doto bilan yozilmaydi.
- Statistika: har yangi imkoniyat `window.track(name, params)` bilan voqea yuboradi (§9).

## 3. Sahifa tartibi

```
tepa qism (özgarmaydi)
· Telefonda yoziş      #telefonda   (yangi)
· Qoidalar             #qoidalar    (+ sanoq, + söz tekşiruv)
· Test                 #test        (yangi)
· Savollar             #savollar
· Asosçi               #asoschi
pastki qism
```

Bölimlar orasida mavjud `.sec-rule` nuqta çiziği turadi. Menyuga «Test» havolasi qöşiladi: Yuklab oliş · Konverter · Qoidalar · Test · Savollar. Menyu qatoriga yozuv tugmasi qöşiladi (§8). Uning telefonda ham körinişi şart.

## 4. Telefonda yoziş (`#telefonda`)

Sarlavha «Telefonda yoziş» (Doto). Ostida yuklab oliş panelidagi kabi qora plita (`.dl` uslubi) turadi. Plita içida ARIA tablist bor: **iPhone | Android**, yuklab oliş tablari bilan bir xil xatti-harakat (strelka, Home, End). Androidʼda Android tabi, boşqa joyda iPhone tabi oldindan tanlanadi.

**iPhone paneli:**
- Kiriş qatori: «Harfni **bosib turing**, menyu oçiladi. Barmoqni töğri harfga surib qöyib yuboring.»
- Tört qator: o, g, s, c. Har qatorda tugma (flour fonli harf) va çizilgan menyu turadi. Menyuda töğri harf (crust fonli, flour halqali) va 1–4 ta öxşaş xato harf bor. Ostida qisqa izoh:
  - o: ô **ö** ò ő · «ö: tepasida ikki nuqta»
  - g: **ğ** ġ · «ğ: tepasida qayiqça, nuqta emas»
  - s: ś š **ş** ș · «ş: ostida ilmoq. ș (vergul) boşqa harf»
  - c: **ç** ć č · «ç: ostida ilmoq»
- Menyular aniq tartibni emas, faqat tanlovni körsatadi. Izoh matni tartib haqida heç narsa demaydi.
- Pastki izoh: «ğ va ş iOS 17 va yangisida bor. Menyuda yöq bölsa, iOSʼni yangilang yoki konverterdan foydalaning. Tutuq ʼ uçun oddiy ' yozing, konverter uni töğrilaydi.»

**Android paneli** (tekşirilmagan, şuning uçun ehtiyotkor yozilgan):
- «Klaviaturalar har xil (Gboard, Samsung va boşqalar). Harfni bosib turing: o, g, s, c. Menyuda bölsa, töğrisini tanlang.»
- «Töğri / Öxşaş, lekin boşqa» jadvali: ö | ő ô ò · ğ | ġ ǧ · ş | ș š ś · ç | č ć.
- «Menyuda yöq bölsa, odatdagidek o', g', sh, ch deb yozing va matnni konverterdan ötkazing.» Bu yerda konverterga havola beriladi.

**Ikkala tab uçun umumiy** (plita pastida, nuqta çiziq ostida): «**Turk klaviaturasini qöşmang:** unda i ning boş harfi İ (nuqtali) böladi, özbekçada I kerak.»

Savollardagi «Telefonda qanday yozaman?» javobi qisqaradi va `#telefonda` ga havola beradi. Turk klaviaturasi haqidagi ogohlantiriş u yerda ham qoladi.

## 5. Qoidalar: sanoq va söz tekşiruv

### 5.1 Sanoq

«Qoidalar» sarlavhasi ostida jadvaldan oldin turadi.
- Katta Doto raqam va «kun» (masalan **181 kun**).
- Matn: «**ЎРҚ-1184**-son Qonun kuçga kirişiga qoldi (22.04.2027). Har nuqta bir kun.»
- Kunlar maydoni: 21.10.2026 dan 22.04.2027 gaça har kun uçun bitta 7px nuqta (183 ta). Ötgan kunlar töliq char, bugungi kun flour içli, qolganlari halqa. Ostida ikki çetda «21.10.2026 imzolandi» va «22.04.2027».
- Hisob qurilmaning mahalliy sanasidan olinadi.
- Qonun kuçga kirgan kuni: «ЎРҚ-1184-son Qonun bugun kuçga kirdi». Undan keyin: «ЎРҚ-1184-son Qonun 22.04.2027 dan kuçda». Raqam yaşiriladi, hamma nuqta töla böladi.
- JS bölmasa, sanoq bloki körinmaydi (`hidden`, JS oçadi).
- Ekran öquvçi uçun nuqtalar `aria-hidden`, matn esa öqiladi.

Hisob sof funksiya: `daysLeft(today)` va `dayDots(today)` (`web/sanoq.js`).

### 5.2 Söz tekşiruv

Flour işçi maydon (`.check`):
- Yorliq: «Bu söz qanday yoziladi?»
- Bir qatorli maydon, placeholder «Masalan: Is'hoq».
- Natija dough paneli: katta (32px, 700) yangi yozuv. Özgargan harflar clay rangda va nuqtali tagçiziq bilan belgilanadi (konverterdagi kabi). Yonida «Nusxa oliş» tugmasi.
- Ostida qoidalar röyxati: qaysi qoida işlagani.
- Jadvalning mos qatori (`tr[data-rule]`) yonadi: char fon, flour matn.

Qoidalar va izohlar (`web/soz.js`, `explain(text)` sof funksiya):

| id | Qaçon | Izoh |
|---|---|---|
| `o` | o + apostrof (har qanday APOS) yoki kirill ў | o' → ö |
| `g` | g + apostrof yoki ғ | g' → ğ |
| `sh` | sh (s'h emas) yoki ш, щ | sh → ş: bitta harf |
| `ch` | ch yoki ч | ch → ç: bitta harf |
| `sh2` | s + apostrof + h, işoq/aşob/muşaf istisnolari yoki сҳ | s'h → sʼh: s va h alohida öqiladi, ş bölmaydi |
| `tutuq` | harf + apostrof + harf (o'/g'/s'h dan taşqari) yoki ъ | ' → ʼ: tutuq belgisi qoladi, şakli ʼ |

- Kirill kirsa, röyxat boşida «Kirill harflari lotinga ögirildi» degan qator çiqadi.
- Söz özi töğri bölsa (ögirgandan keyin özgarmasa): «Bu söz yangi alifboda töğri yozilgan.»
- `ng` bölsa, qöşimça qator çiqadi: «ng özgarmaydi».

Öxşaş harf ogohlantirişi qora fonda, crust rangli harf bilan çiqadi. Matn: «X özbekça harf emas. Töğrisi Y (izoh).»
- ö öxşaşlari: ő ô ò ó õ ō ø ǒ → «tepasida ikki nuqta»
- ğ öxşaşlari: ġ ǧ ĝ ģ → «tepasida qayiqça»
- ş öxşaşlari: ș š ś ŝ → «ostida ilmoq»
- ç öxşaşlari: č ć ĉ ċ → «ostida ilmoq»
- İ: «İ (nuqtali katta I) turk harfi. Özbekçada katta harf I.»
- ı: «ı (nuqtasiz i) turk harfi. Özbekçada i.»

Öxşaş harflar natijada töğri harfga almaştirilib körsatiladi. Konverterning özi (`converter.js`) özgarmaydi, çunki u klaviatura bilan umumiy fixtureʼlarga bağlangan.

Maydon 150 ms kutib yangilanadi. Boş maydonda natija paneli va jadval yonişi yöq. Statistika: sessiyada bir marta `soz_tekshirildi`.

## 6. Test (`#test`)

Flour işçi panel (`.quiz`). Sahifa oçilganda 1-savol tayyor turadi, «Boşlaş» bosqiçi yöq.
- Tepada «Test» sarlavhasi (Doto) va 10 ta progress nuqtasi: töğri javob char, xato clay, joriy savol halqa bilan belgilanadi. Ekran öquvçi uçun «10 dan N-savol» yozuvi bor.
- «N / 10», savol matni (700, 20px), 3 ta variant tugmasi (54px, 2px char çegara). Variantlar har safar aralaşadi.
- Javob bosilganda variantlar öçadi. Töğrisi dough fonda «Töğri» belgisi bilan turadi. Tanlangan xato javob üstidan clay çiziq tortiladi. Ostida tuşuntiriş çiqadi. «Keyingi savol» tugmasi paydo böladi va fokus unga ötadi. Natija `aria-live` orqali öqiladi.
- 10-savoldan keyin natija körinadi:
  - Doto bilan katta «8» va «/10».
  - Baho matni va «Döstlaringiz ham sinab körsin.»
  - «Storyga qöyiş» (ink) va «Qaytadan boşlaş» (ramkali) tugmalari.
  - Story rasmining kiçik körinişi (`<img>`).

Savollar (`web/test-savollar.js`; birinçi variant töğri, ekranda aralaşadi):

| # | Savol | Variantlar | Tuşuntiriş |
|---|---|---|---|
| 1 | «o'zbek» yangi alifboda qanday yoziladi? | özbek · ozbek · uzbek | o' bitta harf böladi: ö. |
| 2 | «choy» qanday yoziladi? | çoy · şoy · coy | ch bitta harf: ç. |
| 3 | «shahar» qanday yoziladi? | şahar · sahar · çahar | sh bitta harf: ş. |
| 4 | «tog'» qanday yoziladi? | toğ · tog · toq | g' bitta harf böladi: ğ. |
| 5 | «Is'hoq» qanday yoziladi? | Isʼhoq · Işoq · Isxoq | Bu sözda s va h alohida öqiladi, şuning uçun tutuq qoladi: sʼh. |
| 6 | «ma'no» qanday yoziladi? | maʼno · mano · mağno | Tutuq belgisi qoladi, faqat şakli ʼ böladi. |
| 7 | «tong» qanday yoziladi? | tong · toñ · tonğ | ng özgarmaydi. |
| 8 | Qaysi biri özbekça ş? | ş · ș · š | Özbekça ş ostida ilmoq bor. ș (ostida vergul) va š (tepasida qalpoqça) boşqa tillarning harfi. |
| 9 | Kirilldagi «Ўзбекистон» yangi alifboda qanday yoziladi? | Özbekiston · Uzbekiston · Oʼzbekiston | Kirilldagi ў ham ö böladi. |
| 10 | Yangi alifbo haqidagi qonun qaçon kuçga kiradi? | 22.04.2027 · 01.01.2027 · 21.10.2026 | ЎРҚ-1184-son Qonun 21.10.2026 da imzolangan, 22.04.2027 dan kuçga kiradi. |

Baholar (`grade(score)` sof funksiya):

| Ball | Matn |
|---|---|
| 10 | Aʼlo! Yangi alifboni töliq bilasiz. |
| 7–9 | Zör! Yangi alifboga deyarli tayyorsiz. |
| 4–6 | Yomon emas. Qoidalarni bir körib çiqing. |
| 0–3 | Boşlaniş şunday böladi. Qoidalarni öqib, qaytadan urinib köring. |

Test holati saqlanmaydi: sahifa qayta yuklansa, test boşidan boşlanadi.

## 7. Story rasm (A · Non)

`web/story.js`, `drawStory(canvas, score)`. Rasm 1080×1920 canvasʼga çiziladi:
- Fon: crust va 36px qadamli nuqta töri (15% char).
- Tepada logo: char disk, dough markaz, ö nuqta harfi, yonida Doto 72px «yozgiç».
- Doto 92px ikki qatorda: «Yangi alifbo» / «testi».
- Markazda non: rim-edge, rim, rim-edge halqalari, dough markaz, ikki pip halqasi (56 va 64 ta).
- Non içida Doto 420px ball, Doto 130px «/10», Onest 700 42px «töğri javob».
- Pastda Onest 500 46px «Siz ham sinab köring:» va Onest 800 104px «yozgich.uz». Doto nuqtani plyus qilib çizgani uçun domen Onest bilan yoziladi.
- Çiziştan oldin şriftlar yuklanadi: `document.fonts.load` Doto 900 (latin va latin-ext, «ç» bilan) va Onest 500/700/800 uçun.

«Storyga qöyiş» tugmasi:
1. Canvas PNG `Blob` ga aylanadi, `File("yozgich-test.png")` yasaladi.
2. Agar `navigator.canShare?.({ files })` töğri bölsa, `navigator.share({ files })` çaqiriladi, faqat fayl bilan. Foydalanuvçi bekor qilsa, xato körsatilmaydi.
3. Aks holda rasm `a[download]` orqali yuklab beriladi.
4. Har ikki holatda natija ostida rasmning körinişi (`<img>`, blob URL) va izoh turadi: «Rasmni bosib turib saqlaşingiz mumkin». Bu Instagram brauzerida share işlamasa ham yordam beradi.

Statistika: `story_ulashildi` {usul: "share" | "yuklab"}.

## 8. Kirillda öqiş

**Tugma.** Menyu qatorida logo va asosçi kapsulasi orasida turadi. Uslubi chip (2px char çegara, 40px balandlik, 3px burçak, Onest 700 14px). Lotin rejimida «Кирилл» (`lang="uz-Cyrl"`) yozilgan, kirill rejimida «Lotin». `aria-pressed` holati bor. Telefonda menyu qatori sığmasa, asosçi kapsulasidagi ism 420px dan tor ekranda yaşiriladi.

**Ögiriş** (`web/kirill.js`):
- `toCyrillic(text)` sof funksiya, yangi lotin → özbek kirill:
  - harflar: ö→ў, ğ→ғ, ş→ш, ç→ч, q→қ, h→ҳ, x→х, va hokazo.
  - sʼh → сҳ.
  - ʼ → ъ (maʼno → маъно).
  - yo/yu/ya → ё/ю/я.
  - ye → е, sözning boşida yoki unlidan keyin.
  - e → э, sözning boşida yoki unlidan keyin; boşqa joyda е.
  - Katta harf: birinçi harf belgilaydi, töliq katta söz katta qoladi.
- Ögirilmaydigan sözlar:
  - KEEP röyxati: Yozgiç, Mac, macOS, iOS, iPhone, Android, Gboard, Samsung, Windows, Terminal, Telegram, Instagram, GitHub, Apple, Intel, Notepad, ChatGPT, Claude, AI va boşqalar.
  - Içida c (ç emas) yoki w bor sözlar.
  - Söz örtasida katta harfi bor sözlar (macOS, GitHub).
  - Töliq katta lotin qisqartmalar (AI, MB, PC).
  - Havola, domen, email va @handle (converterʼdagi `PROTECTED` kabi).
  - Ögirilmaydigan sözga qöşimça ulangan bölsa (Macʼda), söz qoladi, qöşimça ögiriladi: Macʼда.
- `applyScript(root, "kirill" | "lotin")`: DOM matn tugunlarini ögiradi. Har tugunning asl matni `WeakMap` da saqlanadi, qaytariş aniq böladi. `aria-label`, `placeholder` va `document.title` ham ögiriladi.
- Teginilmaydigan joylar:
  - `code`, `kbd`, `pre`, `textarea`, `input`, `script`, `style`.
  - `[lang="en"]`, `[lang="ru"]`, `[data-lotin]`.
  - Konverter natijasi `.out`.
  - Qoidalar jadvalining tanasi.
  - Söz tekşiruv natijasi va test variantlari (bular imlo misoli).
  - Story rasmi.
- index.html dagi inglizça va ruşça UI matnlari (`More info`, `Run anyway`, “Windows protected your PC”, `Подробнее`...) `lang="en"` / `lang="ru"` bilan belgilanadi. Bu ekran öquvçilarga ham foydali.
- Dinamik matnlar (nusxa tugmasi yorliği, «N ta harf özgardi», test savollari...) `MutationObserver` bilan ögiriladi. Kirill rejimida qöşilgan har yangi matn tuguni ögiriladi. Kirill matnda ögiradigan narsa qolmagani uçun aylanib qolmaydi.
- `<html lang>` kirill rejimida `uz-Cyrl`, lotinda `uz` böladi.
- Tanlov `localStorage` («yozgich-yozuv») da saqlanadi, try/catch içida. Keyingi taşrifda sahifa yuklanişi bilan qöllanadi.

**Şriftlar.** Doto kirillni bilmaydi. Kirill rejimida Doto sarlavhalar (`.hero-head`, `.sec-title`, `.try-title`, `.founder-name`, `.close-big`, `.quiz-title`, `.count-n`, `.count-u`) Onest 800 bilan çiqadi, harf oraliği -0.015em. Logo «yozgiç» Dotoʼda qoladi. Onest öz serverimizdan, 4 subset bilan: latin, latin-ext, cyrillic, cyrillic-ext. Vazn oraliği 400–800 böladi. ў ғ қ ҳ cyrillic-extʼda, ularning töğri çiqişi glyph varağida körib tekşiriladi.

**Tekşiruv.** `toCyrillic` uçun test bor: index.html dagi yangi alifbodagi har söz uçun `convert(toCyrillic(w)) === w` (aylanma). Maʼlum istisnolar alohida röyxatda izoh bilan turadi (masalan ўъ → ö). Kirill rejimida brauzerda qolgan lotin sözlar röyxati olinadi va har biri körib çiqiladi.

Statistika: `yozuv_almashtirildi` {yozuv: "kirill" | "lotin"}.

## 9. Statistika voqealari

| Voqea | Qaçon |
|---|---|
| `telefon_tab` {os} | iPhone/Android tabi bosildi |
| `soz_tekshirildi` | sessiyada birinçi tekşiruv |
| `test_boshlandi` | 1-savolga birinçi javob |
| `test_tugadi` {ball} | 10-savoldan keyin |
| `test_qayta` | «Qaytadan boşlaş» |
| `story_ulashildi` {usul} | §7 |
| `yozuv_almashtirildi` {yozuv} | §8 |
| `kordi_telefonda`, `kordi_test` | mavjud IntersectionObserverʼga qöşiladi |

## 10. Fayllar

- Yangi: `web/sanoq.js`, `web/soz.js`, `web/test-savollar.js`, `web/test.js` (UI), `web/story.js`, `web/kirill.js`.
- Har sof modul uçun test: `web/sanoq.test.mjs`, `web/soz.test.mjs`, `web/test.test.mjs`, `web/kirill.test.mjs`.
- Özgaradi:
  - `web/index.html`: yangi bölimlar, menyu, `lang` belgilari, savol javobi, versiya raqamlari.
  - `web/styles.css`: yangi komponentlar va kirill şrift qoidalari.
  - `web/app.js`: modullarni ulaş, tablar, statistika.
  - `web/fonts/`: Onest 4 subset, 400–800.
  - `.github/workflows/pages.yml`: test qadami `node --test web/*.test.mjs`.
  - `DESIGN.md`: yangi komponentlar va Kirill şrift qoidasi.

## 11. Xatolar va çegara holatlar

- Web Share yöq yoki rad etildi: yuklab oliş va bosib saqlaş körinişi qoladi.
- Canvas `toBlob` null qaytarsa: «Rasm yasab bölmadi. Qaytadan urinib köring.» xabari çiqadi.
- localStorage yöq: yozuv tanlovi faqat şu sahifada amal qiladi, xato körsatilmaydi.
- Juda uzun söz yoki matn söz tekşiruvga tuşsa: natija `overflow-wrap: anywhere`, qoidalar bir martadan.
- JS yöq: telefon yöriqnomasi (iPhone paneli) va qoidalar jadvali körinadi. Sanoq, söz tekşiruv, test va yozuv tugmasi yaşirin qoladi.
- Kamroq harakat (`prefers-reduced-motion`): yangi animatsiya yöq. Faqat holat özgaradi.

## 12. Tekşiruv

- `node --test web/*.test.mjs` hammasi ötadi, `converter.test.mjs` ham.
- Yangi matnlarni `converter.js` dan ötkazib eski yozuv qolmaganiga işonç hosil qilinadi. Faqat ataylab berilgan misollar qolişi mumkin.
- Brauzer oynasida 375px telefon va 1280px kompyuter körinişi tekşiriladi: gorizontal scroll yöq, header sığadi.
- Ö ğ ş ç ʼ va ў ғ қ ҳ glyph varaği Onest 400/700/800 da çizilib körib çiqiladi.
- Story PNG haqiqiy öçamda saqlanib körib çiqiladi.
- `impeccable detect` yangi UI ustida bir marta yurgiziladi.

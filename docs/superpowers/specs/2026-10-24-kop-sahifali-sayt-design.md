# Köp sahifali sayt: 4 til, sözlar, maşq, fayl, maqolalar, vidjet (dizayn)

Sana: 2026-10-24 · Holat: egasi körib çiqişiga

## 1. Maqsad

yozgich.uz hozir bitta sahifa. Bu raundda u köp sahifali saytga aylanadi va har bir sahifa törtta körinişda çiqadi. Egasi tanlagan işlar (raqib sayt yangicha.uz tahlilidan keyin, 2026-10-24):

| # | Qism | Nima uçun |
|---|---|---|
| A | Köp sahifali asos + 4 til: yangi lotin `/`, eski lotin `/eski/`, kirill `/kr/`, rus `/ru/` | Google faqat aynan yozilgan sözni topadi (`yozgich-seo-status`): odamlar «o'zbek», «uchun», «клавиатура» deb qidiradi. Eski lotin va kirill sahifalar şu sörovlarga çiqadi |
| B | Söz va ism sahifalari + ism kartasi (story rasm) | Köp qidiruv kiriş nuqtasi; ism kartasi Instagram uçun |
| C | Tez yoziş maşqi | Yozgiç bilan odat hosil qiliş, ulaşiladigan natija |
| D | Fayl konvertori: .docx, .txt, .md, .csv, .srt, .vtt | Raqibdagi eng katta farq |
| E | Maqolalar va saytlar uçun vidjet | Kontent va boşqa saytlardan havola |

Tartib: A → B → C → D → E. Har qism tugagaç `main`ga push qilinadi (`push-deploy-without-asking`).

**Kirmaydi:** Telegram bot (server kerak), inglizça versiya, öqituvçi materiallari (plakat, kartoçka), klaviatura stikerlari (Yozgiçga kerak emas).

Muvaffaqiyat mezoni:
- `site:yozgich.uz uchun` va `site:yozgich.uz клавиатура` kabi sörovlarga eski lotin va kirill sahifalar topiladi (indekslangandan keyin).
- Har bir sahifa törtta tilda oçiladi, tillar orasida bir bosişda ötiladi va har tilda bir xil joyga tuşiladi.
- Ism yozgan odam bir bosişda story rasmini oladi.
- Word hujjat ögirilgandan keyin Wordda oçiladi, jadval va uslublar joyida.

## 2. Özgarmas tamoyillar

- Manba matnlar yangi alifboda yoziladi (ö ğ ş ç, tutuq ʼ U+02BC). Eski lotin va kirill versiyalar ulardan avtomatik yasaladi, qölda yozilmaydi. Rus matni alohida, qölda yoziladi.
- Freymvork yöq, GitHubʼda build bosqiçi yöq. Generator lokal işlaydi, natija `web/` ga commit qilinadi; Pages workflow özgarmaydi (faqat testlar köpayadi).
- Heç narsa qurilmadan çiqmaydi: konvertor, fayl, maşq, ism kartasi, vidjet — hammasi brauzerda.
- Halollik: rasmiy emasmiz; maqolalarda faqat qonun matni (ЎРҚ-1184, 21.10.2026, kuçga kiriş 22.04.2027) va bizning qoidalarimiz. Tekşirilmagan daʼvo (pasport, hujjat almaştiriş muddatlari) yozilmaydi.
- Dizayn «Non va çekiç» tizimida qoladi (`DESIGN.md`). Yangi sahifalar mavjud tokenlar va komponentlardan (`.btn`, `.check`, `.tabs`, `.panel`, `.sec-title`) yiğiladi.
- Statistika: har yangi imkoniyat `window.track(name, params)` bilan voqea yuboradi (§10).

## 3. Arxitektura (A qismi)

### 3.1. Papkalar

```
site/                     manba, deploy qilinmaydi
  build.mjs               generator: node site/build.mjs  (npm run build)
  layout.html             umumiy qobiq: <head>, header, til tanlagiç, footer
  pages/<nom>.html        yangi lotindagi sahifa manbalari (index, soz, ism, mashq, fayl, maqola/*, vidjet)
  ru/<nom>.html           şu sahifalarning ruscha manbasi (bir xil tuzilma)
  sozlar.txt              söz va ismlar röyxati (§5.1)
  lib/html.mjs            HTML matn tugunlarini ögiriş (teglarga tegmaydi)
web/                      deploy qilinadigan papka (hozirgidek)
  eski.js                 yangi lotin → eski lotin (kirill.js ning juftigi)
  i18n.js                 JS örnatadigan matnlar: ru luğati; eski/kr uçun avtomatik ögiriş
  index.html, eski/, kr/, ru/, soz/, ism/, mashq/, fayl/, maqola/, vidjet/   ← generator yasaydi
```

`web/` dagi qölda yozilgan JS va CSS fayllari (app.js, converter.js, styles.css va boşqalar) qölda qoladi. Generator faqat HTML va `sitemap.xml` ni yozadi. Yasalgan HTML fayllar boşida «generator yasagan, site/ ni tahrirlang» degan izoh turadi.

### 3.2. Generator

`site/build.mjs` (boğliqliksiz Node):
1. `site/pages/*.html` ni öqiydi. Har bir manba boşida kiçik meta blok: `title`, `description`, yöl (`/mashq/`).
2. Har sahifa uçun 4 ta fayl yozadi: `web/<yöl>index.html`, `web/eski/<yöl>`, `web/kr/<yöl>`, `web/ru/<yöl>`.
   - **eski**: manba matni `toOldLatin()` dan ötadi.
   - **kr**: manba matni `toCyrillic()` dan ötadi (mavjud `web/kirill.js`).
   - **ru**: `site/ru/<nom>.html` olinadi. Ruscha manba yöq bölsa, build xato beradi (sahifa yarim tarjima bölib qolmasin).
3. Ögiriş faqat matn tugunlariga va `title`, `alt`, `placeholder`, `aria-label`, `content` (meta description) atributlariga tegadi. `code, kbd, pre, script, style, textarea, input, [data-lotin], [lang="en"], [lang="ru"]` içiga kirilmaydi — `kirill.js` dagi `EXCLUDE` bilan bir xil röyxat, bitta joydan import qilinadi.
4. JSON-LD içidagi matnlar ham ögiriladi (FAQPage savollari sahifadagi `<details>` bilan bir xil qolişi kerak — mavjud `seo.test.mjs` qoidasi).
5. Har sahifaga `<link rel="canonical">`, `hreflang` havolalar va `<html lang>` qöyiladi (§3.4).
6. Söz sahifalarini `sozlar.txt` dan yasaydi (§5).
7. `web/sitemap.xml` ni hamma sahifadan qayta yozadi.

Build ikki marta işlatilsa natija bayt-ba-bayt bir xil (sana `lastmod` faqat sahifa matni özgarganda yangilanadi — oldingi sitemapdan olinadi).

### 3.3. Eski lotin

`web/eski.js` → `toOldLatin(text)`: ö→oʻ, ğ→gʻ, ş→sh, ç→ch, katta harflar va BUTUN KATTA sözlar hisobga olinadi (Ş→Sh, ŞAHAR→SHAHAR). Tutuq ʼ özgarmaydi, sʼh özgarmaydi. Nom va brendlar (`KEEP` röyxati, masalan Yozgiç) özgarmaydi. Havola va emaillar himoyalangan (`kirill.js` dagi `PROTECTED`). Apostrof: rasmiy ʻ (U+02BB). Konvertor bilan aylanma test: `convert(toOldLatin(x)) === x` söz röyxatidagi hamma söz uçun.

### 3.4. Tillar, URL va til tanlagiç

| Versiya | Prefiks | `<html lang>` | hreflang |
|---|---|---|---|
| Yangi lotin | `/` | `uz` | `uz`, `x-default` |
| Eski lotin | `/eski/` | `uz` | yöq (bir xil til kodi; Google matndan ajratadi), öz canonicali bor |
| Kirill | `/kr/` | `uz-Cyrl` | `uz-Cyrl` |
| Rus | `/ru/` | `ru` | `ru` |

Headerdagi mavjud «Кирилл» tugmasi örniga til tanlagiç: `Yangi · Eski · Кирилл · Рус` — oddiy havolalar, joriy sahifaning boşqa tildagi juftiga olib boradi (hash saqlanadi). Telefonda ixçam: joriy til nomi + oçiladigan röyxat. Tanlov `localStorage` da eslanadi, lekin avtomatik qayta yönaltiriş **yöq** (qidiruvdan kelgan odam öz tilidagi sahifada qolsin).

Hozirgi «Kirillda öqiş» rejimi (sahifani joyida ögiriş) olib taşlanadi — uning örnini `/kr/` sahifalar bosadi.

### 3.5. JS matnlari

JS örnatadigan matnlar (konverter izohlari, söz tekşiruvi, test savollari, «Işladimi?» xabarlari, maşq, fayl) `web/i18n.js` orqali çiqadi:
- `t(key)` — joriy til `document.documentElement.dataset.til` dan (`yangi | eski | kr | ru`).
- yangi: matnning özi. eski va kr: yangi matn `toOldLatin` / `toCyrillic` dan ötadi (alohida luğat kerak emas).
- ru: `i18n.js` dagi ruscha luğat. Kalit topilmasa — yangi lotin matni çiqadi va testda xato.
- Test savollari (`test-savollar.js`) ruscha varianti bilan.

Konvertorning özi har tilda bir xil işlaydi (natija doim yangi alifbo).

### 3.6. Navigatsiya

Header: logo, `Konverter · Fayl · Maşq · Sözlar · Maqolalar`, til tanlagiç, asosçi. Bosh sahifadagi anker havolalar (Yuklab oliş, Qoidalar, Test, Savollar) bosh sahifada qoladi. Footer: hamma sahifalar va 4 til.

## 4. Bosh sahifa

Mazmuni özgarmaydi. `web/index.html` → `site/pages/index.html` ga köçadi (manba bölib qoladi), generator 4 versiyasini yasaydi. Mavjud SEO footer bloki (eski lotin + kirill xulosa) yangi lotin sahifada qoladi.

## 5. Söz va ism sahifalari (B qismi)

### 5.1. Röyxat

`site/sozlar.txt`: har qatorda eski lotindagi söz va turi, ~800 ta yozuv:
- `soz` — köp işlatiladigan sözlar (ö ğ ş ç yoki tutuq bor sözlar ustun);
- `ism-e`, `ism-a` — erkak va ayol ismlari (mashhurlari, özgarmaydiganlari ham);
- `joy` — viloyat, şahar, tuman nomlari.

Röyxatni Claude tuzadi, raqib saytdan köçirilmaydi. Takroriy yozuv va yangi alifboga ögirilgandan keyin bir xil slug bölib qoladigan juftlar build vaqtida xato beradi.

### 5.2. Sahifalar

- `/soz/` — harflar böyiça indeks (A–Z, Ö Ğ Ş Ç), qidiruv maydoni (röyxatdan filtrlaydi, röyxatda yöq söz yozilsa — konvertor natijasi va «bu söz qanday yoziladi» izohi).
- `/soz/<slug>/` — bitta söz: eski lotin → yangi lotin, kirill, qaysi qoida işlagani (`soz.js` dagi `explain`), qisqa misol gap yöq (tuqib çiqarmaymiz), «yaqin sözlar» (bir harfdan boşlanadigan 6 ta), konvertorga havola. Ism bölsa — «Ism kartasini yasang» tugmasi (`/ism/?n=…`).
- Slug: eski lotindan ASCII (`shahzod`, `ozbekiston`), URLda eski yozuv qidiruvga yordam beradi.
- Sarlavha: «Shahzod yangi alifboda: Şahzod» (har tilda öz şaklida; rusça «Шахзод на новом алфавите: Şahzod»).
- Hajmi: ~800 × 4 ≈ 3 200 sahifa, har biri ~4 KB → ~13 MB. GitHub Pages çegarasidan (1 GB) ancha past.

### 5.3. Ism kartasi

`/ism/`: ism yoziladi (yoki `?n=` dan keladi) → katta karta: yangi alifbodagi ism Doto şriftida, ostida eski yozuvi va qaysi harf özgargani. «Storyga qöyiş» — 1080×1920 PNG, test natijasi rasmi bilan bir uslubda (`story.js` dagi çizgiçlar umumiy funksiyaga ajratiladi). Ulaşiş: `navigator.share` fayl bilan, bölmasa yuklab oliş. Ism heç qayerga yuborilmaydi.

## 6. Tez yoziş maşqi (C qismi)

`/mashq/`:
- Rejimlar: Faqat ö, Faqat ğ, Faqat ş, Faqat ç, Aralaş, Gaplar. Matnlar Claude tuzgan söz va gaplardan (eski lotinda yozilib, build vaqtida yangi alifboga ögiriladi).
- Maqsad matn yangi alifboda körsatiladi. Foydalanuvçi istalgan usulda yozadi: Yozgiç yoqiq (o' yozadi → ö keladi), telefonda ozarbayjonça klaviatura yoki boşqa joylaşuv. Tekşiruv faqat maydondagi yakuniy matnga qaraydi, şuning uçun Yozgiçning «avval o', keyin ö» almaştirişi xato sanalmaydi: harf faqat keyingi harf yozilganda baholanadi.
- Natija: söz/daqiqa, aniqlik, qaysi harfda köp adaşgani. Eng yaxşi natija va maşq kunlari `localStorage` da.
- Tugagaç «Storyga qöyiş» (ism kartasi bilan bir xil çizgiç).
- Eski şakl yozilsa (o', sh) va ögirilmasa — «Yozgiç yoqilmagan körinadi» maslahati (`tekshir.js` dagi `checkTyping`).

## 7. Fayl konvertori (D qismi)

`/fayl/`:
- Fayl taşlanadi yoki tanlanadi, bir neçtasi ham. Yönaliş: avtomatik (eski lotin yoki kirill → yangi). Tutuq sozlamasi konvertordagidek.
- Matn fayllari (.txt, .md, .csv): butun matn `convert()` dan ötadi, kodlaş UTF-8 (BOM bölsa saqlanadi).
- Subtitrlar (.srt, .vtt): vaqt qatorlari va raqamlar tegilmaydi, faqat matn qatorlari.
- Word (.docx): ZIP brauzerning özida oçiladi (`DecompressionStream("deflate-raw")`, boğliqliksiz kiçik ZIP öqiş/yoziş moduli `web/zip.js`). `word/document.xml`, sarlavha, kolontitul, izoh va sinoskalar XMLʼida faqat `<w:t>` matnlari özgaradi. Bir abzats içidagi runlar birlaştirib ögiriladi (o va ' alohida runlarda bölsa ham ö böladi), natija runlarga asl çegaralari böyiça qaytariladi — uslublar, jadval, rasm, raqamlaş joyida qoladi.
- Natija: har fayl uçun «Yuklab oliş» (`<asl nom>-yangi.<kengaytma>`), qança harf özgargani. Bir neça fayl — har biri alohida tugma (ZIP qilib berilmaydi, YAGNI).
- Qöllanmaydigan format (.doc, .pdf, .xlsx) — tuşunarli xabar va konvertorga yöl.
- Fayl hajmi çegarasi: 20 MB (katta fayl brauzerni qotirmasin).

## 8. Maqolalar va vidjet (E qismi)

### 8.1. Maqolalar

`/maqola/` röyxat va 6 ta maqola (har biri 4 tilda), faqat tekşirilgan faktlar:
1. Yangi alifboda nima özgardi: 4 harf va tutuq belgisi
2. ЎРҚ-1184-son Qonun: qaçon imzolandi, qaçon kuçga kiradi
3. sʼh qoidasi: Isʼhoq, asʼhob, musʼhaf
4. Tutuq belgisi ʼ: qaysi belgi va qanday yoziladi (Mac, Windows, telefon)
5. Kirill matnni yangi alifboga ögiriş
6. Ismlar yangi alifboda (söz sahifalari va ism kartasiga yöl)

Har maqolada `Article` JSON-LD, naşr sanasi, «rasmiy imlo qoidalari hali eʼlon qilinmagan» eslatmasi.

### 8.2. Vidjet

`/vidjet/` sahifa va `web/vidjet.js`:
- Saytga qöyiş: matnni örab turgan elementga `data-yozgich` va bitta `<script src="https://yozgich.uz/vidjet.js" defer>`.
- Element ustida «Yangi alifboda» tugmasi; bosilsa element içidagi matn tugunlari yangi alifboga ögiriladi, qayta bosilsa asli qaytadi.
- Tarmoqqa çiqmaydi, kuki qöymaydi, tugma bosilmagunça sahifaga tegmaydi. `input`, `textarea`, `script`, `code` ga tegmaydi.
- `vidjet.js` bitta faylda: generator `converter.js` ni uning içiga qöşib yozadi (begona saytda modul importi va CORS muammosiz).
- Sozlamalar: `data-yozgich-label="Yangi alifboda|Eski yozuvda"`, `data-yozgich-button="bottom"`.
- Vidjet sahifasida jonli namuna va nusxa olinadigan kod.

## 9. Ruscha matn

Claude tarjima qiladi, egasi keyin körib çiqadi; push oldidan kutilmaydi. Terminlar: «новый алфавит», «старая латиница», «кириллица», «апостроф-тутук (ʼ)». Mahalliy nomlar (Yozgiç, ЎРҚ-1184) özgarmaydi.

## 10. Statistika voqealari

| Voqea | Qayerda | Parametr |
|---|---|---|
| `til_almashtirildi` | til tanlagiç | `til` |
| `soz_sahifa_qidiruv` | /soz/ qidiruv | — (bir marta) |
| `ism_karta` / `ism_story` | /ism/ | — |
| `mashq_boshlandi` / `mashq_tugadi` / `mashq_story` | /mashq/ | `rejim`, `wpm` (tugadi) |
| `fayl_ogirildi` | /fayl/ | `tur` (docx, srt…) |
| `fayl_xato` | /fayl/ | `sabab` |
| `vidjet_kod_nusxa` | /vidjet/ | — |

Hamma voqealarga joriy til avtomatik qöşiladi (`til`).

## 11. Testlar

Hammasi `node --test` (mavjud CI qadamida işlaydi):
- `eski.test.mjs`: harf, katta harf, KEEP, havola himoyasi; söz röyxati böyiça aylanma test.
- `site/lib/html.test.mjs`: matn ögiriladi, teglar, atributlar, `EXCLUDE` içi va JSON-LD töğri.
- `site/build.test.mjs`: build ikki marta — natija bir xil; sitemapdagi har URL uçun fayl bor; har sahifada canonical va hreflang mos; eski sahifalarda (EXCLUDE dan taşqarida) ö ğ ş ç qolmagan; ru sahifalarda `lang="ru"`; söz slugʼlari takrorlanmaydi.
- `i18n.test.mjs`: ruscha luğatda hamma kalit bor.
- `zip.test.mjs`, `fayl.test.mjs`: kiçik .docx namunasi (fixture) oçiladi, run çegarasidagi `o` + `'` → ö, qayta ZIP qilingan fayl öqiladi; srt vaqt qatorlari özgarmaydi.
- `mashq.test.mjs`: tezlik va aniqlik hisobi, Yozgiçning vaqtinça o' holati xato sanalmasligi.
- `vidjet.test.mjs`: bundle içida converter bor, eksport qolmagan.
- Mavjud `seo.test.mjs` hamma sahifalarga kengaytiriladi.

Brauzerda: har qism push oldidan lokal serverda tekşiriladi (4 til, telefon kengligi 375 px, konsolda xato yöq).

## 12. Xavflar

- **Söz röyxatidagi xato** (notöğri eski yozuv): röyxat qisqa izohli, aylanma test va slug tekşiruvi bilan; egasi körib çiqişi mumkin.
- **docx ning nostandart tuzilmasi** (masalan, maydonlar, `w:fldSimple`): faqat `w:t` ga tegamiz; ögirib bölmagan fayl uçun asl fayl özgarmaydi va xabar çiqadi.
- **Repo hajmi** (~13 MB yasalgan HTML): qabul qilinadi; kerak bölsa söz sahifalari keyin qisqartiriladi.
- **eski versiyaning hreflangsiz qolişi**: Google ularni dublikat deb hisoblamasligi uçun har birining öz canonicali bor va matni haqiqatan boşqa.

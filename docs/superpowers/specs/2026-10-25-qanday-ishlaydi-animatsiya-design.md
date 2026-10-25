# Redizayn 3-bosqiç: «qanday işlaydi» animatsiyasi (dizayn)

Sana: 2026-10-25 · Holat: egasi körib çiqişiga · Prototip: [Yozgiç animatsiyalari](https://claude.ai/artifact/C5kfwh1q8TU828RNhvZSCW) (egasi 2026-10-25 da «animatsiya maʼqul» dedi) · Bitta rejada 2-bosqiç bilan birga quriladi (`2026-10-25-alohida-sahifalar-design.md`)

## 1. Maqsad

Odamlar Yozgiçni «oddiy konverter» deb öylayapti. Egasi typecorrect.com dagi kabi jarayonni körsatadigan animatsiyani söradi: «1 ga 1 köçirsang ham böladi, faqat dizaynini özimnikiga mosla». Ikki qism:
1. **Hero sahnasi:** klaviatura tugmalari bosiladi, `o` + `'` bitta `ö` tugmasiga birlaşadi, ekranda `o'` örniga `ö` çiqadi, harf nonga tamğalanadi.
2. **Vaqt poygasi:** «Yozgiçsiz» (qidiriş, nusxalaş, qaytiş, qöyiş: 6,4 s) va «Yozgiç bilan» (0,4 s) yonma-yon, soniya hisoblagiçi bilan; ostida kuniga harf soni bilan tejalgan vaqt kalkulyatori.

Muvaffaqiyat mezoni:
- Boş sahifani oçgan odam birinçi ekrandayoq klaviatura bosilib, eski juftlik yangi harfga aylanişini köradi.
- Poyga bölimi ekranga kirganda özi boşlanadi, «Qaytadan körsatiş» bilan qayta yuradi.
- Harakatni kamaytiriş (`prefers-reduced-motion`) yoqilganda ikkalasi ham tayyor yakuniy holatda, harakatsiz turadi; JSʼsiz ham yakuniy holat körinadi.
- typecorrect kodi va rasmlari işlatilmaydi; ritm va tuzilma olinadi, körinişi DESIGN.md böyiça.

## 2. Hero sahnasi

### 2.1 Joylaşuv

Hero ikki ustunligiça qoladi. Çap: sarlavha, lede, yuklab oliş slabi (özgarmaydi). Öng ustun (hozirgi `.non` örni) endi **sahna**:

```
Siz yozasiz                       (13px 700 char-soft)
[ özbek|                    ]     ekran qatori: flour, 2px char, 64px, 26px 600
        ( non )                   hozirgi non va çekiç nuqtalari (glyphs.js), 220px
 [ö] [z] [b] [e] [k]              tugmalar: 52×56, flour, 2px char, past çiziq 5px
Yoqiş va öçiriş: [⇧][⇧] ikki marta
```

- Non saqlanadi va hozirgi nuqta animatsiyasi (eski juftlik nuqtalari yangi harfga köçadi) sahnaga boğlanadi: juftlik birlaşgan payt `showPair(pair, true)` çaqiriladi. Mustaqil `setInterval` aylanişi olib taşlanadi; konverterda yozilgan oxirgi yangi harfni qayta tamğalaş (`restamp`) qoladi va sahnani 6 soniyaga töxtatadi.
- **Telefon (`data-device="phone"`):** tartib «sarlavha → konverter → sahna → lede → slab» (hozirgi non örnida sahna). Tugmalar 46×50, non 150px. Sahna 860px dan torda ham bir ustun.

### 2.2 Ketma-ketlik

Sözlar (hammasi misol, hamma versiyada lotinda, `data-lotin`):

| Tugmalar | Birlaşadi | Natija |
|---|---|---|
| o ' z b e k | 0–1 → ö | özbek |
| c h o y | 0–1 → ç | çoy |
| t o g ' | 2–3 → ğ | toğ |
| s h a h a r | 0–1 → ş | şahar |

Har söz:
1. Tugmalar paydo böladi, ekran böş (500 ms).
2. Har tugma bosiladi: 3px pastga, past çiziq 2px (110 ms), keyingisigaça 200 ms. Ekran qatoriga harf qöşiladi, qizil kursor yonib-öçadi.
3. Juftlikning ikkinçi tugmasi bosilganda ekranda juftlik xira (`char-soft`, 8% fon) körinadi; 320 ms dan keyin: birinçi tugma crust fonli yangi harfga aylanadi, ikkinçisi kengligi 0 gaça yiğiladi (350 ms, `--ease`), ekranda juftlik örniga clay rangli, 800 qalinlikdagi nuqtali taqçiziqli yangi harf «pop» bilan çiqadi, non şu harfni tamğalaydi.
4. Söz tugagaç 1500 ms turadi, tugmalar 350 ms da söndi, keyingi söz.
5. Har ikkinçi sözdan keyin `⇧` `⇧` ikki marta bosiladi (har biri 300 ms, crust bilan yonadi).

### 2.3 Qoidalar

- Sahna `aria-hidden="true"`: bu bezak; maʼno lede va sarlavhada bor.
- Tugma va ekran harflari Onest 700/600 (ğ Dotoʼda yozilmaydi qoidasi saqlanadi). Nondagi harf çekiç nuqtalari (glyphs.js).
- Sahifa yaşirin bölsa (`document.hidden`) aylaniş töxtaydi va qaytganda davom etadi.
- Reduced motion yoki JS yöq: birinçi sözning yakuniy holati (`özbek`, birlaşgan `ö` tugmasi, nonda ö) markupning özida yozilgan.

## 3. Vaqt poygasi

### 3.1 Joylaşuv

Boş sahifada konverterdan keyin, «Yana foydali» kartalaridan oldin, `section#vaqt`:

- `h2` (Doto, markazda): «Qölda 6 soniya, Yozgiç bilan bir zumda».
- Lede (markazda, 58ch): «Yozgiçsiz ö ni topiş uçun uni qidirasiz, nusxalaysiz va qaytib qöyasiz. Yozgiç bilan odatdagidek o' yozasiz, qolganini u qiladi.»
- Poyga kartasi (`--flour-deep`, max 880px, 32px; telefonda 18px), ikki yöl:
  - **«Yozgiçsiz»**: öngda clay Doto soat «6,4 s»; maydon (flour, 2px char, «ABC» tegi); bosqiç çiplari «Qidiriş», «Nusxalaş», «Qaytiş», «Qöyiş»; çiziq crust → clay.
  - **«Yozgiç bilan»**: char Doto soat «0,4 s»; maydon («ö» tegi); çiplar «o», «'», crust «ö Tayyor»; char çiziq.
  - Öq: 0 s, 2, 4, 6, 8 s.
  - Natija qatori: «Har bir harfda 6 soniya tejaysiz» va «Qaytadan körsatiş» tugmasi.
- Kalkulyator: «Kuniga neçta yangi harf yozasiz?» surgiç 10–200, qadam 10, boşida 40; uçta qora karta: «N daq / haftasiga tejaladi», «N soat / yiliga tejaladi», «N / marta qidirmaysiz» (minglar böşliq bilan). Telefonda kartalar uç ustunli qator.
- Izoh (13px): «Taxmin: harfni qölda topib qöyiş taxminan 6 soniya, Yozgiç bilan 0,4 soniya.»

### 3.2 Vaqt çizigi (real vaqt, soniya)

| t | Yozgiçsiz | Yozgiç bilan |
|---|---|---|
| 0–0,25 | maydon böş | — |
| 0,12–0,26 | — | «Ko», «o» çipi yonadi |
| 0,26–0,4 | — | «Ko'», «'» çipi yonadi |
| 0,4 | — | «Kö», «ö Tayyor» çiqadi, soat töxtaydi |
| 0,25–6,4 | «K» | — |
| 0,5–2,3 | «Qidiriş» yonadi, maydonda «ö harfi» qidiruv belgisi | |
| 2,3–3,6 | «Nusxalaş» | |
| 3,6–4,8 | «Qaytiş» | |
| 4,8–6,4 | «Qöyiş» | |
| 6,4 | «Kö», soat töxtaydi, natija qatori çiqadi | |

Çiziq kengligi = t / 8. Soat vergul bilan: `6,4 s` (Doto nuqtani plyus kabi çizadi; özbekça ham vergul).

### 3.3 Qoidalar

- Boşlaniş: bölim 40% körinsa, bir marta. «Qaytadan körsatiş» istalgan payt boşidan.
- Markupda yakuniy holat yozilgan (JSʼsiz va reduced motion uçun); JS boşlanganda nolga qaytaradi.
- Soatlar va maydonlar `data-lotin` (raqam va misol, kirillga ögirilmaydi). Kirill va rus versiyalarida sarlavha Onest 800 ga ötadi (mavjud qoida röyxatiga `.vaqt-title` qöşiladi).
- Statistika: `vaqt_korsatildi` (birinçi boşlaniş), `vaqt_qayta` (tugma), `vaqt_hisob` (surgiç birinçi marta özgarganda, `{harf: N}`). Bölimga yetiş sanoği röyxatiga `vaqt` qöşiladi.

## 4. Kod tuzilmasi

| Fayl | Masʼuliyati |
|---|---|
| `web/sahna.js` (yangi) | Sözlar jadvali va sof funksiya `wordSteps(word)` → qadamlar röyxati (`press`, `old`, `merge`, `hold`); DOM bilan işlaydigan `mountSahna(root, { onMerge })` |
| `web/vaqt.js` (yangi) | Sof funksiyalar `raceAt(t)` → ikki yöl holati (soat matni, faol çip, maydon matni, çiziq ulişi, tayyor) va `savings(n)` → `{ week, year, count }`; DOM bilan `mountVaqt(root, track)` |
| `web/app.js` | sahnani nonga ulaydi (`onMerge` → `showPair`), mustaqil non aylanişini olib taşlaydi, `mountVaqt` |
| `site/pages/index.html`, `site/ru/index.html` | sahna va `#vaqt` bölimi markupi (yakuniy holat bilan) |
| `web/styles.css` | sahna, tugmalar, poyga, kalkulyator; reduced motion |
| `web/i18n-ru.js` | JS yozadigan yangi satrlar bölsa (birliklar markupda turadi, JS faqat raqam yozadi) |

## 5. Tekşiruv

- **Testlar (avval yiqiladigan):** `web/sahna.test.mjs`: `o'zbek` sözi uçun qadamlar tartibi (6 bosiş, 1-bosişdan keyin `old` "o'", keyin `merge` 0→ö, yakuniy ekran matni `özbek`); `tog'` uçun birlaşiş 2–3. `web/vaqt.test.mjs`: `raceAt(0)` ikkala soat `0,0 s`; `raceAt(0.3)` Yozgiç «Ko'»; `raceAt(1)` Yozgiç tayyor, Yozgiçsiz «Qidiriş»; `raceAt(7)` ikkalasi töxtagan (`6,4 s`, `0,4 s`), natija körinadi; `savings(40)` → `{ week: 28, year: 24, count: 14600 }`. `site/build.test.mjs`: boş sahifada `#vaqt` va sahna markupi, yakuniy holat matnlari bilan.
- **Brauzer:** 375 va 1280 px; sahna kamida bitta tölik aylaniş (4 söz), non tamğalaşi; poyga boşidan oxirigaça va qayta; surgiç; reduced motion emulyatsiyasida harakatsiz yakuniy holat; gorizontal aylantiriş yöq; `/kr/` va `/ru/` da bölim matnlari.
- **Imlo:** yangi satrlar konverterdan ötkaziladi.

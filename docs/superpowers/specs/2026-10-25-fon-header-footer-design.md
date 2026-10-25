# Redizayn 1-bosqiç: fon, header, til tanlagiç, footer (dizayn)

Sana: 2026-10-25 · Holat: egasi körib çiqişiga · Maket: [Yozgiç fon variantlari](https://claude.ai/artifact/PYVRoRErUgynBsWBnZoN2S), «E — B va D birga» va «Header, til tanlaş, telefon menyusi»

## 1. Maqsad

Egasi 2026-10-25 kuni saytni typecorrect.com qulayliklari asosida, milliy stilda qadamma-qadam qayta qurişni söradi. Iş törtta bosqiçga bölindi:

| Bosqiç | Nima | Holat |
|---|---|---|
| **1** | Fon, header, til tanlagiç, footer: hamma sahifaga tegadigan qobiq | **şu hujjat** |
| 2 | Bölimlarni alohida sahifaga ajratiş: `/telefon/` (usullar yopiq röyxat), `/qoidalar/`, `/test/` (kiriş ekrani bilan) | keyingi spec |
| 3 | Boş sahifa: jarayonni tuşuntiradigan hero animatsiyasi, vaqt taqqoslaş animatsiyasi, alohida «Sinab köring» kartasi | keyingi spec |
| 4 | Qolgan sahifalarni yangi stilga keltiriş, yakuniy tekşiruv | keyingi spec |

Egasining şikoyatlari (1-bosqiçga tegişlilari):
- Footer xunuk: bloklar har xil çegaradan boşlanadi (sarlavha va matn içkarida, havolalar çap çetda).
- Til tanlaş uzun va xunuk: törtta alohida tugma. Bitta tugma bölsin; Framerʼdagi «Til tanlash» komponenti (Flagly) andoza.
- Nuqtali fon közni xiralaştiradimi? Milliylikni saqlagan holda nima qilsa böladi?
- Header typecorrect.comʼga öxşab ixçam bölsin, lekin közköronaga köçirilmasin.

Egasi tanlovi: maketdagi **E**: B ning oç foni va D ning qahrabo hero lentasi birga.

Muvaffaqiyat mezoni:
- Hamma sahifa (4 versiyada) oç un fonida, nuqta töri yöq; qahrabo faqat yuqoridagi lentada va urğu elementlarida.
- Headerda bitta til tugmasi; bir bosişda 4 yozuvdan biriga ötiladi, sahifadagi joy (`?n=`, `#…`) saqlanadi.
- Telefonda header bir qatorga sığadi: logo, til tugmasi, menyu tugmasi.
- Footer bir tizimli ustunlarda, hamma blok bir çegaradan boşlanadi.
- JavaScriptʼsiz ham til röyxati va menyu oçiladi (native `<details>`).

**Kirmaydi:** sahifalarni ajratiş, hero animatsiyasi, test va telefon bölimlarining özi (2–3-bosqiç); story rasmlari ranglari (`web/kanvas.js`); analitika.

## 2. Özgarmas tamoyillar

- Manba matn yangi alifboda (ö ğ ş ç, tutuq ʼ U+02BC). Eski lotin va kirill versiyalar avtomatik yasaladi; rus partiallari alohida, qölda.
- `web/**/index.html` qölda tahrirlanmaydi: manba `site/`, keyin `npm run build`, yasalgan fayllar ham commit qilinadi.
- SEO qöriqlari saqlanadi: canonical, hreflang, Yandex/Google tasdiq teglari, footerdagi eski lotin va kirill matn (`web/test/seo.test.mjs`), footerdagi 4 versiya havolalari.
- Non va çekiç ğoyasi qoladi: logo, nondagi muhr halqalari, Doto sarlavhalar, nuqtali bölgiçlar.
- DESIGN.md dagi qolgan qoidalar özgarmaydi: 3px burçak, soyasiz, Doto nuqta bilan tugamaydi, ğ Dotoʼda yozilmaydi, kirillda Doto örniga Onest 800.

## 3. Fon va ranglar

### 3.1 Yangi yer

| Joy | Oldin | Endi |
|---|---|---|
| `body` | qahrabo `--crust` + 12px nuqta töri | un `--flour` (#fbf6ec), töri yöq |
| Yuqori lenta | yöq | qahrabo `--crust` + juda yengil töri (1.4px, 9% char), faqat lenta içida |
| Işçi maydonlar (konverter paneli, test kartasi va h.k.) | `--flour` | yangi `--flour-deep` (#f4e8d2); kiritiş maydonlari `--flour` + 2px char çiziq |
| Footer | `--flour` lenta | `--char` (#17110d), matn `--slab-ink`, sarlavha `--flour` |

Yangi token: `--flour-deep: #f4e8d2`. `--crust`, `--char`, `--clay` va boşqalar özgarmaydi.

Kontrast (tekşirilgan hisob, qurilganda qayta ölçanadi): char #17110d un ustida ~17:1, char-soft #3d220c un ustida ~12:1, clay #9c3b22 un ustida 6.4:1, slab-ink #e9d6b4 char ustida ~13:1, crust #cf8a33 char ustida ~6.6:1 (footer tugmasi va havola urğusi).

### 3.2 Lenta qayerda

- **Boş sahifa:** lenta header va `.hero` ni (sarlavha, non, yuklab oliş slabi) öz içiga oladi. Konverter va undan keyingi hamma narsa un fonida.
- **Içki sahifalar** (`/fayl/`, `/mashq/`, `/soz/…`, `/maqola/…`, `/ism/`, `/vidjet/`): lenta faqat headerni öraydi.
- Lenta markupni köçirmasdan yasaladi: header uçun `.bar` ga fon; boş sahifada `.hero` ga ekran kengligidagi fon `::before` psevdo-element orqali (`inset: 0 calc(50% - 50vw)`, `z-index: -1`), `body` da `overflow-x: clip`. Şunda `app.js` boğlangan IDʼlar va DOM tartibi özgarmaydi.
- `meta theme-color` `#cf8a33` bölib qoladi (sahifa tepasi qahrabo).

### 3.3 Nuqtalar qayerda qoladi

- Doto sarlavhalar, logo, non, qadam raqamlari, konverter strelkasi — özgarmaydi.
- Nuqtali bölgiç qatorlar (qoidalar jadvali, FAQ) un ustida qoladi. Ular endi tana töriga moslanmaydi: çekiç töriga faza moslaydigan skript va «Çekiç Grid Rule» olib taşlanadi, qator öz elementining çetidan boşlanadi.
- Lentadagi yengil töri — butun saytda yagona nuqtali fon.

### 3.4 Qahrabo ustidagi elementlar

Lenta içida asosiy tugmalar qora (`--char` + `--flour` matn), çunki qahrabo tugma qahrabo ustida körinmaydi. Un ustida asosiy tugma qahrabo (`--crust` + char matn) yoki qora — joyiga qarab: «Yuklab oliş» va konverterdagi «Nusxa oliş» qora qoladi.

## 4. Header

### 4.1 Tuzilma (desktop, ≥ 1024px)

```
[logo yozgiç]   Konverter  Fayl  Maşq  Sözlar  Maqolalar        [ö Yangi ▾]  [Yuklab oliş]
```

- Logo: hozirgi belgi + Doto «yozgiç».
- Havolalar: 1-bosqiçda hozirgi beştasi; 2-bosqiçda «Telefonda» va «Qoidalar» qöşiladi (röyxat şu bosqiçda tanlanadi). Joriy sahifa havolasi `aria-current="page"` va 3px nuqtali taqçiziq bilan belgilanadi.
- Til tugmasi (4.3).
- «Yuklab oliş»: qora tugma, `/#yuklab-olish` ga olib boradi. Boş sahifada telefonda körinmaydi.
- **Asosçi tugmasi headerdan olinadi** va footerdagi «Asosçi» ustuniga köçadi (rasm, ism, `/#asoschi` havolasi). `app.js` dagi `asoschi_menyu` voqeasi footer havolasiga ötkaziladi.

### 4.2 Telefon va tor ekran (< 1024px)

```
[logo yozgiç]                          [ö ▾]  [⋮⋮]
```

- Havolalar va «Yuklab oliş» yaşiriladi, örniga menyu tugmasi (6 nuqtali belgi, 44×44, qora).
- Menyu oçilganda header ostida un rangli panel: barcha bölimlar katta qatorlarda (min 50px, 18px 700), qatorlar orasida 1px 12% char çiziq; pastda butun kenglikdagi qahrabo «Kompyuterga yuklab oliş» tugmasi. Oçiq holatda tugma belgisi ✕ ga almaşadi, `aria-label` «Menyuni yopiş».
- Menyu bölimlari 1-bosqiçda: Konverter, Faylni ögiriş, Tez yoziş maşqi, Sözlar, Ism kartasi, Maqolalar, Saytingiz uçun vidjet.
- Hozirgi `.site-menu` va `.tillar-m` `<details>` lari şu yangi menyuga birlaşadi (bitta `.site-menu`, bitta `.til`).
- 640px dan tor ekranda til tugmasi faqat belgi va strelkani körsatadi; nomi `aria-label` da.

### 4.3 Til tanlagiç

Framerʼdagi «Til tanlash» (Flagly) andozasi, oddiy HTML + kiçik JS ga köçiriladi. Bayroq örniga yozuv belgisi, çunki 3 ta versiya özbekça.

**Tugma (yopiq):** 2px char çiziqli, 44px baland: belgi kvadrati (22px, char fon, crust harf) + qisqa nom + strelka. Oçiq holatda tugma qora, strelka tepaga.

| Versiya | Belgi | Qisqa nom (tugmada) | Röyxatdagi nom | Izoh qatori |
|---|---|---|---|---|
| yangi | ö | Yangi | Yangi alifbo | ö ğ ş ç |
| eski | o' | Eski | Eski lotin | o' g' sh ch |
| kr | Ў | Кирилл | Кирилл | Кирилл ёзуви |
| ru | Я | Рус | Русский | Сайт на русском |

**Röyxat:** 290px (telefonda header kengligi minus 24px), un fon, 2px char çiziq, 3px burçak, 6px içki joy. Har qator ≥ 52px: belgi kvadrati (30px; tanlangani char fon + crust harf, qolgani 2px char çiziq) + nom (700 15px) + izoh (13px char-soft); tanlangan qator `--flour-deep` fonda va öngda ✓.

**Xatti-harakat:**
- Markup: `<details class="til">` + `<summary>` (tugma) + içida 4 ta `<a>` havola. JSʼsiz ham oçiladi va havolalar işlaydi.
- `sahifa.js`: Escape yopadi va fokusni tugmaga qaytaradi; taşqariga bosiş yopadi; havolaga bosilganda `placeIn()` bilan `?n=` va `#…` saqlanadi, `localStorage` ga yoziladi, `til_almashtirildi` voqeasi yuboriladi (hozirgi mantiq). Bir vaqtda faqat bitta `<details>` oçiq turadi (til yoki menyu).
- Joriy versiya havolasida `aria-current="page"`; generator buni hozirgidek `{{current:…}}` bilan qöyadi.
- Nomlar avtomatik ögirilmasligi kerak: lotin nomlar va izohlar `data-lotin` / `⟦…⟧` bilan belgilanadi (masalan, `/kr/` da ham «Yangi alifbo», «o' g' sh ch» özgarmaydi).
- Generator: `NOMI` jadvali belgi va qisqa nom uçun kengayadi (`{{tilbelgi}}`, `{{tilnomi}}`).
- Rus partiali (`site/ru/partials/header.html`) bir xil tuzilmada, rusça yorliqlar: «Скачать», «Меню», «Закрыть меню», «Разделы».

## 5. Footer

Qora (`--char`) blok, ekran kengligida. Içi 1180px ustunda, hamma blok bir çegaradan boşlanadi.

```
Bepul,                 Bölimlar           Yana                  Asosçi
hamma uçun             Konverter          Ism kartasi           (rasm) Behruz Baxodirov
Yozgiç bepul ...       Faylni ögiriş      Maqolalar                    Aloqa uçun yozing
[Qöllab-quvvatlaş]     Telefonda yoziş*   Saytingiz uçun vidjet
                       Maşq               Instagram
                       Sözlar             Telegram kanal
─────────────────────────────────────────────────────────────────────────────
Yangi alifbo · Eski lotin · Кирилл · Русский        © 2026 Yozgiç · Davlat loyihasi emas
Eski yozuvda: ...  (kiçik, xira)
Kirillda: ...      (kiçik, xira)
```

\* «Telefonda yoziş» va «Qoidalar» havolalari 2-bosqiçda qöşiladi; 1-bosqiçda hozirgi bölimlar.

- Desktop: `1.4fr 1fr 1fr 1fr` panjara, 40px oraliq, 64px tepa / 40px past joy.
- Telefon: bitta ustun, 32px oraliq; «Bölimlar» va «Yana» ikki ustunda yonma-yon (sığsa).
- «Bepul, hamma uçun»: Doto 900, desktop 56px, telefon 40px, `--flour`. Vergul qoladi, nuqta yöq.
- Ustun sarlavhalari: 13px 700 `--slab-ink`. Havolalar: 15px `--flour`, hover — taqçiziq.
- «Qöllab-quvvatlaş»: qahrabo tugma (crust + char matn), 48px, Taps havolasi özgarmaydi.
- Asosçi: 44px yumaloq rasm (`/img/asoschi.webp`), ism 700 15px, «Aloqa uçun yozing» 13px; havola `/#asoschi`.
- Pastki qator: 1px 20% slab-ink çiziq ustida; 4 versiya havolalari (`.close-tillar`, `sahifa.js` hozirgidek joyni saqlaydi), © va «Davlat loyihasi emas».
- `.close-alt` (eski lotin va kirill SEO matni) saqlanadi, 13px, `--slab-ink` 70%: körinadigan matn bölib qoladi.
- Fokus halqasi footerda crust rangida.

## 6. Kirill va rus versiyalari

- `html[data-yozuv="kirill"]` va `lang="ru"` da Doto sarlavhalar Onest 800 ga ötadi (hozirgi qoida); yangi footer statement (`.close-big`) va lenta içidagi sarlavhalar şu röyxatda qoladi.
- Rus headeri va footeri qölda, bir xil tuzilma. Röyxatdagi 4 versiya nomlari hamma versiyada bir xil yoziladi (4.3 jadval).

## 7. Tekşiruv

- **Testlar (avval yiqiladigan test):** `site/build.test.mjs` ga: har yasalgan sahifada bitta `details.til` va unda 4 ta havola (4 versiyaga, joriysida `aria-current`); headerda `.nav-founder` va `.tillar` yöq; footerda `.close-alt` va 4 versiya havolasi bor; `/kr/` sahifada «Yangi alifbo» va «o' g' sh ch» lotinça qolgan. `npm test` hammasi ötadi, `npm run build` dan keyin `git status` toza.
- **Imlo:** sahifa matnidagi yangi satrlar mahsulot konverteridan ötkaziladi; özgargan har söz röyxatda «tuzatildi» yoki «ataylab» deb belgilanadi.
- **Şrift:** ö ğ ş ç ʼ Onest va Dotoʼda render qilinib körib çiqiladi; `document.fonts` holati `loaded`.
- **Brauzer:** 375px va 1280px kenglikda boş sahifa, `/fayl/`, `/soz/` va `/ru/`; til röyxati va menyu oçiq/yopiq; klaviatura (Tab, Enter, Escape); JSʼsiz oçiliş. iPhone WebKitʼda fokus halqasi va lenta tekşiriladi.
- **Kontrast:** 3.1 dagi juftliklar qayta ölçanadi; 4.5:1 dan past matn yöq.
- Testlar ötgaç va ikki kenglikda tekşirilgaç `main` ga push (`push-deploy-without-asking`), deploydan keyin jonli saytda tekşiriladi.

## 8. Egasi hal qiladigan masala

`codex/current-design-polish` branchida Codexʼning commit qilinmagan işi bor (2026-10-24): DESIGN.md dagi tugma öyçamlari, headerga `.site-menu` qöşiş, boş sahifada `install-details`, `ASSET_V` 27 va ~3300 ta yasalgan HTML. 1-bosqiç header va DESIGN.md ning aynan şu joylariga tegadi. Ikki yöl:

1. **Tavsiya:** Codex işini avval testdan ötkazib commit qilamiz, 1-bosqiçni uning ustiga quramiz (uning menyusi va tugma qoidalari şu spec bilan birlaşadi).
2. Codex işini çetga qöyib (`git stash`), 1-bosqiçni `main` dan boşlaymiz.

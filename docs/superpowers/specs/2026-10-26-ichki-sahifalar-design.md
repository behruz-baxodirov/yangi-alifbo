# Redizayn 4-bosqiç: içki sahifalar yangi stilda (dizayn)

Sana: 2026-10-26 · Holat: egasi körib çiqişiga · Maket: [Yozgiç 4-bosqiç sahifalar](https://claude.ai/artifact/M2HRVAQ152A4KLUR3WaZPA) (egasi 2026-10-26 da «A variant va maketlar maʼqul» dedi) · Oldingi bosqiçlar: `2026-10-25-fon-header-footer-design.md`, `2026-10-25-alohida-sahifalar-design.md`, `2026-10-25-qanday-ishlaydi-animatsiya-design.md` (hammasi jonli)

## 1. Maqsad

Jonli saytdagi oltita sahifani (fayl, maşq, sözlar, maqolalar, ism, vidjet) körib çiqiş natijasi, hammasiga umumiy uç muammo:
1. Sarlavha qahrabo lentaga yopişib turadi, sahifa boşi ajralmaydi.
2. Desktopda kontent çapda tor ustunda, öng yarmi böş.
3. Sarlavhalar har xil: biri Doto, biri Onest 800; sahifa boşi tuzilmasi har sahifada boşqa.

Egasi tanlovi: **A**. Har içki sahifada sarlavha va qisqa izoh qahrabo lenta içida, header bilan birga (boş sahifadagi hero bilan bir xil til).

Muvaffaqiyat mezoni:
- Har içki sahifa bir xil sahifa boşi bilan oçiladi: lenta içida (kerak bölsa) orqaga havola, sarlavha, izoh.
- 1280px da kontent ikki ustunda yoki törda, böş yarim ekran qolmaydi.
- 375px da hammasi bir ustun, gorizontal aylantiriş yöq.
- Tört versiyada (`/`, `/eski/`, `/kr/`, `/ru/`) bir xil.

**Kirmaydi:** sahifalar mantiği (konverter, fayl ögiriş, maşq hisobi, story rasmi) özgarmaydi; yangi funksiya qöşilmaydi, istisno: ism sahifasidagi «Rasmni saqlaş» tugmasi (3.5). Boş sahifa va `/test/` kiriş ekrani özgarmaydi.

## 2. Umumiy sahifa boşi

### 2.1 Markup

Har içki sahifa manbasi `<main>` içida şu blok bilan boşlanadi:

```html
<div class="page-head">
  <a class="page-crumb" href="/maqola/">← Maqolalar</a>   <!-- faqat içki-içki sahifalarda -->
  <h1 class="page-title">Fayllarni ögiriş</h1>
  <p class="page-lede">…</p>
  <!-- ixtiyoriy: sahifaga xos element (masalan, sözlar qidiruvi) -->
</div>
```

- Blok `site/pages/<sahifa>/index.html` (va rus egizagi) boşiga köçadi; hozirgi `h1.sec-title` / `h1.soz-h1` va `p.soz-lede` / `p.maqola-meta` şu blokka ötadi.
- Söz sahifalari (`site/lib/sozlar.mjs` yasaydi) va maqola sahifalari ham şu blokdan foydalanadi: `soz-crumb` → `page-crumb`, `soz-h1` → `page-title page-title--text`.

### 2.2 Körinişi

- Lenta: header lentasi bilan uzluksiz (oraliq yöq), `::before` bilan ekran kengligida, 1-bosqiçdagi `.bar` va `.hero` usuli.
- Içki joy: desktop 28px tepa / 48px past, telefon 20px / 32px; kenglik 1180px ustun.
- `page-crumb`: 14px 700, taqçiziqli, strelka bilan; lenta ustida char rangda.
- `page-title`: Doto 900, 46px (telefon 32px), max 22ch, balanslangan qator. Uzun matnli sarlavhalar (söz va maqola sahifalari: ikki nuqta va ğ bölişi mumkin) — `page-title--text`: Onest 800, 42px (telefon 30px). Kirill va rus versiyada hammasi Onest 800 (mavjud qoida röyxatiga `.page-title` qöşiladi).
- `page-lede`: 19px (telefon 17px), max 60ch, char-soft.
- Maqola sahifasida sana va muallif qatori (`maqola-meta`) lede örnida.
- Lentadan keyingi kontent 40px pastdan boşlanadi (telefon 24px).

### 2.3 Qaysi sahifalar

| Sahifa | Sarlavha uslubi | Crumb |
|---|---|---|
| `/fayl/`, `/mashq/`, `/soz/`, `/maqola/`, `/ism/`, `/vidjet/` | Doto | yöq |
| `/telefon/`, `/qoidalar/` | Doto (hozirgi `h1` blokka köçadi) | yöq |
| `/soz/<söz>/` | Onest 800 | «← Sözlar» |
| `/maqola/<maqola>/` | Onest 800 | «← Maqolalar» |
| `/test/` | özgarmaydi (kiriş kartasi öz sarlavhasi) | — |

## 3. Sahifalar

Hammasi maket böyiça; matnlar hozirgi manbadan köçadi.

### 3.1 `/fayl/`
- Ikki ustun `1.4fr 1fr` (860px dan torda bir ustun).
- Çap: taşlaş maydoni 320px (telefon 240px), `--flour-deep`, 2px uzuq char çiziq; fayl belgisi (crust nuqtali hujjat), «Faylni şu yerga taşlang» 22px, «yoki bosib tanlang · 20 MB gaça», format çiplari (.docx .txt .md .csv .srt .vtt, `data-lotin`). Ostida «Tutuq belgisi ʼ» belgilagiçi. Natija röyxati (mavjud `fayl-item`lar) şu ustunda.
- Öng: qora karta «Word hujjat bilan nima böladi» (hozirgi matn uç bandga bölinadi), ostida «Qisqa matnmi? Konverterga joylang» havola kartasi (`/#konverter`).

### 3.2 `/mashq/`
- Ikki ustun `1.6fr 1fr`.
- Çap: rejim tugmalari 2px char ramkada segment (tanlangani char), maşq kartasi `--flour-deep` (matn qatori, kiritiş maydoni, izoh), natija bloki (mavjud) şu ustunda.
- Öng: ikki qora karta — oxirgi natija tezligi «N söz/daqiqa» va aniqligi «N%» (`summary()` dan; maşq qilinmagan bölsa «—»); ostida `--flour-deep` karta «Eng yaxşi natija: N söz/daqiqa» va oxirgi 7 kunlik maşq nuqtalari (`readPractice` dagi kunlar; maşq qilingan kun crust). Izoh: «Natijalar faqat sizning brauzeringizda saqlanadi.»
- Raqamlar maşq tugaganda yangilanadi (yozayotganda jonli emas).

### 3.3 `/soz/` va `/soz/<söz>/`
- Indeks: qidiruv maydoni sahifa boşi içiga köçadi (lenta içida, 56px, max 560px).
- Harflar qatori lentadan keyin, skrollda tepaga yopişadi (`position: sticky`), joriy harf char fonda.
- Har harf guruhi: çapda katta Doto harf (ğ uçun Onest 800, «Ğ Dotoʼda yozilmaydi» qoidasi) va «N ta», öngda törga terilgan havolalar «eski → yangi» (eski char-soft, yangi 700); 1024px dan keng 3 ustun, 640–1023 2 ustun, telefonda 1.
- Söz sahifasi: sahifa boşi (crumb «← Sözlar», Onest sarlavha), qolgani hozirgidek.

### 3.4 `/maqola/` va maqola sahifalari
- Indeks: kartalar töri, 3 ustun (telefonda 1). Birinçi maqola «Yangi alifboda nima özgardi» 2 ustunli qora karta; qolganlari `--flour-deep`. Har kartada mavzu tegi, sarlavha, bir qator izoh, «Öqiş →».
- Teglar: Boşlaş uçun (nima-ozgardi), Qonun (qonun), Qoida (sh-qoidasi, tutuq), Yöriqnoma (kirilldan), Ismlar (ismlar).
- Maqola sahifasi: sahifa boşi (crumb, Onest sarlavha, sana va muallif), matn ustuni max 68ch, 18px / 1.65.

### 3.5 `/ism/`
- Ikki ustun `1fr 1fr`.
- Çap: «Ismingiz» maydoni `--flour-deep` kartada, ostida eski yozuv va kirilda körinişi hamda özgargan harflar (mavjud `ism-eski`, `ism-juft`), «Boşqa sözlar» havolalari.
- Öng: story kartasining jonli HTML körinişi (9:16, crust nuqtali fon, «yozgiç», «Ismim yangi alifboda», nonda ism Onest 800, «Siz ham sinab köring: yozgich.uz»), ism yozilişi bilan yangilanadi. Ostida «Storyga qöyiş» (mavjud) va yangi «Rasmni saqlaş» (story PNG faylini yuklab beradi, `test.js` dagi yuklaş usuli; telefonda «bosib turib saqlaş» izohi qoladi).
- Ism kiritilmaganda öng ustunda karta namuna ism bilan xira holda turadi.

### 3.6 `/vidjet/`
- Ikki ustun `1.15fr 1fr`.
- Çap: raqamli uç qadam (crust Doto raqam): «Kodni sahifangizga qöying» (kod bloki va «Kodni nusxa oliş»), «Xohlasangiz sozlang» (atributlar), «Nima qilmaydi».
- Öng: «Şu yerda işlayapti» va mavjud jonli namuna bloki.

### 3.7 `/telefon/`, `/qoidalar/`
- Faqat sahifa boşi: `h1` va lede `page-head` ga köçadi. Qolgani 2-bosqiçdagidek.

## 4. Rus versiyasi

Hamma rus egizaklari bir xil tuzilmada; crumb «← Слова», «← Статьи»; teglar: «С чего начать», «Закон», «Правило», «Инструкция», «Имена»; «Rasmni saqlaş» → «Сохранить картинку».

## 5. Tekşiruv

- **Testlar (avval yiqiladigan):** `site/build.test.mjs`: röyxatdagi har sahifa (4 versiyada) `<main>` boşida `class="page-head"` va uning içida bitta `h1.page-title`; söz va maqola sahifalarida `page-crumb` va `page-title--text`; `/test/` va boş sahifada `page-head` yöq; `/soz/` qidiruv maydoni `page-head` içida; maqolalar indeksida birinçi karta featured, 6 ta karta. JS özgargan joylar (ism «Rasmni saqlaş», maşq kartalari) uçun mavjud sof funksiyalar testlari yaşil qoladi, yangi sof mantiq bölsa — test bilan.
- **Imlo:** yangi satrlar konverterdan ötkaziladi.
- **Brauzer:** har sahifa 375 va 1280 px, `/kr/` va `/ru/` dan bittadan; lenta va sahifa boşi orasida oraliq yöq; sticky harflar qatori; ism kartasi jonli yangilaniši va «Rasmni saqlaş»; gorizontal aylantiriş yöq.
- DESIGN.md: «Page Head» komponenti va içki sahifa panjaralari yoziladi.
- Testlar ötgaç `main` ga push, deploydan keyin jonli saytda tekşiruv.

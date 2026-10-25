# Redizayn 2-bosqiç: telefon, qoidalar va test alohida sahifada (dizayn)

Sana: 2026-10-25 · Holat: egasi körib çiqişiga · Maket: [Yozgiç 2-bosqiç sahifalar](https://claude.ai/artifact/7CkxYgsPY68Zrjh5fWfSDC) (egasi 2026-10-25 da «ha» dedi) · Oldingi bosqiç: `2026-10-25-fon-header-footer-design.md` (jonli)

## 1. Maqsad

Egasining şikoyatlari (2026-10-25):
- Boş sahifadagi test testligini batafsil öqimasa heç kim bilmaydi.
- «Qoidalar» bölimida 3–4 xil narsa aralaşib ketgan (kun sanoği, söz tekşiruv, jadval, izohlar).
- Telefon yöriqnomasida usullar ketma-ket yozilgan; kimga qaysi usul kerak bölsa, bosib batafsil bilib olsin.
- Har bir bölim alohida sahifada bölsin, boş sahifada eng muhimlari qolsin.

Muvaffaqiyat mezoni:
- `/telefon/`, `/qoidalar/`, `/test/` törtta versiyada (`/`, `/eski/`, `/kr/`, `/ru/`) oçiladi va headerdan bir bosişda yetiladi.
- `/test/` ga kirgan odam birinçi ekrandayoq bu test ekanini, neçta savol va qança vaqt ketişini köradi.
- `/qoidalar/` da har bir bölimning öz sarlavhasi bor; jadval, söz tekşiruv va qonun sanoği bir-biriga aralaşmaydi.
- `/telefon/` da uçta usul yopiq turadi, har birida «kimga mos» degan bir qator; bosilganda oçiladi (JSʼsiz ham).
- Eski havolalar (`/#telefonda`, `/#qoidalar`, `/#test`) yangi sahifaga olib boradi.

**Kirmaydi:** boş sahifaning hero animatsiyasi va vaqt taqqoslaş animatsiyasi (3-bosqiç, 8-bölimga qarang); story rasmi ranglari; savollar va qoidalar matnining mazmuni (köçiriladi, qayta yozilmaydi).

## 2. Özgarmas tamoyillar

1-bosqiç specining 2-bölimi şu yerda ham amal qiladi: manba yangi alifboda, `/eski/` va `/kr/` avtomatik, rus egizagi qölda (`site/ru/<sahifa>/index.html`, egizaksiz sahifa buildni yiqitadi), `web/**/index.html` qölda tahrirlanmaydi, SEO qöriqlari saqlanadi, DESIGN.md qoidalari (3px, soyasiz, Doto nuqta va ğ siz, kirillda Onest 800).

Yangi sahifalar içki sahifa: qahrabo lenta faqat header ortida, qolgani un fonida; işçi bloklar `--flour-deep`.

## 3. Sahifalar

### 3.1 `/telefon/` — Telefonda yoziş

Manba: boş sahifadagi `section.phone` matni köçiriladi.

Tuzilma (maket «/telefon/»):
1. `h1` «Telefonda yoziş» (Doto) va lede: «Telefonga heç narsa örnatmaysiz: bor klaviaturaga bitta til qöşasiz yoki harfni bosib turib tanlaysiz. Özingizga qulay usulni oçing.»
2. iPhone | Android almaştirgiç: ikki tugmali segment, 2px char çiziq, tanlangani char fonda. ARIA tablist, strelkalar bilan (hozirgi `setupTabs` mantiği). Boşlanğiç tanlov qurilmaga qarab (Android UA → Android). Har tab öz paneliga ega.
3. Har panelda uçta usul, har biri `<details class="usul">`:
   - summary: Doto raqam kvadrati (34px, crust), nom (700 18px), 1-usulda «Tavsiya» tegi, ostida «kimga mos» qatori (15px char-soft), öngda nuqtali +/− belgisi;
   - oçiq qism: hozirgi qadamlar, izohlar va rasmlar (keyrow, ikeys, `look` jadvali) özgarişsiz köçadi.
   - Usullar va «kimga mos» qatorlari:
     | # | Nom | Qator (iPhone) |
     |---|---|---|
     | 1 | Ozarbayjonça klaviatura · Tavsiya | ö ğ ş ç alohida tugmada turadi. Bir marta, ikki daqiqada qöşasiz. |
     | 2 | Harfni bosib turiş | Heç narsa qöşmasdan: o, g, s, c ni bosib turib, menyudan töğri harfni tanlaysiz. |
     | 3 | Konverter | Odatdagidek o', sh deb yozasiz, keyin matnni bir bosişda yangi alifboga ögirasiz. |
   - Android paneli bir xil, 1-usul qatori: «Gboard uçun qadamlar. ö ğ ş ç alohida tugmada.»
   - 3-usul oçiq qismida: bir gaplik tuşuntiriş va «Konverterni oçiş» havolasi (`/#konverter`).
   - Hammasi boşida yopiq.
4. Pastda qora ogohlantiriş bloki: «Turk klaviaturasi emas, ozarbayjonça. …» (hozirgi `guide-warn` matni).

### 3.2 `/qoidalar/` — Qoidalar

Manba: boş sahifadagi `section.rules` (jadval, izohlar, söz tekşiruv, sanoq).

Uçta alohida bölim, har biri `h2` bilan:
1. **«Nima özgardi»**: qoidalar jadvali (6 qator, hozirgi `rule-table`, `data-rule` atributlari saqlanadi) va yonida (telefonda ostida) ikki karta: «sh har doim ham ş emas…», «ng özgarmaydi…» hamda qonun haqidagi kiçik izoh. Desktop: `1.1fr 1fr`.
2. **«Sözingizni tekşiring»**: `--flour-deep` blok; label «Eski yozuvda yoki kirillda yozing, qaysi qoida işlaşini körasiz»; natija dough fonda (hozirgi `check-out`, `soz-izoh.js`). Mos jadval qatori yonadi (hozirgi xatti-harakat).
3. **«Qonun kuçga kirişiga»**: katta Doto son va «kun», matn «21.10.2026 imzolangan, 22.04.2027 kuçga kiradi. Har nuqta bir kun.», nuqtalar qatori (hozirgi `sanoq.js`). Qonun kuçga kirgandan keyin hozirgi «bugun / keyin» matnlari.

Sahifa sarlavhasi: `h1` «Qoidalar», lede «Tört harf yangi belgi oldi, tutuq belgisi aniqlaşdi. Hammasi bitta jadvalda.»

### 3.3 `/test/` — Yangi alifbo testi

Manba: boş sahifadagi `section.quiz-sec` va `web/test.js`.

Uç holat, bitta sahifada:
1. **Kiriş ekrani** (sahifa oçilganda): `--flour-deep` karta, max 720px:
   - qora teg «Test · 10 savol · 1 daqiqa»;
   - `h1` «Yangi alifboni qançalik bilasiz?» (Doto, 44px; telefonda 32px);
   - uç kiçik fakt: «10 savol: harflar, tutuq va istisnolar», «1 bosişda javob va izoh», «ö natijani storyga qöyasiz» (telefonda ustma-ust);
   - qora «Testni boşlaş →» tugmasi (56px). Bosilganda kiriş yaşiriladi, 1-savol çiqadi, fokus savolga ötadi.
2. **Savol ekrani**: tepada «Test · N / 10» va 10 nuqtali progress (hozirgi `prog`), savol 21px 800, javoblar 52px tugmalar; javobdan keyin töğrisi char fonda «Töğri», xatosi clay belgi bilan, izoh va «Keyingi savol» (crust).
3. **Natija ekrani**: hozirgidek (ball, baho, «Storyga qöyiş», «Qaytadan boşlaş»).

`test.js` dagi `mountTest` mantiği va voqealari (`test_boshlandi`, `test_tugadi`, `test_qayta`, `story_ulashildi`) özgarmaydi; `test_boshlandi` endi «Testni boşlaş» bosilganda yuboriladi. Boş sahifaga boğliq qator (`test-rule` ni oçiş) olib taşlanadi.

## 4. Boş sahifa

- `section.phone`, `section.rules`, `section.quiz-sec` va ular orasidagi `sec-rule` lar olib taşlanadi.
- Ularning örniga **«Yana foydali»** bölimi (maket «Boş sahifada havolalar»): Doto sarlavha va uçta havola kartasi.
  | Belgi | Nom | Desktop matni | Telefon qatori | Havola matni |
  |---|---|---|---|---|
  | ş | Telefonda yoziş | iPhone va Android: ozarbayjonça klaviatura, harfni bosib turiş yoki konverter. | iPhone va Android, 3 usul | Usulni tanlaş |
  | ö | Qoidalar | Tört yangi harf, sʼh va tutuq belgisi bitta jadvalda. Sözingizni tekşirib köring. | 6 qoida va söz tekşiruv | Qoidalarni köriş |
  | 10 | Test | Yangi alifboni qançalik bilasiz? 10 savol, bir daqiqa, natijani storyga qöyasiz. | 10 savol, 1 daqiqa | Testni boşlaş |
  Desktop: uç ustun, karta 220px, `--flour-deep`, 52px qora belgi kvadrati (crust harf). Telefon: ustma-ust, 76px qator, öngda strelka.
- Butun karta bitta `<a>`.
- FAQ va boşqa joylardagi `#telefonda`, `#qoidalar`, `#test` havolalari yangi sahifalarga almaşadi.
- **Eski havolalar:** boş sahifa skripti `location.hash` `#telefonda`, `#qoidalar`, `#soz-tekshir`, `#test` bölsa, `location.replace()` bilan mos sahifaga (şu versiya prefiksi bilan) ötkazadi.
- `app.js` dan köçgan kod olib taşlanadi: telefon tablari, söz tekşiruv, sanoq, `mountTest`. Bölimga yetib boriş statistikasi röyxatidan olib taşlangan bölimlar çiqariladi.

## 5. Header va footer

- **Header havolalari:** Konverter · Telefonda · Qoidalar · Test · Maşq · Sözlar. «Fayl» va «Maqolalar» headerdan menyu va footerga tuşadi (egasi maketni tasdiqlagan).
- Joriy bölim belgisi uçun `BOLIMLAR` ga `telefon`, `qoidalar`, `test` qöşiladi.
- **Telefon menyusi:** Konverter, Telefonda yoziş, Qoidalar, Test, Faylni ögiriş, Tez yoziş maşqi, Sözlar, Ism kartasi, Maqolalar, Saytingiz uçun vidjet.
- **Footer «Bölimlar»:** Konverter, Telefonda yoziş, Qoidalar, Test, Maşq, Sözlar. **«Yana»:** Faylni ögiriş, Ism kartasi, Maqolalar, Saytingiz uçun vidjet, Instagram, Telegram kanal, Aloqa.
- Rus partiallari mos: «Телефон», «Правила», «Тест».
- 1024px dan kenglikda olti havola va ikki tugma bir qatorga sığişi tekşiriladi (rusça eng uzun); sığmasa, menyuga ötiş nuqtasi kattalaştiriladi.

## 6. Skriptlar va sahifa meta

| Sahifa | `script` | Nimani qiladi |
|---|---|---|
| `/telefon/` | `telefon.js` | tab almaştirgiç (`tablar.js` dan `setupTabs`), qurilmaga qarab boşlanğiç tab |
| `/qoidalar/` | `qoidalar.js` | söz tekşiruv (`soz-izoh.js`), jadval qatorini yoqiş, sanoq (`sanoq.js`), nusxa tugmasi |
| `/test/` | `test-sahifa.js` | kiriş ekrani, `mountTest` |

- `setupTabs` `app.js` dan alohida `web/tablar.js` moduliga köçadi; `app.js` uni import qiladi (yuklab oliş tablari uçun).
- Har sahifa meta: `title`, `description`, `path`, `updated`; rusça egizak ham. Masalan `/test/`: «Yangi alifbo testi: 10 savol · Yozgiç».
- Sitemap generator orqali avtomatik; `llms.txt` ga uçta yangi sahifa qöşiladi.
- `i18n-ru.js` dagi tarjimalar köçgan matnlar uçun özgarmaydi; yangi JS satrlari (kiriş ekrani tugmasi) qöşiladi.

## 7. Tekşiruv

- **Testlar (avval yiqiladigan):** `site/build.test.mjs`: uçala sahifa 4 versiyada yasaladi; headerda `href="/test/" aria-current="page"` faqat `/test/` da; boş sahifada `id="telefonda"`, `id="qoidalar"`, `id="test"` yöq, uçta karta havolasi bor; `/telefon/` da 6 ta `details.usul` (har tabda 3), hammasi `open` siz. `web/` testlari: `tablar.js` (strelka, Home/End), boş sahifa hash yönaltiriş funksiyasi (`#telefonda` → `/telefon/`, `/kr/#qoidalar` → `/kr/qoidalar/`, boşqa hash özgarmaydi).
- **Imlo:** yangi satrlar konverterdan ötkaziladi.
- **Brauzer:** 375px va 1280px da uçala sahifa, `/kr/` va `/ru/` da bittadan; test boşidan oxirigaça (story rasmi yasaladi), söz tekşiruv `Is'hoq`, telefon tabi va usullar oçiliş, eski `/#test` havola yönaltirişi, gorizontal aylantiriş yöq.
- Testlar ötgaç `main` ga push, deploydan keyin jonli saytda tekşiruv.

## 8. Keyingi bosqiç: «qanday işlaydi» animatsiyasi (egasi 2026-10-25 da yana taʼkidladi)

Egasi typecorrect.com dagi kabi animatsiyani istaydi va «1 ga 1 köçirsang ham böladi, faqat dizaynni özimnikiga mosla» dedi. Bu 3-bosqiçning asosiy işi, şu specdan keyin darhol alohida spec bilan qilinadi:
- Hero: klaviatura tugmalari ketma-ket bosiladi (`o` `'`), ekranda `o'` paydo bölib `ö` ga aylanadi; `⇧ ⇧` bilan yoqiş-öçiriş körsatiladi. Yassi, 3px, crust/char tugmalar.
- Vaqt taqqoslaş: «Qölda: ö ni qidiriş, nusxalaş, qöyiş» va «Yozgiç bilan: o' yozasiz, ö çiqadi» ikki qator, soniya hisoblagiçi va progress çiziği; pastda «kuniga neçta söz» bilan tejalgan vaqt.
- Bizning ranglar va şriftlar, reduced-motion da harakatsiz holat. typecorrect kodi va rasmlari köçirilmaydi, faqat ğoya va ritm.

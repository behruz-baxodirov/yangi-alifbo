# Yozgiç tekşiruvi — 2026-10-24

## Yakuniy sayt reviewʼi

Diapazon: `6e841283..d170be9c`; hozirgi asos: `4346925f5`.
Undan keyingi `3bee75c7c` va `4346925f5` tuzatişlari hisobga olindi.
Yasalgan HTML diffi örniga `site/`, qölda yozilgan `web/` modullari,
testlar va Pages workflow körib çiqildi. Eski review diffi va 10-24 ledgeri
checkoutʼda yöq edi; mavjud Git tarixidan manba diffi lokal qayta olindi.
Avvalgi qarorlar haqidagi yöq yozuvlar taxmin bilan toldirilmadi.

### Review Focus

1. Misollar: `data-lotin` va `⟦…⟧` yangi harflarni eski/kirill sahifada saqlaydi;
   lokalizator, generator va SEO testlari ötdi.
2. Til tanlagiç: bir xil söz slugʼi, sahifa manzili, `?n=` va `#hash` saqlanadi.
   Keyingi commitdagi `placeIn()` tuzatişi saqlangan.
3. Word: run çegarasidagi apostroflar mavjud testdan töliqroq tekşirildi;
   quyidagi ikki muammo topilib tuzatildi.
4. Maşq: vaqtinça `o`, `s`, `c`, `g`, `oʼ` holatlari haqidagi keyingi tuzatiş
   saqlangan; yakuniy söz aynan yangi alifboda bölişi şart.
5. Rusça: sahifa jufti yöq bölsa build yiqiladi; dinamik matn kalitlari,
   test savollari va izohlar luğat bilan tekşiriladi.

### Tuzatilgan muammolar

- **P1 — Word run çegarasida kontekst yöqolişi.** `ma` + apostrof + `no`,
  `Is` + `hoq`, bölingan kirill va bölingan URL alohida ögirilib, xato natija
  berardi. Endi butun matn konteksti umumiy konverterda ögiriladi; natija
  belgilarining asl runʼi kuzatiladi, formatlaş teglari saqlanadi.
- **P1 — Word satr/tab çegarasidan ötiş.** `s<w:br/>h` avval `ş` ga aylanardi.
  Endi abzats, satr, tab, maydon, rasm va obyekt çegaralari kontekstni uzadi.
- **P1 — ZIP oçilganda hajm çegarasi yöq.** 20 MB lik kiruvçi fayl çegarasi
  siqilgan arxivning açilgan hajmini çeklamasdi. Endi umumiy açilgan hajm
  100 MiB bilan çeklangan; oqimning haqiqiy uzunligi ham tekşiriladi.
  Çegaradan ötgan Word fayliga alohida, tarjima qilingan xabar çiqadi.
- **P2 — ZIP buzilgan matnni jim qabul qilişi.** Endi fayl uzunligi, CRC-32,
  markaziy katalog va maʼlumot çegaralari tekşiriladi.

Birinçi ikki regression testi tuzatişdan oldin yiqildi. ZIPʼning buzilgan
maʼlumot va hajm testlari ham avval yiqildi; söng barçasi ötdi.

### Tekşiruv dalillari

- `npm test`: **122 test, 0 xato**.
- `node --test web/fayl-ogir.test.mjs web/converter.test.mjs`: **16 test, 0 xato**;
  67 umumiy holat turli run çegaralarida ham tekşiriladi.
- `npm run build`: 3 364 fayl (3 360 HTML), natija manbalar bilan mos.
- Brauzer: 9 xil sahifa × 4 versiya × 2 kenglik (375/1280 px),
  gorizontal siljiş yöq, konsolda xato yöq.
- Konverter va 10 savollik test tört versiyada tekşirildi; test natijasi 10/10.
- Maşq tört versiyada oxirigaça tekşirildi; aniqlik 100%.
- Vidjet matnni ögirdi va qayta bosilganda asl matnni qaytardi.
- Alohida runʼli Word fayli brauzerda ögirildi; natijani `textutil` oçdi,
  Python `zipfile.testzip()` xato topmadi. Tutuq, satr uzilişi va URL saqlandi.
- Yasalgan sahifalarning içki sahifa/aktiv havolalarida uziliş topilmadi.
- Commit: `18e8c5b64`; Pages run `40055143838` — success.
- Jonli saytda `converter.js`, `fayl-ogir.js`, `zip.js`, `fayl.js` manbalari
  lokal commit bilan baytma-bayt bir xil. Bosh sahifa, `/kr/`,
  `/soz/shahzod/`, `/ru/fayl/` va Google tasdiq fayli HTTP 200 qaytardi.
- Jonli sitemap 3 360 URLʼni sanaydi; Yandex tasdiq meta tegi saqlangan.
- Jonli `/fayl/` 375 px da sinov Word faylini muvaffaqiyatli ögirdi.

### Dastlabki minor (deferred) qaydlari

Quyidagi qaydlar birinçi review holatini bildiradi. Davom işida tuzatilganlari
va haqiqiy qurilma talab qiladiganlari pastdagi yakuniy holatda ajratilgan.

- Maşq kunlari `toISOString()` orqali UTC sanasida saqlanadi; mahalliy yarim
  tundan keyin kun bir kun farq qilişi mumkin.
- `judgeWord().missed` harfning qaysi örinda yöqligini emas, sözda umuman
  borligini hisoblaydi; aniqlik töğri, eng köp adaşilgan harf maslahati noaniq.
- Maşqdagi töğri JSON, lekin notöğri tuzilmali localStorage yozuvi tekşirilmaydi.
- Söz qidiruvi asinxron tugaganda eski sörov javobi yangi maydonni bosib
  qolişi mumkin; qidiruv natijasi qayta yozilganda sörovni soliştiriş kerak.
- Fayl va ism/maşq story rasmlaridagi Blob URLʼlar sahifa yopilgunça saqlanadi.
- Subtitr konvertori NOTEʼning davom qatorlari va stil/kod belgilarini
  alohida ajratmaydi; murakkab VTT/SRT alohida format testi talab qiladi.
- Maqola matnida `bosh sahifa`, yangi yozuv misolida `sheʼr` kabi mayda
  tahririy xatolar bor; mahsulot matni uçun alohida tekşiruv kerak.
- README/PRODUCT/DESIGNʼning ayrim eski jumlalari InputMethodKit, ruxsatsiz
  işlaş va build yöqligini aytadi; amaldagi arxitektura ulardan yangi.

## Mac 2.0.3 va eski qaydlar

`swift test --package-path mac` dastlabki tekşiruvda **51 XCTest, 0 xato** berdi.
Bu testlar haqiqiy ilovadagi Accessibility/Terminal xatti-harakatini tasdiqlamaydi.

| Eski qayd | Hozirgi holat va dalil |
|---|---|
| Yopiluvçi apostrof o/g dan keyin ö/ğ bölişi | Hali bor: konverterda `'kino'` → `'kinö`; Rewriter ham bevosita biriktiradi. |
| ABC bazaviy tartibga majburlanmagani | Dastur endi input source emas. Faol layout saqlanadi; dead-key layoutʼlar qölda sinalmagan. |
| Option orqali yozilgan ‘ ’ ögirilmasligi | Hali bor: KeyMapper Optionʼli tugmani `.other` qiladi. |
| Registration.install enable xatosida true qaytarişi | Amaldagi koddan Registration va TIS örnatişi olib taşlangan; 1.x arxitekturasiga tegişli. |
| Uninstall avval boşqa input sourceʼga ötmasligi | 2.x asosiy dasturi input source emas. Eski 1.x nusxani olib taşlaş yöli qolgan, migratsiya qölda qayta sinalmagan. |
| Installer input method jarayonini töxtatişi | 2.x da input method yöq; faqat örnatilayotgan nusxa yöliga mos jarayon töxtatiladi. |
| `tutuq:false` kirill/istisnolarga taʼsir qilmasligi | Hali bor: `маъно`, `Исҳоқ`, `Ishoq` şu sozlama öçiq bölsa ham tutuq bilan çiqadi. |
| Har controllerʼda alohida tutuq sozlamasi | Amaldagi ilovada Settings/UserDefaults umumiy; controller arxitekturasi yöq. |
| AHK tezlik va autocomplete muammolari | Tezlik va oddiy Backspace CI testi bor; dasturning özi belgilagan taklif hali maʼlum çeklov. |
| macOS CI va KeyMapper testlari yöqligi | Hali bor: workflowʼlar faqat Pages va Windows; sof mantiq XCTest bilan lokal tekşiriladi. |

Hali qölda tasdiqlanişi kerak: menyudagi Yangilaş → haqiqiy Terminal oynasi,
bir versiyaga bir martalik HUD, Chrome maydonida `c b ⌫ h → ç`.
Örnatilgan nusxa 2.0.3 ekanligi öqildi; native avtomatlaştiriş uning
menyu-bar oynasini öqiy olmadi. Şuning uçun bu uçta holat ötgan deb
belgilanmadi. `swift test` qayta işlatildi: yana 51 XCTest, 0 xato.
Kodda qolgan kiçik muammolar: Backspaceʼda bir neçta AX sörovi,
`ö↑` ustidagi çap bosişning yoqiş/öçiriş vazifasi, ruxsat menyusidagi ASCII apostrof.

## SEO holati

2026-10-24 kuni Googleʼning haqiqiy brauzer natijasida
`site:yozgich.uz uchun` sörovi bosh sahifani topdi. Natijada eski lotindagi
«Yangi oʼzbek alifbosi uchun klaviatura va konvertor» izohi körindi.
Bu aynan şu sörov böyiça natija; umumiy sörovlardagi örin yoki hamma yangi
sahifa indekslangani haqida xulosa qilinmadi.

Yandex Webmaster → Yozgiç → Индексирование → Файлы Sitemap tekşirildi.
Xizmat hali «Только для чтения» holatida, «Добавить» tugmasi öçirilgan.
Sitemap qöşilmadi. Tayyor manzil: `https://yozgich.uz/sitemap.xml`.
Xizmat oçilganda yuborişdan oldin egasidan alohida tasdiq olinadi.

## Android uçun qolgan qöl tekşiruvi

Haqiqiy Android qurilma bu sessiyada ulanmagan. Chromeʼning tor oynasi
telefon klaviaturasi matnini tasdiqlamaydi.
Gboard va Samsung Keyboardʼda qurilma/Android/klaviatura versiyasi bilan:

1. Ozarbayjonça klaviaturani tanlaş yöli va `ö ğ ş ç` tugmalarini tekşiriş.
2. `i/ı/İ/I` ning kiçik/katta harfdagi natijasini tekşiriş.
3. Gap boşidagi avtomatik katta harf va avtomatik tuzatişni tekşiriş.
4. Oddiy layoutʼda bosib turiş orqali qaysi harflar çiqişini tekşiriş.
5. Tutuq kirişini sayt konverterida tekşiriş va yöriqnoma bilan soliştiriş.

## Dastlabki bosqiçdan keyingi qadamlar

- Windowsʼni haqiqiy qurilmada sinaş: `docs/windows-qolda-sinash.md`.
- Android matni haqiqiy Gboard va Samsung Keyboardʼda tekşirilişi kerak.
- Yandex sitemap yuborişi taşqi xizmatga yozişdir; egasi tasdiğidan keyin.
- Reliz, DNS, worktree/branch tozalaş va pullik xizmatlarga tegilmadi.

## Davom işining yakuniy holati

### Sayt — tuzatildi

- Maşq kunlari mahalliy kalendar sanasida saqlanadi; saqlangan JSON tuzilmasi
  tekşiriladi, notöğri qiymat sahifani işdan çiqarmaydi.
- Adaşilgan yangi harf haqiqiy örni böyiça hisoblanadi.
- Asinxron söz qidiruvi eski sörov natijasini yangi sörov ustiga yozmaydi.
- Ism/maşq rasmi almaşganda oldingi Blob URL böşatiladi; fayl havolalari
  sahifadan çiqilganda tozalanadi, BFCacheʼdan qaytgan sahifa esa saqlanadi.
- Subtitrdagi NOTE/STYLE/REGION bloklari, cue identifikatorlari, HTML teglar,
  atributlar, entity va vaqt qatorlari saqlanadi. Matn format teglari orasida ham ögiriladi.
- `tutuq:false` kirill ъ/сҳ va luğat istisnolarida ham ASCII apostrofni beradi;
  oddiy konverter va Word bir xil mantiqdan foydalanadi.
- Maqoladagi eski yozuv misoli va «boş sahifa» matni töğrilandi.
- README/PRODUCT/DESIGNʼdagi eski input source/build tavsiflari yangilandi.

Android yöriqnomasi [Gboard hujjati](https://support.google.com/gboard/answer/7068494?hl=en)
va [Samsung hujjati](https://www.samsung.com/us/support/answer/ANS10001592/)
bilan soliştirildi: joylaşuv tanlaş qadami, Samsung til menyusi va versiyaga
qarab farq qilişi aniqlaştirildi. Bu haqiqiy telefon sinovi örnini bosmaydi.
Egasi bu sessiyada Windows/Android qurilmalarini ulab bölmasligini tasdiqladi.

### Mac — 2.0.4

- `ö↑` / `A↑` ustidagi çap bosiş menyuni oçadi, yozişni öçirmaydi.
- Option orqali yozilgan ‘ ’ konverterga yetadi; Command/Control yorliqlari saqlanadi.
- Ruxsat menyusidagi ASCII apostrof töğrilandi.
- Oldin saqlangan yangi versiya qayta işga tuşganda ham UIʼga bildiriladi;
  bir versiya xabarini qayta körsatmaslik test bilan tekşiriladi.
- `.command` aniq Terminal ilovasida oçiladi; xato bölsa buyruq nusxalanadi.
- KeyMapper, menyu va Updater uçun 8 ta yangi XCTest bor; jami **59/59**.
- [macOS CI 40075335131](https://github.com/behruz-baxodirov/yangi-alifbo/actions/runs/40075335131)
  muvaffaqiyatli ötdi: XCTest, universal yiğiş, plist va imzo tekşiruvi.
- Universal arm64/x86_64 yiğiş, plist, ad-hoc imzo va `--version` tekşirildi:
  **2.0.4**. Reliz fayllari `dist/` da tayyor, Windows exeʼsi v2.0.3 bilan bir xil.
- Haqiqiy Chrome, Terminal oçilişi va HUD körinişi qöl sinovi sifatida hali
  tasdiqlanmagan. UI vositasi menyu-bar ilovasini öqiy olmadi; yolğiz Shift
  bosişini yuborişni ham qöllamadi. Natija avtomatik testdan alohida saqlanadi.

### Yakuniy dalillar va qolgan çegaralar

- Web: **127 test, 0 xato**; Swift: **59 XCTest, 0 xato**.
- Generator 3 364 fayl beradi; qayta yiğiş yangi fayl özgarişi kiritmaydi.
- 72 sahifa/kenglik tekşiruvi (36 sahifa × 375/1280 px), overflow va konsol xatosi yöq.
- Tutuq öçiq konverter, Android tabi va söz qidiruvi tört versiyada sinaldi.
- Yandex Sitemap qayta tekşirildi: hali «Только для чтения», qöşiş tugmasi öçirilgan.
- Yopiluvçi ASCII qoştirnoq bilan o/g apostrofi bir xil tugma: `'kino'`
  kabi noaniq holat eski çeklov sifatida qoladi. Uni umumiy fixture qoidalarini
  taxmin bilan almaştirib «tuzatildi» deb belgilamadim; matnda juft qoştirnoq
  (`"kino"`) işlatiş bu noaniqlikni çetlab ötadi.
- Backspaceʼdagi AX sörovlari fokus, tanlov va matnni tekşiradi. Fokus/matn
  keşi notöğri belgini öçirişga olib kelişi mumkin; haqiqiy sekin ilovada
  sinaşsiz bu himoya olib taşlanmadi.
- ABCʼga majburiy ötiş qöşilmadi: 2.x faol layoutʼda işlaydi; dead-key
  layout va eski 1.x migratsiyasi haqiqiy qurilma tekşiruvini talab qiladi.
- Egasi reliz va zaxirali tozalaşni alohida tasdiqladi. Kelajak Pro, bot va
  Linux xususiyatlari bu iş doirasiga kiritilmadi.

### Reliz va tozalaş bajarildi

- [v2.0.4 relizi](https://github.com/behruz-baxodirov/yangi-alifbo/releases/tag/v2.0.4)
  `e5757034a` commitdan çiqarildi. Ikkala fayl avval qoralamaga yuklandi,
  SHA-256 tekşirildi, söng reliz eʼlon qilindi.
- `YangiAlifbo.zip`: 299 242 bayt, SHA-256
  `fac262f35a4a38ccca6716b2f8beda8812cfe12a6d566c6ba95cb2f6dcbd49fe`.
- `YangiAlifbo-windows-beta.exe`: 1 287 168 bayt, SHA-256
  `ddda297749359b50e86ebce8a7d6218babd1852acc5b8c64089c59706a45a32e`;
  Windows kodi özgarmagan, fayl v2.0.3 relizidan qayta qöşildi.
- `releases/latest` v2.0.4 ga yönaladi. Ikkala `latest/download/…`
  manzili HTTP 200 qaytardi; yuklangan fayllar lokal nusxalarga mos.
- Tasdiqlangan 5 eski worktree, 8 lokal branch va 2 GitHub branchʼi öçirildi.
  Faqat `main` worktreeʼi qoldi; avvalgi reliz taglari saqlandi.
- Zaxira: `/Users/a1111/.codex/backups/yozgich-2026-10-24-iQY7eE`.
  Töliq Git bundle, worktree fayllari/metamaʼlumotlari, refs röyxati,
  reliz fayllari va SHA256SUMS bor. Bundle, tar va Git connectivity tekşiruvlari ötdi.
- Birlamçi daraxtdagi avvaldan commit qilinmagan `docs/codex-handoff.md`
  öz holida qoldi; uning nusxasi ham zaxirada saqlandi.

### Relizdan keyingi yangilaniş sörovi

2026-10-24 kuni haqiqiy GitHub HEAD sörovi ikkala nusxada tekşirildi:

```text
$ /Users/a1111/Applications/YangiAlifbo.app/Contents/MacOS/YangiAlifbo --check-update
joriy: 2.0.3, oxirgi: 2.0.4, yangilaş: 2.0.4
$ dist/YangiAlifbo.app/Contents/MacOS/YangiAlifbo --check-update
joriy: 2.0.4, oxirgi: 2.0.4, yangilaş: kerak emas
```

Ikkala buyruq 0 kodi bilan tugadi. Bu Terminalʼni menyudan oçiş sinovi emas;
faqat haqiqiy relizni aniqlaş va versiyani soliştiriş yölini tasdiqlaydi.
Örnatilgan nusxa hali 2.0.3 va `enabled = 0`: brauzer maydonidagi `ch`
natijasi yoqilgan klaviatura xatosi deb belgilanmadi. Native UI vositasi
sinov tabidan boşqa faol Chrome tabiga yönaldi, şuning uçun bu uriniş
haqiqiy tugma kuzatuvçisi uçun dalil sifatida olinmadi. Sinov tabi yopildi.

Macʼdagi aniq qöl qadamlar va kutiladigan natijalar:
[`mac-qolda-sinash.md`](mac-qolda-sinash.md). Windows/Android qurilmalari
ulanmaganligi va Mac UI sinovi tasdiqlanmaganligi haqidagi çegaralar saqlanadi.

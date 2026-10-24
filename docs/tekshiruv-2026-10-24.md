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

### minor (deferred)

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
Kodda qolgan kiçik muammolar: Backspaceʼda bir neçta AX sörovi,
`ö↑` ustidagi çap bosişning yoqiş/öçiriş vazifasi, ruxsat menyusidagi ASCII apostrof.

## Keyingi qadamlar

- Windowsʼni haqiqiy qurilmada sinaş: `docs/windows-qolda-sinash.md`.
- Android matni haqiqiy Gboard va Samsung Keyboardʼda tekşirilişi kerak.
- Yandex sitemap yuborişi taşqi xizmatga yozişdir; egasi tasdiğidan keyin.
- Reliz, DNS, worktree/branch tozalaş va pullik xizmatlarga tegilmadi.

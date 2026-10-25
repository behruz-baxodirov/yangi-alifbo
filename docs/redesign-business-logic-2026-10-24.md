# Yozgiç: redizayndan oldingi mahsulot tahlili

Sana: 2026-10-24. Manba: amaldagi kod, PRODUCT.md, DESIGN.md, generator,
oldingi loyiha rejalari va lokal testlar. Bu hujjat yangi dizayn tasdiği emas.

## Asosiy qiymat

Yozgiç yangi tugmalarni yodlamasdan yangi alifboda yozişga yordam beradi.
Asosiy mexanizm: `o' → ö`, `g' → ğ`, `sh → ş`, `ch → ç`.
Konverter kirill va eski lotinni qabul qiladi; natija hamma interfeys tilida
yangi lotin böladi. URL, email va @nomlar himoyalangan. `s'h`, Isʼhoq,
asʼhob, musʼhaf va tutuq sozlamasi alohida mantiqqa ega.

## Foydalanuvçi yöli

| Kirish nuqtasi | Bajaradigan işi | Keyingi foydali qadam |
|---|---|---|
| Instagram / telefon | Matnni joylaş, natijani nusxalaş | Telefon yöriqnomasi yoki havolani ulaşiş |
| Mac | Buyruqni nusxalaş, Terminal, Accessibility ruxsati | Saytda klaviaturani sinab köriş |
| Windows | Beta EXEʼni yuklaş | Hotkey va sinov maydoni |
| Qidiruv / söz sahifasi | Sözning yangi yozuvi va sababini biliş | Konverter yoki ism kartasi |
| Ism kartasi | Ismini ögiriş, 1080×1920 PNG oliş | Story orqali ulaşiş |
| Maşq | Harf/gap rejimi, tezlik va aniqlik | Eng yaxşi natija, yana maşq, story |
| Hujjat | Faylni tanlaş/taşlaş va ögirilganini yuklaş | Klaviaturani örnatiş |

## Sayt qismlari

- Boş sahifa: qurilmaga mos yuklaş, jonli konverter, telefonda yoziş,
  qoidalar, söz tekşiruv, 10 savolli test, FAQ, asosçi va xizmatlar.
- `/soz/`: ~800 söz/ism/joy, harf indeksi va kechiktirilgan qidiruv.
  Har bir yozuvga alohida statik sahifa bor.
- `/ism/`: `?n=` orqali ismni qabul qiladi, karta, story va share/download.
- `/mashq/`: olti rejim; söz böşliqdan keyin baholanadi. Eng yaxşi
  natija va mahalliy sana böyiça maşq kunlari localStorageʼda.
- `/fayl/`: .docx .txt .md .csv .srt .vtt; kiruvçi fayl 20 MiB gaça.
  Word formatlari saqlanadi, subtitr vaqt va metadata qatorlari himoyalangan.
  Oçiladigan ZIP yigʻindisi 100 MiB bilan çeklangan.
- `/maqola/`: olti maqola; `/vidjet/`: namuna va bitta skript bilan ulaniş.

## Biznes modeli

Asosiy imkoniyatlar bepul. Hozirgi daromad yöli: ixtiyoriy Taps donati va
asosçining Telegram orqali AI avtomatlaştiriş, sayt/dastur, kurs/maslahat
xizmatlariga murojaat. Pullik Pro, akkaunt, obuna va tölov backendʼi yöq.
Ulaşiladigan ism/test/maşq rasmlari, SEO söz sahifalari va vidjet mahsulotni
tarqatişga xizmat qiladi. Yangi dizayn foydalanişni birinçi öringa, donat va
xizmatlarni foyda körsatilgandan keyin qöyadi.

## Texnik çeklovlar

`site/pages/` va `site/ru/` — sahifa manbalari; `site/partials/` — navigatsiya
va footer; `site/layout.html` — umumiy qobiq. `npm run build` tört versiyani
`web/` ga yozadi: `/`, `/eski/`, `/kr/`, `/ru/`. Yasalgan HTML qölda
tahrirlanmaydi. Rus matni alohida; eski lotin va kirill avtomatik ögiriladi.
Pages workflow tayyor `web/` ni deploy qiladi, build qilmaydi.

Interfeys tilini almaştiriş sahifa yöli, query va hashʼni saqlaydi;
konverter natijasini interfeys tili almaştirmaydi. Canonical, hreflang,
FAQ/Article JSON-LD, sitemap, Google/Yandex tasdiq teglari saqlanişi kerak.

`web/app.js` hozir `non-center`, `stamp`, `pair`, konverter, tablar va qolgan
boş sahifa IDʼlariga bevosita boğlangan. Nonni köçiriş mumkin, lekin shu
kontraktlar tekşirilmasdan olib taşlaş butun skriptni töxtatişi mumkin.
Canvas storyʼlar `web/kanvas.js` dagi eski rang va şriftlarni qöllaşadi:
yakuniy dizaynda ular ham sahifa bilan bir tizimga keltiriladi.

## Maxfiylik matnidagi nomuvofiqlik

Konvertatsiya va fayl işlash lokal kodda bajariladi. Ammo sayt qobiği
yozgich.uzʼda Yandex Metrika (Webvisor ham yoqilgan) va GAʼni yuklaydi.
Eski surface briefʼdagi «no tracking» amaldagi kodga mos emas. Şuning uçun
yangi dizaynda «sayt umuman tarmoqqa çiqmaydi» degan yangi daʼvo yozilmaydi.
Analitika siyosatini özgartiriş ushbu vizual maketlarning vazifasi emas.

## Redizayn xulosasi

Non va çekiç mahsulotning özi bilan boğliq: eski belgi yangi harfga
tamğalanadi. Egasi 2026-10-24 kuni shu ğoyani saqlaş va bir neçta yangi
variantni birga körişni tanladi. Variantlar faqat rang emas, sarlavha,
konverter, non va örnatişning turli joylaşuvlarini taqqoslaydi.

Saytdagi imkoniyatlar kichik ekranda ham topiladi; uzun örnatiş yöriqnomasi
konverterni berkitmaydi. Milliylik butun matn ustiga naqş soçiş bilan emas,
nonning taniladigan şakli, çekiç ritmi, rang va harf tamğasi orqali beriladi.

## Şu sessiyada tekşirilganlar

- `npm test`: 127 test ötgan, 0 xato.
- `swift test --package-path mac`: 59 test ötgan, 0 xato.
- Lokal sayt boş sahifasi 1440, 1024 va 390 px da suratga olindi.
  Avtomatik inspector dastlab app mezonida işlatildi; landingga mos
  kelmaydigan KPI va app-title ogohlantirişlari nuqson sifatida olinmaydi.
  390 px da sarlavhaning uç qatorga bölinishi va navigatsiyaning yashirinişi
  kod va suratda körinadi. Qurilma tartibi UAʼga ham boğliq: oddiy viewport
  kiçraytirişi haqiqiy telefon rejimi sinovi örnini bosmaydi.

Makеtlar alohida `.impeccable/mockups/redesign-2026-10-24/` da. Ular ishlab
turgan saytni almaştirmaydi; tanlangan variant keyingi amalga oşirişning
vizual asosi böladi.

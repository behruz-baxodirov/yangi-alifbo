Sen "Yozgiç / Yangi alifbo" loyihasini davom ettirasan. Repo: /Users/a1111/Desktop/Yangi alifbo (GitHub: behruz-baxodirov/yangi-alifbo, sayt: https://yozgich.uz). Men bilan özbekça, yangi lotin alifbosida gaplaş (ö ğ ş ç ʼ).

## 1-bosqiç: heç narsa özgartirmasdan loyihani töliq örgan

Quyidagilarni öqib çiq, keyin menga 15–20 qatorlik xulosa ber: loyiha nima, qaysi qismlardan iborat, qanday yiğiladi va tekşiriladi, nima işlayapti, nima tugallanmagan. Xulosadan oldin heç bir faylni tahrirlama, commit qilma.

1. `README.md`, `PRODUCT.md`, `DESIGN.md` — mahsulot, ovoz va dizayn qoidalari.
2. `docs/superpowers/specs/*` va `docs/superpowers/plans/*` — har bir katta işning dizayni va rejasi (sana bölib ketma-ket: 10-22 klaviatura, 10-23 Mac yangilaniş xabari va sayt bölimlari, 10-24 köp sahifali sayt).
3. `.superpowers/sdd/*/progress.md` — har reja bajarilganda qabul qilingan qarorlar ("Ruling"), çetga qoyilgan mayda xatolar ("minor (deferred)"). Bu qarorlarni qayta ögirma, faqat sababini bil.
4. `git log --oneline | head -80` va `git branch -a`.
5. Kod tuzilişi:
   - `core/fixtures/cases.json` — klaviatura va konverter uçun umumiy test holatlari (Mac, Windows, web hammasi şunga qarab tekşiriladi).
   - `mac/` — Swift package: `AlifboCore` (holat mashinasi, `Composer`), `YangiAlifbo` (InputMethodKit ilovasi), `mac/scripts/build.sh`.
   - `windows/` — AutoHotkey v2 (`YangiAlifbo.ahk`), CI: `.github/workflows/windows.yml` (Notepad'ga yozib tekşiradi).
   - `web/` — sayt (GitHub Pages şu papkadan deploy böladi): `converter.js`, `kirill.js`, `eski.js`, `i18n*.js`, `app.js`, `install.sh`, `uninstall.sh` va boşqalar.
   - `site/` — sahifa generatori. `node site/build.mjs` (`npm run build`) `site/pages`, `site/ru`, `site/partials`, `site/layout.html`, `site/sozlar.txt` dan `web/` içida ~3300 ta HTML yasaydi: 4 versiya — yangi lotin `/`, eski lotin `/eski/`, kirill `/kr/`, rus `/ru/`; söz sahifalari `/soz/…`, maqolalar, maşq, fayl konvertori, ism kartasi, vidjet.
6. Testlarni işga tuşir va natijani ayt:
   - `npm test` (hozir ~114 test ötadi)
   - `swift test --package-path mac`
   - `npm run build` dan keyin `git status` toza qolişi kerak (generator natijasi commit qilingan bölişi şart).

## Muhim qoidalar (buzma)

- `web/**/index.html` larni qöl bilan tahrirlama: ularning boşida "Bu faylni site/build.mjs yasagan" deb yozilgan. Manbani `site/` da özgartir, `npm run build` qil, yasalgan fayllarni ham commit qil. Pages workflow faqat `npm test` qiladi, build qilmaydi.
- Sayt matni yangi alifboda: ö ğ ş ç, tutuq belgisi `ʼ` (U+02BC), eski lotindagi `oʻ gʻ` uçun U+02BB. Oddiy `'` ni yangi matnga qoyma. Brend nomi hamma versiyada "Yozgiç".
- Sayt (web/, site/) özgarişlarini: testlar ötsa, telefon (375 px) va desktop (1280 px) kengligida tekşirib, main'ga push qilsang böladi — menga söramay. Push'dan oldin `git fetch` qilib main'ni yangila (boşqa sessiyalar ham main'ga yozadi). Deploy tugagach jonli saytda tekşir.
- Quyidagilardan OLDIN menga sör: Mac/Windows reliz (GitHub release), DNS, fayl/branch öçiriş, pullik narsa, taşqi xizmatlarga yoziş.
- Har bir GitHub release'da IKKALA fayl bölişi şart: `YangiAlifbo.zip` (Mac) va `YangiAlifbo-windows-beta.exe`. Sayt `releases/latest/download/...` ga havola qiladi; exe'siz reliz Windows tugmasini buzadi. Mac-only relizda exe'ni oldingi relizdan qayta yuklab qoş.
- `web/google396f2aa9859a3337.html` va `web/index.html` dagi `yandex-verification` meta tegini öçirma (Search Console / Yandex Webmaster tasdiği). `CNAME` fayl qöşma (domen `gh api` orqali sozlangan).
- Ahost DNS panelida faqat "Добавить запись" va qatorni öçiriş işlaydi; özgarişni `dig @rdns1.ahost.uz` bilan tekşir.
- Mac ilovasi nomi atayin "Yangi alifbo" bölib qoladi (Accessibility yozuvi şu nomda), sayt brendi esa "Yozgiç".
- Yangi xususiyat yoki xato tuzatişda avval yiqiladigan test yoz, keyin kod. "Işladi" deyişdan oldin buyruqni işga tuşirib, natijasini körsat.

## 2-bosqiç: qolgan işlar (xulosadan keyin menga taklif qil, tanlaganimni qil)

1. **Köp sahifali sayt uçun yakuniy kod tekşiruvi tugamagan (eng muhim).** 14 vazifaning hammasi bajarilib, push qilingan va saytda işlayapti, lekin butun özgarişni körib çiqadigan yakuniy review natija bermasdan uzilib qolgan. Diapazon: `6e841283..d170be9c`. Faqat qöl bilan yozilgan manbalar diffi tayyor: `.superpowers/sdd/2026-10-24-kop-sahifali-sayt/review-source.diff` (yasalgan HTML'larsiz). Rejaning "Review Focus" bölimiga qarab tekşir. Jiddiy xatolarni test bilan tuzat, mayda xatolarni `progress.md` ga "minor (deferred)" qilib yoz.
2. **Mac 2.0.3 da sinalmaganlar:** menyudagi "Yangilaş" tugmasi Terminal'ni oçişi; ekrandagi bir martalik "yangi versiya" xabari; Chrome'dagi sayt maydonlarida `c b ⌫ h → ç`. Kiçik qolgan xatolar: har `⌫` da Accessibility'ga 3 ta sörov (sekin ilovalarda keçikiş); `ö↑` körinib turganda çap tugma dasturni öçiradi; ruxsat haqidagi eski menyu qatorida `ʼ` örniga `'`.
3. **Windows beta haqiqiy kompyuterda heç sinalmagan** — faqat CI'dagi Notepad testi bor. Qöl bilan sinaş rejasini tayyorla (qaysi dasturlar, qaysi holatlar).
4. **Eski mayda xatolar** (`.superpowers/sdd/2026-10-22-yangi-alifbo/progress.md` dagi "minor (deferred)"): yopiluvçi qoştirnoq `o'`/`g'` dan keyin ö/ğ bölib qolişi ('kino'), base layout ABC'ga majburlanmagani, ⌥ bilan yozilgan ‘ ’, `Registration.install` yoqiş muvaffaqiyatsiz bölsa ham true qaytariši, uninstall avval boşqa klaviaturaga ötmasligi, konverterda `tutuq:false` kirill ъ/сҳ uçun hisobga olinmasligi, macOS CI va KeyMapper testlari yöqligi. Ularning qaysi biri hali ham borligini tekşirib, ro'yxat ber — ayrimlari keyin tuzalgan bölişi mumkin.
5. **SEO:** Google'da sayt indekslangan, lekin hali çiqmayapti; Google faqat aynan sözni topadi (`uçun` topiladi, `uchun` yöq). Şuning uçun eski lotin va kirill sözlar körinadigan matnda bölişi kerak (`web/test/seo.test.mjs` buni qöriqlaydi). `/kr/` alohida statik kirill sahifa tayyor. Qolgani: Yandex Webmaster'ga sitemap qöşiş (u paytda bölim faqat öqiş rejimida edi), `site:yozgich.uz uchun` bilan tekşiriş. Backlink'larni men özim qilaman.
6. **Tekşirilmagan matn:** telefonda yoziş yöriqnomasining Android bölimi haqiqiy Android'da sinalmagan.
7. **Kelajak ğoyalari (faqat men aytganda):** pullik "Pro" — AI imlo tekşiruvi Pro'da, Hunspell lug'at tekşiruvi bepul qoladi (hali heç narsa qurilmagan; sayt statik, tölov uçun backend kerak böladi). Raqib yangicha.uz da bor, bizda yöq: şriftlar auditi, Telegram bot, Linux klaviaturasi, platforma sahifalarida interaktiv klaviatura xaritasi.
8. **Tozalaş (menga söramasdan qilma):** `.claude/worktrees/` dagi 5 ta eski worktree va `backup/kr-static-c5524b7`, `fix/windows-backspace-context`, `build/v1`, `claude/*` branch'lar — ularning işi main'ga qöşilib bölgan.

Boşlaş: 1-bosqiçni bajar va xulosani ber. Keyin 2-bosqiçdagi 1-band (yakuniy kod tekşiruvi) bilan boşlaşni taklif qil.

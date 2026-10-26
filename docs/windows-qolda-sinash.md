# Windows betaʼni haqiqiy kompyuterda sinaş rejasi

Bu reja haqiqiy qurilma natijasi emas, uni bajariş tartibi. Hozirgi dalil
faqat GitHub Actionsʼdagi Notepad smoke testi va 80/30/10/3 ms tezlik testi.
Har bandni bajarib, natijani oxiridagi jadvalga yozing. Sinalmagan bandni
ötgan deb belgilamang.

**Kim:** Windows kompyuteri bor har kim, dasturçi bölişi şart emas.
**Vaqt:** P0 bandlari ~25 daqiqa, hammasi ~60 daqiqa.
**Muhim:** haqiqiy parol, yuboriladigan xabar yoki zararli buyruq bilan sinamang.

## Ustuvorlik

| Daraja | Maʼnosi | Relizga taʼsiri |
|---|---|---|
| **P0** | Örnatiş, asosiy harflar, yoqiş/öçiriş | Bittasi yiqilsa — «beta» qoladi, avval tuzatiladi |
| **P1** | Kundalik dasturlar, Backspace, avtomatik işga tuşiş | Yiqilsa — issue oçiladi, saytda çeklov sifatida yoziladi |
| **P2** | Kam işlatiladigan layout va holatlar | Faqat qayd qilinadi |

«Beta» belgisini olib taşlaş şarti: Windows 11 da hamma P0 ötgan, P1 dagi
yiqilganlar issue sifatida yozilgan va saytda aytilgan. Windows 10 da ham
P0 ötsa — yanada yaxşi, lekin şart emas.

## 0. Tayyorgarlik

1. Yozib qöying: Windows versiyasi (`Win + R` → `winver`), 10 yoki 11,
   klaviatura layoutʼi (pastki öng burçakdagi `ENG`/`RUS`), brauzer.
2. Sinov boşida layout **English (US)** bölsin.
3. Ekranni videoga yozişni yoqing: Windows 11 da `Win + Shift + R`
   (Snipping Tool) yoki `Win + Alt + R` (Xbox Game Bar). Xato çiqsa video
   eng yaxşi dalil.
4. Bitta toza Notepad oynasini oçib qöying.

## 1. Yuklab oliş va işga tuşiriş — P0

| # | Amal | Kutiladigan natija |
|---|---|---|
| 1.1 | Chrome yoki Edgeʼda `yozgich.uz` oçing | Asosiy tugma «Windows uçun yuklab oliş» deb yozilgan |
| 1.2 | Tugmani bosing | `YangiAlifbo-windows-beta.exe` (~1,3 MB) yuklanadi. Brauzer ogohlantirsa — «Keep» / «Saqlab qoliş» |
| 1.3 | Windows Defender yoki antivirus faylni öçirdimi, karantinga oldimi? | Yöq. **Öçirsa — P0 xato**: antivirus nomi va xabar matnini ekran rasmi bilan yozing |
| 1.4 | Faylni işga tuşiring | SmartScreen «Windows protected your PC» çiqadi → **More info → Run anyway**. Boşqa oyna oçilmaydi |
| 1.5 | Soat yonidagi tray ikonkalariga qarang (`^` strelka içida bölişi mumkin) | Yaşil «H» ikonka paydo böldi. Siçqonçani ustiga olib borsangiz: «Yangi alifbo — yoqilgan» |
| 1.6 | Faylni yana bir marta işga tuşiring | Ikkinçi ikonka paydo bölmaydi (eski nusxa almaşadi) |

> 1.5 dagi «H» — AutoHotkeyʼning standart ikonkasi, bizniki emas. Bu
> xato emas, lekin foydalanuvçi tanimasligi mumkin: alohida qayd qiling.

## 2. Saytdagi sinov maydoni — P0

`yozgich.uz` → «Sinab köring» kartasi (yuklab oliş bloki yonida) →
«Işladimi? Şu yerga yozib köring». Qöl bilan, harfma-harf yozing.

| # | Yozasiz | Kutiladigan natija |
|---|---|---|
| 2.1 | `o'zbek` | `özbek`, maydon ostidagi `ö` çiroği yonadi |
| 2.2 | `shahar choy g'oya` | `şahar çoy ğoya`, hamma çiroqlar yonadi |
| 2.3 | `Ctrl + Alt + Space`, söng `shahar` | Ekranda «Yangi alifbo öçirildi» xabari; matn `shahar` bölib qoladi |
| 2.4 | Yana `Ctrl + Alt + Space`, söng `shahar` | «Yangi alifbo yoqildi»; `şahar` çiqadi |

## 3. Notepadʼda asosiy qoidalar — P0

Har qatorni avval sekin, keyin odatiy tezlikda yozing. Ögirilgan natija
Notepadʼda körinadi.

| # | Yozasiz | Kutiladigan natija |
|---|---|---|
| 3.1 | `o'zbek g'oya shahar choy` | `özbek ğoya şahar çoy` |
| 3.2 | `O'ZBEKISTON SHAHRI` | `ÖZBEKISTON ŞAHRI` |
| 3.3 | `Shahar Choy` | `Şahar Çoy` |
| 3.4 | `ma'no Is'hoq` | `maʼno Isʼhoq` (oddiy `'` → ingiçka `ʼ`) |
| 3.5 | `mashhur ishchi` | `maşhur işçi` (`şh` qayta birikmaydi) |
| 3.6 | `tong singil` | özgarmaydi |
| 3.7 | Tez yoziş: `o'zbek shahar choy g'oya` ni 5 marta ketma-ket, imkon qadar tez | Harf yöqolmaydi, tartib buzilmaydi, ortiqça harf öçmaydi |

## 4. Yoqiş/öçiriş va tray menyusi — P0

| # | Amal | Kutiladigan natija |
|---|---|---|
| 4.1 | Tray ikonkasini öng tugma bilan bosing | Menyu: «Yoqilgan (Ctrl+Alt+Space)» ✓, «Tutuq belgisi ʼ» ✓, «Çiqiş» |
| 4.2 | «Yoqilgan» ni bosing, Notepadʼda `shahar o'zbek` | Matn özgarmaydi; ikonka ustida «öçirilgan» |
| 4.3 | Ikonkani **çap** tugma bilan ikki marta bosing | Yana yoqiladi; `shahar` → `şahar` |
| 4.4 | Notepadʼda `c` yozing, öçiring-yoqing (`Ctrl + Alt + Space` ikki marta), söng `h` | `ch` — eski harf bilan birikmaydi |
| 4.5 | «Tutuq belgisi ʼ» ni öçiring, `ma'no o'zbek` | `ma'no özbek` (tutuq özgarmaydi, `ö` baribir çiqadi) |
| 4.6 | «Çiqiş» | Ikonka yöqoladi, `shahar` özgarmaydi |

## 5. Backspace va kursor — P1

Notepadʼda, `⌫` = Backspace, `←` `→` = strelkalar.

| # | Bosasiz | Kutiladigan natija |
|---|---|---|
| 5.1 | `c b ⌫ h` | `ç` |
| 5.2 | `o x ⌫ '` | `ö` |
| 5.3 | `c ← → h` | `ch` (kursor köçsa, eslab qolingan harf unutiladi) |
| 5.4 | `c`, siçqonça bilan boşqa joyni bosing, qaytib `h` | `ch` |
| 5.5 | `c`, `Ctrl + A`, `⌫`, `h` | faqat `h` |
| 5.6 | `c`, `Enter`, `h` | ikkinçi qatorda faqat `h` |
| 5.7 | `cbh ← ⌫` | `ch` — **maʼlum çeklov**, Windowsʼda örtadagi öçiriş birikmaydi |

## 6. Kundalik dasturlar — P1

Har dasturda bitta jumla yozing: `O'zbekiston shahrida choy ichdik, ma'no bor.`
Kutiladigan natija: `Özbekiston şahrida çoy içdik, maʼno bor.`
Söng 5.1 (`c b ⌫ h`) ni takrorlang.

| # | Dastur | Qöşimça tekşiruv |
|---|---|---|
| 6.1 | Word yoki LibreOffice Writer | `Ctrl + Z` bir marta — faqat oxirgi özgariş qaytadi, matn buzilmaydi |
| 6.2 | Chrome: Google qidiruv maydoni | Taklif röyxati çiqsa ham harf yöqolmaydi |
| 6.3 | Chrome: manzil qatori, `yoz` yozing (taklif avtomatik tölsin), `⌫`, `h` | Natijani yozing: ortiqça harf öçdimi yoki yöqmi (**maʼlum xavf**) |
| 6.4 | Edge (6.2 ni takrorlang) | — |
| 6.5 | Telegram Desktop xabar maydoni | `Shift + Enter` yangi qator; **xabarni yubormang** |
| 6.6 | VS Code yoki boşqa kod muharriri | `Ctrl + C / V / Z / S` odatdagidek işlaydi |
| 6.7 | Excel yoki Google Sheets yaçeykasi | Harflar yaçeykada töğri |
| 6.8 | `Ctrl + C`, `Ctrl + V` bilan `shahar` sözini joylaş | Joylangan matn **özgarmaydi** (faqat yozilgan matn ögiriladi) |
| 6.9 | `Alt + Tab`, `Win + D`, `Win + E` | Yorliqlar odatdagidek işlaydi |

## 7. Layoutlar — P1 / P2

| # | Layout | Amal | Kutiladigan natija |
|---|---|---|---|
| 7.1 | Russian (P1) | `шахар чой` yozing | Kirill matni özgarmaydi |
| 7.2 | Russian (P1) | `Ctrl + Alt + Space` | Yoqiş/öçiriş işlaydi, layout almaşmaydi |
| 7.3 | Uzbek (Latin), agar örnatilgan bölsa (P2) | `o` + apostrof tugmasi | `ö` çiqadimi? Tugma qaysi belgini berganini yozing (`ʻ` yoki `'`) |
| 7.4 | US-International (P2) | `o'` va `ma'no` | Dead key apostrofni qanday yuborganini yozing; hozirça kafolatlanmagan |
| 7.5 | AltGr bor layoutlar (Polish, German) (P2) | `AltGr + Space` | Tasodifan yoqiş/öçiriş bölib qolmasligini tekşiring |

## 8. Kompyuter qayta yoqilganda — P1

| # | Amal | Kutiladigan natija |
|---|---|---|
| 8.1 | `Win + R` → `shell:startup` → oçilgan papkaga exeʼning yorliğini qöying (exe ni sudrab, `Alt` bosib turib taşlang) | Papkada yorliq paydo böldi |
| 8.2 | Kompyuterni qayta yoqing | Tray ikonkasi özi paydo böladi, `shahar` → `şahar` |
| 8.3 | Qayta yoqişdan oldin tutuqni öçirib qöygan bölsangiz | **Hozirgi kod sozlamani saqlamaydi**: tutuq va yoqilgan holat yana yoqiq bölib qoladi. Kutilgan holat, lekin qayd qiling |
| 8.4 | Uyqu rejimidan (`Sleep`) çiqing | Ikonka joyida, ögiriş işlaydi |

## 9. Maʼlum çeklovlar — faqat qayd qiling

- **Administrator huquqi bilan oçilgan dasturlar** (Task Manager,
  «Run as administrator» bilan oçilgan PowerShell): Yozgiç ularda
  işlamasligi kutiladi, çunki dastur oddiy huquq bilan işlaydi. Tekşirib,
  natijani yozing.
- Masofadan ulanış (Remote Desktop, AnyDesk) va önlayn öyinlar sinalmaydi.
- Ekrandagi matnni dastur öqimaydi: dasturning özi belgilagan matn (6.3)
  bilan xato birikiş mumkin.

## 10. Olib taşlaş

«Çiqiş» → `shell:startup` dagi yorliqni öçiring → exe faylni öçiring.
Kompyuterda boşqa iz qolmaydi (dastur registrga yoki boşqa papkaga
yozmaydi). Qayta yoqib, ikonka yöqligini tekşiring.

## Natija jadvali

Har band uçun bitta qator. Hammasini yozib, video bilan birga yuboring
(GitHub issue: https://github.com/behruz-baxodirov/yangi-alifbo/issues
yoki Telegram).

```
Kompyuter: Windows __ (build ____), layout ____, brauzer ____
Yozgiç: YangiAlifbo-windows-beta.exe, yuklangan sana ____

| #   | Natija (✓ / ✗ / sinalmadi) | Nima çiqdi (✗ bölsa) | Necha marta takrorlandi |
|-----|-----------------------------|----------------------|--------------------------|
| 1.1 |                             |                      |                          |
| ... |                             |                      |                          |
```

Harf yöqolişi, notöğri öçiriş, dastur işdan çiqişi yoki antivirus
bloklaşi — jiddiy xato, relizdan oldin tuzatiladi. Faqat sekinlik bölsa,
dastur nomi va taxminiy keçikişni yozing.

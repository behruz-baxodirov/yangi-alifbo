# Macʼda qölda sinaş

Bu röyxat **qöl sinovlari ötganini bildirmaydi**. 2.0.4 uçun 59 XCTest,
universal yiğiş, plist va imzo tekşiruvi ötgan. Quyidagi holatlar haqiqiy
klaviatura va ekranda alohida tasdiqlanadi.

## Boşlanğiç holat

- macOS, Chrome, Yangi alifbo versiyasi va faol klaviatura layoutʼini yozing.
- Menyu-barda `ö` — yoqilgan; `A` — öçiq; `⚠︎` — ruxsat kerak.
  Sinov oldidan holatni qayd qiling, tugagach avvalgi holatga qaytaring.
- Matnni qöl bilan harfma-harf yozing. Joylaş yoki brauzerning DOM
  hodisalari tizim klaviatura kuzatuvçisini tekşirmaydi.
- Haqiqiy parol, terminal buyruği yoki yuboriladigan xabar bilan sinamang.

## Chrome va TextEdit

Chromeʼda `https://yozgich.uz/` → «Işladimi? Şu yerga yozib köring» maydoni;
TextEditʼda yangi, saqlanmagan oddiy matn hujjati. Har holatni boş maydonda
kamida 3 marta, avval sekin, keyin odatiy tezlikda bajaring.

| Amal | Kutiladigan natija |
|---|---|
| `c`, `b`, Backspace, `h` | `ç`. |
| `s`, `a`, Backspace, `h` | `ş`. |
| `o`, `x`, Backspace, ASCII apostrof | `ö`. |
| `c`, `b`, `h`, Left, Backspace | `ç`; kursor natijaning oxirida. |
| `o'zbek shahar choy g'oya ma'no` | `özbek şahar çoy ğoya maʼno` (tutuq yoqilgan). |
| `c`, Left, Right, `h` | `ch`; kursor köçişi oldingi kontekstni uzadi. |
| `c`, hammasini tanlaş, Backspace, `h` | `h`; öçirilgan harf bilan birikmasin. |
| Bir maydonda `c`, boşqa maydonda `h` | Ikkinçi maydonda faqat `h`. |
| Option orqali `‘` yoki `’` bilan `o`/`g` yoziş | `ö`/`ğ`; layout aynan şu apostrofni çiqarganini tekşiring. |
| Cmd+C/V/Z, Cmd+A, Control yorliqlari | Odatdagi vazifa saqlansin; matn tartibi buzilmasin. |
| Klaviatura öçiq holatda `ch sh o'` | Matn özgarmasin. |

Chromeʼning konverter textareaʼsida ham birinçi tört holatni takrorlang;
natijani öngdagi konverter çiqişidan emas, **kiriş maydonidan** öqing.
Manzil qatoridagi autocompleteʼni yubormasdan sinaş mumkin: tanlangan
taklif öçirilganda ortiqça harf öçmasligini qayd qiling.

## Yangilaş menyusi va Terminal

Bu sinov uçun örnatilgan versiya relizdan eski bölişi kerak; 2.0.4 da
oxirgi reliz ham 2.0.4 bölsa, `↑` yöqligi töğri natija.

1. Yangi versiya topilgach `ö↑` yoki `A↑` belgisini **çap** tugma bilan bosing.
   Yangilaş menyusi oçilsin; yoqilgan/öçiq holat özgarmasin.
2. Yangilaş bandini tanlang. Oynada yangi versiya, «Yangilaş»,
   «Nimalar yangi?» va «Keyinroq» körinsin. «Keyinroq» örnatişni boşlamasin.
3. Yangilaş oynasini qayta oçib «Yangilaş»ni bosing. Bu haqiqiy örnatişni
   bajaradi: Terminal oçilib `curl -fsSL https://yozgich.uz/install.sh | bash`
   buyruğini körsatişi, installer yangi nusxani işga tuşirişi kerak.
4. Terminal natijasi va ilova menyusidagi versiyani qayd qiling.
   Accessibility qayta ruxsat sörasa, uni egasi tasdiqlaydi; avtomatik
   test bu tizim ruxsatini berilgan deb hisoblamaydi.
5. Yangilangandan keyin eski `↑` belgisi yöqolsin. Klaviaturaning avvalgi
   yoqilgan/öçiq holati va yorliq sozlamasi saqlansin.

## Bir martalik xabar

- Haqiqiy yangi versiya birinçi marta topilganda ekranda «Yangi versiya
  bor: …» xabari taxminan 5 soniya körinsin; ekran videosi bilan qayd qiling.
- Dasturdan çiqib qayta oçing. Şu versiya haqidagi xabar takrorlanmasin;
  yangilaş tugamagunça menyudagi `↑` qoladi.
- Oldin topilgan, hali eʼlon qilinmagan versiyaning qayta oçilişdagi xabari
  XCTest bilan qoplangan; haqiqiy UI sinovi uçun şu holat qayta yaratilmasa,
  natijani «sinalmagan» deb qoldiring. Soxta kelajak relizini qöşmang.

## Alohida muhitlar

US-International kabi dead-key layout, eski 1.x dan migratsiya va sekin
ilovadagi Backspace keçikişi alohida qayd qilinadi. Harf yöqolişi yoki
notöğri öçiriş jiddiy xato; faqat sekinlik bölsa vaqt va ilova nomini yozing.
`'kino'` oxiridagi ASCII apostrof noaniqligi maʼlum çeklov bölib qoladi.

Natija şakli: **ilova / versiya / layout / yoqilgan holat / kiriş / kutilgan /
çiqqan / takrorlaniş soni / ekran rasmi yoki video**. Sinalmagan bandni
ötgan deb belgilamang.

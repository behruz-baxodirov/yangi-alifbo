# Windows betaʼni qölda sinaş

Bu reja haqiqiy qurilma natijasi emas. Boşlanğiç dalil: GitHub Actionsʼdagi
Notepad smoke testi va 80/30/10/3 ms tezlik testi. 2026-10-24 tekşiruvida
eng sönggi Windows workflowʼlari muvaffaqiyatli tugagan.

## Muhit va dasturlar

Windows 11 va imkon bölsa Windows 10; oddiy foydalanuvçi huquqi;
avval English (US), keyin rusça va US-International joylaşuvlari.
Sinov natijasiga Windows, dastur, layout va Yozgiç versiyasini yozing.

| Dastur/maydon | Nima tekşiriladi |
|---|---|
| Notepad | Asosiy qoidalar, katta harflar, Backspace va tez yoziş. |
| Word yoki LibreOffice Writer | Formatlangan matn, Enter, tanlov, undo/redo. |
| Chrome va Edge | Oddiy input, textarea, contenteditable va manzil qatori taklifi. |
| Telegram Desktop | Xabar maydoni, Shift+Enter, yuborişdan oldingi matn. Sinov xabarini yubormang. |
| VS Code | Editor, qidiruv, yorliqlar va Yozgiç öçirilgan holat. |
| Windows Terminal/PowerShell | Yoqilgan/öçiq holat, Ctrl kombinatsiyalari. Faqat zarar qilmaydigan matn bilan. |
| Oddiy lokal parol sinov maydoni | Haqiqiy parol işlatmasdan xavfsiz maydon xatti-harakati. |

## Sinov holatlari

| Yoziş yoki amal | Kutiladigan natija |
|---|---|
| `oʼzbek`, `gʼoya`, `shahar`, `choy` | `özbek`, `ğoya`, `şahar`, `çoy`. Kiritişda oddiy ASCII apostrofni ham sinaş şart. |
| `Isʼhoq`, `maʼno`, `mashhur`, `ishchi`, `ng` | `Isʼhoq`, `maʼno`, `maşhur`, `işçi`, `ng`. |
| `OʼZBEKISTON SHAHRI`, `Shahar`, `sHahar` | `ÖZBEKISTON ŞAHRI`, `Şahar`, `şahar`. |
| `c b ⌫ h`, `o x ⌫ apostrof`, `s a ⌫ h` | `ç`, `ö`, `ş`. |
| `c ← → h` | `ch`: kursor köçganda kontekst unutiladi. |
| `cbh ← ⌫` | Windowsʼda hozirça `ch`; örtadagi öçirişdan keyin birikiş qöllanmagan. |
| Ctrl+A, tanlovni öçiriş, söng `h` | Eski kontekstdan tasodifiy `ş/ç` paydo bölmasin. |
| Manzil qatorida autocomplete → Backspace → `h` | Alohida qayd qiling: avtomatik tanlovni AHK öqimaydi, xato birikiş ehtimoli bor. |
| Enter, Tab, strelka, siçqonça, oyna almaştiriş | Oldingi maydon harfi bilan birikmasin; matn yöqolmasin. |
| Ctrl+C/V/Z/Y, Alt+Tab, Win yorliqlari | Yorliq vazifasi saqlansin; clipboard matni avtomatik ögirilmasin. |
| Ctrl+Alt+Space va tray menyusi | Öçiq holatda matn özgarmasin, qayta yoqilganda eski kontekst qolmasin. |
| Tutuq sozlamasi öçirilgan | ASCII apostrofli `ma'no` saqlansin, `o'` baribir `ö` bölsin. |
| Sekin → tez yoziş, tugmani bosib turiş | Harf tartibi buzilmasin, ortiqça öçiriş/qöşiliş bölmasin. |
| Rusça layout | Kirill matni lotin harflariga almaşmasin. |
| US-International va dead keys | Apostrof va qoştirnoq qaysi hodisa bilan kelişini qayd qiling; hozirça kafolatlanmagan. |

67 umumiy fixtureʼni Notepadʼda töliq yozib tekşiriş, söng eng köpi
işlatiladigan dasturlarda asosiy jumlani takrorlaş kerak. Qöyib joylaş
harfma-harf yoziş testining örnini bosmaydi.

Natija şakli: **dastur / layout / kiriş ketma-ketligi / kutilgan / çiqqan /
takrorlaniş soni / video yoki ekran rasmi**. Harf yöqolişi, notöğri öçiriş yoki
dastur işdan çiqişi relizdan oldin tuzatiladigan jiddiy muammo hisoblanadi.
Maʼlum çeklovni qayd qiling; tasdiqlanmagan holatni ötgan deb belgilamang.

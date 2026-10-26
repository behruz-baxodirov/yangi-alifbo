# Yangi alifbo — Windows (beta)

> Beta: bu versiya hali haqiqiy Windows kompyuterda qöl bilan sinalmagan. Faqat GitHub Actions'dagi avtomatik test (Notepad'ga yozib tekşiradi) bor. Qöl bilan sinaş rejasi: [docs/windows-qolda-sinash.md](../docs/windows-qolda-sinash.md).

## Qanday işlaydi

`YangiAlifbo.exe` tray'da (soat yonida) turadi va siz yozganingizni kuzatadi:

| Yozasiz | Çiqadi |
|---|---|
| `o'` | `ö` |
| `g'` | `ğ` |
| `sh` | `ş` |
| `ch` | `ç` |
| `s'h` | `sʼh` (Isʼhoq) |
| `ma'no` | `maʼno` |

Windows'dagi usul macOS'dagidan farq qiladi: harf avval ekranga çiqadi, keyin dastur uni `Backspace` bilan öçirib, yangi harfni qöyadi.

## Adaşgan harfni öçiriş

Backspace faqat oxirgi harfni öçiradi, oldingisini dastur eslab qoladi: `c`, `b`, `⌫`, `h` yozsangiz `ç` çiqadi, `o`, `x`, `⌫`, `'` — `ö`.

Strelka, Enter, Tab, Ctrl+Backspace yoki siçqonça bosilsa, dastur kursor qayerda turganini bilmaydi va eslab qolganini unutadi — keyingi `h` oddiy `h` bölib qoladi.

Çeklov: dastur ekrandagi matnni öqimaydi. Agar matnni dasturning özi belgilagan bölsa (masalan, brauzer manzil qatori taklifi) va Backspace faqat şu belgilangan qismni öçirsa, keyingi `h` yoki `'` notöğri birikişi mumkin. Örtadagi harfni öçiriş (`cbh` → `←` → `⌫`) Windowsʼda hozirça birikmaydi.

## Yoqiş va öçiriş

- **Ctrl + Alt + Space**
- yoki tray'dagi ikonkani bosib "Yoqilgan" bandini tanlang.

## Örnatiş

1. GitHub Releases'dan `YangiAlifbo.exe` ni yuklab oling.
2. Işga tuşiring. Windows SmartScreen "Unknown publisher" deb ogohlantiradi: **More info → Run anyway** ni bosing. Dastur imzolanmagan, çunki u bepul.
3. Kompyuter yoqilganda avtomatik ishga tushishi uçun: `Win + R` → `shell:startup` → exe'ning yorliğini (shortcut) şu papkaga qöying.

## Manba koddan yiğiş

AutoHotkey v2 va Ahk2Exe kerak:

```
Ahk2Exe.exe /in windows\YangiAlifbo.ahk /out YangiAlifbo.exe /base "C:\Program Files\AutoHotkey\v2\AutoHotkey64.exe"
```

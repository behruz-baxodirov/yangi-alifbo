# Yangi alifbo — Windows (beta)

> Beta: bu versiya hali haqiqiy Windows kompyuterda qöl bilan sinalmagan. Faqat GitHub Actions'dagi avtomatik test (Notepad'ga yozib tekşiradi) bor.

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

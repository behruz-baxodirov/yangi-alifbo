# Yangi alifbo

Yangi özbek lotin alifbosida (ЎРҚ-1184-son Qonun, 21.10.2026) odatdagidek yozing:

| Yozasiz | Çiqadi |
|---|---|
| `o'` | `ö` |
| `g'` | `ğ` |
| `sh` | `ş` |
| `ch` | `ç` |
| `s'h` | `sʼh` (Isʼhoq, asʼhob) |
| `ma'no` | `maʼno` (tutuq belgisi ʼ) |

## macOS

Terminal'da:

```bash
curl -fsSL https://behruz-baxodirov.github.io/yangi-alifbo/install.sh | bash
```

> **Diqqat:** Releases'dagi `YangiAlifbo.zip` ni brauzer orqali yuklab, qöl bilan oçmang. Ilova Apple sertifikati bilan imzolanmagan (loyiha bepul), şuning uçun macOS uni *"YangiAlifbo.app is damaged and can't be opened"* deb bloklaydi. Yagona töğri yöl — yuqoridagi Terminal buyruği: u faylni özi yuklab, kerakli joyga qöyadi va klaviaturani yoqadi.

Yoqiş va öçiriş: **🌐 (Fn)** yoki **⌃ Control + Space**. Klaviatura macOS'ning odatiy input source'i: hech qanday ruxsat söramaydi va hamma dasturda işlaydi.

Öçiriş:

```bash
curl -fsSL https://behruz-baxodirov.github.io/yangi-alifbo/uninstall.sh | bash
```

## Windows (beta)

[windows/README.md](windows/README.md)

## Tuzilişi

- `core/fixtures/cases.json` — klaviatura va konverter uçun umumiy test holatlari.
- `mac/` — Swift package: `AlifboCore` (holat mashinasi) va `YangiAlifbo` (InputMethodKit ilovasi).
- `web/` — konverter (`converter.js`), örnatiş skriptlari, sayt maketlari (`web/mockups/`).
- `windows/` — AutoHotkey v2 versiyasi.

## Yiğiş va test

```bash
swift test --package-path mac
```

```bash
node --test web/converter.test.mjs
```

```bash
bash mac/scripts/build.sh
```

Muallif: [@behruz_si](https://instagram.com/behruz_si). Bepul va oçiq kod.

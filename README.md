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
curl -fsSL https://yozgich.uz/install.sh | bash
```

> **Diqqat:** Releases'dagi `YangiAlifbo.zip` ni brauzer orqali yuklab, qöl bilan oçmang. Ilova Apple sertifikati bilan imzolanmagan (loyiha bepul), şuning uçun macOS uni *"YangiAlifbo.app is damaged and can't be opened"* deb bloklaydi. Yagona töğri yöl — yuqoridagi Terminal buyruği: u faylni özi yuklab, kerakli joyga qöyadi va klaviaturani yoqadi.

Dastur menyu-barda (**ö**) fonda işlaydi: til almaştiriş şart emas, istalgan dasturda lotin klaviaturasida yozganingiz özi ögiriladi (rus klaviaturasiga tegmaydi).

- **Birinçi işga tuşganda** macOS Accessibility ruxsatini söraydi: System Settings → Privacy & Security → Accessibility → **Yangi alifbo**ni yoqing. Yangilangandan keyin ham qayta söraşi mumkin (dastur Apple sertifikati bilan imzolanmagan).
- **Yoqiş/öçiriş:** ⇧ Shift'ni ikki marta tez bosing yoki menyu-bardagi **ö** ni bosing (öçiq paytda **A**). Ekranda qisqa xabar çiqadi.
- **Boşqa tugma:** **ö** ustida öng tugma → *Yoqiş/öçiriş tugmasi* → Shift / Option / Control ikki marta, ⌃ Space, ⌘ ⇧ Space yoki faqat belgi.

Öçiriş:

```bash
curl -fsSL https://yozgich.uz/uninstall.sh | bash
```

## Windows (beta)

[windows/README.md](windows/README.md)

## Tuzilişi

- `core/fixtures/cases.json` — klaviatura va konverter uçun umumiy test holatlari.
- `mac/` — Swift package: `AlifboCore` (Composer, Rewriter va sof mantiq), `YangiAlifbo` (Accessibility/CGEventTap menyu-bar dasturi), XCTest testlari.
- `site/` — sahifa manbalari va Node generatori: tört versiyadagi natija `web/` ga yoziladi va commit qilinadi.
- `web/` — konverter (`converter.js`), örnatiş skriptlari; sayt maketlari `.impeccable/mockups/` da.
- `windows/` — AutoHotkey v2 versiyasi.

## Yiğiş va test

```bash
swift test --package-path mac
```

```bash
npm test
npm run build
```

```bash
bash mac/scripts/build.sh
```

`npm run build` dan keyin generator natijasida yangi Git farqi qolmasligi kerak.
Pages workflow tayyor `web/` ni deploy qiladi, generatorni işga tuşirmaydi.
Mac CI sof mantiq, KeyMapper, menyu va yangilaniş testlarini hamda universal yiğişni tekşiradi.

Muallif: [@behruz_si](https://instagram.com/behruz_si). Bepul va oçiq kod.

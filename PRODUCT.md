# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/vanilla JS without a framework. A dependency-free Node generator builds `site/` into committed `web/` files; GitHub Pages tests and deploys that output without rebuilding it. Four versions: new Latin, old Latin, Cyrillic and Russian.

## Users

Ordinary Uzbek people reached through the owner's Instagram (@behruz_si): mostly opening the link on a phone, some on a Mac. Their job: start writing in the new Uzbek Latin alphabet (law ЎРҚ-1184, signed 21.10.2026, in force 22.04.2027) without learning new key positions, and convert existing text.

## Product Purpose

"Yozgiç" lets people type the new alphabet with old habits: `o'`→`ö`, `g'`→`ğ`, `sh`→`ş`, `ch`→`ç`, `s'h`→`sʼh`, tutuq `ʼ`. Three parts: a free macOS menu-bar app, a Windows beta and an online converter. The site also offers word pages, name cards, typing practice, document conversion, articles and a widget. Success: a visitor installs on Mac in about a minute, or converts text on the phone in seconds.

## Positioning

A macOS background menu-bar app using CGEventTap and Accessibility permission. It keeps the active keyboard layout and toggles by double Shift or the menu-bar symbol; the shortcut is configurable. Free and open source. The `s'h` rule follows the law's own spelling (Isʼhoq) instead of a word list.

## Operating Context

Visitors arrive from an Instagram post or bio link, often mid-scroll on a phone. Mac users copy one command into Terminal. Windows beta is available, with automated Notepad tests; real-device validation is still pending.

## Capabilities and Constraints

- Site copy is written in the new alphabet itself.
- Device-aware first screen: on a Mac the install command leads; on a phone the converter leads, with a note to open the link on the Mac.
- Converter runs fully in the browser (no server, text never leaves the device).
- The Mac app checks GitHub for a release version at most once per 24 hours after a server response; this can be disabled. It does not send typed text.
- Official orthography rules are not yet published; the converter follows the law and press reports. Must not claim to be official or government-endorsed.

## Brand Commitments

- Name: "Yozgiç" (domain yozgich.uz, chosen 2026-10-22). The macOS app and its Accessibility entry are still named "Yangi alifbo".
- Author credit: Instagram @behruz_si.
- Register chosen by the owner: national-modern ("milliy-zamonaviy") — Uzbek graphic traditions in a contemporary rendering, not old-fashioned.

## Evidence on Hand

No user counts, testimonials or press. Real facts available: the law number and dates, the letter mapping, the install command. Do not invent download counts or endorsements.

## Product Principles

1. Old habits in, new alphabet out: never ask people to learn a layout.
2. Honest about limits (beta, untested Windows, unofficial rules).
3. Nothing leaves the device.
4. One step to try: copy one command, or paste one text.

## Accessibility & Inclusion

Readable on low-end Android phones and in Instagram's in-app browser; works without JavaScript for the install instructions.

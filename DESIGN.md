---
name: Yozgiç
description: Type the new Uzbek alphabet with old habits; letters stamped into a non with a çekiç.
colors:
  crust: "#cf8a33"
  crust-hi: "#e19a42"
  rim: "#a85d1b"
  rim-edge: "#7d4210"
  dough: "#f0cf97"
  pip: "#6b3510"
  char: "#17110d"
  char-soft: "#3d220c"
  clay: "#9c3b22"
  flour: "#fbf6ec"
  slab-ink: "#e9d6b4"
  slab-well: "#2a2019"
typography:
  display:
    fontFamily: "Doto, monospace"
    fontSize: "clamp(30px, 2.9vw, 42px)"
    fontWeight: 900
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  display-close:
    fontFamily: "Doto, monospace"
    fontSize: "clamp(40px, 6vw, 72px)"
    fontWeight: 900
    lineHeight: 1
  headline:
    fontFamily: "Doto, monospace"
    fontSize: "clamp(28px, 2.6vw, 36px)"
    fontWeight: 900
    lineHeight: 1
  headline-sm:
    fontFamily: "Doto, monospace"
    fontSize: "32px"
    fontWeight: 900
    lineHeight: 1
  numeral:
    fontFamily: "Doto, monospace"
    fontSize: "18px"
    fontWeight: 900
    lineHeight: 1
  logo:
    fontFamily: "Doto, monospace"
    fontSize: "26px"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "0.01em"
  lede:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.55
  title:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.3
  output:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.6
  body:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1
  tag:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1
  caption:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.55
rounded:
  corner: "3px"
  non: "50%"
spacing:
  cell: "12px"
  gutter: "clamp(16px, 4vw, 40px)"
  max: "1180px"
  slab: "22px"
  panel: "28px"
  column: "48px"
  hero-column: "56px"
  section: "72px"
components:
  button-primary:
    backgroundColor: "{colors.crust}"
    textColor: "{colors.char}"
    typography: "{typography.label}"
    rounded: "{rounded.corner}"
    padding: "0 18px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.crust-hi}"
    textColor: "{colors.char}"
  button-primary-done:
    backgroundColor: "{colors.char}"
    textColor: "{colors.crust}"
  button-big:
    backgroundColor: "{colors.crust}"
    textColor: "{colors.char}"
    rounded: "{rounded.corner}"
    padding: "0 22px"
    height: "48px"
  button-ink:
    backgroundColor: "{colors.char}"
    textColor: "{colors.flour}"
    typography: "{typography.label}"
    rounded: "{rounded.corner}"
    padding: "0 18px"
    height: "44px"
  button-ink-hover:
    backgroundColor: "{colors.slab-well}"
    textColor: "{colors.flour}"
  link-button:
    backgroundColor: "transparent"
    textColor: "{colors.char}"
    padding: "0 10px"
    height: "44px"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.char}"
    rounded: "{rounded.corner}"
    padding: "0 14px"
    height: "40px"
  chip-pressed:
    backgroundColor: "{colors.char}"
    textColor: "{colors.flour}"
  tag:
    backgroundColor: "rgb(23 17 13 / .08)"
    textColor: "{colors.char}"
    typography: "{typography.tag}"
    rounded: "{rounded.corner}"
    padding: "5px 8px"
  tag-hot:
    backgroundColor: "{colors.char}"
    textColor: "{colors.flour}"
    typography: "{typography.tag}"
    rounded: "{rounded.corner}"
    padding: "5px 8px"
  slab:
    backgroundColor: "{colors.char}"
    textColor: "{colors.flour}"
    rounded: "{rounded.corner}"
    padding: "8px 22px 20px"
    width: "600px"
  tab:
    backgroundColor: "transparent"
    textColor: "{colors.slab-ink}"
    rounded: "{rounded.corner}"
    height: "46px"
  tab-hover:
    backgroundColor: "{colors.slab-well}"
    textColor: "{colors.flour}"
  tab-selected:
    backgroundColor: "{colors.crust}"
    textColor: "{colors.char}"
  step-numeral:
    backgroundColor: "{colors.crust}"
    textColor: "{colors.char}"
    typography: "{typography.numeral}"
    rounded: "{rounded.corner}"
    size: "30px"
  command-well:
    backgroundColor: "{colors.slab-well}"
    textColor: "{colors.flour}"
    rounded: "{rounded.corner}"
    padding: "11px 13px"
  converter-panel:
    backgroundColor: "{colors.flour}"
    textColor: "{colors.char}"
    rounded: "{rounded.corner}"
    padding: "{spacing.panel}"
  pane-in:
    backgroundColor: "{colors.flour}"
    textColor: "{colors.char}"
    rounded: "{rounded.corner}"
    height: "260px"
  pane-out:
    backgroundColor: "{colors.dough}"
    textColor: "{colors.char}"
    typography: "{typography.output}"
    rounded: "{rounded.corner}"
    height: "260px"
  key-cap:
    textColor: "{colors.char}"
    rounded: "{rounded.corner}"
    padding: "0 6px"
  non:
    backgroundColor: "{colors.dough}"
    rounded: "{rounded.non}"
    width: "460px"
  closing-band:
    backgroundColor: "{colors.flour}"
    textColor: "{colors.char}"
    padding: "56px clamp(16px, 4vw, 40px) 64px"
---

# Design System: Yozgiç

## Overview

**Creative North Star: "Non va çekiç"**

Letters are stamped into the centre of an Uzbek non with a çekiç, the bread stamp whose pins punch rings of dots into the dough. The whole system is made of that one material: dots. The ground is baked-crust amber with a faint 12px çekiç grid, headings are set in a dot-matrix face, the new letters are drawn on a 5×10 dot grid, dividers are rows of dots, and the hero non shows the apostrophe of o' turning into the two dots of ö as the dots migrate. National-modern register: an Uzbek graphic object rendered flat and contemporary, never ornamental or antique.

Density is calm and large. One drenched amber ground carries everything; the surfaces sit on it by tone alone: black action slabs, flour working fields, and dough, which belongs to the non and to the converter's result. There are no shadows, no pills, no gradients that shade. Everything is flat and stamped.

The site speaks the alphabet it sells. Every line of copy is written in the new alphabet (ö ğ ş ç, tutuq ʼ), and old spellings appear only as the input side of an example.

**Key Characteristics:**
- Drenched crust-amber ground with a 12px çekiç dot grid.
- Dot-matrix display (Doto 900) over a plain humanist body (Onest).
- Flat surfaces separated by tone: char slab, flour field, dough non and dough result.
- 3px corners on every rectangle; round silhouettes only in the non and its dots.
- Dots as the single decorative device: glyphs, dividers, numerals, the converter arrow, the FAQ toggle, the stamp.
- One motion: dots migrating with an exponential ease-out.

## Colors

A baked palette: one drenched crust amber, nigella-black ink, a flour white for working fields, and a single clay red held back for marking change inside the working fields.

### Primary
- **Baked Crust** (crust): the drenched page ground, the browser theme colour, the fill of primary buttons, the selected download tab and the step-numeral squares on the black slab. **Crust Highlight** (crust-hi) is its hover step only.

### Secondary
- **Tandir Clay** (clay): emphasis inside working fields only: the changed letters in the converter output, the text caret, and the closing-band links.

### Tertiary (the non)
- **Dough** (dough): the non's centre, where the letter is stamped, and the converter's output pane, where the converted text is the stamped result.
- **Rim** (rim) and **Rim Edge** (rim-edge): the crust ring of the non, drawn as hard bands.
- **Çekiç Pip** (pip): the punched rings of pin marks in the dough.

### Neutral
- **Nigella Char** (char): all ink on crust, flour and dough; the action slab; the ink button and pressed chip; the stamp dots; focus rings; selection. Translucent char tints (8% under script tags, 10% under inline code) are the only other fills.
- **Char Soft** (char-soft): secondary reading text on crust and flour (lede, table headers, example column, converter subline, counts, empty-state hint).
- **Flour** (flour): working fields (converter panel, input pane) and the closing band; text on the char slab.
- **Slab Ink** (slab-ink): body copy and unselected tabs inside the char slab, one step quieter than flour; at 35% it draws the slab's light dot rows.
- **Slab Well** (slab-well): the recessed command field inside the slab, the tab hover, and the ink button's hover.

### Named Rules
**The Clay In The Field Rule.** Clay is used only on flour (6.4:1) and on the dough of the converter's output pane (4.6:1, always with a 700-weight letter and a dotted underline so change is never shown by colour alone). On crust it measures 2.4:1 and fails even large text, so clay never touches the amber ground, the slab or the non.

**The Flour Is For Work Rule.** Flour appears only inside working fields (converter panel, input pane) and the closing band. Ordinary content sections sit directly on crust.

## Typography

**Display Font:** Doto 900 (with monospace)
**Body Font:** Onest 400 / 500 / 600 / 700, one variable file covering 400–700 (with system-ui, sans-serif)
**Label/Mono Font:** ui-monospace, Menlo for code and for the old-spelling input column

Both families are self-hosted (OFL) from `web/fonts/`, `font-display: swap`. Doto: latin and latin-ext. Onest: one variable file per subset (latin, latin-ext, cyrillic, cyrillic-ext), weights 400–800; the cyrillic-ext file carries ў ғ қ ҳ.

**Character:** A dot-matrix display that looks punched by the çekiç, paired with a plain, open grotesque that reads well on a low-end phone. Doto names things; Onest explains them.

### Hierarchy
- **Display** (900, clamp(30px, 2.9vw, 42px), 1.08, balanced wrap): the hero headline. Phone: clamp(30px, 8.6vw, 42px).
- **Display Close** (900, clamp(40px, 6vw, 72px), 1): the closing band's statement in the footer.
- **Headline** (900, clamp(28px, 2.6vw, 36px), 1): section titles.
- **Headline Small** (900, 32px, 1; 26px on phone): the converter title.
- **Numeral** (900, 18px): Doto step numbers on crust squares.
- **Logo** (900, 26px, lowercase): the wordmark in the top bar.
- **Lede** (400, 18px; 17px on phone, max 46ch, char-soft with char bold): the explanation under the headline.
- **Title** (700, 17px, 1.3): download step titles.
- **Output** (600, 18px, 1.6): the converter's live result, matched to the input field's size.
- **Body** (400, 17px, 1.55; paragraphs 60–68ch): everything else. FAQ questions at 700, 19px. Rule table at 18px. Converter field 500 18px/1.6.
- **Label** (700, 15px, 1): buttons and the non's pair label; 16px on the big button and the download tabs. Chips and link buttons at 600 15px.
- **Tag** (600, 13px): script and changed-count tags in the pane bars.
- **Caption** (400–500, 13.5–15px): table headers, slab body (15px), step hints (14px), meta lines and counts (13.5px).

### Named Rules
**The Hero Leads Rule.** The h1 is the largest heading above the footer at every width: Display (42px max) over Headline (36px max) over Headline Small (32px). Only the footer's Display Close may be larger.

**The Doto Has No Full Stop Rule.** Doto draws "." like a plus sign, so display lines never end with a period. Line breaks do the work punctuation would.

**The Ğ Stays Out Of Doto Rule.** Doto's Ğ is weak, so ğ is never set in Doto display. Write display lines that avoid it; where ğ must appear large, draw it from the 5×10 dot glyph grid instead.

**The Cyrillic Falls Back To Onest Rule.** Doto has no Cyrillic. In the Cyrillic reading mode (`html[data-yozuv="kirill"]`) every Doto heading (hero, section titles, converter and quiz titles, founder name, closing statement, countdown) is set in Onest 800 with -0.015em tracking. The logo stays Doto and Latin.

**The Breve Must Show Rule.** Golos Text draws Ğ/ğ without the breve; never use it, here or as a fallback. Any face proposed for this system must render ö ğ ş ç and ʼ correctly before it is admitted.

## Layout

A centred column capped at 1180px with a fluid gutter of clamp(16px, 4vw, 40px). Sections breathe on a 72px bottom rhythm (48px on phone); two-column groups use a 48px column gap.

The hero is a two-column grid (1.12fr : 0.88fr, 56px gap; 32px below 980px): headline, lede and the download slab stack on the left, the non (up to 460px; 380px below 980px) sits centred on the right, and the converter panel spans the full width below, 56px down. The rules section pairs the dot-glyph table with notes (1.1fr : 1fr); the FAQ is a single column capped at 820px.

Breakpoints: at 980px the hero gap and the non tighten; at 860px everything collapses to one column, the nav hides, the non shrinks to 320px, the converter panes stack with the arrow turned downward, and on phones the sample chips become one scrolling row that fades at its right edge; at 420px the command and its copy button stack, buttons go full width, and the output footer wraps.

The direction contract's first viewport named a ~64px headline and a ~520px non; the build landed at 42px and 460px so the hero leads without crowding the slab. The build is the system.

**The Device Order Rule.** The first screen is ordered by device, set on `<html data-device>` from the user agent. Desktop: one download slab whose macOS | Windows tab is pre-selected for the device (macOS is the default and the no-JS state). Phone: headline, then the converter, then the non (max 240px), the lede, and the slab last, opening with a share-the-link notice above the tabs. Never show an install command as the first action on a phone.

**The Çekiç Grid Rule.** The body carries a 12px dot grid (1.4px dots at 15% char). Every dot row on crust (rule-table rows, FAQ items) is painted once per row as a 12px-period strip of 1.6px dots at 55% char along the row's bottom edge, and its phase is shifted in script so the dots land on the body's 12px grid. Rows inside a surface that covers the ground (pane bars on flour and dough, the slab's light rows) keep the 12px period and start at the surface's edge. Never draw dot rows per cell, and never let a row on crust drift off the ground grid.

## Elevation & Depth

Flat. There is no box-shadow anywhere in the system. Depth is tonal: the crust ground, the char slab and the flour field are distinct planes by colour alone, the command well and tab hover sit one tone into the slab, and the output pane steps from flour to dough. Buttons acknowledge a press by moving 1px down, not by casting a shadow.

**The Stamped Not Lifted Rule.** Nothing floats. Surfaces are stamped into the ground or laid on it; no drop shadows, no glows, no blur.

## Shapes

**The Three Pixel Rule.** Every rectangle (slabs, panels, panes, buttons, tabs, chips, tags, step numerals, fields, key caps, inline code) uses the one corner token (3px). No pills, no larger radii, no square-cut exceptions.

**The Only Round Thing Rule.** The non is the only round surface. Circles otherwise appear only as its material: stamp dots, glyph dots, pips, nigella seeds, the dots of the converter arrow, and the dots of the ground grid and dot rows.

Strokes are few and fixed: 1.5px currentColor on key caps and the beta tag, 2px char on converter panes and chips. Dividers are dot rows, never lines: dark rows on crust, flour and dough; light slab-ink rows inside the slab.

## Components

### Buttons
Short, firm, and flat.
- **Shape:** gently cornered (3px), minimum 44px tall (48px for the big variant).
- **Primary:** crust with char label text, on the black slab. Hover steps to crust-hi; active nudges down 1px; focus ring uses crust so it shows on black.
- **Ink:** char with flour text, on flour (the converter's copy button). Hover steps to slab-well; focus ring in char.
- **Link button:** underlined char text with no fill, for quiet actions such as Tozalaş in the input bar (32px tall inside a pane bar, 44px elsewhere).
- **Copy feedback:** the label swaps to "Nusxa olindi" and the button inverts to char with crust text for 1.8s, or shows a device-specific manual-copy hint if the clipboard is refused.

### Chips
- **Style:** transparent with a 2px char stroke, 3px corners, 40px tall, Onest 600 15px; used for the converter's sample texts.
- **State:** hover and pressed (aria-pressed) fill char with flour text. On phones they scroll as a single row.

### Tags
- **Script tag:** char text on an 8% char tint, Onest 600 13px, 3px corners; names the detected script.
- **Hot tag:** char fill with flour text; carries the live changed-letter count.
- **Beta tag:** 11px uppercase with a 1.5px currentColor stroke, inside the Windows tab only; it marks release status and is not a general label style.

### Download Slab
The black plate that holds the one action for this device.
- **Style:** char background, max 600px (full width on phone), 3px corners, panel padding 8px 22px 20px (6px 16px 18px on phone).
- **Tabs:** an ARIA tablist (macOS | Windows), two equal 46px tabs in a 6px inset; unselected slab-ink, hover slab-well, selected crust with char text. Arrow keys, Home and End move between tabs.
- **Steps:** an ordered list of three, each a 30px crust square with a Doto numeral beside a 17px step title, 15px slab-ink body and an optional 14px hint; steps are separated by light dot rows.
- **Command well:** the install line in a slab-well field, monospace 14px, wrapping anywhere, with the copy button beside it.
- **Meta line:** 13.5px slab-ink requirements and links under a light dot row.
- **Phone notice:** a share-the-link paragraph and button above the tabs, closed by a light dot row; shown only on phones.

### Converter
- **Panel:** flour, 28px padding (18px on phone), 3px corners; Headline Small title with a char-soft subline, then a sample-chip row.
- **Panes:** input on flour, output on dough, each with a 2px char stroke and a 260px minimum height, joined by a dot-built arrow (turned down when stacked). The input pane's focus ring wraps the whole pane.
- **Pane bar:** label at 700 15px, a tag at the end, a dot-row bottom edge.
- **Output:** Output type; changed letters in clay at 700 with a 2px dotted underline; an empty pane reads "Natija şu yerda çiqadi" in char-soft.
- **Footer:** a character count under the input; under the output, a tutuq checkbox switch (20px box, 44px hit area, char accent) and the ink copy button.

### Key Caps
Inline keys drawn with a 1.5px currentColor stroke, 3px corners, Onest 500; they inherit flour on the slab and char on crust.

### Dot Glyph
The new letters in the rules table are drawn, not typeset: a 5×10 grid of 3px dots with 1.5px gaps. Rows 0–1 hold the mark (umlaut dots, breve), row 2 is the gap, rows 3–7 are the letter body, rows 8–9 are the cedilla. The apostrophe is a 2-column glyph on the same 10 rows. The real character sits beside it for screen readers.

### FAQ Item
A disclosure on crust with a dot-row bottom edge. The item is a flow-root block so an open answer's margin stays inside it and clears the dot row. The question is Onest 700 19px; the toggle is a plus/minus built from 1.6px dots, never an icon glyph. Linking to an item's id opens it.

### Non (Signature)
The hero object.
- **Construction:** flat concentric bands with hard stops: dough centre to 86%, a rim-edge band, the rim, a rim-edge outer band. Two punched çekiç pip rings (56 and 64 pips at 36% and 40.5% radius) and 18 nigella seeds scattered between them.
- **Stamp:** a 13×10 dot field at the centre (48% wide, slightly above middle) holding the pair as dot glyphs; the letter is stamped in char dots; the pair label ("o' → ö") sits below in Label type.
- **Motion:** every 1.6s the dots migrate from the old pair to the new letter, 0.9s on cubic-bezier(.16, 1, .3, 1). Typing in the converter re-stamps the last converted letter and holds it for 6s. Under reduced motion the dots stay still on the stamped letter and change only every 4s.

**The Flat Non Rule.** The non is flat: crust rim and rim-edge bands, dough centre, punched pip rings, nigella seeds, the letter in char dots. No shading gradients, no insets, no drop shadows, no texture photography.

### Founder (Asosçi)
A char slab after the FAQ that credits the author and offers his services.
- **Photo:** a round portrait framed as a non rim (rim-edge, rim, rim-edge bands), 300px max (220px on phone). Source: the owner's photo, sharpened in ChatGPT and cropped to the face, `web/img/asoschi.webp` (640×640).
- **Text:** a crust uppercase kicker, the name in Headline Doto (flour), a slab-ink lede.
- **Services:** three slab-well cards (auto-fit, 190px minimum), each a crust dot, a flour title and a slab-ink line.
- **Actions:** one big primary button to Telegram contact, then a light dot row and two social links (Telegram channel, Instagram) with crust icons.

### Platform and social marks
The owner asked for real, recognisable marks, so the Apple logo and the Windows four-pane logo sit in the download tabs and the Windows download button, and the Telegram plane and Instagram camera sit in the founder slab. They are flat single-colour `currentColor` SVGs. This is the only exception to "no icon glyphs"; nothing else gets an icon.

### Founder chip (header)
A char capsule at the end of the top bar (shown on phones too): a 36px round photo, then a crust uppercase "Asosçi" over the name in flour. Fully rounded at the owner's request; the one exception to the Three Pixel Rule. No motion; hover steps to slab-well. Under 370px the name hides.

### Phone Guide (Telefonda yoziş)
A char slab like the download slab, with an iPhone | Android tablist (same ARIA tab behaviour; each tablist switches only its own panels). iPhone panel: four rows, each a flour key cap (44×52, Onest 500 24px) beside a drawn long-press menu of slab-well cells (40×44, Onest 500 22px); the correct letter is a crust cell with a 2px flour outline offset 2px, the lookalikes stay slab-well. Android panel: a "Töğri / Öxşaş, lekin boşqa" table in the same cells. A shared Turkish-keyboard warning closes the slab under a light dot row. The menus show the choice, never a claimed menu order.

### Countdown (Sanoq)
On crust at the top of the rules section: a Doto 64px number and "kun", a 17px char-soft line, then one 7px dot per day from signing (21.10.2026) to entry into force (22.04.2027): past days char, today flour with a char ring, the rest 1.5px rings. The dots are the countdown's whole graphic.

### Word Check (Söz tekşiruv)
A flour working field above the rules table: a 48px field with a 2px char stroke, then a dough result pane with the word in Onest 700 32px (changed letters clay, 3px dotted underline), an ink copy button and the list of rules that fired. The matching rule-table row turns char with flour text. Lookalike warnings are char cells with the letters in crust.

### Quiz (Test)
A flour panel (max 640px): Doto title, ten 10px progress dots (char = right, clay = wrong, outlined ring = current), Onest 700 21px question, three 56px option buttons with a 2px char stroke. The right answer turns dough with a hot tag; a wrong pick gets a 2px clay line-through. Result: Doto 96px score over a Doto "/10", ink and ghost (2px char border) buttons, and a 200px preview of the story image.

### Story Image
Canvas 1080×1920, drawn in the browser: crust ground with a 36px dot grid, the logo, "Yangi alifbo testi" in Doto, the non (rim bands, two pip rings) with the score stamped in Doto (scaled to fit the dough), "töğri javob" in Onest 700, and the domain in Onest 800. Never set the domain in Doto: its full stop draws as a plus.

### Language Switcher (Til tanlagiç)
Four 36px chips with a 2px char stroke in the top bar, Onest 700 13px: "Yangi · Eski · Кирилл · Рус", each in its own script (the nav carries `data-lotin`); the current version is filled char with flour text (`aria-current="page"`). At 640px and below it collapses to a `<details>` chip showing the current name; the list opens as a flour panel with a 2px char stroke. Links go to the same page in the other version and keep the `#hash`. The footer repeats the four versions as a text line. Under 420px the bar gap drops to 10px and the founder chip keeps only photo and "Asosçi".

### Word Page (Söz sahifa)
Breadcrumb, an Onest 800 heading ("{old} yangi alifboda: {new}", Cyrillic lead word on /kr/ and /ru/), three form cards (old Latin, new Latin on dough, Cyrillic) with a 2px char stroke, the rules that fired, a name-card button for names, and related words as flour chips. The /soz/ index has a search field, square 40px letter chips and the word chips grouped by letter.

### Name Card (Ism kartasi)
A dough card with the name in Onest 800 up to 84px, the old spelling and char chips with the letter pairs. Its story image uses the shared canvas helpers: the name sits inside the non, in Doto unless it contains ğ (then Onest 800).

### Typing Practice (Maşq)
Mode chips, a flour box with the target text in Onest 500 (current word on dough, wrong words clay with a wavy underline), a 22px input that gets a 3px clay outline while the word in progress cannot become the target, and a char hint when old forms are left unconverted. The result reuses the quiz score type with "söz/daqiqa" in Onest 700.

### File Converter (Fayl)
A flour drop zone with a 2px dashed char stroke (dough on hover and drag), the tutuq switch, and one flour row per file with the new name, the changed count and an ink download button; errors are char rows with flour text.

### Articles and Widget
Article pages are a 720px column of 18px Onest text with Onest 800 headings, rule tables reused for letter mappings and a flour note box for the unofficial-rules line. The widget page shows a live flour demo and the embed code on the slab well. The widget's own button on other sites uses inline styles only: dough fill, 2px char stroke, 3px corners.

### Logo
The wordmark "yozgiç" in Logo type, preceded by a 30px mark: a char disc with a dough centre holding the ö dot glyph (the favicon's drawing).

### Closing Band
A full-bleed flour band with the Display Close statement ("Bepul, hamma uçun") and clay links to Instagram, the Telegram channel and Telegram contact.

## Do's and Don'ts

### Do:
- **Do** write all site copy in the new alphabet (ö ğ ş ç, tutuq ʼ) and check it mechanically by running the visible text through the product's own converter (`web/converter.js`); the only strings it may change are old-spelling examples, code, quoted English UI text and the Cyrillic law code.
- **Do** keep clay (#9c3b22) on flour and on the dough output pane only, and pair it with weight and a dotted underline when it marks change.
- **Do** keep the h1 the largest heading above the footer.
- **Do** draw any new large letter from the 5×10 dot grid (mark, gap, letter, cedilla).
- **Do** paint dot rows once per row and phase-align rows on crust to the body's 12px grid.
- **Do** order the first screen by device: the download tab pre-selected for Mac or Windows, the converter first on a phone.
- **Do** write shortcuts as key caps and keep them true: the Mac keyboard is always on and is switched like any keyboard with ⌃ Control + Space or fn (globe); Windows toggles with Ctrl + Alt + Space.
- **Do** use the 3px corner token on every rectangle.
- **Do** keep motion to dot migration with an exponential ease-out, and turn it off under reduced motion.

### Don't:
- **Don't** end a Doto display line with a period.
- **Don't** set ğ in Doto display.
- **Don't** use Golos Text; it drops the breve from Ğ/ğ.
- **Don't** put clay on crust, the slab or the non; it fails at 2.4:1.
- **Don't** round anything except the non and its dots; no pills.
- **Don't** shade the non or anything else: no gradients that model light, no insets, no drop shadows.
- **Don't** use icon glyphs; build marks from dots. The only exceptions are the platform and social marks above.
- **Don't** describe the Mac keyboard as switched on and off with a dedicated toggle.
- **Don't** lead a phone visitor with an install command.

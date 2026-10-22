---
name: Yangi alifbo
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
    fontSize: "clamp(38px, 4.6vw, 64px)"
    fontWeight: 900
    lineHeight: 1.02
    letterSpacing: "-0.01em"
  display-close:
    fontFamily: "Doto, monospace"
    fontSize: "clamp(40px, 6vw, 72px)"
    fontWeight: 900
    lineHeight: 1
  headline:
    fontFamily: "Doto, monospace"
    fontSize: "clamp(34px, 4vw, 48px)"
    fontWeight: 900
    lineHeight: 1
  headline-sm:
    fontFamily: "Doto, monospace"
    fontSize: "34px"
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
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.55
  title:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.2
  output:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.4
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
  slab: "20px"
  panel: "24px"
  column: "48px"
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
  button-big:
    backgroundColor: "{colors.crust}"
    textColor: "{colors.char}"
    rounded: "{rounded.corner}"
    padding: "0 22px"
    height: "48px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.char}"
    typography: "{typography.label}"
    rounded: "{rounded.corner}"
    padding: "0 18px"
    height: "44px"
  button-ghost-hover:
    backgroundColor: "{colors.char}"
    textColor: "{colors.flour}"
  slab:
    backgroundColor: "{colors.char}"
    textColor: "{colors.flour}"
    rounded: "{rounded.corner}"
    padding: "{spacing.slab}"
    width: "540px"
  command-well:
    backgroundColor: "{colors.slab-well}"
    textColor: "{colors.flour}"
    rounded: "{rounded.corner}"
    padding: "12px 14px"
  converter-panel:
    backgroundColor: "{colors.flour}"
    textColor: "{colors.char}"
    rounded: "{rounded.corner}"
    padding: "{spacing.panel}"
  text-field:
    backgroundColor: "{colors.flour}"
    textColor: "{colors.char}"
    rounded: "{rounded.corner}"
    padding: "12px 14px"
    height: "104px"
  key-cap:
    textColor: "{colors.char}"
    rounded: "{rounded.corner}"
    padding: "0 6px"
  non:
    backgroundColor: "{colors.dough}"
    rounded: "{rounded.non}"
    width: "520px"
  closing-band:
    backgroundColor: "{colors.flour}"
    textColor: "{colors.char}"
    padding: "56px clamp(16px, 4vw, 40px) 64px"
---

# Design System: Yangi alifbo

## Overview

**Creative North Star: "Non va çekiç"**

Letters are stamped into the centre of an Uzbek non with a çekiç, the bread stamp whose pins punch rings of dots into the dough. The whole system is made of that one material: dots. The ground is baked-crust amber with a faint 12px çekiç grid, headings are set in a dot-matrix face, the new letters are drawn on a 5×10 dot grid, dividers are rows of dots, and the hero non shows the apostrophe of o' turning into the two dots of ö as the dots migrate. National-modern register: an Uzbek graphic object rendered flat and contemporary, never ornamental or antique.

Density is calm and large. One drenched amber ground carries everything; three surfaces sit on it by tone alone: black action slabs, flour working fields, and the dough of the non. There are no shadows, no pills, no gradients that shade. Everything is flat and stamped.

The site speaks the alphabet it sells. Every line of copy is written in the new alphabet (ö ğ ş ç, tutuq ʼ), and old spellings appear only as the input side of an example.

**Key Characteristics:**
- Drenched crust-amber ground with a 12px çekiç dot grid.
- Dot-matrix display (Doto 900) over a plain humanist body (Onest).
- Flat surfaces separated by tone: char slab, flour field, dough non.
- 3px corners on every rectangle; round silhouettes only in the non and its dots.
- Dots as the single decorative device: glyphs, dividers, the FAQ toggle, the stamp.
- One motion: dots migrating with an exponential ease-out.

## Colors

A baked palette: one drenched crust amber, nigella-black ink, a flour white for working fields, and a single clay red held back for emphasis on flour.

### Primary
- **Baked Crust** (crust): the drenched page ground, the browser theme colour, and the fill of primary buttons on the black slab. **Crust Highlight** (crust-hi) is its hover step only.

### Secondary
- **Tandir Clay** (clay): emphasis on flour only, currently the closing-band links and the text caret inside the converter.

### Tertiary (the non)
- **Dough** (dough): the non's centre, where the letter is stamped.
- **Rim** (rim) and **Rim Edge** (rim-edge): the crust ring of the non, drawn as hard bands.
- **Çekiç Pip** (pip): the punched rings of pin marks in the dough.

### Neutral
- **Nigella Char** (char): all ink on crust, flour and dough; the action slab; the stamp dots; focus rings; selection.
- **Char Soft** (char-soft): secondary reading text on crust (lede, table headers, example column).
- **Flour** (flour): working fields (converter panel, text field) and the closing band; text on the char slab.
- **Slab Ink** (slab-ink): body copy inside the char slab, one step quieter than flour.
- **Slab Well** (slab-well): the recessed command field inside the slab that holds the install line.

### Named Rules
**The Clay On Flour Rule.** Clay is used only on flour. On crust it measures 2.4:1 and fails even large text, so clay never touches the amber ground, the slab or the non.

**The Flour Is For Work Rule.** Flour appears only inside working fields (converter, text field) and the closing band. Ordinary content sections sit directly on crust.

## Typography

**Display Font:** Doto 900 (with monospace)
**Body Font:** Onest 400 / 500 / 700 (with system-ui, sans-serif)
**Label/Mono Font:** ui-monospace, Menlo for code and for the old-spelling input column

Both families are self-hosted (OFL) from `web/fonts/`, latin and latin-ext subsets, `font-display: swap`.

**Character:** A dot-matrix display that looks punched by the çekiç, paired with a plain, open grotesque that reads well on a low-end phone. Doto names things; Onest explains them.

### Hierarchy
- **Display** (900, clamp(38px, 4.6vw, 64px), 1.02, balanced wrap): the hero headline. Phone: clamp(32px, 9vw, 44px).
- **Display Close** (900, clamp(40px, 6vw, 72px), 1): the closing band's statement.
- **Headline** (900, clamp(34px, 4vw, 48px), 1): section titles.
- **Headline Small** (900, 34px, 1; 28px on phone): the converter panel title.
- **Logo** (900, 26px, lowercase): the wordmark in the top bar.
- **Lede** (400, 20px; 18px on phone, max 36ch, char-soft with char bold): the one-line explanation under the headline.
- **Title** (700, 18px, 1.2): action-slab titles.
- **Output** (700, 24px; 21px on phone): the converter's live result.
- **Body** (400, 17px, 1.55; paragraphs 60–68ch): everything else. FAQ questions at 700, 19px. Rule table at 18px.
- **Label** (700, 15px, 1): buttons and the non's pair label; 16px on the big button.
- **Caption** (500–400, 14–15px): table headers, slab notes and slab body.

### Named Rules
**The Doto Has No Full Stop Rule.** Doto draws "." like a plus sign, so display lines never end with a period. Line breaks do the work punctuation would.

**The Ğ Stays Out Of Doto Rule.** Doto's Ğ is weak, so ğ is never set in Doto display. Write display lines that avoid it; where ğ must appear large, draw it from the 5×10 dot glyph grid instead.

**The Breve Must Show Rule.** Golos Text draws Ğ/ğ without the breve; never use it, here or as a fallback. Any face proposed for this system must render ö ğ ş ç and ʼ correctly before it is admitted.

## Layout

A centred column capped at 1180px with a fluid gutter of clamp(16px, 4vw, 40px). Sections breathe on a 72px bottom rhythm (48px on phone); two-column groups use a 48px column gap.

The hero is a two-column grid (1fr : 1.05fr): headline, lede and action slab stack on the left, the non (up to 520px) fills the right, and the converter panel spans the full width below. The rules section pairs the dot-glyph table with notes (1.1fr : 1fr); the FAQ is a single column capped at 820px.

Breakpoints: at 860px everything collapses to one column, the nav hides, the non shrinks to 340px; at 420px the command and its copy button stack and the button goes full width.

**The Device Order Rule.** The first screen is ordered by device, set on `<html data-device>` from the user agent. Mac (the default, also the no-JS state): the install slab leads. Windows: the beta download slab replaces it. Phone: headline, then the converter, then the non (max 260px), the lede, and a share-the-link slab. Never show an install command as the first action on a phone.

**The Çekiç Grid Rule.** The body carries a 12px dot grid (1.4px dots at 15% char). Every dot row (rule-table rows, FAQ items) is painted once per row as a 12px-period strip of 1.6px dots at 55% char along the row's bottom edge, and its phase is shifted in script so the dots land on the body's 12px grid. Never draw dot rows per cell, and never let a row's dots drift off the ground grid.

## Elevation & Depth

Flat. There is no box-shadow anywhere in the system. Depth is tonal: the crust ground, the char slab and the flour field are distinct planes by colour alone, and the command well sits one tone into the slab. Buttons acknowledge a press by moving 1px down, not by casting a shadow.

**The Stamped Not Lifted Rule.** Nothing floats. Surfaces are stamped into the ground or laid on it; no drop shadows, no glows, no blur.

## Shapes

**The Three Pixel Rule.** Every rectangle (slabs, panels, buttons, fields, key caps, inline code) has a 3px corner. No pills, no larger radii, no square-cut exceptions.

**The Only Round Thing Rule.** The non is the only round surface. Circles otherwise appear only as its material: stamp dots, glyph dots, pips, nigella seeds, and the dots of the ground grid and dot rows.

The 1.5px key-cap stroke and the 2px field and ghost-button strokes are the only borders; dividers are dot rows, never lines.

## Components

### Buttons
Short, firm, and flat.
- **Shape:** gently cornered (3px), minimum 44px tall (48px for the big variant).
- **Primary:** crust on the char slab with char label text. Hover steps to crust-hi; active nudges down 1px; focus ring uses crust so it shows on black.
- **Ghost:** transparent with a 2px char stroke on flour; hover fills char with flour text.
- **Copy feedback:** the label swaps to "Olindi" for 1.8s, or to a device-specific manual-copy hint if the clipboard is refused.

### Action Slab
The black plate that holds the one action for this device.
- **Style:** char background, flour title, slab-ink body copy, 20px padding (18px on phone), max 540px, 3px corners.
- **Command well:** the install line in a slab-well field, monospace 14px, wrapping anywhere, with the copy button beside it.
- **Variants:** Mac (install command), Windows (beta download), phone (share link). Exactly one shows.

### Converter Panel
- **Style:** flour panel, 24px padding (18px on phone), 3px corners; input left, live output right; one column on phone.
- **Field:** flour textarea with a 2px char stroke, Onest 500 18px, 104px minimum height, vertical resize; focus is the global 3px char outline offset 2px.
- **Output:** Output type, live-announced, with a ghost copy button beneath.

### Key Caps
Inline keys drawn with a 1.5px currentColor stroke, 3px corners, Onest 500; they inherit flour on the slab and char on crust.

### Dot Glyph
The new letters in the rules table are drawn, not typeset: a 5×10 grid of 3px dots with 1.5px gaps. Rows 0–1 hold the mark (umlaut dots, breve), row 2 is the gap, rows 3–7 are the letter body, rows 8–9 are the cedilla. The apostrophe is a 2-column glyph on the same 10 rows. The real character sits beside it for screen readers.

### FAQ Item
A disclosure on crust with a dot-row bottom edge. The question is Onest 700 19px; the toggle is a plus/minus built from 1.6px dots, never an icon glyph. Linking to an item's id opens it.

### Non (Signature)
The hero object.
- **Construction:** flat concentric bands with hard stops: dough centre to 86%, a rim-edge band, the rim, a rim-edge outer band. Two punched çekiç pip rings (56 and 64 pips at 36% and 40.5% radius) and 18 nigella seeds scattered between them.
- **Stamp:** a 13×10 dot field at the centre (48% wide, slightly above middle) holding the pair as dot glyphs; the letter is stamped in char dots; the pair label ("o' → ö") sits below in Label type.
- **Motion:** every 1.6s the dots migrate from the old pair to the new letter, 0.9s on cubic-bezier(.16, 1, .3, 1). Typing in the converter re-stamps the last converted letter and holds it for 6s. Under reduced motion the dots stay still on the stamped letter and change only every 4s.

**The Flat Non Rule.** The non is flat: crust rim and rim-edge bands, dough centre, punched pip rings, nigella seeds, the letter in char dots. No shading gradients, no insets, no drop shadows, no texture photography.

### Closing Band
A full-bleed flour band with the Display Close statement and clay links for author, GitHub and issues.

## Do's and Don'ts

### Do:
- **Do** write all site copy in the new alphabet (ö ğ ş ç, tutuq ʼ) and check it mechanically by running the visible text through the product's own converter (`web/converter.js`); the only strings it may change are old-spelling examples, code, quoted English UI text and the Cyrillic law code.
- **Do** keep clay (#9c3b22) on flour only.
- **Do** draw any new large letter from the 5×10 dot grid (mark, gap, letter, cedilla).
- **Do** paint dot rows once per row and phase-align them to the body's 12px grid.
- **Do** order the first screen by device: Mac install, Windows beta, phone converter first.
- **Do** use 3px corners on every rectangle.
- **Do** keep motion to dot migration with an exponential ease-out, and turn it off under reduced motion.

### Don't:
- **Don't** end a Doto display line with a period.
- **Don't** set ğ in Doto display.
- **Don't** use Golos Text; it drops the breve from Ğ/ğ.
- **Don't** put clay on crust, the slab or the non; it fails at 2.4:1.
- **Don't** round anything except the non and its dots; no pills.
- **Don't** shade the non or anything else: no gradients that model light, no insets, no drop shadows.
- **Don't** use icon glyphs; build marks from dots.
- **Don't** lead a phone visitor with an install command.

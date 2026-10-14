---
name: 3seater Batch Eight
description: Fifteen portfolio compositions in the existing Anton/Plex world
colors:
  b8-01-paper: "#e4ed39"
  b8-01-ink: "#171900"
  b8-01-muted: "#626812"
  b8-01-line: "#a2ad21"
  b8-01-accent: "#d02a16"
  b8-02-paper: "#143bd4"
  b8-02-ink: "#ffffff"
  b8-02-muted: "#d1dcff"
  b8-02-line: "#708ce9"
  b8-02-accent: "#f3f854"
  b8-03-paper: "#ddd6ed"
  b8-03-ink: "#262035"
  b8-03-muted: "#62556f"
  b8-03-line: "#b9accf"
  b8-03-accent: "#742354"
  b8-04-paper: "#191b1e"
  b8-04-ink: "#f0f2e9"
  b8-04-muted: "#a5adae"
  b8-04-line: "#4c5359"
  b8-04-accent: "#e4ed39"
  b8-05-paper: "#ee593d"
  b8-05-ink: "#241509"
  b8-05-muted: "#573022"
  b8-05-line: "#b6432b"
  b8-05-accent: "#ffffff"
  b8-06-paper: "#d8e9d7"
  b8-06-ink: "#23392c"
  b8-06-muted: "#526a58"
  b8-06-line: "#a3bba5"
  b8-06-accent: "#92432a"
  b8-07-paper: "#352064"
  b8-07-ink: "#f5e8ff"
  b8-07-muted: "#cfbce6"
  b8-07-line: "#765692"
  b8-07-accent: "#f2f35b"
  b8-08-paper: "#eee9df"
  b8-08-ink: "#2b2924"
  b8-08-muted: "#746d60"
  b8-08-line: "#bdb6a7"
  b8-08-accent: "#bd3b18"
  b8-09-paper: "#f6ed88"
  b8-09-ink: "#27280c"
  b8-09-muted: "#69602d"
  b8-09-line: "#c5b958"
  b8-09-accent: "#a52b26"
  b8-10-paper: "#cddce8"
  b8-10-ink: "#1b3048"
  b8-10-muted: "#50677f"
  b8-10-line: "#9aafc3"
  b8-10-accent: "#a33a22"
  b8-11-paper: "#ecc7ce"
  b8-11-ink: "#39202b"
  b8-11-muted: "#765061"
  b8-11-line: "#bf929e"
  b8-11-accent: "#184c3b"
  b8-12-paper: "#fcfcf7"
  b8-12-ink: "#22251e"
  b8-12-muted: "#62675a"
  b8-12-line: "#d1d5c9"
  b8-12-accent: "#485dbe"
  b8-13-paper: "#6d302c"
  b8-13-ink: "#fff0dd"
  b8-13-muted: "#e1b5a1"
  b8-13-line: "#b16b5e"
  b8-13-accent: "#f0f56f"
  b8-14-paper: "#d5d7da"
  b8-14-ink: "#25272c"
  b8-14-muted: "#5f6269"
  b8-14-line: "#a8adb4"
  b8-14-accent: "#3b3da4"
  b8-15-paper: "#e3ec3c"
  b8-15-ink: "#151713"
  b8-15-muted: "#555d18"
  b8-15-line: "#a3af28"
  b8-15-accent: "#95324e"
typography:
  display:
    fontFamily: "Anton, sans-serif"
    fontWeight: 400
  selected-row:
    fontFamily: "Anton, sans-serif"
    fontSize: "clamp(30px,4.6vw,68px)"
    fontWeight: 400
    lineHeight: 1.2
  selected-compact:
    fontFamily: "Anton, sans-serif"
    fontSize: "clamp(28px,3.2vw,48px)"
  body:
    fontFamily: "Plex, monospace"
  caption:
    fontFamily: "Plex, monospace"
    fontSize: "10px"
rounded:
  capsule: "40px"
  nav-link: "30px"
  glass: "35px"
  soft-signal-media: "14px"
spacing:
  page-inset: "18px"
  mobile-inset: "10px"
  default-grid-gap: "14px"
  nav-gap: "8px"
---

# Design System: 3seater — Batch Eight

## Overview

**Creative North Star: Existing Anton/Plex World.** This is the pinned continuation described in DIRECTION-CONTRACT.txt and PRODUCT.md: dense work first, aligned bold selected-project rows with inline moving media next, and the client cylinder after. Full-color artwork and factual project information anchor fifteen distinct color, composition and navigation combinations.

Scope is /batch-eight/01/ through /batch-eight/15/. Original / New Type remains in batch-seven/01; its only additional change in this iteration is uppercase project titles. Earlier batches and the main site retain their own design records.

## Colors

Frontmatter records the exact per-direction values from directions.json and directions.css. Paper is the page ground, ink the primary text, muted the supporting tone, line the divider, and accent local interactive emphasis. Final navigation hover and text selection use ink/paper, with underline on navigation hover; the reviewer reported a minimum 5.17:1 contrast for these pairs. Do not substitute accent/paper for that final hover rule.

| Route | Direction | Layout | Navigation | Selected rows |
| --- | --- | --- | --- | --- |
| 01 | Acid Poster | mosaic | tabs | poster |
| 02 | Cobalt Contact | sheet | bar | compact |
| 03 | Soft Signal | masonry | capsule | poster |
| 04 | Carbon Film | film | dock | reverse |
| 05 | Vermilion Board | bento | square | poster |
| 06 | Mint Ledger | ledger | tabs | compact |
| 07 | Ultraviolet Rail | mosaic | rail | poster |
| 08 | Bone Contact | sheet | split | poster |
| 09 | Lemon Strip | film | capsule | compact |
| 10 | Blue Hour | masonry | dock | poster |
| 11 | Pink Matrix | bento | bar | reverse |
| 12 | White Margin | ledger | rail | poster |
| 13 | Oxide Index | masonry | split | compact |
| 14 | Silver Screen | sheet | glass | poster |
| 15 | Yellow / Black | bento | dock | reverse |

## Typography

Anton 400 supplies condensed uppercase project titles, selected-project names, client names and the footer wordmark. Plex is locally loaded IBM Plex Mono 400 for body, metadata, navigation and captions. Default selected names use the frontmatter clamp; compact rows use their smaller clamp. At 800px and below, selected names become 29px and inline video becomes 76 × 46px. Project titles become 36px at the inherited 700px breakpoint.

## Layout

The six home families are mosaic (dense two-span features), sheet (ruled 4:3 contact cells), masonry (natural media heights with 22px gaps), film (four columns, 16:9 media and occasional 32:9 double spans), bento (square cells with two-column wide features), and ledger (three columns with captions above 16:10 media). Configured column counts range from four to six; film and ledger explicitly override them. Route 15 tightens bento gaps to 3px.

At 800px and below, home grids become two columns, usually with 10px gaps; sheet retains zero gaps. Mosaic features revert to one cell; bento features retain two-column spans. The left rail becomes horizontal and returns to document flow. Page insets change from 18px to 10px.

Selected rows share a left edge and occur before the wheel. Default section margins are 90px above and 110px below, becoming 55px at the compact breakpoint. Compact rows cap at 1080px except route 13; reversed rows place paper text on an ink section with 32px padding. Inline video is 120 × 72px on desktop.

Archive controls and filtering retain the batch-seven structure. Project details retain unboxed natural-ratio media: single, two-column, balanced three-item and 2 × 2 arrangements. At 700px the inherited detail layout stacks information, media and secondary embeds in that order.

## Elevation & Depth

Most directions remain flat, with borders and color separating content. Bottom docks use 0 8px 24px #0003. Glass navigation uses 0 4px 20px #0002, an 18px backdrop blur and #f4f5f6d9 surface. These belong to their navigation variants.

## Shapes

Square media and ruled cells dominate. Soft Signal alone adds 14px media corners. Capsule and dock shells use 40px corners; their links use 30px. Glass uses a 35px shell. Split navigation uses individual 30px pills.

## Components

Eight navigation styles are tabs, bar, capsule, square, dock, rail, split and glass. Tabs underline the current page; most variants invert ink/paper for current state; docks reverse that inversion within an ink shell. Dock navigation sits 18px above the viewport bottom; its footer reserves 100px. Rail navigation reserves 150px at the left and is 112px wide. Split pills have 140px minimum width on desktop.

The final navigation rule disables transitions to prevent the inherited initial background flash. Hover uses ink/paper plus a 4px-offset underline. Links and buttons expose a 2px ink focus outline with 4px offset. Mobile navigation targets are at least 44px high.

Selected rows combine underlined Anton titles, factual small labels and inline video previews. Native previews continuously loop as inherited from batch seven; they are not replaced with simulated artwork. The wheel retains Anton client names with 90px desktop / 48px compact sizing.

## Do's and Don'ts

- Do keep each direction's palette, layout and navigation combination together.
- Do preserve the original Archive controls, factual project data, full-color artwork and natural-ratio project media.
- Do retain aligned selected rows, inline moving media and the following client wheel.
- Don't turn this batch into fifteen palette swaps or introduce hero copy.
- Don't apply this scoped system to the main site or historical batches.
---
name: "3seater — Batch Seven / Original With New Type"
description: "Scoped continuation of the original portfolio; 01 remains a faithful font-substituted copy."
colors:
  paper: "#f8f9fb"
  ink: "#17181a"
  muted: "#6e7177"
  line: "#d8dade"
  accent: "#ff6500"
  frost-dark: "rgba(30,31,33,.86)"
typography:
  body:
    fontFamily: "Plex, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0"
  nav:
    fontFamily: "Plex, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1
  home-caption:
    fontFamily: "Plex, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.4
  selected:
    fontFamily: "Anton, sans-serif"
    fontSize: "clamp(28px,3.5vw,52px)"
    fontWeight: 400
    lineHeight: 1.3
  project-title:
    fontFamily: "Anton, sans-serif"
    fontSize: "clamp(28px, 3.2vw, 44px)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "0"
rounded:
  pill: "56px"
  capsule: "40px"
  bar: "12px"
  square-frost: "10px"
  segment: "8px"
spacing:
  gutter: "clamp(12px,1.25vw,20px)"
  project-media: "20px"
  project-column: "40px"
  project-row: "24px"
  phone-column: "12px"
components:
  frosted-round:
    backgroundColor: "{colors.frost-dark}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    typography: "{typography.nav}"
    padding: "15px 27px"
  selected-row:
    typography: "{typography.selected}"
    padding: "18px 0"
  home-caption:
    typography: "{typography.home-caption}"
    padding: "8px 0 0"
---

# Design System: Batch Seven

## Overview

**Creative North Star: "Original With New Type"**

This is a scoped record of the approved original-site continuation, not a new portfolio-wide identity. The shared world is an immediate natural-ratio work feed, restrained factual interface, and emphatic Anton client cylinder and footer. Versions 02–10 explore navigation treatments within that world.

The frontmatter typography and component tokens describe 02–10. Version 01 retains the original structure, layout and behavior with a fuller typography swap scoped to body.v1: Anton carries project/page headings, empty-state headings, contact display, footer wordmark and client names; Plex carries body copy, metadata labels and values, navigation, footer details and all supporting text. Corresponding font loading and cylinder measurement follow the substitutions. This changes the batch-seven copy only, not the main site. Do not apply the experimental layout overrides to 01.

**Key Characteristics:**

- Original cool neutral surface with orange interactive feedback.
- Full-color artwork, compact factual labels, aligned selected rows.
- Rounded frosted navigation variations and one clean tab alternative.

## Colors

Paper, ink, muted and line retain the original hierarchy. Orange identifies hover/focus and selection feedback; artwork supplies the visual color range. Dark and pale navigation surfaces vary by route, not by project category. See variants.css for route-specific opacity and active-state values.

## Typography

Plex is locally loaded IBM Plex Mono; Anton is locally loaded at regular weight. The selected rows use the display token, while names below home tiles use the smaller caption token. Project titles use Anton, and other factual text retains the original hierarchy through Plex. Phone selected labels are 28px; project titles are 36px and home captions 10px. The cylinder remains dynamically measured with Anton rather than substituting a font without recalculating placement.

## Layout

02–10 preserve the original masonry home and archive runtime. Selected projects sit before the client cylinder with a common left edge. Their inline previews are 120 × 72px on desktop and 76 × 46px on phones; cropped previews do not dictate full project ratios.

Project details use a factual left column and primary media right, with a secondary embed below the facts. Primary media is unboxed: one item in one column, two in two columns, four in a 2 × 2 grid. Three media items become two stacked left and one right. If height/width ratios are r1, r2, r3, inner available width after the column gap is W, and gap is g, left width is (W*r3-g)/(r1+r2+r3). This equalizes actual total column heights including the vertical gap without cropping.

At 700px and below the project uses one column, preserves media order, and places secondary embeds after primary artwork. Secondary embeds have a 340px desktop maximum and 280px phone maximum. At 1050px the project layout gap becomes 24px. Navigation controls retain at least 44px height on phones.

## Elevation & Depth

Depth belongs to navigation and original transient controls. Glass treatments use high-opacity backgrounds with blur; route 04 uses a subtle 0 3px 12px #00000014 shadow and route 07 a 0 7px 24px #0003 dock shadow. Project figures are transparent and borderless. Do not generalize navigation elevation into artwork panels.

## Shapes

Rounded pills and capsules organize navigation. Route 05 uses a rounded bar with smaller inner segments, route 06 restrained rectangular buttons, and route 08 flat underline tabs. Home tile framing is distinct from project media: most experimental routes use 7px padding and a fine line; 03 and 08 are unframed; 10 uses 9px padding and ink borders.

## Components

Navigation routes: 01 Original / New Type; 02 Frosted Rounds; 03 Soft Capsule; 04 Milk Glass; 05 Graphite Bar; 06 Square Frost; 07 Floating Dock; 08 Quiet Tabs; 09 Inset Glass; 10 Original / Framed. Experimental navigation is uppercase WORK / ARCHIVE / INDEX, without a brand logo. The dock is fixed 22px from the bottom, 14px on phones.

The archive retains original factual category buttons, All Work, All Years, and both view icons with original filtering logic. Experimental view buttons have a 30px minimum width and 38px minimum height. Category and view focus use a 2px orange outline with 3px offset.

Home tile captions show only project names in 02–10. Selected rows use thin rules, underlined Anton labels and compact inline motion previews. Native initialized previews loop, muted and inline; full project media retains its natural ratio and original color. The client cylinder keeps original client ordering, exclusions, and links. No global pause control is added.

## Do's and Don'ts

- Do keep 01 as the faithful original with scoped font substitutions.
- Do keep the original archive behavior and all factual content.
- Do preserve natural ratios and original media order in project details.
- Do keep selected rows aligned before the client cylinder.
- Don't carry batch-six project boxes into batch-seven details.
- Don't turn these scoped rules into changes to production or prior batches.


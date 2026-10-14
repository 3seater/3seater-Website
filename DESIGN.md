---
name: "3seater — Batch Five / A Brain Dump, Then Type"
description: "Active tokens are scoped to src/batch-five. Earlier batch records are preserved as history."
colors:
  b5-01-ground: "#e7e8df"
  b5-01-ink: "#181a15"
  b5-01-accent: "#a52617"
  b5-02-ground: "#dce745"
  b5-02-ink: "#191c13"
  b5-02-accent: "#92291c"
  b5-03-ground: "#eeeeea"
  b5-03-ink: "#171915"
  b5-03-accent: "#2443b2"
  b5-04-ground: "#d9ded6"
  b5-04-ink: "#182017"
  b5-04-accent: "#913827"
  b5-05-ground: "#171916"
  b5-05-ink: "#eeeee7"
  b5-05-accent: "#dce745"
  b5-06-ground: "#f0efe9"
  b5-06-ink: "#20211b"
  b5-06-accent: "#a42d20"
  b5-07-ground: "#dedfd6"
  b5-07-ink: "#1a1c15"
  b5-07-accent: "#284e9c"
  b5-08-ground: "#e9e9e4"
  b5-08-ink: "#171914"
  b5-08-accent: "#a52920"
  b5-09-ground: "#1c1d19"
  b5-09-ink: "#e6e8dd"
  b5-09-accent: "#dce745"
  b5-10-ground: "#e9e6de"
  b5-10-ink: "#202018"
  b5-10-accent: "#963424"
  b5-11-ground: "#dce745"
  b5-11-ink: "#191c13"
  b5-11-accent: "#92291c"
  b5-12-ground: "#ebece6"
  b5-12-ink: "#1d2019"
  b5-12-accent: "#2947a4"
  b5-13-ground: "#f0eee6"
  b5-13-ink: "#221e17"
  b5-13-accent: "#a6261b"
  b5-14-ground: "#20221d"
  b5-14-ink: "#eeeee5"
  b5-14-accent: "#dce745"
  b5-15-ground: "#f4f5f1"
  b5-15-ink: "#191c18"
  b5-15-accent: "#274bc0"
  b5-16-ground: "#e2e4d9"
  b5-16-ink: "#1c2015"
  b5-16-accent: "#953127"
  b5-17-ground: "#e8e7df"
  b5-17-ink: "#151711"
  b5-17-accent: "#a3221b"
  b5-18-ground: "#e9e8e2"
  b5-18-ink: "#202119"
  b5-18-accent: "#33519c"
  b5-19-ground: "#dce745"
  b5-19-ink: "#191c13"
  b5-19-accent: "#92291c"
  b5-20-ground: "#191b17"
  b5-20-ink: "#e9ebdf"
  b5-20-accent: "#dce745"
typography:
  b5-display:
    fontFamily: "Anton, sans-serif"
    fontWeight: 400
    lineHeight: "1.25"
    letterSpacing: "-.02em"
  b5-index:
    fontFamily: "Anton, sans-serif"
    fontSize: "clamp(32px,4.45vw,70px)"
    fontWeight: 400
    lineHeight: "1.25"
    letterSpacing: "-.02em"
  b5-project-title:
    fontFamily: "Anton, sans-serif"
    fontSize: "clamp(40px,6vw,92px)"
    fontWeight: 400
    lineHeight: "1.1"
    letterSpacing: "-.02em"
  b5-mono:
    fontFamily: "Plex, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "1.5"
  b5-section-label:
    fontFamily: "Plex, monospace"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: "1.4"
    letterSpacing: ".06em"
  b5-pace-insert:
    fontFamily: "Anton, sans-serif"
    fontSize: "clamp(19px,3vw,44px)"
    fontWeight: 400
    lineHeight: ".95"
  b5-wheel:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "min(var(--wheel-size),var(--name-fit))"
    fontWeight: 400
    lineHeight: ".88"
    letterSpacing: "-.03em"
rounded:
  b5-pill: "40px"
  b5-micro: "3px"
  b5-segment-shell: "8px"
  b5-segment-button: "4px"
spacing:
  b5-page-gutter: "20px"
  b5-phone-gutter: "12px"
  b5-nav-gap: "7px"
  b5-nav-padding: "12px 19px"
  b5-control-padding: "10px 12px"
  b5-media-gap: "25px"
components:
  b5-nav-01:
    backgroundColor: "#23251e"
    textColor: "#f0f1e8"
    rounded: "{rounded.b5-pill}"
    padding: "{spacing.b5-nav-padding}"
  b5-nav-01-current:
    backgroundColor: "#dce745"
    textColor: "#1b1e14"
    rounded: "{rounded.b5-pill}"
    padding: "{spacing.b5-nav-padding}"
  b5-nav-01-hover:
    backgroundColor: "{colors.b5-01-accent}"
    textColor: "{colors.b5-01-ground}"
    rounded: "{rounded.b5-pill}"
    padding: "{spacing.b5-nav-padding}"
---

# Design System: 3seater — Batch Five

## Overview

**Creative North Star: "A Brain Dump, Then Type"**

Batch five combines the original portfolio’s immediate dense media grids with the selected Live Poster and Outline typography. Twenty compositions open on original-color work, then pair bold project names with moving inserts and the original scroll-driven client cylinder. Button-shaped navigation and quiet monospaced labels support the artwork.

This record applies only to `src/batch-five` and `/batch-five/01/` through `/batch-five/20/`. The comparison gallery is navigation, not a twenty-first direction. The production site and earlier batches keep their own historical records. The supplied second font reference is approximate: IBM Plex Mono is the chosen interpretation, not an identified exact match.

**Key Characteristics:**
- Dense media openings with 12–28 projects; no oversized introductory hero.
- Anton project lists with deterministic moving inserts before, within or after names.
- IBM Plex Mono labels and button-shaped navigation with route-local palettes.
- Original client-cylinder behavior and natural-ratio complete project media.

Source snapshot: 2026-10-14. Evidence: `src/batch-five/style.css` including its final correction overrides, `app.js`, `directions.json`, route HTML, `DIRECTION-CONTRACT.txt`, and the current batch-five brief in PRODUCT.md. This is source documentation; browser verification and independent finish review are separate.

## Colors

### Primary

Ink carries structure; red, blue or acid accents distinguish interactive states. Each route’s ground, ink and accent are normative numbered frontmatter tokens. Hover and focus recolor text; navigation also fills with the accent. Some navigation families have explicit acid, red or pale treatment overrides in addition to their route palette.

### Neutral

Paper, concrete and charcoal grounds frame original-color work. Rules mix twenty percent route ink into the ground; secondary metadata mixes seventy-five percent ink. Inactive wheel names use thirty-eight percent ink, while the active name uses full ink and its hover/focus uses the accent, including the transparent hit area.

**The Route Boundary Rule.** Keep each numbered palette inside its own route; artwork retains its original color.

## Typography

Self-hosted Anton at its real regular weight supplies the heavy condensed display voice. Self-hosted IBM Plex Mono is aliased as Plex in CSS and carries labels, navigation and factual text at weight 400. Its quiet appearance interprets the supplied reference without claiming exact identification. The original client cylinder retains Arial/Helvetica geometry and measurement rather than adopting Anton.

Frontmatter records reusable roles. Compact index variants, mobile overrides and per-route treatments remain scoped. Outline lists alternate filled and stroked names; hover/focus restores accent-filled lettering. Inline video slots vary in size and position. The final Split Pace insert uses the corrected frontmatter clamp and 25px on phones, superseding its larger earlier declaration. Metadata at 9–11px is an observed density choice, not a universal readability standard.

## Layout

Media starts directly after navigation. Desktop grid counts range from four to eight columns, with mosaics, uneven rows, paired walls and natural-height streams. Shared page gutters use the frontmatter spacing; composition adjusts at 950px and 600px. Phone layouts retain multiple visible projects rather than becoming a single hero. Side navigation moves into the phone header; bottom families retain bottom clearance. Archive uses five columns on desktop; detail uses two natural-ratio media columns and stacks at phone size. A single detail figure is centered with a 1000px maximum width.

| Route | Grid family | Navigation family | Homepage projects | Index style / following sequence |
| --- | --- | --- | --- | --- |
| 01 Live Mosaic | mosaic | pill | 18 | live / list first |
| 02 Outline Atlas | masonry | outline | 20 | outline / list first |
| 03 Dense Signal | signal | box | 24 | compact / wheel first |
| 04 Twin Walls | twins | segmented | 18 | split / list first |
| 05 Cut / Paste | cuts | acid-box | 20 | live / wheel first |
| 06 Four Reels | reels | left-pill | 20 | outline / list first |
| 07 Micro / Macro | macro | tabs | 19 | split / list first |
| 08 Contact Patch | contact | micro | 24 | compact / wheel first |
| 09 Half Tone | paired | light-segment | 18 | outline / list first |
| 10 Side Notes | sidewall | side | 24 | live / wheel first |
| 11 Wide Stack | wide | wide | 20 | split / list first |
| 12 Pinboard | pinboard | outline-box | 20 | outline / wheel first |
| 13 Bands | bands | red-pill | 20 | live / list first |
| 14 North / South | north | edges | 24 | compact / list first |
| 15 Studio Feed | justified | glass-pill | 20 | live / wheel first |
| 16 Split Pace | pace | cut-tabs | 20 | outline / list first |
| 17 Ink Grid | ink | ink | 24 | split / wheel first |
| 18 Open Frames | frames | quiet | 20 | compact / list first |
| 19 Index Current | current | bottom | 12 | live / list first |
| 20 Full Bleed | bleed | float-box | 28 | outline / wheel first |

Each homepage also contains seven selected index rows and the client wheel; the sequence column names which comes first after the grid. Full Archive, Index, Clients, Contact and project routes share factual content. Filtering exposes a live result count and a resettable empty state. Wheel-specific responsive thresholds at 700/701, 768, 1024 and 1240px preserve the original scroll-cylinder proportions.

## Elevation & Depth

Artwork and lists are primarily flat; rules, overlap, scale and spacing create hierarchy. The bottom navigation dock alone uses a small shadow. Studio Feed’s translucent pills use backdrop blur. These route-specific treatments do not establish a general raised-card system. The client cylinder uses perspective and a three-dimensional drum; its static reduced-motion form removes that depth.

## Shapes

Artwork is rectangular and unrounded. Buttons range from square outlines to pills, small-corner segments and cut tabs according to route. Fine one-pixel borders organize navigation, filters and editorial rows; focus uses a two-pixel accent outline with five-pixel offset, while client names retain their dedicated one-pixel ring with six-pixel offset.

## Components

### Navigation and controls

Five real destination links—Work, Archive, Index, Clients and Contact—are styled as clear buttons. Current links invert route ink and ground; hover/focus use contrast-changing treatment. There is no navigation logo and no visible global video-pause control in this batch. Search and select controls use transparent surfaces, one-pixel borders and the shared control padding. These controls keep their native semantics.

### Media tiles and bold index

Tiles are project anchors with underlined titles, direction arrows and optional factual metadata. Thumbnail slots may crop to their composition; natural-height streams preserve intrinsic proportions. The full Index combines underlined Anton names with deterministically placed moving inserts, and outline variants alternate stroked lettering. Complete project media preserves its natural aspect ratio and transparent surroundings.

**The Whole Artwork Rule.** Full-project artwork keeps its intrinsic proportions without opaque letterbox wrappers.

### Client wheel

The original preferred ordering and configured exclusions feed a scroll-driven cylindrical client list. Names open real client galleries; the active name is keyboard reachable and a matching transparent hit area supports pointer access. During scrolling the hit area is disabled to prevent accidental selection. Reduced motion presents a wrapping static list; Clients also has an all-client directory. The final CSS override makes both direct name interaction and hit-area interaction accent-colored.

### Playback and external sources

Self-hosted videos request muted inline autoplay and looping, loading near the viewport. Already loaded video is not deliberately paused on scroll-out. Native detail controls remain available. Six supplied YouTube source links are restored as privacy-enhanced embeds plus direct links, including Iceman and Carti; parameters request muted looping autoplay. Browser/provider restrictions may prevent playback, so the request is not a guarantee. Reduced motion stops CSS animation and transitions and makes the wheel static; it does not override the requested video default.

## Do's and Don'ts

### Do:
- Do keep artwork in original color and full project media at natural proportions.
- Do use each numbered palette only in its corresponding batch-five route.
- Do preserve underlined clickable text, current-page indication and visible accent focus.
- Do retain all thirty projects, fifty-one media assets, facts, contact and six source video links.

### Don't:
- Don't add a navigation logo or visible global pause-video button to batch five.
- Don't make hover a prerequisite for video playback.
- Don't add opaque black mats around complete artwork.
- Don't claim that IBM Plex Mono exactly identifies the supplied font reference.
- Don't apply this experiment’s tokens to production or historical batches.

### Historical record — Earlier batches only

The complete prior DESIGN.md is preserved below verbatim as a source snapshot, including its earlier nested records. Its frontmatter and review statements apply to their named batches, not batch five. Earlier drift is preserved rather than silently repaired. In particular, the batch-four visible pause-button description is historical and does not govern batch five.

<details>
<summary>Preserved Batch Four and earlier design records</summary>

`````markdown
---
name: "3seater — Batch Four / Type as Structure"
description: "Active tokens apply only to src/batch-four; batch-three history is preserved below."
colors:
  b4-01-ground: "#dce745"
  b4-01-ink: "#191c13"
  b4-02-ground: "#e8e8e3"
  b4-02-ink: "#151515"
  b4-03-ground: "#f0efea"
  b4-03-ink: "#20201d"
  b4-04-ground: "#171917"
  b4-04-ink: "#e3e94f"
  b4-05-ground: "#dedfdb"
  b4-05-ink: "#141613"
  b4-06-ground: "#e8e5dc"
  b4-06-ink: "#23231e"
  b4-07-ground: "#dce745"
  b4-07-ink: "#191c13"
  b4-08-ground: "#f0efea"
  b4-08-ink: "#1a1c18"
  b4-09-ground: "#232521"
  b4-09-ink: "#e9e9e2"
  b4-10-ground: "#e6e8de"
  b4-10-ink: "#1c2117"
  b4-11-ground: "#f0efea"
  b4-11-ink: "#b52b20"
  b4-12-ground: "#161716"
  b4-12-ink: "#eeeee5"
  b4-13-ground: "#e2e3dd"
  b4-13-ink: "#252720"
  b4-14-ground: "#dce745"
  b4-14-ink: "#191c13"
  b4-15-ground: "#e8e8e5"
  b4-15-ink: "#141512"
  b4-16-ground: "#efeee7"
  b4-16-ink: "#191b18"
  b4-17-ground: "#dce745"
  b4-17-ink: "#191c13"
  b4-18-ground: "#e6e6e0"
  b4-18-ink: "#1c1d19"
  b4-19-ground: "#191b18"
  b4-19-ink: "#e4e74b"
  b4-20-ground: "#e7e6e0"
  b4-20-ink: "#1c1d18"
  audio-ground: "#f5f5f0"
  audio-ink: "#151515"
typography:
  display:
    fontFamily: "Anton, sans-serif"
    fontWeight: 400
    lineHeight: "1.05"
    letterSpacing: "-.02em"
  project-title:
    fontFamily: "Anton, sans-serif"
    fontSize: "clamp(45px,7vw,105px)"
    fontWeight: 400
    lineHeight: "1.05"
    letterSpacing: "-.02em"
  card-title:
    fontFamily: "Anton, sans-serif"
    fontSize: "clamp(22px,2.5vw,43px)"
    fontWeight: 400
    lineHeight: "1.05"
    letterSpacing: "-.02em"
  body:
    fontFamily: "Archivo, Arial, sans-serif"
    fontSize: "14px"
    lineHeight: "1.35"
spacing:
  control-padding: "8px 12px"
  header-padding: "24px 32px"
  phone-header-padding: "18px 16px"
  project-gallery-gap: "28px"
components:
  audio-button:
    backgroundColor: "{colors.audio-ground}"
    textColor: "{colors.audio-ink}"
    padding: "9px 12px"
  audio-button-hover:
    backgroundColor: "{colors.audio-ink}"
    textColor: "{colors.audio-ground}"
---

# Design System: 3seater — Batch Four

## Overview

**Creative North Star: "Type as Structure"**

Batch four develops the user-selected Type Poster world, with Concrete as its secondary reference. Heavy condensed lettering supplies structure; moving artwork participates in the composition from the first viewport. The twenty routes share this voice while varying their browsing model, density, alignment and media scale.

This source-derived record applies only to `src/batch-four` and `/batch-four/01/` through `/batch-four/20/`. It is not a production-wide identity. The build is code-led; no generated comp is an authority. The comparison gallery is navigation, not an additional direction.

**Key Characteristics:**
- Anton display typography paired with Archivo utility text.
- Route-local acid, concrete, paper, red and charcoal palettes.
- Flat ruled surfaces and borderless moving artwork.
- Twenty distinct compositions within the selected typographic realm.

Source snapshot: 2026-10-14. Evidence: batch-four `style.css`, `app.js`, `directions.json`, route HTML, and the direction contract. Independent finish review is separate; no full validation pass is asserted here. Earlier batches retain their own design worlds while their media behavior has been updated under the current brief.

## Colors

### Primary

Acid yellow-green anchors Live Poster, Double Exposure, Long Play and Outline. Running Type and Type Selector reverse that relationship on dark grounds. Red Letter uses red as its typographic voice. These are route identities, not interchangeable global accents.

### Neutral

Concrete, warm paper and charcoal provide the remaining ground/ink pairs. The frontmatter's numbered tokens map to the correspondingly numbered batch-four route. Audio controls use a dedicated light/dark pair for visibility over artwork.

**The Route Boundary Rule.** Keep each numbered palette inside its own route; artwork retains its original color.

## Typography

Anton is the self-hosted condensed display face, used at its actual regular weight; its heavy form supplies the requested boldness without synthetic bolding. Archivo handles body text, navigation and compact facts. Headings are uppercase with tight tracking. The frontmatter records reusable roles, not every route-specific display size.

Project names lead the visual hierarchy. Scale responds to composition: the Live Poster ledger uses `clamp(32px,4.9vw,76px)`, while the Dense Matter identity reaches `clamp(90px,21vw,310px)`. Full-project titles resolve to 49px on phones. Body text becomes 13px at the phone breakpoint. Small metadata is an observed density choice, not a minimum readability standard for future work.

**The Type Structure Rule.** Preserve meaningful title hierarchy and full project-name access when adapting the layout; do not substitute a generic hero for the work.

## Layout

The shared desktop header uses horizontal identity/navigation and the footer carries contact plus return-to-comparison access. Route composition remains independently authored. Medium adjustments occur at 850px, phone composition at 600px, and Live Poster widens its insert at 1500px.

| Route | Desktop structure | Phone adaptation |
| --- | --- | --- |
| 01 Live Poster | Ruled title ledger with alternating inline moving inserts. | Two columns; date removed; fixed small media insert. |
| 02 Cutlines | Six-column grid with two-, three- and four-column cuts. | Two columns; featured cut spans both. |
| 03 Split Bill | Sticky monumental identity beside staggered two-column work. | Identity becomes horizontal above the paired archive. |
| 04 Running Type | Bounded moving headlines with anchored media windows. | Headlines wrap and stop moving. |
| 05 Block Party | Twelve-column interlocking image and title blocks. | Two columns with occasional full-width blocks. |
| 06 Wide Margin | Large titles paired with narrow natural-ratio media. | Title and media remain paired with tighter offsets. |
| 07 Double Exposure | Three staggered poster columns with overlapping title plates. | Two columns with alternating vertical offset. |
| 08 Front Page | Masthead, unequal three-part lead, four-column archive. | Lead image spans two columns; remainder stays paired. |
| 09 Spine | Vertical sticky identity and two staggered media streams. | Identity becomes horizontal; streams remain paired. |
| 10 Open Set | Native disclosure rows; first three projects open. | Smaller titles; media and project facts remain side by side. |
| 11 Red Letter | Red type with sparse asymmetric moving inserts. | Offsets contract around narrower paired rows. |
| 12 After Dark | Alternating inverse title/image rows. | Media stays in the right-hand column. |
| 13 Duet | Alternating unequal pairs; titles beside artwork. | Two project columns; each title moves below its image. |
| 14 Long Play | Horizontal snap sequence of typographic posters. | Cards occupy 76vw with native scrolling and buttons. |
| 15 Dense Matter | Five-column thumbnail grid below oversized wordmark. | Three columns with square crops. |
| 16 Offset | Stepped text bands with media embedded in the row. | Compact media; narrower steps; dates hidden. |
| 17 Outline | Alternating filled/outlined lettering and left media rail. | Two columns; smaller type and one-pixel outline. |
| 18 Three Presses | Three independently scrolling discipline columns. | Columns stack into horizontal media streams. |
| 19 Type Selector | Large button index and sticky live stage. | Stage precedes selector list; sticky positioning removed. |
| 20 Heavy Rotation | Central vertical identity splits uneven media streams. | Identity sits above two columns. |

Project detail uses title/facts columns followed by two media columns; at phone size the detail stacks into one column. A solitary media figure has a 1000px maximum width. Thumbnails may crop to a composed slot; complete project media uses intrinsic proportions and transparent surroundings.

## Elevation & Depth

The system is flat: no box-shadow vocabulary is implemented. Rules, scale, staggered alignment and overlap create hierarchy. Double Exposure uses a ground-colored title plate over the image edge; Block Party uses occasional ink/ground reversal. Neither treatment establishes a shadow-based card system.

## Shapes

Angular rectangles, straight rules and unrounded media slots define the form language. Native button corner rendering is not an explicit radius token. Borders range from fine rules to stronger three-pixel editorial divisions. Outline lettering belongs to Outline and selected detail treatments; it is not the default title style.

## Components

### Controls and navigation

Simple text links and transparent bordered buttons inherit each route's ink and ground. Buttons invert on hover; interactive elements carry a three-pixel current-color focus outline with five-pixel offset. Navigation exposes Info, Contact and the video pause/play toggle. Route changes focus the main heading. Underlined text playback controls remain distinct from project links.

### Media and project cards

Each project card is a real anchor, with image/video, title and compact facts. Hover underlines links; Live Poster shifts its title slightly and Offset relaxes tracking. Full media remains unframed. Audio controls sit over video at the lower right and expose pressed state. Covers use preview video derivatives; detail uses full sources. Playback loads near the viewport, starts muted/inline and loops; loaded video is not deliberately stopped on scroll-out. Browsers can block autoplay. A visitor can pause the videos globally; that choice persists across project routes and selector changes until explicit resume.

**The Whole Artwork Rule.** Full-project artwork keeps its intrinsic proportions without opaque letterbox wrappers.

### Disclosure and selection

Open Set uses native details/summary, with the first three entries expanded. Type Selector uses buttons with `aria-pressed`, an inverted selected state and an announced project change; the stage contains a real project link. Long Play includes previous/next buttons around a natively scrollable rail. Three Presses preserves separate discipline browsing.

### Motion

Running Type moves titles horizontally over 14 seconds, alternating direction, and pauses the ornamental title animation on hover. Live Poster shifts over 220ms and Offset tracking changes over 250ms, both with the same fast-settling easing. Reduced motion disables CSS animation/transitions and smooth scrolling while preserving the user's requested project-video default. The explicit pause control remains available.

## Do's and Don'ts

### Do:
- Do keep the selected Anton display voice and original artwork colors.
- Do preserve route-local composition when extending a direction.
- Do keep complete project media at natural aspect ratio with transparent surroundings.
- Do default videos to muted inline autoplay and loop, while retaining visitor playback controls.

### Don't:
- Don't add black media mats or side bars around full project artwork.
- Don't make hover the requirement for video playback.
- Don't treat the palette of one route as a global production brand.
- Don't equate a source scan with a completed browser, accessibility or playback review.

### Historical record — Batch Three only

The complete prior document is retained below as an archival source snapshot, not active guidance or frontmatter for batch four. Its twenty independent design worlds remain historical. Descriptions of contained dark media staging or former playback behavior are superseded by the current media brief and later source updates; no past review statement validates batch four.

<details>
<summary>Preserved Batch Three design record</summary>

````markdown
---
name: "3seater — Batch Three / Twenty Independent Worlds"
description: "Source-derived visual record scoped only to src/batch-three; not a production-wide design system."
colors:
  w01-ground: "#111110"
  w01-ink: "#eeeee8"
  w02-ground: "#f5f5f7"
  w02-ink: "#202125"
  w03-ground: "#e8e8e3"
  w03-ink: "#151515"
  w04-ground: "#deded7"
  w04-ink: "#20211e"
  w05-ground: "#121214"
  w05-ink: "#faf9f5"
  w06-ground: "#f3f2eb"
  w06-ink: "#172018"
  w07-ground: "#e7e6e0"
  w07-ink: "#181817"
  w08-ground: "#111216"
  w08-ink: "#eeeeed"
  w09-ground: "#d4d8d8"
  w09-ink: "#242828"
  w10-ground: "#ebe7df"
  w10-ink: "#262320"
  w11-ground: "#f2f3ed"
  w11-ink: "#252622"
  w12-ground: "#f9f8f5"
  w12-ink: "#242424"
  w13-ground: "#dbded4"
  w13-ink: "#272b23"
  w14-ground: "#e5e5e5"
  w14-ink: "#222222"
  w15-ground: "#e8e7e0"
  w15-ink: "#21211f"
  w16-ground: "#141415"
  w16-ink: "#f3f3ee"
  w17-ground: "#dce745"
  w17-ink: "#191c13"
  w18-ground: "#f1f0ed"
  w18-ink: "#252726"
  w19-ground: "#161918"
  w19-ink: "#ecefe7"
  w20-ground: "#eeece6"
  w20-ink: "#2a2927"
  w02-sidebar: "#e8e8eb"
  w02-selected: "#d4d4d9"
  w07-wayfinding: "#b9291b"
  w09-window: "#f5f5f2"
  w09-dock: "#f9faf8b8"
  w13-card: "#fafaf5"
  w18-folder: "#fff"
  media-stage: "#080808"
typography:
  w01-body:
    fontFamily: "Archivo, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.4"
    letterSpacing: "normal"
  w01-display:
    fontFamily: "Archivo, sans-serif"
    fontSize: "clamp(40px,5vw,76px)"
    fontWeight: 500
    lineHeight: "1"
    letterSpacing: "-.03em"
  w02-body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.4"
    letterSpacing: "normal"
  w02-display:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "32px"
    fontWeight: 650
    lineHeight: "1.4"
    letterSpacing: "-.03em"
  w03-body:
    fontFamily: "Anton, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.4"
    letterSpacing: "normal"
  w03-display:
    fontFamily: "Anton, sans-serif"
    fontSize: "clamp(65px,11vw,150px)"
    fontWeight: 500
    lineHeight: "1"
    letterSpacing: "-.02em"
  w04-body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.4"
    letterSpacing: "normal"
  w04-display:
    fontFamily: "Manrope, sans-serif"
    fontSize: "25px"
    fontWeight: 650
    lineHeight: "1.4"
    letterSpacing: "-.04em"
  w05-body:
    fontFamily: "Barlow, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.4"
    letterSpacing: "normal"
  w05-display:
    fontFamily: "Barlow, sans-serif"
    fontSize: "23px"
    fontWeight: 500
    lineHeight: "1.15"
    letterSpacing: "-.03em"
  w06-body:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.4"
    letterSpacing: "normal"
  w06-display:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(24px,3.4vw,50px)"
    fontWeight: 400
    lineHeight: "1.1"
    letterSpacing: "-.035em"
  w07-body:
    fontFamily: "Archivo, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.4"
    letterSpacing: "normal"
  w07-display:
    fontFamily: "Archivo, sans-serif"
    fontSize: "clamp(38px,4.4vw,67px)"
    fontWeight: 700
    lineHeight: ".99"
    letterSpacing: "-.035em"
  w08-body:
    fontFamily: "Sora, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.4"
    letterSpacing: "normal"
  w08-display:
    fontFamily: "Sora, sans-serif"
    fontSize: "clamp(45px,6vw,84px)"
    fontWeight: 500
    lineHeight: "1.05"
    letterSpacing: "-.03em"
  w09-body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.4"
    letterSpacing: "normal"
  w09-display:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "20px"
    fontWeight: 650
    lineHeight: "1.4"
    letterSpacing: "-.04em"
  w10-body:
    fontFamily: "Outfit, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.4"
    letterSpacing: "normal"
  w10-display:
    fontFamily: "Outfit, sans-serif"
    fontSize: "65px"
    fontWeight: 650
    lineHeight: "1"
    letterSpacing: "-.04em"
  w11-body:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.4"
    letterSpacing: "normal"
  w11-display:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "30px"
    fontWeight: 500
    lineHeight: "1.05"
    letterSpacing: "normal"
  w12-body:
    fontFamily: "Work Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.4"
    letterSpacing: "normal"
  w12-display:
    fontFamily: "Work Sans, sans-serif"
    fontSize: "18px"
    fontWeight: 500
    lineHeight: "1.4"
    letterSpacing: "-.03em"
  w13-body:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.4"
    letterSpacing: "normal"
  w13-display:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "clamp(42px,5.5vw,78px)"
    fontWeight: 500
    lineHeight: "1.02"
    letterSpacing: "-.03em"
  w14-body:
    fontFamily: "Figtree, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.4"
    letterSpacing: "normal"
  w14-display:
    fontFamily: "Figtree, sans-serif"
    fontSize: "65px"
    fontWeight: 500
    lineHeight: "1"
    letterSpacing: "-.03em"
  w15-body:
    fontFamily: "Sora, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.4"
    letterSpacing: "normal"
  w15-display:
    fontFamily: "Sora, sans-serif"
    fontSize: "52px"
    fontWeight: 500
    lineHeight: "1.05"
    letterSpacing: "-.03em"
  w16-body:
    fontFamily: "Barlow, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.4"
    letterSpacing: "normal"
  w16-display:
    fontFamily: "Barlow, sans-serif"
    fontSize: "40px"
    fontWeight: 500
    lineHeight: "1.4"
    letterSpacing: "-.03em"
  w17-body:
    fontFamily: "Anton, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.4"
    letterSpacing: "normal"
  w17-display:
    fontFamily: "Anton, sans-serif"
    fontSize: "clamp(35px,5.5vw,80px)"
    fontWeight: 400
    lineHeight: "1.02"
    letterSpacing: "-.01em"
  w18-body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.4"
    letterSpacing: "normal"
  w18-display:
    fontFamily: "Manrope, sans-serif"
    fontSize: "48px"
    fontWeight: 650
    lineHeight: "1.4"
    letterSpacing: "-.03em"
  w19-body:
    fontFamily: "Outfit, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.4"
    letterSpacing: "normal"
  w19-display:
    fontFamily: "Outfit, sans-serif"
    fontSize: "clamp(70px,8vw,112px)"
    fontWeight: 500
    lineHeight: ".92"
    letterSpacing: "-.035em"
  w20-body:
    fontFamily: "Work Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.4"
    letterSpacing: "normal"
  w20-display:
    fontFamily: "Work Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "1.4"
    letterSpacing: "0"
rounded:
  library-control: "9px"
  desktop-window: "13px"
  desktop-dock: "16px"
  stack-card: "13px"
  stack-image: "8px"
  collection-folder: "13px"
  collection-image: "12px"
  radial-selector: "50%"
spacing:
  control-padding: "10px 14px"
  ledger-columns: "5vw"
  concrete-gutter: "3px"
  film-gap: "32px"
  proof-gap: "32px 16px"
  intervals-gap: "100px 25px"
components:
  w02-filter-selected:
    backgroundColor: "{colors.w02-selected}"
    textColor: "{colors.w02-ink}"
    rounded: "{rounded.library-control}"
    padding: "12px"
  w09-window:
    backgroundColor: "{colors.w09-window}"
    textColor: "{colors.w09-ink}"
    rounded: "{rounded.desktop-window}"
    width: "min(760px,74vw)"
  w13-card:
    backgroundColor: "{colors.w13-card}"
    textColor: "{colors.w13-ink}"
    rounded: "{rounded.stack-card}"
    padding: "12px"
  w18-folder:
    backgroundColor: "{colors.w18-folder}"
    textColor: "{colors.w18-ink}"
    rounded: "{rounded.collection-folder}"
---

# Design System: 3seater — Batch Three

## Overview

**Creative North Star: "Twenty independent ways into the same work"**

This is a source-derived record of the twenty code-led portfolio alternatives in `src/batch-three`, routes `/batch-three/01/` through `/batch-three/20/`. It applies only to this experiment. It does not redefine the production portfolio, earlier batches, or a universal 3seater identity. The comparison hub is a navigation surface, not a twenty-first design authority.

The approved brief spans minimal studios, abstract and brutalist structures, Framer-like component craft, and iOS material. Each route makes an independent choice about composition and interaction. The Design Futurist informed asset/component mechanisms only; its homepage is not a visual reference. These are original coded interpretations, not imported native Framer components.

**Key Characteristics:**
- Independent browsing models with route-local palettes, type and form.
- Original-color project media and factual metadata remain the content authority.
- Spatial, sequential, textual and quiet photographic approaches coexist.

This captures the source during review on 2026-10-13. It is not evidence of a final visual, accessibility or interaction review pass. Source authority: `src/batch-three/directions.json`, route HTML font declarations, `style.css`, and `app.js`.

## Colors

**The Route Boundary Rule.** Apply each `wNN` token only within that numbered world. Similar neutral grounds do not imply shared composition or interchangeable components.

### Primary

The red wayfinding token belongs to Public Display (07); the acidic ground belongs to Type Poster (17). They are independent identities, not primary and secondary accents of a global palette.

### Neutral

Each route owns its ground and ink pair in frontmatter. Library sidebar and selected surfaces belong to 02, translucent dock and contained window to 09, tactile card surface to 13, white folder surface to 18. Dark media staging preserves visibility around contained artwork.

**The Artwork Color Rule.** Preserve original project colors. UI palette choices do not authorize recoloring or desaturating media. The existing shared tile hover brightens images slightly; this is a transient state, not asset recoloring.

## Typography

Frontmatter records each route’s body and principal expressive role. The HTML names every self-hosted face `Direction`; that alias resolves to a different font file per route. Family names here identify those files for readers. Use the corresponding self-hosted asset when building. These twenty role pairs are alternatives, not one type scale. In routes 04 and 09 the principal role is the identity mark; route 20 intentionally gives project titles a modest scale.

| World | Typeface | Principal role / additional hierarchy |
| --- | --- | --- |
| 01 Type / Motion | Archivo | Clipped echo heading; ledger names 18–29px, years 11px. |
| 02 Photo Library | DM Sans | Library title 32px; navigation 14px; compact captions 12px. |
| 03 Concrete | Anton | Uppercase identity; labels 27px, Arial metadata 11px. |
| 04 Open Field | Manrope | Identity and 12px utility text avoid a display hero. |
| 05 Film Room | Barlow | Project titles 23px, captions and rail 12px. |
| 06 Concertina | Space Grotesk | Disclosure titles 24–50px; metadata 12px. |
| 07 Public Display | Archivo | Red heading 38–67px; wall titles 14px, client/year 10px. |
| 08 Orbit | Sora | Scene heading 45–84px; direct-index heading 18px. |
| 09 Desktop | DM Sans | Identity 20px; window chrome 12px. |
| 10 Waterfall | Outfit | Vertical identity 65px; media captions 13px and 11px. |
| 11 Word Space | Space Grotesk | Six name sizes: 23, 26, 30, 42, 56 and 65px. |
| 12 Proof Sheet | Work Sans | Section title 18px; project title 12px and numbering 10px. |
| 13 Card Stack | Plus Jakarta Sans | Deck heading 42–78px; card title 14px and year 11px. |
| 14 Chronology | Figtree | Year 65px; page title 18px. |
| 15 Radial | Sora | Title 52px; dial labels 11px. |
| 16 Three Channels | Barlow | Discipline headings 40px; rail labels 11px. |
| 17 Type Poster | Anton | Project bands 35–80px; Arial utility text, rather than Anton everywhere. |
| 18 Collections | Manrope | Collection title 48px; folder title 18px / 600, count 11px. |
| 19 Oblique | Outfit | Anchored heading 70–112px; small factual captions. |
| 20 Intervals | Work Sans | Project titles 14px; metadata 10px; restrained identity. |

Body baseline is 14px / 1.4. Shared detail titles begin at `clamp(34px,5vw,76px)` and line-height 1.07 before route overrides; mobile detail titles resolve to 36px. Small archival metadata is an observed implementation detail, not a minimum legibility target for future work.

## Layout

**The Independent Composition Rule.** Preserve the browsing mechanism and spatial structure of each world. Sharing project data, SVG icons and factual detail rendering does not establish a shared homepage shell.

| World | Desktop composition and interaction | At 650px and below |
| --- | --- | --- |
| 01 Type / Motion | Two-column ledger (1.1fr / 1fr), 5vw gap; sticky preview at 65px with 105px top offset. Text rows select preview on pointer or focus and link to detail. | Preview precedes ledger in a vertical flow; preview becomes static; 20px page inset. |
| 02 Photo Library | Persistent 215px library sidebar, four-column image grid, 25px / 12px gaps; category buttons and project/client search intersect. | Sidebar becomes wrapping filter controls; two-column grid, 20px / 10px gaps. At 1000px: 175px sidebar, three columns; at 1550px: five columns. |
| 03 Concrete | Six-column irregular wall with 3px black gutters; blocks span two, three or four columns. Oversized uppercase identity and project labels supply mass. | Two columns; selected large blocks span both; 170px / 230px image heights. Identity moves above navigation. |
| 04 Open Field | Scrollable 2400px by 1830px spatial canvas; 260px and 310px tiles with small alternating rotations. Drag, zoom and reset controls sit in a fixed translucent footer. | Canvas starts at 0.7 zoom; footer wraps. Spatial navigation retains its independent complete project list. |
| 05 Film Room | Horizontal snap strip with 47vw articles, 32px gaps and 48vh contained media; caption rail supplies position, title and year. Arrow buttons scroll the strip. | 80vw articles, 18px gaps and 43vh media; footer wraps, maintaining horizontal browsing. |
| 06 Concertina | Single column of native disclosure rows; title/year/plus arrangement. Expanded body splits 1.6fr / 1fr with 5vw gap, containing image and factual metadata. | 25px titles; year removed from summary; expanded image and metadata stack with 20px gap. |
| 07 Public Display | Sticky red identity spine occupying 24%; three-column ruled exhibition wall with 35px / 15px gaps. | Identity becomes a static two-column block; two-column wall. At 1000px spine is 23%, wall already has two columns. |
| 08 Orbit | 640px scene, 1050px perspective, ten covers rotated in 36-degree steps around a 380px radius; controls rotate ring. Complete five-column project index follows. | 500px scene; perspective scaled to .67 and radius becomes 300px; complete two-column index remains. |
| 09 Desktop | Centered image window at min(760px,74vw), caption and sequence controls; fixed horizontally scrolling thumbnail dock. Active selection updates title, stage and dock state. | Window becomes 92vw with 1.35 preview ratio; dock thumbnails shrink from 48px to 42px. |
| 10 Waterfall | Three image streams with starting offsets 60px, 200px, 110px and 80px between projects; fixed vertical identity at left. Alternate images use portrait ratio. | Identity becomes horizontal; first two streams remain paired, third wraps into a full-width two-column stream. |
| 11 Word Space | Wrapping field of irregularly scaled title links with 40px / 5vw gaps. Hover or focus reveals an angled image behind each name. | Titles use 19px to 43px sizes; image reveals shrink to 160px by 110px; field clips overflowing reveals. |
| 12 Proof Sheet | Six-column photographic overview, 32px / 16px gaps, contained 1.25-ratio images; compact numbered and dated captions. No oversized hero. | Three columns with 25px / 9px gaps; at 1000px four columns and at 1550px seven columns. |
| 13 Card Stack | 30% title area beside a 400px-high layered deck, max width 650px. Three cards show depth; arrows or horizontal swipes advance the current project. | Title and deck stack; deck height becomes 320px with 26px horizontal page inset. |
| 14 Chronology | Horizontal year columns, newest first; each 285px column has a left rule, sticky year heading and vertical work sequence. | 245px columns maintain native horizontal exploration; year headings become 55px. |
| 15 Radial | 580px circular selector holds numbered 36px buttons around a centered 360px preview; adjacent title, sequence controls and direct list. | 350px wheel with 28px buttons, 230px preview; controls wrap below. At 1000px composition already stacks vertically. |
| 16 Three Channels | Three equal discipline columns with independent vertical scrolling within a viewport-height frame; Motion, Graphic and 3D headers. Projects may appear in multiple matching channels. | Channels stack; each becomes an independent horizontal snap strip with 70vw tiles. |
| 17 Type Poster | Uppercase project title bands with 2px rules and alternating 0 / 8vw / 16vw indents; hover or focus reveals an angled image. | 35px titles with 0 / 5vw / 9vw indents; reveal images shrink to 180px by 120px. |
| 18 Collections | Centered 960px collection area; three featured images above category disclosure folders. Each folder expands its own three-column project grid. | Featured row remains three images; folder contents become two columns. This is disclosure browsing, unlike route 02 filtering. |
| 19 Oblique | Anchored 30%-wide title beside a two-column image runway rotated -9 degrees; alternate projects offset 140px. | Title becomes static; runway occupies 86%, rotates -6 degrees and offsets alternating projects 90px. |
| 20 Intervals | Twelve-column asymmetric placement repeats six pair positions with 100px / 25px gaps and staggered 0 to 160px vertical offsets. Contained original-color artwork leads. | Six-column grid alternates spans 1/5 and 3/7; vertical offsets reset, 45px / 15px gaps retain the asymmetric rhythm. |

The stylesheet also uses a 1000px adaptation and a 1550px wide-screen expansion. Route-specific behavior in the table takes priority over generic responsive assumptions. Shared project detail pages preserve the full media sequence and facts; at mobile width they use a single vertical media flow, 20px page inset and 20px media gap. The complete direct project list supports spatial or selective views.

## Elevation & Depth

Most worlds are flat and organized through rules, spacing, scale or image arrangement. Depth is local: Open Field uses `0 12px 25px #20211e26`; Orbit uses `0 12px 28px #0008`; Desktop uses `0 24px 70px #29363633` for its window and `0 10px 30px #28333326` for its dock; Card Stack uses `0 20px 40px #30372430`. Desktop’s dock blurs its backdrop at 22px and the field toolbar at 15px. These are specific material decisions, not shadows to add across the batch.

Orbit creates actual perspective through a transformed ring. Card Stack uses rotations and translations around a lower origin. Oblique tilts the image runway while its title stays anchored. Flat worlds do not need simulated depth.

## Shapes

Concrete’s 3px gutters and Type Poster’s 2px rules preserve blunt geometry. Photo Library uses softly rounded control and image corners. Desktop uses a rounded window and dock; Card Stack distinguishes outer card and inner image corners. Collections uses rounded disclosure containers and thumbnails. Radial is circular; Orbit’s cards remain rectangular. The exact reusable radii are in frontmatter. Do not generalize rounded shells or brutalist rules into other worlds.

## Components

The sidecar contains representative self-contained previews scoped to their original worlds. They are extracted visual examples; preview placeholders are not new portfolio content. Its synthesized tonal ramps are panel-only visualization metadata, not additional implementation palette tokens.

- **Ledger selection (01):** a text row exposes a preview on pointer entry and focus; activation navigates to the project. Active row inverts ground and ink and adds horizontal inset. Preview reveal runs 350ms with the observed easing.
- **Library controls (02):** category buttons and an underlined search input filter together. Selected button uses the local selected surface; empty results have a visible message.
- **Disclosure (06 and 18):** native details/summary preserve keyboard operation. The plus SVG rotates when open. Concertina reveals an image and metadata; Collections reveals a grid inside a rounded folder.
- **Sequential controls (09, 13, 15):** previous/next buttons wrap through the collection; current position is numeric. Dock and dial selectors expose pressed state. Selection in 09, 13 and 15 announces project title and position through a polite status while preserving control focus. Card Stack also accepts a horizontal swipe; rear cards are inert and hidden from assistive technology.
- **Image tile:** factual title/year accompanying a linked original-color cover. It is a low-level utility, not a mandatory card shell. Proof Sheet, Concrete, Intervals, and title-reveal worlds construct their own entries.
- **Navigation:** local composition decides where identity, Info, contact, direct list and sequence live. Text links underline on hover. Icons are inline SVG; no decorative glyph substitutes.
- **Factual project detail:** full-page hash route renders title, applicable metadata, description, optional external link, and every image/video. Videos use native controls. Hash navigation focuses the destination heading or main content. Route-local typography and media layout remain in effect.

Keyboard-visible outlines use current color (3px with 5px offset). Buttons dim when disabled. Reduced-motion CSS removes animation, transitions and smooth scrolling; the film transport also checks the media preference in JavaScript. Orbit’s 900ms transform, dock’s 180ms lift, text reveals and clipped type echo belong to their respective worlds.

## Do's and Don'ts

### Do:
- Do keep each world’s composition, type, colors and browsing behavior together.
- Do preserve all real projects, original-color media and factual information.
- Do retain direct project access, keyboard focus and reduced-motion behavior.
- Do treat this as a batch-three implementation snapshot while review continues.

### Don't:
- Don't impose one visual header, card shell or global palette on all twenty routes.
- Don't use paper effects, crumpling or unfolding concepts.
- Don't derive homepage art direction from The Design Futurist; only its assets/components were reference signals.
- Don't promote batch-three decisions into production or historical batches without an explicit brief.

````

</details>
`````

</details>

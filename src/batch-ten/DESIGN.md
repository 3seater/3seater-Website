# Batch Ten: four favorites plus ten new colors

Experience mode. Preserve batch-nine structure, typography, spacing, content and behavior exactly. Routes 01-04 retain Original Frost, Cobalt, Acid Yellow and Warm Bone tokens verbatim. Routes 05-14 change palette tokens only. palettes.json is authoritative. Gallery cards are palette specimens, not website screenshots. Inactive wheel names use 20% ink / 80% paper; Original Frost retains its existing gray. Active names retain full ink. All media retains original colors.

Batch Ten navigation reliability: removed the fade-to-empty route animation; keep outgoing content visible during bounded poster decoding, commit new content and scroll together, reject stale navigation, reset Next Project and explicit top-level navigation to the top, and preserve browser-history restoration. Project video posters remain separate visible layers until a decoded video frame is ready. Prefetch upcoming project stills. Header height stays consistent across routes. Original controls and icon styling remain unchanged. Local-only update.

All Batch Ten arrow and audio hover circles inherit nav-bg (86% alpha) and nav-text for a subtle theme tint. Original round geometry, icon paths, blur and motion remain unchanged; keyboard focus colors inherit the same palette.

Navigation uses a 240ms incoming snapshot crossfade over an opaque outgoing snapshot; navigation capsule stays steady. Reduced motion uses atomic changes. No layout or palette changes.

Project pages use natural-ratio justified rows (20px gaps, 12px mobile); width ratios align media heights without cropping. project.txt Layout allows explicit rows. Doji uses solo trailer, paired Banner/Card, solo UI.

Project opening media rows: desktop height capped around 60svh with extra room on short windows, width scales proportionally and stays left aligned. Later rows remain full width. Mobile retains natural single-column media. Shared by all 14 palettes.

Updated project media: remove first-row-only cap. Entire media canvas max-width 980px with consistent 20px gaps (12px mobile). Auto/bento layouts use a large first piece beside two stacked pieces when their proportions fit; heights align without cropping. Remaining rows share canvas width. Doji uses Layout: bento. Mobile stacks in content order.

Bento trial rejected: supporting artwork became too small. Restore full original media-column width; use natural-ratio aligned rows without a first-row cap or stacked thumbnails. Doji returns to auto. Applies to all 14 palettes.

Mobile refinement: Sturdy-inspired single-column footer using existing identity, links and statement; generous separation before the existing wordmark. Wheel uses frame-time-based 65ms smoothing between touch scroll updates, stops when settled/offscreen, respects reduced motion; desktop rotation unchanged. All 14 palettes.

Client wheel now uses 18-degree name detents on both desktop and mobile, smoothly settling at exact center. Larger scrolls can advance multiple names; entry/exit remain continuous and page scroll is never captured. Reduced motion stays static. All 14 palettes.

Wheel containment: CSS clip-path confines promoted cylinder layers to the client section, preserving sticky scrolling. Never rely on scroll-event visibility alone to prevent overlap with selected projects/footer. Offscreen rotation resets immediately after fast flings. All 14 palettes.

All 15 local versions: selected nav tab has solid theme active fill, subtle inset outline and underline. Decorative registration crosses travel gently in outer gutters on scroll; footer adds a rule, centered crosshair and solid block above wordmark. Marks are noninteractive, hidden from accessibility tree, theme-colored and motion-reduced.

Remove decorative side crosshairs and footer rule/crosshair/block. Retain slightly lighter selected-tab fill. Client-wheel progress rail increases from 2px to 5px across all 15 versions.

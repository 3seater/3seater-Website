# Performance audit — 2026-10-18

Scope: shared main-site / batch-ten / batch-eleven runtime, media build, navigation, and deployment caching.

## Findings and changes

- Dense home layout simultaneously plays many videos in small tiles. Added 480px full-duration, silent, 30fps H.264 renditions selected for cards up to 320 CSS pixels. Larger cards retain the existing ~720px loops; project pages retain their original full video and audio sources.
- 32 small renditions total 29.30 MB versus 56.51 MB for existing card loops, a 48.2% reduction. This is the complete rendition set, not an initial-page download measurement. All 32 durations were checked against existing loops within 0.05 seconds; all are 30fps and video-only.
- Batched caption layout reads before writes in the masonry solver, avoiding per-caption synchronous layout recalculations.
- Skip resetting unloaded video elements on page disposal.
- Prepare only the leading project image rather than four; shorten the maximum image preparation wait from 250ms to 80ms. Keep stale-navigation cancellation.
- Retain a simple arrival fade, now 180ms / 0.85 opacity instead of 240ms / 0.68. The fixed navigation stays outside it.
- Lazy-load selected-project stills below the home grid.
- Add the missing canplay callback for hover-only index video previews.
- Configure one-year immutable caching for content-versioned /media files on Vercel; HTML revalidates. These production headers take effect only after deployment.

## Local comparison

Chromium, same machine, 1280px and 390px iframe viewports, repeated Work / Archive / Index and two project routes, with a warm local cache. This is not physical iPhone Safari, a controlled mobile CPU/network benchmark, or field Core Web Vitals.

Home render medians including initial render: desktop 13.65ms before / 11.3ms after; mobile-width 13.15ms before / 11.3ms after. These small samples are directional, not statistical guarantees. Typical route-to-two-animation-frame measurements stayed around 13–39ms. There were isolated desktop outliers in both versions (308ms before and 394ms after); media/compositor contention is not proven eliminated.

Both widths: no horizontal overflow; visible videos use the expected source size and loop, offscreen clips pause. Navigation regression tests pass for stale requests, rapid navigation, reduced motion, and play-request deduplication. Build verification covers 31 projects / 55 media entries and now validates both loop renditions.

No Lighthouse/INP score or real-device Safari improvement is claimed. Review the local site on the user's iPhone before publishing. No new CDN is necessary merely to apply these local fixes; the deployment remains on the existing host.

## Navigation and video continuity follow-ups

Internal links now prevent native fragment scrolling and synchronously commit through pushState. Project navigation no longer waits for image decoding. Header tabs skip the arrival fade; project transitions retain it. Explicit scrolling remains, but implicit CSS smooth scrolling is disabled. Tests cover immediate commit, modified links, and browser Back; viewport width and top stayed stable during repeated tab switches.

Added first-frame playbackPoster assets for all 32 videos. The original posters sampled 1.2 seconds in, then fresh playback jumped back to zero. Player posters and underlying stills now match time zero; original artwork/OG posters are untouched.

Retain up to 24 decoded video elements across routes, paused and muted off-page. Reattach matching elements without resetting source, poster, or time. Evict/unload the oldest beyond the limit. Project audio listeners use the route abort signal. Browser Work > Archive > Index > Work check retained readyState=4 and playback position (~4.6s before, ~5s after), playing on return. Tests cover exact node reuse, time preservation, pausing, and eviction. First visits and evicted players still need initial decoding. Real-device Safari compositing remains unverified.

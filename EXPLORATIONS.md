# Twenty grayscale directions

Branch: exploration/20-grayscale-directions.

Run `python scripts/build-explorations.py` after the normal archive build. Preview at `/explorations/`. Individual sites use `/explorations/?v=1#/` through `/explorations/?v=20#/`.

All twenty use the existing archive data, original media, contact configuration and three navigation tabs. Route handling and data are shared; each direction defines its own composition and responsive behavior. Direction 6 uses a pointer/keyboard image index; 10 uses native horizontal scroll snapping; 16 groups by real year; 18 has a working project selector. All have Archive filters, Index, project pages, client collections and contact links.

The UI and media presentation are grayscale. The original media files remain unchanged. Arial/Helvetica stacks are retained; directions 5, 13 and 17 use a system sans stack for the requested iOS feel.

The comparison directory's names/descriptions are review-only content and do not appear within the portfolio variants. The existing site entry point is unchanged. Separate Sites publication is staged in ../ui-explorations, with its own hosting identity.

Impeccable 4.5.2 was installed globally. Its Windows launcher failed with `cache_directory_failed`; design guidance was read directly. No Impeccable automated audit is claimed.

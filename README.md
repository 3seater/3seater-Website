# 3seater — Visual archive

A portfolio with one cover per project in the homepage feed, a discipline index, a selected-client wheel, and individual project pages. Client links always open the client collection, including clients with only one project. Built with HTML, CSS, JavaScript, and a folder-based content pipeline.

## Preview

The main site is now Soft Chalk at `http://127.0.0.1:4173/`.
Double-click `Open Website.cmd` to start/open it. The other color options remain
at `http://127.0.0.1:4173/batch-ten/`.

From this directory:

```powershell
npm run build
npm run dev
```

Open the Local URL printed by the server (port 4173 by default). `PORT` can select another port. Requires Node.js, Python 3, ffmpeg, and ffprobe on PATH. `npm run check` checks JavaScript syntax, generated content, media paths, and static-hosting asset limits.

The local server watches `Work` and `src`, rebuilds after saves settle, and refreshes
connected browser tabs after a successful build. New videos need time to process.
Live refresh is injected only by the local server; it is not part of the deployed site.

## Add or change work

Keep each project in its own folder inside the existing `../Work` folder. Add images or videos beside `project.txt`, then run `npm run build` and refresh the browser. To build from a different content folder, use `python scripts/build.py "D:/path/to/Work"`.

Projects can also be nested under an artist folder, such as `Work/03 Greedo/Free 03/` and `Work/03 Greedo/Halfway There/`. Each folder with its own media becomes one project; artist folders that only contain subfolders do not create extra projects. Each project's `Client:` field controls client grouping. The full relative folder path generates its unique project URL, so two artists can both have a project named `Cover Art`. Existing flat project folders continue to work.

```text
Title: Project Name
Year: 2026
Categories: 3D, Motion Design
Client:
Description:
My role:
Featured: No
Cover: cover.jpg
Media order: cover.jpg, motion.mp4, detail.jpg
```

Only the media is essential. Missing titles use the folder name. Blank years, descriptions, clients, and roles stay absent from the project page. Projects without categories appear under Other Work in the index and still appear in the unfiltered feed. Personal Work currently has no project.txt, so its year and categories have intentionally been left unspecified. The original files and metadata are never modified by the build.

Keep client names consistent to group several projects on one client page. Leave Client blank for personal work. The older Type field is accepted but not used. Categories are kept verbatim in the index; the homepage derives broader filters from common terms (3D, Motion, Graphic Design, UI).

New nonblank client names automatically join the Featured clients cylinder. Keep
this default when adding work; exclude clients only when requested. The
`featuredClientExclusions` list in `src/site.json` currently excludes Antonym,
Doji, and Polydupe from the cylinder only, retaining their projects and client pages.

`homeProjectOrder` in `src/site.json` lists the projects to place first in Home's
bento layout. Keep these ahead of other projects when adding work. This setting
does not change Archive or client-page ordering.

Images: JPG, PNG, WebP, GIF, AVIF. Videos: MP4, MOV, WebM, M4V. Animated GIFs currently receive a still web image; use MP4 for motion. A filename containing `main` is the project cover and appears first inside the project. Otherwise Cover chooses the file, falling back to the first media file. Only that one item appears in the feed; additional media appears inside the project. Media order is optional. Featured projects are moved ahead of the initial curated feed order in `src/app.js`. New projects enter the feed automatically.

## Edit the site

### Typography system

All typography is defined in the final `Typography` section of `src/style.css`.
Layout rules and responsive breakpoints must not introduce separate font sizes,
weights, families, line heights, or tracking. Change a role token to adjust that
role throughout the site.

The October 12, 2026 audit found 131 size declarations containing 47 distinct
values, 20 line-height values, and 25 tracking values. Many belonged to unused
components or overridden rules, rather than 47 simultaneously visible sizes.
The cleanup removed those declarations instead of layering another override on
top. Non-typographic CSS declarations were compared before and after and retained
in the same order.

The reference, [Sturdy](https://sturdy.co/work/), declares FK Grotesk Neue Regular
and FK Grotesk Mono Regular. Its navigation labels are 13px at weight 400, with
line-height 1 and .02em tracking. Its smaller labels use 12px, while its mono body
uses 12px/1.3. Much of its hierarchy comes from scale, spacing, and placement rather
than bold weights. Its very large display scale is not appropriate for every
page in this denser archive.

Our system uses two explicit platform font stacks: Arial/Helvetica/sans-serif
for interface and display text, and SF Mono/Menlo/Consolas/Liberation Mono/monospace
only for project facts. These are fallback choices, not loaded FK Grotesk fonts.
No external fonts are fetched. If webfonts are added later, change the family
tokens and supply the files rather than adding component-specific families.

| Role | Size | Line height | Usage |
| --- | --- | --- | --- |
| Label | 12px | 1.3 | Captions, category filters, year menu, index, footer, utility links |
| Navigation | 13px | 1 | Main navigation pills |
| Body | 14px | 1.45 | Description, social links, brand |
| Title | 28–44px fluid | 1.02 | Project title, client collection title, empty-state heading |
| Display | 32–88px fluid | 1 | Contact email |

Project facts reuse the 12px size with the mono family and body line height.
Every role uses weight 400. Label tracking is .02em, body −.01em, title −.035em,
and display −.04em; mono facts use normal tracking. Mobile keeps the same readable
label and navigation sizes and adapts the layout instead of shrinking the text.

The client wheel keeps Arial/Helvetica at weight 400. Its desktop geometry follows
Sturdy's measured cylinder: 18-degree spacing, 1000px perspective, and a 280px
forward radius (240px at smaller desktop sizes). Base text is 100px/88px with
−.03em tracking, reduced to 75px at smaller desktop sizes. Long names are fitted
before perspective scaling. The heading uses 12px monospace; reduced-motion mode
shows a static list with 20px names.

The wheel's sticky viewport begins one screen before the client track, stays at
`top: 0`, and extends one screen beyond it. Scroll maps directly from −80 degrees
to 90 degrees past the final client, without a separate fade, translation, or
spring. Track length preserves the reference's angular scroll speed for our
longer client list. Front-half visibility prevents names repeating after one full
turn. A flat rectangular hit area follows the emphasized name, and hover is
paused for 140ms after scrolling. Mobile retains our compact cylinder rather
than Sturdy's flat mobile list.

The old `mono` markup class is now `utility`: ordinary interface labels are sans,
so the class describes their purpose rather than suggesting a different font.
The mute cursor, grid ordering, media sizing, and animation behavior are unaffected.

- `src/style.css`: visual design and responsive layouts.
- `src/app.js`: archive views, filters, feed sequencing, cursor, and video behavior.
- `src/index.html`: shell, navigation, metadata, and footer.
- `src/site.json`: email, Instagram, and other social links (`socials: [{"label": "Vimeo", "url": "https://..."}]`). Blank contact details are omitted. These populate the large email and social-link footer.
- `scripts/build.py`: imports content and generates web media into `dist/`.
- `scripts/serve.mjs`: local server with video range-request support.

The first build optimizes media; subsequent builds reuse `.cache` entries for unchanged files. It creates full-length compressed video, an eight-second muted feed preview, and a WebP poster for each video. Images become web-sized WebP files. Full videos retain any original audio and use native playback controls. All visible feed videos play automatically, with no simultaneous-playback cap. They honor reduced motion and data-saving preferences and pause offscreen.

`dist/` is the deployable static site and is retained in the hosted source so it can be restored without uploading your original Work folder. Local Work changes require rebuilding and redeploying before the hosted site changes. The builder removes its obsolete generated media from dist when files are renamed or projects are removed; your original files are never deleted.

Vercel deploys the committed `dist/` directory using `vercel.json`. Its build command
is `npm run check`, which validates that archive instead of regenerating it without
the local `Work` folder. Run `npm run build` locally and commit the updated `dist/`
before pushing content changes. Missing or empty source folders now fail without
replacing the existing archive, and validation rejects an empty archive.

The Site starts owner-private. Hosting identity is in `.openai/hosting.json`; keep it when publishing updates. Original Work files and build caches are not included in the hosted source.

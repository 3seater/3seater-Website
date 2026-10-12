# 3seater — Visual archive

A lightweight portfolio with a mixed media feed, discipline index, client directory, and individual project pages. Built with HTML, CSS, JavaScript, and a folder-based content pipeline. No JavaScript dependencies or CMS account required.

## Preview

From this directory:

```powershell
npm run build
npm run dev
```

Open the Local URL printed by the server (port 4173 by default). `PORT` can select another port. Requires Node.js, Python 3, ffmpeg, and ffprobe on PATH. `npm run check` checks JavaScript syntax, generated content, media paths, and static-hosting asset limits.

## Add or change work

Keep each project in its own folder inside the existing `../Work` folder. Add images or videos beside `project.txt`, then run `npm run build` and refresh the browser. To build from a different content folder, use `python scripts/build.py "D:/path/to/Work"`.

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

Images: JPG, PNG, WebP, GIF, AVIF. Videos: MP4, MOV, WebM, M4V. Animated GIFs currently receive a still web image; use MP4 for motion. Media order and Cover are optional filenames. A filename ending in `- main` (before the extension) becomes the default cover; an explicit Cover field takes priority. Featured projects are moved ahead of the initial curated feed order in `src/app.js`. New projects enter the feed automatically.

## Edit the site

- `src/style.css`: visual design and responsive layouts.
- `src/app.js`: archive views, filters, feed sequencing, cursor, and video behavior.
- `src/index.html`: shell, navigation, metadata, and footer.
- `src/site.json`: email and Instagram contact links. These are blank until provided, and no dummy links are shown.
- `scripts/build.py`: imports content and generates web media into `dist/`.
- `scripts/serve.mjs`: local server with video range-request support.

The first build optimizes media; subsequent builds reuse `.cache` entries for unchanged files. It creates full-length compressed video, an eight-second muted feed preview, and a WebP poster for each video. Images become web-sized WebP files. Full videos retain any original audio and use native playback controls. Feed videos honor reduced motion and data-saving preferences, and pause offscreen; simultaneous previews are capped at four on desktop and one on touch devices.

`dist/` is the deployable static site and is retained in the hosted source so it can be restored without uploading your original Work folder. Local Work changes require rebuilding and redeploying before the hosted site changes. The builder removes its obsolete generated media from dist when files are renamed or projects are removed; your original files are never deleted.

The Site starts owner-private. Hosting identity is in `.openai/hosting.json`; keep it when publishing updates. Original Work files and build caches are not included in the hosted source.

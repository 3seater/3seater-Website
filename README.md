# 3seater — Visual archive

A portfolio with one cover per project in the homepage feed, a discipline index, a client directory, and individual project pages. Built with HTML, CSS, JavaScript, and a folder-based content pipeline.

## Preview

From this directory:

```powershell
npm run build
npm run dev
```

Open the Local URL printed by the server (port 4173 by default). `PORT` can select another port. Requires Node.js, Python 3, ffmpeg, and ffprobe on PATH. `npm run check` checks JavaScript syntax, generated content, media paths, and static-hosting asset limits.

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

Images: JPG, PNG, WebP, GIF, AVIF. Videos: MP4, MOV, WebM, M4V. Animated GIFs currently receive a still web image; use MP4 for motion. A filename containing `main` is the project cover and appears first inside the project. Otherwise Cover chooses the file, falling back to the first media file. Only that one item appears in the feed; additional media appears inside the project. Media order is optional. Featured projects are moved ahead of the initial curated feed order in `src/app.js`. New projects enter the feed automatically.

## Edit the site

- `src/style.css`: visual design and responsive layouts.
- `src/app.js`: archive views, filters, feed sequencing, cursor, and video behavior.
- `src/index.html`: shell, navigation, metadata, and footer.
- `src/site.json`: email, Instagram, and other social links (`socials: [{"label": "Vimeo", "url": "https://..."}]`). Blank contact details are omitted. These populate the large email and social-link footer.
- `scripts/build.py`: imports content and generates web media into `dist/`.
- `scripts/serve.mjs`: local server with video range-request support.

The first build optimizes media; subsequent builds reuse `.cache` entries for unchanged files. It creates full-length compressed video, an eight-second muted feed preview, and a WebP poster for each video. Images become web-sized WebP files. Full videos retain any original audio and use native playback controls. Feed videos honor reduced motion and data-saving preferences, and pause offscreen; simultaneous previews are capped at four on desktop and one on touch devices.

`dist/` is the deployable static site and is retained in the hosted source so it can be restored without uploading your original Work folder. Local Work changes require rebuilding and redeploying before the hosted site changes. The builder removes its obsolete generated media from dist when files are renamed or projects are removed; your original files are never deleted.

The Site starts owner-private. Hosting identity is in `.openai/hosting.json`; keep it when publishing updates. Original Work files and build caches are not included in the hosted source.

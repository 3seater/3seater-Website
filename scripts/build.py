"""Build the archive from ../Work without modifying any originals. Requires ffmpeg."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import hashlib, json, re, shutil, subprocess, sys, os

ROOT = Path(__file__).resolve().parents[1]
COLLECTIONS = '--collections' in sys.argv
args = [arg for arg in sys.argv[1:] if arg != '--collections']
WORK = Path(args[0]).resolve() if args else ROOT.parent / 'Work'
if not WORK.is_dir():
    raise SystemExit(f'Work folder not found: {WORK}. Build locally with the original media; deploy the committed dist folder. Existing output was not changed.')
DIST = ROOT / 'dist'
MEDIA = DIST / 'media'
CACHE = ROOT / '.cache'
for folder in [DIST, MEDIA, CACHE]: folder.mkdir(parents=True, exist_ok=True)
VIDEO = {'.mp4', '.mov', '.webm', '.m4v'}
IMAGE = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'}

def run(args):
    p = subprocess.run(args, capture_output=True, text=True, encoding='utf-8', errors='replace')
    if p.returncode: raise RuntimeError(p.stderr[-2500:])
    return p.stdout

def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

def read_meta(folder):
    path = folder / 'project.txt'
    result = {}
    if path.exists():
        for line in path.read_text(encoding='utf-8-sig').splitlines():
            if ':' in line:
                key, value = line.split(':', 1)
                result[key.strip().lower()] = value.strip()
    return result

def ensure_loop(info, name):
    if info['type'] != 'video': return info
    # Separate, versioned, full-duration silent rendition for small cards.
    target = MEDIA / f'{name}-loop-v1.mp4'
    if not target.exists():
        temporary = target.with_name(target.stem + f'.{os.getpid()}.tmp.mp4')
        run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-threads', '2',
             '-i', str(DIST / info['src']), '-map', '0:v:0', '-an',
             '-vf', "scale=w='min(720,iw)':h='min(720,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2,fps=30",
             '-c:v', 'libx264', '-preset', 'fast', '-crf', '26', '-maxrate', '850k',
             '-bufsize', '1700k', '-pix_fmt', 'yuv420p', '-threads', '2',
             '-movflags', '+faststart', str(temporary)])
        temporary.replace(target)
        print(f'Full-length thumbnail: {name}', flush=True)
    small = MEDIA / f'{name}-loop-small-v1.mp4'
    if not small.exists():
        temporary = small.with_name(small.stem + f'.{os.getpid()}.tmp.mp4')
        run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-threads', '2',
             '-i', str(DIST / info['src']), '-map', '0:v:0', '-an',
             '-vf', "scale=w='min(480,iw)':h='min(480,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2,fps=30",
             '-c:v', 'libx264', '-preset', 'fast', '-crf', '26', '-maxrate', '450k',
             '-bufsize', '900k', '-pix_fmt', 'yuv420p', '-threads', '2',
             '-movflags', '+faststart', str(temporary)])
        temporary.replace(small)
        print(f'Full-length small thumbnail: {name}', flush=True)
    start = MEDIA / f'{name}-start-v1.webp'
    if not start.exists():
        temporary = start.with_name(start.stem + f'.{os.getpid()}.tmp.webp')
        # Decode the first displayed frame, matching playback from time zero.
        run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-threads', '2',
             '-i', str(DIST / info['src']), '-frames:v', '1',
             '-vf', 'scale=900:900:force_original_aspect_ratio=decrease',
             '-c:v', 'libwebp', '-quality', '85', str(temporary)])
        temporary.replace(start)
    return {**info, 'loop': f'media/{target.name}', 'loopSmall': f'media/{small.name}', 'playbackPoster': f'media/{start.name}'}

def process_media(task):
    path, project_id, index = task
    stamp = f'v3:{path.name}:{path.stat().st_size}:{path.stat().st_mtime_ns}'
    key = hashlib.sha256(stamp.encode()).hexdigest()[:12]
    name = f'{project_id}-{key}'
    info_path = CACHE / f'{name}.json'
    if info_path.exists():
        info = json.loads(info_path.read_text())
        if all((DIST / info[k]).exists() for k in ['src', 'poster'] if info.get(k)):
            info = ensure_loop(info, name)
            info_path.write_text(json.dumps(info), encoding='utf-8')
            return {**info, 'filename': path.name, 'order': index}
    probe = json.loads(run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height:format=duration', '-of', 'json', str(path)]))
    stream = probe['streams'][0]
    width, height = stream['width'], stream['height']
    base = ['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-threads', '2']
    is_video = path.suffix.lower() in VIDEO
    if is_video:
        duration = float(probe.get('format', {}).get('duration', 0))
        # Keep the entire piece in the project viewer. Limit long-video bitrate for static hosting.
        bitrate = min(1900, max(100, int(175000 / max(duration, 1))))
        src = MEDIA / f'{name}.mp4'
        poster = MEDIA / f'{name}.webp'
        preview = MEDIA / f'{name}-preview.mp4'
        run(base + ['-i', str(path), '-map', '0:v:0', '-map', '0:a:0?', '-vf', "scale=w='min(1440,iw)':h='min(1440,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2,fps=30", '-c:v', 'libx264', '-preset', 'fast', '-crf', '24', '-maxrate', f'{bitrate}k', '-bufsize', f'{bitrate*2}k', '-threads', '2', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', str(src)])
        at = min(1.2, duration / 5)
        run(base + ['-ss', str(at), '-i', str(path), '-frames:v', '1', '-vf', 'scale=900:900:force_original_aspect_ratio=decrease', '-c:v', 'libwebp', '-quality', '82', str(poster)])
        run(base + ['-ss', str(at), '-i', str(src), '-t', '8', '-an', '-vf', 'scale=640:640:force_original_aspect_ratio=decrease:force_divisible_by=2,fps=24', '-c:v', 'libx264', '-preset', 'fast', '-crf', '28', '-threads', '2', '-movflags', '+faststart', str(preview)])
        info = {'type': 'video', 'src': f'media/{src.name}', 'poster': f'media/{poster.name}', 'preview': f'media/{preview.name}', 'width': width, 'height': height, 'duration': round(duration, 1)}
    else:
        src = MEDIA / f'{name}.webp'
        run(base + ['-i', str(path), '-frames:v', '1', '-vf', 'scale=1800:1800:force_original_aspect_ratio=decrease', '-c:v', 'libwebp', '-quality', '88', str(src)])
        info = {'type': 'image', 'src': f'media/{src.name}', 'poster': f'media/{src.name}', 'width': width, 'height': height}
    info = ensure_loop(info, name)
    info_path.write_text(json.dumps(info), encoding='utf-8')
    print(f'Prepared {project_id} / {path.name}', flush=True)
    return {**info, 'filename': path.name, 'order': index}

def broad_categories(categories):
    result = []
    for c in categories:
        low = c.lower()
        for name, matched in [('3D', '3d' in low or 'character' in low or low == 'stage visuals'), ('Motion', 'motion' in low or 'visual' in low), ('Graphic Design', low in ['design', 'graphic design', 'cover art', 'branding', 'typography']), ('UI', low == 'ui')]:
            if matched and name not in result: result.append(name)
    return result

previous_path = ROOT / 'src/batch-ten/01/data.json'
previous = {p['id']: p for p in json.loads(previous_path.read_text(encoding='utf-8'))['projects']} if previous_path.exists() else {}
projects, tasks = [], []
for folder in sorted(WORK.rglob('*')):
    if not folder.is_dir() or folder.is_symlink(): continue
    if not folder.resolve().is_relative_to(WORK.resolve()): continue
    files = sorted((p for p in folder.iterdir() if p.is_file() and p.suffix.lower() in VIDEO | IMAGE), key=lambda p: p.name.lower())
    if not files: continue
    meta = read_meta(folder)
    order = [v.strip().lower() for v in meta.get('media order', '').split(',') if v.strip()]
    files.sort(key=lambda p: (order.index(p.name.lower()) if p.name.lower() in order else len(order), p.name.lower()))
    categories = [v.strip() for v in meta.get('categories', '').split(',') if v.strip()]
    project_id = slug('/'.join(folder.relative_to(WORK).parts))
    if any(p['id'] == project_id for p in projects):
        raise ValueError(f'Project URL collision for {folder.relative_to(WORK)}; rename one of the conflicting folders.')
    project = {'id': project_id, 'title': meta.get('title') or folder.name, 'year': meta.get('year', ''), 'client': meta.get('client', '').replace('â€”', '').strip(), 'categories': categories, 'filters': broad_categories(categories), 'description': meta.get('description', ''), 'layout': meta.get('layout', 'auto'), 'link': meta.get('link', ''), 'spotify': meta.get('spotify', ''), 'role': meta.get('my role', meta.get('role', '')), 'featured': meta.get('featured', '').lower() == 'yes', 'coverName': meta.get('cover', '') or (previous.get(project_id, {}).get('media') or [{}])[0].get('filename', ''), 'media': []}
    projects.append(project)
    tasks.extend((p, project_id, i) for i, p in enumerate(files))
if not projects:
    raise SystemExit(f'No projects with supported media found in {WORK}. Existing output was not changed.')
with ThreadPoolExecutor(max_workers=2) as executor:
    for task, media in zip(tasks, executor.map(process_media, tasks)):
        next(p for p in projects if p['id'] == task[1])['media'].append(media)
for project in projects:
    project['media'].sort(key=lambda m: m['order'])
    cover_name = project.pop('coverName', '').lower()
    main_index = next((i for i, m in enumerate(project['media']) if 'main' in m['filename'].lower()), None)
    project['cover'] = main_index if main_index is not None else next((i for i, m in enumerate(project['media']) if m['filename'].lower() == cover_name), 0)
    project['media'].insert(0, project['media'].pop(project['cover']))
    project['cover'] = 0
projects.sort(key=lambda p: (not p['featured'], -(int(p['year'][:4]) if p['year'][:4].isdigit() else 0), p['title'].lower()))
(DIST / 'data.json').write_text(json.dumps({'projects': projects}, ensure_ascii=False), encoding='utf-8')
# Remove only this builder's obsolete derived files inside its verified output directory.
referenced = {m[key] for p in projects for m in p['media'] for key in ['src', 'poster', 'preview', 'loop', 'loopSmall', 'playbackPoster'] if m.get(key)}
for output in ([] if COLLECTIONS else MEDIA.iterdir()):
    if output.is_file() and re.fullmatch(r'[a-z0-9-]+-[a-f0-9]{12}(-preview|-loop-v1)?\.(mp4|webp)', output.name):
        if output.resolve().parent == MEDIA.resolve() and f'media/{output.name}' not in referenced:
            output.unlink()
# Sync content only: retain each palette's design, runtime and site settings.
collection_data = json.loads(json.dumps({'projects': projects}))
for project in collection_data['projects']:
    for media in project['media']:
        for key in ['src', 'poster', 'preview', 'loop', 'loopSmall', 'playbackPoster']:
            if media.get(key): media[key] = '/' + media[key]
payload = json.dumps(collection_data, ensure_ascii=False)
for base in [ROOT / 'src/batch-ten', DIST / 'batch-ten']:
    for variant in sorted(base.glob('[0-9][0-9]')):
        target = variant / 'data.json'
        if target.exists() and target.read_text(encoding='utf-8') == payload:
            continue
        temporary = target.with_suffix('.json.tmp')
        temporary.write_text(payload, encoding='utf-8')
        temporary.replace(target)
for base in [ROOT / 'src/batch-eleven', DIST / 'batch-eleven']:
    if base.exists() and (not (base / 'data.json').exists() or (base / 'data.json').read_text(encoding='utf-8') != payload):
        temporary = base / 'data.json.tmp'
        temporary.write_text(payload, encoding='utf-8')
        temporary.replace(base / 'data.json')
# Home membership is curated, never inferred from newly discovered Work folders.
home_ids = json.loads((ROOT / 'src/site.json').read_text(encoding='utf-8'))['homeProjectIds']
for root in [ROOT / 'src', DIST]:
    for settings in [*root.glob('batch-ten/[0-9][0-9]/site.json'), root / 'batch-eleven/site.json']:
        if settings.exists():
            config = json.loads(settings.read_text(encoding='utf-8'))
            config['homeProjectIds'] = home_ids
            settings_payload = json.dumps(config, ensure_ascii=False, indent=2) + '\n'
            if settings.read_text(encoding='utf-8') != settings_payload:
                settings.write_text(settings_payload, encoding='utf-8')
print('Synced project content to all local color versions.', flush=True)
for path in (ROOT / "src").iterdir():
    if path.is_file(): shutil.copy2(path, DIST / path.name)
# Soft Chalk is the main site. Both local watch modes retain the same entry
# point and shared collection runtime; content above is always freshly built.
for name in ['index.html', 'site.json', 'palette.css']:
    shutil.copy2(ROOT / 'src' / name, DIST / name)
for name in ['batch-ten', 'batch-eleven']:
    shutil.copytree(ROOT / 'src' / name, DIST / name, dirs_exist_ok=True,
                    ignore=shutil.ignore_patterns('DESIGN.md'))
print(f'Built {len(projects)} projects / {len(tasks)} media files -> {DIST}', flush=True)

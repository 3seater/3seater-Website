"""Build the archive from ../Work without modifying any originals. Requires ffmpeg."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import hashlib, json, re, shutil, subprocess, sys

ROOT = Path(__file__).resolve().parents[1]
WORK = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else ROOT.parent / 'Work'
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

def process_media(task):
    path, project_id, index = task
    stamp = f'v3:{path.name}:{path.stat().st_size}:{path.stat().st_mtime_ns}'
    key = hashlib.sha256(stamp.encode()).hexdigest()[:12]
    name = f'{project_id}-{key}'
    info_path = CACHE / f'{name}.json'
    if info_path.exists():
        info = json.loads(info_path.read_text())
        if all((DIST / info[k]).exists() for k in ['src', 'poster'] if info.get(k)):
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
    info_path.write_text(json.dumps(info), encoding='utf-8')
    print(f'Prepared {project_id} / {path.name}', flush=True)
    return {**info, 'filename': path.name, 'order': index}

def broad_categories(categories):
    result = []
    for c in categories:
        low = c.lower()
        for name, matched in [('3D', '3d' in low or 'character' in low), ('Motion', 'motion' in low or 'visual' in low), ('Graphic Design', low in ['design', 'graphic design', 'cover art', 'branding', 'typography']), ('UI', low == 'ui')]:
            if matched and name not in result: result.append(name)
    return result

projects, tasks = [], []
for folder in sorted(WORK.iterdir()):
    if not folder.is_dir(): continue
    files = sorted((p for p in folder.iterdir() if p.suffix.lower() in VIDEO | IMAGE), key=lambda p: p.name.lower())
    if not files: continue
    meta = read_meta(folder)
    order = [v.strip().lower() for v in meta.get('media order', '').split(',') if v.strip()]
    files.sort(key=lambda p: (order.index(p.name.lower()) if p.name.lower() in order else len(order), p.name.lower()))
    categories = [v.strip() for v in meta.get('categories', '').split(',') if v.strip()]
    project_id = slug(folder.name)
    project = {'id': project_id, 'title': meta.get('title') or folder.name, 'year': meta.get('year', ''), 'client': meta.get('client', '').replace('—', '').strip(), 'categories': categories, 'filters': broad_categories(categories), 'description': meta.get('description', ''), 'role': meta.get('my role', meta.get('role', '')), 'featured': meta.get('featured', '').lower() == 'yes', 'coverName': meta.get('cover', ''), 'media': []}
    projects.append(project)
    tasks.extend((p, project_id, i) for i, p in enumerate(files))
with ThreadPoolExecutor(max_workers=2) as executor:
    for task, media in zip(tasks, executor.map(process_media, tasks)):
        next(p for p in projects if p['id'] == task[1])['media'].append(media)
for project in projects:
    project['media'].sort(key=lambda m: m['order'])
    cover_name = project.pop('coverName', '').lower()
    fallback = next((i for i, m in enumerate(project['media']) if re.search(r'[-_ ]main\.[^.]+$', m['filename'], re.I)), 0)
    project['cover'] = next((i for i, m in enumerate(project['media']) if m['filename'].lower() == cover_name), fallback)
projects.sort(key=lambda p: (not p['featured'], -(int(p['year'][:4]) if p['year'][:4].isdigit() else 0), p['title'].lower()))
(DIST / 'data.json').write_text(json.dumps({'projects': projects}, ensure_ascii=False), encoding='utf-8')
# Remove only this builder's obsolete derived files inside its verified output directory.
referenced = {m[key] for p in projects for m in p['media'] for key in ['src', 'poster', 'preview'] if m.get(key)}
for output in MEDIA.iterdir():
    if output.is_file() and re.fullmatch(r'[a-z0-9-]+-[a-f0-9]{12}(-preview)?\.(mp4|webp)', output.name):
        if output.resolve().parent == MEDIA.resolve() and f'media/{output.name}' not in referenced:
            output.unlink()
for path in (ROOT / 'src').iterdir():
    if path.is_file(): shutil.copy2(path, DIST / path.name)
print(f'Built {len(projects)} projects / {len(tasks)} media files -> {DIST}', flush=True)

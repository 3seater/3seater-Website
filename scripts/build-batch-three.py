from pathlib import Path
import json, shutil, html

root = Path(__file__).resolve().parents[1]
src = root / 'src' / 'batch-three'
dest = root / 'dist' / 'batch-three'
directions = json.loads((src / 'directions.json').read_text(encoding='utf-8'))
shutil.copy2(root / 'src' / 'site.json', src / 'site.json')
for d in directions:
    family = d['font']
    font_dir = src / 'fonts' / family
    if not (font_dir / 'font.ttf').exists():
        shutil.copytree(root / 'src' / 'batch-two' / 'fonts' / family, font_dir, dirs_exist_ok=True)
    folder = src / f"{d['id']:02}"
    folder.mkdir(exist_ok=True)
    (folder / 'index.html').write_text(f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="3seater — graphic design, motion design and 3D. {html.escape(d['name'])}."><meta name="theme-color" content="{d['bg']}"><title>3seater — {html.escape(d['name'])}</title><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23111'/%3E%3Ctext x='12' y='29' fill='white' font-family='Arial' font-size='27'%3E3%3C/text%3E%3C/svg%3E"><style>@font-face{{font-family:Direction;src:url('../fonts/{family}/font.ttf') format('truetype');font-weight:100 900;font-display:swap}}:root{{--bg:{d['bg']};--fg:{d['fg']};--font:Direction}}</style><link rel="stylesheet" href="../style.css"></head><body class="v{d['id']}" data-direction="{d['id']}"><div id="app"><main class="load-error"><p>Loading projects…</p></main></div><noscript>This portfolio requires JavaScript to browse its projects.</noscript><script src="../app.js" defer></script><script src="/exploration-playback.js" defer></script></body></html>''', encoding='utf-8')
shutil.copytree(src, dest, dirs_exist_ok=True)
print('Built 20 independent layouts at /batch-three/01/ through /batch-three/20/.')

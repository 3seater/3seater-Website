from pathlib import Path
import json
root = Path(__file__).resolve().parents[1]
dist = root / 'dist'
data = json.loads((dist / 'data.json').read_text(encoding='utf-8'))
assert data.get('projects'), 'Archive is empty; rebuild locally with the original Work folder before deploying.'
ids = set()
for p in data['projects']:
    assert p['id'] not in ids, f'Duplicate ID: {p["id"]}'
    ids.add(p['id'])
    assert p['media'] and 0 <= p['cover'] < len(p['media']), f'Invalid cover: {p["id"]}'
    for m in p['media']:
        assert m['width'] > 0 and m['height'] > 0
        for key in ['src', 'poster', 'preview', 'loop', 'loopSmall']:
            if m.get(key):
                path = (dist / m[key]).resolve()
                assert path.is_relative_to(dist.resolve()), 'Unsafe media path'
                assert path.is_file() and path.stat().st_size > 0, f'Missing {path}'
                assert path.stat().st_size < 25 * 1024 * 1024, f'Oversize asset: {path}'
for file in ['index.html','style.css','app.js','favicon.svg','site.json']:
    assert (dist / file).is_file(), f'Missing {file}'
print(f'Validated {len(ids)} projects and {sum(len(p["media"]) for p in data["projects"])} media entries, all asset paths and hosting size limits.')

"""Self-host unmodified OFL fonts and licenses from the Google Fonts repository."""
from pathlib import Path
from urllib.request import Request, urlopen
import json
from concurrent.futures import ThreadPoolExecutor
DEST = Path(__file__).resolve().parents[1] / 'src' / 'batch-three' / 'fonts'
FAMILIES = ['bodonimoda','cormorantgaramond','anton','ibmplexmono','instrumentserif']
def fetch(family):
    folder = DEST / family
    folder.mkdir(parents=True, exist_ok=True)
    req = Request('https://api.github.com/repos/google/fonts/contents/ofl/' + family, headers={'User-Agent':'3seater-font-setup'})
    files = json.load(urlopen(req))
    choices = [f for f in files if f['name'].endswith('.ttf') and 'Italic' not in f['name']]
    chosen = next((f for f in choices if '[' in f['name']), next((f for f in choices if 'Regular' in f['name']), choices[0]))
    for f in [chosen, next(f for f in files if f['name']=='OFL.txt')]:
        (folder / ('font.ttf' if f==chosen else 'OFL.txt')).write_bytes(urlopen(f['download_url']).read())
    print(family + ': ' + chosen['name'], flush=True)
with ThreadPoolExecutor(max_workers=5) as pool:
    list(pool.map(fetch, FAMILIES))

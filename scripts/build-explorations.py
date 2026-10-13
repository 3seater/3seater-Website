"""Package the twenty UI explorations alongside the existing archive."""
from pathlib import Path
import shutil
root = Path(__file__).resolve().parents[1]
source = root / 'src' / 'explorations'
target = root / 'dist' / 'explorations'
target.mkdir(parents=True, exist_ok=True)
for item in source.iterdir():
    if item.is_file():
        shutil.copy2(item, target / item.name)
print('Built 20 UI directions at /explorations/?v=1 through ?v=20')

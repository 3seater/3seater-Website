from pathlib import Path
import shutil
root = Path(__file__).resolve().parents[1]
shutil.copytree(root/'src'/'batch-two',root/'dist'/'batch-two',dirs_exist_ok=True)
print('Built fresh batch: /batch-two/?v=1 through ?v=20')

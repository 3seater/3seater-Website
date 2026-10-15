from pathlib import Path
import shutil,json
r=Path(__file__).resolve().parents[1];old=r/'src/batch-seven';s=r/'src/batch-nine';s.mkdir(exist_ok=True)
app=(old/'app.js').read_text(encoding='utf-8').replace('const fitPressure = initFooterPressure(svg, text);','const fitPressure = () => {};')
a=app.index('  function initFooterPressure(');b=app.index('  function renderContact()',a);app=app[:a]+app[b:]
(old/'favorite.js').write_text(app,encoding='utf-8')
fix='body.v3:has(#main .feed-grid.masonry) .site-header{padding:24px 0}\n@media(max-width:700px){body.v3:has(#main .feed-grid.masonry) .site-header{padding:20px 0}}\n'
(old/'favorite.css').write_text(fix,encoding='utf-8')
h=(old/'03/index.html').read_text(encoding='utf-8').replace('../app.js?revision=2','../favorite.js?revision=1')
if 'favorite.css' not in h:h=h.replace('</head>','<link rel="stylesheet" href="../favorite.css?revision=1"></head>')
(old/'03/index.html').write_text(h,encoding='utf-8')
for f in ['original.css','fonts.css','variants.css','favorite.css']:shutil.copy2(old/f,s/f)
(s/'app.js').write_text(app,encoding='utf-8');shutil.copytree(old/'fonts',s/'fonts',dirs_exist_ok=True)
palettes=[
('Original Frost','#f8f9fb','#17181a','#6e7177','#d8dade','#b84600','rgba(32,33,35,.88)','#f8f9fb','rgba(240,241,242,.2)'),
('Acid Yellow','#e4ed39','#171900','#626812','#a2ad21','#9b271a','#23251c','#f1f5c5','#59602e'),
('Warm Bone','#eee9df','#2b2924','#6e675a','#bdb6a7','#a72f16','#39352e','#f5efe3','#726b5d'),
('Carbon','#191b1e','#f0f2e9','#a5adae','#4c5359','#e4ed39','#e3e5dd','#20231c','#b3b9aa'),
('Mist Blue','#cddce8','#1b3048','#4b6178','#9aafc3','#92321e','#243c52','#edf5ff','#4f6a81'),
('Soft Lilac','#ddd6ed','#262035','#62556f','#b9accf','#742354','#382c4d','#f8edff','#655377'),
('Mint','#d8e9d7','#23392c','#526a58','#a3bba5','#873f27','#2e4638','#eff9ed','#57735f'),
('Cobalt','#143bd4','#ffffff','#d1dcff','#708ce9','#f3f854','#e8edff','#1732a3','#b1c0f5'),
('Rose','#ecc7ce','#39202b','#714b5c','#bf929e','#184c3b','#4d2e3b','#fff1f5','#805766'),
('Oxide','#6d302c','#fff0dd','#e1b5a1','#b16b5e','#f0f56f','#f1deca','#5a2826','#ccaf96')]
base=h.replace('../favorite.js?revision=1','../app.js').replace('</head>','<link rel="stylesheet" href="palette.css"></head>')
colors='.v3 .site-header nav{background:var(--nav-bg)}body.v3 .site-header nav a{color:var(--nav-text)}body.v3 .site-header nav a[aria-current=page]{background:var(--nav-active)}body.v3 .site-header nav a:is(:hover,:focus-visible){background:var(--nav-active);color:var(--nav-text)}body ::selection{background:var(--ink);color:var(--paper)}.footer-wordmark text{fill:var(--ink)}.year-menu{background:var(--paper);color:var(--ink)}'
(s/'colors.css').write_text(colors,encoding='utf-8')
base=base.replace('</head>','<link rel="stylesheet" href="../colors.css"></head>')
rows=[]
for i,(name,paper,ink,muted,line,accent,nav,nt,active) in enumerate(palettes,1):
 d=s/f'{i:02}';d.mkdir(exist_ok=True)
 (d/'index.html').write_text(base,encoding='utf-8')
 for f in ['data.json','site.json']:shutil.copy2(old/'03'/f,d/f)
 tokens=dict(paper=paper,ink=ink,muted=muted,line=line,accent=accent,**{'nav-bg':nav,'nav-text':nt,'nav-active':active})
 (d/'palette.css').write_text(':root{'+''.join(f'--{k}:{v};' for k,v in tokens.items())+'}',encoding='utf-8')
 rows.append(dict(id=i,name=name,tokens=tokens))
(s/'palettes.json').write_text(json.dumps(rows,indent=2),encoding='utf-8')
g=(r/'src/batch-eight/index.html').read_text(encoding='utf-8');a=g.index('<main>');b=g.index('</main>',a)
cards=''.join(f'<a class="direction" href="{d["id"]:02}/"><div class="thumb"><img src="captures/{d["id"]:02}.png" alt="{d["name"]} preview" loading="lazy"></div><div class="card-title"><h2>{d["id"]:02} / {d["name"]}</h2></div></a>' for d in rows)
g=g[:a]+'<main>'+cards+g[b:];g=g.replace('Original + 15.','One site. Ten colors.').replace('Original + fifteen','Ten colors').replace('One original. Fifteen new directions.<br>Bold type, moving work, more room to experiment.','Your favorite capsule layout.<br>Balanced spacing. Static footer.<br>Only the colors change.').replace('/batch-seven/','/batch-eight/')
(s/'index.html').write_text(g,encoding='utf-8')
shutil.copytree(s,r/'dist/batch-nine',dirs_exist_ok=True,ignore=shutil.ignore_patterns('DIRECTION-CONTRACT.txt','DESIGN.md'))
for f in ['favorite.css','favorite.js','03/index.html']:shutil.copy2(old/f,r/'dist/batch-seven'/f)
print('Built ten structurally identical palette variants; favorite03 fixed.')

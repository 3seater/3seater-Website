from pathlib import Path
import shutil,json
r=Path(__file__).resolve().parents[1];s=r/'src/batch-eight';s.mkdir(exist_ok=True)
for f in ['original.css','fonts.css','variants.css']:
 shutil.copy2(r/'src/batch-seven'/f,s/f)
shutil.copytree(r/'src/batch-seven/fonts',s/'fonts',dirs_exist_ok=True)
app=(r/'src/batch-seven/app.js').read_text(encoding='utf-8')
app=app.replace("number < 4 ? 'eager' : 'lazy'","number < 30 ? 'eager' : 'lazy'")
app=app.replace("if (masonry) {\n      const count", "if (masonry && document.body.dataset.layout!=='masonry') {\n      grid.innerHTML=items.map((item,i)=>tile(item,i)).join('');\n    } else if (masonry) {\n      const count")
app=app.replace("window.innerWidth <= 1200 ? 4 : 5;","window.innerWidth <= 1200 ? 4 : Number(document.body.dataset.columns || 5);")
(s/'app.js').write_text(app,encoding='utf-8')
# palette, structure, nav and selected-list treatment each belong to the direction
specs=[
('Acid Poster','#e4ed39','#171900','#626812','#a2ad21','#d02a16','mosaic','tabs','poster',6),
('Cobalt Contact','#143bd4','#ffffff','#d1dcff','#708ce9','#f3f854','sheet','bar','compact',5),
('Soft Signal','#ddd6ed','#262035','#62556f','#b9accf','#742354','masonry','capsule','poster',4),
('Carbon Film','#191b1e','#f0f2e9','#a5adae','#4c5359','#e4ed39','film','dock','reverse',5),
('Vermilion Board','#ee593d','#241509','#573022','#b6432b','#ffffff','bento','square','poster',6),
('Mint Ledger','#d8e9d7','#23392c','#526a58','#a3bba5','#92432a','ledger','tabs','compact',4),
('Ultraviolet Rail','#352064','#f5e8ff','#cfbce6','#765692','#f2f35b','mosaic','rail','poster',6),
('Bone Contact','#eee9df','#2b2924','#746d60','#bdb6a7','#bd3b18','sheet','split','poster',5),
('Lemon Strip','#f6ed88','#27280c','#69602d','#c5b958','#a52b26','film','capsule','compact',5),
('Blue Hour','#cddce8','#1b3048','#50677f','#9aafc3','#a33a22','masonry','dock','poster',6),
('Pink Matrix','#ecc7ce','#39202b','#765061','#bf929e','#184c3b','bento','bar','reverse',6),
('White Margin','#fcfcf7','#22251e','#62675a','#d1d5c9','#485dbe','ledger','rail','poster',4),
('Oxide Index','#6d302c','#fff0dd','#e1b5a1','#b16b5e','#f0f56f','masonry','split','compact',4),
('Silver Screen','#d5d7da','#25272c','#5f6269','#a8adb4','#3b3da4','sheet','glass','poster',6),
('Yellow / Black','#e3ec3c','#151713','#555d18','#a3af28','#95324e','bento','dock','reverse',6)]
dirs=[]
base=(r/'src/batch-seven/02/index.html').read_text(encoding='utf-8')
for i,(name,bg,fg,muted,line,accent,layout,nav,rows,cols) in enumerate(specs,1):
 ident=f'{i:02}';out=s/ident;out.mkdir(exist_ok=True)
 h=base.replace('class="v2" data-direction="2"',f'class="d{i} layout-{layout} nav-{nav} rows-{rows}" data-layout="{layout}" data-columns="{cols}"').replace('href="../variants.css"','href="../variants.css"><link rel="stylesheet" href="../directions.css?revision=2"').replace('3seater — Frosted Rounds',f'3seater — {name}')
 h=h.replace('app.js?revision=2','app.js?revision=3')
 (out/'index.html').write_text(h,encoding='utf-8')
 for f in ['data.json','site.json']:shutil.copy2(r/'src/batch-seven/02'/f,out/f)
 dirs.append(dict(id=i,name=name,bg=bg,fg=fg,muted=muted,line=line,accent=accent,layout=layout,nav=nav,rows=rows,cols=cols))
(s/'directions.json').write_text(json.dumps(dirs,indent=2),encoding='utf-8')
css=(s/'structure.css').read_text(encoding='utf-8')
css+='\n'+ '\n'.join(f'body.d{d["id"]}{{--paper:{d["bg"]};--ink:{d["fg"]};--muted:{d["muted"]};--line:{d["line"]};--accent:{d["accent"]};--columns:{d["cols"]}}}' for d in dirs)
(s/'directions.css').write_text(css,encoding='utf-8')
g=(r/'src/batch-seven/index.html').read_text(encoding='utf-8');a=g.index('<main>');b=g.index('</main>',a)
card=lambda href,name,desc,img:f'<a class="direction" href="{href}"><div class="thumb"><img src="{img}" alt="{name} preview" loading="lazy"></div><div class="card-title"><h2>{name}</h2></div><p>{desc}</p></a>'
cards=card('/batch-seven/01/','Original / New Type','Preserved original. Project titles now uppercase.','/batch-seven/captures/01.png')
for d in dirs:cards+=card(f'{d["id"]:02}/',d['name'],f'{d["layout"].title()} composition · {d["nav"].title()} navigation',f'captures/{d["id"]:02}.png')
g=g[:a]+'<main>'+cards+g[b:];g=g.replace('Ten more.','Original + 15.').replace('Ten more directions','Original + fifteen').replace('Original foundation.<br>New type. Cleaner navigation.<br>Ten new ways to browse the work. Open any direction to explore.','One original. Fifteen new directions.<br>Bold type, moving work, more room to experiment.').replace('/batch-six/','/batch-seven/')
(s/'index.html').write_text(g,encoding='utf-8')
shutil.copytree(s,r/'dist/batch-eight',dirs_exist_ok=True,ignore=shutil.ignore_patterns('DIRECTION-CONTRACT.txt','DESIGN.md','structure.css'))
print('Built fifteen new directions and original comparison gallery.')

from pathlib import Path
import shutil,json
r=Path(__file__).resolve().parents[1]; old=r/'src/batch-nine'; s=r/'src/batch-ten'; s.mkdir(exist_ok=True)
for f in ['app.js','original.css','fonts.css','variants.css','favorite.css','colors.css']:shutil.copy2(old/f,s/f)
shutil.copytree(old/'fonts',s/'fonts',dirs_exist_ok=True)
(s/'colors.css').write_text((s/'colors.css').read_text(encoding='utf-8')+'\n/* A single frosted surface lets scrolling artwork show through the capsule. */\nbody.v3 .site-header nav{background:var(--nav-bg);background:color-mix(in srgb,var(--nav-bg) 76%,transparent);-webkit-backdrop-filter:blur(26px) saturate(1.15);backdrop-filter:blur(26px) saturate(1.15)}\nbody.v3 .site-header nav a{background:transparent;-webkit-backdrop-filter:none;backdrop-filter:none}\nbody.v3 .site-header nav a[aria-current=page],body.v3 .site-header nav a:is(:hover,:focus-visible){background:var(--nav-active);background:color-mix(in srgb,var(--nav-active) 70%,transparent)}\n\n',encoding='utf-8')
(s/'variants.css').write_text((s/'variants.css').read_text(encoding='utf-8').replace('.project-info h1{font-family:Anton,sans-serif;letter-spacing:0}', '.project-info h1{font-family:Anton,sans-serif;letter-spacing:0;text-transform:uppercase}'),encoding='utf-8')
(s/'app.js').write_text((s/'app.js').read_text(encoding='utf-8').replace('Graphic design, motion design, and 3D.','VISUAL WORLDS FOR ARTISTS AND BRANDS.'),encoding='utf-8')
previous=json.loads((old/'palettes.json').read_text())
rows=[dict(previous[i-1],kept=True,source=i) for i in [1,8,2,3]]
def blend(a,b,p):return '#'+''.join(f'{round(int(a[j:j+2],16)*p+int(b[j:j+2],16)*(1-p)):02x}' for j in (1,3,5))
def lum(h):
 rgb=[int(h[j:j+2],16)/255 for j in (1,3,5)]
 return sum((v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4)*w for v,w in zip(rgb,[.2126,.7152,.0722]))
def contrast(a,b):
 x,y=sorted([lum(a),lum(b)]);return (y+.05)/(x+.05)
new=[('Signal Orange','#ff792c','#29170d','#622200'),('Tomato','#ed4938','#27100e','#501e10'),('Butter','#f5e69a','#302b18','#713321'),('Racing Green','#123f31','#f1efcc','#f9c854'),('Espresso','#33241f','#f4e5cf','#efba72'),('Aubergine','#39213f','#f3e5f0','#d5ef80'),('Glacier','#c9f1fa','#153946','#8b2d35'),('Petrol','#064c57','#e2f5e8','#f6dc7c'),('Ultraviolet','#4220a4','#f5eeff','#dcf57e'),('Bubblegum','#f3a6d1','#3e1736','#264d29')]
for name,paper,ink,accent in new:
 muted=blend(ink,paper,.82)
 if contrast(muted,paper)<4.5:muted=blend(ink,paper,.95)
 assert contrast(ink,paper)>=4.5 and contrast(muted,paper)>=4.5,(name,contrast(muted,paper))
 active=blend(paper,ink,.18)
 if contrast(paper,active)<4.5:active=blend(paper,ink,.03)
 assert contrast(paper,active)>=4.5
 assert contrast(accent,paper)>=3
 t=dict(paper=paper,ink=ink,muted=muted,line=blend(ink,paper,.3),accent=accent,**{'wheel-inactive':blend(ink,paper,.2),'nav-bg':ink,'nav-text':paper,'nav-active':active})
 rows.append(dict(name=name,tokens=t,kept=False))
for i,row in enumerate(rows,1):
 row['id']=i; d=s/f'{i:02}';d.mkdir(exist_ok=True)
 for f in ['index.html','data.json','site.json']:shutil.copy2(old/'01'/f,d/f)
 (d/'palette.css').write_text(':root{'+''.join(f'--{k}:{v};' for k,v in row['tokens'].items())+'}',encoding='utf-8')
(s/'palettes.json').write_text(json.dumps(rows,indent=2),encoding='utf-8')
g=(old/'index.html').read_text(encoding='utf-8');a=g.index('<main>');b=g.index('</main>',a)
cards=[]
for row in rows:
 t=row['tokens'];i=row['id'];label='Kept' if row['kept'] else 'New'
 cards.append(f'''<a class="direction" href="{i:02}/"><div class="thumb palette-preview" style="background:{t['paper']};color:{t['ink']}"><div class="mini-nav" style="background:{t['nav-bg']};color:{t['nav-text']}">WORK &nbsp; ARCHIVE &nbsp; INDEX</div><strong>SELECTED<br>WORK</strong><div class="muted-sample" style="color:{t['wheel-inactive']}">FEATURED CLIENTS</div></div><div class="card-title"><h2>{i:02} / {row['name']}</h2><small>{label}</small></div></a>''')
g=g[:a]+'<main>'+''.join(cards)+g[b:]
g=g.replace('Ten colors','Four favorites + ten new colors').replace('One site. Four favorites + ten new colors.','Four kept.<br>Ten new.').replace('Your favorite capsule layout.<br>Balanced spacing. Static footer.<br>Only the colors change.','Four favorites, unchanged.<br>Ten new palettes.<br>The same site throughout.').replace('/batch-eight/','/batch-nine/')
g=g.replace('</style>','.palette-preview{padding:24px;display:flex;flex-direction:column;justify-content:space-between}.mini-nav{align-self:center;border-radius:40px;padding:10px 16px;font:10px Plex,monospace}.palette-preview strong{font:clamp(30px,4vw,65px)/1 Anton,sans-serif;font-weight:400}.muted-sample{font:24px/1 Anton,sans-serif}@media(max-width:500px){.palette-preview strong{font-size:60px}}</style>')
(s/'index.html').write_text(g,encoding='utf-8')
(s/'DESIGN.md').write_text('# Batch Ten: four favorites plus ten new colors\n\nExperience mode. Preserve batch-nine structure, typography, spacing, content and behavior exactly. Routes 01-04 retain Original Frost, Cobalt, Acid Yellow and Warm Bone tokens verbatim. Routes 05-14 change palette tokens only. palettes.json is authoritative. Gallery cards are palette specimens, not website screenshots. Inactive wheel names use 20% ink / 80% paper; Original Frost retains its existing gray. Active names retain full ink. All media retains original colors.\n',encoding='utf-8')
shutil.copytree(s,r/'dist/batch-ten',dirs_exist_ok=True,ignore=shutil.ignore_patterns('DESIGN.md'))
assert len({(s/f'{i:02}/index.html').read_bytes() for i in range(1,15)})==1
for i,orig in enumerate([1,8,2,3],1):assert (s/f'{i:02}/palette.css').read_bytes()==(old/f'{orig:02}/palette.css').read_bytes()
print('Built 14 identical sites. Four retained palettes byte-identical. New text and nav contrast checks passed.')




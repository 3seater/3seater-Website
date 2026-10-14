from pathlib import Path
import json, shutil, hashlib
r=Path(__file__).resolve().parents[1];s=r/'src/batch-seven';s.mkdir(exist_ok=True)
original=(r/'src/app.js').read_text(encoding='utf-8')
css=(r/'src/style.css').read_text(encoding='utf-8')
markup=(r/'src/index.html').read_text(encoding='utf-8')
# Exact-copy reference: only typography-related JS edits. All layout/runtime retained.
fontapp=original.replace("typeMeasure.font = '400 100px Arial, Helvetica, sans-serif';","typeMeasure.font = '400 100px Anton';")
fontapp=fontapp.replace("loadJSON('site.json')])","loadJSON('site.json'), document.fonts.load('100px Anton'), document.fonts.load('14px Plex')])")
(s/'original.css').write_text(css,encoding='utf-8');(s/'original-fonts.js').write_text(fontapp,encoding='utf-8')
app=fontapp
# Factual main-site category/year/view controls and renderProject are reused verbatim.
# Change only the home caption to a project name, and add the selected-project preview.
app=app.replace("${!archive && items.length ? clientWheelMarkup() : ''}","${!archive && items.length ? selectedProjectsMarkup(list) + clientWheelMarkup() : ''}")
at=app.index('  function clientWheelMarkup()')
app=app[:at]+'''  function selectedProjectsMarkup(list) {
    return `<section class="selected-projects" aria-label="Selected projects"><div class="selected-heading"><h2>Selected projects</h2><a href="#/index">Full index ↗</a></div>${coverItems(list).slice(0,7).map(({project:p,media:m},i)=>{const words=p.title.split(' '),pos=[words.length,Math.ceil(words.length/2),0][i%3];const thumb=m.type==='video'?`<span class="selected-video"><img src="${escape(m.poster)}" alt="" width="${m.width}" height="${m.height}"><video data-preview="${escape(m.src)}" muted loop playsinline preload="none" aria-label="${escape(p.title)}"></video></span>`:`<span class="selected-video"><img src="${escape(m.src)}" alt="" width="${m.width}" height="${m.height}"></span>`;return `<a class="selected-row" href="${projectHref(p)}"><span>${escape(words.slice(0,pos).join(' '))} ${thumb} ${escape(words.slice(pos).join(' '))}</span></a>`}).join('')}</section>`;
  }
''' +app[at:]
# Native project media: retain single/two-column baseline, with an exact-height triptych.
app=app.replace('    initProjectAudio();','    initProjectAudio();\n    balanceProjectTriptych(p);')
at=app.index('  function initProjectAudio()')
app=app[:at]+'''  function balanceProjectTriptych(p) {
    if(p.media.length!==3)return;
    const grid=main.querySelector('.project-media'),figs=[...grid.children];
    const left=document.createElement('div'),right=document.createElement('div');
    left.className=right.className='media-column';left.append(figs[0],figs[1]);right.append(figs[2]);grid.replaceChildren(left,right);grid.classList.add('triptych');
    const ratios=p.media.map(m=>m.height/m.width),total=ratios.reduce((a,b)=>a+b,0);
    const fit=()=>{if(innerWidth<=700){grid.style.removeProperty('grid-template-columns');return}const gap=parseFloat(getComputedStyle(grid).gap)||20;const width=grid.clientWidth-gap;const first=(width*ratios[2]-gap)/total;grid.style.gridTemplateColumns=`${first}px minmax(0,1fr)`};
    const obs=new ResizeObserver(fit);obs.observe(grid);fit();videoControlCleanup.push(()=>obs.disconnect());
  }
''' +app[at:]
# For experiments only, the secondary embed follows main media on narrow screens.
app=app.replace("['Link', projectLink]", "['Link', '']")
needle='</section></div><a class="project-next"'
app=app.replace(needle,'</section>${projectLink ? `<aside class="project-secondary">${projectLink}</aside>` : \'\'}</div><a class="project-next"')
# Continuously loop all initialized preview videos, even after moving past them.
app=app.replace('else { visibleVideos.delete(entry.target); entry.target.pause(); }','else { /* Keep initialized previews looping. */ }')
(s/'app.js').write_text(app,encoding='utf-8')
for family in ['anton','ibmplexmono']:shutil.copytree(r/'src/batch-three/fonts'/family,s/'fonts'/family,dirs_exist_ok=True)
names=[('Original / New Type','The main site, copied directly. Only Anton and Plex font substitutions.'),('Frosted Rounds','Separate dark frosted pills, close to the original navigation.'),('Soft Capsule','One opaque frosted capsule with a quiet active segment.'),('Milk Glass','Pale frosted pills over framed project names.'),('Graphite Bar','A compact rounded graphite bar with uppercase labels.'),('Square Frost','Softly frosted rectangular buttons with restrained corners.'),('Floating Dock','A rounded bottom dock and the original archive toolbar.'),('Quiet Tabs','Minimal uppercase tabs with a clear underline.'),('Inset Glass','A pale capsule with a dark inset current tab.'),('Original / Framed','Original dark pill navigation with name-only framed work.')]
dirs=[]
data=json.loads((r/'dist/data.json').read_text(encoding='utf-8'))
for p in data['projects']:
 for m in p['media']:
  for key in ['src','poster','preview']:
   if m.get(key):m[key]='../../../'+m[key]
for i,(name,idea) in enumerate(names,1):
 d=dict(id=i,name=name,idea=idea,bg='#f8f9fb',fg='#17181a');dirs.append(d)
 target=s/f'{i:02}';target.mkdir(exist_ok=True)
 h=markup.replace('href="favicon.svg"','href="/favicon.svg"').replace('href="style.css"','href="../original.css"><link rel="stylesheet" href="../fonts.css"'+('' if i==1 else '><link rel="stylesheet" href="../variants.css"')).replace('src="app.js"',f'src="../{"original-fonts.js" if i==1 else "app.js"}"').replace('<body>',f'<body class="v{i}" data-direction="{i}">')
 h=h.replace('../app.js"','../app.js?revision=2"')
 h=h.replace('<title>3seater — Visual archive</title>',f'<title>3seater — {name}</title>')
 (target/'index.html').write_text(h,encoding='utf-8');(target/'data.json').write_text(json.dumps(data),encoding='utf-8');shutil.copy2(r/'src/site.json',target/'site.json')
(s/'directions.json').write_text(json.dumps(dirs,indent=2),encoding='utf-8')
# Retain the established comparison gallery; replace only its card data and copy.
gallery=(r/'src/batch-six/index.html').read_text(encoding='utf-8')
start=gallery.index('<main>');end=gallery.index('</main>',start)
cards=''.join(f'<a class="direction" href="{d["id"]:02}/"><div class="thumb"><img src="captures/{d["id"]:02}.png" alt="{d["name"]} preview" loading="lazy"></div><div class="card-title"><h2>{d["name"]}</h2><small>{d["id"]:02} / 10</small></div><p>{d["idea"]}</p></a>' for d in dirs)
gallery=gallery[:start]+'<main>'+cards+gallery[end:]
gallery=gallery.replace('Ink Grid boxes. Original bento. Contact Patch index.','Original foundation.<br>New type. Cleaner navigation.').replace('/batch-five/','/batch-six/')
(s/'index.html').write_text(gallery,encoding='utf-8')
(s/'original-provenance.json').write_text(json.dumps({'source':'src/index.html, src/app.js, src/style.css','source_hashes':{f:hashlib.sha256((r/f).read_bytes()).hexdigest() for f in ['src/index.html','src/app.js','src/style.css']},'version01_changes':['Font faces: footer and cylinder Anton; mono Plex','Canvas cylinder measurement uses Anton; startup waits for font metrics','Relative URLs relocated to batch route; source data unchanged'],'version01_layout_changes':[]},indent=2))
shutil.copytree(s,r/'dist/batch-seven',dirs_exist_ok=True,ignore=shutil.ignore_patterns('DIRECTION-CONTRACT.txt','DESIGN.md'))
print('Built batch seven: one faithful font swap and nine original-based experiments.')

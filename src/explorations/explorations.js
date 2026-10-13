(() => {
  'use strict';
  const directions = [
    ['Editorial','A fixed editorial margin and expansive image-led spreads.'],
    ['Screening room','A dark, cinematic sequence of large moving images.'],
    ['Contact sheet','A precise, compact grid with photographic numbering.'],
    ['Side rail','A vertical navigation rail beside an offset gallery.'],
    ['Glass dock','Soft gray surfaces and a floating frosted navigation dock.'],
    ['Live index','Oversized project names paired with a live image preview.'],
    ['Magazine','A large masthead and an asymmetric editorial grid.'],
    ['Gallery wall','A spatial arrangement of small works on generous white space.'],
    ['Dossiers','Full-width project records with image, title and metadata.'],
    ['Filmstrip','A horizontal, scroll-snapping sequence of tall project frames.'],
    ['White cube','One centered artwork at a time with museum-like spacing.'],
    ['Type wall','A typographic opening followed by monumental project blocks.'],
    ['Archive window','A desktop-inspired browser with a sidebar and soft chrome.'],
    ['Horizon','Wide panoramic project bands with restrained overlaid labels.'],
    ['Diptych','Two-column artwork pairings divided by a quiet central rule.'],
    ['Chronology','Work grouped by year along a spacious archive spine.'],
    ['Glass shelf','A dark shelf of floating, rounded projects and translucent controls.'],
    ['Spotlight','A full-screen project selector with a compact thumbnail ribbon.'],
    ['Offset','Alternating large and small imagery in a staggered composition.'],
    ['Quiet archive','An ultra-minimal image-and-title list with generous whitespace.']
  ];
  const e = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const enc = encodeURIComponent;
  const num = n => String(n).padStart(2,'0');
  const selected = Number(new URLSearchParams(location.search).get('v'));
  const v = selected >= 1 && selected <= 20 ? selected : 0;
  const app = document.querySelector('#app');
  let projects=[], config={}, observer, active=0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const asset = path => '../'+path;
  const href = p => '#/project/'+enc(p.id);
  const image = (p, eager=false) => {const m=p.media[p.cover];return `<img src="${e(asset(m.poster))}" alt="${e(p.title)}" width="${m.width}" height="${m.height}" loading="${eager?'eager':'lazy'}" decoding="async">`;};
  function card(p,i,video=true){const m=p.media[p.cover];return `<a class="work" href="${href(p)}"><div class="art">${image(p,i<3)}${video&&m.type==='video'?`<video muted loop playsinline preload="none" poster="${e(asset(m.poster))}" data-src="${e(asset(m.preview||m.src))}" aria-hidden="true"></video>`:''}</div><div class="caption"><span class="ordinal">${num(i+1)}</span><span class="project-title">${e(p.title)}</span><span class="year">${e(p.year)}</span></div><div class="discipline">${e(p.categories.join(' / '))}</div></a>`;}
  function header(){return `<header class="header"><a class="brand" href="#/">3seater</a><nav aria-label="Main navigation"><a href="#/" data-nav="work">Work</a><a href="#/archive" data-nav="archive">Archive</a><a href="#/index" data-nav="index">Index</a></nav><a class="contact-short" href="mailto:${e(config.email)}">Contact</a></header>`;}
  function footer(){return `<footer><div class="footer-links"><span>3seater ©2026</span><a href="#/archive">All projects (${projects.length})</a><a href="#/index">Project index</a><button data-top>Back to top ↑</button></div><a class="email" href="mailto:${e(config.email)}">${e(config.email)}</a><div class="socials"><a href="${e(config.instagram)}" target="_blank" rel="noopener">Instagram ↗</a>${(config.socials||[]).map(s=>`<a href="${e(s.url)}" target="_blank" rel="noopener">${e(s.label)} ↗</a>`).join('')}</div><a class="endmark" href="#/">3seater</a></footer>`;}
  function clients(){return `<section class="clients"><h2>Featured clients</h2><div>${[...new Set(projects.map(p=>p.client).filter(c=>c&&!config.featuredClientExclusions.includes(c)))].sort().map(c=>`<a href="#/clients/${enc(c)}">${e(c)}</a>`).join('')}</div></section>`;}
  function ordered(){const order=config.homeProjectOrder||[];return [...projects].sort((a,b)=>(order.indexOf(a.id)<0?99:order.indexOf(a.id))-(order.indexOf(b.id)<0?99:order.indexOf(b.id)));}
  function intro(){return `<section class="intro"><h1>Selected work</h1><p>${e(config.intro)}</p><a href="#/archive">All work <span>↗</span></a></section>`;}
  function gallery(list,cls=''){return `<div class="gallery ${cls}">${list.map((p,i)=>card(p,i)).join('')}</div>`;}
  function spotlight(list){const p=list[active%list.length];return `<section class="spotlight"><div class="spotlight-art">${card(p,active)}</div><div class="spotlight-controls"><button data-step="-1" aria-label="Previous project">←</button><span>${num(active+1)} / ${num(list.length)}</span><button data-step="1" aria-label="Next project">→</button></div><div class="ribbon" aria-label="Choose project">${list.map((p,i)=>`<button data-slide="${i}" aria-label="Show ${e(p.title)}" aria-pressed="${i===active}">${image(p)}</button>`).join('')}</div></section>`;}
  function liveIndex(list){return `<section class="live-index"><div class="live-preview">${image(list[0],true)}<p>${e(list[0].title)}</p></div><div class="live-list">${list.map((p,i)=>`<a href="${href(p)}" data-preview="${e(p.id)}"><span>${num(i+1)}</span><span>${e(p.title)}</span><small>${e(p.year)}</small></a>`).join('')}</div></section>`;}
  function chronology(list){return `<div class="chronology">${[...new Set(list.map(p=>p.year))].sort().reverse().map(y=>`<section class="year-group"><h2>${e(y||'—')}</h2>${gallery(list.filter(p=>p.year===y))}</section>`).join('')}</div>`;}
  function home(){const list=ordered();let body;
    if(v===6) body=intro()+liveIndex(list);
    else if(v===16) body=intro()+chronology(list);
    else if(v===18) body=spotlight(list);
    else if(v===13) body=`<section class="archive-window"><div class="window-bar"><span>3seater</span><span>Selected work</span><span>${projects.length} projects</span></div><div class="window-body"><aside><p>${e(config.intro)}</p><a href="#/archive">All projects</a><a href="#/index">Project index</a></aside>${gallery(list)}</div></section>`;
    else body=(v===7||v===12?'<div class="masthead" aria-hidden="true">3seater</div>':'')+intro()+gallery(list);
    return body+clients();
  }
  function filterControls(category,year){const years=[...new Set(projects.flatMap(p=>{const m=String(p.year).match(/^(\d{4})(?:[-–—](\d{4}))?$/);return m?Array.from({length:Number(m[2]||m[1])-Number(m[1])+1},(_,i)=>String(Number(m[1])+i)):[];}))].sort().reverse();return `<div class="filters"><div class="categories" aria-label="Filter by discipline">${['All',...new Set(projects.flatMap(p=>p.filters))].map(c=>`<button data-category="${e(c)}" aria-pressed="${category===c}">${c==='All'?'All work':e(c)}</button>`).join('')}</div><select aria-label="Filter by year"><option value="">All years</option>${years.map(y=>`<option ${year===y?'selected':''}>${y}</option>`).join('')}</select></div>`;}
  function archive(params){const c=params.get('category')||'All',y=params.get('year')||'';const list=projects.filter(p=>(c==='All'||p.filters.includes(c))&&(!y||(p.year&&Number(y)>=Number(p.year.slice(0,4))&&Number(y)<=Number(p.year.slice(-4)))));return `<div class="page-title"><h1>Archive</h1><span>${list.length} projects</span></div>${filterControls(c,y)}${list.length?gallery(list,'archive-grid'):'<div class="empty"><p>No projects match these filters.</p><a href="#/archive">Clear filters</a></div>'}`;}
  function index(){return `<div class="page-title"><h1>Index</h1><span>${projects.length} projects</span></div><div class="index-groups">${[...new Set(projects.flatMap(p=>p.categories))].sort().map(c=>`<section><h2>${e(c)}</h2>${projects.filter(p=>p.categories.includes(c)).map(p=>`<a class="index-row" href="${href(p)}">${image(p)}<span>${e(p.title)}</span><small>${e(p.year)}</small><span aria-hidden="true">↗</span></a>`).join('')}</section>`).join('')}</div>`;}
  function project(id){const p=projects.find(p=>p.id===id);if(!p)return '<div class="empty"><h1>Project not found</h1><a href="#/archive">Back to archive</a></div>';const next=projects[(projects.indexOf(p)+1)%projects.length];return `<a class="back" href="#/archive">← All projects</a><article class="project-detail"><div class="project-info"><h1>${e(p.title)}</h1><dl>${p.year?`<dt>Year</dt><dd>${e(p.year)}</dd>`:''}${p.client?`<dt>Client</dt><dd><a href="#/clients/${enc(p.client)}">${e(p.client)}</a></dd>`:''}<dt>Discipline</dt><dd>${e(p.categories.join(', '))}</dd>${p.role?`<dt>Role</dt><dd>${e(p.role)}</dd>`:''}</dl>${p.description?`<p>${e(p.description)}</p>`:''}${p.link?`<a href="${e(p.link)}" target="_blank" rel="noopener">View project ↗</a>`:''}</div><div class="project-media">${p.media.map((m,i)=>`<figure>${m.type==='video'?`<video controls playsinline preload="metadata" poster="${e(asset(m.poster))}" src="${e(asset(m.src))}"></video>`:`<img src="${e(asset(m.src))}" alt="${e(p.title)} — image ${i+1}" loading="${i?'lazy':'eager'}" width="${m.width}" height="${m.height}">`}<figcaption>${num(i+1)} / ${num(p.media.length)}</figcaption></figure>`).join('')}</div></article><a class="next-project" href="${href(next)}"><span>Next project</span><span>${e(next.title)} ↗</span></a>`;}
  function overview(){document.body.className='overview';app.innerHTML=`<main id="main"><header class="overview-header"><span>3seater</span><span>UI explorations / 20 directions</span></header><h1>Same work.<br>Twenty perspectives.</h1><p class="overview-copy">Select a direction to explore the full site. Every version includes Work, Archive, Index and your project pages.</p><div class="direction-grid">${directions.map(([name,desc],i)=>`<a href="?v=${i+1}#/" class="direction ${[2,17,18].includes(i+1)?'dark-thumb':''}"><div class="mini mini-${i+1}"><span>3seater</span><div>${ordered().slice(0,6).map(p=>image(p)).join('')}</div></div><div class="direction-label"><span>${num(i+1)} / ${name}</span><span>↗</span></div><p>${desc}</p></a>`).join('')}</div></main>`;}
  function render(){observer?.disconnect();app.querySelectorAll('video').forEach(el=>el.pause());if(!v){overview();return;}
    const url=new URL((location.hash.slice(1)||'/'),'https://archive.local');const parts=url.pathname.split('/').filter(Boolean).map(decodeURIComponent);const route=parts[0]||'work';document.body.className=`v${v} route-${route}${[5,13,17].includes(v)?' system':''}`;document.title=`3seater — ${directions[v-1][0]}`;
    let content=route==='work'?home():route==='archive'?archive(url.searchParams):route==='index'?index():route==='project'?project(parts[1]):route==='clients'?`<a class="back" href="#/">← Work</a><div class="page-title"><h1>${e(parts[1])}</h1></div>${gallery(projects.filter(p=>p.client===parts[1]),'archive-grid')}`:'<div class="empty"><h1>Page not found</h1><a href="#/">Back to work</a></div>';
    app.innerHTML=header()+`<main id="main" tabindex="-1">${content}</main>`+footer();document.querySelector(`[data-nav="${route==='project'||route==='clients'?'work':route}"]`)?.setAttribute('aria-current','page');
    document.querySelector('[data-top]').onclick=()=>window.scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'});
    app.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>{active=(active+Number(b.dataset.step)+projects.length)%projects.length;render();});app.querySelectorAll('[data-slide]').forEach(b=>b.onclick=()=>{active=Number(b.dataset.slide);render();});
    app.querySelectorAll('[data-preview]').forEach(a=>{const update=()=>{const p=projects.find(p=>p.id===a.dataset.preview);document.querySelector('.live-preview').innerHTML=image(p,true)+`<p>${e(p.title)}</p>`;};a.onmouseenter=update;a.onfocus=update;});
    const filter=(c,y)=>{const p=new URLSearchParams();if(c&&c!=='All')p.set('category',c);if(y)p.set('year',y);location.hash='/archive'+(p.size?'?'+p:'');};app.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>filter(b.dataset.category,url.searchParams.get('year')));const select=app.querySelector('select');if(select)select.onchange=()=>filter(url.searchParams.get('category'),select.value);
    if(!reduced.matches&&!navigator.connection?.saveData){observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{if(isIntersecting){if(!target.src)target.src=target.dataset.src;target.play().catch(()=>{});}else target.pause();}),{threshold:.2});app.querySelectorAll('video[data-src]').forEach(el=>observer.observe(el));}
  }
  document.querySelector('.skip').addEventListener('click',event=>{event.preventDefault();const main=document.querySelector('#main');if(main){main.setAttribute('tabindex','-1');main.focus();main.scrollIntoView({behavior:'instant'});}});
  window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0);});reduced.addEventListener('change',render);
  Promise.all(['../data.json','../site.json'].map(async u=>{const r=await fetch(u);if(!r.ok)throw Error(u);return r.json();})).then(([d,c])=>{projects=d.projects;config=c;render();}).catch(()=>{app.innerHTML='<main><h1>The archive could not load.</h1><p>Reload the page to try again.</p><button onclick="location.reload()">Reload archive</button></main>';});
})();

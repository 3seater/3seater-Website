(() => {
'use strict';
const C = [
 ['Atlas','Space Grotesk','Client rail + compact visual atlas','atlas'],
 ['Channels','Manrope','Horizontal discipline lanes','channels'],
 ['Registry','Archivo','A sortable visual project ledger','registry'],
 ['Patchwork','Outfit','A fitted mosaic with a floating navigation bar','patchwork'],
 ['Client library','Work Sans','A collection-first library of artists and projects','library'],
 ['Inspector','Figtree','A compact preview beside a dense selection panel','inspector'],
 ['Yearbook','Barlow','Parallel columns for every year of work','yearbook'],
 ['Sequences','Sora','Each project as a small strip of its own media','sequences'],
 ['Pinboard','DM Sans','An airy arrangement of small mounted artworks','pinboard'],
 ['Edition','Plus Jakarta Sans','A tightly typeset, multi-column work journal','edition'],
 ['Afterhours','Archivo','A dark preview and compact numbered directory','afterhours'],
 ['Pocket','Outfit','A soft, compact image library with capsule navigation','pocket'],
 ['Departments','Space Grotesk','Parallel shelves organized by discipline','departments'],
 ['Sleeves','Manrope','Client collections presented as overlapping sleeves','sleeves'],
 ['Proofs','Barlow','A dense numbered image proof sheet','proofs'],
 ['Folds','Work Sans','Expandable client collections in two columns','folds'],
 ['Dual register','Sora','Two synchronized scales: visuals and a project register','dual'],
 ['Taxonomy','Figtree','A visual index of the actual project categories','taxonomy'],
 ['Carousel','Plus Jakarta Sans','Twelve small projects per page, with direct paging','carousel'],
 ['Dispatch','DM Sans','A two-column directory with compact image windows','dispatch']
];
const root=document.querySelector('#root');
const escape=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const E=encodeURIComponent, number=n=>String(n).padStart(2,'0');
const vRaw=Number(new URLSearchParams(location.search).get('v')), v=Number.isInteger(vRaw)&&vRaw>0&&vRaw<=20?vRaw:0;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let data=[],site={},selected='',page=0,sort='curated',observer;
const link=p=>'#/project/'+E(p.id), mediaPath=s=>'../'+s;
const clientLink=c=>'#/client/'+E(c);
function cover(p){return p.media[p.cover]||p.media[0];}
function image(p,cls='',m=cover(p),eager=false){return m.type==='video'?`<video class="${cls}" autoplay muted loop playsinline preload="none" data-video="${escape(mediaPath(m.preview||m.src))}" poster="${escape(mediaPath(m.poster))}" width="${m.width}" height="${m.height}" aria-label="${escape(p.title)}"></video>`:`<img class="${cls}" src="${escape(mediaPath(m.src))}" alt="${escape(p.title)}" width="${m.width}" height="${m.height}" loading="${eager?'eager':'lazy'}">`;}
function motion(p){const m=cover(p);return m.type==='video'?`<video muted playsinline loop preload="none" poster="${escape(mediaPath(m.poster))}" data-video="${escape(mediaPath(m.preview||m.src))}" aria-hidden="true"></video>`:'';}
function art(p,i=0,video=true){return `<div class="image-box">${image(p,'',cover(p),i<12)}</div>`;}
function tile(p,i=0,extra=''){return `<a class="tile ${extra}" data-project="${escape(p.id)}" href="${link(p)}">${art(p,i)}<div class="tile-label"><span>${escape(p.title)}</span><small>${escape(p.year)}</small></div><span class="tile-type">${escape(p.categories.join(' / '))}</span></a>`;}
function rows(list,thumb=true){return list.map((p,i)=>`<a class="record" data-project="${escape(p.id)}" href="${link(p)}"><span class="record-n">${number(i+1)}</span>${thumb?image(p):''}<span class="record-title">${escape(p.title)}<small>${escape(p.categories.join(' / '))}</small></span><span class="record-client">${escape(p.client)}</span><time>${escape(p.year)}</time><span class="arrow" aria-hidden="true">↗</span></a>`).join('');}
function order(){const priority=new Map((site.homeProjectOrder||[]).map((id,i)=>[id,i]));return [...data].sort((a,b)=>(priority.get(a.id)??99)-(priority.get(b.id)??99));}
function groups(key='client',list=order()){const map=new Map();for(const p of list){const values=key==='filters'?p.filters:key==='categories'?p.categories:[p[key]||'Personal work'];for(const value of values){if(!map.has(value))map.set(value,[]);map.get(value).push(p);}}return [...map];}
function chrome(){return `<header class="chrome"><a class="identity" href="#/">3seater<span class="identity-dot" aria-hidden="true"></span></a><nav aria-label="Main navigation"><a href="#/" data-route="work">Work</a><a href="#/archive" data-route="archive">Archive</a><a href="#/index" data-route="index">Index</a></nav><a class="chrome-contact" href="mailto:${escape(site.email)}">Contact ↗</a></header>`;}
function footer(){return `<footer class="footer"><a href="#/">3seater ©2026</a><a href="mailto:${escape(site.email)}">${escape(site.email)}</a><a href="${escape(site.instagram)}" target="_blank" rel="noopener">Instagram ↗</a>${(site.socials||[]).map(s=>`<a href="${escape(s.url)}" target="_blank" rel="noopener">${escape(s.label)} ↗</a>`).join('')}<button data-top>Top ↑</button></footer>`;}
function note(){return `<div class="collection-note"><p>${escape(site.intro)}</p><span>${data.length} projects</span></div>`;}
function heading(name,count){return `<div class="section-heading"><h1>${escape(name)}</h1>${count!==undefined?`<span>${count} projects</span>`:''}</div>`;}
function clientRail(){return `<aside class="client-rail"><h2>Clients</h2>${groups().map(([c,l])=>`<a href="${clientLink(c)}"><span>${escape(c)}</span><small>${l.length}</small></a>`).join('')}</aside>`;}
function grid(list,cls=''){return `<div class="tiles ${cls}">${list.map((p,i)=>tile(p,i)).join('')}</div>`;}
function laneGroups(key,cls){return `<div class="${cls}">${groups(key).map(([name,list])=>`<section class="lane"><div class="lane-heading"><h2>${escape(name)}</h2><span>${list.length}</span></div><div class="lane-items">${list.map((p,i)=>tile(p,i)).join('')}</div></section>`).join('')}</div>`;}
function selector(list,dark=false){const p=list.find(p=>p.id===selected)||list[0];return `<div class="selector ${dark?'list-mode':''}"><section class="inspect-panel"><a href="${link(p)}">${art(p,0)}<h1>${escape(p.title)}</h1></a><dl><dt>Year</dt><dd>${escape(p.year||'—')}</dd><dt>Discipline</dt><dd>${escape(p.categories.join(', '))}</dd>${p.client?`<dt>Client</dt><dd><a href="${clientLink(p.client)}">${escape(p.client)}</a></dd>`:''}</dl><a class="open-project" href="${link(p)}">Open project ↗</a></section><div class="selection-grid" aria-label="Select a project">${list.map((q,i)=>`<button data-select="${escape(q.id)}" data-project="${escape(q.id)}" aria-pressed="${q.id===p.id}">${image(q,'',cover(q),true)}<span><small>${number(i+1)}</small>${escape(q.title)}</span><time>${escape(q.year)}</time></button>`).join('')}</div></div>`;}
function library(stack=false){return `<div class="client-library ${stack?'sleeves':''}">${groups().map(([c,l])=>`<section class="client-collection"><a class="collection-heading" href="${clientLink(c)}"><h2>${escape(c)}</h2><span>${l.length} ${l.length===1?'project':'projects'} ↗</span></a><div class="collection-items">${l.map((p,i)=>tile(p,i)).join('')}</div></section>`).join('')}</div>`;}
function sequence(){return `<div class="sequence-list">${order().map((p,i)=>`<a class="sequence" data-project="${escape(p.id)}" href="${link(p)}"><div class="sequence-title"><span>${number(i+1)}</span><h2>${escape(p.title)}</h2><small>${escape(p.year)}</small></div><div class="sequence-frames">${p.media.map(m=>image(p,'',m)).join('')}</div><span class="sequence-count">${p.media.length} ${p.media.length===1?'frame':'frames'} ↗</span></a>`).join('')}</div>`;}
function registry(){let list=order();if(sort==='title')list.sort((a,b)=>a.title.localeCompare(b.title));if(sort==='year')list.sort((a,b)=>b.year.localeCompare(a.year));return `<div class="ledger-tools"><span>All projects</span><label>Sort <select data-sort><option value="curated" ${sort==='curated'?'selected':''}>Selected order</option><option value="title" ${sort==='title'?'selected':''}>Title A–Z</option><option value="year" ${sort==='year'?'selected':''}>Newest first</option></select></label></div><div class="ledger">${rows(list)}</div>`;}
function accordion(){return `<div class="folds">${groups().map(([c,l],i)=>`<details class="fold" ${i<6?'open':''}><summary><span>${escape(c)}</span><small>${l.length} ${l.length===1?'project':'projects'}</small></summary><div class="fold-content">${l.map((p,j)=>tile(p,j)).join('')}<a class="collection-more" href="${clientLink(c)}">Client collection ↗</a></div></details>`).join('')}</div>`;}
function pager(){const l=order();const pages=Math.ceil(l.length/12);page=Math.min(page,pages-1);return `<div class="page-control"><h1>Work</h1><div><button data-page="${page-1}" ${page===0?'disabled':''} aria-label="Previous page">←</button>${Array.from({length:pages},(_,i)=>`<button data-page="${i}" aria-current="${i===page?'page':'false'}">${number(i+1)}</button>`).join('')}<button data-page="${page+1}" ${page===pages-1?'disabled':''} aria-label="Next page">→</button></div><span>${page*12+1}–${Math.min((page+1)*12,l.length)} / ${l.length}</span></div>${grid(l.slice(page*12,page*12+12),'page-tiles')}`;}
function home(){const l=order();switch(v){
case 1:return `<div class="atlas-layout">${clientRail()}<div>${note()}${grid(l)}</div></div>`;
case 2:return note()+laneGroups('filters','channels');
case 3:return note()+registry();
case 4:return note()+grid(l,'patchwork');
case 5:return note()+library();
case 6:return note()+selector(l);
case 7:return note()+laneGroups('year','year-columns');
case 8:return note()+sequence();
case 9:return note()+grid(l,'pinboard');
case 10:return `<div class="journal"><aside><h1>Work.</h1><p>${escape(site.intro)}</p><a href="#/index">Project index ↗</a></aside><div>${grid(l,'journal-grid')}</div></div>`;
case 11:return note()+selector(l,true);
case 12:return note()+`<div class="pocket-tabs">${['All','3D','Motion','Graphic Design','UI'].map(c=>`<a href="#/archive${c==='All'?'':'?category='+E(c)}">${c==='All'?'All work':c}</a>`).join('')}</div>`+grid(l,'pocket-grid');
case 13:return note()+laneGroups('filters','departments');
case 14:return note()+library(true);
case 15:return note()+grid(l,'proofs');
case 16:return note()+accordion();
case 17:return note()+`<div class="dual-layout"><div class="dual-visual">${grid(l)}</div><div class="dual-register">${rows(l,false)}</div></div>`;
case 18:return `<div class="taxonomy-layout"><aside><h1>Work</h1><p>${escape(site.intro)}</p>${groups('categories').map(([c,l],i)=>`<a href="#category-${i}" data-scroll="category-${i}">${escape(c)} <small>${l.length}</small></a>`).join('')}</aside><div class="taxonomy">${groups('categories').map(([c,list],i)=>`<section id="category-${i}"><h2>${escape(c)}</h2>${grid(list)}</section>`).join('')}</div></div>`;
case 19:return note()+pager();
case 20:return note()+`<div class="dispatch">${rows(l)}</div>`;
}}
function filters(params){const category=params.get('category')||'All', year=params.get('year')||'';const years=[...new Set(data.flatMap(p=>{const m=String(p.year).match(/^(\d{4})(?:[-–—](\d{4}))?$/);return m?Array.from({length:+(m[2]||m[1])- +m[1]+1},(_,i)=>String(+m[1]+i)):[];}))].sort().reverse();return `<div class="filter-controls"><div>${['All',...new Set(data.flatMap(p=>p.filters))].map(c=>`<button data-filter="${escape(c)}" aria-pressed="${category===c}">${c==='All'?'All work':escape(c)}</button>`).join('')}</div><label>Year <select data-year><option value="">All years</option>${years.map(y=>`<option ${year===y?'selected':''}>${y}</option>`).join('')}</select></label></div>`;}
function archive(params){const category=params.get('category')||'All',y=params.get('year')||'';const l=order().filter(p=>(category==='All'||p.filters.includes(category))&&(!y||(p.year&&+y>=+p.year.slice(0,4)&&+y<=+p.year.slice(-4))));return heading('Archive',l.length)+filters(params)+(l.length?grid(l,'archive-grid'):'<section class="empty"><h2>No matching projects</h2><a href="#/archive">Reset filters</a></section>');}
function index(){return heading('Index',data.length)+`<div class="index-layout">${groups('categories').sort(([a],[b])=>a.localeCompare(b)).map(([c,l])=>`<section><h2>${escape(c)}</h2>${rows(l)}</section>`).join('')}</div>`;}
function project(id){const p=data.find(p=>p.id===id);if(!p)return '<section class="empty"><h1>Project not found</h1><a href="#/archive">Browse archive</a></section>';const next=order()[(order().findIndex(p=>p.id===id)+1)%data.length];return `<a class="back" href="#/archive">← Archive</a><article class="project"><section class="project-facts"><h1>${escape(p.title)}</h1><dl>${p.year?`<dt>Year</dt><dd>${escape(p.year)}</dd>`:''}${p.client?`<dt>Client</dt><dd><a href="${clientLink(p.client)}">${escape(p.client)}</a></dd>`:''}<dt>Discipline</dt><dd>${escape(p.categories.join(', '))}</dd>${p.role?`<dt>Role</dt><dd>${escape(p.role)}</dd>`:''}</dl>${p.description?`<p>${escape(p.description)}</p>`:''}${p.link?`<a class="open-project" href="${escape(p.link)}" target="_blank" rel="noopener">View project ↗</a>`:''}</section><div class="project-assets">${p.media.map((m,i)=>`<figure>${m.type==='video'?`<video autoplay muted loop controls playsinline preload="metadata" src="${escape(mediaPath(m.src))}" poster="${escape(mediaPath(m.poster))}"></video>`:`<img src="${escape(mediaPath(m.src))}" alt="${escape(p.title)} — ${i+1}" width="${m.width}" height="${m.height}" loading="${i?'lazy':'eager'}">`}<figcaption>${number(i+1)} / ${number(p.media.length)}</figcaption></figure>`).join('')}</div></article><a class="next" href="${link(next)}"><span>Next project</span><span>${escape(next.title)} ↗</span></a>`;}
function overview(){document.body.className='overview';root.innerHTML=`<main id="content"><header class="overview-head"><a href="../explorations/">3seater</a><span>Batch two / 20 fresh directions</span></header><div class="overview-title"><h1>A different way<br>into the work.</h1><p>Twenty new structures. Smaller media, more projects in view, and ten different sans-serif families.</p></div><div class="options">${C.map(([name,font,desc,slug],i)=>`<a class="option" href="?v=${i+1}#/" style="--preview-font:'${font}'"><div class="option-demo demo-${slug}"><span>${name}</span><div>${order().slice(0,12).map((p,j)=>image(p,'',cover(p),j<6)).join('')}</div></div><div class="option-name"><h2>${number(i+1)} / ${name}</h2><span>↗</span></div><p>${desc}</p><small>${font}</small></a>`).join('')}</div></main>`;}
function render(){observer?.disconnect();root.querySelectorAll('video').forEach(v=>v.pause());if(!v)return overview();const url=new URL(location.hash.slice(1)||'/','https://3seater.local');const path=url.pathname.split('/').filter(Boolean).map(decodeURIComponent);const route=path[0]||'work';document.body.className=`design-${v} route-${route}`;document.body.style.setProperty('--font',`'${C[v-1][1]}',sans-serif`);document.title=`3seater — ${C[v-1][0]} / Batch two`;
let output=route==='work'?home():route==='archive'?archive(url.searchParams):route==='index'?index():route==='project'?project(path[1]):route==='client'?`<a class="back" href="#/">← Work</a>${heading(path[1])}${grid(data.filter(p=>(p.client||'Personal work')===path[1]),'archive-grid')}`:'<section class="empty"><h1>Page not found</h1><a href="#/">Back to work</a></section>';
root.innerHTML=chrome()+`<main id="content" tabindex="-1">${output}</main>`+footer();root.querySelector(`[data-route="${['project','client'].includes(route)?'work':route}"]`)?.setAttribute('aria-current','page');bind(url);}
function bind(url){root.querySelector('[data-top]').onclick=()=>window.scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'});root.querySelectorAll('[data-select]').forEach(b=>b.onclick=()=>{selected=b.dataset.select;render();root.querySelector(`[data-select="${CSS.escape(selected)}"]`)?.focus({preventScroll:true});});root.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>{page=Number(b.dataset.page);render();root.querySelector('.page-control').scrollIntoView({block:'start'});});root.querySelectorAll('[data-scroll]').forEach(a=>a.onclick=event=>{event.preventDefault();document.getElementById(a.dataset.scroll)?.scrollIntoView({behavior:reduced.matches?'instant':'smooth'});});const sortEl=root.querySelector('[data-sort]');if(sortEl)sortEl.onchange=()=>{sort=sortEl.value;render();};
const filter=(c,y)=>{const q=new URLSearchParams();if(c&&c!=='All')q.set('category',c);if(y)q.set('year',y);location.hash='/archive'+(q.size?'?'+q:'');};root.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>filter(b.dataset.filter,url.searchParams.get('year')));const year=root.querySelector('[data-year]');if(year)year.onchange=()=>filter(url.searchParams.get('category'),year.value);
{observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{if(isIntersecting){if(!target.src)target.src=target.dataset.video;target.play().catch(()=>{});}}),{threshold:.3});root.querySelectorAll('video[data-video]').forEach(el=>observer.observe(el));}}
document.querySelector('.skip').onclick=event=>{event.preventDefault();const m=document.querySelector('#content');m.setAttribute('tabindex','-1');m.focus();m.scrollIntoView({behavior:'instant'});};window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0);});reduced.addEventListener('change',render);
Promise.all(['../data.json','../site.json'].map(async path=>{const r=await fetch(path);if(!r.ok)throw Error(path);return r.json();})).then(([d,s])=>{data=d.projects;site=s;render();}).catch(()=>{root.innerHTML='<main><h1>Work could not load.</h1><p>Refresh the page to try again.</p><button onclick="location.reload()">Reload</button></main>';});
})();

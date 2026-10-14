const app=document.querySelector('#app'),main=app,version=Number(document.body.dataset.direction);
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const escape=e,slug=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let projects=[],site={},config={},direction={},observer,videoControlCleanup=[];
const uniqueClients=()=>[...new Set(projects.map(p=>p.client).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
const clientHref=name=>'#clients/'+encodeURIComponent(name),projectHref=p=>'#project/'+p.id;
const arrow='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>';
const cover=p=>p.media[p.cover||0]||p.media[0];
const media=(p,m=cover(p),full=false)=>m.type==='video'?`<video class="media" autoplay muted loop playsinline ${full?'controls':''} preload="none" data-src="/${e(full?m.src:m.preview||m.src)}" poster="/${e(m.poster)}" width="${m.width}" height="${m.height}" aria-label="${e(p.title)}"></video>`:`<img class="media" src="/${e(m.src)}" alt="${e(p.title)}" width="${m.width}" height="${m.height}" loading="lazy" decoding="async">`;
const meta=p=>`<span class="year">${e(p.year)}</span><span class="discipline">${e(p.categories.join(' / '))}</span>`;
const tile=(p,i=0)=>`<article class="tile t${i%12}" style="--ratio:${cover(p).width/cover(p).height}"><a href="${projectHref(p)}"><div class="tile-image">${media(p)}</div><div class="tile-label"><span>${e(p.title)}</span>${arrow}</div></a><div class="tile-meta">${meta(p)}</div></article>`;
const nav=()=>{let hash=location.hash.slice(1).split('/')[0]||'work';if(hash==='project')hash='work';return `<header class="site-header"><nav aria-label="Main navigation">${[['work','Work'],['archive','Archive'],['index','Index'],['clients','Clients'],['contact','Contact']].map(([id,label])=>`<a href="${id==='work'?'#':'#'+id}" ${hash===id?'aria-current="page"':''}>${label}</a>`).join('')}</nav></header>`};
const footer=()=>`<footer class="site-footer"><a href="#">Back to work</a><a href="mailto:${e(site.email)}">${e(site.email)}</a><a href="../">All 20 directions</a></footer>`;
function grid(ps,kind=direction.layout){
 const cards=ps.map(tile);
 if(['twins','paired'].includes(kind))return `<div class="home-grid ${kind}">${[0,1].map(c=>`<section class="grid-half">${ps.filter((p,i)=>i%2===c).map(tile).join('')}</section>`).join('')}</div>`;
 if(['reels','masonry','frames'].includes(kind)){const cols=kind==='reels'?4:5;return `<div class="home-grid ${kind}">${Array.from({length:cols},(_,c)=>`<section class="grid-column">${ps.filter((p,i)=>i%cols===c).map(tile).join('')}</section>`).join('')}</div>`}
 if(['cuts','wide','bands','justified'].includes(kind))return `<div class="home-grid ${kind}">${Array.from({length:Math.ceil(ps.length/4)},(_,i)=>`<section class="grid-band">${ps.slice(i*4,i*4+4).map((p,j)=>tile(p,i*4+j)).join('')}</section>`).join('')}</div>`;
 if(kind==='macro')return `<div class="home-grid macro"><section class="macro-lead">${cards[0]}${cards.slice(1,3).join('')}</section><section class="macro-small">${cards.slice(3).join('')}</section></div>`;
 if(kind==='pace')cards.splice(7,0,'<div class="type-cell" aria-hidden="true">Selected<br>work.</div>');
 return `<div class="home-grid ${kind}">${cards.join('')}</div>`;
}
function row(p,i){const words=p.title.split(/\s+/),position=(i*7+version)%5;const slot=position===0?0:position===1?words.length:Math.max(1,Math.min(words.length-1,Math.ceil(words.length*((position+1)/6))));const left=words.slice(0,slot).join(' '),right=words.slice(slot).join(' ');return `<a class="index-row r${position}" href="${projectHref(p)}"><span class="row-content">${left?`<span class="row-words">${e(left)}</span> `:''}<span class="row-media">${media(p)}</span>${right?` <span class="row-words">${e(right)}</span>`:''}</span><span class="row-year">${e(p.year)}</span></a>`}
function list(ps,preview=false){return `<section class="project-index ${direction.list}" aria-label="${preview?'Selected project index':'All projects'}">${preview?'<div class="section-heading"><h2>Selected projects</h2><a href="#index">Full index '+arrow+'</a></div>':''}${ps.map(row).join('')}</section>`}
function home(){const ps=projects.slice(0,direction.count);const preview=list(projects.slice(version%3,version%3+7),true);return `<main id="content"><h1 class="sr-only">3seater — Selected work</h1>${grid(ps)}<div class="grid-close"><a href="#archive">All ${projects.length} projects ${arrow}</a><a href="#index">View index ${arrow}</a></div>${direction.sequence==='wheel'?clientWheelMarkup()+preview:preview+clientWheelMarkup()}</main>`}
function archive(){return `<main id="content" class="archive-page"><div class="page-heading"><h1>Archive</h1><span id="result-count" role="status">${projects.length} projects</span></div><form class="filters" role="search"><label>Search<input type="search" placeholder="Project or client" name="search"></label><label>Discipline<select name="discipline"><option value="">All work</option>${['3D','Motion','Graphic Design','UI'].map(x=>`<option>${x}</option>`).join('')}</select></label><label>Year<select name="year"><option value="">All years</option>${[...new Set(projects.map(p=>p.year))].sort().reverse().map(y=>`<option>${e(y)}</option>`).join('')}</select></label><button type="reset">Reset</button></form><div id="results">${grid(projects,'archive-grid')}</div><p class="empty" hidden>No projects match. Try another search or reset the filters.</p></main>`}
function clients(name){if(name){const ps=projects.filter(p=>p.client===name);return `<main id="content"><div class="page-heading"><h1>${e(name)}</h1><a href="#clients">All clients</a></div>${ps.length?grid(ps,'archive-grid'):'<p class="empty">No projects found for this client.</p>'}</main>`}return `<main id="content" class="clients-page"><h1 class="sr-only">Clients</h1>${clientWheelMarkup()}<section class="client-directory"><h2>All clients</h2>${uniqueClients().map(n=>`<a href="${clientHref(n)}"><span>${e(n)}</span><small>${projects.filter(p=>p.client===n).length} projects</small>${arrow}</a>`).join('')}</section></main>`}
function youtubeId(link){try{const u=new URL(link),host=u.hostname.replace(/^www\./,''),parts=u.pathname.split('/').filter(Boolean);const id=host==='youtu.be'?parts[0]:['youtube.com','m.youtube.com','youtube-nocookie.com'].includes(host)?u.pathname==='/watch'?u.searchParams.get('v'):['embed','shorts'].includes(parts[0])?parts[1]:'':'';return /^[\w-]{11}$/.test(id||'')?id:''}catch{return ''}}
function project(p){const id=youtubeId(p.link),next=projects[(projects.indexOf(p)+1)%projects.length];return `<main id="content" class="project-page"><a class="back" href="#archive">All projects</a><header class="project-heading"><h1>${e(p.title)}</h1><dl>${[['Year',e(p.year)],['Client',p.client?`<a href="${clientHref(p.client)}">${e(p.client)}</a>`:''],['Discipline',e(p.categories.join(' / '))],['Role',e(p.role)]].filter(x=>x[1]).map(([key,val])=>`<div><dt>${key}</dt><dd>${val}</dd></div>`).join('')}</dl>${p.description?`<p>${e(p.description)}</p>`:''}</header>${id?`<section class="project-source"><div><h2>Video link</h2><a href="${e(p.link)}" target="_blank" rel="noopener">Watch on YouTube ${arrow}</a></div><iframe title="${e(p.title)} — YouTube video" src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&playsinline=1" width="640" height="360" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></section>`:p.link?`<p class="source-link"><a href="${e(p.link)}" target="_blank" rel="noopener">View project ${arrow}</a></p>`:''}<section class="project-media" aria-label="Project media">${p.media.map(m=>`<figure>${media(p,m,true)}</figure>`).join('')}</section><a class="next-project" href="${projectHref(next)}"><span>Next project</span><strong>${e(next.title)}</strong>${arrow}</a></main>`}
function contact(){return `<main id="content" class="contact-page"><h1>Contact</h1><p>${e(site.intro)}</p><a class="email" href="mailto:${e(site.email)}">${e(site.email)}</a><div class="social-links"><a href="${e(site.instagram)}" target="_blank" rel="noopener">Instagram ${arrow}</a>${site.socials.map(s=>`<a href="${e(s.url)}" target="_blank" rel="noopener">${e(s.label)} ${arrow}</a>`).join('')}</div></main>`}
function startVideo(v){v.muted=true;v.defaultMuted=true;v.loop=true;v.autoplay=true;if(!v.getAttribute('src')){v.src=v.dataset.src;v.load()}v.play().catch(()=>{v.dataset.blocked='true'})}
function playback(){observer?.disconnect();observer=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){startVideo(x.target);observer.unobserve(x.target)}}),{rootMargin:'350px'});app.querySelectorAll('video').forEach(v=>observer.observe(v))}
function bind(){const form=app.querySelector('.filters');if(form){const apply=()=>{const q=form.elements.search.value.trim().toLowerCase(),cat=form.elements.discipline.value,yr=form.elements.year.value;const ps=projects.filter(p=>(!q||`${p.title} ${p.client}`.toLowerCase().includes(q))&&(!cat||p.filters.includes(cat))&&(!yr||p.year===yr));app.querySelector('#results').innerHTML=grid(ps,'archive-grid');app.querySelector('#result-count').textContent=`${ps.length} projects`;app.querySelector('.empty').hidden=ps.length>0;playback()};form.addEventListener('input',apply);form.addEventListener('submit',ev=>ev.preventDefault());form.addEventListener('reset',()=>requestAnimationFrame(apply))}initClientWheel()}
function render(ev){observer?.disconnect();videoControlCleanup.forEach(fn=>fn());videoControlCleanup=[];const hash=location.hash.slice(1),[route,...rest]=hash.split('/'),key=decodeURIComponent(rest.join('/'));let content;if(route==='project'){const p=projects.find(p=>p.id===key);content=p?project(p):'<main id="content"><h1>Project not found</h1><a href="#archive">View archive</a></main>'}else content=route==='archive'?archive():route==='index'?`<main id="content" class="index-page"><div class="page-heading"><h1>Index</h1><a href="#archive">Grid view ${arrow}</a></div>${list(projects)}</main>`:route==='clients'?clients(key):route==='contact'?contact():home();document.body.dataset.route=route||'work';app.innerHTML=nav()+content+footer();document.title=`3seater — ${direction.name}${route?' / '+route:''}`;window.scrollTo(0,0);const h=app.querySelector('h1');h?.setAttribute('tabindex','-1');if(ev)h?.focus({preventScroll:true});bind();playback()}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)app.querySelectorAll('video[src]').forEach(v=>v.play().catch(()=>{}))});addEventListener('pointerdown',()=>app.querySelectorAll('video[data-blocked]').forEach(startVideo),{passive:true});
Promise.all([fetch('/data.json').then(r=>r.json()),fetch('../site.json').then(r=>r.json()),fetch('../directions.json').then(r=>r.json())]).then(([data,s,dirs])=>{site=config=s;direction=dirs.find(d=>d.id===version);const order=site.homeProjectOrder||[];projects=data.projects.slice().sort((a,b)=>(order.indexOf(a.id)<0?99:order.indexOf(a.id))-(order.indexOf(b.id)<0?99:order.indexOf(b.id)));render();addEventListener('hashchange',render)}).catch(err=>{app.innerHTML='<main class="error"><h1>The archive could not load.</h1><button onclick="location.reload()">Reload</button></main>';console.error(err)});

  function clientWheelMarkup() {
    const preferred = ['2hollis', 'faze', 'pink-pantheress', 'busta-rhymes-young-thug', 'g-herbo', 'nba-youngboy', 'don-toliver', 'burna-boy', 'snoop-dogg', 'mlb'];
    const excluded = new Set((config.featuredClientExclusions || []).map(slug));
    const names = [...new Set([...preferred.map(id => projects.find(p => p.id === id)?.client).filter(Boolean), ...uniqueClients()])].filter(name => !excluded.has(slug(name)));
    if (!names.length) return '';
    return `<section class="client-wheel" aria-labelledby="wheel-heading"><div class="wheel-heading utility"><h2 id="wheel-heading">Featured clients</h2></div><div class="wheel-track"><div class="wheel-runway"><div class="client-wheel-sticky"><div class="wheel-stage"><div class="wheel-drum">${names.map(name => `<a class="wheel-name" href="${clientHref(name)}">${escape(name)}</a>`).join('')}</div></div></div></div></div></section>`;
  }
  function initClientWheel() {
    const section = main.querySelector('.client-wheel');
    if (!section) return;
    const track = section.querySelector('.wheel-track');
    const links = [...section.querySelectorAll('.wheel-name')];
    const stage = section.querySelector('.wheel-stage');
    const guideTrack = document.createElement('div');
    guideTrack.className = 'wheel-guide-track';
    guideTrack.setAttribute('aria-hidden', 'true');
    const guide = document.createElement('div');
    guide.className = 'wheel-guide';
    guideTrack.append(guide);
    track.append(guideTrack);
    const sideLabel = document.createElement('span');
    sideLabel.className = 'wheel-side-label utility';
    sideLabel.textContent = section.querySelector('.wheel-heading').textContent;
    sideLabel.setAttribute('aria-hidden', 'true');
    guide.append(sideLabel);
    const progressTrack = document.createElement('div');
    progressTrack.className = 'wheel-progress';
    progressTrack.setAttribute('aria-hidden', 'true');
    const progressFill = document.createElement('span');
    progressTrack.append(progressFill);
    guide.append(progressTrack);
    const hitbox = document.createElement('a');
    hitbox.className = 'wheel-hitbox';
    hitbox.tabIndex = -1;
    hitbox.setAttribute('aria-hidden', 'true');
    stage.append(hitbox);
    section.style.setProperty('--client-count', links.length);
    let frame = 0, settleTimer = 0;
    const typeMeasure = document.createElement('canvas').getContext('2d');
    const fitNames = () => {
      const radius = window.innerWidth >= 1240 ? 280 : window.innerWidth >= 1024 ? 240 : Math.min(210, window.innerHeight * .3);
      section.style.setProperty('--wheel-radius', `${radius}px`);
      const line = parseFloat(getComputedStyle(section).getPropertyValue('--wheel-line'));
      // Preserve the reference's scroll distance per degree with our longer list.
      const span = Math.max(0, links.length - 1) * 18 + 170;
      track.style.height = reduced.matches ? '' : `${Math.max(line, span / 368 * (12 * line + .7 * window.innerHeight) - .7 * window.innerHeight)}px`;
      typeMeasure.font = '400 100px Arial, Helvetica, sans-serif';
      links.forEach(link => {
        const label = link.textContent.toUpperCase();
        const width = typeMeasure.measureText(label).width - 3 * Math.max(0, label.length - 1);
        // Account for the forward cylinder's perspective magnification.
        const sideSpace = sideLabel.offsetWidth ? sideLabel.offsetWidth + 40 : stage.clientWidth * .02;
        link.style.setProperty('--name-fit', `${Math.max(1, stage.clientWidth - 2 * sideSpace) * (1 - radius / 1000) * 100 / Math.max(1, width)}px`);
      });
    };
    const paint = () => {
      frame = 0;
      const isStatic = reduced.matches;
      section.classList.toggle('is-static', isStatic);
      const viewport = window.innerHeight;
      const bounds = track.getBoundingClientRect();
      // Match the reference: the full-screen stage starts one viewport before
      // the section; rotation starts when its top has passed -30vh.
      const progress = Math.max(0, Math.min(1, (.7 * viewport - bounds.top) / (track.offsetHeight + .7 * viewport)));
      const lastAngle = Math.max(0, links.length - 1) * 18;
      const rotation = -80 + progress * (lastAngle + 170);
      const radius = parseFloat(getComputedStyle(section).getPropertyValue('--wheel-radius'));
      const inRange = bounds.top < viewport && bounds.bottom > -viewport * .05;
      section.classList.toggle('is-outside', !inRange && !isStatic);
      // A separate bounded sticky row enters, pins at the cylinder axis, then
      // releases with the section, like the reference's side arrows.
      const guideTop = guide.getBoundingClientRect().top;
      const reveal = Math.max(0, Math.min(1, (.85 * viewport - guideTop) / (.35 * viewport), guideTop / (.5 * viewport)));
      guide.style.opacity = isStatic ? '0' : `${reveal * reveal * (3 - 2 * reveal)}`;
      // The reference emphasizes the name just below the axis during its roll in.
      const active = Math.round((rotation + 30.32) / (lastAngle + 43.04) * Math.max(0, links.length - 1));
      progressFill.style.transform = `scaleY(${Math.max(0, Math.min(1, rotation / Math.max(18, lastAngle)))})`;
      links.forEach((link, i) => {
        const angle = i * 18 - rotation;
        const radians = angle * Math.PI / 180;
        // Use the forward half of one turn only, so >20 clients cannot overlap.
        const visible = isStatic || (Math.abs(angle) < 90 && inRange);
        const selected = visible && i === active;
        link.style.transform = `translate(-50%, -50%) translate3d(0, ${Math.sin(radians) * radius}px, ${Math.cos(radians) * radius}px) rotateX(${-angle}deg)`;
        link.style.visibility = visible ? 'visible' : 'hidden';
        link.classList.toggle('is-active', selected);
        link.tabIndex = isStatic || selected ? 0 : -1;
        if (isStatic || selected) link.removeAttribute('aria-hidden'); else link.setAttribute('aria-hidden', 'true');
      });
      const selected = links[active];
      hitbox.hidden = isStatic || !inRange || !selected;
      if (!hitbox.hidden) {
        const rect = selected.getBoundingClientRect();
        const origin = stage.getBoundingClientRect();
        hitbox.href = selected.href;
        hitbox.style.left = `${rect.left - origin.left - 8}px`;
        hitbox.style.top = `${rect.top - origin.top - 8}px`;
        hitbox.style.width = `${rect.width + 16}px`;
        hitbox.style.height = `${rect.height + 16}px`;
      }
    };
    const onScroll = () => {
      if (!reduced.matches) {
        section.classList.add('is-scrolling');
        clearTimeout(settleTimer);
        settleTimer = setTimeout(() => section.classList.remove('is-scrolling'), 140);
      }
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onResize = () => { fitNames(); paint(); };
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onResize);
    reduced.addEventListener('change', onResize);
    const sizeObserver = new ResizeObserver(onResize);
    sizeObserver.observe(main);
    onResize();
    videoControlCleanup.push(() => {
      clearTimeout(settleTimer);
      cancelAnimationFrame(frame); sizeObserver.disconnect();
      window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize);
      reduced.removeEventListener('change', onResize);
    });
  }


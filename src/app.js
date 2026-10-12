(() => {
  'use strict';
  const main = document.querySelector('#main');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const encode = encodeURIComponent;
  let projects = [], config = {}, observer, gridObserver;
  let density = 'grid', routeKey = '', lastListKey = '/', resizeTimer;
  const positions = new Map(), visibleVideos = new Set();
  const firstOrder = ['pink-pantheress', 'doji', 'yung-bans', '2hollis', 'don-toliver', 'polydupe', 'faze', 'personal-work', 'burna-boy', 'snoop-dogg', 'busta-rhymes-young-thug'];
  const allMedia = () => projects.reduce((n, p) => n + p.media.length, 0);
  const projectHref = p => `#/project/${encode(p.id)}`;
  const clientHref = name => {
    const matches = projects.filter(p => p.client === name);
    return matches.length === 1 ? projectHref(matches[0]) : `#/clients/${encode(slug(name))}`;
  };
  const uniqueClients = () => [...new Set(projects.map(p => p.client).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const yearRange = () => { const years = projects.map(p => p.year).filter(Boolean).sort(); return years.length ? `${years[0]}—${years.at(-1)}` : 'Ongoing'; };
  const numbered = n => String(n).padStart(2, '0');
  function route() {
    const raw = location.hash.slice(1) || '/';
    const url = new URL(raw, location.origin);
    return { path: url.pathname.split('/').filter(Boolean).map(decodeURIComponent), params: url.searchParams, key: raw };
  }
  function feedHref(category, year) {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.set('category', category);
    if (year) params.set('year', year);
    return `#/archive${params.size ? '?' + params.toString() : ''}`;
  }
  function cleanup() {
    observer?.disconnect(); gridObserver?.disconnect();
    main.querySelectorAll('video').forEach(v => { v.pause(); v.removeAttribute('src'); v.load(); });
    visibleVideos.clear();
  }
  function categories() {
    return ['All', ...new Set(projects.flatMap(p => p.categories))].sort((a, b) => a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b));
  }
  function filterBar(category, year) {
    const years = [...new Set(projects.map(p => p.year).filter(Boolean))].sort().reverse();
    return `<div class="archive-bar"><div class="filter-list" role="group" aria-label="Filter by category">${categories().map(c => `<button class="filter-button" data-category="${escape(c)}" aria-pressed="${c === category}">${escape(c === 'All' ? 'All work' : c)}</button>`).join('')}</div><div class="archive-tools"><details class="year-picker"><summary class="year-trigger" aria-label="Filter by year: ${escape(year || 'All years')}"><span>${escape(year || 'All years')}</span><svg width="10" height="6" viewBox="0 0 10 6" aria-hidden="true"><path d="m1 1 4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.2"/></svg></summary><div class="year-menu" aria-label="Filter by year">${['', ...years].map(y => `<a class="year-option" href="${escape(feedHref(category, y))}"${y === year ? ' aria-current="true"' : ''}><span>${escape(y || 'All years')}</span><span class="year-check" aria-hidden="true">${y === year ? '✓' : ''}</span></a>`).join('')}</div></details><div class="view-options" role="group" aria-label="Feed layout"><button class="view-button" data-density="wide" aria-label="Two column view" aria-pressed="${density === 'wide'}"><span class="grid-icon wide" aria-hidden="true"><i></i><i></i></span></button><button class="view-button" data-density="grid" aria-label="Dense grid view" aria-pressed="${density === 'grid'}"><span class="grid-icon" aria-hidden="true"><i></i><i></i><i></i><i></i></span></button></div></div></div>`;
  }
  function coverItems(list) {
    const ordered = [...list].sort((a,b) => (b.featured - a.featured) || ((firstOrder.indexOf(a.id) < 0 ? 99 : firstOrder.indexOf(a.id)) - (firstOrder.indexOf(b.id) < 0 ? 99 : firstOrder.indexOf(b.id))));
    return ordered.map(p => ({project: p, media: p.media[p.cover], index: p.cover}));
  }
  function tile(item, number) {
    const { project: p, media: m, index } = item;
    const label = `${p.title}${p.year ? ', ' + p.year : ''} — ${m.type === 'video' ? 'video' : 'image'} ${index + 1}`;
    return `<a class="work-tile" href="${projectHref(p)}?media=${index}" data-cursor="View" aria-label="${escape(label)}" style="--delay:${Math.min(number, 8) * 25}ms"><div class="tile-media" style="--ratio:${m.width}/${m.height}"><img src="${escape(m.poster)}" width="${m.width}" height="${m.height}" alt="${escape(p.title)} — ${escape(p.categories.join(', ') || 'work study')}" loading="${number < 4 ? 'eager' : 'lazy'}" decoding="async">${m.type === 'video' ? `<video data-preview="${escape(m.preview)}" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video><span class="media-count" aria-hidden="true">↗ MOTION / ${numbered(index + 1)}</span>` : ''}<span class="tile-open" aria-hidden="true">↗</span></div><div class="tile-caption"><span>${escape(p.title)}</span>${p.year ? `<span class="year"> — ${escape(p.year)}</span>` : ''}</div>${p.categories.length ? `<div class="tile-category">${escape(p.categories.join(' / '))}</div>` : ''}</a>`;
  }
  function buildGrid(items) {
    const grid = document.querySelector('#feed-grid');
    if (!grid) return;
    observer?.disconnect(); visibleVideos.clear();
    grid.querySelectorAll('video').forEach(v => { v.pause(); v.removeAttribute('src'); v.load(); });
    const count = window.innerWidth <= 700 ? 2 : density === 'wide' ? 2 : window.innerWidth <= 1050 ? 3 : 4;
    grid.classList.toggle('wide', density === 'wide');
    const columns = Array.from({ length: count }, () => []), heights = Array(count).fill(0);
    items.forEach((item, i) => {
      const column = heights.indexOf(Math.min(...heights));
      columns[column].push(tile(item, i));
      heights[column] += item.media.height / item.media.width + 0.18;
    });
    grid.innerHTML = columns.map(c => `<div class="feed-column">${c.join('')}</div>`).join('');
    initVideos();
  }
  function initVideos() {
    const videos = main.querySelectorAll('video[data-preview]');
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visibleVideos.add(entry.target);
        else { visibleVideos.delete(entry.target); entry.target.pause(); }
      }
      updatePlayback();
    }, { threshold: .2 });
    videos.forEach(v => observer.observe(v));
  }
  function updatePlayback() {
    const canPlay = !document.hidden && !reduced.matches && !navigator.connection?.saveData;
    for (const video of visibleVideos) {
      if (canPlay) {
        if (!video.src) video.src = video.dataset.preview;
        video.muted = true;
        video.play().then(() => video.classList.add('playing')).catch(() => video.classList.remove('playing'));
      } else video.pause();
    }
  }
  function renderFeed(params, archive = false) {
    const category = archive ? params.get('category') || 'All' : 'All', year = archive ? params.get('year') || '' : '';
    const list = projects.filter(p => (category === 'All' || p.categories.includes(category)) && (!year || p.year === year));
    const items = coverItems(list);
    main.innerHTML = `<h1 class="sr-only">${archive ? 'All work' : '3seater — Selected works'}</h1>${archive ? filterBar(category, year) : ''}<div class="feed-label mono"><span>${archive ? 'Archive' : 'Selected work — Archive'}</span>${archive ? `<span aria-live="polite">${numbered(list.length)} projects</span>` : '<a href="#/archive">All work / filter →</a>'}</div>${items.length ? '<section id="feed-grid" class="feed-grid home-feed" aria-label="Work archive"></section>' : '<div class="empty-state"><h2>No work in this selection.</h2><button id="reset-filters" class="mono">View all work ↗</button></div>'}${!archive && items.length ? `<section class="home-index" aria-label="Selected projects"><div class="home-index-heading"><span>Index — Selected projects</span><a href="#/index">Full index →</a></div>${items.slice(0, 8).map(({project: p}) => `<a class="home-index-row" href="${projectHref(p)}" data-cursor="View"><span>${escape(p.title)}${p.categories.length ? ' — ' + escape(p.categories.join(' / ')) : ''}</span><span class="index-year">${escape(p.year)}</span><span class="index-view">View</span></a>`).join('')}</section>` : ''}`;
    buildGrid(items);
    main.querySelectorAll('[data-category]').forEach(b => b.addEventListener('click', () => { location.hash = feedHref(b.dataset.category, year); }));
    main.querySelectorAll('.year-option').forEach(link => link.addEventListener('click', () => {
      main.querySelector('.year-picker').open = false;
    }));
    main.querySelectorAll('[data-density]').forEach(b => b.addEventListener('click', () => {
      density = b.dataset.density;
      main.querySelectorAll('[data-density]').forEach(btn => btn.setAttribute('aria-pressed', btn.dataset.density === density));
      buildGrid(items);
    }));
    main.querySelector('#reset-filters')?.addEventListener('click', () => { location.hash = '/archive'; });
    gridObserver = { disconnect() { window.removeEventListener('resize', resize); } };
    let previousCount = window.innerWidth <= 700 ? 2 : window.innerWidth <= 1050 ? 3 : 4;
    function resize() {
      clearTimeout(resizeTimer); resizeTimer = setTimeout(() => {
        const count = window.innerWidth <= 700 ? 2 : window.innerWidth <= 1050 ? 3 : 4;
        if (count !== previousCount) { previousCount = count; buildGrid(items); }
      }, 150);
    }
    window.addEventListener('resize', resize);
  }
  function indexRow(p) {
    return `<a class="directory-row" href="${projectHref(p)}" data-cursor="View"><span class="directory-name">${escape(p.title)}</span>${p.year ? ` <span class="directory-year">${escape(p.year)}</span>` : ''}<span class="index-inline-preview" aria-hidden="true">${p.media[p.cover].type === 'video' ? `<video data-preview="${escape(p.media[p.cover].preview)}" poster="${escape(p.media[p.cover].poster)}" muted loop playsinline preload="none" tabindex="-1"></video>` : `<img data-src="${escape(p.media[p.cover].poster)}" alt="" width="${p.media[p.cover].width}" height="${p.media[p.cover].height}">`}</span></a>`;
  }
  function renderIndex() {
    const labels = [...new Set(projects.flatMap(p => p.categories))].sort((a,b) => a.localeCompare(b));
    const groups = labels.map(label => ({label, projects: projects.filter(p => p.categories.includes(label))}));
    const uncategorized = projects.filter(p => !p.categories.length);
    if (uncategorized.length) groups.push({ label: 'Other work', projects: uncategorized });
    main.innerHTML = `<h1 class="sr-only">Project index</h1><div class="project-index">${groups.map(group => `<section class="directory-section"><h2 class="directory-label">${escape(group.label)} <span>(${numbered(group.projects.length)})</span></h2><div>${group.projects.map(indexRow).join('')}</div></section>`).join('')}</div>`;
    main.querySelectorAll('.directory-row').forEach(row => {
      const showPreview = () => {
        if (!window.matchMedia('(hover: hover)').matches) return;
        const img = row.querySelector('.index-inline-preview img');
        if (img && !img.src) img.src = img.dataset.src;
        const video = row.querySelector('video');
        if (video) { visibleVideos.add(video); updatePlayback(); }
        const rect = row.getBoundingClientRect();
        const width = Math.min(360, window.innerWidth - 40);
        const left = Math.max(20 - rect.left, Math.min(rect.width - 24, window.innerWidth - rect.left - width - 20));
        row.style.setProperty('--preview-left', `${left}px`);
      };
      row.addEventListener('pointerenter', showPreview);
      row.addEventListener('focus', showPreview);
      const hidePreview = () => {
        if (row.matches(':hover,:focus-visible')) return;
        const video = row.querySelector('video');
        if (video) { visibleVideos.delete(video); video.pause(); }
      };
      row.addEventListener('pointerleave', hidePreview);
      row.addEventListener('blur', hidePreview);
    });
  }
  function renderClients(clientSlug) {
    const clients = uniqueClients();
    if (clientSlug) {
      const name = clients.find(c => slug(c) === clientSlug);
      if (!name) return renderMissing();
      const list = projects.filter(p => p.client === name), items = coverItems(list);
      main.innerHTML = `<a class="back-link mono" href="#/info">← Back to info</a><div class="page-heading client-view-heading"><h1>${escape(name)}</h1></div><section id="feed-grid" class="feed-grid" aria-label="Work for ${escape(name)}"></section>`;
      buildGrid(items);
      const resize = () => {clearTimeout(resizeTimer); resizeTimer = setTimeout(() => buildGrid(items), 150);};
      window.addEventListener('resize', resize); gridObserver = {disconnect() {window.removeEventListener('resize', resize);}};
      return;
    }
    return renderInfo();
  }
  function renderProject(id, params) {
    const p = projects.find(x => x.id === id); if (!p) return renderMissing();
    document.title = `${p.title} — 3seater`;
    const number = projects.indexOf(p), next = projects[(number + 1) % projects.length];
    const back = lastListKey;
    const rows = [[ 'Year', escape(p.year)], ['Client', p.client ? `<a href="${clientHref(p.client)}">${escape(p.client)} ↗</a>` : ''], ['Category', p.categories.map(c => `<a href="${escape(feedHref(c, ''))}">${escape(c)}</a>`).join(', ')], ['Role', escape(p.role)]];
    main.innerHTML = `<a class="back-link mono" href="#${escape(back)}">← Back to archive</a><div class="project-layout"><aside class="project-info"><h1>${escape(p.title)}</h1><dl class="project-meta">${rows.filter(([,v]) => v).map(([key,v]) => `<div><dt>${key}</dt><dd>${v}</dd></div>`).join('')}</dl>${p.description ? `<p class="project-description">${escape(p.description)}</p>` : ''}</aside><section class="project-media${p.media.length >= 4 ? ' project-media-grid' : ''}" aria-label="${escape(p.title)} media">${p.media.map((m, i) => `<figure id="media-${i}">${m.type === 'video' ? `<video autoplay muted loop playsinline preload="metadata" data-preview="${escape(m.src)}" poster="${escape(m.poster)}" src="${escape(m.src)}" width="${m.width}" height="${m.height}" aria-label="${escape(p.title)}, video ${i + 1}"></video>` : `<a href="${escape(m.src)}" target="_blank" rel="noopener" data-cursor="Open"><img src="${escape(m.src)}" width="${m.width}" height="${m.height}" alt="${escape(p.title)}, image ${i + 1}" loading="${i === 0 ? 'eager' : 'lazy'}"></a>`}</figure>`).join('')}</section></div><a class="project-next" href="${projectHref(next)}" data-cursor="Next"><span class="mono">Next project</span><strong>${escape(next.title)} ↗</strong></a>`;
    initVideos();
  }
  function renderInfo() {
    main.innerHTML = `<div class="page-heading"><h1>Info</h1></div><div class="info-layout"><span class="mono">3SEATER</span><div class="info-copy"><p>Graphic design, motion design, and 3D.</p></div></div><section class="info-layout info-clients" aria-labelledby="selected-clients"><h2 class="mono" id="selected-clients">Selected clients</h2><ul class="info-client-list">${uniqueClients().map(name => `<li><a href="${clientHref(name)}">${escape(name)} <span aria-hidden="true">↗</span></a></li>`).join('')}</ul></section>`;
  }
  function renderContact() {
    const contact = document.querySelector('#contact-footer');
    const email = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(config.email || '') ? config.email : '';
    const socials = [...(Array.isArray(config.socials) ? config.socials : [])];
    if (config.instagram) socials.unshift({label:'Instagram',url:config.instagram});
    const links = socials.filter(s => s.label && /^https:\/\//.test(s.url || ''));
    contact.hidden = !email && !links.length;
    contact.innerHTML = `<div class="mono contact-label">GET IN TOUCH</div>${email ? `<a class="contact-email" href="mailto:${escape(email)}">${escape(email)}</a>` : ''}<div class="contact-socials">${links.map(s => `<a href="${escape(s.url)}" target="_blank" rel="noopener">${escape(s.label)} ↗</a>`).join('')}</div>`;
  }
  function renderMissing() {main.innerHTML = '<div class="empty-state"><h2>This collection isn’t here.</h2><a class="mono" href="#/">Back to the archive ↗</a></div>';}
  function render() {
    const {path, params, key} = route();
    if (routeKey) positions.set(routeKey, window.scrollY);
    cleanup(); routeKey = key;
    main.classList.toggle('archive-page', path[0] === 'archive');
    document.title = '3seater — Visual archive';
    const section = path[0] || 'feed';
    if (section !== 'project') lastListKey = key;
    document.querySelectorAll('[data-nav]').forEach(a => {
      if (a.dataset.nav === (section === 'project' ? 'feed' : section === 'clients' ? 'info' : section)) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (!path.length) renderFeed(params);
    else if (section === 'archive') renderFeed(params, true);
    else if (section === 'index') renderIndex();
    else if (section === 'clients') renderClients(path[1]);
    else if (section === 'project') renderProject(path[1], params);
    else if (section === 'info') renderInfo(); else renderMissing();
    const position = positions.get(key) || 0;
    window.scrollTo({top: position, behavior: 'instant'});
    if (section === 'project' && params.has('media') && !positions.has(key)) {
      const index = Number(params.get('media'));
      if (Number.isInteger(index) && index > 0) requestAnimationFrame(() => document.getElementById(`media-${index}`)?.scrollIntoView({behavior:'instant', block:'start'}));
    }
    // Route changes also have a sensible keyboard focus destination.
    main.focus({preventScroll:true});
  }
  document.querySelector('#back-top').addEventListener('click', () => window.scrollTo({top:0,behavior:reduced.matches ? 'instant' : 'smooth'}));
  document.querySelector('.skip-link').addEventListener('click', e => {e.preventDefault();main.focus();main.scrollIntoView({behavior:'instant'});});
  document.addEventListener('pointerdown', e => {
    const picker = main.querySelector('.year-picker[open]');
    if (picker && !picker.contains(e.target)) picker.open = false;
  });
  document.addEventListener('keydown', e => {
    const picker = main.querySelector('.year-picker[open]');
    if (e.key === 'Escape' && picker) {
      picker.open = false;
      picker.querySelector('summary').focus();
    }
  });
  main.addEventListener('focusout', e => {
    const picker = main.querySelector('.year-picker[open]');
    if (picker && e.relatedTarget && !picker.contains(e.relatedTarget)) picker.open = false;
  });
  document.addEventListener('visibilitychange', () => {
    updatePlayback(); if (document.hidden) main.querySelectorAll('video').forEach(v => v.pause());
  });
  reduced.addEventListener('change', updatePlayback);
  history.scrollRestoration = 'manual';
  Promise.all([fetch('data.json').then(r => {if (!r.ok) throw new Error('Archive data unavailable'); return r.json();}), fetch('site.json').then(r => r.json())]).then(([data, settings]) => {
    projects = data.projects; config = settings;
    render(); renderContact(); window.addEventListener('hashchange', render);
  }).catch(error => {main.innerHTML = `<div class="empty-state"><h2>The archive couldn’t load.</h2><p>Please refresh to try again.</p></div>`; console.error(error);});
})();

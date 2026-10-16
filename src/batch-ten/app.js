(() => {
  'use strict';
  const main = document.querySelector('#main');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const stopSmoothScroll = initSmoothScroll();
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const encode = encodeURIComponent;
  let projects = [], config = {}, observer, gridObserver;
  let density = 'grid', routeKey = '', lastListKey = '/', resizeTimer;
  const positions = new Map(), visibleVideos = new Set();
  const videoControlCleanup = [];
  let projectCursorCleanup;
  const firstOrder = ['2hollis', 'faze', 'busta-rhymes-young-thug', 'pink-pantheress', 'personal-work-iceman', 'personal-work-coded', 'g-herbo', 'personal-work-playboi-carti', 'nba-youngboy', 'personal-work-yeat', 'doji', 'yung-bans', 'don-toliver', 'polydupe', 'burna-boy', 'snoop-dogg'];
  const allMedia = () => projects.reduce((n, p) => n + p.media.length, 0);
  const projectHref = p => `#/project/${encode(p.id)}`;
  const clientHref = name => `#/clients/${encode(slug(name))}`;
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
    stopSmoothScroll();
    projectCursorCleanup?.();
    videoControlCleanup.splice(0).forEach(dispose => dispose());
    observer?.disconnect(); gridObserver?.disconnect();
    main.querySelectorAll('video').forEach(v => { v.pause(); v.removeAttribute('src'); v.load(); });
    visibleVideos.clear();
  }
  function initSmoothScroll() {
    let frame = 0, target = window.scrollY, current = target, written = target, previous = 0, direction = 0;
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0; previous = 0; direction = 0;
      target = current = written = window.scrollY;
    };
    const limit = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const tick = time => {
      const dt = Math.min(64, time - previous || 16);
      previous = time;
      target = Math.max(0, Math.min(limit(), target));
      const distance = target - current;
      current = Math.abs(distance) < .75 ? target : current + distance * (1 - Math.exp(-dt / 90));
      window.scrollTo({top: current, behavior: 'instant'});
      written = window.scrollY;
      if (Math.abs(target - written) < 1) { stop(); return; }
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener('wheel', event => {
      if (reduced.matches || event.defaultPrevented || !event.cancelable || event.ctrlKey || event.metaKey || event.shiftKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
      // Let nested scrollers, form controls and native media keep their own input.
      for (const element of event.composedPath()) {
        if (!(element instanceof Element) || element === document.body || element === document.documentElement) continue;
        if (element.matches('input, textarea, select, [contenteditable], video[controls], [data-native-scroll]')) { stop(); return; }
        if (element.scrollHeight > element.clientHeight + 1 && /auto|scroll/.test(getComputedStyle(element).overflowY)) { stop(); return; }
      }
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
      if (!delta) return;
      const nextDirection = Math.sign(delta);
      if (!frame || nextDirection !== direction) target = current = window.scrollY;
      direction = nextDirection;
      target = Math.max(0, Math.min(limit(), target + delta));
      event.preventDefault();
      if (!frame) { previous = performance.now(); frame = requestAnimationFrame(tick); }
    }, {passive:false});
    // Keyboard, scrollbar dragging, anchors and route restoration can interrupt.
    window.addEventListener('scroll', () => { if (frame && Math.abs(window.scrollY - written) > 2) stop(); }, {passive:true});
    window.addEventListener('pointerdown', stop, {passive:true});
    window.addEventListener('touchstart', stop, {passive:true});
    window.addEventListener('resize', stop, {passive:true});
    window.addEventListener('hashchange', stop);
    document.addEventListener('keydown', event => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) stop();
    });
    document.addEventListener('visibilitychange', stop);
    reduced.addEventListener('change', stop);
    return stop;
  }
  function categories() {
    return ['All', ...new Set(projects.flatMap(p => p.categories))].sort((a, b) => a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b));
  }
  function projectYears(project) {
    const match = String(project.year || '').trim().match(/^(\d{4})(?:\s*[-–—]\s*(\d{4}))?$/);
    if (!match) return [];
    const start = Number(match[1]), end = Number(match[2] || match[1]);
    return Array.from({length: Math.max(0, end - start + 1)}, (_, i) => String(start + i));
  }
  function filterBar(category, year) {
    const years = [...new Set(projects.flatMap(projectYears))].sort().reverse();
    return `<div class="archive-bar"><div class="filter-list" role="group" aria-label="Filter by category">${categories().map(c => `<button class="filter-button" data-category="${escape(c)}" aria-pressed="${c === category}">${escape(c === 'All' ? 'All work' : c)}</button>`).join('')}</div><div class="archive-tools"><details class="year-picker"><summary class="year-trigger" aria-label="Filter by year: ${escape(year || 'All years')}"><span>${escape(year || 'All years')}</span><svg width="10" height="6" viewBox="0 0 10 6" aria-hidden="true"><path d="m1 1 4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.2"/></svg></summary><div class="year-menu" aria-label="Filter by year">${['', ...years].map(y => `<a class="year-option" href="${escape(feedHref(category, y))}"${y === year ? ' aria-current="true"' : ''}><span>${escape(y || 'All years')}</span><span class="year-check" aria-hidden="true">${y === year ? '✓' : ''}</span></a>`).join('')}</div></details><div class="view-options" role="group" aria-label="Feed layout"><button class="view-button" data-density="wide" aria-label="Two column view" aria-pressed="${density === 'wide'}"><span class="grid-icon wide" aria-hidden="true"><i></i><i></i></span></button><button class="view-button" data-density="grid" aria-label="Dense grid view" aria-pressed="${density === 'grid'}"><span class="grid-icon" aria-hidden="true"><i></i><i></i><i></i><i></i></span></button></div></div></div>`;
  }
  function coverItems(list) {
    const ordered = [...list].sort((a,b) => (b.featured - a.featured) || ((firstOrder.indexOf(a.id) < 0 ? 99 : firstOrder.indexOf(a.id)) - (firstOrder.indexOf(b.id) < 0 ? 99 : firstOrder.indexOf(b.id))));
    if (!route().path.length) {
      const priorities = new Map((config.homeProjectOrder || []).map((id, index) => [id, index]));
      ordered.sort((a, b) => (priorities.get(a.id) ?? priorities.size) - (priorities.get(b.id) ?? priorities.size));
    }
    return ordered.map(p => ({project: p, media: p.media[p.cover], index: p.cover}));
  }
  const projectTitleMarkup = title => escape(title).replace(/(\s+[-–—]\s+)/g, '<span class="title-separator">$1</span>');
  function tile(item, number) {
    const { project: p, media: m, index } = item;
    const label = `${p.title}${p.year ? ', ' + p.year : ''} — ${m.type === 'video' ? 'video' : 'image'} ${index + 1}`;
    return `<a class="work-tile" href="${projectHref(p)}?media=${index}" data-cursor="View" aria-label="${escape(label)}" style="--delay:${Math.min(number, 8) * 25}ms"><div class="tile-media" style="--ratio:${m.width}/${m.height}"><img src="${escape(m.poster)}" width="${m.width}" height="${m.height}" alt="${escape(p.title)} — ${escape(p.categories.join(', ') || 'work study')}" loading="${number < 4 ? 'eager' : 'lazy'}" decoding="async">${m.type === 'video' ? `<video data-preview="${escape(m.src)}" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video>` : ''}<span class="tile-open" aria-hidden="true">↗</span></div><div class="tile-caption"><span class="tile-title">${projectTitleMarkup(p.title)}</span>${p.year ? `<span class="year"> — ${escape(p.year)}</span>` : ''}</div></a>`;
  }
  function buildGrid(items) {
    projectCursorCleanup?.();
    const grid = document.querySelector('#feed-grid');
    if (!grid) return;
    observer?.disconnect(); visibleVideos.clear();
    grid.querySelectorAll('video').forEach(v => { v.pause(); v.removeAttribute('src'); v.load(); });
    grid.classList.toggle('wide', density === 'wide');
    const masonry = route().path.length === 0;
    grid.classList.toggle('masonry', masonry);
    grid.style.removeProperty('grid-template-columns');
    if (masonry) {
      const count = window.innerWidth <= 700 ? 2 : density === 'wide' ? 2 : window.innerWidth <= 1050 ? 3 : window.innerWidth <= 1200 ? 4 : 5;
      const columns = Array.from({length: count}, () => []), heights = Array(count).fill(0);
      items.forEach((item, i) => {
        const column = heights.indexOf(Math.min(...heights));
        columns[column].push(tile(item, i));
        heights[column] += item.media.height / item.media.width + 0.18;
      });
      grid.innerHTML = columns.map(column => `<div class="feed-column">${column.join('')}</div>`).join('');
      alignMasonryBottom(grid);
    } else {
      grid.innerHTML = items.map((item, i) => tile(item, i)).join('');
    }
    initVideos();
    if (masonry) initProjectCursor(grid);
  }
  function alignMasonryBottom(grid) {
    if (!grid?.classList.contains('masonry')) return;
    const columns = [...grid.querySelectorAll('.feed-column')];
    if (!columns.length || columns.some(column => !column.children.length)) return;
    grid.style.removeProperty('grid-template-columns');
    const captions = [...grid.querySelectorAll('.tile-caption')];
    captions.forEach(caption => { caption.style.minHeight = ''; });
    const gap = parseFloat(getComputedStyle(grid).columnGap) || 0;
    const available = grid.clientWidth - gap * (columns.length - 1);
    if (available <= 0) return;
    // Solve width × total aspect ratio + caption/gap space = one shared bottom.
    // Re-measure wrapping as widths change; retain caption space to avoid oscillation.
    for (let pass = 0; pass < 8; pass++) {
      captions.forEach(caption => {
        caption.style.minHeight = `${caption.getBoundingClientRect().height}px`;
      });
      const metrics = columns.map(column => {
        const media = [...column.querySelectorAll('.tile-media')];
        const ratio = media.reduce((sum, item) => {
          const image = item.querySelector('img');
          return sum + Number(image.getAttribute('height')) / Number(image.getAttribute('width'));
        }, 0);
        const mediaHeight = media.reduce((sum, item) => sum + item.getBoundingClientRect().height, 0);
        const lastCaption = column.lastElementChild.querySelector('.tile-caption').getBoundingClientRect().height;
        return {ratio, offset:column.getBoundingClientRect().height - mediaHeight - lastCaption};
      });
      const baseline = (available + metrics.reduce((sum, item) => sum + item.offset / item.ratio, 0)) /
        metrics.reduce((sum, item) => sum + 1 / item.ratio, 0);
      const widths = metrics.map(item => (baseline - item.offset) / item.ratio);
      if (widths.some(width => !Number.isFinite(width) || width <= 0)) break;
      const settled = columns.every((column, index) => Math.abs(column.getBoundingClientRect().width - widths[index]) < .05);
      grid.style.gridTemplateColumns = widths.map(width => `${width}px`).join(' ');
      if (settled) break;
    }
  }
  function initProjectCursor(grid) {
    const orb = document.createElement('span');
    orb.className = 'audio-orb project-orb';
    orb.setAttribute('aria-hidden', 'true');
    orb.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 18 18 6M6 6h12v12"/></svg>';
    document.body.append(orb);
    const dispose = bindCursor(grid, orb);
    projectCursorCleanup = () => { dispose(); orb.remove(); projectCursorCleanup = undefined; };
  }
  // Follow beyond the hit area while the orb shrinks and fades.
  function bindCursor(area, orb, local = false) {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let frame = 0, active = false, fadingUntil = 0;
    let x = 0, y = 0, targetX = 0, targetY = 0, previousTime = 0;
    const draw = () => {
      const rect = local ? area.getBoundingClientRect() : {left:0, top:0};
      orb.style.left = `${x - rect.left}px`; orb.style.top = `${y - rect.top}px`;
    };
    const tick = time => {
      const amount = reduced.matches ? 1 : 1 - Math.exp(-Math.min(time - previousTime || 16, 64) / 75);
      previousTime = time;
      x += (targetX - x) * amount; y += (targetY - y) * amount;
      draw();
      frame = time < fadingUntil || Math.abs(targetX - x) + Math.abs(targetY - y) > .2 ? requestAnimationFrame(tick) : 0;
      if (!frame && !active && local) {
        orb.style.removeProperty('left'); orb.style.removeProperty('top');
      }
    };
    const schedule = () => {
      if (!frame) { previousTime = performance.now(); frame = requestAnimationFrame(tick); }
    };
    const reset = () => {
      if (!active) return;
      active = false;
      fadingUntil = performance.now() + (reduced.matches ? 0 : 240);
      area.classList.remove('is-tracking'); orb.classList.remove('is-tracking');
      schedule();
    };
    const move = event => {
      if (!finePointer.matches || event.pointerType === 'touch') { reset(); return; }
      const inside = area.contains(event.target);
      if (!inside && !active && performance.now() >= fadingUntil) return;
      targetX = event.clientX; targetY = event.clientY;
      if (inside && !active) {
        if (performance.now() >= fadingUntil) { x = targetX; y = targetY; draw(); }
        active = true; fadingUntil = 0;
        area.classList.add('is-tracking'); orb.classList.add('is-tracking');
      } else if (!inside) reset();
      schedule();
    };
    document.addEventListener('pointermove', move);
    area.addEventListener('pointerleave', reset);
    area.addEventListener('pointercancel', reset);
    window.addEventListener('scroll', reset, {passive:true});
    window.addEventListener('blur', reset);
    document.addEventListener('visibilitychange', reset);
    finePointer.addEventListener('change', reset);
    return () => {
      cancelAnimationFrame(frame);
      area.classList.remove('is-tracking'); orb.classList.remove('is-tracking');
      document.removeEventListener('pointermove', move);
      area.removeEventListener('pointerleave', reset);
      area.removeEventListener('pointercancel', reset);
      window.removeEventListener('scroll', reset);
      window.removeEventListener('blur', reset);
      document.removeEventListener('visibilitychange', reset);
      finePointer.removeEventListener('change', reset);
    };
  }
  function initVideos() {
    const videos = main.querySelectorAll('video[data-preview]');
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visibleVideos.add(entry.target);
        else { /* Keep initialized previews looping. */ }
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
        if (!video.closest('.project-media')) video.muted = true;
        video.play().then(() => video.classList.add('playing')).catch(() => video.classList.remove('playing'));
      } else video.pause();
    }
  }
  function renderFeed(params, archive = false) {
    const category = archive ? params.get('category') || 'All' : 'All', year = archive ? params.get('year') || '' : '';
    const list = projects.filter(p => (category === 'All' || p.categories.includes(category)) && (!year || projectYears(p).includes(year)));
    const items = coverItems(list);
    main.innerHTML = `<h1 class="sr-only">${archive ? 'All work' : '3seater — Selected works'}</h1>${archive ? filterBar(category, year) : ''}<div class="feed-label utility"><span>${archive ? 'Archive' : 'Selected work — Archive'}</span>${archive ? `<span aria-live="polite">${numbered(list.length)} projects</span>` : '<a href="#/archive">All work / filter →</a>'}</div>${items.length ? '<section id="feed-grid" class="feed-grid home-feed" aria-label="Work archive"></section>' : '<div class="empty-state"><h2>No work in this selection.</h2><button id="reset-filters" class="utility">View all work ↗</button></div>'}${!archive && items.length ? selectedProjectsMarkup(list) + clientWheelMarkup() : ''}`;
    buildGrid(items);
    if (!archive) initClientWheel();
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
    gridObserver = { disconnect() { clearTimeout(resizeTimer); window.removeEventListener('resize', resize); } };
    let previousCount = window.innerWidth <= 700 ? 2 : window.innerWidth <= 1050 ? 3 : window.innerWidth <= 1200 ? 4 : 5;
    function resize() {
      clearTimeout(resizeTimer); resizeTimer = setTimeout(() => {
        const count = window.innerWidth <= 700 ? 2 : window.innerWidth <= 1050 ? 3 : window.innerWidth <= 1200 ? 4 : 5;
        if (count !== previousCount) { previousCount = count; buildGrid(items); }
        else alignMasonryBottom(main.querySelector('#feed-grid'));
      }, 150);
    }
    window.addEventListener('resize', resize);
  }
  function selectedProjectsMarkup(list) {
    return `<section class="selected-projects" aria-label="Selected projects"><div class="selected-heading"><h2>Selected projects</h2><a href="#/index">Full index ↗</a></div>${coverItems(list).slice(0,7).map(({project:p,media:m},i)=>{const words=p.title.split(' '),pos=[words.length,Math.ceil(words.length/2),0][i%3];const thumb=m.type==='video'?`<span class="selected-video"><img src="${escape(m.poster)}" alt="" width="${m.width}" height="${m.height}"><video data-preview="${escape(m.src)}" muted loop playsinline preload="none" aria-label="${escape(p.title)}"></video></span>`:`<span class="selected-video"><img src="${escape(m.src)}" alt="" width="${m.width}" height="${m.height}"></span>`;return `<a class="selected-row" href="${projectHref(p)}"><span>${escape(words.slice(0,pos).join(' '))} ${thumb} ${escape(words.slice(pos).join(' '))}</span></a>`}).join('')}</section>`;
  }
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
      typeMeasure.font = '400 100px Anton';
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

  function indexRow(p) {
    return `<a class="directory-row" href="${projectHref(p)}" data-cursor="View"><span class="directory-name">${projectTitleMarkup(p.title)}</span>${p.year ? ` <span class="directory-year">${escape(p.year)}</span>` : ''}<span class="index-inline-preview" aria-hidden="true">${p.media[p.cover].type === 'video' ? `<video data-preview="${escape(p.media[p.cover].preview)}" poster="${escape(p.media[p.cover].poster)}" muted loop playsinline preload="none" tabindex="-1"></video>` : `<img data-src="${escape(p.media[p.cover].poster)}" alt="" width="${p.media[p.cover].width}" height="${p.media[p.cover].height}">`}</span></a>`;
  }
  function renderIndex() {
    const labels = [...new Set(projects.flatMap(p => p.categories))].sort((a,b) => a.localeCompare(b));
    const groups = labels.map(label => ({label, projects: projects.filter(p => p.categories.includes(label))}));
    const uncategorized = projects.filter(p => !p.categories.length);
    if (uncategorized.length) groups.push({ label: 'Other work', projects: uncategorized });
    main.innerHTML = `<h1 class="sr-only">Project index</h1><div class="project-index">${groups.map(group => `<section class="directory-section"><h2 class="directory-label">${escape(group.label)}</h2><div>${group.projects.map(indexRow).join('')}</div></section>`).join('')}</div>`;
    let previewRow = null, previewFrame = 0;
    const positionPreview = row => {
      const rect = row.getBoundingClientRect();
      const width = Math.min(360, window.innerWidth - 40);
      const left = Math.max(20 - rect.left, Math.min(rect.width - 24, window.innerWidth - rect.left - width - 20));
      const safeTop = Math.max(20, document.querySelector('.site-header').getBoundingClientRect().bottom + 20);
      row.querySelector('.index-inline-preview').style.visibility = rect.bottom > safeTop && rect.top < window.innerHeight - 20 ? '' : 'hidden';
      const height = Math.min(300, Math.max(0, window.innerHeight - safeTop - 20));
      const top = Math.max(safeTop, Math.min(rect.top + rect.height / 2 - height / 2, window.innerHeight - height - 20));
      row.style.setProperty('--preview-left', `${left}px`);
      row.style.setProperty('--preview-top', `${top - rect.top}px`);
      row.style.setProperty('--preview-height', `${height}px`);
    };
    const repositionPreview = () => {
      if (!previewRow || previewFrame) return;
      previewFrame = requestAnimationFrame(() => {
        previewFrame = 0;
        if (previewRow) positionPreview(previewRow);
      });
    };
    window.addEventListener('scroll', repositionPreview, {passive:true});
    window.addEventListener('resize', repositionPreview);
    videoControlCleanup.push(() => {
      cancelAnimationFrame(previewFrame);
      window.removeEventListener('scroll', repositionPreview);
      window.removeEventListener('resize', repositionPreview);
    });
    main.querySelectorAll('.directory-row').forEach(row => {
      const showPreview = () => {
        if (!window.matchMedia('(hover: hover)').matches) return;
        const img = row.querySelector('.index-inline-preview img');
        if (img && !img.src) img.src = img.dataset.src;
        const video = row.querySelector('video');
        if (video) { visibleVideos.add(video); updatePlayback(); }
        previewRow = row;
        positionPreview(row);
      };
      row.addEventListener('pointerenter', showPreview);
      row.addEventListener('focus', showPreview);
      const hidePreview = () => {
        if (row.matches(':hover,:focus-visible')) return;
        if (previewRow === row) previewRow = null;
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
      main.innerHTML = `<a class="back-link utility" href="#/">← Back to selected works</a><div class="page-heading client-view-heading"><h1>${escape(name)}</h1></div><section id="feed-grid" class="feed-grid" aria-label="Work for ${escape(name)}"></section>`;
      buildGrid(items);
      const resize = () => {clearTimeout(resizeTimer); resizeTimer = setTimeout(() => buildGrid(items), 150);};
      window.addEventListener('resize', resize); gridObserver = {disconnect() {window.removeEventListener('resize', resize);}};
      return;
    }
    return renderFeed(new URLSearchParams());
  }
  function youtubeEmbedUrl(link) {
    try {
      const url = new URL(link);
      if (!['https:', 'http:'].includes(url.protocol)) return '';
      const host = url.hostname.toLowerCase().replace(/^www\./, '');
      const parts = url.pathname.split('/').filter(Boolean);
      const id = host === 'youtu.be' ? parts[0] : ['youtube.com', 'm.youtube.com', 'youtube-nocookie.com'].includes(host) ? (url.pathname === '/watch' ? url.searchParams.get('v') : ['embed', 'shorts'].includes(parts[0]) ? parts[1] : '') : '';
      return /^[\w-]{11}$/.test(id || '') ? `https://www.youtube-nocookie.com/embed/${id}` : '';
    } catch { return ''; }
  }
  function renderProject(id, params) {
    const p = projects.find(x => x.id === id); if (!p) return renderMissing();
    document.title = `${p.title} — 3seater`;
    const number = projects.indexOf(p), next = projects[(number + 1) % projects.length];
    const back = lastListKey;
    const embed = youtubeEmbedUrl(p.link);
    const projectLink = embed ? `<iframe class="project-youtube" src="${embed}" title="${escape(p.title)} — YouTube video" width="640" height="360" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe>` : /^https?:\/\//i.test(p.link || '') ? `<a href="${escape(p.link)}" target="_blank" rel="noopener noreferrer">View project</a>` : '';
    const rows = [[ 'Year', escape(p.year)], ['Client', p.client ? `<a href="${clientHref(p.client)}">${escape(p.client)}</a>` : ''], ['Category', p.categories.map(c => `<a href="${escape(feedHref(c, ''))}">${escape(c)}</a>`).join(', ')], ['Role', escape(p.role)], ['Link', '']];
    main.innerHTML = `<a class="back-link utility" href="#${escape(back)}">← Back to archive</a><div class="project-layout"><aside class="project-info"><h1>${escape(p.title)}</h1><dl class="project-meta">${rows.filter(([,v]) => v).map(([key,v]) => `<div><dt>${key}</dt><dd>${v}</dd></div>`).join('')}</dl>${p.description ? `<p class="project-description">${escape(p.description)}</p>` : ''}</aside><section class="project-media${p.media.length >= 2 ? ' project-media-grid' : ''}" aria-label="${escape(p.title)} media">${p.media.map((m, i) => `<figure id="media-${i}">${m.type === 'video' ? `<video autoplay muted loop playsinline preload="metadata" data-preview="${escape(m.src)}" poster="${escape(m.poster)}" src="${escape(m.src)}" width="${m.width}" height="${m.height}" aria-label="${escape(p.title)}, video ${i + 1}"></video>` : `<a href="${escape(m.src)}" target="_blank" rel="noopener" data-cursor="Open"><img src="${escape(m.src)}" width="${m.width}" height="${m.height}" alt="${escape(p.title)}, image ${i + 1}" loading="${i === 0 ? 'eager' : 'lazy'}"></a>`}</figure>`).join('')}</section>${projectLink ? `<aside class="project-secondary">${projectLink}</aside>` : ''}</div><a class="project-next" href="${projectHref(next)}" data-cursor="Next"><span class="utility">Next project</span><strong>${escape(next.title)} ↗</strong></a>`;
    initVideos();
    initProjectAudio();
    balanceProjectTriptych(p);
  }
  function balanceProjectTriptych(p) {
    if(p.media.length!==3)return;
    const grid=main.querySelector('.project-media'),figs=[...grid.children];
    const left=document.createElement('div'),right=document.createElement('div');
    left.className=right.className='media-column';left.append(figs[0],figs[1]);right.append(figs[2]);grid.replaceChildren(left,right);grid.classList.add('triptych');
    const ratios=p.media.map(m=>m.height/m.width),total=ratios.reduce((a,b)=>a+b,0);
    const fit=()=>{if(innerWidth<=700){grid.style.removeProperty('grid-template-columns');return}const gap=parseFloat(getComputedStyle(grid).gap)||20;const width=grid.clientWidth-gap;const first=(width*ratios[2]-gap)/total;grid.style.gridTemplateColumns=`${first}px minmax(0,1fr)`};
    const obs=new ResizeObserver(fit);obs.observe(grid);fit();videoControlCleanup.push(()=>obs.disconnect());
  }
  function initProjectAudio() {
    main.querySelectorAll('.project-media video').forEach((video, index) => {
      const figure = video.closest('figure');
      figure.classList.add('video-player');
      const button = document.createElement('button');
      button.className = 'video-audio';
      button.type = 'button';
      button.innerHTML = '<span class="audio-orb"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4Z"/><path class="audio-waves" d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/><path class="audio-slash" d="m16 9 6 6m0-6-6 6"/></svg></span>';
      figure.append(button);
      const sync = () => {
        button.setAttribute('aria-label', `${video.muted ? 'Unmute' : 'Mute'} video ${index + 1}`);
        button.setAttribute('aria-pressed', String(!video.muted));
      };
      sync();
      video.addEventListener('volumechange', sync);
      button.addEventListener('click', () => {
        const unmute = video.muted;
        if (unmute) main.querySelectorAll('.project-media video').forEach(other => { if (other !== video) other.muted = true; });
        video.muted = !unmute;
        sync();
        if (unmute && video.paused) video.play().catch(() => { video.muted = true; sync(); });
      });
      videoControlCleanup.push(bindCursor(button, button.querySelector('.audio-orb'), true));
    });
  }
  function initFooterWordmark() {
    const wordmark = document.querySelector('.footer-wordmark');
    const svg = wordmark.querySelector('svg');
    const text = svg.querySelector('text');
    const measure = document.createElement('canvas').getContext('2d');
    const fitPressure = () => {};
    const fit = () => {
      wordmark.style.setProperty('--viewport-width', `${document.documentElement.clientWidth}px`);
      // SVG text bounds include unused font descent. Measure the painted letters
      // so their bottom edge, rather than the font box, meets the page bottom.
      const bounds = text.getBBox();
      if (bounds.width && bounds.height) {
        const style = getComputedStyle(text);
        measure.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        const metrics = measure.measureText(text.textContent);
        const baseline = text.y.baseVal.getItem(0).value;
        const top = baseline - metrics.actualBoundingBoxAscent;
        const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        svg.setAttribute('viewBox', `${bounds.x - .5} ${top - .5} ${bounds.width + 1} ${height + .5}`);
        fitPressure();
      }
    };
    fit();
    document.fonts.ready.then(fit);
    window.addEventListener('resize', fit, {passive:true});
  }
  function renderContact() {
    const contact = document.querySelector('#contact-footer');
    const email = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(config.email || '') ? config.email : '';
    const socials = [...(Array.isArray(config.socials) ? config.socials : [])];
    if (config.instagram) socials.unshift({label:'Instagram',url:config.instagram});
    const links = socials.filter(s => s.label && /^https:\/\//.test(s.url || ''));
    contact.hidden = !email && !links.length;
    document.querySelector('#footer-project-count').textContent = `[${projects.length}]`;
    contact.innerHTML = `<p>VISUAL WORLDS FOR ARTISTS AND BRANDS.</p><div class="footer-links">${email ? `<a href="mailto:${escape(email)}">${escape(email)}</a>` : ''}${links.map(s => `<a href="${escape(s.url)}" target="_blank" rel="noopener">${escape(s.label)} ↗</a>`).join('')}</div>`;
  }
  function renderMissing() {main.innerHTML = '<div class="empty-state"><h2>This collection isn’t here.</h2><a class="utility" href="#/">Back to the archive ↗</a></div>';}
  function render() {
    if (route().path[0] === 'info') history.replaceState(null, '', '#/');
    const {path, params, key} = route();
    if (routeKey) positions.set(routeKey, window.scrollY);
    cleanup(); routeKey = key;
    main.classList.toggle('archive-page', path[0] === 'archive');
    main.classList.toggle('listing-page', !path.length || ['archive', 'index'].includes(path[0]));
    document.title = '3seater — Visual archive';
    const section = path[0] || 'feed';
    if (section !== 'project') lastListKey = key;
    document.querySelectorAll('[data-nav]').forEach(a => {
      if (a.dataset.nav === (section === 'project' || section === 'clients' ? 'feed' : section)) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (!path.length) renderFeed(params);
    else if (section === 'archive') renderFeed(params, true);
    else if (section === 'index') renderIndex();
    else if (section === 'clients') renderClients(path[1]);
    else if (section === 'project') renderProject(path[1], params);
    else renderMissing();
    const position = positions.get(key) || 0;
    window.scrollTo({top: position, behavior: 'instant'});
    if (section === 'project' && params.has('media') && !positions.has(key)) {
      const index = Number(params.get('media'));
      if (Number.isInteger(index) && index > 0) requestAnimationFrame(() => document.getElementById(`media-${index}`)?.scrollIntoView({behavior:'instant', block:'start'}));
    }
    // Route changes also have a sensible keyboard focus destination.
    main.focus({preventScroll:true});
  }
  let navigationVersion = 0, pageFade;
  async function navigate() {
    const version = ++navigationVersion;
    pageFade?.cancel();
    const filteringArchive = main.classList.contains('archive-page') && route().path[0] === 'archive';
    const fadeTarget = () => filteringArchive ? main.querySelector('#feed-grid, .empty-state') : main;
    const outgoing = fadeTarget();
    if (reduced.matches || !outgoing?.animate) { render(); return; }
    pageFade = outgoing.animate([{opacity:1}, {opacity:0}], {duration:110, easing:'ease-out', fill:'forwards'});
    try { await pageFade.finished; } catch { return; }
    if (version !== navigationVersion) return;
    render();
    pageFade.cancel();
    const incoming = fadeTarget();
    if (!incoming) return;
    pageFade = incoming.animate([{opacity:0}, {opacity:1}], {duration:220, easing:'ease-out'});
    try { await pageFade.finished; } catch { /* A newer navigation replaces this fade. */ }
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
  const startupController = new AbortController();
  const startupTimeout = setTimeout(() => startupController.abort(), 10000);
  const loadJSON = async url => {
    const response = await fetch(url, {signal:startupController.signal});
    if (!response.ok) throw new Error(`Unable to load ${url}`);
    const result = await response.json();
    return result;
  };
  Promise.all([loadJSON('data.json'), loadJSON('site.json'), document.fonts.load('100px Anton'), document.fonts.load('14px Plex')]).then(([data, settings]) => {
    clearTimeout(startupTimeout);
    projects = data.projects; config = settings;
    render(); renderContact(); initFooterWordmark(); window.addEventListener('hashchange', navigate);
  }).catch(error => {
    clearTimeout(startupTimeout);
    startupController.abort();
    main.innerHTML = `<div class="empty-state"><h2>The archive couldn’t load.</h2><p>Please refresh to try again.</p></div>`;
    console.error(error);
  });
})();

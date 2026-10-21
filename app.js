const main = document.querySelector('main');
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const image = (src, alt, lazy = true) => `<img src="${esc(src)}" alt="${esc(alt)}" ${lazy ? 'loading="lazy"' : 'fetchpriority="high"'}>`;
try {
  const response = await fetch('content/site.json');
  if (!response.ok) throw new Error('Content could not be loaded');
  const site = await response.json();
  const page = document.body.dataset.page;
  if (page === 'airport') {
    const extrasResponse = await fetch('content/airport-photos.json', {cache: 'no-store'});
    if (extrasResponse.ok) {
      const extras = await extrasResponse.json();
      site.projects.find(p => p.id === 'airport').images.push(...extras);
      const initial = JSON.stringify(extras);
      setInterval(async () => {
        try {
          const r = await fetch('content/airport-photos.json', {cache: 'no-store'});
          if (r.ok && JSON.stringify(await r.json()) !== initial) location.reload();
        } catch { /* Keep the current gallery when offline. */ }
      }, 4000);
    }
  }
  const intro = (label, title, subtitle, description = '') => `<section class="intro"><div class="eyebrow">${esc(label)}</div><div><h1>${esc(title)}${subtitle ? `<small lang="zh-Hant">${esc(subtitle)}</small>` : ''}</h1>${description ? `<p>${esc(description)}</p>` : ''}</div></section>`;
  if (page === 'home') {
    main.innerHTML = intro('Selected work / 2026', 'Architecture,\ncity & detail.', '', site.discipline) + `<div class="section-label eyebrow"><span>Selected projects</span><span>01 — 02</span></div><section class="projects" aria-label="Selected projects">${site.projects.map(p => `<a class="project" href="${p.id}.html">${image(p.cover,p.title,false)}<div class="project-top"><h2>${esc(p.title)}</h2><span class="arrow" aria-hidden="true">↗</span></div><div class="zh" lang="zh-Hant">${esc(p.chineseTitle)}</div><div class="meta">${esc(p.number)} / ${esc(p.category)} / ${esc(p.year)}</div></a>`).join('')}</section>`;
  } else if (page === 'about') {
    main.innerHTML = intro('About / Profile', site.name, site.chineseName) + `<section class="about"><p>${esc(site.bio)}</p></section><div class="facts"><div><span>Focus</span>${esc(site.discipline)}</div><div><span>Tool</span>${site.tools.map(esc).join(' / ')}</div><div><span>Portfolio</span>Selected work / 2026</div></div><a class="next" href="index.html">Explore selected work <span aria-hidden="true">↗</span></a>`;
  } else {
    const p = site.projects.find(p => p.id === page);
    if (!p) throw new Error('Project not found');
    document.title = `${p.chineseTitle} — ${site.name}`;
    const next = site.projects.find(q => q.id !== p.id);
    main.innerHTML = intro(`${p.number} / ${p.category}`, p.title, p.chineseTitle, p.description) + `<div class="facts"><div><span>Year</span>${esc(p.year)}</div><div><span>Project</span>${esc(p.type)}</div><div><span>My contribution</span>${esc(p.role)}</div></div><section class="gallery ${page === 'airport' ? 'airport-gallery' : ''}" aria-label="Project images">${p.images.map((im,i) => `<figure><a href="${esc(im.src)}" target="_blank" rel="noopener" aria-label="View full image: ${esc(im.caption)}">${image(im.src, im.caption,i!==0)}</a><figcaption>${esc(im.caption)} · View full image ↗</figcaption></figure>`).join('')}</section><a class="next" href="${next.id}.html"><span>Next / ${esc(next.chineseTitle)}</span><span aria-hidden="true">↗</span></a>`;
    if (page === 'airport') {
      const gallery = main.querySelector('.airport-gallery');
      const strip = document.createElement('div');
      strip.className = 'photo-strip';
      strip.tabIndex = 0;
      strip.setAttribute('role', 'region');
      strip.setAttribute('aria-label', 'Additional photographs, scroll horizontally');
      [...gallery.children].slice(1).forEach(figure => strip.append(figure));
      const controls = document.createElement('div');
      controls.className = 'gallery-controls';
      controls.innerHTML = '<span>MODEL PHOTOGRAPHS / Hover and scroll</span><div><button type="button" aria-label="Previous photographs">←</button><button type="button" aria-label="Next photographs">→</button></div>';
      controls.querySelectorAll('button').forEach((button, i) => button.addEventListener('click', () => strip.scrollBy({left: (i ? 1 : -1) * strip.clientWidth * .8, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'})));
      strip.addEventListener('wheel', event => {
        if (event.ctrlKey) return;
        const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
        const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? strip.clientWidth : 1;
        const distance = delta * unit;
        const max = strip.scrollWidth - strip.clientWidth;
        if ((distance > 0 && strip.scrollLeft < max - 1) || (distance < 0 && strip.scrollLeft > 1)) {
          event.preventDefault();
          strip.scrollLeft += distance;
        }
      }, {passive: false});
      gallery.append(controls, strip);
    }
  }
} catch (error) {
  main.innerHTML = '<div class="error">Unable to load portfolio content. Please refresh the page or check content/site.json.</div>';
  console.error(error);
}


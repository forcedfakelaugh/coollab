// HIÊN STUDIO - hash-routed views: home (#/), works (#/works), discipline (#/architecture), project (#/works/<slug>), about (#/about).
const UI = {
  en: {
    tagline: 'Architecture & Associates', works: 'Works', about: 'About', menu: 'Menu', close: 'Close',
    fictional: 'a fictional practice', credits: 'Website concept by Lucas Nguyen · Photo credits',
    home: 'Home', news: 'News', project: 'Project', prev: 'Previous image', next: 'Next image',
    inPreparation: 'In preparation', portfolio: label => `${label} portfolio`, comingSoon: 'Coming soon',
    backToPortfolio: '← Back to portfolio', conceptShowcase: ' / CONCEPT SHOWCASE',
    portfolioNavigation: 'Portfolio navigation', disciplinesLabel: 'Disciplines', mainNavigation: 'Main', enterSite: 'Enter site',
    aboutTitle: 'Practice',
    aboutText: [
      'HIÊN is a fictional studio imagined for this concept. Its name is the Vietnamese word for the veranda - the shaded edge between a house and the street, where most of daily life actually happens.',
      'The website includes an opening screen, a featured-project carousel, an index organized by project scale and full-screen slideshows with project descriptions. The interface supports Vietnamese and English.',
      'Photographs were taken in Vietnam and sourced from Pexels; they are reference images, not buildings by this studio. Project names, years and sizes are invented.',
    ],
  },
  vi: {
    tagline: 'Kiến trúc & Cộng sự', works: 'Dự án', about: 'Giới thiệu', menu: 'Menu', close: 'Đóng',
    fictional: 'một văn phòng giả định', credits: 'Thiết kế web bởi Lucas Nguyen · Nguồn ảnh',
    home: 'Trang chủ', news: 'Tin tức', project: 'Dự án', prev: 'Ảnh trước', next: 'Ảnh sau',
    inPreparation: 'Đang chuẩn bị', portfolio: label => `Dự án ${label.toLowerCase()}`, comingSoon: 'Sắp ra mắt',
    backToPortfolio: '← Về portfolio', conceptShowcase: ' / CONCEPT MINH HỌA',
    portfolioNavigation: 'Điều hướng portfolio', disciplinesLabel: 'Lĩnh vực', mainNavigation: 'Điều hướng chính', enterSite: 'Vào trang',
    aboutTitle: 'Văn phòng',
    aboutText: [
      'HIÊN là một văn phòng giả định cho concept này. Tên gọi lấy từ hiên nhà - khoảng đệm có bóng mát giữa ngôi nhà và con phố, nơi phần lớn sinh hoạt hằng ngày diễn ra.',
      'Website gồm màn hình mở đầu, carousel công trình nổi bật, danh mục dự án phân loại theo quy mô và slideshow toàn màn hình kèm mô tả. Giao diện hỗ trợ tiếng Việt và tiếng Anh.',
      'Ảnh được chụp tại Việt Nam, lấy từ Pexels để minh họa, không phải công trình của văn phòng này. Tên dự án, năm và diện tích đều là giả định.',
    ],
  },
};

const DISCIPLINES = [
  { slug: 'architecture', en: 'Architecture', vi: 'Kiến trúc' },
  { slug: 'interior', en: 'Interior', vi: 'Nội thất' },
  { slug: 'landscape', en: 'Landscape', vi: 'Cảnh quan' },
  { slug: 'planning', en: 'Planning', vi: 'Quy hoạch' },
];

const SCALES = [
  { scale: 'XXL', en: 'Resort', vi: 'Nghỉ dưỡng' },
  { scale: 'XL', en: 'Hotel', vi: 'Khách sạn' },
  { scale: 'L', en: 'Office', vi: 'Văn phòng' },
  { scale: 'M', en: 'Public', vi: 'Công cộng' },
  { scale: 'S', en: 'Housing', vi: 'Nhà ở' },
];

const img = name => `assets/${name}.jpg`;
const PHOTO_ALTS = {
  'palm-resort': 'Resort villas and a pool among palms in Phú Lộc, Huế, Vietnam',
  'timber-resort': 'Aerial view of a curved resort building in Hồ Tràm, Vietnam',
  'night-hotel': 'The illuminated Rex Hotel in Ho Chi Minh City, Vietnam',
  'pool-hotel': 'Tiled roofs and a beachfront pool in Phan Thiết, Vietnam',
  'concrete-office': 'Glass high-rise facade in Ho Chi Minh City, Vietnam',
  'long-office': 'Open concrete colonnade in Ninh Bình, Vietnam',
  'clay-pavilion': 'Traditional lakeside architecture framed by trees in Huế, Vietnam',
  'white-gallery': 'Yellow courtyard facade of the Ho Chi Minh City Museum of Fine Arts, Vietnam',
  'timber-house': 'Traditional wooden house surrounded by greenery in Hanoi, Vietnam',
  'tree-house': 'Modern house with tiled roofs at sunset in Kon Tum, Vietnam',
  'tree-house-interior': 'Curved reception opening and slatted shadows in Đà Lạt, Vietnam',
  'box-house': 'Pale pink residential facade and balconies in Ho Chi Minh City, Vietnam',
};

const PHOTO_ALTS_VI = {
  'palm-resort': 'Biệt thự nghỉ dưỡng và hồ bơi giữa hàng dừa ở Phú Lộc, Huế',
  'timber-resort': 'Góc nhìn trên cao của khu nghỉ dưỡng uốn cong ở Hồ Tràm',
  'night-hotel': 'Khách sạn Rex sáng đèn tại Thành phố Hồ Chí Minh',
  'pool-hotel': 'Mái ngói và hồ bơi sát biển ở Phan Thiết',
  'concrete-office': 'Mặt đứng kính của tòa nhà cao tầng ở Thành phố Hồ Chí Minh',
  'long-office': 'Hàng cột bê tông mở ở Ninh Bình',
  'clay-pavilion': 'Kiến trúc truyền thống bên hồ, giữa cây xanh ở Huế',
  'white-gallery': 'Sân trong với tường vàng của Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh',
  'timber-house': 'Nhà gỗ truyền thống giữa cây xanh ở Hà Nội',
  'tree-house': 'Ngôi nhà hiện đại mái ngói trong nắng chiều ở Kon Tum',
  'tree-house-interior': 'Ô lễ tân uốn cong và bóng nan gỗ ở Đà Lạt',
  'box-house': 'Mặt đứng và ban công nhà ở màu hồng nhạt tại Thành phố Hồ Chí Minh',
};
const photoAlt = src => (lang === 'vi' ? PHOTO_ALTS_VI : PHOTO_ALTS)[src];

const PROJECTS = [
  { slug: 'palm-terrace-resort', title: 'Palm Terrace Resort', scale: 'XXL', disciplines: ['architecture', 'landscape', 'planning'], cover: 'palm-resort', year: 2024, area: '4.2 ha', location: { en: 'Phu Quoc, Viet Nam', vi: 'Phú Quốc, Việt Nam' },
    slides: [['palm-resort', PHOTO_ALTS['palm-resort']], ['timber-resort', PHOTO_ALTS['timber-resort']]],
    text: { en: ['Low pavilions are scattered under existing palms so that no tree is cut and every room opens onto shade before it opens onto the sea.', 'Paths follow the old irrigation lines; the pool is simply where they meet.'],
            vi: ['Các nhà nghỉ thấp tầng được rải dưới hàng dừa có sẵn, không chặt một cây nào, để mỗi phòng mở ra bóng mát trước khi mở ra biển.', 'Lối đi men theo các mương nước cũ; hồ bơi chỉ đơn giản là nơi chúng gặp nhau.'] } },
  { slug: 'timber-cove', title: 'Timber Cove', scale: 'XXL', disciplines: ['architecture', 'planning'], cover: 'timber-resort' },
  { slug: 'blue-hour-hotel', title: 'Blue Hour Hotel', scale: 'XL', disciplines: ['architecture'], cover: 'night-hotel' },
  { slug: 'courtyard-hotel', title: 'Courtyard Hotel', scale: 'XL', disciplines: ['architecture', 'landscape'], cover: 'pool-hotel' },
  { slug: 'raw-office', title: 'Raw Office', scale: 'L', disciplines: ['architecture', 'interior'], cover: 'concrete-office' },
  { slug: 'long-hall', title: 'Long Hall', scale: 'L', disciplines: ['interior'], cover: 'long-office' },
  { slug: 'clay-pavilion', title: 'Clay Pavilion', scale: 'M', disciplines: ['architecture'], cover: 'clay-pavilion' },
  { slug: 'white-gallery', title: 'White Gallery', scale: 'M', disciplines: ['architecture', 'interior'], cover: 'white-gallery' },
  { slug: 'sunlit-house', aliases: ['tree-house'], title: { en: 'Sunlit House', vi: 'Nhà của Nắng' }, scale: 'S', disciplines: ['architecture', 'interior', 'landscape'], cover: 'tree-house', year: 2022, area: '180m²', location: { en: 'Thu Duc, Viet Nam', vi: 'Thủ Đức, Việt Nam' },
    slides: [['tree-house', PHOTO_ALTS['tree-house']]],
    text: { en: ['Evening light falls across tiled roofs and simple plastered volumes. The stepped roofline and deep window openings give the façade its rhythm.', 'Small planted ledges soften the walls, while the low sun brings out the texture of the tiles and plaster.'],
            vi: ['Nắng chiều trải trên những mái ngói và các khối tường trát giản dị. Đường mái giật cấp cùng những ô cửa sâu tạo nhịp điệu cho mặt đứng.', 'Những bồn cây nhỏ bên cửa sổ làm mềm các mảng tường; nắng cuối ngày làm rõ bề mặt ngói và lớp vữa trát.'] } },
  { slug: 'timber-box', title: 'Timber Box', scale: 'S', disciplines: ['architecture'], cover: 'timber-house' },
];

const FEATURES = [
  { label: 'news', title: { en: 'Shortlisted: House of the Year - Sunlit House', vi: 'Đề cử Nhà ở của năm - Nhà của Nắng' }, src: 'tree-house', href: '#/works/sunlit-house' },
  { label: 'project', title: { en: 'Palm Terrace Resort', vi: 'Palm Terrace Resort' }, src: 'palm-resort', href: '#/works/palm-terrace-resort' },
  { label: 'project', title: { en: 'Clay Pavilion', vi: 'Clay Pavilion' }, src: 'clay-pavilion', href: '#/works/clay-pavilion' },
];

const portfolioLanguageKey = 'lucas-portfolio-language';
function readPortfolioLanguage() {
  try { return localStorage.getItem(portfolioLanguageKey) === 'en' ? 'en' : 'vi'; }
  catch { return 'vi'; }
}
let lang = readPortfolioLanguage();
const t = () => UI[lang];
const view = document.getElementById('view');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const projectTitle = p => typeof p.title === 'string' ? p.title : p.title[lang];
let timer;
let renderedPath;
let routeAnimation;
let routeVersion = 0;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const isWorksIndex = path => path === 'works' || DISCIPLINES.some(d => d.slug === path);

const arrow = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;

function renderHome() {
  view.innerHTML = `<h1 class="visually-hidden">${t().home}</h1><section class="feature" aria-roledescription="carousel"><div class="feature__slides">${FEATURES.map((f, i) => `
    <a class="feature__slide${i ? '' : ' is-active'}" href="${f.href}"><img src="${img(f.src)}" alt="${esc(photoAlt(f.src))}"${i ? ' loading="lazy"' : ''}>
    <span class="feature__caption"><span class="label">${t()[f.label]}</span>${esc(f.title[lang])}</span></a>`).join('')}</div></section>`;
  const slides = view.querySelectorAll('.feature__slide');
  let i = 0;
  timer = setInterval(() => {
    slides[i].classList.remove('is-active');
    i = (i + 1) % slides.length;
    slides[i].classList.add('is-active');
  }, 5000);
}

function renderWorks(discipline) {
  const label = DISCIPLINES.find(d => d.slug === discipline)?.[lang];
  const projects = discipline ? PROJECTS.filter(p => p.disciplines.includes(discipline)) : PROJECTS;
  const scales = SCALES.filter(s => projects.some(p => p.scale === s.scale));
  // Only show populated scales, keeping each heading above its desktop column.
  const columns = scales.map(s => projects.filter(p => p.scale === s.scale));
  const rows = Math.max(0, ...columns.map(c => c.length));
  const cells = Array.from({ length: rows }, (_, r) => columns.map(c => c[r])).flat();
  const firstScale = scales[0]?.scale;
  view.innerHTML = `<h1 class="page-title">${esc(label ?? t().works)}</h1>
    <div class="works-index" style="--scale-count: ${scales.length}">
    <div class="scale-tabs" role="tablist">${scales.map(s => `<button role="tab" data-scale="${s.scale}"><span class="scale">${s.scale}</span><span class="type">${s[lang]}</span></button>`).join('')}</div>
    <div class="works-grid">${cells.map(p => p ? `<a class="work" href="#/works/${p.slug}" data-scale="${p.scale}"><img src="${img(p.cover)}" alt="${esc(photoAlt(p.cover))}" loading="lazy"><span class="work__title">${esc(projectTitle(p))}</span></a>` : '<div aria-hidden="true"></div>').join('')}</div>
    </div>`;
  // Mobile: tabs show one scale at a time. Desktop: tabs are column headers.
  const tabs = view.querySelectorAll('.scale-tabs button');
  const show = scale => {
    tabs.forEach(b => { b.classList.toggle('is-active', b.dataset.scale === scale); b.setAttribute('aria-selected', b.dataset.scale === scale); });
    view.querySelectorAll('.work').forEach(w => w.classList.toggle('is-visible', w.dataset.scale === scale));
  };
  tabs.forEach(b => b.addEventListener('click', () => show(b.dataset.scale)));
  show(firstScale);
}

function renderProject(p) {
  const title = projectTitle(p);
  const slides = (p.slides ?? [[p.cover, PHOTO_ALTS[p.cover]]]).map(([src, alt]) => ({ src, alt: photoAlt(src) ?? alt }));
  const text = p.text?.[lang] ?? [lang === 'en' ? 'Project description to come.' : 'Mô tả dự án sẽ được cập nhật.'];
  const all = [...slides, { text }];
  const meta = [p.year, p.area, p.location?.[lang]].filter(Boolean).join(' | ');
  view.innerHTML = `<section class="slideshow"><h1 class="visually-hidden">${esc(title)}</h1><div class="slideshow__stage">${all.map((s, i) => s.src
      ? `<figure class="slide${i ? '' : ' is-active'}"><img src="${img(s.src)}" alt="${esc(s.alt)}"></figure>`
      : `<div class="slide slide--text"><div>${s.text.map(x => `<p>${esc(x)}</p>`).join('')}</div></div>`).join('')}</div>
    <div class="slideshow__nav"><button class="prev" aria-label="${t().prev}">${arrow('M19 12H5M11 6l-6 6 6 6')}</button><span aria-live="polite"><span class="current">1</span> / ${all.length}</span><button class="next" aria-label="${t().next}">${arrow('M5 12h14M13 6l6 6-6 6')}</button></div>
    <div class="slideshow__caption"><strong>${esc(title)}</strong>${meta ? `<div>${esc(meta)}</div>` : ''}</div></section>`;
  const nodes = view.querySelectorAll('.slide');
  const current = view.querySelector('.current');
  let index = 0;
  const go = n => {
    index = (n + nodes.length) % nodes.length;
    nodes.forEach((s, i) => s.classList.toggle('is-active', i === index));
    current.textContent = index + 1;
  };
  view.querySelector('.prev').addEventListener('click', () => go(index - 1));
  view.querySelector('.next').addEventListener('click', () => go(index + 1));
  // Left half of the photo steps back, right half steps forward; the cursor arrow follows.
  const stage = view.querySelector('.slideshow__stage');
  const back = e => e.clientX < stage.getBoundingClientRect().left + stage.offsetWidth / 2;
  stage.addEventListener('mousemove', e => stage.classList.toggle('is-back', back(e)));
  stage.addEventListener('click', e => go(back(e) ? index - 1 : index + 1));
  document.onkeydown = e => {
    if (e.key === 'ArrowLeft') go(index - 1);
    if (e.key === 'ArrowRight') go(index + 1);
  };
  let startX = 0;
  view.addEventListener('touchstart', e => (startX = e.touches[0].clientX), { passive: true });
  view.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) go(dx < 0 ? index + 1 : index - 1);
  });
}

function renderAbout() {
  view.innerHTML = `<section class="split"><div class="split__media"><img src="${img('tree-house-interior')}" alt=""></div>
    <div><h1 class="split__title">${t().aboutTitle}</h1><div class="columns">${t().aboutText.map(p => `<p>${esc(p)}</p>`).join('')}</div></div></section>`;
}

function syncNavSpacing() {
  const nav = document.getElementById('disciplines');
  const [first, second] = nav.children;
  if (!second || !nav.getClientRects().length || getComputedStyle(nav).flexDirection !== 'row') return;
  const gap = second.getBoundingClientRect().left - first.getBoundingClientRect().right;
  document.querySelector('.site-header').style.setProperty('--nav-link-gap', `${Math.max(0, gap)}px`);
}

function renderChrome(path) {
  document.documentElement.lang = lang;
  document.title = lang === 'vi' ? 'HIÊN STUDIO - Kiến trúc & Cộng sự' : 'HIÊN STUDIO - Architecture & Associates';
  document.querySelector('meta[name="description"]').content = lang === 'vi'
    ? 'HIÊN STUDIO: ý tưởng website kiến trúc của Lucas Nguyen: công trình nổi bật, danh mục theo quy mô và thư viện ảnh dự án bằng tiếng Việt và tiếng Anh.'
    : 'HIÊN STUDIO: an architecture portfolio concept by Lucas Nguyen: featured projects, an index by scale and project galleries in Vietnamese and English.';
  document.querySelectorAll('[data-i18n]').forEach(el => { el.innerHTML = window.portfolioIcons.text(t()[el.dataset.i18n]); });
  document.querySelectorAll('[data-i18n-label]').forEach(el => { el.setAttribute('aria-label', t()[el.dataset.i18nLabel]); });
  const disciplines = document.getElementById('disciplines');
  if (disciplines.dataset.lang !== lang) {
    disciplines.innerHTML = DISCIPLINES.map(d => `<a href="#/${d.slug}">${d[lang]}</a>`).join('');
    disciplines.dataset.lang = lang;
  }
  disciplines.querySelectorAll('a').forEach(a => {
    if (a.getAttribute('href') === `#/${path}`) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  document.querySelectorAll('.nav--right a').forEach(a => a.toggleAttribute('aria-current', path.startsWith(a.getAttribute('href').slice(2))));
  document.querySelector('.menu-toggle').textContent = document.body.classList.contains('menu-open') ? t().close : t().menu;
  syncNavSpacing();
}

async function route() {
  const path = location.hash.replace(/^#\/?/, '');
  const version = ++routeVersion;
  const animate = renderedPath !== path && isWorksIndex(renderedPath) && isWorksIndex(path)
    && !reducedMotion.matches && typeof view.animate === 'function';
  // Continue from the visible frame if another discipline is selected mid-transition.
  const style = animate ? getComputedStyle(view) : null;
  const from = style ? { opacity: style.opacity, transform: style.transform } : null;
  routeAnimation?.cancel();
  clearInterval(timer);
  document.onkeydown = null;
  document.body.classList.remove('menu-open');
  document.querySelector('.menu-toggle').setAttribute('aria-expanded', 'false');
  renderChrome(path);
  if (animate) {
    routeAnimation = view.animate([from, { opacity: 0, transform: 'translateY(-4px)' }], {
      duration: 120, easing: 'ease-in', fill: 'forwards',
    });
    await routeAnimation.finished.catch(() => {});
    if (version !== routeVersion) return;
    routeAnimation.cancel();
  }
  const [section, slug] = path.split('/');
  const project = section === 'works' && PROJECTS.find(p => p.slug === slug || p.aliases?.includes(slug));
  if (project) renderProject(project);
  else if (section === 'works') renderWorks();
  else if (DISCIPLINES.some(d => d.slug === section)) renderWorks(section);
  else if (section === 'about') renderAbout();
  else renderHome();
  renderedPath = path;
  if (path) { window.scrollTo(0, 0); view.focus({ preventScroll: true }); }
  if (animate && !reducedMotion.matches) {
    // A short fade and a small lift keep the grid change quiet and deliberate.
    routeAnimation = view.animate([
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: 280, easing: 'cubic-bezier(.22, 1, .36, 1)' });
  }
}

function syncPortfolioLanguage() {
  const nextLanguage = readPortfolioLanguage();
  if (nextLanguage === lang) return;
  lang = nextLanguage;
  route();
}
window.addEventListener('storage', event => {
  if (event.key === portfolioLanguageKey || event.key === null) syncPortfolioLanguage();
});
window.addEventListener('pageshow', syncPortfolioLanguage);
new ResizeObserver(syncNavSpacing).observe(document.querySelector('.site-header'));
document.fonts.ready.then(syncNavSpacing);

document.querySelector('.menu-toggle').addEventListener('click', e => {
  const open = document.body.classList.toggle('menu-open');
  e.currentTarget.setAttribute('aria-expanded', String(open));
  e.currentTarget.textContent = open ? t().close : t().menu;
});

// Splash shows once per browser session, then fades into the home page.
const splash = document.querySelector('.splash');
let seen = false;
try { seen = sessionStorage.getItem('hien-splash') === '1'; sessionStorage.setItem('hien-splash', '1'); } catch {}
if (seen || location.hash.length > 2) splash.remove();
else {
  splash.style.backgroundImage = `url(${img('tree-house')})`;
  const hide = () => { splash.classList.add('is-hidden'); setTimeout(() => splash.remove(), 900); };
  splash.addEventListener('click', hide);
  splash.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hide(); } });
  window.addEventListener('wheel', hide, { once: true });
  setTimeout(hide, 3500);
}

window.addEventListener('hashchange', route);
route();

window.addEventListener('showcase-language', async event => {
  if (lang === event.detail.language) return;
  const scale = view.querySelector('.scale-tabs .is-active')?.dataset.scale;
  const slide = Number(view.querySelector('.slideshow .current')?.textContent || 1);
  lang = event.detail.language;
  await route();
  if (scale) view.querySelector(`[data-scale="${scale}"]`)?.click();
  for (let i = 1; i < slide; i++) view.querySelector('.slideshow .next')?.click();
});

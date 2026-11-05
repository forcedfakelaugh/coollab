// Artwork data is taken from the Lumiere Arts catalogue (titles, medium, size, year).
// Sizes are width × height in centimetres and drive the true-scale wall preview.
const series = {
  crystal: {
    name: 'Thủy Tinh Hóa', count: '19 works',
    text: 'Figures and blossoms seen as if through fractured glass, with planes of colour that catch and bend the light across the silk.',
    works: [
      ['tth14', 'Thủy tinh hóa 14', 'Crystallization No. 14', 101, 110, 2026, 1600, 1600],
      ['tth1', 'Thủy tinh hóa 1', 'Crystallization No. 1', 70, 110, 2025, 977, 1600],
      ['tth2', 'Thủy tinh hóa 2', 'Crystallization No. 2', 90, 70, 2025, 1600, 1268],
      ['tth5', 'Thủy tinh hóa 5', 'Crystallization No. 5', 74, 113, 2025, 640, 1024],
      ['tth8', 'Thủy tinh hóa 8', 'Crystallization No. 8', 100, 108, 2025, 992, 1030],
    ],
  },
  living: {
    name: 'Vùng Sống', count: '55 works',
    text: 'Imagined landscapes where reality, memory and imagination dissolve into one another. Watercolour on silk, in dialogue with Giang paper.',
    works: [
      ['vs1', 'Vùng sống 1', 'Living Zone I', 600, 160, 2019, 1600, 658],
      ['vs7', 'Vùng sống 7', 'Living Zone VII', 200, 100, 2023, 1600, 752],
      ['vs5', 'Vùng sống 5', 'Living Zone V', 120, 100, 2023, 1600, 1333],
      ['vs4', 'Vùng sống 4', 'Living Zone IV', 160, 80, 2023, 1250, 624],
    ],
  },
  still: {
    name: 'Tĩnh Vật', count: '45 works',
    text: 'Lotus, fruit, curtains and quiet rooms: everyday things held in the soft light of silk.',
    works: [
      ['ngoclien', 'Ngọc Liên', 'Jade Lotus', 90, 68, 2026, 1600, 1189],
      ['muacam', 'Mùa cam', 'Orange Season', 57, 106, 2023, 842, 1600],
      ['tinhvat', 'Tĩnh vật', 'Still Life', 100, 56, 2023, 1600, 815],
      ['ngaymoi', 'Ngày mới', 'A New Day', 45, 55, 2025, 1251, 1600],
      ['giolua', 'Gió qua rèm', 'Wind Through the Curtain', 128, 67, 2023, 1600, 897],
    ],
  },
  palace: {
    name: 'Từ Hoa', count: '6 works',
    text: 'The Lý-dynasty capital imagined along the shores of West Lake: pavilions, lotus ponds and quiet studies where only light, brushes and inkstones remain.',
    works: [
      ['tuhoa2', 'Cung Từ Hoa', 'Tu Hoa Palace', null, null, 2024, 1600, 1091, 'Dusit Le Palais Tu Hoa Hanoi'],
      ['tuhoa3', 'Thư Phòng', 'The Study', null, null, 2024, 1600, 814],
      ['tuhoa1', 'Từ Hoa Công Chúa', 'Princess Tu Hoa', null, null, 2024, 1289, 1600],
      ['tuhoa4', 'Chiếc trâm ngọc', 'The Jade Hairpin', null, null, 2024, 1288, 1600],
    ],
  },
};
const scarves = [
  ['scarf_gold', 'Golden Lotus', 'Warm vermilion, luminous lotus blossoms, flowing turquoise leaves and gold accents, framed by a fan-inspired border.', { Twilly: 89, '70 × 70 cm': 179, '90 × 90 cm': 289 }],
  ['scarf_crimson', 'Crimson Lotus', 'Deep crimson, burgundy and luminous pink tones meet lotus forms, translucent geometric layers and warm gold details.', { Twilly: 89, '55 × 55 cm': 129, '70 × 70 cm': 179, '90 × 90 cm': 289 }],
  ['scarf_blue', 'Blue Blossom', 'Deep blue silk, white blossoms and delicate gold botanical details, for everyday styling and special occasions.', { Twilly: 89, '55 × 55 cm': 129, '70 × 70 cm': 179, '90 × 90 cm': 289 }],
  ['scarf_bloom', 'Blue Bloom', 'Luminous blue and turquoise washes with warm orange accents and delicate white botanical forms.', { Twilly: 89, '70 × 70 cm': 179, '90 × 90 cm': 289 }],
];

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const translate = value => window.showcaseLanguage?.translate(value) ?? value;
const refresh = () => window.showcaseLanguage?.refresh();

// Hero: start inside the painting and pull back to the full 600 cm as the visitor scrolls.
const hero = document.querySelector('.hero');
const frame = document.querySelector('.hero-frame');
const rulerValue = document.querySelector('.ruler-value');
function fitHero() {
  const stage = frame.parentElement.getBoundingClientRect();
  const cover = Math.max(stage.width / frame.offsetWidth, stage.height / frame.offsetHeight) * 1.04;
  frame.style.setProperty('--s0', reducedMotion ? 1 : cover.toFixed(3));
}
function scrollHero() {
  const travel = hero.offsetHeight - innerHeight;
  const progress = reducedMotion ? 1 : Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / (travel * .85)));
  hero.style.setProperty('--p', progress.toFixed(4));
  rulerValue.textContent = Math.round(progress * 600);
}
let ticking = false;
addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { scrollHero(); ticking = false; });
}, { passive: true });
addEventListener('resize', () => { fitHero(); scrollHero(); });
fitHero(); scrollHero();

// Collections
const tabs = [...document.querySelectorAll('[data-series]')];
const worksEl = document.querySelector('#works');
let active = 'crystal';
function renderSeries(key) {
  active = key;
  const { count, text, works } = series[key];
  tabs.forEach(tab => tab.setAttribute('aria-selected', tab.dataset.series === key));
  document.querySelector('.series-count').textContent = count;
  document.querySelector('.series-text').textContent = text;
  worksEl.innerHTML = works.map(([id, title, en, w, h, year, iw, ih], index) => `
    <button class="work" type="button" data-index="${index}" style="--i:${index}">
      <span class="work-image"><img src="assets/${id}.webp" alt="${title}" width="${iw}" height="${ih}" loading="lazy"></span>
      <span class="work-meta"><span><span class="work-title" data-no-translate>${title}</span><span class="work-sub">${en}</span></span><span class="work-size">${w ? `${w} × ${h} cm` : year}</span></span>
    </button>`).join('');
  refresh();
}
tabs.forEach(tab => tab.addEventListener('click', () => renderSeries(tab.dataset.series)));
document.querySelector('.series-tabs').addEventListener('keydown', event => {
  const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
  if (!step) return;
  const next = tabs[(tabs.findIndex(tab => tab.dataset.series === active) + step + tabs.length) % tabs.length];
  next.focus();
  renderSeries(next.dataset.series);
});
worksEl.addEventListener('click', event => {
  const work = event.target.closest('.work');
  if (work) openViewer(Number(work.dataset.index));
});

// Artwork viewer with a true-scale wall preview.
const viewer = document.querySelector('.viewer');
const viewerImage = viewer.querySelector('.viewer-image img');
const wall = viewer.querySelector('.wall');
const scene = viewer.querySelector('.wall-scene');
const wallButton = viewer.querySelector('[data-toggle-wall]');
const addWorkButton = viewer.querySelector('[data-add-work]');
let current = 0;
function openViewer(index) {
  current = index;
  showWork();
  if (!viewer.open) viewer.showModal();
}
function showWork() {
  const works = series[active].works;
  const [id, title, en, w, h, year, iw, ih, collection] = works[current];
  viewerImage.src = `assets/${id}.webp`;
  viewerImage.alt = title;
  viewerImage.width = iw; viewerImage.height = ih;
  viewer.querySelector('.viewer-series').textContent = series[active].name;
  viewer.querySelector('#viewer-title').textContent = title;
  viewer.querySelector('.viewer-en').textContent = en;
  const meta = [['Artist', 'Nguyễn Văn Trinh'], ['Medium', 'Watercolour on silk'], ...(w ? [['Size', `${w} × ${h} cm`]] : []), ['Year', year]];
  if (collection) meta.push(['Collection', collection]);
  viewer.querySelector('.viewer-meta').innerHTML = meta.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('');
  viewer.querySelector('.viewer-price').textContent = collection ? 'Held in a permanent collection' : 'Price on request';
  viewer.querySelector('.viewer-index').textContent = `${current + 1} / ${works.length}`;
  addWorkButton.hidden = Boolean(collection);
  addWorkButton.textContent = inquiry.has(id) ? 'Added to inquiry' : 'Add to inquiry';
  wallButton.hidden = !w;
  setWall(false);
  if (w) layoutWall(id, w, h);
  refresh();
}
function layoutWall(id, w, h) {
  // Room proportions in centimetres: a 210 × 85 cm sofa, the work hung 25 cm above it.
  const roomW = Math.max(420, w + 160);
  const roomH = Math.max(270, (140 + h) / .875);
  const floor = .12 * roomH;
  scene.style.setProperty('--room', (roomW / roomH).toFixed(3));
  scene.style.setProperty('--sw', `${210 / roomW * 100}%`);
  scene.style.setProperty('--sh', `${85 / roomH * 100}%`);
  scene.style.setProperty('--sb', `${floor / roomH * 100}%`);
  scene.style.setProperty('--ab', `${(floor + 110) / roomH * 100}%`);
  scene.style.setProperty('--aw', `${w / roomW * 100}%`);
  scene.style.setProperty('--ar', `${w}/${h}`);
  scene.querySelector('img').src = `assets/${id}.webp`;
  viewer.querySelector('.wall-note').textContent = `Shown at true scale: ${w} × ${h} cm above a 210 cm sofa`;
}
function setWall(show) {
  wall.hidden = !show;
  viewer.querySelector('.viewer-image').hidden = show;
  wallButton.textContent = show ? 'Back to the artwork' : 'See it on a wall';
  refresh();
}
wallButton.addEventListener('click', () => setWall(wall.hidden));
viewer.querySelectorAll('[data-wall]').forEach(button => {
  button.style.setProperty('--c', button.dataset.wall);
  button.addEventListener('click', () => {
    scene.style.setProperty('--wall', button.dataset.wall);
    viewer.querySelectorAll('[data-wall]').forEach(other => other.setAttribute('aria-checked', other === button));
  });
});
function step(direction) {
  const total = series[active].works.length;
  current = (current + direction + total) % total;
  showWork();
}
viewer.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => step(Number(button.dataset.step))));
viewer.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') step(1);
  if (event.key === 'ArrowLeft') step(-1);
});
viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
addWorkButton.addEventListener('click', () => {
  const [id, title, en, w, h] = series[active].works[current];
  addToInquiry(id, title, w ? `${w} × ${h} cm · Original` : 'Original');
  addWorkButton.textContent = 'Added to inquiry';
  refresh();
});

// Painting to scarf comparison
const compare = document.querySelector('.compare');
compare.querySelector('.compare-range').addEventListener('input', event => compare.style.setProperty('--split', `${event.target.value}%`));

// Scarves
const rail = document.querySelector('#scarves');
const panel = document.querySelector('.scarf-panel');
let scarf = 0;
rail.innerHTML = scarves.map(([id, name, , sizes], index) => `<button class="scarf" type="button" data-scarf="${index}" aria-pressed="${index === 0}"><img src="assets/${id}.webp" alt="Model wearing the ${name} silk scarf" loading="lazy" width="1024" height="1535"><span>${name}</span><small>From $${Math.min(...Object.values(sizes))}</small></button>`).join('');
function renderScarf(index) {
  scarf = index;
  const [, name, copy, sizes] = scarves[index];
  rail.querySelectorAll('.scarf').forEach(button => button.setAttribute('aria-pressed', Number(button.dataset.scarf) === index));
  panel.querySelector('.scarf-name').textContent = `${name} silk scarf`;
  panel.querySelector('.scarf-copy').textContent = copy;
  const entries = Object.entries(sizes);
  const preferred = entries.find(([size]) => size === '70 × 70 cm') ?? entries[0];
  panel.querySelector('.size-options').innerHTML = entries.map(([size, price]) => `<label><input type="radio" name="size" value="${size}" data-price="${price}" ${size === preferred[0] ? 'checked' : ''}><span>${size}</span></label>`).join('');
  updatePrice();
}
function updatePrice() {
  const checked = panel.querySelector('[name="size"]:checked');
  panel.querySelector('.scarf-price').textContent = `$${checked.dataset.price} USD`;
  refresh();
}
rail.addEventListener('click', event => {
  const button = event.target.closest('.scarf');
  if (button) renderScarf(Number(button.dataset.scarf));
});
panel.addEventListener('change', updatePrice);
panel.querySelector('[data-add-scarf]').addEventListener('click', () => {
  const [id, name] = scarves[scarf];
  const checked = panel.querySelector('[name="size"]:checked');
  addToInquiry(`${id}-${checked.value}`, `${name} silk scarf`, `${checked.value} · $${checked.dataset.price}`, id);
});
renderScarf(0);

// Inquiry list and simulated form
const inquiry = new Map();
const list = document.querySelector('#inquiry-items');
const form = document.querySelector('.inquiry');
const status = form.querySelector('.form-status');
function addToInquiry(key, title, detail, image = key) {
  inquiry.set(key, { title, detail, image });
  renderInquiry();
  status.textContent = `${title} added to your inquiry.`;
  refresh();
}
function renderInquiry() {
  list.innerHTML = [...inquiry].map(([key, { title, detail, image }]) => `<li><img src="assets/${image}.webp" alt=""><span><span>${title}</span><small>${detail}</small></span><button type="button" data-remove="${key}" aria-label="Remove ${title}">×</button></li>`).join('');
  refresh();
}
list.addEventListener('click', event => {
  const button = event.target.closest('[data-remove]');
  if (!button) return;
  inquiry.delete(button.dataset.remove);
  renderInquiry();
  status.textContent = '';
});
form.addEventListener('submit', event => {
  event.preventDefault();
  const missing = [...form.querySelectorAll('[required]')].filter(input => !input.value.trim());
  form.querySelectorAll('[required]').forEach(input => input.setAttribute('aria-invalid', missing.includes(input)));
  if (missing.length) {
    status.textContent = 'Please add your name and a way to reach you.';
    missing[0].focus();
  } else {
    status.textContent = inquiry.size
      ? `Demo only: an inquiry for ${inquiry.size} item(s) would be sent to the gallery. Nothing was sent.`
      : 'Demo only: your message would be sent to the gallery. Nothing was sent.';
  }
  refresh();
});

renderSeries(active);

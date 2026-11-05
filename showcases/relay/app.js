import { mount } from './vendor/hooks.js';
import { FaultyTerminal } from './vendor/terminal.js';
import { GlitchText } from './vendor/glitch.js';
import { Magnet } from './vendor/magnet.js';
import { PixelCard } from './vendor/pixel.js';
import { createCarousel } from './carousel.js';
import { createDecrypted } from './text-and-spark.js';

// Run It Forward: six AI-generated key visuals for the fictional RELAY brand.
const ACCENT = '#ff9f2e';
const base = './assets/campaign/';
const frames = [
  { slug: 'start', wearing: 'Curfew Singlet, Wetline 09', name: 'First kilometer.', w: 1536, h: 1024, alt: 'A Vietnamese runner in a matte-black singlet with an amber shoulder seam launches across a rain-slicked street at night.', note: 'The first ten minutes are always heavy. Your legs still carry the desk, the traffic, the noise. Keep moving until your breathing takes over.' },
  { slug: 'stride', wearing: 'Last Light Short, Wetline 09', name: 'Sodium cadence.', w: 1536, h: 1024, alt: 'A woman in black running kit with amber piping runs mid-stride across a wet concrete bridge under streaking sodium streetlights.', note: 'Forget the watch on your wrist. Count lampposts across the bridge, settle into the humidity, and hold the line to the far ramp.' },
  { slug: 'relay', wearing: 'Sodium Shell', name: 'No solo miles.', w: 1536, h: 1024, alt: 'Close-up of one runner\u2019s rain-wet hand passing a matte signal-amber baton to another runner in motion at night.', note: 'A text at 8:30 is the only reason you laced up tonight. Tomorrow night, you\u2019ll be the one waiting at the corner.' },
  { slug: 'kit', wearing: 'Sodium Shell', name: 'Warm rain.', w: 1536, h: 1024, alt: 'Macro detail of rain beading on a black micro-grid ripstop running jacket with a signal-amber seam along the collar and shoulder.', note: 'A late downpour clears the sidewalks in five minutes. Grid ripstop keeps the wind off your chest; one amber seam catches every headlight.' },
  { slug: 'shoe', wearing: 'Wetline 09', name: 'Painted asphalt.', w: 1536, h: 1024, alt: 'Low-angle flash shot of an unbranded black and signal-amber running shoe splashing through a puddle on dark wet asphalt.', note: 'Crosswalk paint, steel bridge joints, puddles hiding in the dark. Soft-compound lugs bite where worn road shoes slip.' },
  { slug: 'crew', wearing: 'The Night Collection', name: 'Bridge pack.', w: 1536, h: 1024, alt: 'Three Vietnamese runners in black kit with signal-amber seams running together across a wet city overpass at night.', note: 'Three people holding 4:45 pace over the overpass don\u2019t need to talk. You just match footsteps and let the city fall behind.' }
];
const products = [
  { name: 'Sodium Shell', type: 'Ripstop Shell', price: '$148', frame: 3, position: '55% 50%' },
  { name: 'Curfew Singlet', type: 'Mesh Singlet', price: '$58', frame: 0, position: '58% 35%' },
  { name: 'Last Light Short', type: 'Split Short', price: '$64', frame: 1, position: '48% 55%' },
  { name: 'Wetline 09', type: 'Road Shoe', price: '$165', frame: 4, position: '52% 55%' }
];
const srcset = frame => `${base}${frame.slug}-480.webp 480w, ${base}${frame.slug}-960.webp 960w`;
const t = text => window.showcaseLanguage?.translate(text) ?? text;
const $ = selector => document.querySelector(selector);
const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
const narrow = window.innerWidth < 720;

function lightTerminal() {
  const box = $('#terminal');
  const canvas = document.createElement('canvas');
  canvas.className = 'faulty-terminal-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  box.append(canvas);
  const { refs } = mount(FaultyTerminal, {
    tint: ACCENT, glyphs: 'characters', scale: 1.4, gridMul: [2, 1], digitSize: 1.3, timeScale: 0.35,
    scanlineIntensity: 0.45, glitchAmount: 1, flickerAmount: 1, noiseAmp: 1, curvature: 0.12, mouseStrength: 0.35,
    brightness: 0.75, glow: 0.55, persistence: 0.5, scramble: 0.7, mouseGlow: 0.8, vignette: 0.45, clickEffect: 'none',
    variation: 3, dpr: Math.min(window.devicePixelRatio || 1, narrow ? 1 : 1.25)
  }, r => {
    r.containerRef.current = box;
    r.canvasRef.current = canvas;
  });
  if (!refs.wakeRef.current) box.classList.add('is-offline');
  return refs;
}

function glitch(element, text, props) {
  element.classList.add('glitch', `glitch--${props.mode}`);
  element.style.setProperty('--glitch-color-a', '#00e5ff');
  element.style.setProperty('--glitch-color-b', '#ff2e88');
  element.setAttribute('aria-label', text);
  element.innerHTML = '<span class="glitch__text" aria-hidden="true"></span><span class="glitch__slice glitch__slice--a" aria-hidden="true"></span><span class="glitch__slice glitch__slice--b" aria-hidden="true"></span>';
  element.querySelectorAll('[aria-hidden]').forEach(span => { span.textContent = text; });
  return mount(GlitchText, { children: text, shadowColors: ['#00e5ff', '#ff2e88'], ...props }, r => {
    r.rootRef.current = element;
  }).refs;
}

function magnet(element, props = {}) {
  const inner = document.createElement('span');
  inner.className = 'magnet-inner';
  element.replaceWith(inner);
  const wrapper = document.createElement('span');
  wrapper.className = 'magnet';
  inner.replaceWith(wrapper);
  wrapper.append(inner);
  inner.append(element);
  return mount(Magnet, { padding: 70, magnetStrength: 3, maxOffset: 16, tilt: 6, scale: 1.04, ...props }, r => {
    r.wrapperRef.current = wrapper;
    r.innerRef.current = inner;
  }).refs;
}

/* ---------------- Campaign: carousel and caption ---------------- */
const renderSlide = index => {
  const frame = frames[index];
  const card = document.createElement('figure');
  card.className = 'frame-card';
  const image = document.createElement('img');
  image.src = `${base}${frame.slug}-960.webp`;
  image.srcset = srcset(frame);
  image.sizes = '(max-width: 900px) 92vw, 1100px';
  image.width = frame.w;
  image.height = frame.h;
  image.alt = t(frame.alt);
  image.draggable = false;
  image.decoding = 'async';
  card.append(image);
  card.insertAdjacentHTML('beforeend', '<span class="frame-sweep" aria-hidden="true"></span>');
  return card;
};

const carousel = createCarousel($('#carousel'), {
  count: frames.length,
  renderSlide,
  aspectRatio: narrow ? 1 : 3 / 2,
  onChange: index => tune(index),
  onActivate: index => inspect(index)
});

const captionName = createDecrypted($('#d-name'), { speed: 28, sequential: true, direction: 'center', characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&/<>=+' });

// Bars double as a direct selector.
const bars = $('#bars');
frames.forEach((frame, index) => {
  const bar = document.createElement('button');
  bar.type = 'button';
  bar.className = 'bar';
  bar.dataset.index = index;
  bar.innerHTML = '<span class="bar-track"></span>';
  bar.addEventListener('click', () => carousel.goTo(index));
  bars.append(bar);
});

const lineup = $('#lineup');
const lineupTiles = products.map(product => {
  const frame = frames[product.frame];
  const item = document.createElement('li');
  item.innerHTML = `<button type="button" class="tile pixel-card"><canvas class="pixel-card-canvas" aria-hidden="true"></canvas><img src="${base}${frame.slug}-960.webp" alt="" width="${frame.w}" height="${frame.h}" loading="lazy" decoding="async" style="object-position:${product.position}"><span class="tile-meta"><strong data-no-translate>${product.name}</strong><span class="tile-info"><span>${product.type}</span> <span data-no-translate>${product.price}</span></span></span></button>`;
  lineup.append(item);
  const tile = item.querySelector('.tile');
  tile.addEventListener('click', () => {
    carousel.goTo(product.frame);
    $('#campaign').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    $('#carousel').focus({ preventScroll: true });
  });
  return tile;
});

function renderCaption(index, animate) {
  const frame = frames[index];
  captionName.set(t(frame.name), animate);
  $('#d-note').textContent = t(frame.note);
  $('#d-wearing').textContent = `${t('Wearing')}: ${t(frame.wearing)}`;
  $('#counter').textContent = `${String(index + 1).padStart(2, '0')} / ${String(frames.length).padStart(2, '0')}`;
  bars.querySelectorAll('.bar').forEach((bar, i) => {
    bar.classList.toggle('is-past', i < index);
    bar.classList.toggle('is-active', i === index);
    if (i === index) bar.setAttribute('aria-current', 'true');
    else bar.removeAttribute('aria-current');
    bar.setAttribute('aria-label', t('Go to visual {number}').replace('{number}', i + 1));
  });
}

function tune(index) {
  renderCaption(index, true);
  $('#carousel-status').textContent = t(frames[index].name);
}

/* ---------------- Inspect ---------------- */
const dialog = $('#inspect');
function inspect(index) {
  const frame = frames[index];
  const image = $('#inspect-image');
  image.src = `${base}${frame.slug}.webp`;
  image.alt = t(frame.alt);
  image.width = frame.w;
  image.height = frame.h;
  $('#inspect-code').textContent = t(frame.name);
  dialog.showModal();
}
$('#inspect-open').addEventListener('click', () => inspect(carousel.index));
$('#inspect-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

/* ---------------- Transport ---------------- */
$('#prev').addEventListener('click', () => carousel.step(-1));
$('#next').addEventListener('click', () => carousel.step(1));
carousel.setMode('tilt');

/* ---------------- Effects ---------------- */
lightTerminal();
glitch($('#hero-title'), 'RELAY', { mode: 'slices', speed: 0.9, offset: narrow ? 3 : 6, intensity: 0.3, skew: 2, flicker: true, trigger: 'always' });
const heroLine = createDecrypted($('#hero-line'), { speed: 22, sequential: true, characters: '01<>/\\|=+*#' });

document.querySelectorAll('[data-magnet]').forEach(element => magnet(element));
lineupTiles.forEach(tile => mount(PixelCard, {
  colors: ['#ffffff', ACCENT, ACCENT], gap: 6, speed: 40, pixelSize: 2.5, origin: 'pointer',
  glow: 0.6, glowColor: ACCENT, noFocus: true, intro: false, clickPulse: false, radius: 2
}, r => {
  r.containerRef.current = tile;
  r.canvasRef.current = tile.querySelector('canvas');
}));

/* ---------------- Contact: same address the portfolio publishes ---------------- */
$('#book').href = `mailto:${atob('bHVjYXNuZ3V5ZW4uc2hAZ21haWwuY29t')}?subject=${encodeURIComponent('Campaign concept')}`;

/* ---------------- Language-dependent rendering ---------------- */
function applyLanguage(animate = false) {
  heroLine.set(t('The late shift runs on foot.'), animate);
  carousel.setLabels(i => t(frames[i].name));
  renderCaption(carousel.index, animate);
  window.showcaseLanguage?.refresh();
}
window.addEventListener('showcase-language', () => applyLanguage(false));

applyLanguage(false);
heroLine.set(t('The late shift runs on foot.'), true);

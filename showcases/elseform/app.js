const projects = {
  la: { name: 'LÁ', title: 'A fresh perspective.', image: 'la-tea.webp', alt: 'Lime green LÁ sparkling tea cans against a vivid cobalt blue backdrop', sector: 'Food & beverage', services: 'Strategy / Identity / Packaging', year: '2026', idea: 'Tea, with a different kind of energy. LÁ reimagines the familiar Vietnamese tea leaf as a bright, sparkling everyday ritual.', design: 'An oversized wordmark and a single leaf keep the identity simple. Electric lime meets cobalt blue: a small can with a presence that carries from the shelf to the screen.', colors: [['#D9FF43','#191919'],['#293AE2','#FFFFFF'],['#F7F7E9','#191919']], next: 'mua' },
  mua: { name: 'MÙA', title: 'Rooted in the highlands.', image: 'mua-coffee.webp', alt: 'Cream MÙA coffee packaging and a burgundy cup on a terracotta backdrop', sector: 'Coffee & culture', services: 'Identity / Packaging', year: '2026', idea: 'MÙA means season. A coffee concept built around the rhythms of the Central Highlands, where each harvest tells a slightly different story.', design: 'Warm paper, deep red type and a sun rising over abstract fields. The packaging system makes space for the origin and the season, with a bold mark that feels at home on a bag or a café wall.', colors: [['#8B252A','#FFFFFF'],['#EBD9BC','#191919'],['#B65A3B','#FFFFFF']], next: 'song' },
  song: { name: 'SÓNG', title: 'A city in motion.', image: 'song.svg', alt: 'SÓNG music identity with bold white lettering and a lime wave on charcoal', sector: 'Music & culture', services: 'Art direction / Identity / Motion', year: '2026', idea: 'The pulse of a city that never quite stands still. SÓNG is an imagined gathering for independent music and the people who keep it moving.', design: 'Four bold letters, a charcoal field and one lime-green wave. A simple graphic identity that moves to its own quiet rhythm.', colors: [['#171A1B','#FFFFFF'],['#F7F7EB','#191919'],['#D9FF43','#191919']], next: 'vom' },
  vom: { name: 'VÒM', title: 'Room for a new way of living.', image: 'vom.svg', alt: 'VÒM architectural identity with forest green arch forms and pale pink stationery', sector: 'Architecture & spaces', services: 'Strategy / Identity / Digital', year: '2025', idea: 'An open doorway. A quiet corner. VÒM explores an architectural practice shaped around the way people actually live.', design: 'One arch becomes a flexible visual language: a window, a frame, a place to pause. Forest green and soft pink bring a human warmth to a precise, architectural system.', colors: [['#173E31','#FFFFFF'],['#EAD4CA','#191919'],['#F5F0E5','#191919']], next: 'la' },
};
const projectDialog = document.getElementById('project-dialog');
const menuDialog = document.getElementById('site-menu');
const menuToggle = document.querySelector('.menu-toggle');
let activeProject = null;
let returnFocus = null;
let projectHashOwned = false;
let previousHash = '';
let projectCloseTimer;

function showProject(id, trigger) {
  const project = projects[id];
  if (!project) return;
  activeProject = id;
  if (trigger) returnFocus = trigger;
  document.getElementById('case-content').innerHTML = `
    <div class="case-heading"><p>${project.services} / ${project.year}</p><h2 id="case-title">${project.name}</h2><h3>${project.title}</h3></div>
    ${id === 'song' ? '<song-art class="case-song"><img src="assets/song.svg" alt=""></song-art>' : `<img class="case-image" src="assets/${project.image}" alt="${project.alt}" width="1536" height="1024">`}
    <div class="case-story"><dl class="case-facts"><div><dt>Sector</dt><dd>${project.sector}</dd></div><div><dt>Year</dt><dd>${project.year}</dd></div></dl><div><h4>The idea</h4><p>${project.idea}</p><h4>The expression</h4><p>${project.design}</p></div></div>
    <div class="palette" aria-label="Brand colour palette">${project.colors.map(([background,color])=>`<span style="background:${background};color:${color}">${background}</span>`).join('')}</div>
    <p class="case-note">An independent concept project. Brand names and imagery were created for this showcase.</p>`;
  document.getElementById('next-name').textContent = projects[project.next].name;
  window.showcaseLanguage?.refresh();
  clearTimeout(projectCloseTimer);
  projectDialog.classList.remove('is-closing');
  if (!projectDialog.open) projectDialog.showModal();
  window.dispatchEvent(new Event('elseform-project'));
  projectDialog.scrollTop = 0;
  document.querySelector('.close-project').focus({ preventScroll: true });
}

document.querySelectorAll('[data-project]').forEach(link => link.addEventListener('click', event => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  previousHash = location.hash;
  projectHashOwned = true;
  history.pushState(null, '', `#project-${link.dataset.project}`);
  showProject(link.dataset.project, link);
}));
// Slide the dialog out before actually closing it
function hideProject() {
  if (!projectDialog.open || projectDialog.classList.contains('is-closing')) return;
  projectDialog.classList.add('is-closing');
  projectCloseTimer = setTimeout(() => { projectDialog.close(); projectDialog.classList.remove('is-closing'); }, reducedMotion.matches ? 0 : 350);
}
function closeProject() {
  hideProject();
  if (location.hash.startsWith('#project-')) {
    if (projectHashOwned) history.back();
    else history.replaceState(null, '', `${location.pathname}${location.search}${previousHash || '#work'}`);
  }
  projectHashOwned = false;
}
document.querySelector('.close-project').addEventListener('click', closeProject);
projectDialog.addEventListener('cancel', event => { event.preventDefault(); closeProject(); });
projectDialog.addEventListener('close', () => { returnFocus?.focus({ preventScroll: true }); window.dispatchEvent(new Event('elseform-project')); });
projectDialog.addEventListener('click', event => { if (event.target === projectDialog) { const box = projectDialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeProject(); } });
document.querySelector('.next-project').addEventListener('click', () => {
  const next = projects[activeProject].next;
  history.replaceState(null, '', `#project-${next}`);
  showProject(next);
});
function syncHash() {
  const id = location.hash.replace('#project-', '');
  if (location.hash.startsWith('#project-') && projects[id]) showProject(id);
  else hideProject();
}
window.addEventListener('popstate', syncHash);
window.addEventListener('hashchange', syncHash);
syncHash();

const filters = [...document.querySelectorAll('[data-filter]')];
let activeFilter = 'all';
function filterProjects(filter, announce = true) {
  activeFilter = filter;
  filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
  let count = 0;
  document.querySelectorAll('.project').forEach(project => {
    const visible = filter === 'all' || project.dataset.category.split(' ').includes(filter);
    project.hidden = !visible;
    if (visible) count++;
  });
  document.querySelector('#work-title sup').textContent = `(${String(count).padStart(2, '0')})`;
  if (announce) {
    document.getElementById('filter-status').textContent = `${count} projects shown`;
    window.showcaseLanguage?.refresh();
  }
}
filters.forEach(button => button.addEventListener('click', () => filterProjects(button.dataset.filter)));

const closeMenuButton = menuDialog.querySelector('.close-menu');
// Pin the close button over the hamburger so it morphs into an X in place
function placeCloseButton() {
  const toggle = menuToggle.getBoundingClientRect();
  const dialog = menuDialog.getBoundingClientRect();
  closeMenuButton.style.top = `${toggle.top - dialog.top}px`;
  closeMenuButton.style.left = `${toggle.left - dialog.left}px`;
}
addEventListener('resize', () => { if (menuDialog.open) placeCloseButton(); });
menuToggle.addEventListener('click', () => { clearTimeout(closeTimer); menuDialog.classList.remove('is-closing'); menuDialog.showModal(); placeCloseButton(); menuToggle.setAttribute('aria-expanded', 'true'); window.dispatchEvent(new Event('elseform-project')); });
// Play the X → hamburger fold and the wipe before actually closing the dialog
let closeTimer;
function closeMenu() {
  if (!menuDialog.open || menuDialog.classList.contains('is-closing')) return;
  menuDialog.classList.add('is-closing');
  closeTimer = setTimeout(() => { menuDialog.close(); menuDialog.classList.remove('is-closing'); }, reducedMotion.matches ? 0 : 950);
}
closeMenuButton.addEventListener('click', closeMenu);
menuDialog.addEventListener('cancel', event => { event.preventDefault(); closeMenu(); });
menuDialog.addEventListener('close', () => { menuToggle.setAttribute('aria-expanded', 'false'); window.dispatchEvent(new Event('elseform-project')); });
menuDialog.querySelectorAll('nav a').forEach(link => link.addEventListener('click', closeMenu));

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const word = document.getElementById('changing-word');
const typedText = word.querySelector('.typewriter-text');
const readableText = word.querySelector('[data-typewriter-label]');
const words = ['IDENTITIES.', 'EMOTIONS.', 'IMPACT.'];
const segmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter('vi', { granularity: 'grapheme' }) : null;
const characters = text => segmenter ? [...segmenter.segment(text)].map(part => part.segment) : Array.from(text.normalize('NFC'));
let wordIndex = 0;
let wordTimer;
let heroVisible = true;
const localizedWord = () => window.showcaseLanguage?.translate(words[wordIndex]) || words[wordIndex];
const canType = () => heroVisible && !reducedMotion.matches && !document.hidden && !projectDialog.open && !menuDialog.open;

function scheduleNextWord() {
  if (canType()) wordTimer = setTimeout(changeWord, 2100);
}
function changeWord() {
  if (!canType()) return;
  wordIndex = (wordIndex + 1) % words.length;
  const target = characters(localizedWord());
  const visible = characters(typedText.textContent);
  let shared = 0;
  while (shared < visible.length && shared < target.length && visible[shared] === target[shared]) shared++;
  readableText.textContent = target.join('');
  word.classList.add('is-typing');
  function step() {
    if (!canType()) return;
    let delay;
    if (visible.length > shared) {
      visible.pop();
      delay = visible.length === shared ? 120 : 22;
    } else {
      typeCharacter();
      return;
    }
    typedText.textContent = visible.join('');
    wordTimer = setTimeout(step, delay);
  }
  function typeCharacter() {
    if (!canType()) return;
    if (visible.length < target.length) {
      visible.push(target[visible.length]);
      typedText.textContent = visible.join('');
      const character = visible.at(-1);
      wordTimer = setTimeout(typeCharacter, character === ' ' ? 30 : 35 + Math.random() * 25);
    } else {
      word.classList.remove('is-typing');
      scheduleNextWord();
    }
  }
  step();
}
function resetTypewriter() {
  clearTimeout(wordTimer);
  word.classList.remove('is-typing');
  if (reducedMotion.matches) wordIndex = 0;
  typedText.textContent = readableText.textContent = localizedWord();
  document.body.classList.toggle('motion-paused', reducedMotion.matches);
  window.dispatchEvent(new Event('elseform-motion'));
  scheduleNextWord();
}
const heroObserver = new IntersectionObserver(entries => {
  const next = entries[0].isIntersecting;
  if (next !== heroVisible) { heroVisible = next; resetTypewriter(); }
});
heroObserver.observe(document.querySelector('.hero-statement'));
reducedMotion.addEventListener('change', resetTypewriter);
document.addEventListener('visibilitychange', resetTypewriter);
window.addEventListener('elseform-project', resetTypewriter);
window.addEventListener('showcase-language', () => {
  resetTypewriter();
  filterProjects(activeFilter, false);
});
resetTypewriter();

document.querySelectorAll('.services details').forEach(details => {
  const summary = details.querySelector('summary');
  let animation;
  summary.addEventListener('click', event => {
    if (reducedMotion.matches || !details.animate) return;
    event.preventDefault();
    const opening = !details.open || details.classList.contains('is-closing');
    const start = details.getBoundingClientRect().height;
    animation?.cancel();
    details.classList.toggle('is-closing', !opening);
    if (opening) details.open = true;
    const end = (opening ? details : summary).getBoundingClientRect().height;
    animation = details.animate({ height: [`${start}px`, `${end}px`] }, { duration: 450, easing: 'cubic-bezier(.6,0,.2,1)', fill: 'forwards' });
    animation.onfinish = () => {
      if (!opening) details.open = false;
      details.classList.remove('is-closing');
      animation.cancel();
      animation = null;
    };
  });
});

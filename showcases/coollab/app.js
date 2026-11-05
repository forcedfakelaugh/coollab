const projects = [
  {
    id: 'editorial', title: 'Cultural editions', category: 'Brand identity · 2026',
    alt: 'Ivory publications, architectural photographs, stone and orange paper arranged in sunlight',
    intro: 'A publication about culture, people and the spaces between them. An identity that asks you to slow down and look a little closer.',
    body: 'Warm uncoated paper meets quiet architectural photography. An orange accent threads through the books, cards and material samples, giving a family of objects one recognisable voice.',
    colours: ['#E9E4D9', '#B9B5AA', '#E95312', '#33332F'],
  },
  {
    id: 'interior', title: 'Living spaces', category: 'Website · 2026',
    alt: 'A sculptural ivory chair and travertine table in a sunlit, quiet interior',
    intro: 'A digital home for spaces designed around everyday life. Quiet, generous and shaped by the way light moves through a room.',
    body: 'Large photographs, considered typography and an unhurried rhythm let the architecture lead. The website carries the warmth of natural materials into a simple, intuitive browsing experience.',
    colours: ['#E4DBCB', '#B6A58B', '#82775D', '#34382B'],
  },
  {
    id: 'ceramics', title: 'The craft workshop', category: 'Art direction · 2026',
    alt: 'Three handmade ivory ceramic forms on limestone plinths in afternoon light',
    intro: 'A study of the hand behind the object. Imperfect edges, expressive forms and the small variations that make each piece its own.',
    body: 'We bring the collection into a gallery of light and shadow. Stone plinths and a restrained palette give every curve, fold and surface room to speak.',
    colours: ['#EBE1D0', '#CABC9F', '#A4977E', '#C44B15'],
  },
];

const dialog = document.querySelector('#project-dialog');
const title = document.querySelector('#case-title');
const picture = document.querySelector('#case-image');
let current = 0;

function renderProject(index) {
  current = (index + projects.length) % projects.length;
  const project = projects[current];
  title.textContent = project.title;
  document.querySelector('#case-number').textContent = String(current + 1).padStart(2, '0');
  document.querySelector('#case-category').textContent = project.category;
  document.querySelector('#case-intro').textContent = project.intro;
  document.querySelector('#case-body').textContent = project.body;
  document.querySelector('#next-title').textContent = projects[(current + 1) % projects.length].title;
  picture.alt = project.alt;
  picture.sizes = '(max-width: 600px) 100vw, (max-width: 1332px) calc(100vw - 72px), 1260px';
  picture.srcset = `./assets/${project.id}-640.webp 640w, ./assets/${project.id}-960.webp 960w, ./assets/${project.id}-1536.webp 1536w`;
  picture.src = `./assets/${project.id}-1536.webp`;
  document.querySelectorAll('.case-colours span').forEach((swatch, i) => {
    swatch.style.background = project.colours[i];
    swatch.style.color = i < 2 ? '#282821' : '#ffffff';
    swatch.textContent = project.colours[i];
    swatch.setAttribute('data-no-translate', '');
  });
  window.showcaseLanguage?.refresh();
  dialog.scrollTop = 0;
}

document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    renderProject(projects.findIndex(project => project.id === button.dataset.project));
    dialog.showModal();
    title.focus({ preventScroll: true });
  });
});
document.querySelector('.case-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
function stepProject(direction) {
  renderProject(current + direction);
  title.focus({ preventScroll: true });
}
document.querySelector('#previous-project').addEventListener('click', () => stepProject(-1));
document.querySelector('#next-project').addEventListener('click', () => stepProject(1));
dialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    stepProject(event.key === 'ArrowRight' ? 1 : -1);
  }
});

const menu = document.querySelector('.main-nav');
const menuToggle = document.querySelector('.menu-toggle');
function setMenu(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  menu.classList.toggle('is-open', open);
}
menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuToggle.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.header')) setMenu(false);
});
matchMedia('(min-width: 601px)').addEventListener('change', () => setMenu(false));

// One expanded service keeps the editorial rhythm compact without moving focus.
const services = [...document.querySelectorAll('.service-list details')];
services.forEach(service => service.addEventListener('toggle', () => {
  if (service.open) services.filter(other => other !== service).forEach(other => { other.open = false; });
}));

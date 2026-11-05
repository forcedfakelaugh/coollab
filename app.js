const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
const closeMenu = () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Mở menu');
  mobileNav.hidden = true;
};
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
  mobileNav.hidden = !open;
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav.hidden) {
    closeMenu();
    menuButton.focus();
  }
});
matchMedia('(min-width: 541px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

const dialog = document.querySelector('.project-dialog');
const projects = [...document.querySelectorAll('.project')];
const caseImage = document.querySelector('#case-image');
const loading = document.querySelector('.case-loading');
let activeProject = 0;
let lastTrigger;

function showProject(index) {
  activeProject = (index + projects.length) % projects.length;
  const project = projects[activeProject];
  const link = project.querySelector('.project-link');
  document.querySelector('#case-title').textContent = project.dataset.title;
  document.querySelector('#case-category').textContent = project.dataset.category;
  document.querySelector('#case-description').textContent = project.dataset.description;
  document.querySelector('#case-source').href = link.href;
  document.querySelector('#case-position').textContent = `${String(activeProject + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}`;
  caseImage.hidden = true;
  loading.hidden = false;
  loading.textContent = 'Đang tải dự án…';
  caseImage.alt = `Toàn bộ thiết kế dự án ${project.dataset.title}`;
  caseImage.src = project.dataset.detail;
  if (!dialog.open) {
    dialog.showModal();
    document.body.classList.add('modal-open');
  }
  dialog.scrollTop = 0;
  document.querySelector('.close-dialog').focus({ preventScroll: true });
}

caseImage.addEventListener('load', () => {
  loading.hidden = true;
  caseImage.hidden = false;
});
caseImage.addEventListener('error', () => {
  loading.textContent = 'Không tải được hình ảnh. Bạn có thể xem dự án qua liên kết Figma ở trên.';
  loading.hidden = false;
});
projects.forEach((project, index) => {
  project.querySelector('.project-link').addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0 || !dialog.showModal) return;
    event.preventDefault();
    lastTrigger = event.currentTarget;
    showProject(index);
  });
});
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
document.querySelector('#next-project').addEventListener('click', () => showProject(activeProject + 1));
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  lastTrigger?.focus({ preventScroll: true });
});

const sectionLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) sectionLinks.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
    }
  }, { rootMargin: '-10% 0px -55% 0px' });
  document.querySelectorAll('#work, #studio, #services, #contact').forEach(section => observer.observe(section));
}

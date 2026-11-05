const looks = {
  '10': {
    title: ['Marvin', 'Trenchcoat'], color: 'Khaki', swatch: '#88836c',
    copy: 'Một dáng áo dài, thả nhẹ trên vai. Sắc khaki đi cùng những ngày muốn mặc thật đơn giản.',
    alt: 'Marvin Trenchcoat màu khaki, diện mạo 10.',
    products: [{ name: 'MARVIN TRENCHCOAT', color: 'Khaki', url: 'https://wephobia.com/en/product/marvin-trenchcoat-khaki/' }]
  },
  '11': {
    title: ['Marvin', 'Trenchcoat'], color: 'Brown', swatch: '#51433b',
    copy: 'Sắc nâu trầm, một chiếc thắt lưng gọn. Cùng dáng Marvin, thêm một cách để bạn thay đổi diện mạo.',
    alt: 'Marvin Trenchcoat màu nâu với thắt lưng, diện mạo 11.',
    products: [{ name: 'MARVIN TRENCHCOAT', color: 'Brown', url: 'https://wephobia.com/en/product/marvin-trenchcoat-brown/' }]
  },
  '08': {
    title: ['Brenda', 'Trenchcoat'], color: 'Tan / Black', swatch: '#b69a5c',
    copy: 'Cổ áo thắt nhẹ, vạt áo buông tự nhiên. Brenda màu tan đi cùng quần Rian đen trong diện mạo này.',
    alt: 'Brenda Trenchcoat màu tan kết hợp Rian Trousers màu đen, diện mạo 08.',
    products: [
      { name: 'BRENDA TRENCHCOAT', color: 'Tan', url: 'https://wephobia.com/en/product/brenda-trenchcoat-tan/' },
      { name: 'RIAN TROUSERS', color: 'Black', url: 'https://wephobia.com/en/product/rian-trousers-black/' }
    ]
  }
};

let activeLook = '10';
let dialogTrigger;
let lookRequest = 0;
let pendingLook = activeLook;
const imageCache = new Map();
const imageSizes = '(max-width: 700px) calc(100vw - 32px), (max-width: 1100px) 46vw, 520px';
const lookPanel = document.querySelector('#look-panel');
const lookStatus = document.querySelector('#look-status');
const imageError = document.querySelector('#image-error');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let imageAnimation;

function loadLookImage(id) {
  if (imageCache.has(id)) return imageCache.get(id);
  const image = new Image();
  image.sizes = imageSizes;
  image.srcset = `assets/look${id}-480.webp 480w, assets/look${id}-1000.webp 1000w`;
  image.src = `assets/look${id}-1000.webp`;
  const ready = image.decode().then(() => image).catch(error => {
    imageCache.delete(id);
    throw error;
  });
  imageCache.set(id, ready);
  return ready;
}
const dialog = document.querySelector('#look-dialog');
const lookButtons = [...document.querySelectorAll('[data-look]')];

async function setLook(id) {
  const look = looks[id];
  if (!look) return;
  const retrying = document.activeElement === document.querySelector('#retry-look');
  const request = ++lookRequest;
  pendingLook = id;
  imageError.hidden = true;
  lookPanel.setAttribute('aria-busy', 'true');
  lookStatus.textContent = `Đang tải diện mạo ${id}.`;
  try {
    await loadLookImage(id);
  } catch {
    if (request !== lookRequest) return;
    lookPanel.setAttribute('aria-busy', 'false');
    imageError.hidden = false;
    if (retrying) document.querySelector('#retry-look').focus({ preventScroll: true });
    lookStatus.textContent = `Chưa tải được diện mạo ${id}. Bạn có thể thử lại.`;
    return;
  }
  if (request !== lookRequest) return;
  activeLook = id;
  const image = document.querySelector('#active-look-image');
  image.sizes = imageSizes;
  image.srcset = `assets/look${id}-480.webp 480w, assets/look${id}-1000.webp 1000w`;
  image.src = `assets/look${id}-1000.webp`;
  image.alt = look.alt;
  document.querySelector('#active-look-number').textContent = `LOOK ${id}`;
  document.querySelector('#look-counter').textContent = id;
  document.querySelector('#active-look-category').textContent = `FW.26 / LOOK ${id}`;
  const title = document.querySelector('#active-look-title');
  title.replaceChildren(document.createTextNode(look.title[0]), document.createElement('br'), document.createTextNode(look.title[1]));
  const color = document.querySelector('#active-look-color');
  const dot = document.createElement('span');
  dot.className = 'color-dot';
  dot.style.setProperty('--swatch', look.swatch);
  color.replaceChildren(dot, document.createTextNode(look.color));
  document.querySelector('#active-look-copy').textContent = look.copy;
  for (const button of lookButtons) {
    const selected = button.dataset.look === id;
    button.setAttribute('aria-pressed', String(selected));
    button.classList.toggle('is-active', selected);
  }
  lookPanel.setAttribute('aria-busy', 'false');
  lookStatus.textContent = `Diện mạo ${id}: ${look.title.join(' ')}, ${look.color}.`;
  if (retrying) lookButtons.find(button => button.dataset.look === id)?.focus({ preventScroll: true });
  imageAnimation?.cancel();
  if (!reducedMotion.matches) {
    imageAnimation = image.animate([{ opacity: .65 }, { opacity: 1 }], { duration: 280, easing: 'cubic-bezier(.16, 1, .3, 1)' });
  }
}

function openLook(id, trigger) {
  const look = looks[id];
  if (!look) return;
  dialogTrigger = trigger;
  const image = document.querySelector('#dialog-image');
  image.sizes = '(max-width: 700px) calc(100vw - 24px), 470px';
  image.srcset = `assets/look${id}-480.webp 480w, assets/look${id}-1000.webp 1000w`;
  image.src = `assets/look${id}-1000.webp`;
  image.alt = look.alt;
  document.querySelector('#dialog-look-number').textContent = `FW.26 / LOOK ${id}`;
  document.querySelector('#dialog-source').href = `https://wephobia.com/en/collection/fw26-look${id}/`;
  const products = document.querySelector('#dialog-products');
  products.replaceChildren();
  for (const product of look.products) {
    const article = document.createElement('article');
    article.className = 'dialog-product';
    const name = document.createElement('h3');
    name.textContent = product.name;
    const color = document.createElement('p');
    color.textContent = product.color;
    const link = document.createElement('a');
    link.href = product.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.append(document.createTextNode('Xem tại WEPHOBIA'));
    const arrow = document.createElement('span');
    arrow.textContent = '→';
    arrow.setAttribute('aria-hidden', 'true');
    link.append(arrow);
    article.append(name, color, link);
    products.append(article);
  }
  document.body.classList.add('dialog-open');
  dialog.showModal();
  dialog.scrollTop = 0;
  document.querySelector('#dialog-close').focus();
}

for (const [index, button] of lookButtons.entries()) {
  button.addEventListener('click', () => setLook(button.dataset.look));
  button.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % lookButtons.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + lookButtons.length) % lookButtons.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = lookButtons.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    lookButtons[next].focus();
    setLook(lookButtons[next].dataset.look);
  });
}
for (const selector of ['#view-look-button', '#image-detail-button']) {
  document.querySelector(selector).addEventListener('click', event => openLook(activeLook, event.currentTarget));
}
document.querySelectorAll('[data-open-look]').forEach(button => {
  button.addEventListener('click', () => openLook(button.dataset.openLook, button));
});
document.querySelector('#dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const box = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  dialogTrigger?.focus({ preventScroll: true });
});

// Warm only the small curated selection as the visitor approaches the lookbook.
// The currently displayed image stays visible until its replacement decodes.
const preloadLooks = () => {
  for (const id of Object.keys(looks)) loadLookImage(id).catch(() => {});
};
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    observer.disconnect();
    preloadLooks();
  }, { rootMargin: '600px' });
  observer.observe(document.querySelector('#looks'));
}
document.querySelector('#retry-look').addEventListener('click', () => setLook(pendingLook));
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) imageAnimation?.cancel();
});

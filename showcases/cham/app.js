'use strict';
// Use the shared SVG component with Chàm's smaller icon variant.
const arrowUpRight = window.portfolioIcons.arrow('up-right', 'cham');
const products = [
  { id: 'jacket', name: 'The Dye-House Jacket', category: 'Clothing', color: 'Washed indigo', dips: 8, price: 185, image: 'jacket-editorial', sizes: ['XS', 'S', 'M', 'L'], description: 'A boxy work jacket that fades along every seam. Imagined for market mornings, motorbike rides and the years after.' },
  { id: 'set', name: 'The Leaf Set', category: 'Clothing', color: 'Night indigo', dips: 14, price: 210, image: 'set-editorial', sizes: ['XS', 'S', 'M', 'L'], description: 'A relaxed tunic and trouser with pale leaf embroidery. A conceptual pairing for warm evenings and long dinners.' },
  { id: 'scarf', name: 'The Resist-Print Scarf', category: 'Accessories', color: 'Indigo and undyed', dips: 5, price: 65, image: 'scarf-editorial', sizes: ['One size'], description: 'The pattern comes from binding the cloth before each dip, so no two are alike. Imagined in light cotton for heat, wind and sun.' },
  { id: 'wrap', name: 'The Deep-Dip Wrap', category: 'Accessories', color: 'Deepest indigo', dips: 20, price: 95, image: 'wrap-editorial', sizes: ['One size'], description: 'A long cotton wrap dipped until it is almost black-blue. Wear it, sit on it, pack it for the night bus north.' }
];
const cart = [];
const money = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
const pad = value => String(value).padStart(2, '0');
const dipLabel = count => `${count} ${count === 1 ? 'dip' : 'dips'}`;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Illustrative shade stops for the colour card and local fabric preview.
const stops = [[1, [213, 223, 235]], [3, [167, 186, 211]], [6, [108, 136, 174]], [10, [52, 80, 125]], [20, [20, 29, 51]]];
function shadeFor(dips) {
  const upper = stops.findIndex(([at]) => at >= dips);
  if (upper <= 0) return `rgb(${stops[Math.max(upper, 0)][1]})`;
  const [fromAt, from] = stops[upper - 1]; const [toAt, to] = stops[upper];
  const t = (dips - fromAt) / (toAt - fromAt);
  return `rgb(${from.map((value, i) => Math.round(value + (to[i] - value) * t))})`;
}
const shadeName = dips => dips <= 2 ? 'Sky' : dips <= 4 ? 'Washed' : dips <= 8 ? 'Mid' : dips <= 15 ? 'Night' : 'Deepest';

let toastTimer;
function showToast(message) { const toast = document.querySelector('#toast'); toast.textContent = message; toast.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('visible'), 2600); }
function openDialog(id) { document.querySelector(id).showModal(); document.body.classList.add('modal-open'); }
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('close', () => { if (!document.querySelector('dialog[open]')) document.body.classList.remove('modal-open'); });
  dialog.addEventListener('click', event => { const rect = dialog.getBoundingClientRect(); if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close(); });
});
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.close).close()));

// Twenty steps, with accessible labels and a compact visual colour scale.
document.querySelector('#shade-card').innerHTML = Array.from({ length: 20 }, (_, i) =>
  `<li style="--shade:${shadeFor(i + 1)}" aria-label="${dipLabel(i + 1)}"></li>`
).join('');

// One consistent editorial photograph per piece.
const ledger = document.querySelector('#ledger');
ledger.innerHTML = products.map((product, index) => `<div class="ledger-row" role="listitem" style="--shade:${shadeFor(product.dips)}"><button type="button" data-product="${product.id}" aria-label="View ${product.name}"><span class="row-media"><img src="assets/${product.image}.jpg" alt="" width="1024" height="1536" loading="lazy"><span class="row-arrow" aria-hidden="true">${arrowUpRight}</span></span><span class="row-info"><span class="row-no">No. ${pad(index + 1)}</span><span class="row-name">${product.name}</span><span class="row-price">${money(product.price)}</span><span class="row-shade"><i></i><span>${product.color}</span></span></span></button></div>`).join('');
ledger.querySelectorAll('[data-product]').forEach(button => button.addEventListener('click', () => showProduct(button.dataset.product)));

function showProduct(id) {
  const product = products.find(item => item.id === id);
  let selectedSize = product.sizes.includes('M') ? 'M' : product.sizes[0];
  document.querySelector('#product-detail').innerHTML = `<div class="detail-layout"><img src="assets/${product.image}.jpg" alt="${product.name}"><div class="detail-copy"><p class="kicker">${product.category}</p><h2 id="product-title">${product.name}</h2><p class="detail-price">${money(product.price)}</p><p>${product.description}</p><p class="detail-shade" style="--shade:${shadeFor(product.dips)}"><i></i><span>${product.color}</span><span>${dipLabel(product.dips)}</span></p><p class="size-label" id="size-label">Select size</p><div class="sizes" role="group" aria-labelledby="size-label">${product.sizes.map(size => `<button type="button" class="${size === selectedSize ? 'selected' : ''}" aria-pressed="${size === selectedSize}" data-size="${size}">${size}</button>`).join('')}</div><button type="button" id="add-to-bag" class="primary">Add to bag - ${money(product.price)}</button><p class="detail-note">Concept product · USD pricing · No real purchases</p></div></div>`;
  document.querySelectorAll('[data-size]').forEach(button => button.addEventListener('click', () => { selectedSize = button.dataset.size; document.querySelectorAll('[data-size]').forEach(item => { item.classList.toggle('selected', item === button); item.setAttribute('aria-pressed', String(item === button)); }); }));
  document.querySelector('#add-to-bag').addEventListener('click', () => { const existing = cart.find(item => item.id === id && item.size === selectedSize); if (existing) existing.quantity += 1; else cart.push({ id, size: selectedSize, quantity: 1 }); updateCount(); document.querySelector('#product-dialog').close(); showToast(`${product.name} added to your bag`); });
  openDialog('#product-dialog');
}

function updateCount() { document.querySelector('#bag-count').textContent = cart.reduce((sum, item) => sum + item.quantity, 0); }
function renderCart() {
  const container = document.querySelector('#cart-items'); const bottom = document.querySelector('#cart-bottom');
  if (!cart.length) { container.innerHTML = '<p class="empty-bag">Nothing in the vat yet.</p>'; bottom.innerHTML = '<button type="button" class="primary" id="continue-shopping">Explore the collection</button><p>Your bag is empty. This is a simulated shopping experience.</p>'; document.querySelector('#continue-shopping').addEventListener('click', () => { document.querySelector('#cart-dialog').close(); document.querySelector('#pieces').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); }); return; }
  container.innerHTML = cart.map((item, index) => { const product = products.find(p => p.id === item.id); return `<div class="cart-item"><img src="assets/${product.image}.jpg" alt="${product.name}"><div><h3>${product.name}</h3><p>${product.color} / ${item.size}</p><div class="quantity"><button type="button" data-quantity="${index}" data-change="-1" aria-label="Decrease quantity of ${product.name}">−</button><span aria-label="Quantity">${item.quantity}</span><button type="button" data-quantity="${index}" data-change="1" aria-label="Increase quantity of ${product.name}">+</button></div></div><div class="item-right">${money(product.price * item.quantity)}<button type="button" class="remove" data-remove="${index}" aria-label="Remove ${product.name}">Remove</button></div></div>`; }).join('');
  const subtotal = cart.reduce((sum, item) => sum + products.find(p => p.id === item.id).price * item.quantity, 0);
  bottom.innerHTML = `<div class="total"><span>Subtotal</span><strong>${money(subtotal)}</strong></div><button type="button" class="primary" id="demo-checkout">Try demo checkout ${arrowUpRight}</button><p>USD · Concept pricing. Shipping and tax are not calculated.</p><p>No payment or personal information is collected.</p>`;
  document.querySelectorAll('[data-quantity]').forEach(button => button.addEventListener('click', () => { const index = Number(button.dataset.quantity); cart[index].quantity += Number(button.dataset.change); if (cart[index].quantity <= 0) cart.splice(index, 1); updateCount(); renderCart(); }));
  document.querySelectorAll('[data-remove]').forEach(button => button.addEventListener('click', () => { cart.splice(Number(button.dataset.remove), 1); updateCount(); renderCart(); }));
  document.querySelector('#demo-checkout').addEventListener('click', () => { container.innerHTML = '<div class="checkout-success" role="status"><p class="kicker">The end of our little demo</p><h3>Dyed, aired, <em>done.</em></h3><p>You’ve completed the concept shopping journey. No order was placed, and no payment was taken.</p><p>Like the experience? There’s more to explore in Lucas’s portfolio.</p></div>'; bottom.innerHTML = `<a class="primary" href="../../">Back to the portfolio ${arrowUpRight}</a>`; cart.length = 0; updateCount(); });
}
document.querySelector('#open-bag').addEventListener('click', () => { renderCart(); openDialog('#cart-dialog'); });

// Dip slider in the process section.
const range = document.querySelector('#dip-range');
function updateDip() {
  const dips = Number(range.value);
  const swatch = document.querySelector('#dip-swatch');
  swatch.style.background = shadeFor(dips);
  swatch.classList.toggle('on-dark', dips >= 6);
  document.querySelector('#dip-big').textContent = pad(dips);
  document.querySelector('#dip-count').textContent = dipLabel(dips);
  document.querySelector('#dip-shade').textContent = shadeName(dips);
}
range.addEventListener('input', updateDip);
updateDip();

// Scrolling slowly dyes the page. Foreground tones are chosen for the actual
// background, so body copy stays legible throughout the middle shades too.
const pageShades = [[0, [245, 242, 235]], [.2, [217, 225, 229]], [.47, [119, 147, 172]], [.72, [52, 79, 109]], [1, [23, 43, 67]]];
const mix = (a, b, amount) => a.map((value, index) => Math.round(value + (b[index] - value) * amount));
const rgb = color => `rgb(${color.join(',')})`;
function luminance(color) {
  const linear = color.map(value => { const channel = value / 255; return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4; });
  return linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722;
}
function readableTone(preferred, background, extreme) {
  const backgroundLight = luminance(background);
  for (let step = 0; step <= 20; step++) {
    const tone = mix(preferred, extreme, step / 20);
    const light = luminance(tone);
    if ((Math.max(light, backgroundLight) + .05) / (Math.min(light, backgroundLight) + .05) >= 4.5) return tone;
  }
  return extreme;
}
let shadeFrame = 0;
function dyePageOnScroll() {
  shadeFrame = 0;
  const root = document.documentElement;
  const distance = root.scrollHeight - innerHeight;
  const progress = distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0;
  const next = Math.max(1, pageShades.findIndex(([stop]) => stop >= progress));
  const [fromAt, from] = pageShades[next - 1];
  const [toAt, to] = pageShades[next];
  const background = mix(from, to, (progress - fromAt) / (toAt - fromAt));
  const lightText = luminance(background) < .179;
  const extreme = lightText ? [255, 255, 255] : [0, 0, 0];
  const foreground = readableTone(lightText ? [245, 242, 235] : [36, 60, 81], background, extreme);
  const muted = readableTone(lightText ? [202, 214, 224] : [99, 112, 120], background, extreme);
  const accent = readableTone(lightText ? [208, 222, 233] : [76, 100, 123], background, extreme);
  root.style.setProperty('--page-bg', rgb(background));
  root.style.setProperty('--fg', rgb(foreground));
  root.style.setProperty('--muted', rgb(muted));
  root.style.setProperty('--hero-accent', rgb(accent));
  root.style.setProperty('--rule', rgb(mix(background, foreground, .23)));
}
function queuePageShade() { if (!shadeFrame) shadeFrame = requestAnimationFrame(dyePageOnScroll); }
if (!reduceMotion) {
  addEventListener('scroll', queuePageShade, { passive: true });
  addEventListener('resize', queuePageShade);
  addEventListener('showcase-language', queuePageShade);
  addEventListener('load', queuePageShade, { once: true });
  document.fonts.ready.then(queuePageShade);
  dyePageOnScroll();
}

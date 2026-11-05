'use strict';
const $ = selector => document.querySelector(selector);
const vnd = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫';
const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const categories = [['featured', 'House favourites'], ['noodles', 'Noodles'], ['rice', 'Rice & bánh mì'], ['small', 'Small plates'], ['breakfast', 'Breakfast'], ['drinks', 'Coffee & drinks'], ['all', 'Full menu']];
const houseFavourites = new Set(['caolau', 'miquangchay', 'banhmi', 'caphe']);
const diets = [['vegetarian', 'Vegetarian'], ['vegan', 'Vegan'], ['gf', 'Gluten-free'], ['mild', 'Not spicy']];
const tagNames = { vegetarian: 'Vegetarian', vegan: 'Vegan', gf: 'Gluten-free', spicy: 'Spicy' };

const dishes = [
  { id: 'caolau', cat: 'noodles', name: 'Cao lầu', vn: 'Hội An’s own noodle', desc: 'Chewy ash-water noodles, char siu pork, crackling, herbs and a spoon of broth.', price: 75000, tags: [] },
  { id: 'miquang', cat: 'noodles', name: 'Mì Quảng gà', vn: 'Turmeric noodles', desc: 'Flat turmeric noodles, free-range chicken, peanuts, sesame cracker.', price: 70000, tags: ['spicy'] },
  { id: 'miquangchay', cat: 'noodles', name: 'Mì Quảng chay', vn: 'Vegan turmeric noodles', desc: 'Tofu, king oyster mushroom, banana flower and lime leaf broth.', price: 65000, tags: ['vegetarian', 'vegan'] },
  { id: 'phobo', cat: 'noodles', name: 'Phở bò tái', vn: 'Rare beef phở', desc: 'Twelve-hour bone broth, rice noodles, rare sirloin, Thai basil.', price: 85000, tags: ['gf'] },
  { id: 'banhmi', cat: 'rice', name: 'Bánh mì Rêu', vn: 'House bánh mì', desc: 'Wood-oven roll, pâté, roast pork, pickles, chilli jam and coriander.', price: 45000, tags: ['spicy'] },
  { id: 'banhmichay', cat: 'rice', name: 'Bánh mì chay', vn: 'Vegan bánh mì', desc: 'Lemongrass tofu, mushroom pâté, pickled daikon, cucumber.', price: 40000, tags: ['vegetarian', 'vegan'] },
  { id: 'comga', cat: 'rice', name: 'Cơm gà Hội An', vn: 'Chicken rice', desc: 'Turmeric rice cooked in chicken stock, shredded chicken, papaya salad.', price: 70000, tags: ['gf'] },
  { id: 'comtam', cat: 'rice', name: 'Cơm tấm sườn', vn: 'Broken rice & pork chop', desc: 'Lemongrass-grilled pork chop, egg meatloaf, scallion oil.', price: 80000, tags: ['gf'] },
  { id: 'xoi', cat: 'breakfast', name: 'Xôi lá dứa', vn: 'Pandan sticky rice', desc: 'Pandan sticky rice, mung bean, fried shallot and coconut.', price: 35000, tags: ['vegetarian', 'vegan', 'gf'] },
  { id: 'bunbo', cat: 'breakfast', name: 'Bún bò Huế', vn: 'Spicy Huế noodle soup', desc: 'Lemongrass and shrimp-paste broth, beef shank, chilli satế.', price: 75000, tags: ['spicy', 'gf'] },
  { id: 'opla', cat: 'breakfast', name: 'Ốp la', vn: 'Sizzling eggs', desc: 'Two eggs on a hot pan with pâté, tomato and a crusty roll.', price: 50000, tags: ['vegetarian'] },
  { id: 'hoanhthanh', cat: 'small', name: 'Hoành thánh chiên', vn: 'Hội An fried wontons', desc: 'Crisp wontons topped with sweet-sour tomato, shrimp and pork.', price: 60000, tags: [] },
  { id: 'goicuon', cat: 'small', name: 'Gỏi cuốn chay', vn: 'Fresh spring rolls', desc: 'Rice paper, herbs, tofu and vermicelli with peanut-hoisin dip.', price: 45000, tags: ['vegetarian', 'vegan', 'gf'] },
  { id: 'banhxeo', cat: 'small', name: 'Bánh xèo', vn: 'Crispy turmeric crêpe', desc: 'Shrimp, pork and bean sprouts, wrapped in mustard greens.', price: 65000, tags: ['gf'] },
  { id: 'caphe', cat: 'drinks', name: 'Cà phê sữa đá', vn: 'Phin iced coffee', desc: 'Dark-roast robusta through a phin, condensed milk, ice.', price: 30000, tags: ['vegetarian', 'gf'] },
  { id: 'caphemuoi', cat: 'drinks', name: 'Cà phê muối', vn: 'Salted cream coffee', desc: 'Huế-style coffee under a lightly salted cream cap.', price: 40000, tags: ['vegetarian', 'gf'] },
  { id: 'nuocmia', cat: 'drinks', name: 'Nước mía tắc', vn: 'Sugarcane & kumquat', desc: 'Pressed to order with calamansi and a little ginger.', price: 25000, tags: ['vegetarian', 'vegan', 'gf'] }
];

const state = { cat: 'featured', diets: new Set(), basket: new Map() };
const announce = message => { $('#announce').textContent = ''; requestAnimationFrame(() => { $('#announce').textContent = message; }); };

function renderFilters() {
  $('#categories').innerHTML = categories.map(([id, label]) => `<button type="button" class="chip" data-cat="${id}" aria-pressed="${id === state.cat}">${label}${id === 'all' ? ` · ${dishes.length}` : ''}</button>`).join('');
  $('#diets').innerHTML = '<span class="diet-label" aria-hidden="true">Dietary</span>' + diets.map(([id, label]) => `<button type="button" class="chip" data-diet="${id}" aria-pressed="${state.diets.has(id)}">${label}</button>`).join('');
}

function matches(dish) {
  if (state.cat === 'featured' && !houseFavourites.has(dish.id)) return false;
  if (state.cat !== 'all' && state.cat !== 'featured' && dish.cat !== state.cat) return false;
  for (const diet of state.diets) {
    if (diet === 'mild' ? dish.tags.includes('spicy') : !dish.tags.includes(diet)) return false;
  }
  return true;
}

function renderMenu() {
  const list = dishes.filter(matches);
  $('#result-count').textContent = `${list.length} ${list.length === 1 ? 'dish' : 'dishes'} shown`;
  if (!list.length) {
    $('#menu-grid').innerHTML = '<li class="no-results"><p>No dishes match those filters.</p><button type="button" class="btn btn-ghost" data-reset>Clear filters</button></li>';
    return;
  }
  $('#menu-grid').innerHTML = list.map(d => {
    const qty = state.basket.get(d.id) || 0;
    const tags = d.tags.map(t => `<li class="${t}">${tagNames[t]}</li>`).join('');
    return `<li class="dish"><div class="dish-body"><h3>${d.name}</h3><p>${d.desc}</p>${tags ? `<ul class="tags" aria-label="Dietary tags">${tags}</ul>` : ''}</div><div class="dish-foot"><span class="price">${vnd(d.price)}</span><button type="button" class="add${qty ? ' added' : ''}" data-add="${d.id}" aria-label="Add ${escapeHtml(d.name)} to basket${qty ? `, ${qty} in basket` : ''}">${qty ? `Add · ${qty}` : 'Add'}</button></div></li>`;
  }).join('');
}

function totals() {
  let count = 0, subtotal = 0;
  for (const [id, qty] of state.basket) { count += qty; subtotal += dishes.find(d => d.id === id).price * qty; }
  const packaging = count ? 5000 : 0;
  return { count, subtotal, packaging, total: subtotal + packaging };
}

function renderBasket() {
  const lines = [...state.basket].map(([id, qty]) => {
    const d = dishes.find(x => x.id === id);
    return `<li class="line"><span class="line-name">${d.name}</span><span class="line-price">${vnd(d.price * qty)}</span><div class="qty" role="group" aria-label="Quantity of ${escapeHtml(d.name)}"><button type="button" data-dec="${id}" aria-label="Remove one ${escapeHtml(d.name)}">−</button><output aria-live="off">${qty}</output><button type="button" data-inc="${id}" aria-label="Add one more ${escapeHtml(d.name)}">+</button></div><button type="button" class="remove" data-remove="${id}">Remove<span class="sr-only"> ${escapeHtml(d.name)}</span></button></li>`;
  }).join('');
  $('#basket-list').innerHTML = lines;
  const t = totals();
  $('#basket-empty').hidden = t.count > 0;
  $('#subtotal').textContent = vnd(t.subtotal);
  $('#packaging').textContent = vnd(t.packaging);
  $('#total').textContent = vnd(t.total);
  $('#place-order').disabled = !t.count;
  $('#nav-count').textContent = t.count;
  $('#basket-fab').hidden = !t.count;
  $('#fab-count').textContent = `${t.count} ${t.count === 1 ? 'item' : 'items'} · view basket`;
  $('#fab-total').textContent = vnd(t.total);
}

function setQty(id, qty) {
  const d = dishes.find(x => x.id === id);
  if (qty <= 0) { state.basket.delete(id); announce(`${d.name} removed. ${totals().count} items in basket.`); }
  else { state.basket.set(id, qty); announce(`${d.name} × ${qty}. Basket total ${vnd(totals().total)}.`); }
  renderBasket();
}

document.addEventListener('click', event => {
  const target = event.target.closest('button');
  if (!target) return;
  const { cat, diet, add, inc, dec, remove } = target.dataset;
  if (cat) { state.cat = cat; renderFilters(); renderMenu(); $(`[data-cat="${cat}"]`).focus(); }
  else if (diet) { state.diets.has(diet) ? state.diets.delete(diet) : state.diets.add(diet); renderFilters(); renderMenu(); $(`[data-diet="${diet}"]`).focus(); }
  else if ('reset' in target.dataset) { state.cat = 'all'; state.diets.clear(); renderFilters(); renderMenu(); $('[data-cat="all"]').focus(); }
  else if (add) { setQty(add, (state.basket.get(add) || 0) + 1); renderMenu(); $(`[data-add="${add}"]`).focus(); }
  else if (inc) { setQty(inc, state.basket.get(inc) + 1); renderMenu(); $(`[data-inc="${inc}"]`).focus(); }
  else if (dec) { const next = state.basket.get(dec) - 1; setQty(dec, next); renderMenu(); (next > 0 ? $(`[data-dec="${dec}"]`) : $('#basket-title')).focus(); }
  else if (remove) { setQty(remove, 0); renderMenu(); $('#basket-title').focus(); }
});
$('#basket-title').tabIndex = -1;

const dialog = $('#order-dialog');
$('#place-order').addEventListener('click', () => {
  const t = totals();
  $('#receipt').innerHTML = [...state.basket].map(([id, qty]) => { const d = dishes.find(x => x.id === id); return `<li><span>${qty} × ${d.name}</span><span>${vnd(d.price * qty)}</span></li>`; }).join('') + `<li><span>Packaging</span><span>${vnd(t.packaging)}</span></li>`;
  $('#receipt-total').textContent = vnd(t.total);
  if (typeof dialog.showModal === 'function') dialog.showModal(); else alert('Concept only: nothing was sent.');
});
$('#keep-order').addEventListener('click', () => dialog.close());
$('#clear-order').addEventListener('click', () => { state.basket.clear(); renderBasket(); renderMenu(); dialog.close(); announce('Basket cleared.'); $('#basket-title').focus(); });

/* Opening hours, evaluated in Hội An time. Vietnam (ICT) is UTC+7 with no daylight saving. */
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const schedule = [[[420, 1350]], [], [[420, 840], [1020, 1320]], [[420, 840], [1020, 1320]], [[420, 840], [1020, 1320]], [[420, 840], [1020, 1350]], [[420, 1350]]];
const hhmm = m => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
function hoiAnNow() { const d = new Date(Date.now() + 7 * 3600e3); return { day: d.getUTCDay(), minutes: d.getUTCHours() * 60 + d.getUTCMinutes() }; }

function status() {
  const { day, minutes } = hoiAnNow();
  const current = schedule[day].find(([open, close]) => minutes >= open && minutes < close);
  if (current) {
    const left = current[1] - minutes;
    return left <= 30 ? { kind: 'soon', title: `Closing soon · ${left} min left`, short: `Closing soon · ${hhmm(current[1])}`, detail: `Last orders before ${hhmm(current[1])} Hội An time.` }
      : { kind: 'open', title: `Open now · until ${hhmm(current[1])}`, short: `Open now · until ${hhmm(current[1])}`, detail: 'Walk-ins welcome. Times shown in Hội An (ICT, UTC+7).' };
  }
  for (let offset = 0; offset < 8; offset++) {
    const d = (day + offset) % 7;
    const next = schedule[d].find(([open]) => offset > 0 || open > minutes);
    if (next) {
      const when = offset === 0 ? 'today' : offset === 1 ? 'tomorrow' : dayNames[d];
      return { kind: 'closed', title: `Closed · opens ${when} at ${hhmm(next[0])}`, short: `Closed · opens ${when} ${hhmm(next[0])}`, detail: 'Times shown in Hội An (ICT, UTC+7).' };
    }
  }
  return { kind: 'closed', title: 'Closed', short: 'Closed', detail: '' };
}

function renderHours() {
  const { day, minutes } = hoiAnNow();
  const order = [1, 2, 3, 4, 5, 6, 0];
  $('#hours-body').innerHTML = order.map(d => `<tr class="${d === day ? 'today' : ''}"${d === day ? ' aria-current="date"' : ''}><th scope="row">${dayNames[d]}</th><td${schedule[d].length ? '' : ' class="closed-day"'}>${schedule[d].length ? schedule[d].map(([o, c]) => `${hhmm(o)}–${hhmm(c)}`).join(', ') : 'Closed · staff day off'}</td></tr>`).join('');
  const s = status();
  const live = $('#live-status');
  if (live.textContent !== s.title) live.textContent = s.title;
  if ($('#live-detail').textContent !== s.detail) $('#live-detail').textContent = s.detail;
  $('#live-dot').className = `live-dot ${s.kind}`;
  $('#hero-status span').textContent = s.short;
  document.body.classList.remove('is-open', 'is-soon', 'is-closed');
  document.body.classList.add(`is-${s.kind}`);
  $('#clock').textContent = `${dayNames[day].slice(0, 3)} ${hhmm(minutes)}`;
}

renderFilters();
renderMenu();
renderBasket();
renderHours();
setInterval(renderHours, 30000);

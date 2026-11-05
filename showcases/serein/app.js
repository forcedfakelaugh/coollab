const dialog = document.querySelector('#booking');
const form = document.querySelector('#booking-form');
const space = document.querySelector('#space');
const arrival = document.querySelector('#arrival');
const departure = document.querySelector('#departure');
const guests = document.querySelector('#guests');
const estimate = document.querySelector('#estimate');
const confirmation = document.querySelector('#confirmation');
const spaces = { pool: { name: 'The Pool House', rate: 380, capacity: 4 }, suite: { name: 'The Garden Suite', rate: 240, capacity: 2 } };
const dateValue = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const addDays = (date, days) => { const result = new Date(`${date}T12:00:00`); result.setDate(result.getDate() + days); return dateValue(result); };
const today = dateValue(new Date());
arrival.min = today;
arrival.value = addDays(today, 7);
departure.value = addDays(today, 10);
const money = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
function update() {
  const selected = spaces[space.value];
  for (const option of guests.options) option.disabled = Number(option.value) > selected.capacity;
  if (Number(guests.value) > selected.capacity) guests.value = String(selected.capacity);
  departure.min = arrival.value ? addDays(arrival.value, 1) : addDays(today, 1);
  departure.setCustomValidity(departure.value && arrival.value && departure.value <= arrival.value ? (window.showcaseLanguage?.translate('Choose a departure after your arrival.') ?? 'Choose a departure after your arrival.') : '');
  const nights = (Date.parse(departure.value) - Date.parse(arrival.value)) / 86400000;
  const valid = arrival.value >= today && nights > 0 && Number.isFinite(nights);
  estimate.textContent = valid ? `${nights} ${nights === 1 ? 'night' : 'nights'} × ${money(selected.rate)} = ${money(nights * selected.rate)} · Sample total` : 'Choose a future arrival and a later departure to preview your stay.';
  return { selected, nights, valid };
}
let opener;
for (const button of document.querySelectorAll('[data-book]')) button.addEventListener('click', () => {
  opener = button;
  if (spaces[button.dataset.book]) space.value = button.dataset.book;
  form.hidden = false;
  confirmation.hidden = true;
  update();
  dialog.showModal();
  document.body.classList.add('modal-open');
});
dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { const bounds = dialog.getBoundingClientRect(); if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close(); });
dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); opener?.focus(); });
form.addEventListener('input', update);
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const { selected, nights, valid } = update();
  if (!form.reportValidity() || !valid) return;
  const displayDate = (value) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T12:00:00`));
  document.querySelector('#confirmation-details').textContent = `${selected.name} · ${displayDate(arrival.value)} – ${displayDate(departure.value)} · ${guests.value} ${guests.value === '1' ? 'guest' : 'guests'} · ${money(nights * selected.rate)} sample total.`;
  form.hidden = true;
  confirmation.hidden = false;
  document.querySelector('#edit-stay').focus();
});
document.querySelector('#edit-stay').addEventListener('click', () => { confirmation.hidden = true; form.hidden = false; space.focus(); });
for (const button of document.querySelectorAll('[data-filter]')) button.addEventListener('click', () => {
  for (const tab of document.querySelectorAll('[data-filter]')) { const active = tab === button; tab.classList.toggle('active', active); tab.setAttribute('aria-pressed', String(active)); }
  for (const card of document.querySelectorAll('[data-type]')) card.hidden = button.dataset.filter !== 'all' && card.dataset.type !== button.dataset.filter;
});
document.querySelector('#year').textContent = new Date().getFullYear();
update();

window.addEventListener('showcase-language', update);

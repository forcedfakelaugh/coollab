'use strict';
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const vnd = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫';
const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const services = [
  { id: 'soak', name: 'Lemongrass foot soak', local: 'Ngâm chân sả gừng', mins: 45, price: 250000, img: 'herbal-spa', tag: 'A gentle start', desc: 'Warm water with lemongrass and ginger, followed by a gentle foot massage.' },
  { id: 'compress', name: 'Warm herbal compress', local: 'Chườm thảo mộc', mins: 75, price: 550000, img: 'herbal-compress', desc: 'Warm cotton herb bundles and a slow massage for your back and shoulders.' },
  { id: 'massage', name: 'Warm oil massage', local: 'Massage tinh dầu', mins: 60, price: 500000, img: 'two-guests', desc: 'A full-body massage with warm oil. Choose gentle or firmer pressure when you arrive.' },
  { id: 'afternoon', name: 'The slow afternoon', local: 'Một buổi thảnh thơi', mins: 105, price: 700000, img: 'oil', tag: 'Take your time', desc: 'A lemongrass foot soak and foot massage, followed by a full-body oil massage.' }
];
const staff = [
  { id: 'any', name: 'No preference', role: 'First available therapist', initials: 'M', tone: '#dde6d5', offers: null, off: null },
  { id: 'hanh', name: 'Hạnh', role: 'Herbal compress & massage', initials: 'H', tone: '#d8cbb4', offers: ['soak', 'compress', 'massage', 'afternoon'], off: 3 },
  { id: 'minh', name: 'Minh', role: 'Body & shoulder massage', initials: 'M', tone: '#ddc1ae', offers: ['compress', 'massage', 'afternoon'], off: 1 },
  { id: 'linh', name: 'Linh', role: 'Foot care & gentle massage', initials: 'L', tone: '#c9d7bf', offers: ['soak', 'massage', 'afternoon'], off: 4 },
  { id: 'bao', name: 'Bảo', role: 'Foot care & herbal compress', initials: 'B', tone: '#e4d9bb', offers: ['soak', 'compress'], off: 0 }
];
const stepNames = ['Treatment', 'Therapist', 'Date & time', 'Details', 'Review'];
const dayShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CLOSED_DAY = 2; /* Tuesday */
const OPEN = 9 * 60, CLOSE = 21 * 60;

const state = { step: 0, service: null, staff: null, date: null, time: null, attempted: new Set() };
const announce = message => { $('#announce').textContent = ''; requestAnimationFrame(() => { $('#announce').textContent = message; }); };
const svc = () => services.find(s => s.id === state.service);
const person = () => staff.find(s => s.id === state.staff);
const hhmm = m => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

/* Everything is evaluated in Đà Lạt time (ICT, UTC+7, no daylight saving). */
function ictNow() { const d = new Date(Date.now() + 7 * 3600e3); return { y: d.getUTCFullYear(), m: d.getUTCMonth(), d: d.getUTCDate(), minutes: d.getUTCHours() * 60 + d.getUTCMinutes() }; }
function upcomingDates() {
  const now = ictNow();
  return Array.from({ length: 14 }, (_, i) => { const date = new Date(Date.UTC(now.y, now.m, now.d + i)); return { iso: date.toISOString().slice(0, 10), day: date.getUTCDay(), date: date.getUTCDate(), month: date.getUTCMonth(), today: i === 0 }; });
}
function hash(text) { let h = 2166136261; for (const c of text) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return ((h >>> 0) % 1000) / 1000; }
function staffFree(member, service, d, start) {
  if (member.off === d.day || !member.offers.includes(service)) return false;
  return hash(`${d.iso}|${member.id}|${start}`) > 0.4;
}
function slotsFor(d) {
  const s = svc();
  if (!s || !state.staff) return [];
  const pool = state.staff === 'any' ? staff.filter(m => m.offers && m.offers.includes(s.id)) : [person()];
  const now = ictNow();
  const result = [];
  for (let start = OPEN; start + s.mins <= CLOSE; start += 30) {
    const past = d.today && start < now.minutes + 60;
    const free = d.day !== CLOSED_DAY && !past && pool.some(m => staffFree(m, s.id, d, start));
    result.push({ start, free });
  }
  return result;
}
const dateLabel = iso => { const d = upcomingDates().find(x => x.iso === iso); return d ? `${dayShort[d.day]} ${d.date} ${monthShort[d.month]}` : iso; };

function renderServices() {
  $('#services').innerHTML = services.map(s => `<label class="card"><input type="radio" name="service" value="${s.id}"${state.service === s.id ? ' checked' : ''}><span class="card-body"><span class="card-photo"><img src="assets/${s.img}.jpg" alt="" loading="lazy"></span>${s.tag ? `<span class="card-tag">${s.tag}</span>` : ''}<span class="card-text"><span class="card-local" lang="vi">${s.local}</span><span class="card-title">${s.name}</span><span class="card-meta"><span>${s.mins} min</span><span>${vnd(s.price)}</span></span><span class="card-desc">${s.desc}</span></span></span></label>`).join('');
}
function renderStaff() {
  $('#staff').innerHTML = staff.map(m => {
    const offers = !m.offers || (state.service && m.offers.includes(state.service));
    const note = offers ? m.role : `Doesn’t offer ${svc() ? svc().name : 'this treatment'}`;
    return `<label class="card"><input type="radio" name="staff" value="${m.id}"${state.staff === m.id ? ' checked' : ''}${offers ? '' : ' disabled'}><span class="card-body"><span class="avatar" style="--tone:${m.tone}" aria-hidden="true">${m.initials}</span><span><span class="card-title">${m.name}</span><span class="card-desc">${note}${m.off !== null && offers ? ` · off ${dayShort[m.off]}` : ''}</span></span></span></label>`;
  }).join('');
}
function renderDates() {
  const dates = upcomingDates();
  const openDates = dates.filter(d => slotsFor(d).some(s => s.free));
  if (!openDates.some(d => d.iso === state.date)) { state.date = openDates.length ? openDates[0].iso : null; state.time = null; }
  $('#dates').innerHTML = dates.map(d => {
    const disabled = !openDates.includes(d);
    const reason = d.day === CLOSED_DAY ? ', closed' : disabled ? ', fully booked' : '';
    return `<label class="date"><input type="radio" name="date" value="${d.iso}" aria-label="${d.today ? 'Today, ' : ''}${dayShort[d.day]} ${d.date} ${monthShort[d.month]}${reason}"${state.date === d.iso ? ' checked' : ''}${disabled ? ' disabled' : ''}><span aria-hidden="true">${d.today ? 'Today' : dayShort[d.day]}<b>${d.date}</b>${monthShort[d.month]}</span></label>`;
  }).join('');
  renderSlots();
}
function renderSlots() {
  const d = upcomingDates().find(x => x.iso === state.date);
  if (!d) { $('#slots').innerHTML = '<p class="slots-empty">No open dates in the next two weeks for this combination. Try “No preference”.</p>'; return; }
  const slots = slotsFor(d);
  if (state.time !== null && !slots.some(s => s.start === state.time && s.free)) state.time = null;
  const end = s => hhmm(s.start + svc().mins);
  $('#slots').innerHTML = slots.map(s => `<label class="slot"><input type="radio" name="time" value="${s.start}" aria-label="${hhmm(s.start)} to ${end(s)}${s.free ? '' : ', unavailable'}"${state.time === s.start ? ' checked' : ''}${s.free ? '' : ' disabled'}><span aria-hidden="true">${hhmm(s.start)}</span></label>`).join('');
  $('#slot-hint').textContent = `${slots.filter(s => s.free).length} of ${slots.length} times open · struck-through times are taken`;
}

function renderProgress() {
  $('#progress').innerHTML = stepNames.map((name, i) => {
    const cls = i < state.step ? 'complete' : i === state.step ? 'current' : '';
    const inner = `<span class="num">${String(i + 1).padStart(2, '0')}</span><span class="bar-text">${name}</span>`;
    if (state.step < 5 && i < state.step) return `<li class="${cls}"><button type="button" data-goto="${i}" aria-label="Step ${i + 1}, ${name}, completed. Go back to edit">${inner}</button></li>`;
    return `<li class="${cls}"${i === state.step ? ' aria-current="step"' : ''}><span>${inner}${i > state.step ? '<span class="sr-only">, not started</span>' : ''}</span></li>`;
  }).join('');
  $('#progress-caption').innerHTML = state.step < 5 ? `Step ${state.step + 1} of 5 · <b>${stepNames[state.step]}</b>` : '<b>Finished</b> · demo only';
}
function renderSummary() {
  const s = svc(), m = person();
  const row = (k, v) => `<div><dt>${k}</dt><dd${v ? '' : ' class="pending"'}>${v || 'Not chosen'}</dd></div>`;
  $('#summary').innerHTML = row('Treatment', s && s.name) + row('Therapist', m && m.name) + row('Date', state.date && dateLabel(state.date)) + row('Time', state.time !== null && s ? `${hhmm(state.time)}–${hhmm(state.time + s.mins)}` : null);
  const total = s ? vnd(s.price) : '-';
  if ($('#sum-total').textContent !== total) { $('#sum-total').textContent = total; bump($('#sum-total')); }
  const photo = $('#sum-photo');
  if ((photo.dataset.img || '') !== (s ? s.img : '')) {
    photo.dataset.img = s ? s.img : '';
    photo.innerHTML = s ? `<img src="assets/${s.img}.jpg" alt="">` : '';
  }
  photo.classList.toggle('has', Boolean(s));
}
function bump(el) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
function reviewRows(withEdit) {
  const s = svc(), m = person();
  const name = $('#f-name').value.trim(), email = $('#f-email').value.trim(), phone = $('#f-phone').value.trim(), notes = $('#f-notes').value.trim();
  const rows = [['Treatment', `${s.name} · ${s.mins} min`, 0], ['Therapist', m.name, 1], ['When', `${dateLabel(state.date)}, ${hhmm(state.time)}–${hhmm(state.time + s.mins)}`, 2], ['Guest', escapeHtml(name), 3], ['Contact', escapeHtml(email) + (phone ? ` · ${escapeHtml(phone)}` : ''), 3]];
  if (notes) rows.push(['Notes', escapeHtml(notes), 3]);
  rows.push(['Total', vnd(s.price), null]);
  return rows.map(([k, v, step]) => `<div><dt>${k}</dt><dd${['Guest', 'Contact', 'Notes'].includes(k) ? ' data-no-translate' : ''}>${v}</dd>${withEdit ? (step === null ? '<span></span>' : `<button type="button" class="edit" data-goto="${step}">Edit<span class="sr-only"> ${k.toLowerCase()}</span></button>`) : ''}</div>`).join('');
}

/* Validation */
const fieldRules = {
  name: v => v.trim().length < 2 ? 'Enter your name - at least two characters.' : '',
  email: v => !v.trim() ? 'Enter an email address.' : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? 'That email looks incomplete, e.g. name@example.com.' : '',
  phone: v => { const digits = v.replace(/[\s.-]/g, ''); return !digits ? '' : /^(\+84|0)[35789]\d{8}$/.test(digits) ? '' : 'Use a 10-digit Vietnamese mobile number, e.g. 090 123 4567.'; },
  consent: (_, el) => el.checked ? '' : 'Please confirm you understand this is a concept.'
};
function validateField(name) {
  const el = $(`#f-${name}`);
  const message = fieldRules[name](el.value, el);
  el.setAttribute('aria-invalid', String(Boolean(message)));
  $(`#e-${name}`).textContent = message;
  return !message;
}
function showStepError(id, message) { const el = $(id); el.textContent = message; el.hidden = !message; if (message) el.setAttribute('role', 'alert'); }
function validateStep(step) {
  if (step === 0) { showStepError('#err-service', state.service ? '' : 'Choose a treatment to continue.'); return Boolean(state.service); }
  if (step === 1) { showStepError('#err-staff', state.staff ? '' : 'Choose a therapist, or “No preference”.'); return Boolean(state.staff); }
  if (step === 2) { const ok = state.date && state.time !== null; showStepError('#err-time', ok ? '' : 'Pick an open time to continue.'); return Boolean(ok); }
  if (step === 3) {
    Object.keys(fieldRules).forEach(name => state.attempted.add(name));
    const invalid = Object.keys(fieldRules).filter(name => !validateField(name));
    if (invalid.length) { $(`#f-${invalid[0]}`).focus(); announce(`${invalid.length} ${invalid.length === 1 ? 'field needs' : 'fields need'} attention.`); }
    return !invalid.length;
  }
  return true;
}

function goTo(step, { focus = true } = {}) {
  state.step = step;
  $$('.step').forEach(section => { section.hidden = Number(section.dataset.step) !== step; });
  if (step === 1) renderStaff();
  if (step === 2) renderDates();
  if (step === 4) $('#review').innerHTML = reviewRows(true);
  $('#nav-row').hidden = step === 5;
  $('#back').hidden = step === 0;
  $('#next').innerHTML = window.portfolioIcons.text(step === 4 ? 'Confirm (demo - nothing is sent)' : 'Continue →');
  renderProgress();
  renderSummary();
  if (focus) { const heading = $(`#h${step}`); heading.focus({ preventScroll: true }); $('#booking').scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }
}

$('#flow').addEventListener('submit', event => {
  event.preventDefault();
  if (state.step > 4 || !validateStep(state.step)) return;
  if (state.step === 4) {
    $('#final').innerHTML = reviewRows(false);
    $('#ref').textContent = 'MOC-DEMO-' + Math.random().toString(36).slice(2, 6).toUpperCase();
    goTo(5);
    announce('Demo complete. No booking was made.');
    return;
  }
  goTo(state.step + 1);
});
$('#back').addEventListener('click', () => { if (state.step > 0) goTo(state.step - 1); });
document.addEventListener('click', event => {
  const target = event.target.closest('[data-goto]');
  if (target) goTo(Number(target.dataset.goto));
});
$('#restart').addEventListener('click', () => {
  Object.assign(state, { service: null, staff: null, date: null, time: null });
  state.attempted.clear();
  $('#flow').reset();
  ['name', 'email', 'phone', 'consent'].forEach(n => { $(`#f-${n}`).removeAttribute('aria-invalid'); $(`#e-${n}`).textContent = ''; });
  $('#c-notes').textContent = '0 / 300';
  $$('.error').forEach(e => { e.hidden = true; });
  renderServices();
  goTo(0);
});

$('#flow').addEventListener('change', event => {
  const { name, value } = event.target;
  if (name === 'service') {
    state.service = value;
    state.time = null;
    const m = person();
    if (m && m.offers && !m.offers.includes(value)) { state.staff = null; announce(`${m.name} doesn’t offer this treatment, so your therapist choice was cleared.`); }
    showStepError('#err-service', '');
  } else if (name === 'staff') { state.staff = value; state.time = null; showStepError('#err-staff', ''); }
  else if (name === 'date') { state.date = value; state.time = null; renderSlots(); }
  else if (name === 'time') { state.time = Number(value); showStepError('#err-time', ''); }
  renderSummary();
});
['name', 'email', 'phone'].forEach(n => {
  const el = $(`#f-${n}`);
  el.addEventListener('blur', () => { if (el.value || state.attempted.has(n)) { state.attempted.add(n); validateField(n); } });
  el.addEventListener('input', () => { if (state.attempted.has(n)) validateField(n); });
});
$('#f-consent').addEventListener('change', () => { if (state.attempted.has('consent')) validateField('consent'); });
$('#f-notes').addEventListener('input', event => { $('#c-notes').textContent = `${event.target.value.length} / 300`; });

renderServices();
goTo(0, { focus: false });

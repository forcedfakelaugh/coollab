'use strict';

const products = {
  'round-bowl': 'Round & ready',
  'fold-box': 'The good fold',
  'daily-cup': 'Daily pour',
  'serve-tray': 'Easy does it'
};
const selected = new Set();
const dialog = document.getElementById('sample-dialog');
const list = document.getElementById('sample-items');
const count = document.getElementById('sample-count');
const empty = document.getElementById('empty-box');
const previewButton = document.getElementById('preview-request');
const status = document.getElementById('live-status');

function renderSamples() {
  count.textContent = String(selected.size);
  empty.hidden = selected.size > 0;
  previewButton.disabled = selected.size === 0;
  list.replaceChildren();
  for (const id of selected) {
    const item = document.createElement('li');
    const name = document.createElement('span');
    name.textContent = products[id];
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = 'Remove';
    remove.setAttribute('aria-label', `Remove ${products[id]} from sample box`);
    remove.addEventListener('click', () => toggleSample(id));
    item.append(name, remove);
    list.append(item);
  }
  document.querySelectorAll('[data-add]').forEach(button => {
    const active = selected.has(button.dataset.add);
    button.setAttribute('aria-pressed', String(active));
    button.textContent = active ? '✓' : '+';
    button.setAttribute('aria-label', `${active ? 'Remove' : 'Add'} ${products[button.dataset.add]} ${active ? 'from' : 'to'} sample box`);
  });
}

function toggleSample(id) {
  if (selected.has(id)) selected.delete(id);
  else selected.add(id);
  renderSamples();
  status.textContent = `${products[id]} ${selected.has(id) ? 'added to' : 'removed from'} sample box. ${selected.size} ${selected.size === 1 ? 'item' : 'items'} selected.`;
}

document.querySelectorAll('[data-add]').forEach(button => button.addEventListener('click', () => toggleSample(button.dataset.add)));
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  const kind = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
  document.querySelectorAll('.product-card').forEach(card => { card.hidden = kind !== 'all' && card.dataset.kind !== kind; });
  status.textContent = kind === 'all' ? 'Showing all four forms.' : `Showing ${kind}.`;
}));

document.querySelectorAll('[data-open-samples]').forEach(button => button.addEventListener('click', () => {
  document.getElementById('sample-preview').hidden = true;
  document.getElementById('sample-edit').hidden = false;
  dialog.showModal();
}));
document.querySelector('[data-close-samples]').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
previewButton.addEventListener('click', () => {
  if (!selected.size) return;
  renderSelection();
  document.getElementById('sample-edit').hidden = true;
  document.getElementById('sample-preview').hidden = false;
  document.getElementById('back-to-box').focus();
});
document.getElementById('back-to-box').addEventListener('click', () => {
  document.getElementById('sample-preview').hidden = true;
  document.getElementById('sample-edit').hidden = false;
  previewButton.focus();
});

renderSamples();

function renderSelection() {
  const locale = window.showcaseLanguage?.language ?? 'vi';
  const names = [...selected].map(id => window.showcaseLanguage?.translate(products[id]) ?? products[id]);
  const output = document.getElementById('preview-selection');
  output.dataset.noTranslate = '';
  output.textContent = new Intl.ListFormat(locale, { style: 'long', type: 'conjunction' }).format(names);
}
window.addEventListener('showcase-language', renderSelection);

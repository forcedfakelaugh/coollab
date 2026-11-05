'use strict';
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

const tiers = [
  { id: 'solo', name: 'Solo', desc: 'For indie makers shipping on their own.', monthly: 9, yearly: 90, cta: 'Start with Solo', perks: ['1 product', 'In-app widget & RSS', 'Unlimited releases', '1,000 email subscribers'] },
  { id: 'team', name: 'Team', desc: 'For product teams with a weekly cadence.', monthly: 29, yearly: 288, cta: 'Start a Team trial', featured: true, perks: ['5 products', 'PR-to-draft writing', 'Approval flow', 'Read-rate analytics', '25,000 email subscribers'] },
  { id: 'scale', name: 'Scale', desc: 'For companies with many products and audiences.', monthly: 79, yearly: 758, cta: 'Talk to sales', perks: ['Unlimited products', 'Audience segments', 'SSO & audit log', 'Custom domain', 'Priority support'] }
];

const money = n => '$' + (Number.isInteger(n) ? n : n.toFixed(2));
const savingPct = t => Math.round((1 - t.yearly / (t.monthly * 12)) * 100);
const maxSaving = Math.max(...tiers.map(savingPct));
let billing = 'monthly';

function renderTiers() {
  $('#tiers').innerHTML = tiers.map(t => {
    const yearly = billing === 'yearly';
    const per = yearly ? t.yearly / 12 : t.monthly;
    const saved = t.monthly * 12 - t.yearly;
    const billed = yearly ? `Billed ${money(t.yearly)} yearly · <b>save ${money(saved)} (${savingPct(t)}%)</b>` : `Billed monthly · or ${money(t.yearly)}/yr, save ${savingPct(t)}%`;
    return `<article class="tier${t.featured ? ' featured' : ''}" aria-labelledby="tier-${t.id}"><div class="tier-head"><h3 id="tier-${t.id}">${t.name}</h3>${t.featured ? '<span class="tier-badge">Most popular</span>' : ''}</div><p class="tier-desc">${t.desc}</p><div><p class="amount"><strong>${money(Math.round(per * 100) / 100)}</strong><span class="per">/ month</span></p><p class="billed">${billed}</p></div><ul aria-label="${t.name} includes">${t.perks.map(p => `<li>${window.portfolioIcons.arrow("right")}${p}</li>`).join('')}</ul><button class="btn" type="button" data-concept="${t.name}">${t.cta}</button></article>`;
  }).join('');
  const label = $('#save-label');
  label.textContent = billing === 'yearly' ? `You’re saving up to ${maxSaving}%` : `Save up to ${maxSaving}% yearly`;
  label.classList.toggle('dim', billing === 'monthly');
}

$$('[data-billing]').forEach(button => button.addEventListener('click', () => {
  billing = button.dataset.billing;
  $$('[data-billing]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  renderTiers();
  $('#billing-status').textContent = billing === 'yearly' ? `Yearly billing. Prices shown per month, billed annually. Save up to ${maxSaving}%.` : 'Monthly billing selected.';
}));

const rows = [
  ['Publishing'],
  ['Products', '1', '5', 'Unlimited'],
  ['In-app widget', true, true, true],
  ['Email digests', '1k subscribers', '25k subscribers', 'Unlimited'],
  ['Status page sync', false, true, true],
  ['Scheduled releases', true, true, true],
  ['Writing'],
  ['PR-to-draft', false, true, true],
  ['Translations', false, '3 languages', 'Unlimited'],
  ['Approval flow', false, true, true],
  ['Insights & admin'],
  ['Read-rate analytics', 'Basic', true, true],
  ['Audience segments', false, false, true],
  ['SSO & audit log', false, false, true],
  ['Custom domain', false, true, true]
];
const cell = (value, highlight) => {
  const cls = highlight ? ' class="hl"' : '';
  if (value === true) return `<td${cls}><span class="yes" aria-hidden="true">✓</span><span class="sr-only">Included</span></td>`;
  if (value === false) return `<td${cls}><span class="no" aria-hidden="true">-</span><span class="sr-only">Not included</span></td>`;
  return `<td${cls}>${value}</td>`;
};
$('#compare-body').innerHTML = rows.map(r => r.length === 1 ? `<tr class="group"><th scope="rowgroup" colspan="4">${r[0]}</th></tr>` : `<tr><th scope="row">${r[0]}</th>${cell(r[1])}${cell(r[2], true)}${cell(r[3])}</tr>`).join('');

const faqs = [
  ['Is Halyard a real product?', 'No. Halyard is a fictional SaaS product designed by Lucas Nguyen to demonstrate a marketing site: layout, pricing logic, comparison and accordion patterns. There is no app, trial or billing behind it.'],
  ['How does the yearly discount work?', `Each plan’s yearly price is set below twelve monthly payments. The page computes the saving per plan - between ${Math.min(...tiers.map(savingPct))}% and ${maxSaving}% here - and shows the largest one on the toggle.`],
  ['Can I switch plans later?', 'In the imagined product, yes: upgrades apply immediately and downgrades at the end of the billing period, with unused time credited.'],
  ['Does it publish anything automatically?', 'Never. Drafts written from pull requests always wait for a person to review and press publish. Approval flows can require more than one reviewer.'],
  ['What happens to my data?', 'On this page, nothing - no forms send data and no analytics run. Buttons only open a dialog explaining that this is a concept.']
];
$('#accordion').innerHTML = faqs.map(([q, a], i) => `<div class="qa"><h3><button type="button" id="q-${i}" aria-expanded="false" aria-controls="a-${i}">${q}<span class="icon" aria-hidden="true"></span></button></h3><div class="answer" id="a-${i}" role="region" aria-labelledby="q-${i}" hidden><p>${a}</p></div></div>`).join('');
$('#accordion').addEventListener('click', event => {
  const button = event.target.closest('button[aria-controls]');
  if (!button) return;
  const open = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!open));
  document.getElementById(button.getAttribute('aria-controls')).hidden = open;
});

const dialog = $('#concept-dialog');
document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-concept]');
  if (!trigger) return;
  const plan = trigger.dataset.concept;
  $('#concept-text').textContent = `${plan ? `The ${plan} plan` : 'Halyard'} is part of a fictional product made to show a landing page design. No account is created, nothing is collected, and nothing is charged.`;
  if (typeof dialog.showModal === 'function') dialog.showModal(); else alert($('#concept-text').textContent);
});
$('#concept-close').addEventListener('click', () => dialog.close());

renderTiers();

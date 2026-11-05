// Shared showcase chrome and authored copy bindings. Text nodes are updated in
// place so switching languages never replaces controls or resets demo state.
const key = 'lucas-portfolio-language';
const project = location.pathname.split('/showcases/')[1]?.split('/')[0];
const native = ['mai-le', 'hien', 'lumierreart-2'].includes(project);
const sourceLanguage = project === 'pip' ? 'vi' : 'en';
let language = 'vi';
try { language = localStorage.getItem(key) === 'en' ? 'en' : 'vi'; } catch {}
const [common, copy] = await Promise.all([
  import('./locales/common.js').then(module => module.default),
  native ? [] : import(`./locales/${project}.js`).then(module => module.default),
]);
const normalize = value => value.replace(/\s+/g, ' ').trim();
const dictionary = new Map();
const templates = [];
const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
for (const [en, vi] of [...common, ...copy]) {
  const source = sourceLanguage === 'en' ? en : vi;
  const target = sourceLanguage === 'en' ? vi : en;
  if (source.includes('{')) {
    const fields = [...source.matchAll(/\{(\w+)\}/g)].map(match => match[1]);
    const parts = source.split(/\{\w+\}/);
    const pattern = parts.map((part, index) => escape(part) + (index < fields.length
      ? (['count', 'number', 'index', 'step', 'percent', 'min', 'max', 'open'].includes(fields[index]) ? '(\\d[\\d.,]*(?:k)?)' : '(.+?)')
      : '')).join('');
    templates.push({ regex: new RegExp(`^${pattern}$`), fields, target, specificity: parts.join('').length });
  } else {
    dictionary.set(normalize(source), target);
    dictionary.set(normalize(source.toUpperCase()), target.toUpperCase());
  }
}
// Prefer sentences with specific wording over short date/quantity templates.
templates.sort((a, b) => b.specificity - a.specificity);
function translate(value, depth = 0) {
  if (language === sourceLanguage || depth > 5) return value;
  const source = normalize(value);
  let result = dictionary.get(source);
  if (result === undefined) {
    for (const { regex, fields, target } of templates) {
      const match = source.match(regex);
      if (!match) continue;
      result = target.replace(/\{(\w+)\}/g, (_, field) => translate(match[fields.indexOf(field) + 1], depth + 1));
      break;
    }
  }
  return result === undefined ? value : value.replace(/\S[\s\S]*\S|\S/, () => result);
}
const originals = new WeakMap();
const ignored = 'script,style,textarea,[data-no-translate],.portfolio-nav';
const attributes = ['aria-label', 'aria-description', 'alt', 'title', 'placeholder', 'content'];
function bind(node, attribute) {
  const current = attribute ? node.getAttribute(attribute) : node.data;
  if (!current?.trim()) return;
  const records = originals.get(node) || {};
  const slot = attribute || 'text';
  const previous = records[slot];
  const source = previous && current === previous.output ? previous.source : current;
  const output = translate(source);
  records[slot] = { source, output };
  originals.set(node, records);
  if (output !== current) {
    if (attribute) node.setAttribute(attribute, output);
    else node.data = output;
  }
}
function visit(root) {
  if (root.nodeType === Node.TEXT_NODE) {
    if (!root.parentElement?.closest(ignored)) bind(root);
    return;
  }
  if (root.nodeType !== Node.ELEMENT_NODE || root.matches(ignored)) return;
  for (const attribute of attributes) {
    if (attribute === 'content' && !root.matches('meta[name="description"]')) continue;
    if (root.hasAttribute(attribute)) bind(root, attribute);
  }
  for (const child of root.childNodes) visit(child);
}
const observer = new MutationObserver(records => {
  observer.disconnect();
  const roots = new Set();
  for (const record of records) {
    if (record.type === 'childList') record.addedNodes.forEach(node => roots.add(node));
    else roots.add(record.target);
  }
  roots.forEach(root => { if (root.isConnected && !root.parentElement?.closest(ignored)) visit(root); });
  observe();
});
function observe() {
  if (!native) observer.observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: attributes });
}
function refresh() {
  observer.disconnect();
  if (!native) visit(document.documentElement);
  observe();
}
function setLanguage(next) {
  language = next === 'en' ? 'en' : 'vi';
  document.documentElement.lang = language;
  const nav = document.querySelector('.portfolio-nav');
  nav.setAttribute('aria-label', language === 'vi' ? 'Điều hướng portfolio' : 'Portfolio navigation');
  nav.querySelector('.portfolio-return').innerHTML = window.portfolioIcons.text('← Playground');
  const toggle = nav.querySelector('.language-switch');
  toggle.setAttribute('aria-label', language === 'vi' ? 'Chuyển sang tiếng Anh' : 'Switch to Vietnamese');
  toggle.querySelectorAll('[data-language]').forEach(label => label.classList.toggle('is-active', label.dataset.language === language));
  window.dispatchEvent(new CustomEvent('showcase-language', { detail: { language } }));
  refresh();
}
// The head bootstrap waits for deferred demo scripts before applying copy.
export function initializeLanguage() {
  window.showcaseLanguage = { get language() { return language; }, translate, refresh };
  document.querySelector('.portfolio-nav .language-switch').addEventListener('click', () => {
    const next = language === 'vi' ? 'en' : 'vi';
    try { localStorage.setItem(key, next); } catch {}
    setLanguage(next);
  });
  window.addEventListener('storage', event => { if (event.key === key) setLanguage(event.newValue); });
  window.addEventListener('pageshow', () => {
    try { const next = localStorage.getItem(key) === 'en' ? 'en' : 'vi'; if (next !== language) setLanguage(next); } catch {}
  });
  setLanguage(language);
}

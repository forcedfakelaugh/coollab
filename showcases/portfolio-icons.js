// Shared renderer for dynamic UI; static HTML uses the same SVG symbols directly.
// Edit icons/arrows.svg to change an arrow everywhere, including translated copy.
(() => {
  const sprite = new URL('icons/arrows.svg', document.currentScript.src).href;
  const directions = { '←':'left', '↑':'up', '→':'right', '↓':'down', '↖':'up-left', '↗':'up-right', '↘':'down-right', '↙':'down-left', '↧':'download', '⇄':'swap', '↺':'reset' };
  const names = new Set(Object.values(directions));
  const diagonals = new Set(['up-left', 'up-right', 'down-left', 'down-right']);

  function arrow(direction, variant = '') {
    if (!names.has(direction)) throw new Error(`Unknown arrow direction: ${direction}`);
    if (variant && !(variant === 'cham' && direction === 'up-right') && !(variant === 'mono' && ['up-right', 'down-left'].includes(direction))) {
      throw new Error(`Unknown arrow variant: ${direction}/${variant}`);
    }
    const style = variant || (diagonals.has(direction) ? 'text' : '');
    const className = style === 'cham' ? 'arrow-up-right' : 'portfolio-arrow';
    const width = style === 'cham' ? '20' : style === 'mono' ? '.602051em' : '1em';
    const height = style === 'cham' ? '20' : '1em';
    const suffix = variant ? `-${variant}` : '';
    return `<svg class="${className}" data-direction="${direction}"${style ? ` data-arrow-style="${style}"` : ''} width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><use href="${sprite}#arrow-${direction}${suffix}"/></svg>`;
  }

  // html() is for authored markup; text() escapes text before adding SVGs.
  function html(markup) { return String(markup).replace(/[←↑→↓↖↗↘↙↧⇄↺][\uFE0E\uFE0F]?/gu, match => arrow(directions[match[0]])); }
  function text(value) { return html(String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))); }
  window.portfolioIcons = Object.freeze({arrow, html, text});
})();

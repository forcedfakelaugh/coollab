// Native DOM ports of React Bits DecryptedText and ClickSpark (see CREDITS.md).
const reduce = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
const isSpace = char => /\s/.test(char);
const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+';

// Each character holds its width with a hidden ghost, so scrambling never shifts the layout.
export function createDecrypted(element, { speed = 40, maxIterations = 10, sequential = false, direction = 'start', characters = DEFAULT_CHARS } = {}) {
  element.setAttribute('data-no-translate', '');
  const pool = Array.from(characters);
  const reader = document.createElement('span');
  reader.className = 'sr-only';
  const visual = document.createElement('span');
  visual.className = 'decrypted';
  visual.setAttribute('aria-hidden', 'true');
  element.replaceChildren(reader, visual);
  let chars = [];
  let glyphs = [];
  let timer = 0;
  let text = '';

  const build = () => {
    chars = Array.from(text);
    glyphs = [];
    visual.replaceChildren();
    let word = null;
    chars.forEach(char => {
      if (isSpace(char)) {
        word = null;
        visual.append(document.createTextNode(char));
        glyphs.push(null);
        return;
      }
      if (!word) {
        word = document.createElement('span');
        word.className = 'decrypted-word';
        visual.append(word);
      }
      const cell = document.createElement('span');
      cell.className = 'decrypted-cell';
      const ghost = document.createElement('span');
      ghost.className = 'decrypted-ghost';
      ghost.textContent = char;
      const glyph = document.createElement('span');
      glyph.className = 'decrypted-glyph';
      glyph.textContent = char;
      cell.append(ghost, glyph);
      word.append(cell);
      glyphs.push(glyph);
    });
  };

  const order = () => {
    const list = [];
    chars.forEach((char, index) => { if (!isSpace(char)) list.push(index); });
    if (direction === 'end') return list.reverse();
    if (direction === 'center') {
      const middle = Math.floor(chars.length / 2);
      return list.sort((a, b) => Math.abs(a - middle) - Math.abs(b - middle));
    }
    return list;
  };

  const paint = revealed => {
    glyphs.forEach((glyph, index) => {
      if (!glyph) return;
      const open = revealed === true || revealed.has(index);
      glyph.textContent = open ? chars[index] : pool[Math.floor(Math.random() * pool.length)];
      glyph.classList.toggle('is-encrypted', !open);
    });
  };

  const controller = {
    enabled: () => true,
    set(next, animate = true) {
      clearInterval(timer);
      timer = 0;
      if (next !== text) {
        text = next;
        reader.textContent = next;
        build();
      }
      if (!animate || reduce() || !controller.enabled()) {
        paint(true);
        return;
      }
      const revealed = new Set();
      const queue = order();
      let iteration = 0;
      paint(revealed);
      timer = setInterval(() => {
        iteration++;
        let done;
        if (sequential) {
          const index = queue.shift();
          if (index !== undefined) revealed.add(index);
          done = queue.length === 0;
        } else {
          done = iteration >= maxIterations;
        }
        paint(done ? true : revealed);
        if (done) {
          clearInterval(timer);
          timer = 0;
        }
      }, Math.max(16, speed));
    }
  };
  return controller;
}

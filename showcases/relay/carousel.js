// Native DOM port of the React Bits Carousel (see CREDITS.md). pose(), the spring constants,
// drag release and wheel handling follow upstream; React state and the frame/round variants
// are removed, and the transition mode can be switched while running.
export const EFFECTS = ['tilt', 'slide', 'scale', 'fade', 'cube'];
const STIFFNESS = 150;
const DAMPING = 24;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const wrap = (value, count) => ((value % count) + count) % count;
const nearest = (offset, count) => wrap(offset + count / 2, count) - count / 2;
const smootherstep = t => t * t * t * (t * (t * 6 - 15) + 10);

const edgeMask = size => {
  const stops = [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1].map(t => [smootherstep(t).toFixed(3), (t * size).toFixed(1)]);
  const left = stops.map(([alpha, x]) => `rgba(0, 0, 0, ${alpha}) ${x}px`);
  const right = [...stops].reverse().map(([alpha, x]) => `rgba(0, 0, 0, ${alpha}) calc(100% - ${x}px)`);
  return `linear-gradient(to right, ${[...left, ...right].join(', ')})`;
};

const pose = (index, position, s) => {
  const offset = nearest(index - position, s.count);
  const distance = Math.abs(offset);
  const near = Math.min(distance, 1);
  const result = {
    transform: 'none',
    opacity: 1,
    visible: true,
    layer: 10 - Math.min(9, Math.round(distance * 2)),
    shade: 0,
    focus: 1
  };
  if (s.mode === 'fade') {
    const half = Math.min(1, near * 2);
    result.visible = distance < 1;
    result.opacity = 1 - near * near * (3 - 2 * near);
    result.transform = `scale(${1 - 0.04 * near})`;
    result.focus = 1 - half * half * (3 - 2 * half);
    return result;
  }
  if (s.mode === 'cube') {
    const half = s.cardWidth / 2;
    const turn = Math.sin(Math.PI * (position - Math.floor(position)));
    result.visible = distance < 1;
    result.transform = `scale(${1 - 0.12 * turn}) translateZ(${-half}px) rotateY(${clamp(offset, -1, 1) * 90}deg) translateZ(${half}px)`;
    result.shade = near * 0.6;
    return result;
  }
  let x = offset * s.span;
  result.visible = x > -(s.inset + s.cardWidth + 2) && x < s.width + s.bleed * 2 - s.inset + 2;
  result.focus = 1 - near * near * (3 - 2 * near);
  if (s.mode === 'tilt') {
    result.visible = result.visible && distance < 1;
    result.transform = `translate3d(${x}px, 0, 0) rotateY(${-clamp(offset, -1, 1) * 90}deg)`;
  } else if (s.mode === 'scale') {
    x -= Math.sign(offset) * near * s.cardWidth * 0.06;
    result.transform = `translate3d(${x}px, 0, 0) scale(${1 - 0.12 * near})`;
    result.opacity = 1 - 0.5 * near;
  } else {
    result.transform = `translate3d(${x}px, 0, 0)`;
  }
  return result;
};

export function createCarousel(root, { renderSlide, count, mode = 'scale', aspectRatio = 16 / 10, gap = 18, onChange, onActivate }) {
  const viewport = root.querySelector('.carousel-viewport');
  const slides = [];
  const shades = [];
  for (let index = 0; index < count; index++) {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.append(renderSlide(index));
    const shade = document.createElement('span');
    shade.className = 'carousel-shade';
    slide.append(shade);
    viewport.append(slide);
    slides.push(slide);
    shades.push(shade);
    slide.addEventListener('click', () => {
      if (index === state.shown) onActivate?.(index);
      else goTo(index);
    });
  }

  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const state = { p: 0, v: 0, target: 0, shown: 0, drag: null, wheeling: false, wheelTimer: 0, suppress: false, last: 0 };
  const s = { count, mode, width: 1, bleed: 0, inset: 0, cardWidth: 1, span: 1 };
  let raf = 0;

  const unit = () => (s.mode === 'fade' || s.mode === 'cube' ? s.cardWidth : s.span);

  const layout = () => {
    const stacked = s.mode === 'fade' || s.mode === 'cube';
    const width = Math.max(1, Math.round(root.clientWidth));
    const side = stacked ? 0 : clamp(width * 0.11, 0, width * 0.2);
    const cardWidth = Math.max(40, width - side * 2);
    const cardHeight = cardWidth / aspectRatio;
    const bleed = stacked ? 0 : Math.round(Math.min(48, cardWidth * 0.12));
    Object.assign(s, { width, cardWidth, bleed, inset: bleed + (width - cardWidth) / 2, span: cardWidth + gap });
    viewport.style.height = `${cardHeight}px`;
    viewport.style.marginInline = bleed ? `${-bleed}px` : '';
    viewport.style.perspective = s.mode === 'cube' ? `${Math.round(cardWidth * 2.6)}px` : s.mode === 'tilt' ? '1000px' : '';
    viewport.style.overflowX = stacked ? 'visible' : 'clip';
    const mask = stacked ? '' : edgeMask(s.inset);
    viewport.style.maskImage = mask;
    viewport.style.webkitMaskImage = mask;
    for (const slide of slides) {
      slide.style.left = `${s.inset}px`;
      slide.style.width = `${cardWidth}px`;
      slide.style.height = `${cardHeight}px`;
    }
    apply();
  };

  const apply = () => {
    for (let i = 0; i < count; i++) {
      const next = pose(i, state.p, s);
      const slide = slides[i];
      slide.style.transform = next.transform;
      slide.style.opacity = String(next.opacity);
      slide.style.visibility = next.visible ? 'visible' : 'hidden';
      slide.style.zIndex = String(next.layer);
      slide.style.setProperty('--carousel-focus', String(next.focus));
      shades[i].style.opacity = String(next.shade);
    }
  };

  const announce = () => {
    const index = wrap(Math.round(state.target), count);
    if (index === state.shown) return;
    state.shown = index;
    slides.forEach((slide, i) => {
      if (i === index) slide.dataset.current = 'true';
      else delete slide.dataset.current;
    });
    onChange?.(index);
  };

  const tick = now => {
    raf = 0;
    const dt = state.last ? Math.min(0.05, (now - state.last) / 1000) : 1 / 60;
    state.last = now;
    let busy = false;
    if (!state.drag?.moved && !state.wheeling) {
      if (reduce) {
        state.p = state.target;
        state.v = 0;
      } else {
        const steps = Math.ceil(dt * 240);
        const h = dt / steps;
        for (let k = 0; k < steps; k++) {
          state.v += (STIFFNESS * (state.target - state.p) - DAMPING * state.v) * h;
          state.p += state.v * h;
        }
        if (Math.abs(state.target - state.p) < 0.0004 && Math.abs(state.v) < 0.004) {
          state.p = state.target;
          state.v = 0;
        } else {
          busy = true;
        }
      }
      if (!busy) {
        state.target = wrap(Math.round(state.target), count);
        state.p = state.target;
      }
    }
    apply();
    if (busy) raf = requestAnimationFrame(tick);
    else state.last = 0;
  };

  const wake = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };

  const moveTo = target => {
    state.target = target;
    announce();
    apply();
    wake();
  };

  const step = direction => moveTo(Math.round(state.target) + direction);

  function goTo(index) {
    const current = Math.round(state.target);
    moveTo(current + nearest(clamp(Math.round(index), 0, count - 1) - wrap(current, count), count));
  }

  viewport.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    state.drag = { id: event.pointerId, x: event.clientX, y: event.clientY, p: state.p, from: 0, moved: false, samples: [] };
  });

  viewport.addEventListener('pointermove', event => {
    const drag = state.drag;
    if (!drag || event.pointerId !== drag.id) return;
    if (!drag.moved) {
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        state.drag = null;
        return;
      }
      drag.moved = true;
      drag.x = event.clientX;
      drag.p = state.p;
      drag.from = Math.round(state.target);
      viewport.setPointerCapture?.(event.pointerId);
      viewport.dataset.dragging = 'true';
    }
    state.p = drag.p - (event.clientX - drag.x) / unit();
    state.v = 0;
    state.target = Math.round(state.p);
    drag.samples.push([event.timeStamp, event.clientX]);
    if (drag.samples.length > 8) drag.samples.shift();
    announce();
    apply();
  });

  const onPointerUp = event => {
    const drag = state.drag;
    if (!drag || event.pointerId !== drag.id) return;
    state.drag = null;
    delete viewport.dataset.dragging;
    if (!drag.moved) {
      wake();
      return;
    }
    state.suppress = true;
    window.setTimeout(() => {
      state.suppress = false;
    }, 0);
    const sample = drag.samples.find(([time]) => event.timeStamp - time < 90) ?? [event.timeStamp, event.clientX];
    const elapsed = Math.max(16, event.timeStamp - sample[0]);
    const velocity = clamp(((sample[1] - event.clientX) / elapsed) * (1000 / unit()), -12, 12);
    const travelled = state.p - drag.from;
    let target = Math.round(state.p + velocity * 0.2);
    if (target === drag.from) {
      if (Math.abs(velocity) > 0.8) target += Math.sign(velocity);
      else if (Math.abs(travelled) > 0.18) target += Math.sign(travelled);
    }
    state.v = velocity;
    moveTo(target);
  };
  viewport.addEventListener('pointerup', onPointerUp);
  viewport.addEventListener('pointercancel', onPointerUp);

  viewport.addEventListener('click', event => {
    if (!state.suppress) return;
    event.preventDefault();
    event.stopPropagation();
    state.suppress = false;
  }, true);

  viewport.addEventListener('wheel', event => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    event.preventDefault();
    state.p += event.deltaX / unit();
    state.v = 0;
    state.wheeling = true;
    state.target = Math.round(state.p);
    announce();
    apply();
    window.clearTimeout(state.wheelTimer);
    state.wheelTimer = window.setTimeout(() => {
      state.wheeling = false;
      moveTo(Math.round(state.p));
    }, 120);
  }, { passive: false });

  root.addEventListener('keydown', event => {
    const keys = { ArrowRight: () => step(1), ArrowLeft: () => step(-1), Home: () => goTo(0), End: () => goTo(count - 1) };
    if (!keys[event.key]) return;
    event.preventDefault();
    keys[event.key]();
  });

  new ResizeObserver(layout).observe(root);
  slides[0].dataset.current = 'true';
  layout();

  return {
    step,
    goTo,
    get index() { return state.shown; },
    setMode(next) {
      s.mode = EFFECTS.includes(next) ? next : s.mode;
      layout();
      wake();
    },
    setLabels(label) {
      slides.forEach((slide, i) => slide.setAttribute('aria-label', label(i)));
    }
  };
}

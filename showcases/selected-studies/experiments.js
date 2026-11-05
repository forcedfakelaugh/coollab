(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const detail = document.getElementById('experiment-canvas');
  const controls = { intensity: document.getElementById('experiment-intensity'), output: document.getElementById('intensity-value'), pause: document.getElementById('experiment-pause'), reset: document.getElementById('experiment-reset'), allPause: document.getElementById('playground-pause') };
  let thumbnails = [];
  let kind = 'ripple';
  let intensity = .5;
  let point = { x: .5, y: .5 };
  let playing = !reduced.matches;
  let time = 0;
  let frame = 0;
  let previous = 0;

  function dimensions(canvas) {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(devicePixelRatio || 1, 2);
    if (!rect.width || !rect.height) return null;
    const w = Math.round(rect.width * ratio), h = Math.round(rect.height * ratio);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    const context = canvas.getContext('2d');
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    return { context, w: rect.width, h: rect.height };
  }
  function draw(canvas, mode, isDetail) {
    const size = dimensions(canvas);
    if (!size) return;
    const { context: ctx, w, h } = size;
    const amount = isDetail ? intensity : .5;
    const px = isDetail ? point.x : .5 + Math.sin(time * .18) * .15;
    const py = isDetail ? point.y : .5;
    ctx.fillStyle = { ripple: '#dcd8c5', orbit: '#ed5943', weave: '#1c3440', wave: '#171720' }[mode];
    ctx.fillRect(0, 0, w, h);
    ctx.lineWidth = isDetail ? 1.1 : .7;
    if (mode === 'ripple') {
      ctx.strokeStyle = '#2c474c';
      const cx = w * (.2 + px * .6), cy = h * (.2 + py * .6);
      const max = Math.hypot(w, h);
      for (let i = 0; i < 32; i++) {
        const radius = (i / 32 + (time * .012) % (1 / 32)) * max * (.4 + amount * .45);
        ctx.beginPath();
        for (let s = 0; s <= 96; s++) {
          const angle = s / 96 * Math.PI * 2;
          const r = radius + Math.sin(angle * 4 + time * .6 + i * .17) * amount * 8;
          const x = cx + Math.cos(angle) * r, y = cy + Math.sin(angle) * r * .72;
          if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    } else if (mode === 'orbit') {
      ctx.strokeStyle = '#f4e4cc';
      ctx.translate(w / 2, h / 2);
      const r = Math.min(w, h) * .38;
      for (let i = 0; i < 24; i++) {
        ctx.save();
        ctx.rotate(i / 24 * Math.PI + time * .12 + (px - .5) * .8);
        ctx.beginPath();
        ctx.ellipse(0, 0, r, r * (.15 + amount * .45 + py * .12), 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    } else if (mode === 'weave') {
      ctx.strokeStyle = '#adc7b2';
      const spacing = Math.max(7, Math.min(w, h) / 35);
      const warp = (x, y) => {
        const dx = x - px * w, dy = y - py * h;
        const falloff = Math.exp(-(dx * dx + dy * dy) / (w * h * .12));
        return { x: x + Math.sin(y / h * 5 + time * .4) * falloff * w * .22 * amount, y: y + Math.cos(x / w * 5 + time * .35) * falloff * h * .25 * amount };
      };
      for (let orientation = 0; orientation < 2; orientation++) {
        const limit = orientation ? h : w;
        for (let n = -spacing; n <= limit + spacing; n += spacing) {
          ctx.beginPath();
          for (let s = 0; s <= 50; s++) {
            const p = warp(orientation ? w * s / 50 : n, orientation ? n : h * s / 50);
            if (s === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
          }
          ctx.stroke();
        }
      }
    } else {
      for (let row = 0; row < 18; row++) {
        for (let col = 0; col < 34; col++) {
          const wave = (Math.sin(col * .2 + row * .27 + time * 1.2 - px * 5) + 1) / 2;
          const x = w * (.08 + col / 34 * .84);
          const y = h * (.25 + row / 18 * .65);
          const length = (8 + wave * h * .25 * (.2 + amount)) * (.55 + row / 36);
          const alpha = .25 + row / 28;
          ctx.strokeStyle = `rgba(${210 + Math.round(wave * 35)},${205 + Math.round(wave * 35)},245,${alpha})`;
          ctx.lineWidth = Math.max(1, w / 240);
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - length * (.7 + py * .6)); ctx.stroke();
        }
      }
    }
  }
  function visible() { return !document.hidden && !document.getElementById('contact-dialog').open && (document.getElementById('playground-dialog').open || document.getElementById('experiment-dialog').open); }
  function render(now) {
    frame = 0;
    if (!visible()) { previous = 0; return; }
    if (playing) time += Math.min(.05, (now - (previous || now)) / 1000);
    previous = now;
    if (document.getElementById('experiment-dialog').open) draw(detail, kind, true);
    else thumbnails.forEach((canvas) => {
      const bounds = canvas.getBoundingClientRect();
      if (bounds.bottom > 0 && bounds.top < innerHeight) draw(canvas, canvas.dataset.experiment, false);
    });
    if (playing) frame = requestAnimationFrame(render);
  }
  function sync() { if (!frame && visible()) frame = requestAnimationFrame(render); }
  function updateButtons() {
    controls.pause.textContent = playing ? 'Pause Ⅱ' : 'Play ▷';
    controls.pause.setAttribute('aria-pressed', String(!playing));
    controls.allPause.textContent = playing ? 'Pause motion Ⅱ' : 'Play motion ▷';
    controls.allPause.setAttribute('aria-pressed', String(!playing));
  }
  const toggle = () => { playing = !playing; previous = 0; updateButtons(); sync(); };
  controls.pause.addEventListener('click', toggle);
  controls.allPause.addEventListener('click', toggle);
  controls.intensity.addEventListener('input', () => { intensity = Number(controls.intensity.value) / 100; controls.output.value = controls.intensity.value; sync(); });
  controls.reset.addEventListener('click', () => { intensity = .5; point = { x: .5, y: .5 }; time = 0; controls.intensity.value = '50'; controls.output.value = '50'; sync(); });
  detail.addEventListener('pointermove', (event) => { const r = detail.getBoundingClientRect(); point = { x: (event.clientX - r.left) / r.width, y: (event.clientY - r.top) / r.height }; sync(); });
  detail.addEventListener('pointerdown', (event) => { detail.setPointerCapture(event.pointerId); const r = detail.getBoundingClientRect(); point = { x: (event.clientX - r.left) / r.width, y: (event.clientY - r.top) / r.height }; sync(); });
  window.addEventListener('resize', sync);
  document.addEventListener('visibilitychange', sync);
  document.getElementById('playground-dialog').addEventListener('scroll', sync, { passive: true });
  reduced.addEventListener('change', () => { playing = !reduced.matches; updateButtons(); sync(); });
  window.StudiesLab = {
    init() { thumbnails = [...document.querySelectorAll('canvas[data-experiment]')]; updateButtons(); },
    select(value) { kind = value; point = { x: .5, y: .5 }; time = 0; },
    sync,
  };
})();

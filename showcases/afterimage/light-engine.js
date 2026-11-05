/**
 * AFTERIMAGE light apparatus, adapted from React Bits Prism.
 * Copyright (c) 2026 David Haz. MIT + Commons Clause; see LICENSE-react-bits.txt.
 * Source: https://github.com/DavidHDev/react-bits/blob/e12c22192ac7b4b452c5e2feb9b586d74765d696/src/content/Backgrounds/Prism/Prism.jsx
 * The upstream vertex and fragment shaders are retained below. The standalone
 * lifecycle, art direction, presets, transitions and controls are original.
 */

const VERTEX = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform mat3 uRay;
uniform float uGlow;
uniform vec2 uOffset;
uniform float uColorFreq;
uniform float uCenterShift;
uniform float uInvBaseHalf;
uniform float uInvHeight;
uniform float uMinAxis;
uniform float uPxScale;
uniform sampler2D uPalette;
uniform int uUsePalette;
uniform float uTime;
uniform float uNoise;
uniform float uSaturation;
uniform mat3 uHue;
uniform int uUseHue;
uniform float uLight;
uniform float uNeutral;
out vec4 outColor;

const vec4 PHASE_COS = vec4(1.0, 0.5403023058681398, -0.4161468365471424, -0.9899924966004454);
const vec4 PHASE_SIN = vec4(0.0, 0.8414709848078965, 0.9092974268256817, 0.1411200080598672);

float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453123);
}

float pyramid(vec3 p) {
  vec3 q = vec3(abs(p.x) * uInvBaseHalf, abs(p.y) * uInvHeight, abs(p.z) * uInvBaseHalf);
  return max((q.x + q.y + q.z - 1.0) * uMinAxis * 0.5773502691896258, -p.y);
}

vec3 grade(vec3 col, vec2 seed) {
  col += (rand(seed) - 0.5) * uNoise;
  col = clamp(col, 0.0, 1.0);
  float L = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = clamp(mix(vec3(L), col, uSaturation), 0.0, 1.0);
  if (uUseHue == 1) col = clamp(uHue * col, 0.0, 1.0);
  return col;
}

void main() {
  vec2 f = (gl_FragCoord.xy - 0.5 * uResolution - uOffset) * uPxScale;
  vec3 origin = uRay * vec3(f, 0.0);
  vec3 axis = uRay[2];
  float z = 5.0;
  vec4 o = vec4(0.0);
  for (int i = 0; i < 100; i++) {
    vec3 p = origin + axis * z;
    float d = 0.1 + 0.2 * abs(pyramid(p + vec3(0.0, uCenterShift, 0.0)));
    z -= d;
    float phase = (p.y + z) * uColorFreq;
    vec4 band = sin(phase) * PHASE_COS + cos(phase) * PHASE_SIN + 1.0;
    if (uUsePalette == 1) band.rgb = texture(uPalette, vec2(phase * 0.15915494309189535, 0.5)).rgb * 2.0;
    o += band / d;
  }
  vec4 raw = o * o * uGlow / 1e5;
  vec4 e = exp(2.0 * raw);
  vec4 mapped = (e - 1.0) / (e + 1.0);
  vec2 seed = gl_FragCoord.xy + vec2(uTime);
  if (uLight > 0.5) {
    float peak = max(raw.r, max(raw.g, raw.b));
    vec3 hue = grade(raw.rgb / max(peak, 1e-6), seed);
    vec3 ink = pow(hue, vec3(1.5)) * mix(0.86, 0.32, uNeutral);
    float strength = max(mapped.r, max(mapped.g, mapped.b)) * mapped.a;
    float cover = clamp(strength * 0.95 + (rand(seed.yx) - 0.5) * uNoise * 0.5, 0.0, 1.0);
    outColor = vec4(ink * cover, cover);
  } else {
    outColor = vec4(grade(mapped.rgb, seed) * mapped.a, mapped.a);
  }
}`;


const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const PALETTE_SIZE = 128;
const IDENTITY = [1, 0, 0, 0, 1, 0, 0, 0, 1];
const PRESETS = [
  { height: 4.1, width: 3.8, scale: 1.8, yaw: 0.6, pitch: -0.15, roll: -0.35, frequency: 1.55, glow: 0.95, saturation: 2.8, drift: 0.13 },
  { height: 2.2, width: 5.8, scale: 1.65, yaw: 0.5, pitch: 0.55, roll: -0.6, frequency: 1.4, glow: 0.56, saturation: 1.7, drift: 0.09 },
  { height: 3.8, width: 4.6, scale: 1.8, yaw: 1.35, pitch: 0.95, roll: 0.65, frequency: 0.45, glow: 0.78, saturation: 1.5, drift: 0.055 },
];
const SPECTRA = [
  [[3, 18, 95], [15, 130, 255], [138, 245, 255], [3, 10, 24], [255, 98, 8], [255, 222, 120], [18, 9, 4]],
  [[110, 25, 255], [230, 70, 255], [255, 72, 24], [255, 227, 85], [18, 204, 255]],
  [[255, 63, 15], [255, 165, 50], [255, 228, 165], [145, 36, 255], [45, 122, 255]],
];
const PALETTES = [null,
  [[91, 8, 12], [252, 41, 12], [255, 116, 24], [255, 229, 154], [242, 60, 12]],
  [[24, 34, 151], [37, 112, 255], [62, 235, 255], [210, 255, 243], [95, 70, 235]],
];

const rotation = (yaw, pitch, roll) => {
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const cx = Math.cos(pitch), sx = Math.sin(pitch);
  const cz = Math.cos(roll), sz = Math.sin(roll);
  return [
    cy * cz + sy * sx * sz, cx * sz, -sy * cz + cy * sx * sz,
    -cy * sz + sy * sx * cz, cx * cz, sy * sz + cy * sx * cz,
    sy * cx, -sx, cy * cx,
  ];
};

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
}

function makePalette(stops) {
  const data = new Float32Array(PALETTE_SIZE * 4);
  for (let i = 0; i < PALETTE_SIZE; i++) {
    const position = (i / PALETTE_SIZE) * stops.length;
    const index = Math.floor(position);
    const a = stops[index % stops.length], b = stops[(index + 1) % stops.length];
    const t = position - index, k = t * t * (3 - 2 * t);
    for (let c = 0; c < 3; c++) data[i * 4 + c] = a[c] + (b[c] - a[c]) * k;
    data[i * 4 + 3] = 255;
  }
  return data;
}

/** One WebGL2 canvas. renderStill() draws synchronously before a canvas capture. */
export function createLightEngine(canvas, { onUnavailable = () => {}, onReady = () => {} } = {}) {
  let alive = true, ready = false, notified = false, raf = 0;
  let paused = false, visible = true, last = 0, phase = 0, scene = 0, palette = 0;
  let energy = 0.55, energyNow = energy, paletteDirty = true, pulse = 0, angle = 0;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = window.matchMedia('(pointer: coarse)');
  let reduceMotion = reduced.matches;
  const pose = { ...PRESETS[0] };
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let colors = makePalette(SPECTRA[0]), targetColors = colors.slice();
  const pixels = new Uint8Array(PALETTE_SIZE * 4);
  let resizeObserver, intersectionObserver;
  let gl, program, vao, texture;
  const uniforms = {};

  const fail = () => {
    ready = false;
    cancelAnimationFrame(raf);
    raf = 0;
    if (!notified) { notified = true; onUnavailable(); }
  };
  const api = {
    get ready() { return ready && alive; },
    setScene(index) {
      if (!Number.isFinite(index)) return;
      scene = clamp(Math.round(index), 0, PRESETS.length - 1);
      targetColors = makePalette(PALETTES[palette] || SPECTRA[scene]);
      change();
    },
    setPalette(index) {
      if (!Number.isFinite(index)) return;
      palette = clamp(Math.round(index), 0, PALETTES.length - 1);
      targetColors = makePalette(PALETTES[palette] || SPECTRA[scene]);
      change();
    },
    setEnergy(value) {
      if (!Number.isFinite(value)) return;
      energy = clamp(value, 0, 1);
      change();
    },
    setPulse(value) {
      // A stopped frame stays exactly as seen, so a captured poster matches it.
      if (Number.isFinite(value) && !paused && !reduceMotion) pulse = clamp(value, 0, 1);
    },
    setAngle(value) {
      if (!Number.isFinite(value)) return;
      angle = clamp(value, -1, 1);
      if (paused || reduceMotion) draw();
      else wake();
    },
    setPaused(value) {
      paused = Boolean(value);
      last = 0;
      if (paused) { cancelAnimationFrame(raf); raf = 0; }
      else wake();
    },
    renderStill() {
      if (!ready || !alive || gl.isContextLost()) return false;
      draw();
      return true;
    },
    destroy() {
      if (!alive) return;
      alive = false;
      ready = false;
      cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('blur', onPointerLeave);
      reduced.removeEventListener('change', onReducedMotion);
      coarse.removeEventListener('change', resize);
      if (gl && !gl.isContextLost()) {
        if (texture) gl.deleteTexture(texture);
        if (vao) gl.deleteVertexArray(vao);
        if (program) gl.deleteProgram(program);
      }
    },
  };

  function syncTargets() {
    Object.assign(pose, PRESETS[scene]);
    colors.set(targetColors);
    energyNow = energy;
    pointer.x = pointer.y = pointer.tx = pointer.ty = 0;
    paletteDirty = true;
  }

  function change() {
    if (!ready || !alive) return;
    // A paused or motion-reduced apparatus still responds to deliberate controls.
    if (paused || reduceMotion) { syncTargets(); draw(); }
    else wake();
  }

  function setup() {
    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    program = gl.createProgram();
    if (!vertex || !fragment || !program) {
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
      if (program) gl.deleteProgram(program);
      return false;
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      program = null;
      return false;
    }
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < count; i++) {
      const info = gl.getActiveUniform(program, i);
      if (info) uniforms[info.name] = gl.getUniformLocation(program, info.name);
    }
    vao = gl.createVertexArray();
    texture = gl.createTexture();
    if (!vao || !texture) return false;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, PALETTE_SIZE, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    paletteDirty = true;
    return true;
  }

  function draw() {
    if (!ready || !alive || gl.isContextLost()) return;
    gl.bindVertexArray(vao);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    if (paletteDirty) {
      for (let i = 0; i < colors.length; i++) pixels[i] = Math.round(colors[i]);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, PALETTE_SIZE, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      paletteDirty = false;
    }
    const movement = phase * pose.drift;
    const yaw = pose.yaw + Math.sin(movement) * 0.6 + pointer.x * 0.2 + angle * 1.2;
    const pitch = pose.pitch + Math.sin(movement * 0.7) * 0.14 - pointer.y * 0.14;
    const roll = pose.roll + Math.sin(movement * 0.55) * 0.12;
    const aspect = canvas.width / Math.max(1, canvas.height);
    const fit = Math.min(1, aspect / 0.92);
    gl.uniform2f(uniforms.uResolution, canvas.width, canvas.height);
    gl.uniformMatrix3fv(uniforms.uRay, false, rotation(yaw, pitch, roll));
    gl.uniform1f(uniforms.uGlow, pose.glow * (0.8 + energyNow * 1.4) * (1 + pulse * 1.6));
    gl.uniform2f(uniforms.uOffset, 0, 0);
    gl.uniform1f(uniforms.uColorFreq, pose.frequency);
    gl.uniform1f(uniforms.uCenterShift, pose.height * 0.25);
    gl.uniform1f(uniforms.uInvBaseHalf, 2 / pose.width);
    gl.uniform1f(uniforms.uInvHeight, 1 / pose.height);
    gl.uniform1f(uniforms.uMinAxis, Math.min(pose.width * 0.5, pose.height));
    gl.uniform1f(uniforms.uPxScale, 1 / (canvas.height * 0.1 * pose.scale * fit * (1 + pulse * 0.07)));
    gl.uniform1i(uniforms.uPalette, 0);
    gl.uniform1i(uniforms.uUsePalette, 1);
    gl.uniform1f(uniforms.uTime, phase);
    gl.uniform1f(uniforms.uNoise, 0);
    gl.uniform1f(uniforms.uSaturation, pose.saturation);
    gl.uniformMatrix3fv(uniforms.uHue, false, IDENTITY);
    gl.uniform1i(uniforms.uUseHue, 0);
    gl.uniform1f(uniforms.uLight, 0);
    gl.uniform1f(uniforms.uNeutral, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function frame(now) {
    raf = 0;
    if (!alive || !ready || paused || reduceMotion || !visible || document.hidden) { last = 0; return; }
    // A 40 fps ceiling keeps the dense ray march from consuming an entire GPU.
    if (last && now - last < 24) { raf = requestAnimationFrame(frame); return; }
    const dt = last ? Math.min(0.06, (now - last) / 1000) : 1 / 40;
    last = now;
    phase += dt * (0.4 + energyNow * 0.8 + pulse * 0.5);
    const follow = 1 - Math.exp(-dt * 3.2);
    for (const key of Object.keys(pose)) pose[key] += (PRESETS[scene][key] - pose[key]) * follow;
    pointer.x += (pointer.tx - pointer.x) * follow;
    pointer.y += (pointer.ty - pointer.y) * follow;
    energyNow += (energy - energyNow) * follow;
    for (let i = 0; i < colors.length; i++) {
      const delta = targetColors[i] - colors[i];
      if (Math.abs(delta) > 0.05) { colors[i] += delta * follow; paletteDirty = true; }
    }
    draw();
    raf = requestAnimationFrame(frame);
  }

  function wake() {
    if (alive && ready && !raf && !paused && !reduceMotion && visible && !document.hidden) raf = requestAnimationFrame(frame);
  }

  function resize() {
    if (!alive || !ready) return;
    const rect = canvas.getBoundingClientRect();
    // Deliberately below devicePixelRatio: light has no hard pixel edges.
    const density = Math.min(window.devicePixelRatio || 1, coarse.matches ? 1 : 0.7);
    const pixelLimit = 900000;
    const fit = Math.min(1, Math.sqrt(pixelLimit / Math.max(1, rect.width * rect.height * density * density)));
    canvas.width = Math.max(1, Math.round(rect.width * density * fit));
    canvas.height = Math.max(1, Math.round(rect.height * density * fit));
    draw();
    wake();
  }

  function onPointerMove(event) {
    if (paused || reduceMotion || event.pointerType === 'touch') return;
    const rect = canvas.getBoundingClientRect();
    pointer.tx = clamp((event.clientX - rect.left) / Math.max(1, rect.width) * 2 - 1, -1, 1);
    pointer.ty = clamp((event.clientY - rect.top) / Math.max(1, rect.height) * 2 - 1, -1, 1);
    wake();
  }
  function onPointerLeave() { pointer.tx = pointer.ty = 0; wake(); }
  function onVisibility() {
    last = 0;
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
    else wake();
  }
  function onReducedMotion(event) {
    reduceMotion = event.matches;
    if (reduceMotion) pulse = 0;
    last = 0;
    if (reduceMotion) { cancelAnimationFrame(raf); raf = 0; syncTargets(); draw(); }
    else wake();
  }
  function onContextLost(event) { event.preventDefault(); fail(); }
  function onContextRestored() {
    if (!alive) return;
    ready = setup();
    if (ready) { notified = false; syncTargets(); resize(); onReady(api); }
    else fail();
  }

  try {
    gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false });
    if (!gl || !setup()) { fail(); return api; }
    ready = true;
  } catch { fail(); return api; }

  canvas.addEventListener('pointermove', onPointerMove, { passive: true });
  canvas.addEventListener('pointerleave', onPointerLeave, { passive: true });
  canvas.addEventListener('webglcontextlost', onContextLost);
  canvas.addEventListener('webglcontextrestored', onContextRestored);
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('blur', onPointerLeave);
  reduced.addEventListener('change', onReducedMotion);
  coarse.addEventListener('change', resize);
  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  intersectionObserver = new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting);
    last = 0;
    if (!visible) { cancelAnimationFrame(raf); raf = 0; }
    else wake();
  });
  intersectionObserver.observe(canvas);
  resize();
  onReady(api);
  return api;
}

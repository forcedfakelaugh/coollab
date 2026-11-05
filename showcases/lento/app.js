import * as THREE from './vendor/three.module.min.js';
import { GLTFLoader } from './vendor/GLTFLoader.js';

const sceneElement = document.querySelector('#scene');
const canvas = document.querySelector('#lamp-canvas');
const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
const mobileQuality = innerWidth < 761 || matchMedia('(pointer: coarse)').matches;
const finishes = { clay: { color: '#b95735', name: 'Terracotta' }, chalk: { color: '#ded8ca', name: 'Chalk' }, olive: { color: '#626954', name: 'Olive' } };
const state = { finish: 'clay', brightness: .75, on: true, paused: motionQuery.matches, rotation: 0, pointerX: 0, pointerY: 0 };
const experience = document.querySelector('.experience');
const panels = [...document.querySelectorAll('.story-panel')];
const stage = document.querySelector('.story-stage');
const animatedStyles = new Map();
const translate = text => window.showcaseLanguage?.translate(text) || text;
let renderer, renderFrame = 0, contextLost = false;
let requestRender = () => {};
let scrollActiveUntil = 0;
function wakeScroll() {
  // Touch begins before the browser delivers its first scroll event. Start the
  // mobile loop then, and keep it running through short gaps in gesture events.
  scrollActiveUntil = performance.now() + 180;
  requestRender();
}
function labels() {
  document.querySelectorAll('[data-power]').forEach(button => {
    button.setAttribute('aria-pressed', String(state.on));
    button.setAttribute('aria-label', translate(state.on ? 'Turn the lamp off' : 'Turn the lamp on'));
    button.querySelector('[data-power-label]').textContent = translate(state.on ? 'Lights on' : 'Lights off');
  });
  document.querySelector('#finish-name').textContent = translate(finishes[state.finish].name);
}
document.querySelectorAll('[data-finish]').forEach(button => button.addEventListener('click', () => {
  state.finish = button.dataset.finish;
  document.querySelectorAll('[data-finish]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  labels(); requestRender();
}));
document.querySelectorAll('[data-power]').forEach(button => button.addEventListener('click', () => { state.on = !state.on; labels(); requestRender(); }));
document.querySelector('#brightness').addEventListener('input', event => {
  state.brightness = Number(event.target.value) / 100;
  document.querySelector('#brightness-value').textContent = `${event.target.value}%`;
  state.on = true; labels(); requestRender();
});
document.querySelector('#rotation').addEventListener('input', event => { state.rotation = Number(event.target.value) * Math.PI / 180; requestRender(); });
motionQuery.addEventListener('change', event => { state.paused = event.matches; labels(); requestRender(); });
window.addEventListener('showcase-language', () => { labels(); requestRender(); });
window.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse' || state.paused || mobileQuality || innerWidth < 761) return;
  state.pointerX = event.clientX / innerWidth - .5;
  state.pointerY = event.clientY / innerHeight - .5;
  requestRender();
}, { passive: true });
window.addEventListener('scroll', wakeScroll, { passive: true });
window.addEventListener('touchstart', wakeScroll, { passive: true });
window.addEventListener('touchmove', wakeScroll, { passive: true });
labels();

function fallback(message = 'A still preview is shown because 3D is unavailable on this device.') {
  sceneElement.classList.remove('is-ready');
  document.body.classList.remove('is-animated');
  for (const [element, properties] of animatedStyles) {
    for (const property of Object.keys(properties)) element.style.removeProperty(property);
  }
  animatedStyles.clear();
  panels.forEach((panel, index) => {
    panel.inert = false; panel.removeAttribute('aria-hidden'); panel.removeAttribute('style');
    const marker = document.querySelectorAll('[data-stop]')[index];
    marker.removeAttribute('id'); panel.id = marker.dataset.stop;
  });
  document.body.classList.add('is-static');
  sceneElement.removeAttribute('aria-busy');
  document.querySelector('#render-status').textContent = translate(message);
  document.querySelectorAll('.configurator button,.configurator input,[data-power]').forEach(control => { control.disabled = true; });
  if (renderFrame) cancelAnimationFrame(renderFrame);
  renderFrame = 0;
  requestRender = () => {};
}

try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobileQuality ? 1.25 : 1.8));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = !mobileQuality;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  initScene();
} catch (error) {
  console.warn('Lento 3D preview unavailable:', error);
  fallback();
}

function initScene() {
  const scene = new THREE.Scene();
  sceneElement.setAttribute('aria-busy', 'true');
  const camera = new THREE.OrthographicCamera(-5, 5, 2.8, -2.8, .1, 80);
  camera.position.set(0, 4.5, 9);
  camera.lookAt(0, 1.45, 0);
  const world = new THREE.Group(); scene.add(world);
  const lamp = new THREE.Group(); world.add(lamp);
  const lampMaterials = [];
  let lampEmitter;
  const scenery = new THREE.Group(); world.add(scenery);
  let geometryVersion = 0;
  let scenePrepared = false;
  const surfaceLoads = [];

  // A small, locally generated studio environment provides broad reflections.
  const environmentScene = new THREE.Scene();
  environmentScene.add(new THREE.Mesh(new THREE.BoxGeometry(18, 18, 18), new THREE.MeshBasicMaterial({ color: '#bcb9ad', side: THREE.BackSide })));
  for (const [x, y, z, width, height, color] of [[-5, 3, 3, 4, 7, '#ffffff'], [5, 5, 0, 3, 6, '#f6ead3'], [0, 6, -5, 5, 3, '#ffffff']]) {
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }));
    panel.position.set(x, y, z); panel.lookAt(0, 1, 0); environmentScene.add(panel);
  }
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(environmentScene, .04);
  scene.environment = environment.texture;
  pmrem.dispose();
  environmentScene.traverse(object => { if (object.isMesh) { object.geometry.dispose(); object.material.dispose(); } });

  const stone = new THREE.MeshStandardMaterial({ color: '#b5b3a6', roughness: .94, envMapIntensity: .25 });
  const textures = new THREE.TextureLoader();
  const surfaceMap = (file, options = {}) => {
    const asset = mobileQuality ? file.replace('.jpg', '-mobile.jpg') : file;
    let loaded;
    surfaceLoads.push(new Promise(resolve => { loaded = resolve; }));
    const texture = textures.load(`assets/${asset}`, () => { loaded(); requestRender(); }, undefined, () => {
      sceneElement.dataset.surfaceDetail = 'partial';
      loaded();
    });
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(...(options.repeat || [1, 1]));
    texture.offset.set(...(options.offset || [0, 0]));
    texture.anisotropy = Math.min(mobileQuality ? 2 : 8, renderer.capabilities.getMaxAnisotropy());
    if (options.color) texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };
  // Use one uninterrupted stone slab, excluding the source texture's grout lines.
  const stoneUV = { repeat: [.22, .14], offset: [.10, .05] };
  stone.map = surfaceMap('stone-color.jpg', { ...stoneUV, color: true });
  stone.normalMap = surfaceMap('stone-normal.jpg', stoneUV);
  stone.normalScale.set(.18, .18);
  stone.roughnessMap = surfaceMap('stone-roughness.jpg', stoneUV);
  const mesh = (geometry, material, parent, x = 0, y = 0, z = 0) => {
    const object = new THREE.Mesh(geometry, material); object.position.set(x, y, z);
    object.castShadow = true; object.receiveShadow = true; parent.add(object); return object;
  };
  // The model's upper jaw rests at y=0; its screw pad sits 0.02016m below.
  // Fit the tabletop between those jaws, with its right edge inside the clamp.
  const lampScale = 4.1;
  const deskThickness = .02016 * lampScale;
  const deskEdge = .95;
  const deskWidth = 2.15, deskDepth = 1.45;
  const deskCenter = deskEdge - deskWidth / 2;
  const deskShape = new THREE.Shape();
  const halfWidth = deskWidth / 2 - .012, halfDepth = deskDepth / 2 - .012, radius = .045;
  deskShape.moveTo(-halfWidth + radius, -halfDepth);
  deskShape.lineTo(halfWidth - radius, -halfDepth);
  deskShape.quadraticCurveTo(halfWidth, -halfDepth, halfWidth, -halfDepth + radius);
  deskShape.lineTo(halfWidth, halfDepth - radius);
  deskShape.quadraticCurveTo(halfWidth, halfDepth, halfWidth - radius, halfDepth);
  deskShape.lineTo(-halfWidth + radius, halfDepth);
  deskShape.quadraticCurveTo(-halfWidth, halfDepth, -halfWidth, halfDepth - radius);
  deskShape.lineTo(-halfWidth, -halfDepth + radius);
  deskShape.quadraticCurveTo(-halfWidth, -halfDepth, -halfWidth + radius, -halfDepth);
  const deskGeometry = new THREE.ExtrudeGeometry(deskShape, { depth: deskThickness - .012, bevelEnabled: true, bevelThickness: .006, bevelSize: .012, bevelSegments: 3, steps: 1, curveSegments: 12 });
  deskGeometry.rotateX(Math.PI / 2);
  deskGeometry.translate(deskCenter, -.006, 0);
  const deskPosition = deskGeometry.attributes.position;
  const deskUV = deskGeometry.attributes.uv;
  for (let i = 0; i < deskPosition.count; i++) {
    deskUV.setXY(i, (deskPosition.getX(i) - deskCenter) / deskWidth + .5, deskPosition.getZ(i) / deskDepth + .5);
  }
  const desk = mesh(deskGeometry, stone, scenery);
  // Draw the notebook before the surface beneath it, then the light pool.
  // Camera-depth sorting can otherwise swap these overlapping transparent meshes.
  desk.renderOrder = 1;
  // One small notebook keeps the desktop coherent and the lamp prominent.
  const book = new THREE.Group(); scenery.add(book); book.position.set(-.47, -.01, .08); book.rotation.y = -.12; book.scale.setScalar(.72);
  const coverMat = new THREE.MeshStandardMaterial({ color: '#6b735e', roughness: .9 });
  mesh(new THREE.BoxGeometry(.95, .065, 1.15), coverMat, book, 0, .015);
  mesh(new THREE.BoxGeometry(.91, .11, 1.1), new THREE.MeshStandardMaterial({ color: '#e6ddc8', roughness: .9 }), book, 0, .09);
  mesh(new THREE.BoxGeometry(.95, .027, 1.15), coverMat, book, 0, .16);
  const models = new GLTFLoader();
  const lampLoaded = models.loadAsync(`assets/desk-lamp${mobileQuality ? '-mobile' : ''}.glb`).then(({ scene: model }) => {
    if (contextLost) return;
    let emittingMesh;
    model.scale.setScalar(lampScale);
    model.rotation.y = Math.PI / 2;
    model.position.set(deskEdge - .018 * lampScale, 0, .3);
    model.traverse(object => {
      if (!object.isMesh) return;
      object.castShadow = object.receiveShadow = true;
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        material.envMapIntensity = 1.1;
        for (const key of ['map', 'normalMap', 'roughnessMap', 'metalnessMap']) {
          if (material[key]) material[key].anisotropy = Math.min(mobileQuality ? 2 : 8, renderer.capabilities.getMaxAnisotropy());
        }
        if (material.name.endsWith('_light')) {
          emittingMesh = object;
          lampEmitter = material;
          material.emissive.set('#ffd8a0');
          material.emissiveIntensity = 2.5 * state.brightness;
        } else {
          // Recolor only the orange painted surfaces; preserve steel and wear.
          const finishUniform = { value: new THREE.Color(finishes[state.finish].color) };
          material.onBeforeCompile = shader => {
            shader.uniforms.lentoFinish = finishUniform;
            shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nuniform vec3 lentoFinish;');
            shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', `#include <map_fragment>
              float paintMask = smoothstep(1.35, 2.5, diffuseColor.r / max(diffuseColor.g, 0.012)) * smoothstep(0.045, 0.16, diffuseColor.r);
              float paintShade = clamp(diffuseColor.r / 0.32, 0.25, 1.8);
              diffuseColor.rgb = mix(diffuseColor.rgb, lentoFinish * paintShade, paintMask);`);
          };
          material.customProgramCacheKey = () => 'lento-painted-metal-v1';
          lampMaterials.push(finishUniform);
        }
      }
    });
    lamp.add(model);
    geometryVersion++;
    world.updateMatrixWorld(true);
    if (emittingMesh) {
      const lightCenter = new THREE.Box3().setFromObject(emittingMesh).getCenter(new THREE.Vector3());
      bulb.position.copy(lamp.worldToLocal(lightCenter));
      bulb.position.y -= .12;
    }
    sceneElement.dataset.lamp = 'ready';
    measure();
    requestRender();
  }).catch(error => {
    console.warn('Lento lamp model unavailable:', error);
    fallback();
  });
  const loadProp = async (file, fallbackObject, { width: propWidth, x, z, rotation }) => {
    try {
      const { scene: model } = await models.loadAsync(`assets/${file}${mobileQuality ? '-mobile' : ''}.glb`);
      const bounds = new THREE.Box3().setFromObject(model);
      const size = bounds.getSize(new THREE.Vector3());
      const center = bounds.getCenter(new THREE.Vector3());
      const factor = propWidth / Math.max(size.x, size.z);
      model.scale.setScalar(factor);
      model.position.set(-center.x * factor, -bounds.min.y * factor + .006, -center.z * factor);
      const solidMeshes = [];
      model.traverse(object => {
        if (!object.isMesh) return;
        solidMeshes.push(object);
        object.castShadow = object.receiveShadow = true;
        for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
          material.envMapIntensity = .7;
          for (const key of ['map', 'normalMap', 'roughnessMap', 'metalnessMap']) {
            if (material[key]) material[key].anisotropy = Math.min(mobileQuality ? 2 : 8, renderer.capabilities.getMaxAnisotropy());
          }
        }
      });
      // Keep only the closed prop's outer surface visible as its color fades.
      // A depth-only draw prevents back faces/pages showing through its cover.
      const depthMaterial = new THREE.MeshBasicMaterial({ colorWrite: false, side: THREE.DoubleSide });
      for (const object of solidMeshes) {
        const depth = new THREE.Mesh(object.geometry, depthMaterial);
        depth.userData.fadeDepth = true;
        depth.renderOrder = -1;
        object.add(depth);
      }
      const placement = new THREE.Group();
      placement.name = file;
      placement.position.set(x, 0, z);
      placement.rotation.y = rotation;
      placement.add(model);
      scenery.add(placement);
      scenery.remove(fallbackObject);
      geometryVersion++;
      fallbackObject.traverse(object => { if (object.isMesh) object.geometry.dispose(); });
      sceneElement.dataset[file] = 'ready';
      requestRender();
    } catch (error) {
      sceneElement.dataset[file] = 'fallback';
      console.warn(`Lento ${file} detail unavailable:`, error);
    }
  };
  const notebookLoaded = loadProp('notebook', book, { width: .82, x: -.47, z: .08, rotation: -.12 });
  const glowCanvas = document.createElement('canvas'); glowCanvas.width = glowCanvas.height = 128;
  const glowContext = glowCanvas.getContext('2d');
  const glowGradient = glowContext.createRadialGradient(64, 64, 0, 64, 64, 64);
  glowGradient.addColorStop(0, 'rgba(255,204,111,.7)'); glowGradient.addColorStop(.4, 'rgba(255,201,107,.35)'); glowGradient.addColorStop(1, 'rgba(255,201,107,0)');
  glowContext.fillStyle = glowGradient; glowContext.fillRect(0, 0, 128, 128);
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(deskWidth - .15, deskDepth - .15), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(glowCanvas), transparent: true, depthWrite: false, opacity: .18, blending: THREE.AdditiveBlending }));
  glow.renderOrder = 2;
  glow.position.set(deskCenter, .008, 0); glow.rotation.x = -Math.PI / 2; scenery.add(glow);

  const fill = new THREE.HemisphereLight('#fff9eb', '#8c8475', .4); scene.add(fill);
  const key = new THREE.DirectionalLight('#fff3dc', 2.2); key.position.set(-3.5, 7, 4); scene.add(key);
  const shadowSize = mobileQuality ? 512 : 2048;
  key.castShadow = true; key.shadow.mapSize.set(shadowSize, shadowSize);
  key.shadow.camera.left = -7; key.shadow.camera.right = 7; key.shadow.camera.top = 7; key.shadow.camera.bottom = -7;
  key.shadow.normalBias = .025; key.shadow.bias = -.0001; key.shadow.radius = 4;
  const rim = new THREE.DirectionalLight('#ffffff', 1.4); rim.position.set(4, 3, -3); scene.add(rim);
  // The reflector directs a soft cone onto the desk. Keep the target in the
  // assembly so the pool of light follows the lamp when visitors turn it.
  const bulb = new THREE.SpotLight('#ffd09a', 45 * state.brightness, 9, .65, .8, 2);
  bulb.position.set(-.08, 2.25, 1.62); lamp.add(bulb);
  bulb.target.position.set(deskCenter + .1, .015, .08); world.add(bulb.target);

  let mobile = innerWidth < 761, height = 0, width = 0;
  let storyTop = 0, clock = 0, last = 0, sceneInView = true;
  let lampTurn = 0;
  let glowLevel = state.brightness;
  const color = new THREE.Color();
  const projectedBounds = new THREE.Box3();
  const corner = new THREE.Vector3();
  const framingPoints = [];
  const worldInverse = new THREE.Matrix4();
  const objectToWorld = new THREE.Matrix4();
  const worldToCamera = new THREE.Matrix4();
  let framingVersion = -1, framedTurn = NaN, framedWidth = 0, framedHeight = 0;
  const framedPose = {};
  let shadowVersion = -1, shadowTurn = NaN, shadowScenery, nextShadowTime = 0;
  let sceneryVersion = -1, lastSceneryOpacity = NaN;
  const backdrop = document.querySelector('.stage-backdrop');
  const halo = document.querySelector('.evening-halo');
  const wordmark = document.querySelector('.wordmark');
  const progress = document.querySelector('.story-progress');
  const progressBar = progress.querySelector('i');
  const setStyle = (element, property, value) => {
    let values = animatedStyles.get(element);
    if (!values) { values = {}; animatedStyles.set(element, values); }
    if (values[property] === value) return;
    values[property] = value;
    element.style.setProperty(property, value);
  };
  const clamp = value => Math.max(0, Math.min(1, value));
  const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
  const mix = THREE.MathUtils.lerp;
  const ramp = (position, start, end) => smooth((position - start) / (end - start));
  const scrollProgress = (position, start, end) => clamp((position - start) / (end - start));
  const desktopPoses = [
    { cx: .52, cy: .61, w: .49, h: .66, zoom: 1, focus: .5, turn: -.4 },
    { cx: .77, cy: .59, w: .56, h: .72, zoom: 1.6, focus: .72, turn: -.04 },
    { cx: .70, cy: .53, w: .51, h: .74, zoom: 1, focus: .5, turn: .86 },
    { cx: .28, cy: .54, w: .50, h: .73, zoom: .96, focus: .5, turn: -2.8 },
  ];
  const mobilePoses = [
    { cx: .53, cy: .61, w: .9, h: .45, zoom: 1, focus: .5, turn: -.4 },
    { cx: .59, cy: .58, w: .94, h: .48, zoom: 2.1, focus: .77, turn: -.04 },
    { cx: .51, cy: .56, w: .94, h: .46, zoom: 1, focus: .5, turn: .86 },
    { cx: .50, cy: .50, w: .9, h: .40, zoom: .96, focus: .5, turn: -2.8 },
  ];
  [...desktopPoses, ...mobilePoses].forEach(pose => { pose.focusX = .5; });
  const detailRect = { x: 0, y: 0, width: 1, height: 1 };
  const detailCopy = document.querySelector('.anatomy .chapter-copy');
  const detailExplorer = document.querySelector('.detail-explorer');
  const poster = document.querySelector('.scene-poster');
  const poseKeys = Object.keys(desktopPoses[0]);
  const pose = {};
  // Fit the mounted assembly to an authored screen rectangle, then move the
  // view toward the reflector. Framing remains stable across aspect ratios.
  function frameCamera(pose) {
    if (framingVersion === geometryVersion && framedTurn === world.rotation.y
      && framedWidth === width && framedHeight === height
      && poseKeys.every(key => framedPose[key] === pose[key])) return;
    camera.updateWorldMatrix(true, false);
    // The assembly is rigid. Cache its mesh corners in world-local space only
    // when a model arrives, instead of walking every mesh on every scroll frame.
    if (framingVersion !== geometryVersion) {
      world.updateWorldMatrix(true, true);
      worldInverse.copy(world.matrixWorld).invert();
      framingPoints.length = 0;
      world.traverse(object => {
        if (!object.isMesh || object === glow || object.userData.fadeDepth) return;
        if (!object.geometry.boundingBox) object.geometry.computeBoundingBox();
        const { min, max } = object.geometry.boundingBox;
        objectToWorld.multiplyMatrices(worldInverse, object.matrixWorld);
        for (let i = 0; i < 8; i++) {
          framingPoints.push(new THREE.Vector3(i & 1 ? max.x : min.x, i & 2 ? max.y : min.y, i & 4 ? max.z : min.z).applyMatrix4(objectToWorld));
        }
      });
      framingVersion = geometryVersion;
    } else {
      world.updateWorldMatrix(true, false);
    }
    worldToCamera.multiplyMatrices(camera.matrixWorldInverse, world.matrixWorld);
    projectedBounds.makeEmpty();
    for (const point of framingPoints) projectedBounds.expandByPoint(corner.copy(point).applyMatrix4(worldToCamera));
    const boxWidth = projectedBounds.max.x - projectedBounds.min.x;
    const boxHeight = projectedBounds.max.y - projectedBounds.min.y;
    const aspect = width / height;
    const halfHeight = Math.max(boxHeight / pose.h, boxWidth / (pose.w * aspect)) / (2 * pose.zoom);
    const halfWidth = halfHeight * aspect;
    const centerX = projectedBounds.min.x + boxWidth * pose.focusX + (1 - pose.cx * 2) * halfWidth;
    const centerY = projectedBounds.min.y + boxHeight * pose.focus - (1 - pose.cy * 2) * halfHeight;
    camera.left = centerX - halfWidth; camera.right = centerX + halfWidth;
    camera.top = centerY + halfHeight; camera.bottom = centerY - halfHeight;
    camera.updateProjectionMatrix();
    framedTurn = world.rotation.y; framedWidth = width; framedHeight = height;
    Object.assign(framedPose, pose);
  }
  panels.forEach((panel, index) => {
    const marker = document.querySelectorAll('[data-stop]')[index];
    panel.removeAttribute('id'); marker.id = marker.dataset.stop;
  });
  document.body.classList.add('is-animated');
  document.querySelector('#render-status').textContent = translate('Preparing your light…');
  const measure = () => {
    mobile = innerWidth < 761;
    // A stable viewport prevents address-bar animation from moving the scroll
    // landmarks. Resize/orientation and language changes still remeasure them.
    const nextHeight = Math.round(stage.getBoundingClientRect().height);
    const nextWidth = Math.round(stage.getBoundingClientRect().width);
    storyTop = experience.getBoundingClientRect().top + scrollY - 42;
    if (width !== nextWidth || height !== nextHeight) {
      width = nextWidth; height = nextHeight;
      renderer.setSize(width, height, false);
    }
    detailRect.x = 0;
    detailRect.y = detailCopy.offsetTop + detailCopy.offsetHeight + 20;
    detailRect.width = width;
    detailRect.height = Math.max(80, detailExplorer.offsetTop - detailRect.y - 20);
    requestRender();
  };
  let measureFrame = 0;
  window.addEventListener('resize', () => {
    if (!measureFrame) measureFrame = requestAnimationFrame(() => { measureFrame = 0; measure(); });
  }, { passive: true });
  const resizeObserver = new ResizeObserver(measure);
  [stage, detailCopy, detailExplorer].forEach(element => resizeObserver.observe(element));
  document.fonts.ready.then(measure);
  window.addEventListener('showcase-language', () => requestAnimationFrame(measure));
  measure();

  function draw(now) {
    renderFrame = 0;
    if (contextLost) return;
    if (document.hidden || !sceneInView) { last = 0; return; }
    // Idle time is not animation time: a new gesture starts with one normal
    // frame instead of jumping 50 ms into its first interpolated movement.
    const dt = last ? Math.min((now - last) / 1000, .05) : 1 / 60; last = now;
    if (!state.paused) clock += dt;
    const revealing = scenePrepared && sceneElement.dataset.lamp === 'ready' && !sceneElement.classList.contains('is-ready');
    const damping = revealing || motionQuery.matches ? 1 : 1 - Math.exp(-dt * 10);
    const position = Math.max(0, (scrollY - storyTop) / height);
    const chapter = position < 1.05 ? 0 : position < 2.75 ? 1 : position < 4.4 ? 2 : 3;
    const reduced = motionQuery.matches;
    const approach = reduced ? Number(chapter > 0) : ramp(position, .2, 1.45);
    const inspect = reduced ? Number(chapter > 1) : ramp(position, 2.15, 3.1);
    const play = reduced ? Number(chapter > 2) : ramp(position, 3.85, 4.7);
    const darkness = approach * (1 - .16 * inspect);
    // Scope changing styles to their consumers, so inherited custom properties
    // do not invalidate every chapter and control while the page scrolls.
    setStyle(backdrop, '--dark', darkness.toFixed(4));
    const heroOut = ramp(position, .15, .7).toFixed(4);
    setStyle(wordmark, 'opacity', heroOut);
    setStyle(progress, 'opacity', heroOut);
    setStyle(progressBar, 'transform', `scaleX(${clamp(position / 5.2).toFixed(4)})`);
    const opacity = reduced ? panels.map((_, i) => Number(i === chapter)) : [
      1 - ramp(position, .12, .75),
      ramp(position, .9, 1.35) * (1 - ramp(position, 2, 2.45)),
      ramp(position, 2.65, 3.1) * (1 - ramp(position, 3.85, 4.25)),
      ramp(position, 4.35, 4.7),
    ];
    panels.forEach((panel, i) => {
      const visible = opacity[i] > .001;
      setStyle(panel, 'opacity', opacity[i].toFixed(4));
      setStyle(panel, 'visibility', visible ? 'visible' : 'hidden');
      setStyle(panel, 'transform', reduced ? 'none' : `translateY(${((1 - opacity[i]) * (i < chapter ? -24 : 24)).toFixed(3)}px)`);
      // Inactive scenes cannot receive keyboard focus or duplicate screen-reader copy.
      const inactive = opacity[i] < .5;
      if (panel.inert !== inactive) panel.inert = inactive;
      if (panel.getAttribute('aria-hidden') !== String(inactive)) panel.setAttribute('aria-hidden', String(inactive));
    });
    // Finger travel should move the mobile lamp immediately. Keep the softer
    // text/lighting fades above, but map its camera poses directly to scrolling.
    const directMotion = (mobileQuality || mobile) && !reduced;
    const approachMotion = directMotion ? scrollProgress(position, .2, 1.45) : approach;
    const inspectMotion = directMotion ? scrollProgress(position, 2.15, 3.1) : inspect;
    const playMotion = directMotion ? scrollProgress(position, 3.85, 4.7) : play;
    const poses = mobile ? mobilePoses : desktopPoses;
    const detailPose = mobile ? {
      ...poses[2],
      cx: (detailRect.x + detailRect.width / 2) / width,
      cy: (detailRect.y + detailRect.height / 2) / height,
      w: detailRect.width / width, h: detailRect.height / height,
    } : poses[2];
    for (const key of poseKeys) {
      // Keep the full assembly between the mobile heading and descriptions.
      pose[key] = mix(mix(mix(poses[0][key], poses[1][key], approachMotion), detailPose[key], inspectMotion), poses[3][key], playMotion);
    }
    if (mobile && height < 700) {
      pose.h *= 1 - .1 * play;
      pose.cy -= .02 * inspect * (1 - play);
    }
    const animateAmbient = !state.paused && !mobileQuality && !mobile;
    const movement = animateAmbient ? Math.sin(clock * .45) * .012 : 0;
    const pointerRotation = animateAmbient ? state.pointerX * .09 : 0;
    const targetTurn = state.rotation * playMotion + pointerRotation + movement;
    lampTurn = mix(lampTurn, targetTurn, damping);
    if (Math.abs(lampTurn - targetTurn) < .001) lampTurn = targetTurn;
    world.rotation.y = pose.turn + lampTurn;
    frameCamera(pose);
    if (!sceneElement.classList.contains('is-ready')) {
      setStyle(poster, 'left', `${(pose.cx - pose.w / 2) * 100}%`);
      setStyle(poster, 'top', `${(pose.cy - pose.h / 2) * 100}%`);
      setStyle(poster, 'width', `${pose.w * 100}%`);
      setStyle(poster, 'height', `${pose.h * 100}%`);
    }
    const sceneryOpacity = 1 - approach * (1 - inspect);
    if (sceneryVersion !== geometryVersion || lastSceneryOpacity !== sceneryOpacity) {
      scenery.traverse(object => {
        if (!object.isMesh || object === glow) return;
        if (object.userData.fadeDepth) { object.visible = sceneryOpacity < 1; return; }
        object.visible = sceneryOpacity > .005;
        object.castShadow = sceneryOpacity > .5;
        for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
          if (!material.transparent) { material.transparent = true; material.needsUpdate = true; }
          material.opacity = sceneryOpacity;
          // Keep solid surfaces occluded throughout the fade. Turning depth writes
          // off mid-transition exposes the notebook's interior and the desk behind it.
          material.depthWrite = true;
        }
      });
      sceneryVersion = geometryVersion; lastSceneryOpacity = sceneryOpacity;
    }
    color.set(finishes[state.finish].color);
    for (const uniform of lampMaterials) uniform.value.lerp(color, damping);
    const intensity = state.on ? state.brightness : 0;
    glowLevel = mix(glowLevel, intensity, damping);
    if (Math.abs(glowLevel - intensity) < .001) glowLevel = intensity;
    if (lampEmitter) lampEmitter.emissiveIntensity = glowLevel * 4;
    bulb.intensity = glowLevel * 45;
    glow.material.opacity = glowLevel * .4 * sceneryOpacity;
    setStyle(halo, 'opacity', (glowLevel * (.15 + .85 * play)).toFixed(4));
    key.intensity = mix(mix(2.2, 1.8, approach), .65, play);
    fill.intensity = mix(mix(.4, .22, approach), .16, play);
    rim.intensity = mix(1.4, .65, play);
    scene.environmentIntensity = mix(1, .45, play);
    const settling = lampTurn !== targetTurn
      || lampMaterials.some(uniform => Math.abs(uniform.value.r - color.r) + Math.abs(uniform.value.g - color.g) + Math.abs(uniform.value.b - color.b) > .001)
      || glowLevel !== intensity;
    // Camera, paint and brightness changes can reuse the shadow map. During
    // rotation, update mobile shadows at most 30 times/s and settle the last pose.
    const shadowGeometryChanged = shadowVersion !== geometryVersion || shadowScenery !== (sceneryOpacity > .5);
    let shadowPending = mobileQuality && (shadowGeometryChanged || shadowTurn !== world.rotation.y);
    const shadowInterval = 1000 / 30;
    if (shadowPending && (shadowGeometryChanged || now + .5 >= nextShadowTime)) {
      renderer.shadowMap.needsUpdate = true;
      shadowVersion = geometryVersion; shadowScenery = sceneryOpacity > .5;
      shadowTurn = world.rotation.y;
      // Preserve the deadline's phase: resetting to each frame's rounded time
      // can turn a nominal 30 Hz schedule into uneven 20 Hz shadow updates.
      nextShadowTime = shadowGeometryChanged || now - nextShadowTime > shadowInterval
        ? now + shadowInterval : nextShadowTime + shadowInterval;
      shadowPending = false;
    }
    if (!scenePrepared) { last = 0; return; }
    renderer.render(scene, camera);
    if (revealing) {
      sceneElement.classList.add('is-ready'); sceneElement.removeAttribute('aria-busy');
      document.querySelector('#render-status').textContent = '';
    }
    if (sceneElement.dataset.chapter !== String(chapter)) sceneElement.dataset.chapter = String(chapter);
    if (animateAmbient || settling || shadowPending || (!state.paused && now < scrollActiveUntil)) requestRender();
    else last = 0;
  }
  requestRender = () => {
    if (!renderFrame && !contextLost && !document.hidden && sceneInView) renderFrame = requestAnimationFrame(draw);
  };
  new IntersectionObserver(([entry]) => {
    sceneInView = entry.isIntersecting;
    if (!sceneInView) last = 0;
    if (sceneInView) requestRender();
  }).observe(document.querySelector('.experience'));
  // Compile hidden fade/depth materials too. Otherwise the notebook's first
  // transparent frame asks the GPU to build a new program during the gesture.
  // The poster remains visible until assets and programs are ready.
  Promise.all([...surfaceLoads, lampLoaded, notebookLoaded]).then(async () => {
    if (contextLost || document.body.classList.contains('is-static')) return;
    scenery.traverse(object => {
      if (!object.isMesh || object === glow || object.userData.fadeDepth) return;
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        if (!material.transparent) { material.transparent = true; material.needsUpdate = true; }
      }
    });
    await renderer.compileAsync(scene, camera);
    if (contextLost) return;
    scenePrepared = true;
    requestRender();
  }).catch(error => {
    console.warn('Lento scene preparation unavailable:', error);
    fallback();
  });
  requestRender();
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); contextLost = true; fallback('The 3D preview paused. Reload to try again.'); });
  document.addEventListener('visibilitychange', () => { last = 0; requestRender(); });
  window.addEventListener('pagehide', () => { if (renderFrame) cancelAnimationFrame(renderFrame); renderFrame = 0; last = 0; });
  window.addEventListener('pageshow', event => { if (event.persisted && !contextLost) { last = 0; requestRender(); } });
}

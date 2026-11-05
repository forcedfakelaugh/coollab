(() => {
  'use strict';

  const studies = [
    {
      slug: 'monsoon', name: 'Monsoon', category: 'Atmosphere & place',
      width: 2000, height: 1335,
      image: 'assets/monsoon-rain.webp', alt: 'Raindrops splash into a Hanoi street, catching amber and white light after dark.',
      description: 'Rain breaks the surface of a Hanoi street. Amber light gathers in the water.',
      discipline: ['Photography selection', 'Visual study'], focus: ['Atmosphere', 'Rain & reflected light', 'A sense of place'],
      intro: 'The city slows down. The rain takes over.',
      paragraphs: ['A close view of rain on a Hanoi street. Drops, ripples and blurred streetlights turn an ordinary evening into a study of light on water.', 'A photograph selected for its atmosphere, colour and sense of place.'],
      credit: 'Photography by Hieu Do Quang / Unsplash.',
    },
    {
      slug: 'strata', name: 'Strata', category: 'Architecture & space',
      width: 2000, height: 1333,
      image: 'assets/strata-courtyard.webp', alt: 'A textured stone wall, glass doors and a slender tree reflected in a courtyard pool in Cam Ranh.',
      description: 'Layers of stone, glass and water in a quiet Cam Ranh courtyard.',
      discipline: ['Photography selection', 'Visual study'], focus: ['Architectural layers', 'Surface & texture', 'Changing perspective'],
      intro: 'Every space has another story inside it.',
      paragraphs: ['A rough stone wall sits above a row of glass doors. In front, a slender tree and the surrounding architecture meet their reflections in a shallow pool in Cam Ranh, Vietnam.', 'A photographic reference selected for its colour, composition and sense of place. The photographed architecture is not a project by Lucas Nguyen.'],
      credit: 'Photography by I P / Unsplash.',
    },
    {
      slug: 'lacquer', name: 'Lacquer', category: 'Material & craft',
      width: 1672, height: 941,
      image: 'assets/lacquer.webp', alt: 'A deep crimson lacquer box with a fine gold inlay and a partially raised lid against black.',
      description: 'Crimson, gold, and a little darkness. An intimate encounter with a crafted object.',
      discipline: ['Art direction', 'Digital exhibition'], focus: ['Surface & texture', 'Controlled light', 'The detail of an object'],
      intro: 'A surface that rewards a closer look.',
      paragraphs: ['An original lacquer object, rendered in deep crimson and traced with gold. Grazing light reveals variations in the surface, while the lifted lid offers a glimpse of the wood beneath.', 'The proposed digital exhibition moves between the complete object and its smallest details. Visitors would guide the light to uncover parts of the surface that disappear into shadow.'],
    },
    {
      slug: 'resonance', name: 'Resonance', category: 'Light & motion',
      width: 1672, height: 941,
      image: 'assets/resonance.webp', alt: 'Hundreds of slender white light rods form rolling waves in a dark reflective gallery.',
      description: 'One gesture, a thousand small movements. A room imagined as a wave of light.',
      discipline: ['Interaction design', 'Creative development'], focus: ['Wave & rhythm', 'Light as material', 'Playful participation'],
      intro: 'A small movement can fill a whole room.',
      paragraphs: ['A field of luminous rods becomes a landscape of peaks and troughs. Repetition gives the installation its structure; changing heights give it a sense of movement.', 'The proposed experience turns touch into waves that travel through the room, with optional sound responding to each gesture. This visual is a starting point for an interactive installation.'],
    },
    {
      slug: 'canopy', name: 'Canopy', category: 'Landscape & water',
      width: 2000, height: 1332,
      image: 'assets/canopy.webp', alt: 'A river threads through dense green jungle seen from above in Ubud, Bali.',
      description: 'A river disappears beneath the deep green canopy of Ubud, Bali.',
      discipline: ['Photography selection', 'Visual study'], focus: ['Light & shadow', 'A sense of place'],
      intro: 'A quiet clearing in a sea of green.',
      paragraphs: ['Seen from above, the jungle becomes a field of overlapping leaves. A narrow river runs through the shadows between the trees in Ubud, Bali.', 'A photograph selected for its atmosphere, colour and sense of place.'],
      credit: 'Photography by Geio Tischler / Unsplash.',
    },
    {
      slug: 'after-hours', name: 'After Hours', category: 'City & light',
      width: 2000, height: 1333,
      image: 'assets/after-hours.webp', alt: 'Illuminated signs and evening crowds line the Dōtonbori canal in Osaka.',
      description: 'Bright signs, evening crowds and a ribbon of water in Dōtonbori, Osaka.',
      discipline: ['Photography selection', 'Visual study'], focus: ['Light & shadow', 'A sense of place'],
      intro: 'The city puts on its evening colours.',
      paragraphs: ['Looking along the Dōtonbori canal after dark. Illuminated signs rise above the crowds, while their reflections stretch across the water below.', 'A photograph selected for its atmosphere, colour and sense of place.'],
      credit: 'Photography by Tobias Reich / Unsplash.',
    },
    {
      slug: 'colonnade', name: 'Colonnade', category: 'Space & repetition',
      width: 2000, height: 1333,
      image: 'assets/colonnade.webp', alt: 'Sunlit stone columns and repeating arches frame a walkway at Stanford University.',
      description: 'Warm stone, repeating arches and long shadows at Stanford University.',
      discipline: ['Photography selection', 'Visual study'], focus: ['Light & shadow', 'A sense of place'],
      intro: 'A rhythm you can walk through.',
      paragraphs: ['A low viewpoint draws the eye through the colonnade at Stanford University. Sunlight picks out the warm stone and the rhythm of each arch.', 'A photographic reference selected for its colour, composition and sense of place. The photographed architecture is not a project by Lucas Nguyen.'],
      credit: 'Photography by Jason Leung / Unsplash.',
    },
    {
      slug: 'still-water', name: 'Still Water', category: 'Architecture & reflection',
      width: 1800, height: 1200,
      image: '../hien/assets/clay-pavilion.jpg', alt: 'Traditional lakeside architecture in Huế meets its reflection in the water.',
      description: 'Traditional lakeside architecture in Huế meets its reflection in the water.',
      discipline: ['Photography selection', 'Visual study'], focus: ['Light & shadow', 'A sense of place'],
      intro: 'One building, two perspectives.',
      paragraphs: ['Traditional lakeside architecture in Huế meets its reflection in the water.', 'A photographic reference selected for its colour, composition and sense of place. The photographed architecture is not a project by Lucas Nguyen.'],
      credit: 'Photography by Dương Nhân / Pexels.',
    },
    {
      slug: 'ochre', name: 'Ochre', category: 'Colour & history',
      width: 1800, height: 1350,
      image: '../hien/assets/white-gallery.jpg', alt: 'The warm courtyard facade of the Ho Chi Minh City Museum of Fine Arts.',
      description: 'The warm courtyard facade of the Ho Chi Minh City Museum of Fine Arts.',
      discipline: ['Photography selection', 'Visual study'], focus: ['Light & shadow', 'A sense of place'],
      intro: 'Colour holds the memory of a place.',
      paragraphs: ['The warm courtyard facade of the Ho Chi Minh City Museum of Fine Arts.', 'A photographic reference selected for its colour, composition and sense of place. The photographed architecture is not a project by Lucas Nguyen.'],
      credit: 'Photography by Phát Trương / Pexels.',
    },
    {
      slug: 'threshold', name: 'Threshold', category: 'Interior & daylight',
      width: 1800, height: 1270,
      image: '../hien/assets/tree-house-interior.jpg', alt: 'Slatted timber and a reception opening filter the daylight in Đà Lạt.',
      description: 'Slatted timber and a reception opening filter the daylight in Đà Lạt.',
      discipline: ['Photography selection', 'Visual study'], focus: ['Light & shadow', 'A sense of place'],
      intro: 'Light finds its way inside.',
      paragraphs: ['Slatted timber and a reception opening filter the daylight in Đà Lạt.', 'A photographic reference selected for its colour, composition and sense of place. The photographed architecture is not a project by Lucas Nguyen.'],
      credit: 'Photography by Kien Tran / Pexels.',
    },
    {
      slug: 'mai-le', name: 'Mai Lê', category: 'Painting & light',
      width: 1536, height: 1024,
      image: '../mai-le/assets/seascape.jpg', alt: 'A painterly seascape with blue waves, golden sunset light and a three-masted sailing ship.',
      description: 'Where the light goes. A seascape from the Mai Lê collection.',
      discipline: ['Art direction', 'Digital exhibition'], focus: ['Colour & texture', 'Evening light', 'Painted movement'],
      intro: 'Where the light goes.',
      paragraphs: ['Blue and teal waves break beneath a golden sky. A small sailing ship sits near the horizon, surrounded by broad, textured marks of colour.', 'An artwork from the fictional Mai Lê artist portfolio, reused here as a study of colour and light.'],
      credit: 'From the Mai Lê concept. AI-generated artwork.', imageKind: 'Painting study',
    },
    {
      slug: 'la', name: 'LÁ', category: 'Identity & packaging',
      width: 1536, height: 1024,
      image: '../elseform/assets/la-tea.webp', alt: 'Three lime-green LÁ sparkling tea cans on a cobalt-blue background.',
      description: 'Lime green meets cobalt blue. Sparkling tea from the Elseform collection.',
      discipline: ['Art direction', 'Brand identity'], focus: ['Colour contrast', 'Typography', 'Packaging'],
      intro: 'A bright pause in the everyday.',
      paragraphs: ['Three lime-green cans, a cobalt-blue stage and a single leaf. Oversized lettering and hard shadows give the LÁ sparkling tea concept its character.', 'A fictional packaging concept from Elseform, reused here as a study of identity, colour and composition.'],
      credit: 'From the Elseform concept. AI-generated packaging imagery.', imageKind: 'Packaging concept',
    },
  ];

  const $ = (selector) => document.querySelector(selector);
  const mod = (value, length = studies.length) => ((value % length) + length) % length;
  const number = (value) => String(value + 1).padStart(2, '0');
  const total = String(studies.length).padStart(2, '0');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mediaStage = $('#media-stage');
  const rail = $('#project-rail');
  const gallery = $('#gallery-control');
  let position = 0;
  let target = 0;
  let active = -1;
  let width = gallery.clientWidth;
  let height = gallery.clientHeight;
  let mobile = width <= 760;
  let frame = 0;
  let lastTime = 0;
  let snapTimer;
  let announceTimer;
  let pointerX = 0;
  let pointerY = 0;
  let pointerSmoothX = 0;
  let pointerSmoothY = 0;
  let touchStart = null;
  let touchMoved = false;
  let suppressClickUntil = 0;
  let soundOn = false;
  let audioContext;
  let lastSound = 0;
  let contactReturn = '#work';
  let studyReturn = '#work';

  const galleryImageSizes = '(max-width: 760px) min(60vw, 28svh), (max-height: 540px) 25vw, (max-width: 1100px) 32vw, clamp(310px, 29vw, 620px)';
  function setStudyImage(image, study, sizes) {
    image.decoding = 'async';
    image.width = study.width;
    image.height = study.height;
    image.alt = study.alt;
    // Set sizes/srcset before src so small screens never request the fallback original.
    image.sizes = sizes;
    image.srcset = `assets/responsive/${study.slug}-480.webp 480w, assets/responsive/${study.slug}-960.webp 960w, ${study.image} ${study.width}w`;
    image.src = study.image;
  }

  // Warm the whole gallery at its display resolution so fast swipes stay ready.
  studies.forEach((study, index) => {
    const image = new Image();
    image.fetchPriority = index === 0 ? 'high' : 'low';
    setStudyImage(image, study, galleryImageSizes);
  });

  const experiments = [
    { slug: 'ripple', name: 'Ripple field', category: '01 / Touch & repetition', description: 'A field of circles, pulled out of balance. Move your pointer or touch the surface to shift the center of the ripple.' },
    { slug: 'orbit', name: 'Orbital paths', category: '02 / Form & repetition', description: 'A single curve, repeated. Move across the canvas to change its perspective; use intensity to loosen or tighten the form.' },
    { slug: 'weave', name: 'Soft grid', category: '03 / Order & distortion', description: 'Straight lines learn to bend. Move through the grid and change its tension with the intensity control.' },
    { slug: 'wave', name: 'Light field', category: '04 / Motion & rhythm', description: 'A small landscape of light. Move the wave through the field, pause a particular arrangement, or turn up its intensity.' },
  ];

  document.querySelectorAll('.sheet-top').forEach((header) => {
    const nav = document.createElement('nav');
    nav.className = 'sheet-nav';
    nav.setAttribute('aria-label', 'Page navigation');
    ['work', 'about', 'playground', 'contact'].forEach((name) => {
      const button = document.createElement('button');
      button.dataset.panel = name;
      button.textContent = name[0].toUpperCase() + name.slice(1);
      nav.append(button);
    });
    header.insertBefore(nav, header.querySelector('.close-button'));
  });

  studies.forEach((study, index) => {
    const imageItem = document.createElement('button');
    imageItem.className = 'play-item';
    imageItem.innerHTML = window.portfolioIcons.html(`<span class="play-visual"><img loading="lazy"></span><span class="play-caption"><span>${study.name}</span><span>Image study →</span></span>`);
    setStudyImage(imageItem.querySelector('img'), study, '(max-width: 760px) calc(50vw - 27px), (max-width: 1100px) calc((74vw - 70px) / 3), calc((74vw - 90px) / 4)');
    imageItem.addEventListener('click', () => navigate(`#study/${study.slug}`));
    $('#playground-grid').append(imageItem);
    const experiment = experiments[index];
    if (!experiment) return;
    const labItem = document.createElement('button');
    labItem.className = 'play-item';
    labItem.innerHTML = window.portfolioIcons.html(`<span class="play-visual"><canvas data-experiment="${experiment.slug}" aria-label="${experiment.name} preview"></canvas></span><span class="play-caption"><span>${experiment.name}</span><span>Play →</span></span>`);
    labItem.addEventListener('click', () => navigate(`#experiment/${experiment.slug}`));
    $('#playground-grid').append(labItem);
  });
  $('.counter-total').textContent = `/${total}`;
  $('.playground-count').textContent = String(studies.length + experiments.length).padStart(2, '0');
  window.StudiesLab.init();

  const cards = Array.from({ length: 9 }, (_, slot) => {
    const button = document.createElement('button');
    button.className = 'media-card';
    button.innerHTML = window.portfolioIcons.html('<img draggable="false" decoding="async" width="1672" height="941"><span class="card-label"><span></span><span aria-hidden="true">→</span></span>');
    button.tabIndex = -1;
    const record = { button, image: button.querySelector('img'), label: button.querySelector('.card-label > span'), logical: null, index: null, slot };
    button.addEventListener('click', () => {
      if (performance.now() < suppressClickUntil) return;
      if (Math.abs(record.logical - position) < .48) navigate(`#study/${studies[record.index].slug}`);
      else goTo(record.logical);
    });
    mediaStage.append(button);
    return record;
  });

  const labels = Array.from({ length: 5 }, (_, slot) => {
    const button = document.createElement('button');
    button.className = 'project-label';
    button.innerHTML = window.portfolioIcons.html('<span class="project-category"></span><h2></h2><span class="project-description"></span>');
    button.tabIndex = -1;
    const record = { button, category: button.querySelector('.project-category'), title: button.querySelector('h2'), description: button.querySelector('.project-description'), logical: null, index: null, slot };
    button.addEventListener('click', () => {
      if (performance.now() < suppressClickUntil) return;
      if (record.logical === Math.round(position)) navigate(`#study/${studies[record.index].slug}`);
      else goTo(record.logical);
    });
    rail.append(button);
    return record;
  });

  studies.forEach((study, index) => {
    const item = document.createElement('button');
    item.className = 'index-item';
    const img = document.createElement('img');
    img.loading = 'lazy';
    setStudyImage(img, study, '(max-width: 760px) calc(50vw - 27px), calc(22vw - 16.5px)');
    item.append(img);
    const meta = document.createElement('div');
    meta.innerHTML = window.portfolioIcons.html(`<span>${number(index)} / ${total}</span><span aria-hidden="true">→</span>`);
    item.append(meta);
    const title = document.createElement('h3');
    title.textContent = study.name;
    item.append(title);
    const category = document.createElement('p');
    category.className = 'small muted';
    category.textContent = study.category;
    item.append(category);
    item.addEventListener('click', () => navigate(`#study/${study.slug}`));
    $('#index-grid').append(item);
  });

  function updateText(element, lines) {
    element.replaceChildren();
    lines.forEach((line, index) => {
      if (index) element.append(document.createElement('br'));
      element.append(document.createTextNode(line));
    });
  }

  function updateActive(index) {
    if (index === active) return;
    active = index;
    const study = studies[index];
    document.body.dataset.study = study.slug;
    $('#counter-number').textContent = number(index);
    updateText($('#meta-discipline'), study.discipline);
    updateText($('#meta-focus'), study.focus);
    $('#open-study').setAttribute('aria-label', `View ${study.name} study`);
    clearTimeout(announceTimer);
    announceTimer = setTimeout(() => { $('#announcement').textContent = `Study ${index + 1} of ${studies.length}: ${study.name}. ${study.category}.`; }, 180);
    if (soundOn) playSound(index);
  }

  function paint() {
    const center = Math.round(position);
    const centerX = width * (mobile ? .5 : .52);
    const centerY = height * (mobile ? .52 : .5);
    const maxY = height * (mobile ? .65 : .69);
    const motion = mobile && !reduced.matches ? Math.min(1, Math.max(Math.abs(target - position) * 2, Math.abs(position - center) * 2)) : 0;
    gallery.style.setProperty('--mobile-motion-blur', `${motion * 7}px`);
    updateActive(mod(center));

    cards.forEach((record, slot) => {
      const logical = center + slot - 4;
      const index = mod(logical);
      const delta = logical - position;
      const distance = Math.abs(delta);
      const direction = Math.sign(delta);
      const isActive = logical === center;
      const visible = !mobile || distance <= 2.5;
      record.logical = logical;
      record.button.style.visibility = visible ? 'visible' : 'hidden';
      record.button.classList.toggle('is-active', isActive);
      record.button.tabIndex = isActive ? 0 : -1;
      record.button.setAttribute('aria-hidden', String(!isActive));
      // The collection is preloaded; only update the visible mobile slots.
      if (!visible) return;
      record.image.fetchPriority = isActive ? 'high' : 'low';
      if (record.index !== index) {
        setStudyImage(record.image, studies[index], galleryImageSizes);
        record.button.setAttribute('aria-label', `View ${studies[index].name} study`);
        record.label.textContent = `Explore ${studies[index].name}`;
        record.index = index;
      }
      const x = mobile
        ? centerX - width * .42 * Math.tanh(delta * 1.5)
        : centerX - direction * width * .135 * Math.pow(distance, .72);
      const y = centerY + direction * maxY * (1 - Math.exp(-distance * 1.65));
      const z = -distance * (mobile ? 45 : 65);
      const tiltX = reduced.matches ? 0 : -direction * Math.min(distance * 12, 26) + pointerSmoothY * Math.max(0, 1 - distance) * 2;
      const tiltY = reduced.matches ? 0 : -direction * Math.min(distance * 17, 32) + pointerSmoothX * Math.max(0, 1 - distance) * 3;
      const tiltZ = reduced.matches ? 0 : direction * Math.min(distance * 6, 15) + .8;
      const scale = Math.max(.7, 1 - distance * .04);
      record.button.style.transform = `translate3d(${x}px,${y}px,${z}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${tiltZ}deg) scale(${scale})`;
      record.button.style.zIndex = String(20 - Math.round(distance * 3));
      record.button.style.opacity = '1';
    });

    labels.forEach((record, slot) => {
      const logical = center + slot - 2;
      const index = mod(logical);
      const delta = logical - position;
      const distance = Math.abs(delta);
      const isActive = logical === center;
      if (record.index !== index) {
        record.category.textContent = studies[index].category;
        record.title.textContent = studies[index].name;
        record.description.textContent = studies[index].description;
        record.index = index;
      }
      record.logical = logical;
      record.button.classList.toggle('is-active', isActive);
      record.button.tabIndex = isActive ? 0 : -1;
      record.button.setAttribute('aria-hidden', String(!isActive));
      record.button.setAttribute('aria-label', `${isActive ? 'View' : 'Select'} ${studies[index].name}`);
      record.button.style.transform = mobile ? 'none' : `translateY(calc(-50% + ${delta * Math.max(170, height * .245)}px))`;
      record.button.style.opacity = mobile ? '1' : String(Math.max(.12, 1 - Math.min(distance, 1) * .8 - Math.max(0, distance - 1) * .06));
      record.button.style.visibility = mobile && !isActive ? 'hidden' : 'visible';
      record.button.style.pointerEvents = mobile && !isActive ? 'none' : 'auto';
    });
  }

  function tick(time) {
    frame = 0;
    const elapsed = Math.min(50, time - (lastTime || time - 16));
    lastTime = time;
    const smoothing = mobile ? (touchStart ? 45 : 135) : 65;
    const ease = reduced.matches ? 1 : 1 - Math.exp(-elapsed / smoothing);
    position += (target - position) * ease;
    pointerSmoothX += (pointerX - pointerSmoothX) * ease;
    pointerSmoothY += (pointerY - pointerSmoothY) * ease;
    if (Math.abs(target - position) < .0001) position = target;
    paint();
    if (Math.abs(target - position) > .0001 || Math.abs(pointerX - pointerSmoothX) > .005 || Math.abs(pointerY - pointerSmoothY) > .005) wake();
  }

  function wake() { if (!frame) frame = requestAnimationFrame(tick); }
  function goTo(value, immediate = false) {
    clearTimeout(snapTimer);
    target = value;
    if (immediate || reduced.matches) position = target;
    wake();
  }
  function snap() { clearTimeout(snapTimer); snapTimer = setTimeout(() => goTo(Math.round(target)), 90); }
  function modalOpen() { return !!document.querySelector('dialog[open]'); }
  function touchStep() { return Math.max(130, height * .26); }

  window.addEventListener('wheel', (event) => {
    if (modalOpen() || event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    event.preventDefault();
    const pixels = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? height : 1);
    target += Math.max(-1.25, Math.min(1.25, pixels / (mobile ? touchStep() : Math.max(560, height * .8))));
    wake();
    snap();
  }, { passive: false });

  gallery.addEventListener('touchstart', (event) => {
    if (event.touches.length !== 1) { finishTouch(true); return; }
    clearTimeout(snapTimer);
    touchMoved = false;
    // Catch the image where it is, including when a new swipe interrupts settling.
    target = position;
    touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY, position, lastY: event.touches[0].clientY, lastTime: performance.now(), velocity: 0 };
  }, { passive: true });
  gallery.addEventListener('touchmove', (event) => {
    if (!touchStart || event.touches.length !== 1) return;
    const changeY = touchStart.y - event.touches[0].clientY;
    const changeX = touchStart.x - event.touches[0].clientX;
    if (Math.abs(changeY) < 5 || Math.abs(changeX) > Math.abs(changeY)) return;
    event.preventDefault();
    touchMoved = true;
    const now = performance.now();
    const elapsed = Math.max(8, now - touchStart.lastTime);
    const velocity = (touchStart.lastY - event.touches[0].clientY) / elapsed;
    touchStart.velocity = touchStart.velocity * .3 + velocity * .7;
    touchStart.lastY = event.touches[0].clientY;
    touchStart.lastTime = now;
    target = touchStart.position + changeY / touchStep();
    wake();
  }, { passive: false });
  function finishTouch(cancelled = false) {
    if (touchMoved) suppressClickUntil = performance.now() + 500;
    if (!touchStart) return;
    // A short flick can advance a photo; a held drag settles to the nearest one.
    const velocity = !cancelled && touchMoved && performance.now() - touchStart.lastTime < 100 ? touchStart.velocity : 0;
    const coast = Math.max(-.6, Math.min(.6, velocity * 120 / touchStep()));
    touchStart = null;
    goTo(Math.round(target + coast));
  }
  gallery.addEventListener('touchend', () => finishTouch(), { passive: true });
  gallery.addEventListener('touchcancel', () => finishTouch(true), { passive: true });

  window.addEventListener('keydown', (event) => {
    if (modalOpen() || event.metaKey || event.ctrlKey || event.altKey || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
    if (['ArrowDown', 'ArrowRight', 'PageDown'].includes(event.key)) { event.preventDefault(); goTo(Math.round(target) + 1); }
    else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); goTo(Math.round(target) - 1); }
    else if (event.key === 'Home') { event.preventDefault(); goTo(Math.round(target) - mod(Math.round(target))); }
    else if (event.key === 'End') { event.preventDefault(); goTo(Math.round(target) - mod(Math.round(target)) + studies.length - 1); }
    else if ((event.key === 'Enter' || event.key === ' ') && (event.target === gallery || event.target === document.body)) { event.preventDefault(); navigate(`#study/${studies[active].slug}`); }
  });
  window.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' || mobile || reduced.matches || modalOpen()) return;
    pointerX = (event.clientX / width - .5) * 2;
    pointerY = (event.clientY / height - .5) * 2;
    wake();
  }, { passive: true });
  window.addEventListener('blur', () => { pointerX = pointerY = 0; wake(); });
  window.addEventListener('resize', () => {
    width = gallery.clientWidth;
    height = gallery.clientHeight;
    mobile = width <= 760;
    if (!mobile && $('#mobile-menu-dialog').open) $('#mobile-menu-dialog').close();
    wake();
  });
  reduced.addEventListener('change', () => { pointerX = pointerY = 0; goTo(Math.round(target), true); });
  $('#previous').addEventListener('click', () => goTo(Math.round(target) - 1));
  $('#next').addEventListener('click', () => goTo(Math.round(target) + 1));
  $('#open-study').addEventListener('click', () => navigate(`#study/${studies[active].slug}`));

  function navigate(hash) {
    if (hash === '#contact' && location.hash !== '#contact') contactReturn = location.hash || '#work';
    if (hash.startsWith('#study/') && !location.hash.startsWith('#study/')) studyReturn = location.hash || '#work';
    if (location.hash !== hash) history.pushState(null, '', hash);
    renderRoute();
  }
  function closeSheet() {
    const route = location.hash;
    const destination = route === '#contact' ? contactReturn : route.startsWith('#experiment/') ? '#playground' : route === '#approach' ? '#about' : route.startsWith('#study/') ? studyReturn : '#work';
    history.replaceState(null, '', destination);
    renderRoute();
  }
  // Keep the shared return/language bar reachable in the dialog top layer.
  const portfolioNav = $('.portfolio-nav');
  function syncPortfolioNav() {
    const host = [...document.querySelectorAll('dialog[open]')].at(-1) || document.body;
    if (portfolioNav.parentElement !== host) host.prepend(portfolioNav);
  }
  document.querySelectorAll('dialog').forEach((dialog) => dialog.addEventListener('close', syncPortfolioNav));
  $('#mobile-menu-toggle').addEventListener('click', () => {
    finishTouch(true);
    $('#mobile-menu-dialog').showModal();
    $('#mobile-menu-toggle').setAttribute('aria-expanded', 'true');
    syncPortfolioNav();
  });
  $('#mobile-menu-dialog').addEventListener('close', () => $('#mobile-menu-toggle').setAttribute('aria-expanded', 'false'));
  function renderRoute() {
    const route = location.hash.slice(1);
    let desired = null;
    if (route === 'contact') {
      const contact = $('#contact-dialog');
      if (!contact.open) contact.showModal();
      syncPortfolioNav();
      document.title = 'Contact - Parallax';
      window.StudiesLab.sync();
      return;
    }
    if (['index', 'about', 'playground', 'approach'].includes(route)) desired = $(`#${route}-dialog`);
    else if (route.startsWith('experiment/')) {
      const experiment = experiments.find((item) => item.slug === route.slice(11));
      if (experiment) {
        $('#experiment-title').textContent = experiment.name;
        $('#experiment-number').textContent = experiment.category;
        $('#experiment-description').textContent = experiment.description;
        window.StudiesLab.select(experiment.slug);
        desired = $('#experiment-dialog');
        document.title = `${experiment.name} - Parallax`;
      }
    }
    else if (route.startsWith('study/')) {
      const index = studies.findIndex((study) => study.slug === route.slice(6));
      if (index >= 0) {
        const study = studies[index];
        const current = Math.round(target);
        const half = Math.floor(studies.length / 2);
        const difference = mod(index - mod(current) + half) - half;
        goTo(current + difference, true);
        updateActive(index);
        setStudyImage($('#study-image'), study, '(max-width: 760px) calc(100vw - 40px), 47vw');
        ['#study-detail-a', '#study-detail-b'].forEach((selector) => {
          setStudyImage($(selector), study, '(max-width: 760px) calc(100vw - 40px), 47vw');
          $(selector).alt = `Close detail of ${study.name}: ${study.alt}`;
        });
        document.querySelectorAll('.mini-image').forEach((image) => { setStudyImage(image, study, '80px'); });
        $('#study-focus').textContent = study.category;
        $('#case-poster-name').textContent = study.name;
        $('#case-poster-phrase').textContent = study.intro;
        $('#mini-title').textContent = study.name[0];
        const palettes = [['#243e43', '#f1e8d1'], ['#d3c6af', '#34352d'], ['#5d1918', '#e3c68f'], ['#181c2d', '#dedbf3']];
        $('#case-frame-2').style.setProperty('--poster-bg', palettes[index % palettes.length][0]);
        $('#case-frame-2').style.setProperty('--poster-ink', palettes[index % palettes.length][1]);
        $('.study-note').textContent = study.credit || 'Independent concept. AI-generated imagery.';
        $('#image-kind').textContent = study.imageKind || (study.credit ? 'Reference photograph' : 'Concept image');
        $('#study-title').textContent = study.name;
        $('#study-category').textContent = study.category;
        $('#study-position').textContent = `Study ${number(index)} / ${total}`;
        $('#study-intro').textContent = study.intro;
        $('#study-description').replaceChildren(...study.paragraphs.map((text) => {
          const paragraph = document.createElement('p');
          paragraph.textContent = text;
          return paragraph;
        }));
        $('#next-study-name').textContent = studies[mod(index + 1)].name;
        $('#next-study').dataset.next = String(mod(index + 1));
        document.title = `${study.name} - Parallax`;
        desired = $('#study-dialog');
      }
    }
    document.querySelectorAll('dialog[open]').forEach((dialog) => { if (dialog !== desired) dialog.close(); });
    if (desired) {
      clearTimeout(snapTimer);
      if (!desired.open) desired.showModal();
      desired.scrollTop = 0;
      if (!route.startsWith('study/') && !route.startsWith('experiment/')) document.title = `${route[0].toUpperCase() + route.slice(1)} - Parallax`;
    } else {
      document.title = 'Parallax - Lucas';
      if (route && route !== 'work') history.replaceState(null, '', '#work');
      wake();
    }
    document.querySelectorAll('.sheet-nav [data-panel]').forEach((button) => {
      if (button.dataset.panel === route) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    window.StudiesLab.sync();
    syncPortfolioNav();
  }
  document.querySelectorAll('[data-panel]').forEach((button) => button.addEventListener('click', () => navigate(`#${button.dataset.panel}`)));
  document.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', (event) => { event.preventDefault(); closeSheet(); }));
  document.querySelectorAll('dialog:not(#artwork-dialog)').forEach((dialog) => dialog.addEventListener('cancel', (event) => { event.preventDefault(); closeSheet(); }));
  $('#next-study').addEventListener('click', () => navigate(`#study/${studies[Number($('#next-study').dataset.next)].slug}`));
  window.addEventListener('popstate', renderRoute);
  window.addEventListener('hashchange', renderRoute);
  document.querySelectorAll('[data-frame]').forEach((button) => button.addEventListener('click', () => $(`#case-frame-${button.dataset.frame}`).scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth', block: 'center' })));
  $('#view-artwork').addEventListener('click', () => {
    $('#artwork-image').src = studies[active].image;
    $('#artwork-image').alt = studies[active].alt;
    $('#artwork-dialog').showModal();
    syncPortfolioNav();
  });
  $('#artwork-close').addEventListener('click', () => $('#artwork-dialog').close());
  $('#artwork-dialog').addEventListener('cancel', (event) => { event.preventDefault(); event.stopImmediatePropagation(); $('#artwork-dialog').close(); });
  $('#copy-email').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText('lucasnguyen.sh@gmail.com'); $('#copy-status').textContent = 'Email copied.'; }
    catch { $('#copy-status').textContent = 'Select the address above to copy it.'; }
  });

  function playSound(index) {
    if (!audioContext || audioContext.state !== 'running' || performance.now() - lastSound < 120) return;
    lastSound = performance.now();
    const time = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = [196, 220, 261.63, 293.66][index % 4];
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(.055, time + .012);
    gain.gain.exponentialRampToValueAtTime(.0001, time + .35);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(time);
    oscillator.stop(time + .36);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  }
  $('#sound-toggle').addEventListener('click', async () => {
    try {
      if (!audioContext) {
        const Context = window.AudioContext || window.webkitAudioContext;
        if (!Context) throw new Error('Audio unavailable');
        audioContext = new Context();
      }
      soundOn = !soundOn;
      if (soundOn) await audioContext.resume();
      else await audioContext.suspend();
      $('#sound-toggle').setAttribute('aria-pressed', String(soundOn));
      $('#sound-state').textContent = soundOn ? 'On' : 'Off';
      if (soundOn) playSound(active);
    } catch {
      soundOn = false;
      $('#sound-state').textContent = 'Unavailable';
      $('#sound-toggle').setAttribute('aria-pressed', 'false');
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (frame) cancelAnimationFrame(frame); frame = 0; audioContext?.suspend().catch(() => {}); }
    else { lastTime = 0; wake(); if (soundOn) audioContext?.resume().catch(() => {}); }
  });

  function updateClock() { $('#local-time').textContent = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()); }
  updateClock();
  setInterval(updateClock, 60000);
  paint();
  renderRoute();
})();

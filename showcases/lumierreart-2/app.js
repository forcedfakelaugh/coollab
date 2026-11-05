const artworks = [
  {id:'tth14',image:[1600,1600],vi:'Thủy tinh hóa 14',en:'Crystallization 14',category:'crystallization',size:'101 × 110 cm',year:'2026',handle:'thủy-tinh-hoa-14',description:{vi:'Những lớp hình và sắc độ chồng lên nhau, gợi cảm giác về ký ức được lưu giữ trong một bề mặt trong trẻo. Một tác phẩm thuộc series Thủy tinh hóa của Nguyễn Văn Trinh.',en:'Overlapping forms and tonal layers suggest memories held beneath a translucent surface. A work from Nguyễn Văn Trinh’s Crystallization series.'}},
  {id:'vs5',image:[1600,1333],vi:'Vùng sống 5',en:'Biosphere 5',category:'biosphere',size:'100 × 120 cm',year:'2023',handle:'vung-sống-5',description:{vi:'Sắc vàng, tím và xanh mở ra một cảnh quan giàu tưởng tượng. Vùng sống là hành trình khám phá mối liên hệ giữa sinh thể, không gian và ký ức của người họa sĩ.',en:'Gold, violet and blue open onto an imagined landscape. Biosphere explores the connections between living forms, space and the painter’s memories.'}},
  {id:'ngoclien',image:[1600,1189],vi:'Ngọc Liên',en:'Jade Lotus',category:'life',size:'90 × 68 cm',year:'2026',handle:'ngọc-lien-jade-lotus',description:{vi:'Hoa sen hồng, những chiếc lá xanh và nền đỏ ấm tạo nên một nhịp điệu mềm mại trên lụa. Một góc nhìn gần gũi về vẻ đẹp của thiên nhiên.',en:'Pink lotus flowers, green leaves and a warm red ground create a gentle rhythm on silk. An intimate view of the natural world.'}},
  {id:'tth8',image:[992,1030],vi:'Thủy tinh hóa 8',en:'Crystallization 8',category:'crystallization',size:'100 × 110 cm',year:'2025',handle:'thủy-tinh-hoa-8',description:{vi:'Những đường nét mảnh và lớp màu trầm đan xen trên mặt lụa. Tác phẩm gợi mở một không gian vừa mong manh, vừa nhiều tầng sâu.',en:'Fine lines and muted washes intertwine across the silk. The work suggests a space at once delicate and layered.'}},
  {id:'atelier',image:[1380,1600],vi:'Bên trong xưởng vẽ',en:'Inside the Atelier',category:'life',size:'78 × 87 cm',year:'2023',handle:'ben-trong-xưởng-vẽ',description:{vi:'Một khoảnh khắc quan sát người mẫu trong xưởng được chuyển thành hội họa. Ánh sáng và chất lụa làm dịu những đường nét, giữ lại cảm giác yên tĩnh của giây phút ấy.',en:'A moment observing a model in the studio becomes a painting. Light and silk soften the contours, holding onto the quiet of that encounter.'}},
  {id:'vs7',image:[1600,752],vi:'Vùng sống 7',en:'Biosphere 7',category:'biosphere',size:'100 × 200 cm',year:'2023',handle:'vung-sống-7',description:{vi:'Một thế giới sinh thể và phong cảnh nối dài trên khổ lụa ngang. Hình ảnh quen thuộc được biến đổi bằng trí tưởng tượng và những dòng chảy màu sắc.',en:'Living forms and landscapes stretch across a panoramic silk surface. Familiar imagery is transformed by imagination and flowing colour.'}}
];
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const storageKey = 'lumierreart-2-selection';
let language = 'vi';
let saved = new Set();
let filter = 'all';
let heroIndex = 0;
let activeArtwork = null;
let dialogMode = null;
let toastTimer;
const heroWorks = ['vs5','tth14','ngoclien'];
try {
  language = localStorage.getItem('lucas-portfolio-language') === 'en' ? 'en' : 'vi';
  const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (Array.isArray(stored)) saved = new Set(stored.filter(id => artworks.some(art => art.id === id)));
} catch { /* A private browser session can still use every control. */ }
const t = (vi,en) => language === 'vi' ? vi : en;
const bookmark = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z"/></svg>';
const originalUrl = art => `https://lumierearts.com/${language === 'vi' ? 'vi/' : ''}products/${encodeURIComponent(art.handle)}`;

// Cache the authored Vietnamese before switching languages, including accessibility copy.
$$('[data-en]').forEach(el => {el.dataset.vi = el.innerHTML;});
for (const attr of ['label','alt','placeholder']) {
  const realAttr = attr === 'label' ? 'aria-label' : attr;
  $$(`[data-en-${attr}]`).forEach(el => {el.dataset[`vi${attr[0].toUpperCase()+attr.slice(1)}`] = el.getAttribute(realAttr);});
}

function applyLanguage() {
  document.documentElement.lang = language;
  $$('[data-en]').forEach(el => {el.innerHTML = el.dataset[language];});
  for (const attr of ['label','alt','placeholder']) {
    const realAttr = attr === 'label' ? 'aria-label' : attr;
    $$(`[data-en-${attr}]`).forEach(el => el.setAttribute(realAttr,el.dataset[language+attr[0].toUpperCase()+attr.slice(1)]));
  }
  $('.menu-toggle').setAttribute('aria-label',$('#mobile-nav').hidden?t('Mở menu','Open menu'):t('Đóng menu','Close menu'));
  document.title = t('lumierreart 2 - Lumiere Arts · Tranh, lụa và đời sống','lumierreart 2 - Lumiere Arts · Art, silk and life');
  $('meta[name="description"]').content = t('Tranh lụa của Nguyễn Văn Trinh, khăn lụa từ hội họa và những vật phẩm làm bằng tay. Một tuyển chọn từ Lumiere Arts, Hà Nội.','Silk paintings by Nguyễn Văn Trinh, artist-designed scarves and handmade objects. A selection from Lumiere Arts, Hanoi.');
  $$('a[href^="https://lumierearts.com/"]').forEach(link => {
    if (!link.dataset.sourcePath) link.dataset.sourcePath = new URL(link.href).pathname.replace(/^\/vi(?=\/|$)/, '') || '/';
    link.href = 'https://lumierearts.com' + (language === 'vi' ? '/vi' : '') + link.dataset.sourcePath;
  });
  renderCollection();
  renderHero();
  updateSavedCount();
  if ($('#art-dialog').open) {
    if (dialogMode === 'selection') renderSelection();
    else if (activeArtwork) renderDetail(activeArtwork);
  }
}

function renderCollection() {
  const visible = artworks.filter(art => filter === 'all' || art.category === filter);
  $('#artwork-grid').innerHTML = visible.map((art,index) => `<article class="artwork-card" style="animation-delay:${index*35}ms;--art-ratio:${art.image[0]/art.image[1]}"><button type="button" class="artwork-image" data-art="${art.id}" aria-label="${t('Xem','View')} ${art[language]}"><img src="assets/${art.id}.webp" alt="${art[language]}, Nguyễn Văn Trinh, ${art.year}" loading="lazy" width="${art.image[0]}" height="${art.image[1]}"></button><div class="card-topline"><h3><button type="button" class="card-title" data-art="${art.id}">${art[language]}</button></h3><button type="button" class="save-button" data-save="${art.id}" aria-pressed="${saved.has(art.id)}" aria-label="${saved.has(art.id)?t('Bỏ lưu','Remove saved'):t('Lưu','Save')} ${art[language]}">${bookmark}<span class="save-label">${saved.has(art.id)?t('Đã lưu','Saved'):t('Lưu','Save')}</span></button></div><p class="card-meta"><span>${t('Màu nước trên lụa','Watercolour on silk')} · ${art.year}</span><span>${art.size}</span></p></article>`).join('');
  $('.collection-count').innerHTML = `${String(visible.length).padStart(2,'0')} <span>${t('TÁC PHẨM','WORKS')}</span>`;
}

function renderHero() {
  const center = artworks.find(art => art.id === heroWorks[heroIndex]);
  $('#exhibition-wall').style.setProperty('--hero-ratio',center.image[1]/center.image[0]);
  const positions = ['left','center','right'];
  const workIds = [heroWorks[(heroIndex+2)%3],heroWorks[heroIndex],heroWorks[(heroIndex+1)%3]];
  $('#exhibition-wall').innerHTML = workIds.map((id,index)=>{
    const art = artworks.find(item=>item.id===id);
    return `<button class="wall-work ${positions[index]}" type="button" data-art="${art.id}" aria-label="${t('Xem','View')} ${art[language]}"><img src="assets/${art.id}.webp" alt="${art[language]}, Nguyễn Văn Trinh, ${art.year}" width="800" height="800"><span class="wall-caption"><span>${art[language]}<small>${t('Màu nước trên lụa','Watercolour on silk')}</small></span><span class="wall-year">${art.year}</span></span></button>`;
  }).join('');
  $('#hero-position').textContent = `${String(heroIndex+1).padStart(2,'0')} / 03`;
}

function updateSavedCount() {
  $('.saved-count').textContent = saved.size;
  $('.selection-toggle').setAttribute('aria-label',`${t('Tác phẩm đã lưu','Saved artworks')} (${saved.size})`);
}
function notify(message) {
  clearTimeout(toastTimer);
  $('.toast').textContent = message;
  $('.toast').classList.add('visible');
  toastTimer = setTimeout(()=>$('.toast').classList.remove('visible'),2600);
}
function toggleSave(id) {
  const art = artworks.find(item=>item.id === id);
  if (!art) return;
  if (saved.has(id)) saved.delete(id); else saved.add(id);
  try {localStorage.setItem(storageKey,JSON.stringify([...saved]));} catch {}
  updateSavedCount();
  // Update controls in place so keyboard focus is preserved.
  $$(`[data-save="${id}"]`).forEach(button => {
    button.setAttribute('aria-pressed',String(saved.has(id)));
    button.setAttribute('aria-label',`${saved.has(id)?t('Bỏ lưu','Remove saved'):t('Lưu','Save')} ${art[language]}`);
    const label = button.querySelector('.save-label');
    if (label) label.textContent = saved.has(id)?t('Đã lưu','Saved'):t('Lưu','Save');
    if (button.classList.contains('detail-save')) button.textContent = saved.has(id)?t('Đã lưu vào lựa chọn của bạn ✓','Saved to your selection ✓'):t('Lưu vào lựa chọn của bạn','Save to your selection');
  });
  notify(saved.has(id)?t('Đã lưu vào lựa chọn của bạn.','Added to your selection.'):t('Đã bỏ lưu tác phẩm.','Artwork removed from your selection.'));
}

function openDialog(dialog) {
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('dialog-open');
}
function renderDetail(id) {
  const art = artworks.find(item=>item.id === id);
  if (!art) return;
  activeArtwork = id;
  dialogMode = 'artwork';
  $('#dialog-content').innerHTML = `<div class="detail-layout"><div class="detail-image-area"><div class="detail-stage"><img src="assets/${art.id}.webp" alt="${art[language]}, Nguyễn Văn Trinh"></div><div class="detail-view-controls"><div class="view-switch" role="group" aria-label="${t('Chế độ xem','View mode')}"><button type="button" data-view="art" aria-pressed="true">${t('Tác phẩm','Artwork')}</button><button type="button" data-view="room" aria-pressed="false">${t('Trên tường','On a wall')}</button></div><div class="wall-swatches" hidden><button type="button" class="wall-swatch" style="--swatch:#e5dfd1" data-wall="#e5dfd1" aria-label="${t('Tường kem','Ivory wall')}" aria-pressed="true"></button><button type="button" class="wall-swatch" style="--swatch:#849181" data-wall="#849181" aria-label="${t('Tường xanh','Sage wall')}" aria-pressed="false"></button><button type="button" class="wall-swatch" style="--swatch:#9d8175" data-wall="#9d8175" aria-label="${t('Tường đất','Clay wall')}" aria-pressed="false"></button></div></div><p class="room-note"></p></div><div class="detail-copy"><p class="eyebrow">${t('HỘI HỌA NGUYÊN BẢN','ORIGINAL PAINTING')}</p><h2 id="dialog-title">${art[language]}</h2><p class="detail-artist">Nguyễn Văn Trinh</p><p class="description">${art.description[language]}</p><dl class="detail-specs"><div><dt>${t('Chất liệu','Medium')}</dt><dd>${t('Màu nước trên lụa','Watercolour on silk')}</dd></div><div><dt>${t('Kích thước','Dimensions')}</dt><dd>${art.size}</dd></div><div><dt>${t('Năm sáng tác','Year')}</dt><dd>${art.year}</dd></div><div><dt>${t('Chứng nhận','Certificate')}</dt><dd>${t('Xác thực tác phẩm (COA)','Authenticity (COA)')}</dd></div></dl><a class="solid-link" href="mailto:lumierearts26@gmail.com?subject=${encodeURIComponent(t('Tìm hiểu tác phẩm: ','Artwork inquiry: ')+art[language])}&body=${encodeURIComponent(t('Xin chào Lumiere Arts,\n\nTôi muốn tìm hiểu thêm về tác phẩm ','Hello Lumiere Arts,\n\nI would like to learn more about ')+art[language]+', Nguyễn Văn Trinh.\n'+originalUrl(art)+'\n\n'+t('Vui lòng tư vấn về tình trạng tác phẩm, giá và vận chuyển.\n\nCảm ơn!','Please share its availability, price and shipping options.\n\nThank you!'))}"><span>${t('Hỏi về tác phẩm','Inquire about this work')}</span></a><button type="button" class="detail-save" data-save="${art.id}" aria-pressed="${saved.has(art.id)}">${saved.has(art.id)?t('Đã lưu vào lựa chọn của bạn ✓','Saved to your selection ✓'):t('Lưu vào lựa chọn của bạn','Save to your selection')}</button><a class="detail-original" href="${originalUrl(art)}" target="_blank" rel="noopener noreferrer">${t('Xem tác phẩm trên website Lumiere Arts','View on the Lumiere Arts website')}</a></div></div>`;
}
function renderSelection() {
  dialogMode = 'selection';
  activeArtwork = null;
  const selected = artworks.filter(art=>saved.has(art.id));
  const body = t('Xin chào Lumiere Arts,\n\nTôi quan tâm đến các tác phẩm sau:\n','Hello Lumiere Arts,\n\nI am interested in the following works:\n')+selected.map(art=>`${art[language]}, Nguyễn Văn Trinh (${art.year})\n${originalUrl(art)}`).join('\n\n')+'\n\n'+t('Vui lòng tư vấn thêm về tình trạng tác phẩm và giá.\n\nCảm ơn!','Please share availability and pricing.\n\nThank you!');
  $('#dialog-content').innerHTML = `<div class="selection-content"><p class="eyebrow">${t('LƯU ĐỂ XEM LẠI','YOUR SELECTION')}</p><h2 id="dialog-title">${t('Tác phẩm đã lưu.','Saved works.')}</h2>${selected.length?selected.map(art=>`<div class="saved-item"><button type="button" data-art="${art.id}" aria-label="${t('Xem','View')} ${art[language]}" style="margin:0;padding:0"><img src="assets/${art.id}.webp" alt="${art[language]}"></button><div><h3>${art[language]}</h3><p>${art.size} · ${art.year}</p></div><button type="button" data-remove="${art.id}" aria-label="${t('Bỏ lưu','Remove')} ${art[language]}">${t('Bỏ lưu','Remove')}</button></div>`).join(''):`<p class="empty-selection">${t('Chọn Lưu bên cạnh tác phẩm bạn yêu thích. Những lựa chọn ấy sẽ được lưu tại đây.','Choose Save beside an artwork you love. Your selection will be collected here.')}</p><button class="solid-link" type="button" data-close>${t('Khám phá tác phẩm','Explore the artworks')} </button>`}${selected.length?`<a class="solid-link" href="mailto:lumierearts26@gmail.com?subject=${encodeURIComponent(t('Tư vấn bộ sưu tập cá nhân','My art selection'))}&body=${encodeURIComponent(body)}">${t('Trao đổi về lựa chọn của bạn','Inquire about your selection')} </a><p class="form-note">${t('Soạn email với danh sách tác phẩm đã lưu.','Compose an email with your selected artworks.')}</p>`:''}</div>`;
}

window.addEventListener('showcase-language', event => {
  language = event.detail.language === 'en' ? 'en' : 'vi';
  applyLanguage();
});
$$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  filter = button.dataset.filter;
  $$('[data-filter]').forEach(item=>item.setAttribute('aria-pressed',String(item === button)));
  renderCollection();
}));
$$('[data-layout]').forEach(button=>button.addEventListener('click',()=>{
  $('#artwork-grid').classList.toggle('index',button.dataset.layout==='index');
  $$('[data-layout]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
}));
$$('[data-study]').forEach(button=>button.addEventListener('click',()=>{
  const scarf=button.dataset.study==='scarf';
  $('.study-painting').hidden=scarf;
  $('.study-scarf').hidden=!scarf;
  $('.study-heading span:last-child').textContent=scarf?'02 / 02':'01 / 02';
  $$('[data-study]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
}));
$('.hero-next').addEventListener('click',()=>{heroIndex=(heroIndex+1)%heroWorks.length;renderHero();});
$('.hero-prev').addEventListener('click',()=>{heroIndex=(heroIndex+heroWorks.length-1)%heroWorks.length;renderHero();});
$('.menu-toggle').addEventListener('click',()=>{
  const expanded = $('.menu-toggle').getAttribute('aria-expanded') !== 'true';
  $('.menu-toggle').setAttribute('aria-expanded',String(expanded));
  $('#mobile-nav').hidden = !expanded;
  $('.menu-toggle').setAttribute('aria-label',expanded?t('Đóng menu','Close menu'):t('Mở menu','Open menu'));
});
function closeMenu(){
  $('.menu-toggle').setAttribute('aria-expanded','false');
  $('#mobile-nav').hidden = true;
  $('.menu-toggle').setAttribute('aria-label',t('Mở menu','Open menu'));
}
$$('#mobile-nav a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key === 'Escape')closeMenu();});
matchMedia('(min-width: 801px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
$('.selection-toggle').addEventListener('click',()=>{renderSelection();openDialog($('#art-dialog'));});
$('#inquiry-open').addEventListener('click',()=>openDialog($('#inquiry-dialog')));
$$('dialog').forEach(dialog=>{
  dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{if(!$$('dialog[open]').length)document.body.classList.remove('dialog-open');});
  dialog.addEventListener('click',event=>{
    const rect = dialog.getBoundingClientRect();
    if(event.target === dialog && (event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom))dialog.close();
  });
});
document.addEventListener('click',event=>{
  const artButton = event.target.closest('[data-art]');
  if(artButton){renderDetail(artButton.dataset.art);openDialog($('#art-dialog'));return;}
  const saveButton = event.target.closest('[data-save]');
  if(saveButton){toggleSave(saveButton.dataset.save);return;}
  const removeButton = event.target.closest('[data-remove]');
  if(removeButton){toggleSave(removeButton.dataset.remove);renderSelection();$('#art-dialog .dialog-close').focus();return;}
  const view = event.target.closest('[data-view]');
  if(view){const room=view.dataset.view==='room';$('.detail-stage').classList.toggle('room',room);$('.wall-swatches').hidden=!room;$$('[data-view]').forEach(button=>button.setAttribute('aria-pressed',String(button===view)));$('.room-note').textContent=room?t('Không gian minh họa, không theo tỷ lệ thực.','Illustrative preview, not to scale.'):'';return;}
  const swatch = event.target.closest('[data-wall]');
  if(swatch){$('.detail-stage').style.setProperty('--wall',swatch.dataset.wall);$$('[data-wall]').forEach(button=>button.setAttribute('aria-pressed',String(button===swatch)));return;}
  if(event.target.closest('[data-close]')){$('#art-dialog').close();$('#collection').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});}
});
$('#inquiry-form').addEventListener('submit',event=>{
  event.preventDefault();
  const subject = $('#inquiry-interest').selectedOptions[0].textContent;
  const message = $('#inquiry-message').value.trim();
  const body = `${t('Xin chào Lumiere Arts,','Hello Lumiere Arts,')}\n\n${subject}\n\n${message}\n\n${t('Cảm ơn!','Thank you!')}`;
  window.location.href = `mailto:lumierearts26@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  notify(t('Đang mở bản nháp trong ứng dụng email của bạn.','Opening a draft in your email app.'));
});

applyLanguage();

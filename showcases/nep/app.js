const studies = [
 {id:'001',title:'An angled dialogue.',short:'An angled dialogue',category:'form',label:'Form & mass',caption:'REFERENCE PHOTOGRAPH',source:'TAA DESIGN',image:'taa-balconies',alt:'Staggered planted balconies and warm lighting at Cat Vang Hotel & Apartment, from TAA DESIGN',inquiry:'Projection & overlap',material:'Solid edges / glass / planting',description:'Box-shaped balconies project beyond the glazed rooms, shifting sideways from one level to the next. Solid parapets, trees and warm light make the depth of each layer visible.',notes:'The photograph is viewed from below: the undersides of the balconies and their staggered edges give the facade its depth. Trees rise behind solid parapets, while warm light catches the soffits. Our conceptual sketch reduces this observation to three offset volumes, with one projecting edge marked in red.'},
 {id:'002',title:'The rhythm of repetition.',short:'The rhythm of repetition',category:'form',label:'Rhythm & facade',caption:'REFERENCE PHOTOGRAPH',source:'TAA DESIGN',image:'taa-rhythm',alt:'Repeating rectangular facade frames and slatted screens surrounded by dense greenery, from TAA DESIGN',inquiry:'Module & repetition',material:'Frames / slats / planting',description:'Warm-toned rectangular frames surround recessed glazing. Closely spaced slats create a smaller rhythm inside the larger bays, while planting spills across their edges.',notes:'Two rhythms are visible in the photograph: the large rectangular frames and the finer spacing of the slats. Planting crosses the frame edges and makes the repetition less uniform. Our conceptual elevation repeats a simple bay and highlights one frame in red; the regular grid is an imagined arrangement.'},
 {id:'003',title:'A space held open.',short:'A space held open',category:'space',label:'Space & light',caption:'REFERENCE PHOTOGRAPH',source:'UNSPLASH',image:'hive-singapore',alt:'View down the atrium of The Hive, Singapore, with curved concrete edges, dark railings and hanging plants',inquiry:'Layers & void',material:'Concrete / railings / planting',description:'Seen from above, curved walkways overlap around the atrium of The Hive in Singapore. Pale concrete edges and dark railings trace each level, with hanging plants along one side of the opening.',notes:'The photograph looks down through several levels toward the ground-floor paving. Rounded edges frame places to walk and sit, while the central opening keeps the levels visible to one another. Our conceptual sketch uses three open rings to study this relationship between circulation and void; their oval shape is an abstraction.'}
];
const $ = selector => document.querySelector(selector);
let selected = 0;
let representation = 'photo';
const frame = (content, label) => `<svg viewBox="0 0 800 500" role="img" aria-label="${label}"><defs><pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 6L6 0" stroke="#b9bcb4" stroke-width=".5"/></pattern></defs>${content}<g fill="#85877f" font-family="Arial,sans-serif" font-size="9"><text x="48" y="460">ABSTRACT COMPOSITION</text><text x="660" y="460">NOT TO SCALE</text></g><path d="M48 434h90m-90-4v8m45-8v8m45-8v8" fill="none" stroke="#54594f"/></svg>`;
function balconyDrawing() {
 // Imagined balcony volumes share a single parallel projection.
 const project = ([x, y, z]) => `${+(210 + 145*x + 90*y).toFixed(2)} ${+(390 - 55*y - 85*z).toFixed(2)}`;
 const path = (points, closed = false) => `M${points.map(project).join('L')}${closed ? 'Z' : ''}`;
 const volumes = [[0,.25],[.6,1.35],[0,2.45]].map(([x,z], index) => {
  const a=[x,-.4,z], b=[x+1.7,-.4,z], c=[x+1.7,.9,z];
  const e=[x,-.4,z+.35], f=[x+1.7,-.4,z+.35], g=[x+1.7,.9,z+.35], h=[x,.9,z+.35];
  return `<path d="${path([e,f,g,h],true)}" fill="#e2e4d4"/>
   <path d="${path([a,b,f,e],true)}" fill="#f6eee0"/>
   <path d="${path([b,c,g,f],true)}" fill="url(#hatch)"/>
   <path d="${path([a,b,c,g,h,e,a])}${path([e,f,g])}${path([b,f])}" fill="none"/>
   ${index===1 ? `<path d="${path([e,f])}" stroke="#cf382b" stroke-width="3"/>` : ''}`;
 }).join('');
 return frame(`<g stroke="#383d36" stroke-width="1.4" stroke-linejoin="round">
  <path d="${path([[0,.9,0],[2.3,.9,0],[2.3,.9,3.3],[0,.9,3.3]],true)}" fill="#d6d3c5" fill-opacity=".3" stroke="#95998b"/>
  ${volumes}</g><g font-family="Arial" font-size="11" fill="#555b52">
  <text x="70" y="70">OFFSET / OVERLAP</text>
  <path d="M507 268H665V310" fill="none" stroke="#cf382b"/>
  <text x="600" y="333" fill="#cf382b">PROJECTING EDGE</text>
  </g>`, 'Conceptual axonometric sketch of three staggered balcony volumes with one projecting edge highlighted');
}
function rhythmDrawing() {
 const bays = [0,1].flatMap(row => [0,1,2].map(col => {
  const x=150+col*170, y=100+row*140;
  const highlight=row===1&&col===1;
  return `<g transform="translate(${x} ${y})" fill="none" stroke="#383d36" stroke-width="1.2">
   <rect width="150" height="120" stroke="${highlight?'#cf382b':'#383d36'}" stroke-width="${highlight?3:1.5}"/>
   <rect x="9" y="9" width="132" height="102"/>
   <path d="M95 9V95M104 9V95M113 9V95M122 9V95M131 9V95M9 95H141"/>
   <rect x="10" y="96" width="130" height="14" fill="#b5bca3" fill-opacity=".45" stroke="none"/>
  </g>`;
 })).join('');
 return frame(`${bays}<g font-family="Arial" font-size="11" fill="#555b52">
  <text x="150" y="70">FRAME / SLATS / PLANTING</text>
  <path d="M395 361V385" stroke="#cf382b"/>
  <text x="395" y="408" text-anchor="middle" fill="#cf382b">ONE REPEATED BAY</text>
  </g>`, 'Conceptual elevation of repeated rectangular frames with finer slats and planted ledges');
}
function atriumDrawing() {
 const rings = [180,90,0].map(offset => `<g transform="translate(0 ${offset})" stroke="#383d36" stroke-width="1.4">
  <path d="M170 135C170 215 630 215 630 135V150C630 230 170 230 170 150Z" fill="url(#hatch)"/>
  <path d="M170 135C170 55 630 55 630 135C630 215 170 215 170 135Z M285 135C285 95 515 95 515 135C515 175 285 175 285 135Z" fill="#ede2d0" fill-rule="evenodd"/>
  </g>`).join('');
 return frame(`${rings}<g fill="none" stroke="#cf382b" stroke-width="1.5" stroke-dasharray="4 5">
  <ellipse cx="400" cy="135" rx="100" ry="24"/>
  <path d="M400 160V340"/>
  </g><g font-family="Arial" font-size="11" fill="#555b52">
  <text x="150" y="55">LAYERED WALKWAYS</text>
  <path d="M500 135H645V95" fill="none" stroke="#cf382b"/>
  <text x="560" y="75" fill="#cf382b">SHARED VOID</text>
  </g>`, 'Conceptual sketch of three open circulation rings stacked around a shared vertical void');
}
const drawings = [
 balconyDrawing(),
 rhythmDrawing(),
 atriumDrawing()
];
function renderIndex(){
 if (!$('#project-list').children.length) {
  $('#project-list').innerHTML = studies.map(study => `<button class="project-item" data-id="${study.id}" aria-controls="viewer"><span class="project-number">${study.id.slice(1)}</span><span class="project-item-copy">${study.short}</span><span class="project-current" aria-hidden="true">${window.portfolioIcons.arrow("right")}</span></button>`).join('');
 }
 for (const button of $('#project-list').children) {
  const active=button.dataset.id===studies[selected].id;
  button.classList.toggle('active',active);
  if(active)button.setAttribute('aria-current','true');else button.removeAttribute('aria-current');
 }
}
function render(){
 const study=studies[selected];
 $('#project-title').textContent=study.title;
 $('#project-category').textContent=`${study.label.toUpperCase()} / STUDY ${study.id}`;
 $('#project-image').src=`assets/${study.image}.jpg`;
 $('#project-image').alt=study.alt;
 $('#image-caption').textContent=`${study.id.slice(1)}.1 / ${study.caption} / ${study.source}`;
 $('#large-image-caption').textContent=`${study.caption} / ${study.source}`;
 $('#project-description').textContent=study.description;
 $('#project-inquiry').textContent=study.inquiry;
 $('#project-material').textContent=study.material;
 $('#sheet-number').textContent=`N-${study.id}`;
 $('#drawing').innerHTML=drawings[selected];
 $('#notes-title').textContent=study.title;
 $('#notes-copy').textContent=study.notes;
 $('#notes-number').textContent=study.id;
 $('#page-count').textContent=`${selected+1} of ${studies.length}`;
 $('#previous').disabled=selected===0;
 $('#next').disabled=selected===studies.length-1;
 renderIndex();
}
$('#project-list').addEventListener('click',event=>{
 const button=event.target.closest('[data-id]');
 if(!button)return;
 selected=studies.findIndex(study=>study.id===button.dataset.id);
 render();
 if(matchMedia('(max-width:700px)').matches)$('#viewer').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
});
function step(delta){selected=Math.max(0,Math.min(studies.length-1,selected+delta));render();}
$('#previous').addEventListener('click',()=>step(-1));$('#next').addEventListener('click',()=>step(1));
for(const button of document.querySelectorAll('[data-view]'))button.addEventListener('click',()=>{representation=button.dataset.view;$('#photo-view').hidden=representation!=='photo';$('#drawing-view').hidden=representation!=='drawing';for(const item of document.querySelectorAll('[data-view]')){const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active));}});
function openDialog(id){$(id).showModal();document.body.classList.add('modal-open');}
$('#info-open').addEventListener('click',()=>openDialog('#notes'));
$('#expand').addEventListener('click',()=>{const study=studies[selected];$('#large-image').src=`assets/${study.image}.jpg`;$('#large-image').alt=study.alt;openDialog('#lightbox');});
for(const dialog of document.querySelectorAll('dialog')){dialog.querySelector('.close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>document.body.classList.remove('modal-open'));dialog.addEventListener('click',event=>{const rect=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom))dialog.close();});}
render();

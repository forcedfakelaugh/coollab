import { readFile, writeFile } from 'node:fs/promises';

const projects = JSON.parse(await readFile('content/projects.json', 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const cards = projects.map((p, index) => {
  const title = escape(p.title), category = escape(p.category);
  const source = `https://www.figma.com/design/QZ4D7fz78GWHkBMTgEDimC/Portfolio?node-id=${p.node.replace(':', '-')}`;
  return `<article class="project" data-title="${title}" data-category="${category}" data-description="${escape(p.description)}" data-detail="assets/projects/${p.slug}-detail.webp">
  <a class="project-link" href="${source}" target="_blank" rel="noopener noreferrer" aria-label="Xem dự án ${title}">
    <img class="project-visual" src="assets/projects/${p.slug}-960.webp" srcset="assets/projects/${p.slug}-480.webp 480w, assets/projects/${p.slug}-960.webp 960w" sizes="(max-width: 540px) 100vw, (max-width: 760px) ${index === 0 || index === 6 ? '100vw' : '50vw'}, ${index === 0 || index === 6 ? '67vw' : '33vw'}" alt="${title} - ${category}" width="960" height="960" ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
    <div class="project-hover" aria-hidden="true"><h3>${title}</h3><div class="project-hover-footer"><p>${category}</p></div></div>
    <div class="project-mobile-caption"><div><h3>${title}</h3><p>${category}</p></div></div>
  </a>
</article>`;
}).join('\n');
const source = await readFile('index.html', 'utf8');
await writeFile('index.html', source.replace(/<!-- projects:start -->[\s\S]*?<!-- projects:end -->/, `<!-- projects:start -->\n${cards}\n<!-- projects:end -->`));
console.log(`Rendered ${projects.length} projects from the supplied Figma portfolio.`);

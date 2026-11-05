import { readFile, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';

const html = await readFile('index.html', 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
if (ids.length !== new Set(ids).size) throw new Error('Duplicate HTML IDs.');
if ((html.match(/<h1\b/g) || []).length !== 1) throw new Error('Expected one page heading.');
const projects = JSON.parse(await readFile('content/projects.json', 'utf8'));
if ((html.match(/class="project"/g) || []).length !== projects.length) throw new Error('Run node scripts/render-projects.mjs to synchronize the gallery.');
const references = new Set();
for (const match of html.matchAll(/\b(?:src|href|data-detail)="([^"]+)"/g)) {
  if (match[1].startsWith('#')) {
    if (!ids.includes(match[1].slice(1))) throw new Error(`Missing anchor ${match[1]}`);
  } else if (!/^[a-z]+:/i.test(match[1])) references.add((match[1].startsWith('/') ? match[1].slice(1) : match[1]).endsWith('/') ? `${match[1].replace(/^\//, '')}index.html` : match[1].replace(/^\//, ''));
}
for (const p of projects) for (const suffix of ['480', '960', 'detail']) references.add(`assets/projects/${p.slug}-${suffix}.webp`);
for (const file of ['style.css', 'assets/fonts/fonts.css']) {
  const css = await readFile(file, 'utf8');
  for (const match of css.matchAll(/url\(['"]?([^'"\s)]+)['"]?\)/g)) references.add(resolve(dirname(file), match[1]));
}
for (const file of references) if (!(await stat(file)).isFile()) throw new Error(`Missing public asset: ${file}`);
for (const file of ['app.js', 'server.mjs', 'scripts/build.mjs', 'scripts/render-projects.mjs', 'scripts/import-showcases.mjs', 'scripts/figma.mjs']) execFileSync(process.execPath, ['--check', file]);
if (/figd_|X-Figma-Token|FIGMA_TOKEN/.test(html + await readFile('app.js', 'utf8'))) throw new Error('Credential material found in public source.');
console.log(`Checks passed: ${projects.length} projects, ${references.size} local references, anchors and JavaScript syntax.`);

const playground = JSON.parse(await readFile('content/playground.json', 'utf8'));
const playgroundHTML = await readFile('playground/index.html', 'utf8');
for (const idea of playground) {
  if (!playgroundHTML.includes(`href="${idea.href}"`)) throw new Error(`Missing idea: ${idea.title}`);
  await stat(`${idea.href.slice(1)}index.html`);
}
console.log(`Playground: ${playground.length} concept pages verified.`);

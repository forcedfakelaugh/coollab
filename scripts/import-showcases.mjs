import { cp, readFile, readdir, writeFile } from 'node:fs/promises';
import { basename } from 'node:path';
const source = '../lucas-portfolio';
const excluded = new Set(['.DS_Store', '.git', 'node_modules', '.openai', 'portrait-options']);
const filter = path => !excluded.has(basename(path)) && !path.endsWith('.md');
await cp(`${source}/showcases`, 'showcases', { recursive: true, filter });
await cp(`${source}/hidden/wephobia`, 'hidden/wephobia', { recursive: true, filter });
async function updateReturns(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) await updateReturns(path);
    else if (path.endsWith('.html')) {
      const html = await readFile(path, 'utf8');
      await writeFile(path, html.replace(/(<a[^>]*class="portfolio-return"[^>]*href=")[^"]*("[^>]*>)[\s\S]*?<\/a>/g, '$1/playground/$2← Playground</a>'));
    }
  }
}
await updateReturns('showcases');
await updateReturns('hidden/wephobia');
const path = 'showcases/portfolio-language.js';
await writeFile(path, (await readFile(path, 'utf8')).replace("language === 'vi' ? '← Về portfolio' : '← Portfolio'", "'← Playground'"));
console.log('Imported portfolio concepts with Playground return navigation.');

for (const directory of ['showcases/hien', 'showcases/moc', 'hidden/wephobia']) {
  await cp(`${source}/${directory}/CREDITS.md`, `${directory}/CREDITS.txt`);
  const page = `${directory}/index.html`;
  await writeFile(page, (await readFile(page, 'utf8')).replace('href="CREDITS.md"', 'href="CREDITS.txt"'));
}
const wephobia = 'hidden/wephobia/index.html';
await writeFile(wephobia, (await readFile(wephobia, 'utf8')).replace('<body>', '<body><a href="/playground/" style="display:block;padding:12px 24px;background:#15181e;color:#fff;font:12px Arial,sans-serif">← Playground</a>'));

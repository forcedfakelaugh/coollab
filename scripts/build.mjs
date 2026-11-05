import { cp, mkdir, rm } from 'node:fs/promises';

await import('./check.mjs');
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'style.css', 'app.js', 'favicon.svg', 'assets', 'playground', 'hidden']) {
  await cp(file, `dist/${file}`, { recursive: true });
}
await cp('showcases', 'dist/showcases', { recursive: true, filter: source => !source.endsWith('.md') });
console.log('Built the Coollab landing page in dist/.');

import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const envPath = fileURLToPath(new URL('../.env.local', import.meta.url));
if (existsSync(envPath)) process.loadEnvFile(envPath);

// Project-local @sahajamit/figma-cli 0.2.0. Credentials stay in the environment.
await import('../.tools/figma-cli/node_modules/@sahajamit/figma-cli/dist/bin/figma.js');

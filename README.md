# Coollab

Local landing page based on the Falconn design, using artwork from the supplied Figma portfolio. No runtime dependencies.

```sh
npm run dev
```

Open `http://127.0.0.1:4175`.

```sh
npm run check
npm run build
```

Live site: https://coollab.pages.dev/

`dist/` contains only the public page and assets. Cloudflare Pages project `coollab` uses `main` as its production branch. To publish an update from an authenticated Cloudflare session:

```sh
npm run build
npx wrangler@4.152.0 pages deploy dist --project-name coollab --branch main
```

The initial production deployment is `efee1297-3923-4b59-aa8d-2a6be09d85e5`. All 51 published files were verified against the local build using SHA-256.

Project data is in `content/projects.json`. After editing it, run `node scripts/render-projects.mjs` to regenerate the gallery. Project cards open accessible native dialogs with full artwork; their ordinary links open the original Figma frames when JavaScript is unavailable.

The project-local Figma CLI can be run with `npm run figma -- <command>`. The wrapper reads `FIGMA_TOKEN` from `.env.local`, which is excluded from Git and not served by the development server. `.tools/`, raw Figma responses, signed export URLs and QA artifacts are also excluded from publication.

See `CREDITS.md` for artwork provenance and the font license.

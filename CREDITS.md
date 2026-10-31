# Sources

- Landing-page design adapted from Lucas's local `/Users/lucasnguyen/Developer/falconn-agency` project: outlined hero, split introduction, masonry, project hover panels, service accordions, red contact section. Falconn's own project images, logo, and business contact details are not included.
- Project artwork exported from the user-supplied [Portfolio Figma file](https://www.figma.com/design/QZ4D7fz78GWHkBMTgEDimC/Portfolio?node-id=4327-7522), page `4327:7522`, on 2026-10-31. Exact project nodes are recorded in `content/projects.json`. Project descriptions are based on the supplied design content.
- Gallery covers are crops of those exports; four use dedicated artwork nodes for better detail. Node IDs and crop coordinates are in `references/figma/cover-crops.json`. Project boards are available in the viewer with the source's navigation strip trimmed away; the original boards are linked in Figma. No substitute or generated client artwork is used.
- Contact details and Hanoi location come from the portfolio's Home frame `4327:7525` for Nguyễn Đức Minh. Coollab's wordmark and introductory copy are draft landing-page treatments.
- Be Vietnam Pro local fonts retained from the Falconn source. License: `assets/fonts/FONT-LICENSE.txt`.
- Local tooling: `@sahajamit/figma-cli` 0.2.0 (MIT), with `commander` 13.1.0 and `chalk` 5.4.1. Package integrity checked against npm registry metadata. Node's network transport is restricted in this workspace; the exports were fetched from the same Figma REST API using curl.

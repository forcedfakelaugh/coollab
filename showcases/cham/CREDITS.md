# CHÀM - source credits

Fictional indigo clothing label by Lucas Nguyen. "Chàm" is the Vietnamese word for indigo. Product names, prices and brand are invented for a portfolio demonstration. No real orders, payments, stock or manufacturing claims. Photography is illustrative: it does not show CHÀM products, a CHÀM workshop, or Vietnamese dyeing specifically.

Photographs downloaded from Unsplash on 2026-10-26, subject to the Unsplash license (https://unsplash.com/license):

- `assets/hero.jpg` - indigo cloths drying on a line, by Dimaz Fakhruddin - https://unsplash.com/photos/Pz8O67wagn0
- `assets/jacket.jpg` - denim work jacket on a hanger, by Logan Weaver (@LGNWVR) - https://unsplash.com/photos/7LF_C4xkogA
- `assets/set.jpg` - dark blue outfit with leaf embroidery, by IMANA - https://unsplash.com/photos/1yuBIFIxBYI
- `assets/scarf.jpg` - blue and white patterned fabric on a wooden frame, by mark wang - https://unsplash.com/photos/dncixQiSJuM
- `assets/cloth.jpg` - dark blue pleated fabric, by Tim Mossholder - https://unsplash.com/photos/91PGEPmwT60
- `assets/dye-vat.jpg` - worker dyeing fabric in a workshop, by C Cai - https://unsplash.com/photos/yMg8G-s7TfM

## Product illustrations

The storefront now uses `assets/jacket-editorial.jpg`, `assets/set-editorial.jpg`, `assets/scarf-editorial.jpg`, and `assets/wrap-editorial.jpg`, generated with the built-in OpenAI image-generation tool on 2026-10-26. These are fictional product illustrations, with consistent overhead compositions, warm ecru backgrounds, and diffused daylight. They do not depict real products or substantiate any manufacturing claim. The exact prompts are in [assets/IMAGE-PROMPTS.md](assets/IMAGE-PROMPTS.md).

## Hero illustration

`assets/hero-daylight.jpg` was generated with the built-in OpenAI image-generation tool on 2026-10-26. Four indigo cotton panels dry in a bright, sunlit courtyard with a warm limewashed wall. This is a fictional illustrative scene, not a real workshop or a claim about its location. It replaces the darker hero photograph in the showcase and its portfolio preview. The prompt is recorded in [assets/IMAGE-PROMPTS.md](assets/IMAGE-PROMPTS.md).

The original Unsplash hero and product photographs above are retained as earlier assets; the workshop photograph and cloth texture are still used. The workshop photograph does not establish a Vietnamese location.

Fonts: Newsreader and Archivo served by Google Fonts, with local system fallbacks. The favicon is original SVG artwork.

## Scope

Dependency-free HTML, CSS and JavaScript. Editorial layout with a scroll-driven background that moves from warm ecru to deep indigo. Text tones adapt to keep at least 4.5:1 contrast against that background. Reduced-motion mode retains the warm background. A responsive collection grid and a local fabric swatch whose illustrative shade changes with the dip slider. Accessible native product dialogs, size selection, bag quantity edits/removal, calculated USD subtotal and explicitly simulated checkout. Bag state is held in memory and resets on refresh. No external APIs, backend, accounts or payment collection.

Validation on 2026-10-26: `npm run check`, `npm run build`, and `git diff --check`. Chrome browser checks covered VI/EN at 320, 390, 768, 1024 and 1440 px; collection anchors; all four product dialogs; size selection; bag quantities/removal and language persistence; simulated checkout; slider keyboard controls; reduced-motion behavior; and body/secondary/hero text contrast at 41 scroll positions (minimum measured 4.50089:1). This is desktop browser viewport testing, not physical-device testing.

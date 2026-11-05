# Lento

An interactive lighting website concept by Lucas Nguyen. Lento is a portfolio presentation, not a store or a claim to have designed the featured third-party lamp model.

- Art direction, copy, desktop geometry, studio lighting, interactive material setup, fallback illustration and scroll choreography were created for this showcase.
- Oryzo by Lusion (https://oryzo.ai/) informed the idea of a continuous, product-centred scroll story. No Oryzo code, models, textures, artwork or branding are used.
- Three.js 0.170.0 and its GLTFLoader/BufferGeometryUtils modules are vendored locally from the published npm package. Import paths are adjusted for local modules. MIT license retained in `vendor/LICENSE-three.txt`. The scene has no runtime model, texture or library requests to third-party hosts.
- DM Sans is loaded from Google Fonts under the SIL Open Font License.
- This uses real-time mesh rendering, not Gaussian splatting. The beveled desktop is generated in `app.js`; the lamp and notebook are imported glTF models.

## Detailed assets

The following Poly Haven assets are released under [CC0](https://polyhaven.com/license). Original artists are credited here even though attribution is optional. Downloaded 2026-10-27; each model's original file checksums were verified against the Poly Haven API metadata.

| Local asset | Source / artist | Adaptation |
| --- | --- | --- |
| `assets/desk-lamp.glb` | [Desk Lamp Arm 01](https://polyhaven.com/a/desk_lamp_arm_01), Kuutti Siitonen (modeling/texturing), Yann Kervran (original Blender rig) | 26K-triangle glTF with 1K PBR textures, packed as a 2,874,380-byte GLB. Shared images deduplicated. The web model uses the static pose; a shader recolors orange paint while retaining steel, scratches and labels. |
| `assets/notebook.glb` | [Binder Notebook](https://polyhaven.com/a/binder_notebook), DaDrood | Closed variant selected; glTF and 1K PBR textures packed into one GLB; scene scale and placement adjusted. |
| `assets/stone-*.jpg` | [Marble 01](https://polyhaven.com/a/marble_01), Rob Tuytel | Original 2K color, normal and roughness maps for desktop; derived `stone-*-mobile.jpg` copies resized to 1K with macOS `sips`. UVs select the same slab area without grout. |

The original assets and surface maps total approximately 6.7 MB. Models load asynchronously with simple local geometry as a fallback; their textures are embedded, with no external fetches. The lamp is revealed only after its first frame has been rendered in the current scroll pose. A transparent 800 × 800 WebP poster (`assets/lamp-poster.webp`, approximately 33 KB) was exported from this local Three.js scene with the same model, materials, lighting and opening angle. It holds the opening composition while the model loads, with a localized loading status, then crossfades into the live canvas after models, surface textures and shader programs are prepared, including the hidden depth pass used during fades. It is a rendered asset, not an AI-generated image. The fallback SVG appears only if 3D fails or JavaScript is disabled. It is a stylized articulated-lamp illustration, not an image provided by the asset authors. The listing thumbnail, `assets/preview.png`, is a centered 1280 × 800 render of the actual 3D scene on a warm background.

Mobile and coarse-pointer devices load derived `desk-lamp-mobile.glb` and `notebook-mobile.glb` models: 9,402 and 3,837 triangles, with 512px textures, totaling 794,712 bytes instead of 4,762,524 bytes. These were generated from the original local models using glTF Transform 4.5.1: `weld`, then `simplify` (lamp ratio 0.35/error 0.001; notebook ratio 0.15/error 0.002), then `resize` to a maximum of 512 × 512. Material names, paint recoloring, model transforms and the clamp placement are retained. Desktop uses the original models.

Mobile stone maps total 324,302 bytes instead of 1,960,157 bytes (83.5% smaller), with one quarter of the original texture pixels. Models and surface maps together total 1,119,014 bytes on mobile. Original maps remain unchanged for desktop.

## Listing image refresh

The cards now use `assets/preview-studio.webp`, an AI-enhanced studio interpretation of the original scene render, created with the built-in image generation tool on 2026-10-29. It retains the orange articulated lamp and notebook while adding directional daylight, richer material detail and a larger stone tabletop. This is illustrative cover artwork, not a screenshot of the live WebGL lighting. The original `assets/preview.png` and the real-time scene assets remain available. The exact generation prompt and the capture details for the Orbit and Halyard thumbnails are recorded in [thumbnail notes](../../assets/thumbnail-notes.md).

## Interaction and fallback

The same canvas stays pinned through four scroll chapters on desktop and mobile. The opening uses an oversized Lento wordmark, a softly gridded studio backdrop and the complete mounted lamp. As visitors scroll, the opening copy clears, the background darkens, the desktop and notebook fade, and the camera framing moves toward the reflector. The next headline enters after the opening has cleared. The view then moves into the detail study and rotates the mounted assembly into the finish, brightness and angle configurator. The detail study shows the complete assembly and all three descriptions on both desktop and mobile. On phones, the assembly fits the measured space between the heading and the description list. A warm spotlight targets the desk, while the configurator softens the studio lighting; brightness controls the spotlight, emissive bulb, tabletop glow and background halo together. The complete stage leaves with the end of the story before the closing copy and footer.

Native page scrolling drives the choreography directly; there is no wheel interception or scroll hijacking. Each chapter has an anchor, with separate portrait and landscape framing. Mobile uses a stable small-viewport height so browser-toolbar movement does not change its scroll landmarks. Hidden chapter panels are inert and excluded from the accessibility tree. Copy, controls, metadata and dynamic labels support the portfolio's VI/EN preference.

Mobile lamp poses follow scroll distance linearly within each transition, while text and lighting retain their softer fades. The complete assembly is the camera endpoint for the third chapter and the starting point for the final transition. Mobile shadow updates keep a stable 30 Hz deadline rather than restarting the interval from each rounded frame timestamp.

Reduced motion switches directly between chapter compositions without animated zoom, rotation or text travel. Without JavaScript or WebGL, all chapters return to normal document flow with local still illustrations. A WebGL failure disables visual controls; a no-JavaScript preview hides them. Original anchor navigation remains available in either fallback.

Mobile and coarse-pointer rendering caps pixel ratio at 1.25, anisotropy at 2, and shadow maps at 512px while retaining antialiasing and the smaller local models. One WebGL canvas renders on scroll, input, resize or asset completion on mobile, then stops once transitions, pending shadows and a short gesture grace period settle, including in landscape. Passive touch-start and touch-move listeners wake the loop before the first scroll event; gesture events keep it running for another 180 ms, and idle time is excluded from animation interpolation. During rotation, mobile shadows update at up to 30 Hz, with immediate updates when models or shadow casters change; camera-only, paint and brightness changes reuse the shadow map. The scene itself still renders at the browser's animation-frame cadence. Camera fitting caches the rigid assembly's mesh corners until a model loads, and changing styles are applied only to their affected elements. Desktop pixel ratio is capped at 1.8. Hidden tabs and scenes outside the viewport do not render.

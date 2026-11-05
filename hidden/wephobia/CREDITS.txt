# WEPHOBIA collection concept

Independent, uncommissioned website proposal by Lucas Nguyen, prepared 1 November 2026. This demo is not an official WEPHOBIA storefront. Product links open the official website. No transactions, customer data collection, prices, stock claims or discounts are implemented.

All campaign photography, collection names, product names and WEPHOBIA branding belong to their respective owners, including WEPHOBIA. Use here is solely to demonstrate a proposed design to the brand. No transfer or license of these assets is implied. The Vietnamese editorial copy and interface composition are proposed copy, not quotations from WEPHOBIA.

## Official source pages

- https://wephobia.com/en/ (Fall/Winter 2026 campaign and Brenda detail photography)
- https://wephobia.com/en/collection/fw26-look10/ (MARVIN TRENCHCOAT | KHAKI)
- https://wephobia.com/en/collection/fw26-look11/ (MARVIN TRENCHCOAT | BROWN)
- https://wephobia.com/en/collection/fw26-look08/ (BRENDA TRENCHCOAT | TAN and RIAN TROUSERS | BLACK)
- https://wephobia.com/en/collection/fw26-look09/ (editorial lookbook link)

The three interactive looks and their product names/links were verified in the official look pages' HTML. This is a curated selection from the collection, not the complete product catalog. Live price, stock and size information is intentionally left to the official product page.

## Exact image provenance

Downloaded from the public official website on 1 November 2026. Source JPEGs were inspected and converted locally to responsive WebP files. No AI-generated or stock images were used. No image edits beyond resizing, format compression and display cropping were made.

| Local files | Exact original URL | Use |
| --- | --- | --- |
| `assets/hero-800.webp`, `assets/hero-1600.webp`, `assets/preview.webp` | https://wephobia.com/wp-content/uploads/2026/10/Untitled-1-scaled.jpg | Desktop campaign hero and hidden-index preview |
| `assets/look10-480.webp`, `assets/look10-1000.webp` | https://wephobia.com/wp-content/uploads/2026/10/Wephobia2100.jpg | Marvin Trenchcoat, Khaki |
| `assets/look11-480.webp`, `assets/look11-1000.webp` | https://wephobia.com/wp-content/uploads/2026/10/Wephobia2411.jpg | Marvin Trenchcoat, Brown; intentional mobile hero |
| `assets/look08-480.webp`, `assets/look08-1000.webp` | https://wephobia.com/wp-content/uploads/2026/10/Wephobia3053.jpg | Brenda Trenchcoat, Tan with Rian Trousers, Black |
| `assets/look09-480.webp`, `assets/look09-1000.webp` | https://wephobia.com/wp-content/uploads/2026/10/Wephobia3645.jpg | Editorial look 09 |
| `assets/detail-480.webp`, `assets/detail-1000.webp` | https://wephobia.com/wp-content/uploads/2026/10/Wephobia3168.jpg | Brenda Trenchcoat detail |

## Product destinations

- https://wephobia.com/en/product/marvin-trenchcoat-khaki/
- https://wephobia.com/en/product/marvin-trenchcoat-brown/
- https://wephobia.com/en/product/brenda-trenchcoat-tan/
- https://wephobia.com/en/product/rian-trousers-black/

## Design references inspected

- https://www.studionicholson.com/ (1 November 2026): image-led collection entry, restrained navigation and paired campaign photographs. The revised proposal uses an immersive magazine cover, an edge-to-edge diptych and a dark three-column lookbook stage. Its composition and Vietnamese copy are original. No reference-site code, photography or branding was copied.
- https://www.therow.com/ (1 November 2026): separation between collection browsing and individual product detail informed the lightweight look-to-product dialogue.

## Implementation notes

- Buildless HTML, CSS and JavaScript. No external runtime, fonts, analytics, forms or checkout.
- Native modal dialog supports Escape, a sticky close bar, outside click, focus return and keyboard navigation. Look-selector buttons additionally support Left/Right, Home and End.
- Responsive images include a separate portrait composition for the mobile hero. Reduced-motion preference disables smooth scrolling and transitions.
- The proposal is featured on the portfolio homepage. Its original `/hidden/wephobia/` URL is retained for existing links.
- Look images preload as the visitor approaches the lookbook. Switching waits for image decoding, keeps the current look on failure, supports retry, and ignores stale requests. Reduced motion also disables the image transition.
- The refined mobile masthead leaves the portrait unobstructed; a horizontal selector gives the active look the full content width.
- Look switching and the product dialog are functional. Purchase links intentionally leave this proposal for the official website.

## Share preview

`assets/share-preview.webp` is a browser screenshot of this independent proposal, resized to 1200 pixels wide and encoded as WebP. Its brand photographs and logos are the official assets credited above.

## Refinement guidance

The 1 November 2026 refinement follows [Impeccable](https://github.com/pbakaus/impeccable), specifically its polish and craft-floor guidance: preserve the existing visual identity, verify rendered breakpoints, clarify hierarchy, and complete interaction states. The guidance was read directly; no Impeccable runtime or dependencies were installed.

# Design history

How this mark got from "generate 9 options" to the locked spec shipped in `brand/`. Each round links to the actual comparison sheet used to make that decision. Open them directly; they're self-contained HTML.

## 1. Nine options → [`01-nine-options.html`](01-nine-options.html)

Started from one instruction: a serif pilcrow (¶, first initial P), transparent background, spanning midcentury modern, Scandi, industrial, Japanese minimalism themes. Built 9 mono compositions from Source Serif 4, the site's own typeface, by extracting the actual glyph outline via `fontkitten` instead of hand-drawing an approximation.

The 9: `sumi` (bare glyph), `ma` (asymmetric plus a rule), `hanko` (seal ring), `disc` (knockout circle), `misregister` (offset double-print), `frame` (light rounded square), `outline` (stroked contour), `plate` (knockout square), `stencil` (bridge-cut gaps).

Three carried forward: sumi, misregister, plate.

## 2. Fourteen typefaces → [`02-typeface-comparison.html`](02-typeface-comparison.html)

Held those 3 compositions constant and swapped the typeface, to separate what the composition contributes from what the letterform contributes. Source Serif 4 served as the control, tested against Lusitana, Joan, Sedan SC, Manuale, Space Grotesk, Space Mono, Monoton, Dongle, Tilt Neon, Wendy One, Overpass, Overpass Mono, and McLaren. The list deliberately mixed serif, sans, mono, display faces. All 14 turned out to have a real pilcrow glyph, even the display fonts.

Narrowed to Joan, Overpass, Overpass Mono on Plate.

## 3. Finalists and alignment → [`03-finalists-and-alignment.html`](03-finalists-and-alignment.html)

Tested a variant with Joan's glyph enlarged and pushed toward the bottom of the plate. This went through a few corrections worth recording, since they weren't obvious going in.

The first pass centered the bowl (the closed loop) instead of the whole glyph. Wrong anchor, caught and fixed. "Bottom-aligned" was initially a hand-tuned pixel offset reached by trial and error (CY of 60, then 70, then 90). That got refactored into a formula: the entire glyph's own bottom edge, descender included, sits flush with the plate's inner bottom edge. `CY = PLATE_INNER_BOTTOM`, a plain constant, with no margin math needed once you're aligning an edge instead of a center. From that flush baseline, the glyph was pushed further down by a percentage of the plate's inner height rather than another pixel guess, landing on 5%. Glyph size settled at 1.2x the plate's original base size, 66 to 79.2.

Decision: Joan, Plate, glyph at 1.2x, entire glyph bottom-aligned 5% past the plate's inner edge.

## 4. Weight and color → [`04-weight-and-color.html`](04-weight-and-color.html)

Checked whether Joan has a heavier weight to try. It doesn't, confirmed at the source level rather than just noting the published font ships one weight: both `.glyphs` master files in [PaoloBiagini/Joan](https://github.com/PaoloBiagini/Joan) have zero `weightValue` or `axes` definitions, a single master only. So "Bold" here is a faux-weight, a 5px non-scaling stroke added to the plate's cutout glyph, kept as a clearly secondary "goofy" alt-direction rather than a real weight option.

The color set: Mono (`#000`/`#fff`), Accent Blue (`#2c3e63`/`#9ab2e0`, matching the site's existing `--accent`), and Warm Midcentury (`#b8542e`/`#e3a458`, new).

This round also hit and fixed a real bug worth remembering. A `<style>` block inside an inline SVG isn't scoped to that SVG; it cascades to the whole HTML page. With 9 marks sharing the class `.mk`, the last `<style>.mk{fill:...}</style>` in the DOM won for every mark on the page, which is why an early version of this sheet rendered every color as the same warm tone. Fixed by setting `fill` as a direct attribute per instance instead of relying on a shared class.

## 5. Composition comparison → [`05-composition-comparison.html`](05-composition-comparison.html)

Compared plate against sumi and misregister at the final size and color. First pass transplanted plate's exact placement onto them; that got reverted so each composition kept its own original centering, since sumi and misregister were never meant to share plate's alignment treatment. Sumi and misregister were scaled to 1.33x their own original base sizes purely for size reference; that scaling was never shipped.

Plate won. Regular weight, all 3 colors kept; none discarded.

## Final spec

| | |
|---|---|
| Composition | Plate |
| Typeface | Joan (Regular, the only weight that exists) |
| Size | 79.2 (66 x 1.2) |
| Vertical placement | Entire glyph bottom-aligned, `CY = PLATE_INNER_BOTTOM + 0.05 x PLATE_INNER_HEIGHT`, about 123.4 |
| Horizontal placement | Centered on the full glyph bbox, unchanged throughout |
| Colors | Mono, Accent Blue, Warm Midcentury; see `brand/palette/` |
| Alt direction | Bold-faux ("goofy"), `brand/marks/goofy/`, not part of the primary size/format matrix |

All of this is reproducible from source. See `scripts/` and the root `README.md`.

# pilcrow

A serif pilcrow (¶), knocked out of a square plate and built from [Joan](https://github.com/PaoloBiagini/Joan) (OFL); doubles as a first initial. The full design history and reasoning behind every number in this repo lives in `history/HISTORY.md`.

## What's here

`brand/marks/` holds the mark in 3 colors as SVG, each flipping light and dark automatically via `prefers-color-scheme`. `brand/marks/png/` holds flattened PNGs at 16/32/48/180/512/1024, one file per color per mode (`pilcrow-{color}-{mode}-{size}.png`), since a static PNG can't carry a media query the way an SVG can.

`brand/marks/goofy/` is a faux-bold alt-direction. Joan has no real bold anywhere in its source, so this is a stroke-thickened variant, kept separate from the primary size matrix and not meant to substitute for it.

`brand/favicon/` has `favicon.svg`, `favicon.ico` (16/32/48), and `apple-touch-icon.png`, ready to drop into a site. `brand/palette/` has `palette.json` and a matching `palette.html`, covering both the site's existing color palette and the two brand accent colors introduced for this mark. `history/` has the actual comparison sheets used at each decision point along with the written account of how they led here.

## Usage guidelines

Keep the mark at 24px or larger; below that the plate's knockout starts to fill in and lose its shape. Give it clear space on every side roughly equal to the plate's own corner radius, about 5% of the mark's width. Mono works on any background because it follows system theme. Accent Blue and Warm Midcentury are each two fixed colors rather than theme-reactive on their own, so pick whichever of the two reads against the background in question. Avoid stretching the mark non-uniformly, recoloring it outside this palette, or using the goofy variant anywhere the primary mark is expected, such as profile photos, favicons, or official materials.

## Build from source

```sh
npm install
npm run build
```

That single command runs the pipeline in order: fetch → marks → raster → favicon → palette. Each step can also run on its own: `npm run fetch`, `build:marks`, `build:raster`, `build:favicon`, `build:palette`. The font is pulled fresh from [PaoloBiagini/Joan](https://github.com/PaoloBiagini/Joan) on GitHub on every build rather than committed to the repo; `history/HISTORY.md` explains why GitHub was chosen over Google Fonts as the source.

Every locked number, glyph size, vertical position, stroke width, and hex value, lives as a named constant in `scripts/mark-spec.mjs` and `scripts/plate-geometry.mjs` rather than as a magic literal buried in the generation code.

## License

The glyph outline in `brand/marks/` derives from [Joan](https://github.com/PaoloBiagini/Joan) by Paolo Biagini, licensed [OFL 1.1](https://openfontlicense.org/). The font itself is never redistributed here; `scripts/fetch-joan.mjs` pulls it fresh from upstream at build time.

This repo splits licensing between the mark and the code that generates it:

| Path                                 | License                                                                           |
| ------------------------------------ | --------------------------------------------------------------------------------- |
| `brand/`, `history/`, `preview.html` | [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) (`LICENSE`) |
| `scripts/`, `tests/`, config files   | MIT (`LICENSE-CODE`)                                                              |

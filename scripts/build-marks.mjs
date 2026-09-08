// Final brandmark SVGs: the primary mark (Plate / Joan / Regular, the
// decided spec) in 3 colors, plus the "goofy" faux-bold alt-direction in
// the same 3 colors, kept in a clearly separate folder. See
// history/HISTORY.md for how these numbers were arrived at.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { optimize } from 'svgo';
import { loadPilcrow, placeBottomAligned } from './glyph-utils.mjs';
import { PLATE_X, PLATE_Y, PLATE_SIZE } from './plate-geometry.mjs';
import { SIZE, CY, COLORS, GOOFY_STROKE_WIDTH } from './mark-spec.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const FONT_PATH = path.join(ROOT, 'fonts', 'joan-regular.ttf');
const SVG_DIR = path.join(ROOT, 'brand', 'marks');
const GOOFY_DIR = path.join(ROOT, 'brand', 'marks', 'goofy');

mkdirSync(SVG_DIR, { recursive: true });
mkdirSync(GOOFY_DIR, { recursive: true });

const { d, fullBbox } = loadPilcrow(FONT_PATH);
const transform = placeBottomAligned({ fullBbox, size: SIZE, cy: CY });

// Goofy alt uses the same placement, thickened with a non-scaling stroke
// since Joan has no real bold anywhere in its source (verified: no
// weightValue/axes definitions in either .glyphs master file — single
// master only). GOOFY_STROKE_WIDTH and COLORS live in mark-spec.mjs so
// other scripts (build-raster.mjs) can import them without re-running
// this file's generation side effects.

function plateSvg({ colorKey, light, dark, strokeWidth = 0 }) {
  const maskId = `m-pilcrow-${colorKey}${strokeWidth ? '-bold' : ''}`;
  const glyphMarkup = strokeWidth
    ? `<path d="${d}" fill="#000" stroke="#000" stroke-width="${strokeWidth}" vector-effect="non-scaling-stroke"/>`
    : `<path d="${d}" fill="#000"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<mask id="${maskId}">
<rect width="128" height="128" fill="#fff"/>
<g transform="${transform}">${glyphMarkup}</g>
</mask>
<rect class="mk" x="${PLATE_X}" y="${PLATE_Y}" width="${PLATE_SIZE}" height="${PLATE_SIZE}" rx="6" mask="url(#${maskId})"/>
<style>.mk{fill:${light}}
@media (prefers-color-scheme: dark){.mk{fill:${dark}}}</style>
</svg>`;
}

const svgoConfig = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      // inlineStyles collapses the .mk class into a static presentation
      // attribute and deletes the <style> block — silently destroying the
      // prefers-color-scheme rule. Must stay off.
      params: { overrides: { cleanupIds: false, inlineStyles: false } },
    },
    { name: 'removeViewBox', active: false },
  ],
};

function write(filePath, raw) {
  const { data } = optimize(raw, svgoConfig);
  writeFileSync(filePath, data);
  console.log(`wrote ${path.relative(ROOT, filePath)}`);
}

for (const c of COLORS) {
  write(path.join(SVG_DIR, `pilcrow-${c.key}.svg`), plateSvg({ colorKey: c.key, light: c.light, dark: c.dark }));
  write(
    path.join(GOOFY_DIR, `pilcrow-bold-${c.key}.svg`),
    plateSvg({ colorKey: c.key, light: c.light, dark: c.dark, strokeWidth: GOOFY_STROKE_WIDTH })
  );
}

console.log(`\nSIZE=${SIZE}, CY=${CY.toFixed(2)}`);

// Rasterizes the primary mark (not goofy — that stays SVG-only, per the
// decision to keep it a lightweight side-direction rather than part of
// the shipped size/format matrix) to PNG at multiple sizes, one per
// color x light/dark, since PNGs can't carry a prefers-color-scheme rule.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { COLORS } from './mark-spec.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SVG_DIR = path.join(ROOT, 'brand', 'marks', 'svg');
const PNG_DIR = path.join(ROOT, 'brand', 'marks', 'png');

// 16/32/48: favicon. 64/128: small UI use. 180: apple-touch-icon exact
// size. 192/512: Android/PWA manifest icons. 256/1024: general/print use.
export const SIZES = [16, 32, 48, 64, 128, 180, 192, 256, 512, 1024];

function forceColor(svgRaw, color) {
  return svgRaw.replace(/<style>.*?<\/style>/s, '').replaceAll('class="mk"', `class="mk" fill="${color}"`);
}

for (const c of COLORS) {
  const svgRaw = readFileSync(path.join(SVG_DIR, `pilcrow-${c.key}.svg`), 'utf8');
  const lightSvg = Buffer.from(forceColor(svgRaw, c.light));
  const darkSvg = Buffer.from(forceColor(svgRaw, c.dark));

  for (const size of SIZES) {
    const dir = path.join(PNG_DIR, String(size));
    mkdirSync(dir, { recursive: true });

    for (const [mode, buf] of [
      ['light', lightSvg],
      ['dark', darkSvg],
    ]) {
      const outPath = path.join(dir, `pilcrow-${c.key}-${mode}.png`);
      // sharp/libvips rasterizes SVGs natively at the requested output
      // size (verified: not a fixed-size raster then upscaled), so a
      // manual density hint isn't needed.
      await sharp(buf).resize(size, size).png().toFile(outPath);
    }
  }
  console.log(`rasterized ${c.key} across ${SIZES.length} sizes x 2 modes`);
}

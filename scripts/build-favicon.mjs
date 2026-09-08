// Builds favicon.svg, favicon.ico (16/32/48, PNG-in-ICO — supported by
// every browser and OS since Vista/IE9), and the apple-touch-icon, all
// mono (matches perrwa.github.io's existing public/favicon.svg
// convention). ICO has no library on npm worth adding for this — the
// container format is ~20 lines to write by hand.
import { readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SVG_DIR = path.join(ROOT, 'brand', 'marks');
const PNG_DIR = path.join(ROOT, 'brand', 'marks', 'png');
const FAVICON_DIR = path.join(ROOT, 'brand', 'favicon');
const PALETTE_PATH = path.join(ROOT, 'brand', 'palette', 'palette.json');

mkdirSync(FAVICON_DIR, { recursive: true });

// favicon.svg: identical to the mono mark.
copyFileSync(path.join(SVG_DIR, 'pilcrow-mono.svg'), path.join(FAVICON_DIR, 'favicon.svg'));

// apple-touch-icon.png: the 180 mono-light PNG, flattened onto the site's
// light background. The source PNG has an opaque plate but a transparent
// glyph and transparent corners (outside the plate's border-radius) — iOS
// composites icon alpha over black, so left transparent this renders as a
// solid black tile with the pilcrow invisible. Flattening bakes in the
// site's actual background so the mark stays visible.
const { site } = JSON.parse(readFileSync(PALETTE_PATH, 'utf8'));
const [r, g, b] = site.bg.light.match(/\d+/g).map(Number);
await sharp(path.join(PNG_DIR, 'pilcrow-mono-light-180.png'))
  .flatten({ background: { r, g, b } })
  .png()
  .toFile(path.join(FAVICON_DIR, 'apple-touch-icon.png'));

// favicon.ico: ICONDIR header (6B) + one ICONDIRENTRY (16B) per image,
// followed by each image's raw PNG bytes. Modern ICO readers accept PNG
// payloads directly (no need to encode as legacy BMP/DIB).
const ICO_SIZES = [16, 32, 48];

function buildIco(pngBuffers) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = icon
  header.writeUInt16LE(count, 4);

  const dirEntries = [];
  const imageData = [];
  let offset = 6 + count * 16;

  for (const { size, buf } of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 = 256)
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height (0 = 256)
    entry.writeUInt8(0, 2); // color count (0 = no palette)
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buf.length, 8); // data size
    entry.writeUInt32LE(offset, 12); // data offset
    dirEntries.push(entry);
    imageData.push(buf);
    offset += buf.length;
  }

  return Buffer.concat([header, ...dirEntries, ...imageData]);
}

const pngBuffers = [];
for (const size of ICO_SIZES) {
  const buf = readFileSync(path.join(PNG_DIR, `pilcrow-mono-light-${size}.png`));
  pngBuffers.push({ size, buf });
}

const ico = buildIco(pngBuffers);
const icoPath = path.join(FAVICON_DIR, 'favicon.ico');
writeFileSync(icoPath, ico);
console.log(`wrote favicon.svg, apple-touch-icon.png, favicon.ico (${ICO_SIZES.join('/')})`);

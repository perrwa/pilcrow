// Shared pilcrow glyph loading + bowl/stem separation + bowl-anchored
// placement math, used by the plate variant generators.
import { readFileSync } from 'node:fs';
import { create } from 'fontkitten';

const PILCROW = 0x00b6;

// A pilcrow's two contours: the bowl (closed loop, sits above the
// baseline) and the stem (spans ascender to descender). The bowl is
// reliably the shorter of the two.
function findBowlBbox(commands) {
  const subpaths = [];
  let cur = [];
  for (const c of commands) {
    if (c.command === 'moveTo' && cur.length) {
      subpaths.push(cur);
      cur = [];
    }
    cur.push(c);
  }
  if (cur.length) subpaths.push(cur);

  const bboxes = subpaths.map((sp) => {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    for (const c of sp) {
      for (let k = 0; k < c.args.length; k += 2) {
        const x = c.args[k];
        const y = c.args[k + 1];
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
    return { minX, minY, maxX, maxY, h: maxY - minY };
  });
  return bboxes.reduce((a, b) => (a.h < b.h ? a : b));
}

export function loadPilcrow(ttfPath) {
  const font = create(readFileSync(ttfPath));
  const glyph = font.glyphForCodePoint(PILCROW);
  return {
    d: glyph.path.toSVG(),
    fullBbox: glyph.path.bbox,
    bowlBbox: findBowlBbox(glyph.path.commands),
  };
}

// Scale factor place() would use to render this glyph at `size` (its
// longer full-glyph dimension mapped to `size`).
export function scaleFor(fullBbox, size) {
  const w = fullBbox.maxX - fullBbox.minX;
  const h = fullBbox.maxY - fullBbox.minY;
  return size / Math.max(w, h);
}

// The bowl's rendered height on canvas, at the given scale — half of this
// is the margin needed on each side to keep the bowl (not the stem) fully
// inside a container when centering or bottom-aligning on it.
export function bowlHalfHeightOnCanvas(bowlBbox, scale) {
  return ((bowlBbox.maxY - bowlBbox.minY) * scale) / 2;
}

// Horizontal centering always uses the FULL glyph's bbox; vertical
// centering uses the bowl's. This is what lets the bowl (not the whole
// glyph, descender included) be the thing that's centered or aligned,
// while horizontal placement stays exactly what place() would produce.
export function placeBowlAnchored({ fullBbox, bowlBbox, size, cx = 64, cy = 64 }) {
  const s = scaleFor(fullBbox, size);
  const centerX = (fullBbox.minX + fullBbox.maxX) / 2;
  const centerYBowl = (bowlBbox.minY + bowlBbox.maxY) / 2;
  return `translate(${cx} ${cy}) scale(${s} ${-s}) translate(${-centerX} ${-centerYBowl})`;
}

// Centers the full glyph bbox on both axes — the original round-1/round-2
// place() used by sumi and misregister. Kept here too so every composition
// that needs "just center the whole glyph" shares one implementation.
export function placeCentered({ fullBbox, size, cx = 64, cy = 64 }) {
  const s = scaleFor(fullBbox, size);
  const centerX = (fullBbox.minX + fullBbox.maxX) / 2;
  const centerY = (fullBbox.minY + fullBbox.maxY) / 2;
  return `translate(${cx} ${cy}) scale(${s} ${-s}) translate(${-centerX} ${-centerY})`;
}

// Horizontal centering still uses the FULL glyph's bbox (unchanged from
// placeBowlAnchored). Vertical anchors on the full glyph's own BOTTOM edge
// (its lowest point in font space — the stem's descender, not the bowl) —
// so `cy` is exactly where that bottom edge lands on canvas. Aligning an
// edge needs no half-height math: pass a plate/canvas constant directly
// (e.g. PLATE_INNER_BOTTOM) for a flush, zero-margin bottom-align.
export function placeBottomAligned({ fullBbox, size, cx = 64, cy = 64 }) {
  const s = scaleFor(fullBbox, size);
  const centerX = (fullBbox.minX + fullBbox.maxX) / 2;
  return `translate(${cx} ${cy}) scale(${s} ${-s}) translate(${-centerX} ${-fullBbox.minY})`;
}

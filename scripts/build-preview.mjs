// Generates the root preview.html: a single-page visual index of
// everything in brand/, so opening the repo shows the whole brandmark at
// a glance without needing to open individual files.
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { COLORS, GOOFY_STROKE_WIDTH, SIZES } from './mark-spec.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

function forceColor(svgRaw, color) {
  return svgRaw
    .replace(/<style>.*?<\/style>/s, '')
    .replaceAll('class="mk"', `class="mk" fill="${color}"`);
}

function markCell(label, svgPath, light, dark) {
  const svgRaw = readFileSync(svgPath, 'utf8');
  return `<div class="cell">
    <div class="swatches">
      <div class="swatch light">${forceColor(svgRaw, light)}</div>
      <div class="swatch dark">${forceColor(svgRaw, dark)}</div>
    </div>
    <span class="label">${label}</span>
  </div>`;
}

const primaryCells = COLORS.map((c) =>
  markCell(c.label, path.join(ROOT, 'brand/marks', `pilcrow-${c.key}.svg`), c.light, c.dark),
).join('\n');

const goofyCells = COLORS.map((c) =>
  markCell(
    c.label,
    path.join(ROOT, 'brand/marks/goofy', `pilcrow-bold-${c.key}.svg`),
    c.light,
    c.dark,
  ),
).join('\n');

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Pilcrow Preview</title>
<style>
  :root {
    --bg: #f5f3ef; --panel: #fff; --ink: #1a1612; --ink-soft: #706860; --border: #ded6ca; --accent: #2c3e63;
    --serif: Charter, Georgia, 'Times New Roman', serif;
    --mono: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    color-scheme: light dark;
  }
  @media (prefers-color-scheme: dark) {
    :root { --bg: #14120f; --panel: #1e1b17; --ink: #e8e2d7; --ink-soft: #96897d; --border: #332e27; --accent: #9ab2e0; }
  }
  * { box-sizing: border-box; }
  body { background: var(--bg); color: var(--ink); font-family: var(--serif); margin: 0; padding: 2.5rem 1.5rem 4rem; }
  header { max-width: 1000px; margin: 0 auto 2rem; }
  h1 { font-size: 1.9rem; margin: 0 0 0.3rem; }
  h2 { max-width: 1000px; margin: 2.5rem auto 1rem; font-size: 1.15rem; border-bottom: 1px solid var(--border); padding-bottom: 0.4rem; }
  p.lede { color: var(--ink-soft); font-size: 0.9rem; max-width: 70ch; margin: 0; }
  .row { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
  .cell { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 1rem; display: flex; flex-direction: column; align-items: center; }
  .swatches { display: flex; gap: 0.6rem; margin-bottom: 0.7rem; width: 100%; }
  .swatch { flex: 1; height: 100px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
  .swatch.light { background: #fdfcfa; }
  .swatch.dark { background: #14120f; }
  .swatch svg { width: 76px; height: 76px; }
  .label { font-size: 0.85rem; font-weight: 600; }
  .links { max-width: 1000px; margin: 0 auto; }
  .links ul { padding-left: 1.2rem; line-height: 1.8; }
  .links a { color: var(--accent); }
  .favicon-strip { max-width: 1000px; margin: 0 auto; display: flex; align-items: center; gap: 1.5rem; background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 1.2rem; }
  .favicon-strip img { image-rendering: pixelated; }
</style>
</head>
<body>
<header>
  <h1>Pilcrow</h1>
  <p class="lede">Joan, Plate, Regular. Full spec and how it was decided: <a href="history/HISTORY.md">history/HISTORY.md</a>.</p>
</header>

<h2>Primary mark</h2>
<div class="row">
${primaryCells}
</div>

<h2>Favicon</h2>
<div class="favicon-strip">
  <img src="brand/favicon/favicon.ico" width="48" height="48" alt="favicon.ico">
  <img src="brand/favicon/apple-touch-icon.png" width="60" height="60" alt="apple-touch-icon">
  <span style="color:var(--ink-soft); font-size:0.85rem;">brand/favicon/ &mdash; favicon.svg, favicon.ico (16/32/48), apple-touch-icon.png</span>
</div>

<h2>Goofy alt (faux-bold, +${GOOFY_STROKE_WIDTH}px stroke)</h2>
<div class="row">
${goofyCells}
</div>

<h2>More</h2>
<div class="links">
  <ul>
    <li><a href="brand/palette/palette.html">Brand palette</a> &mdash; site colors + Accent Blue + Warm Midcentury</li>
    <li><a href="brand/marks/png/">Raster exports</a> &mdash; ${SIZES.length} sizes &times; 3 colors &times; light/dark</li>
    <li><a href="history/HISTORY.md">Design history</a> &mdash; how this mark was decided, round by round</li>
  </ul>
</div>
</body>
</html>
`;

writeFileSync(path.join(ROOT, 'preview.html'), html);
console.log('wrote preview.html');

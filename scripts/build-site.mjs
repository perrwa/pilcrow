// Assembles dist/: the deployed GitHub Pages site. index.html is the old
// preview.html (primary mark, favicon, goofy alt, palette/raster links)
// with the design history appended, rendered from history/HISTORY.md.
// Everything else in dist/ is a straight copy of brand/ and history/, so
// every link on the page resolves once served from dist/.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import { COLORS, GOOFY_STROKE_WIDTH, SIZES } from './mark-spec.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
cpSync(path.join(ROOT, 'brand'), path.join(DIST, 'brand'), { recursive: true });
cpSync(path.join(ROOT, 'history'), path.join(DIST, 'history'), { recursive: true });

function forceColor(svgRaw, color) {
  return svgRaw
    .replace(/<style>.*?<\/style>/s, '')
    .replaceAll('class="mk"', `class="mk" fill="${color}"`);
}

const STYLE = `
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
  .prose { max-width: 1000px; margin: 0 auto; }
  .prose h2 { margin-top: 2rem; }
  .prose p, .prose ul { line-height: 1.6; }
  .prose code { font-family: var(--mono); font-size: 0.85em; background: var(--panel); border: 1px solid var(--border); border-radius: 4px; padding: 0.1em 0.35em; }
  .prose a { color: var(--accent); }
  .prose table { border-collapse: collapse; margin: 1rem 0; }
  .prose th, .prose td { border: 1px solid var(--border); padding: 0.4rem 0.8rem; text-align: left; font-size: 0.9rem; }
  .prose th { background: var(--panel); }
`;

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

// history/HISTORY.md's own h1 becomes an h2 here, so the page keeps a
// single h1 (the site title above). Its links to the round sheets
// (`01-nine-options.html`, relative to history/HISTORY.md itself) need a
// `history/` prefix once embedded in index.html at dist's root.
const historyMd = readFileSync(path.join(ROOT, 'history/HISTORY.md'), 'utf8')
  .replace(/^# /, '## ')
  .replace(/\]\((\d\d-[\w-]+\.html)\)/g, '](history/$1)');
const historyHtml = marked.parse(historyMd);

const headerMark = readFileSync(path.join(ROOT, 'brand/marks/pilcrow-accent.svg'), 'utf8');

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Pilcrow</title>
<style>${STYLE}</style>
</head>
<body>
<header>
  <div style="width:64px;height:64px;">${headerMark}</div>
  <h1>Pilcrow</h1>
  <p class="lede">A serif pilcrow (&para;), knocked out of a square plate, built from <a href="https://github.com/PaoloBiagini/Joan">Joan</a> (OFL). Doubles as a first initial. Source: <a href="https://github.com/perrwa/pilcrow">github.com/perrwa/pilcrow</a>.</p>
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
  </ul>
</div>

<div class="prose">
${historyHtml}
</div>
</body>
</html>
`;

writeFileSync(path.join(DIST, 'index.html'), html);
console.log('wrote dist/index.html');

// brand/marks/png/ has no autoindex on Pages, so a contact sheet stands
// in for directory listing.
function pngRow(c) {
  const cells = SIZES.map(
    (size) => `<td>
      <div class="png-pair">
        <img src="pilcrow-${c.key}-light-${size}.png" width="${Math.min(size, 64)}" height="${Math.min(size, 64)}" alt="${c.label} light ${size}px">
        <img src="pilcrow-${c.key}-dark-${size}.png" width="${Math.min(size, 64)}" height="${Math.min(size, 64)}" alt="${c.label} dark ${size}px">
      </div>
      <span class="size-label">${size}px</span>
    </td>`,
  ).join('\n');
  return `<tr><th>${c.label}</th>${cells}</tr>`;
}

const pngHtml = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Pilcrow Raster Exports</title>
<style>${STYLE}
  table { border-collapse: collapse; max-width: 1000px; margin: 0 auto; }
  th, td { border: 1px solid var(--border); padding: 0.8rem; text-align: center; vertical-align: middle; }
  th { background: var(--panel); text-align: left; }
  .png-pair { display: flex; gap: 0.4rem; justify-content: center; align-items: center; }
  .png-pair img:first-child { background: #fdfcfa; }
  .png-pair img:last-child { background: #14120f; }
  .size-label { display: block; font-size: 0.72rem; color: var(--ink-soft); margin-top: 0.3rem; }
</style>
</head>
<body>
<header>
  <h1>Pilcrow Raster Exports</h1>
  <p class="lede">Left image is light mode, right is dark mode. Source SVGs: <a href="../pilcrow-accent.svg">brand/marks/</a>.</p>
</header>
<table>
${COLORS.map(pngRow).join('\n')}
</table>
</body>
</html>
`;

writeFileSync(path.join(DIST, 'brand/marks/png/index.html'), pngHtml);
console.log('wrote dist/brand/marks/png/index.html');

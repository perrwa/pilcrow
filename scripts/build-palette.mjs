// Writes both palette.json and palette.html from the single source of
// truth in palette-data.mjs, so the two can never drift from each other.
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_PALETTE, BRAND_PALETTE } from './palette-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PALETTE_DIR = path.join(__dirname, '..', 'brand', 'palette');
mkdirSync(PALETTE_DIR, { recursive: true });

writeFileSync(
  path.join(PALETTE_DIR, 'palette.json'),
  JSON.stringify({ site: SITE_PALETTE, brand: BRAND_PALETTE }, null, 2) + '\n',
);

function titleCase(key) {
  return key.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function swatch(name, tokens) {
  const note = tokens.note ? `<span class="note">${tokens.note}</span>` : '';
  return `<div class="swatch">
    <div class="chips">
      <div class="chip" style="background:${tokens.light}"></div>
      <div class="chip" style="background:${tokens.dark}"></div>
    </div>
    <div class="label">
      <span class="name">${titleCase(name)}</span>
      <span class="values"><code>${tokens.light}</code> / <code>${tokens.dark}</code></span>
      ${note}
    </div>
  </div>`;
}

const siteSwatches = Object.entries(SITE_PALETTE)
  .filter(([key]) => key !== '_source')
  .map(([key, tokens]) => swatch(key, tokens))
  .join('\n');

const brandSwatches = Object.entries(BRAND_PALETTE)
  .map(([key, tokens]) => swatch(key, tokens))
  .join('\n');

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Pilcrow Brand Palette</title>
<style>
  :root {
    --bg: #f5f3ef; --panel: #fff; --ink: #1a1612; --ink-soft: #706860; --border: #ded6ca;
    --mono: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    --serif: Charter, Georgia, 'Times New Roman', serif;
    color-scheme: light dark;
  }
  @media (prefers-color-scheme: dark) {
    :root { --bg: #14120f; --panel: #1e1b17; --ink: #e8e2d7; --ink-soft: #96897d; --border: #332e27; }
  }
  * { box-sizing: border-box; }
  body { background: var(--bg); color: var(--ink); font-family: var(--serif); margin: 0; padding: 2.5rem 1.5rem 4rem; }
  header { max-width: 960px; margin: 0 auto 2rem; }
  h1 { font-size: 1.7rem; margin: 0 0 0.3rem; }
  h2 { font-size: 1.1rem; margin: 2rem auto 0.8rem; max-width: 960px; border-bottom: 1px solid var(--border); padding-bottom: 0.4rem; }
  p.lede { color: var(--ink-soft); font-size: 0.9rem; margin: 0; max-width: 70ch; }
  .grid { max-width: 960px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 0.8rem; }
  .swatch { background: var(--panel); border: 1px solid var(--border); border-radius: 10px; padding: 0.8rem; }
  .chips { display: flex; height: 48px; border-radius: 6px; overflow: hidden; margin-bottom: 0.6rem; border: 1px solid var(--border); }
  .chip { flex: 1; }
  .name { display: block; font-weight: 600; font-size: 0.9rem; }
  .values { display: block; font-family: var(--mono); font-size: 0.72rem; color: var(--ink-soft); margin-top: 0.1rem; }
  .note { display: block; font-size: 0.72rem; color: var(--ink-soft); margin-top: 0.4rem; }
</style>
</head>
<body>
<header>
  <h1>Pilcrow Brand Palette</h1>
  <p class="lede">Left chip is light mode, right chip is dark mode. Site palette is copied from <code>src/styles/global.css</code> in perrwa.github.io; brand accents are the two colors locked for the pilcrow mark.</p>
</header>
<h2>Site palette</h2>
<div class="grid">
${siteSwatches}
</div>
<h2>Brand accents</h2>
<div class="grid">
${brandSwatches}
</div>
</body>
</html>
`;

writeFileSync(path.join(PALETTE_DIR, 'palette.html'), html);
console.log('wrote brand/palette/palette.json, brand/palette/palette.html');

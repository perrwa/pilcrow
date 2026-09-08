// Fetches Joan-Regular.ttf directly from its upstream GitHub source, not
// Google Fonts. Verified during design: both serve the identical pilcrow
// outline, but GitHub's copy is newer (v1.010 vs Google's v1.001) and
// fuller (1363 vs 657 glyphs — Google's build config sets
// buildSmallCap: false, stripping small caps/alternates before
// publishing). Doesn't matter for the pilcrow itself, but GitHub is the
// more complete source if this font is ever used for anything else.
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FONT_URL = 'https://raw.githubusercontent.com/PaoloBiagini/Joan/main/fonts/ttf/Joan-Regular.ttf';
const OUT = path.join(__dirname, '..', 'fonts');

mkdirSync(OUT, { recursive: true });

const res = await fetch(FONT_URL);
if (!res.ok) {
  throw new Error(`Failed to fetch Joan-Regular.ttf: HTTP ${res.status}`);
}
const buf = Buffer.from(await res.arrayBuffer());
const outPath = path.join(OUT, 'joan-regular.ttf');
writeFileSync(outPath, buf);
console.log(`fetched Joan-Regular.ttf (${buf.length} bytes) -> ${outPath}`);

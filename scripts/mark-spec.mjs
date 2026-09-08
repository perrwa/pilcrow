// The locked brandmark spec — pure constants, no side effects, so any
// script can import these without re-running SVG generation. See
// history/HISTORY.md for how these numbers were arrived at.
import { PLATE_INNER_BOTTOM, PLATE_INNER_HEIGHT } from './plate-geometry.mjs';

// Glyph enlarged 1.2x over the plate's original base size (66); entire
// glyph (stem/descender included) bottom-aligned 5% past the plate's
// inner edge.
export const SIZE = 66 * 1.2; // 79.2
export const CY = PLATE_INNER_BOTTOM + 0.05 * PLATE_INNER_HEIGHT; // 123.40

export const COLORS = [
  { key: 'mono', label: 'Mono', light: '#000', dark: '#fff' },
  { key: 'accent', label: 'Accent Blue', light: '#2c3e63', dark: '#9ab2e0' },
  { key: 'warm', label: 'Warm Midcentury', light: '#b8542e', dark: '#e3a458' },
];

export const GOOFY_STROKE_WIDTH = 5;

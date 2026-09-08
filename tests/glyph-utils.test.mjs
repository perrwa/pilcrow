import { describe, expect, test } from 'vitest';
import {
  bowlHalfHeightOnCanvas,
  placeBottomAligned,
  placeBowlAnchored,
  placeCentered,
  scaleFor,
} from '../scripts/glyph-utils.mjs';

describe('scaleFor', () => {
  test('scales by width when width is the longer dimension', () => {
    expect(scaleFor({ minX: 0, maxX: 100, minY: 0, maxY: 50 }, 50)).toBe(0.5);
  });

  test('scales by height when height is the longer dimension', () => {
    expect(scaleFor({ minX: 0, maxX: 50, minY: 0, maxY: 200 }, 100)).toBe(0.5);
  });
});

describe('bowlHalfHeightOnCanvas', () => {
  test('is half the bowl height at the given scale', () => {
    expect(bowlHalfHeightOnCanvas({ minY: 0, maxY: 40 }, 2)).toBe(40);
  });
});

describe('placeCentered', () => {
  test('centers the full bbox on both axes', () => {
    const fullBbox = { minX: 0, maxX: 100, minY: 0, maxY: 100 };
    expect(placeCentered({ fullBbox, size: 100, cx: 64, cy: 64 })).toBe(
      'translate(64 64) scale(1 -1) translate(-50 -50)',
    );
  });
});

describe('placeBottomAligned', () => {
  test('centers horizontally but anchors vertically on the bbox bottom edge', () => {
    const fullBbox = { minX: 0, maxX: 100, minY: 10, maxY: 110 };
    expect(placeBottomAligned({ fullBbox, size: 100, cx: 64, cy: 64 })).toBe(
      'translate(64 64) scale(1 -1) translate(-50 -10)',
    );
  });
});

describe('placeBowlAnchored', () => {
  test('centers horizontally on the full bbox but vertically on the bowl bbox', () => {
    const fullBbox = { minX: 0, maxX: 100, minY: 0, maxY: 200 };
    const bowlBbox = { minY: 120, maxY: 180 };
    expect(placeBowlAnchored({ fullBbox, bowlBbox, size: 100, cx: 64, cy: 64 })).toBe(
      'translate(64 64) scale(0.5 -0.5) translate(-50 -150)',
    );
  });
});

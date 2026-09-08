import { describe, expect, test } from 'vitest';
import {
  PLATE_INNER_BOTTOM,
  PLATE_INNER_HEIGHT,
  PLATE_SIZE,
  PLATE_Y,
} from '../scripts/plate-geometry.mjs';

describe('plate-geometry', () => {
  test('inner bottom is the plate origin plus its size', () => {
    expect(PLATE_INNER_BOTTOM).toBe(PLATE_Y + PLATE_SIZE);
  });

  test('inner height equals the plate size, since the plate is square', () => {
    expect(PLATE_INNER_HEIGHT).toBe(PLATE_SIZE);
  });
});

import { describe, expect, test } from 'vitest';
import { CY, SIZE, SIZES } from '../scripts/mark-spec.mjs';

describe('mark-spec', () => {
  test('SIZE is 1.2x the plate base size of 66', () => {
    expect(SIZE).toBeCloseTo(79.2);
  });

  test('CY sits 5% past the plate inner bottom', () => {
    expect(CY).toBeCloseTo(123.4);
  });

  test('SIZES matches the locked favicon/print size matrix', () => {
    expect(SIZES).toEqual([16, 32, 48, 180, 512, 1024]);
  });
});

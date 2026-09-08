// Single source of truth for the plate composition's geometry, so
// alignment math elsewhere references these instead of re-hardcoding the
// same magic numbers (10, 118, 108...).
export const PLATE_X = 10;
export const PLATE_Y = 10;
export const PLATE_SIZE = 108; // plate is square: both width and height
export const PLATE_INNER_TOP = PLATE_Y;
export const PLATE_INNER_BOTTOM = PLATE_Y + PLATE_SIZE; // 118
export const PLATE_INNER_HEIGHT = PLATE_SIZE; // 108

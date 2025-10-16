/**
 * Generation Utilities - Birth year to generation mapping
 */

export const GENERATION_PETALS = {
  'Silent Generation': 4,      // 1928-1945
  'Baby Boomers': 3,            // 1946-1964
  'Generation X': 2,            // 1965-1980
  'Millennials': 1,             // 1981-1996
  'Generation Y - Millennials': 1,
  'Generation Y': 1
};

/**
 * Get petal count from generation string
 */
export function getPetalCount(generation) {
  return GENERATION_PETALS[generation] || 1;
}

/**
 * Get marker rotation based on gender
 */
export function getMarkerRotation(gender) {
  return gender === 'Female' ? 180 : 0;
}

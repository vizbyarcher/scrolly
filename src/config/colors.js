/**
 * Color Configuration - Academic field to color mappings
 */

export const FIELD_COLORS = {
  'Humanities and social sciences': '#F4A460', // Orange/Yellow
  'Natural sciences': '#2ECC71',                // Green
  'Formal sciences': '#00CED1',                 // Cyan
  'Professions and applied sciences': '#9B59B6', // Purple
  'no diploma': '#95A5A6',                       // Gray
  null: '#95A5A6'                                // Gray (no data)
};

/**
 * Get marker colors based on academic field(s)
 * Handles multiple fields separated by commas
 */
export function getMarkerColors(academicField) {
  if (!academicField || academicField === 'no diploma') {
    return [FIELD_COLORS['no diploma']];
  }

  // Split by comma for multiple fields
  const fields = academicField.split(',').map(f => f.trim());
  return fields.map(field => FIELD_COLORS[field] || FIELD_COLORS[null]);
}

/**
 * Create CSS gradient string from colors array
 */
export function createGradient(colors) {
  if (colors.length === 1) {
    return colors[0];
  }

  // Create linear gradient
  const stops = colors.map((color, i) => {
    const percent = (i / (colors.length - 1)) * 100;
    return `${color} ${percent}%`;
  }).join(', ');

  return `linear-gradient(135deg, ${stops})`;
}

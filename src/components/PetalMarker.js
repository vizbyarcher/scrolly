/**
 * PetalMarker - Generate custom petal-shaped markers with portraits
 */

import { getMarkerColors, createGradient } from '../config/colors.js';
import { getPetalCount, getMarkerRotation } from '../utils/generation.js';

export class PetalMarker {
  /**
   * Generate a petal marker element from leader properties
   */
  static generate(properties) {
    const {
      'Academic field': field,
      Generation: generation,
      Gender: gender,
      iconUrl: portrait
    } = properties;

    const petalCount = getPetalCount(generation);
    const colors = getMarkerColors(field);
    const rotation = getMarkerRotation(gender);

    return this.createMarkerElement(petalCount, colors, rotation, portrait, properties);
  }

  /**
   * Create the marker DOM element
   */
  static createMarkerElement(petals, colors, rotation, portraitUrl, properties) {
    const container = document.createElement('div');
    container.className = 'marker-container';
    container.setAttribute('role', 'button');
    container.setAttribute('tabindex', '0');
    container.setAttribute('aria-label', `${properties['Head of state']}, ${properties.Title}`);

    // Create SVG marker
    const svg = this.createSVG(petals, colors, rotation, portraitUrl);
    container.innerHTML = svg;

    return container;
  }

  /**
   * Create SVG markup for the petal marker
   */
  static createSVG(petals, colors, rotation, portraitUrl) {
    const size = 60;
    const center = size / 2;
    const petalPath = this.getPetalPath(petals, size);
    const gradientDef = colors.length > 1 ? this.createGradientDef(colors) : '';
    const fill = colors.length > 1 ? 'url(#petal-gradient)' : colors[0];

    return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          ${gradientDef}
          <clipPath id="clip-${Math.random().toString(36).substr(2, 9)}">
            <path d="${petalPath}" />
          </clipPath>
        </defs>

        <!-- Portrait image -->
        <image
          href="${import.meta.env.BASE_URL || '/'}assets/portraits/${portraitUrl}"
          width="${size}"
          height="${size}"
          clip-path="url(#clip-${Math.random().toString(36).substr(2, 9)})"
          preserveAspectRatio="xMidYMid slice"
        />

        <!-- Petal border -->
        <g transform="rotate(${rotation} ${center} ${center})">
          <path
            d="${petalPath}"
            fill="${fill}"
            fill-opacity="0.3"
            stroke="${colors[0]}"
            stroke-width="2"
          />
        </g>
      </svg>
    `;
  }

  /**
   * Generate SVG path for petal shape based on count
   */
  static getPetalPath(count, size) {
    const center = size / 2;
    const radius = size / 2 - 2; // Leave room for stroke

    switch (count) {
      case 1:
        // Circle (1 petal - Millennials)
        return this.circlePath(center, radius);

      case 2:
        // Two petals (Generation X)
        return this.twoPetalPath(center, radius);

      case 3:
        // Three petals (Baby Boomers)
        return this.threePetalPath(center, radius);

      case 4:
        // Four petals (Silent Generation)
        return this.fourPetalPath(center, radius);

      default:
        return this.circlePath(center, radius);
    }
  }

  /**
   * Circle path (1 petal)
   */
  static circlePath(cx, r) {
    return `M ${cx - r},${cx}
            a ${r},${r} 0 1,0 ${r * 2},0
            a ${r},${r} 0 1,0 ${-r * 2},0`;
  }

  /**
   * Two petal path (vertical figure-8 / lens shape)
   */
  static twoPetalPath(center, radius) {
    const r = radius * 0.7;
    const offset = radius * 0.35;

    return `
      M ${center},${center - radius}
      Q ${center + r},${center - offset} ${center},${center}
      Q ${center - r},${center - offset} ${center},${center - radius}
      M ${center},${center}
      Q ${center + r},${center + offset} ${center},${center + radius}
      Q ${center - r},${center + offset} ${center},${center}
      Z
    `;
  }

  /**
   * Three petal path (triangular flower)
   */
  static threePetalPath(center, radius) {
    const petals = [];
    const petalRadius = radius * 0.6;

    for (let i = 0; i < 3; i++) {
      const angle = (i * 120 - 90) * Math.PI / 180;
      const x = center + Math.cos(angle) * petalRadius;
      const y = center + Math.sin(angle) * petalRadius;

      petals.push(`
        M ${center},${center}
        Q ${x + Math.cos(angle + Math.PI/2) * petalRadius},${y + Math.sin(angle + Math.PI/2) * petalRadius}
          ${x},${y}
        Q ${x + Math.cos(angle - Math.PI/2) * petalRadius},${y + Math.sin(angle - Math.PI/2) * petalRadius}
          ${center},${center}
      `);
    }

    return petals.join(' ') + ' Z';
  }

  /**
   * Four petal path (flower/clover shape)
   */
  static fourPetalPath(center, radius) {
    const petals = [];
    const petalRadius = radius * 0.55;

    for (let i = 0; i < 4; i++) {
      const angle = (i * 90) * Math.PI / 180;
      const x = center + Math.cos(angle) * petalRadius;
      const y = center + Math.sin(angle) * petalRadius;

      petals.push(`
        M ${center},${center}
        Q ${x + Math.cos(angle + Math.PI/2) * petalRadius * 0.8},${y + Math.sin(angle + Math.PI/2) * petalRadius * 0.8}
          ${x},${y}
        Q ${x + Math.cos(angle - Math.PI/2) * petalRadius * 0.8},${y + Math.sin(angle - Math.PI/2) * petalRadius * 0.8}
          ${center},${center}
      `);
    }

    return petals.join(' ') + ' Z';
  }

  /**
   * Create gradient definition for multiple colors
   */
  static createGradientDef(colors) {
    const stops = colors.map((color, i) => {
      const percent = (i / (colors.length - 1)) * 100;
      return `<stop offset="${percent}%" stop-color="${color}" />`;
    }).join('\n');

    return `
      <linearGradient id="petal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        ${stops}
      </linearGradient>
    `;
  }
}

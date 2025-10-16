# Atlas of Leadership - Implementation Strategy

**Project**: Interactive Scrollytelling Data Journalism Application
**Author**: Edit Gyenge
**Tech Lead Documentation**: October 16, 2025

---

## Executive Summary

This document outlines the technical implementation strategy for the Atlas of Leadership, an interactive scrollytelling web application that visualizes global political leadership through academic background, gender, and generation data. The application combines MapLibre GL for 3D globe visualization with custom petal-shaped markers encoding multiple data dimensions.

---

## Current Assets (Completed)

✅ **Complete Dataset**: `data/leaders.geojson` - 197 world leaders with full metadata
✅ **Portrait Images**: 178 leader portraits in `assets/portraits/` (PNG format)
✅ **Visual Design**: Legend system documented in `assets/legend.png`
✅ **Project Specification**: Comprehensive requirements in `Project.md`

### Data Structure (from leaders.geojson)

```json
{
  "type": "Feature",
  "properties": {
    "Title": "Country Name",
    "Head of state": "Leader Name",
    "iconUrl": "Country.png",
    "Academic field": "Professions and applied sciences",
    "Profession": "law",
    "University": "University Name",
    "Gender": "Male|Female",
    "Birth year ": 1965,
    "Generation": "Generation X",
    "Region": "Europe|Asia|Africa|America|Australia and Oceania"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [lng, lat]
  }
}
```

---

## Technology Stack

### Core Dependencies
- **MapLibre GL JS** v4.x - Free 3D mapping library with globe projection
- **Vite** v5.x - Fast build tool with HMR (Hot Module Replacement)
- **d3-ease** v3.x - Easing functions for smooth animations
- **Vanilla JavaScript** (ES6+) - No framework overhead

### Development Tools
- **ESLint** - Code quality
- **PostCSS** - CSS optimization
- **Sharp** (optional) - Image optimization for WebP conversion

### Build Configuration
```javascript
// vite.config.js
export default {
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  },
  server: {
    port: 3000
  }
}
```

---

## Project Architecture

### File Structure

```
/scrolly/
├── index.html                 # Main entry point
├── package.json
├── vite.config.js
├── src/
│   ├── main.js               # Application initialization
│   ├── config/
│   │   ├── colors.js         # Academic field → color mappings
│   │   ├── narrative.js      # Scrollytelling section definitions
│   │   └── camera-views.js   # Map camera positions
│   ├── core/
│   │   ├── MapController.js  # MapLibre initialization & controls
│   │   ├── ScrollManager.js  # Scroll position tracking
│   │   ├── DataLoader.js     # GeoJSON loading & processing
│   │   └── MarkerLayer.js    # Custom marker management
│   ├── components/
│   │   ├── PetalMarker.js    # Petal shape SVG generation
│   │   ├── NarrativePanel.js # Text overlay component
│   │   ├── Legend.js         # Interactive legend
│   │   └── DetailModal.js    # Leader detail popup
│   ├── utils/
│   │   ├── generation.js     # Birth year → petal count
│   │   ├── colors.js         # Field → color utilities
│   │   └── animations.js     # Transition helpers
│   └── styles/
│       ├── main.css          # Global styles
│       ├── map.css           # Map-specific styles
│       ├── markers.css       # Marker styles
│       └── narrative.css     # Scrollytelling styles
├── public/
│   ├── data/
│   │   └── leaders.geojson
│   └── assets/
│       ├── portraits/         # Leader portraits
│       └── legend.png
└── dist/                      # Production build output
```

---

## Visual Encoding System

### Color Mapping (Academic Fields)

```javascript
// src/config/colors.js
export const FIELD_COLORS = {
  'Humanities and social sciences': '#F4A460',  // Orange/Yellow
  'Natural sciences': '#2ECC71',                // Green
  'Formal sciences': '#00CED1',                 // Cyan/Turquoise
  'Professions and applied sciences': '#9B59B6', // Purple
  'no diploma': '#95A5A6',                      // Gray
  null: '#95A5A6'                               // Gray (no data)
};

// Multiple fields create gradients
export function getMarkerColors(academicField) {
  if (!academicField || academicField === 'no diploma') {
    return [FIELD_COLORS['no diploma']];
  }

  // Split by comma for multiple fields
  const fields = academicField.split(',').map(f => f.trim());
  return fields.map(field => FIELD_COLORS[field] || '#95A5A6');
}
```

### Generation → Petal Count Mapping

```javascript
// src/utils/generation.js
export const GENERATION_PETALS = {
  'Silent Generation': 4,      // 1928-1945
  'Baby Boomers': 3,            // 1946-1964
  'Generation X': 2,            // 1965-1980
  'Millennials': 1,             // 1981-1996
  'Generation Y - Millennials': 1
};

export function getPetalCount(generation) {
  return GENERATION_PETALS[generation] || 1;
}
```

### Gender → Orientation

```javascript
// Marker rotation
export function getMarkerRotation(gender) {
  return gender === 'Female' ? 180 : 0;  // Degrees
}
```

---

## Implementation Phases

### **Phase 1: Foundation Setup** (Day 1)

**Tasks:**
1. Initialize Vite project
2. Install dependencies (MapLibre, d3-ease)
3. Create folder structure
4. Move assets to `public/` directory
5. Set up basic HTML structure

**Deliverable:** Working dev server with basic map display

---

### **Phase 2: Core Map System** (Days 2-3)

**MapController.js Implementation:**

```javascript
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export class MapController {
  constructor(containerId) {
    this.map = new maplibregl.Map({
      container: containerId,
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 19
          }
        ]
      },
      center: [0, 20],
      zoom: 1.5,
      pitch: 0,
      bearing: 0,
      projection: 'globe',  // 3D globe view
      antialias: true
    });

    // Add navigation controls
    this.map.addControl(new maplibregl.NavigationControl());
  }

  flyTo(options, duration = 2000) {
    this.map.flyTo({
      ...options,
      duration,
      essential: true
    });
  }

  loadGeoJSON(url) {
    return fetch(url).then(res => res.json());
  }
}
```

**Tasks:**
- Initialize MapLibre with globe projection
- Add pan/zoom controls
- Load leaders.geojson
- Display simple circular markers at each coordinate
- Test map interactions

**Deliverable:** Interactive 3D globe with basic markers

---

### **Phase 3: Petal Marker System** (Days 4-6)

**Critical Component: PetalMarker.js**

This is the most complex part - generating custom petal-shaped markers with portraits.

**Approach: SVG-based Markers**

```javascript
// src/components/PetalMarker.js
export class PetalMarker {
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

    return this.createSVG(petalCount, colors, rotation, portrait);
  }

  static createSVG(petals, colors, rotation, portraitUrl) {
    const size = 60;  // Base marker size
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);

    // Create petal shape based on count
    const petalPath = this.getPetalPath(petals, size);

    // Apply gradient or solid color
    const fillId = this.createGradient(svg, colors);

    // Create petal shape
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', petalPath);
    path.setAttribute('fill', `url(#${fillId})`);
    path.setAttribute('transform', `rotate(${rotation} ${size/2} ${size/2})`);

    // Clip portrait image to petal shape
    const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    clipPath.id = `clip-${Math.random()}`;
    clipPath.appendChild(path.cloneNode());

    const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    image.setAttribute('href', `/assets/portraits/${portraitUrl}`);
    image.setAttribute('width', size);
    image.setAttribute('height', size);
    image.setAttribute('clip-path', `url(#${clipPath.id})`);

    svg.appendChild(clipPath);
    svg.appendChild(image);
    svg.appendChild(path);  // Border

    return svg.outerHTML;
  }

  static getPetalPath(count, size) {
    // Generate SVG path for 1-4 petals
    // Complex geometry calculations here
    switch(count) {
      case 1: return this.circlePath(size);
      case 2: return this.twoPetalPath(size);
      case 3: return this.threePetalPath(size);
      case 4: return this.fourPetalPath(size);
      default: return this.circlePath(size);
    }
  }

  static circlePath(size) {
    const r = size / 2;
    return `M ${r},${r} m ${-r},0 a ${r},${r} 0 1,0 ${r*2},0 a ${r},${r} 0 1,0 ${-r*2},0`;
  }

  // ... more path generation methods
}
```

**Tasks:**
- Design petal SVG paths for 1-4 petals
- Implement gradient generation for multiple fields
- Clip portrait images within petal shapes
- Apply rotation based on gender
- Convert SVG to MapLibre marker
- Test with sample leaders

**Deliverable:** Custom petal markers displaying on map

---

### **Phase 4: Scrollytelling Engine** (Days 7-10)

**Narrative Configuration:**

```javascript
// src/config/narrative.js
export const sections = [
  {
    id: 'intro',
    scrollTrigger: 0,  // 0-1 (scroll progress)
    content: {
      title: 'Atlas of Leadership',
      text: 'Explore how education, gender, and generation shape global leadership...'
    },
    camera: {
      center: [0, 20],
      zoom: 1.5,
      pitch: 0,
      bearing: 0
    },
    markers: {
      visible: true,
      filter: null,
      highlight: null
    }
  },
  {
    id: 'europe-gender',
    scrollTrigger: 0.2,
    content: {
      title: 'Europe: Gender Gap',
      text: 'In Europe, only 8 out of 43 leaders are women (18.6%). The continent is dominated by Baby Boomers and Generation X leaders...'
    },
    camera: {
      center: [15, 52],
      zoom: 3.5,
      pitch: 30,
      bearing: 0
    },
    markers: {
      visible: true,
      filter: { Region: 'Europe' },
      highlight: { Gender: 'Female' }  // Brighten female markers
    }
  },
  {
    id: 'universities-oxford',
    scrollTrigger: 0.4,
    content: {
      title: 'Oxford Connection',
      text: 'Several world leaders graduated from University of Oxford...'
    },
    camera: {
      center: [-1.25, 51.75],
      zoom: 5,
      pitch: 45,
      bearing: 0
    },
    markers: {
      visible: true,
      filter: null,
      highlight: {
        University: (u) => u && u.includes('Oxford')
      }
    }
  }
  // ... more sections (Asia, Africa, Americas, Oceania)
];
```

**ScrollManager.js:**

```javascript
// src/core/ScrollManager.js
import { easeCubicInOut } from 'd3-ease';

export class ScrollManager {
  constructor(sections, callbacks) {
    this.sections = sections.sort((a, b) => a.scrollTrigger - b.scrollTrigger);
    this.callbacks = callbacks;
    this.currentSectionId = null;

    this.init();
  }

  init() {
    // Create scroll container with sections
    this.createScrollStructure();

    // Listen for scroll events (debounced)
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => this.onScroll(), 16);  // ~60fps
    });
  }

  onScroll() {
    const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    const activeSection = this.getActiveSection(scrollProgress);

    if (activeSection && activeSection.id !== this.currentSectionId) {
      this.currentSectionId = activeSection.id;
      this.callbacks.onSectionChange(activeSection);
    }
  }

  getActiveSection(progress) {
    // Find section whose trigger has been passed
    for (let i = this.sections.length - 1; i >= 0; i--) {
      if (progress >= this.sections[i].scrollTrigger) {
        return this.sections[i];
      }
    }
    return this.sections[0];
  }

  createScrollStructure() {
    // Create tall scrollable div with sections
    const container = document.getElementById('narrative-container');

    this.sections.forEach(section => {
      const sectionEl = document.createElement('div');
      sectionEl.className = 'narrative-section';
      sectionEl.id = `section-${section.id}`;
      sectionEl.innerHTML = `
        <h2>${section.content.title}</h2>
        <p>${section.content.text}</p>
      `;
      container.appendChild(sectionEl);
    });
  }
}
```

**Tasks:**
- Define all narrative sections with camera positions
- Implement scroll position detection
- Trigger map camera transitions on section change
- Fade in/out narrative text panels
- Filter and highlight markers based on section
- Add smooth easing to camera movements

**Deliverable:** Working scrollytelling with map synchronization

---

### **Phase 5: Interactivity & Details** (Days 11-12)

**DetailModal.js:**

```javascript
// src/components/DetailModal.js
export class DetailModal {
  constructor() {
    this.modal = this.createModal();
    document.body.appendChild(this.modal);
  }

  show(properties) {
    const {
      'Title': country,
      'Head of state': name,
      'Academic field': field,
      Profession: profession,
      University: university,
      Gender: gender,
      'Birth year ': birthYear,
      Generation: generation,
      iconUrl: portrait
    } = properties;

    this.modal.innerHTML = `
      <div class="modal-content">
        <button class="close-btn">×</button>
        <div class="modal-header">
          <img src="/assets/portraits/${portrait}" alt="${name}">
          <h2>${name}</h2>
          <h3>${country}</h3>
        </div>
        <div class="modal-body">
          <p><strong>Position:</strong> Head of State</p>
          <p><strong>Generation:</strong> ${generation} (Born ${birthYear})</p>
          <p><strong>Gender:</strong> ${gender}</p>
          <p><strong>Academic Field:</strong> ${field || 'No diploma'}</p>
          ${profession ? `<p><strong>Profession:</strong> ${profession}</p>` : ''}
          ${university ? `<p><strong>University:</strong> ${university}</p>` : ''}
        </div>
      </div>
    `;

    this.modal.classList.add('visible');
  }

  hide() {
    this.modal.classList.remove('visible');
  }
}
```

**Tasks:**
- Add click handlers to markers
- Create detail modal with leader information
- Implement keyboard navigation (Tab through markers)
- Add touch gesture support for mobile
- Create interactive legend panel
- Add "How to read the map" instructions

**Deliverable:** Fully interactive markers and UI

---

### **Phase 6: Performance Optimization** (Days 13-14)

**Optimization Strategies:**

1. **Image Optimization:**
```bash
# Convert portraits to WebP (optional)
npm install -D sharp
node scripts/optimize-images.js
```

2. **Lazy Loading:**
```javascript
// src/utils/lazyload.js
export class ImageLazyLoader {
  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target);
          }
        });
      },
      { rootMargin: '100px' }
    );
  }

  observe(marker) {
    this.observer.observe(marker);
  }
}
```

3. **Marker Clustering** (if needed):
```javascript
// At zoom < 2, cluster nearby markers
if (zoom < 2) {
  enableClustering();
} else {
  showIndividualMarkers();
}
```

4. **Scroll Debouncing:**
```javascript
// Already implemented in ScrollManager with setTimeout
```

**Tasks:**
- Convert portraits to WebP format
- Implement lazy loading for marker images
- Add marker clustering for low zoom levels
- Optimize CSS animations
- Minify and bundle production assets
- Test performance on mobile devices

**Performance Targets:**
- Initial load: < 3 seconds
- Time to interactive: < 5 seconds
- Scroll frame rate: 60fps
- Total page weight: < 5MB

**Deliverable:** Optimized application ready for deployment

---

### **Phase 7: Responsive Design & Accessibility** (Days 15-16)

**Responsive Breakpoints:**

```css
/* src/styles/responsive.css */

/* Mobile: 320-767px */
@media (max-width: 767px) {
  .narrative-panel {
    width: 100%;
    bottom: 0;
    top: auto;
    max-height: 40vh;
  }

  .marker-size {
    transform: scale(0.8);
  }
}

/* Tablet: 768-1024px */
@media (min-width: 768px) and (max-width: 1024px) {
  .narrative-panel {
    width: 50%;
  }
}

/* Desktop: 1025px+ */
@media (min-width: 1025px) {
  .narrative-panel {
    width: 400px;
  }
}
```

**Accessibility Features:**

```javascript
// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') {
    scrollToNextSection();
  }
  if (e.key === 'ArrowUp') {
    scrollToPreviousSection();
  }
  if (e.key === 'Escape') {
    closeModal();
  }
});

// ARIA labels
marker.setAttribute('role', 'button');
marker.setAttribute('aria-label', `${name}, ${country}`);
marker.setAttribute('tabindex', '0');

// Reduced motion support
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReducedMotion.matches) {
  animationDuration = 0;
}
```

**Tasks:**
- Implement responsive CSS for mobile/tablet/desktop
- Add touch gesture handlers (swipe, pinch-zoom)
- Implement keyboard navigation
- Add ARIA labels and semantic HTML
- Test with screen readers
- Ensure color contrast meets WCAG AA standards
- Add reduced motion support

**Deliverable:** Accessible, responsive application

---

### **Phase 8: Deployment** (Days 17-18)

**Build Configuration:**

```json
// package.json scripts
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

**Deployment Options:**

1. **GitHub Pages** (Free, easy)
```bash
npm install -D gh-pages
npm run deploy
```

2. **Vercel** (Better performance, preview deployments)
```bash
npm install -g vercel
vercel
```

3. **Netlify** (Alternative to Vercel)
```bash
npm install -g netlify-cli
netlify deploy
```

**Tasks:**
- Build production bundle
- Test production build locally
- Set up deployment pipeline
- Configure custom domain (if applicable)
- Set up analytics (optional)
- Create README with project documentation

**Deliverable:** Live, deployed application

---

## Development Commands

```bash
# Initial setup
npm create vite@latest . -- --template vanilla
npm install

# Install dependencies
npm install maplibre-gl d3-ease

# Development
npm run dev              # Start dev server (http://localhost:3000)

# Production
npm run build           # Build for production
npm run preview         # Preview production build

# Deployment
npm run deploy          # Deploy to GitHub Pages

# Optional: Image optimization
npm install -D sharp
node scripts/optimize-images.js
```

---

## Critical Technical Decisions

### 1. **Marker Rendering: SVG vs Canvas**

**Decision:** Start with **SVG DOM markers**, migrate to **Canvas** only if performance issues occur.

**Rationale:**
- SVG easier to debug and iterate on during development
- Canvas better for 150+ markers but more complex
- Can switch incrementally without major refactor

**Implementation Note:** If frame rate drops below 30fps during scroll, implement canvas rendering.

---

### 2. **Scrollytelling: Custom vs Library**

**Decision:** **Custom vanilla JS implementation** using Intersection Observer API.

**Rationale:**
- Full control over timing and transitions
- No learning curve for external library
- Smaller bundle size (~2KB vs 50KB+ for libraries)
- Project requirements are specific and don't need generic scrollytelling features

---

### 3. **Image Format: WebP vs PNG**

**Decision:** Use **WebP with PNG fallback** for portraits.

**Rationale:**
- WebP 30-40% smaller than PNG
- 90%+ browser support (including mobile)
- Fallback ensures compatibility
- Worth the conversion time for 178 images

**Implementation:**
```html
<picture>
  <source srcset="portrait.webp" type="image/webp">
  <img src="portrait.png" alt="Leader">
</picture>
```

---

### 4. **Map Tiles: OSM vs Mapbox Style**

**Decision:** Use **OpenStreetMap tiles** with custom styling.

**Rationale:**
- Free and open-source (no API keys needed)
- Sufficient detail for country-level visualization
- Can be styled with MapLibre style spec
- No usage limits or costs

---

## Data Considerations

### Special Cases in GeoJSON

**Issue 1: Multiple Academic Fields**
- Some leaders have comma-separated fields: `"Humanities and social sciences, Professions and applied sciences"`
- **Solution:** Split by comma and create gradient fills

**Issue 2: Missing Data**
- Some properties are `null` (no university, no diploma)
- **Solution:** Default to gray color, display "No data available" in modal

**Issue 3: Duplicate Coordinates**
- Multiple Commonwealth countries share King Charles III
- **Solution:** Slight offset to prevent marker overlap

**Issue 4: Long University Names**
- Some entries have multiple universities: `"University of Dakar and Ecole nationale de l'aviation civile"`
- **Solution:** Truncate in tooltip, show full text in modal

### Data Validation Script

```javascript
// scripts/validate-data.js
const data = require('../public/data/leaders.geojson');

data.features.forEach(feature => {
  const { properties, geometry } = feature;

  // Check required fields
  if (!properties.Title) console.error('Missing Title:', feature);
  if (!geometry.coordinates) console.error('Missing coordinates:', feature);

  // Check coordinates are valid
  const [lng, lat] = geometry.coordinates;
  if (lng < -180 || lng > 180) console.error('Invalid longitude:', feature);
  if (lat < -90 || lat > 90) console.error('Invalid latitude:', feature);

  // Check portrait file exists
  const portraitPath = `./public/assets/portraits/${properties.iconUrl}`;
  if (!fs.existsSync(portraitPath)) {
    console.warn('Missing portrait:', properties.iconUrl);
  }
});
```

---

## Testing Strategy

### Manual Testing Checklist

**Functionality:**
- [ ] Map loads with globe projection
- [ ] All 197 markers display correctly
- [ ] Scroll triggers section changes
- [ ] Camera smoothly transitions between sections
- [ ] Markers change highlight/filter state
- [ ] Click marker opens detail modal
- [ ] Modal displays correct information
- [ ] Close modal with X button or Escape key
- [ ] Legend panel is readable

**Performance:**
- [ ] Initial load < 3 seconds
- [ ] Scroll maintains 60fps (check DevTools)
- [ ] No layout shifts during load
- [ ] Images load progressively
- [ ] No JavaScript errors in console

**Responsive:**
- [ ] Mobile (375px width)
- [ ] Tablet (768px width)
- [ ] Desktop (1920px width)
- [ ] Touch gestures work (swipe, pinch-zoom)
- [ ] Narrative text readable on all sizes

**Accessibility:**
- [ ] Keyboard navigation works (Tab, Arrow keys, Escape)
- [ ] Screen reader announces markers and sections
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible
- [ ] Reduced motion respected

**Cross-Browser:**
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Known Challenges & Solutions

### Challenge 1: Petal Shape Complexity

**Problem:** Creating visually appealing 1-4 petal shapes with portrait clipping.

**Solution:**
1. Start with simple geometric shapes (circle, ellipse, polygon)
2. Use SVG `clip-path` for portrait masking
3. Test with 5-10 leaders before applying to all
4. Iterate on design based on visual testing

**Fallback:** If petal shapes prove too complex, use simple circles with colored rings.

---

### Challenge 2: Scroll Animation Performance

**Problem:** Smooth 60fps scrolling with 197 animated markers.

**Solutions:**
- Debounce scroll events to ~16ms (60fps)
- Use CSS transforms (GPU-accelerated) instead of position properties
- Implement level-of-detail: simplify markers when zoomed out
- Consider canvas rendering if SVG markers cause lag

**Monitoring:** Use Chrome DevTools Performance panel to profile during scroll.

---

### Challenge 3: Mobile Touch Interactions

**Problem:** Competing gestures (scroll vs map pan, pinch vs zoom).

**Solution:**
- Lock map interactions during narrative scroll sections
- Add clear UI affordances ("Swipe to rotate globe")
- Implement gesture detection with thresholds
- Test extensively on real devices (iOS and Android)

---

### Challenge 4: Data Maintenance

**Problem:** Leader data will become outdated after elections.

**Solution:**
- Document data update process in README
- Keep GeoJSON in separate file for easy editing
- Consider adding "Last Updated" timestamp to UI
- Potential future enhancement: Connect to Wikipedia API for semi-automated updates

---

## Future Enhancements (Post-MVP)

### Phase 9: Advanced Features (Optional)

1. **Time Series Data**
   - Add historical data to show leadership changes over time
   - Animate transitions between years
   - Show trends in gender/education over decades

2. **Filtering Controls**
   - UI controls to filter by generation, gender, field
   - Search functionality to find specific leaders
   - Highlight leaders from specific universities

3. **Comparative Statistics**
   - Interactive charts showing distributions
   - Side-by-side continent comparisons
   - Correlation analysis visualizations

4. **Social Sharing**
   - Generate shareable images of specific views
   - Social media meta tags
   - Embed functionality for other websites

5. **Data Export**
   - Download filtered data as CSV/JSON
   - Export high-resolution map screenshots
   - API for programmatic access

---

## Success Metrics

### Launch Criteria
- ✅ All 197 leaders display correctly
- ✅ Scrollytelling narrative flows smoothly
- ✅ Performance targets met (< 3s load, 60fps scroll)
- ✅ Mobile responsive and touch-friendly
- ✅ Accessible (keyboard nav, screen readers)
- ✅ Cross-browser compatible
- ✅ No critical bugs in console

### Post-Launch Metrics (if analytics added)
- Average time on page
- Scroll completion rate
- Marker click-through rate
- Mobile vs desktop usage
- Geographic distribution of visitors

---

## Resources & Documentation

### Key Documentation
- [MapLibre GL JS Docs](https://maplibre.org/maplibre-gl-js-docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [GeoJSON Specification](https://geojson.org/)
- [MDN: SVG](https://developer.mozilla.org/en-US/docs/Web/SVG)

### Inspiration & References
- [The Pudding](https://pudding.cool/) - Scrollytelling examples
- [Reuters Graphics](https://www.reuters.com/graphics/) - Data journalism
- [New York Times Graphics](https://www.nytimes.com/spotlight/graphics) - Interactive maps

---

## Timeline Summary

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| 1. Foundation | 1 day | Dev environment setup |
| 2. Core Map | 2 days | Interactive 3D globe |
| 3. Petal Markers | 3 days | Custom marker system |
| 4. Scrollytelling | 4 days | Narrative + map sync |
| 5. Interactivity | 2 days | Modals, legend, clicks |
| 6. Optimization | 2 days | Performance tuning |
| 7. Responsive/A11y | 2 days | Mobile + accessibility |
| 8. Deployment | 1 day | Live application |
| **Total** | **17-18 days** | **Production-ready app** |

---

## Conclusion

The Atlas of Leadership is a technically ambitious but achievable project. With complete data assets and clear design requirements already in place, the main implementation challenges lie in:

1. **Custom marker rendering** - Balancing visual appeal with performance
2. **Smooth scrollytelling** - Coordinating narrative, camera, and marker states
3. **Mobile experience** - Touch interactions and responsive design

By following this phased approach and maintaining focus on core functionality first, we can deliver a compelling interactive data journalism piece that effectively communicates patterns in global leadership.

The modular architecture allows for incremental development and testing, with each phase building on previous work. Performance optimization and accessibility considerations are built into the plan rather than bolted on afterward.

**Next Steps:** Begin Phase 1 implementation by initializing the Vite project and setting up the development environment.

---

**Document Version:** 1.0
**Last Updated:** October 16, 2025
**Status:** Ready for Implementation

/**
 * MapController - Manages MapLibre GL instance and interactions
 */

import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export class MapController {
  constructor(containerId, options = {}) {
    this.map = null;
    this.markers = [];
    this.init(containerId, options);
  }

  init(containerId, options) {
    const defaultOptions = {
      center: [0, 20],
      zoom: 1.5,
      pitch: 0,
      bearing: 0,
      projection: 'globe',
      antialias: true
    };

    this.map = new maplibregl.Map({
      container: containerId,
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
      ...defaultOptions,
      ...options
    });

    // Add navigation controls
    this.map.addControl(new maplibregl.NavigationControl({
      visualizePitch: true
    }), 'top-left');

    // Add scale control
    this.map.addControl(new maplibregl.ScaleControl({
      maxWidth: 100,
      unit: 'metric'
    }));

    // Wait for map to load
    this.map.on('load', () => {
      console.log('Map loaded successfully');
    });
  }

  /**
   * Smoothly fly to a new camera position
   */
  flyTo(options, duration = 2000) {
    this.map.flyTo({
      ...options,
      duration,
      essential: true,
      easing: (t) => t * (2 - t) // ease-out-quad
    });
  }

  /**
   * Load GeoJSON data from a URL
   */
  async loadGeoJSON(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load GeoJSON: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(`Loaded ${data.features.length} features from GeoJSON`);
      return data;
    } catch (error) {
      console.error('Error loading GeoJSON:', error);
      throw error;
    }
  }

  /**
   * Add a marker to the map
   */
  addMarker(lngLat, element, properties = {}) {
    const marker = new maplibregl.Marker({
      element,
      anchor: 'center'
    })
      .setLngLat(lngLat)
      .addTo(this.map);

    // Store reference with properties
    marker.properties = properties;
    this.markers.push(marker);

    return marker;
  }

  /**
   * Remove all markers from the map
   */
  clearMarkers() {
    this.markers.forEach(marker => marker.remove());
    this.markers = [];
  }

  /**
   * Filter markers based on properties
   */
  filterMarkers(filterFn) {
    this.markers.forEach(marker => {
      const visible = filterFn(marker.properties);
      marker.getElement().style.display = visible ? 'block' : 'none';
    });
  }

  /**
   * Highlight markers based on properties
   */
  highlightMarkers(highlightFn) {
    this.markers.forEach(marker => {
      const shouldHighlight = highlightFn(marker.properties);
      const element = marker.getElement();

      if (shouldHighlight) {
        element.classList.add('highlighted');
        element.style.opacity = '1';
        element.style.transform = 'scale(1.2)';
      } else {
        element.classList.remove('highlighted');
        element.style.opacity = '0.4';
        element.style.transform = 'scale(1)';
      }
    });
  }

  /**
   * Reset all markers to default state
   */
  resetMarkers() {
    this.markers.forEach(marker => {
      const element = marker.getElement();
      element.classList.remove('highlighted');
      element.style.opacity = '1';
      element.style.transform = 'scale(1)';
      element.style.display = 'block';
    });
  }

  /**
   * Get current camera position
   */
  getCameraPosition() {
    return {
      center: this.map.getCenter().toArray(),
      zoom: this.map.getZoom(),
      pitch: this.map.getPitch(),
      bearing: this.map.getBearing()
    };
  }

  /**
   * Get the map instance
   */
  getMap() {
    return this.map;
  }
}

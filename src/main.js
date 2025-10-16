/**
 * Atlas of Leadership - Main Application
 */

import './styles/main.css';
import { MapController } from './core/MapController.js';
import { PetalMarker } from './components/PetalMarker.js';

class AtlasApp {
  constructor() {
    this.mapController = null;
    this.leaders = null;
    this.init();
  }

  async init() {
    try {
      console.log('Initializing Atlas of Leadership...');

      // Initialize map
      this.mapController = new MapController('map', {
        center: [0, 20],
        zoom: 1.5,
        pitch: 0,
        bearing: 0
      });

      // Load leader data
      await this.loadData();

      // Render markers
      this.renderMarkers();

      // Setup UI interactions
      this.setupUI();

      console.log('Atlas of Leadership initialized successfully');
    } catch (error) {
      console.error('Failed to initialize application:', error);
      this.showError('Failed to load application. Please refresh the page.');
    }
  }

  async loadData() {
    try {
      // Use relative path that works both locally and on GitHub Pages
      const basePath = import.meta.env.BASE_URL || '/';
      this.leaders = await this.mapController.loadGeoJSON(`${basePath}leaders.geojson`);
      console.log(`Loaded ${this.leaders.features.length} leaders`);
    } catch (error) {
      console.error('Error loading leader data:', error);
      throw new Error('Failed to load leader data');
    }
  }

  renderMarkers() {
    if (!this.leaders || !this.leaders.features) {
      console.error('No leader data available');
      return;
    }

    console.log('Rendering markers...');
    let successCount = 0;
    let errorCount = 0;

    this.leaders.features.forEach(feature => {
      try {
        const { geometry, properties } = feature;

        if (!geometry || !geometry.coordinates) {
          console.warn('Missing coordinates for:', properties.Title);
          errorCount++;
          return;
        }

        // Generate petal marker
        const markerElement = PetalMarker.generate(properties);

        // Add click handler
        markerElement.addEventListener('click', () => {
          this.showLeaderDetail(properties);
        });

        // Add keyboard handler
        markerElement.addEventListener('keypress', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            this.showLeaderDetail(properties);
          }
        });

        // Add to map
        this.mapController.addMarker(
          geometry.coordinates,
          markerElement,
          properties
        );

        successCount++;
      } catch (error) {
        console.error('Error rendering marker for:', properties.Title, error);
        errorCount++;
      }
    });

    console.log(`Rendered ${successCount} markers (${errorCount} errors)`);
  }

  setupUI() {
    // Legend toggle
    const legendToggle = document.getElementById('legend-toggle');
    const legendPanel = document.getElementById('legend-panel');

    if (legendToggle && legendPanel) {
      legendToggle.addEventListener('click', () => {
        legendPanel.classList.toggle('collapsed');
      });
    }

    // Modal close handlers
    const modal = document.getElementById('detail-modal');
    if (modal) {
      // Click backdrop to close
      modal.querySelector('.modal-backdrop')?.addEventListener('click', () => {
        this.hideModal();
      });

      // Escape key to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('visible')) {
          this.hideModal();
        }
      });
    }
  }

  showLeaderDetail(properties) {
    const modal = document.getElementById('detail-modal');
    const modalContent = modal.querySelector('.modal-content');

    if (!modal || !modalContent) return;

    const {
      'Title': country,
      'Head of state': name,
      'Academic field': field,
      Profession: profession,
      University: university,
      Gender: gender,
      'Birth year ': birthYear,
      Generation: generation,
      iconUrl: portrait,
      Region: region
    } = properties;

    modalContent.innerHTML = `
      <button class="close-btn" aria-label="Close">&times;</button>
      <div class="modal-header" style="text-align: center; margin-bottom: 2rem;">
        <img
          src="${import.meta.env.BASE_URL || '/'}assets/portraits/${portrait}"
          alt="${name}"
          style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 1rem; box-shadow: 0 4px 8px rgba(0,0,0,0.2);"
        />
        <h2 style="margin: 0.5rem 0; font-size: 1.8rem;">${name}</h2>
        <h3 style="margin: 0.5rem 0; color: #666; font-weight: 400;">${country}</h3>
      </div>
      <div class="modal-body" style="line-height: 1.8;">
        <p><strong>Region:</strong> ${region}</p>
        <p><strong>Generation:</strong> ${generation} ${birthYear ? `(Born ${birthYear})` : ''}</p>
        <p><strong>Gender:</strong> ${gender}</p>
        <p><strong>Academic Field:</strong> ${field || 'No diploma'}</p>
        ${profession ? `<p><strong>Profession:</strong> ${profession}</p>` : ''}
        ${university ? `<p><strong>University:</strong> ${university}</p>` : ''}
      </div>
    `;

    // Add close button handler
    modalContent.querySelector('.close-btn').addEventListener('click', () => {
      this.hideModal();
    });

    modal.classList.add('visible');
  }

  hideModal() {
    const modal = document.getElementById('detail-modal');
    if (modal) {
      modal.classList.remove('visible');
    }
  }

  showError(message) {
    const container = document.getElementById('narrative-container');
    if (container) {
      container.innerHTML = `
        <div class="error-message" style="
          background: rgba(244, 67, 54, 0.95);
          color: white;
          padding: 2rem;
          border-radius: 8px;
          max-width: 600px;
          margin: 2rem;
          text-align: center;
        ">
          <h2>Error</h2>
          <p>${message}</p>
        </div>
      `;
    }
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new AtlasApp());
} else {
  new AtlasApp();
}

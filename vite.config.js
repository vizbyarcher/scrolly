import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/scrolly/',  // GitHub Pages repository name
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,  // Set to true for debugging
    rollupOptions: {
      output: {
        manualChunks: {
          'maplibre': ['maplibre-gl']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: false
  }
})

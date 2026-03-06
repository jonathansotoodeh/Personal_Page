import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Personal_Page/' : '/',
  plugins: [react()],
  build: {
    target: 'es2020',
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 850,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('node_modules/meshline')) {
            return 'three-core';
          }

          if (
            id.includes('@react-three/fiber') ||
            id.includes('@react-three/drei') ||
            id.includes('@react-three/postprocessing')
          ) {
            return 'r3f-stack';
          }

          if (id.includes('postprocessing')) {
            return 'postprocessing';
          }

          if (id.includes('gsap')) {
            return 'gsap';
          }
        }
      }
    }
  }
}));

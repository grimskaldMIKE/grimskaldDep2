import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Ensure that the root-level PNG files are treated as static assets during the build
  publicDir: false, 
  build: {
    rollupOptions: {
      // This ensures all your root-level files are considered
      input: {
        main: './index.html',
      },
    },
  },
  server: {
    host: true,
    port: 3000
  }
});
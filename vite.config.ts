import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Setting publicDir to '.' ensures that your .png files in the root
  // are copied to the build output so they don't 404 on Vercel.
  publicDir: '.', 
  build: {
    rollupOptions: {
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
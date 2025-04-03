import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': 'https://hammerhead-app-pz4dz.ondigitalocean.app', // URL de tu backend en DigitalOcean
    },
  },
});

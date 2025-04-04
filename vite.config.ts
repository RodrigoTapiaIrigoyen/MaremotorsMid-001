import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: process.env.NODE_ENV === 'development' ? {
      '/api': {
        target: process.env.VITE_API_URL || 'https://hammerhead-app-pz4dz.ondigitalocean.app', // URL del backend
        changeOrigin: true,
        secure: false,
      },
    } : undefined, // No usar proxy en producción
  },
});
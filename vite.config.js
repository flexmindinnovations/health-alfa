import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, 'src/assets'),
      "@utils": path.resolve(__dirname, 'src/utils'),
      "@assets/images": path.resolve(__dirname, 'src/assets/images'),
      "@contexts": path.resolve(__dirname, 'src/contexts'),
      "@components": path.resolve(__dirname, 'src/components'),
      "@hooks": path.resolve(__dirname, 'src/hooks'),
      "@pages": path.resolve(__dirname, 'src/pages'),
      "@dashboard": path.resolve(__dirname, 'src/pages/dashboard'),
      "@styles": path.resolve(__dirname, 'src/styles'),
      "@modals": path.resolve(__dirname, 'src/modals'),
      "@config": path.resolve(__dirname, 'src/config'),
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor';
        }
      }
    }
  }
});

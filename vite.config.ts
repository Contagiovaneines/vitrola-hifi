import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    watch: {
      ignored: ['**/dist-electron/**', '**/*.exe', '**/*.zip', '**/*.tmp']
    }
  }
});

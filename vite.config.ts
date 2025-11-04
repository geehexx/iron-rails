import { defineConfig } from 'vite';

export default defineConfig({
  server: { port: 5173 },
  build: { 
    target: 'esnext',
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser']
        }
      }
    }
  }
});

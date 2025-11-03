import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  define: {
    'CANVAS_RENDERER': JSON.stringify(true),
    'WEBGL_RENDERER': JSON.stringify(true)
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import webspatial from '@webspatial/vite-plugin'

/** One WebSpatial setup: always `mode: 'avp'` like the official Vite + WebSpatial guide. */
export default defineConfig({
  plugins: [react(), webspatial({ mode: 'avp', outputDir: '/' })],
  server: {
    host: true,
    strictPort: true,
    port: 5173,
  },
  build: {
    outDir: 'dist/webspatial/avp',
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import webspatial from '@webspatial/vite-plugin'

export default defineConfig(() => {
  const isAvp = process.env.XR_ENV === 'avp'
  return {
    plugins: [
      react(),
      webspatial(isAvp ? { mode: 'avp', outputDir: '/' } : {}),
    ],
    server: {
      host: true,
      strictPort: true,
      // Same port as `pnpm preview` / webspatial-builder README so --base matches
      port: 5173,
    },
    build: {
      outDir: isAvp ? 'dist/webspatial/avp' : 'dist',
    },
  }
})

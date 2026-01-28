import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import webSpatial from "@webspatial/vite-plugin";
import { createHtmlPlugin } from "vite-plugin-html";
import fs from 'node:fs'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig(() => {
  const XR_ENV = process.env.XR_ENV
  const isAvp = XR_ENV === 'avp'
  return {
    base: isAvp ? '/webspatial/avp/' : undefined,
    appType: 'mpa',
    plugins: [
      react(),
      webSpatial(),
      {
        name: 'avp-index-middleware',
        apply: 'serve',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const url = req.url || ''
            if (isAvp && (url === '/webspatial/avp' || url === '/webspatial/avp/')) {
              const indexPath = path.resolve(process.cwd(), 'index.html')
              const html = fs.readFileSync(indexPath, 'utf8')
              const transformed = await server.transformIndexHtml(url, html)
              res.statusCode = 200
              res.setHeader('Content-Type', 'text/html')
              res.end(transformed)
              return
            }
            next()
          })
        },
      },
      createHtmlPlugin({
        inject: {
          data: {
            XR_ENV: process.env.XR_ENV,
          },
        },
      }),
    ],
    server: {
      strictPort: true,
      port: isAvp ? 5175 : 5173,
    },
    build: {
      outDir: isAvp ? 'dist/webspatial/avp' : 'dist',
      rollupOptions: {
        input: {
          main: 'index.html',
          'dynamic-3d': 'dynamic-3d.html',
          'static-model': 'static-model.html',
          'multi-scene': 'multi-scene.html',
          'scene-overview': 'scene-overview.html',
          'scene-inner': 'scene-inner.html',
          'scene-outer': 'scene-outer.html',
          'scene-sun': 'scene-sun.html',
        },
      },
    },
  }
})

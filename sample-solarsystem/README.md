# WebSpatial Solar System — React + Vite

This project is a multi‑page React + TypeScript + Vite demo wired to the WebSpatial SDK. It runs on the web and packages for Apple Vision Pro (AVP) via the WebSpatial builder.

## Prerequisites
- Node.js 18+
- pnpm
- macOS with Xcode and visionOS Simulator (for AVP packaging)

## Install
```bash
pnpm install
pnpm run dev
```
Open http://localhost:5173/ to see the demo menu. Individual pages:
- /dynamic-3d.html
- /static-model.html
- /multi-scene.html
- /scene-overview.html, /scene-inner.html, /scene-outer.html, /scene-sun.html

## WebSpatial SDK Integration
- React SDK and core SDK installed in app package.json
- Vite plugin configured to inject XR_ENV and handle AVP base paths
  - See [vite.config.ts](./vite.config.ts)
- TypeScript JSX compiled through WebSpatial React SDK
  - See [tsconfig.app.json](./tsconfig.app.json) and [tsconfig.node.json](./tsconfig.node.json)

## Run for AVP (visionOS)
Run a standard dev server in one terminal:
```bash
pnpm run dev:web
```
Run an AVP dev server in another terminal:
```bash
pnpm run dev:avp
```
Note the AVP URL printed in the terminal, e.g.:
```
Local: http://localhost:5173/webspatial/avp/
```

## Package and Run in visionOS Simulator
With the AVP dev server running, package the app and launch the simulator:
```bash
pnpm dlx webspatial-builder run --base=http://localhost:5173/webspatial/avp/
```
Replace the base URL with the AVP dev server URL shown in your terminal.

## Web App Manifest (AVP)
Minimal manifest is provided at public/manifest.webmanifest and linked to all pages. It includes scene defaults required by the builder:
```json
{
  "name": "WebSpatial Solar System",
  "short_name": "SolarSystem",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#000000",
  "xr_main_scene": {
    "default_size": { "width": 500, "height": 1000 }
  },
  "icons": [
    { "src": "/vite.svg", "sizes": "any", "type": "image/svg+xml", "purpose": "any" }
  ]
}
```
Adjust default_size to fit your preferred start scene dimensions in AVP.

## Build and Deploy (Web)
```bash
pnpm run build
```
This produces a multi‑page build under sample-solarsystem/dist suitable for Vercel. A root vercel.json is included to build the app subfolder.

## Notes
- Static model assets live under public/modelasset/ and are served at /modelasset/*. Ensure those files exist for the model demo to render correctly.
- In AVP, the app uses the injected base path (/webspatial/avp/) automatically. Multi‑scene links are AVP‑safe and will open pages under that base when XR_ENV=avp.
- Vite configuration can be conditionally controlled by mode/command. See Vite docs: https://vite.dev/config/

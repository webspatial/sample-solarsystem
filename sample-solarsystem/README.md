# WebSpatial Solar System

A Progressive Web App (PWA) demo using React, Vite, and the WebSpatial SDK. It features 3D solar system scenes deployable to Vercel and viewable in spatial environments (Apple Vision Pro).

## Quick Start

```bash
# Install dependencies
pnpm install

# Run locally
pnpm run dev
```

## Deployment (Vercel)

Deploy directly from this subdirectory:

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy to production
# Ensure you are in sample-solarsystem/sample-solarsystem/
vercel --prod
```
*Vercel configuration is handled automatically via `vercel.json`.*

## Arch Overview

- **Frontend**: React 18 + Vite (SPA/MPA hybrid).
- **Spatial**: 
  - `@webspatial/react-sdk`: React components for spatial UI.
  - `@webspatial/core-sdk`: Core logic for 3D interactions.
  - `@google/model-viewer` & `three.js`: 3D rendering.
- **Styling**: 
  - Vanilla CSS variables.
  - **Custom Vite Plugin**: Automatically injects `class="is-spatial"` into HTML for spatial styling in all environments (including Vercel).
- **Routing**: Multi-page Application (MPA) with client-side SPA fallback for assets.
- **PWA**: 
  - `manifest.json`: Web App Manifest for installability.
  - `sw.js`: Service Worker for asset caching.
  - **Deployment**: Vercel (static hosting with rewrite rules for spa/assets).

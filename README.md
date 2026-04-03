# WebSpatial Solar System

A Progressive Web App (PWA) demo using React, Vite, TypeScript, and **WebSpatial SDK 1.5.x**. It includes an orbital `<Reality>` scene, USDZ planet models, and multi-window scenes for Apple Vision Pro (visionOS) workflows.

## Quick start

```bash
pnpm install
pnpm run dev
```

`pnpm run dev` starts Vite with **`XR_ENV=avp`**, so the WebSpatial plugin uses visionOS-style settings (`@webspatial/react-sdk/default`, injected `import.meta.env.XR_ENV`, etc.). The dev server listens on **http://localhost:5173** (same port as `pnpm preview` and the `webspatial-builder --base` URL in `package.json`).

Open the app and use the home screen links for **Dynamic orbit**, **USDZ models**, and **Multi-scene**.

## Vision Pro (webspatial-builder)

Requires Xcode / visionOS tooling and `@webspatial/builder` (installed as a dev dependency).

1. Build and serve the static output: `pnpm run build` then `pnpm run preview` (preview listens on **5173** per `package.json`).
2. In another terminal, point the builder at that URL, for example:  
   `pnpm exec webspatial-builder run --base=http://localhost:5173`

The `pnpm run avp` script runs `pnpm run build` and then the same `webspatial-builder` command; you still need preview (or another server) running on **5173** so the builder can fetch the app.

You can also point the builder at the **dev** server: run `pnpm run dev`, then `pnpm exec webspatial-builder run --base=http://localhost:5173`.

## Deployment (Vercel)

Your local command `pnpm run build:vercel-avp` is exactly what production should run. [vercel.json](vercel.json) wires that up for you:

| Setting | Value |
|--------|--------|
| Install | `pnpm install` |
| Build | `pnpm run build:vercel-avp` |
| Output folder | `dist/webspatial/avp` |

After build, Vercel serves that folder as the site root. The catch-all rewrite sends unknown paths to `index.html` so React Router works (`/orbit`, `/models`, `/scene/...`).

### Option A — Dashboard (typical)

1. Push this repo to GitHub (or GitLab / Bitbucket).
2. In [Vercel](https://vercel.com), **Add New… → Project** and import the repo.
3. Leave **Framework Preset** as detected or choose **Other**; do **not** override build/output if `vercel.json` is present (Vercel applies it automatically).
4. Deploy. Production URL will load the app from the AVP build output.

### Option B — Vercel CLI

From the project root (same folder as `vercel.json`):

```bash
npm i -g vercel
vercel        # first time: link project, confirm settings
vercel --prod # production deploy
```

The CLI uses `vercel.json` the same way as the dashboard.

### Checks if something fails

- **Wrong output / 404 on assets:** Confirm the build log shows files under `dist/webspatial/avp` (as in your successful local run).
- **pnpm on Vercel:** A `pnpm-lock.yaml` in the repo is enough for Vercel to use pnpm with `installCommand`.
- **Node version:** If needed, set **Settings → General → Node.js Version** in the project (e.g. 22.x) to match your machine.

## Architecture

- **SPA** with [React Router](https://reactrouter.com/) (`/` home, `/orbit`, `/models`, `/multi`, `/scene/:id`).
- **WebSpatial:** `@webspatial/react-sdk` and `@webspatial/core-sdk` **^1.5.0**; `Spatial.prototype.runInSpatialWeb()` adds the `isSpatial` class on `<html>` for translucent shell styling (see `src/main.tsx`, `src/index.css`).
- **Build:** `@webspatial/vite-plugin` **^1.0.1** with `mode: 'avp'` when `XR_ENV=avp`, matching [webspatial.dev](https://webspatial.dev/docs) patterns.
- **PWA:** `public/manifest.webmanifest` and `public/sw.js`.

## Styling

Global styles live in `src/index.css`. Spatial shell defaults use `html.isSpatial` (`--xr-background-material`, transparent background).

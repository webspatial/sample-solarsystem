# WebSpatial Solar System

Small [WebSpatial](https://webspatial.dev/docs) demo: React + Vite + TypeScript, orbital `<Reality>`, USDZ models, and multi-window scenes.

## Commands

```bash
pnpm install
pnpm run dev      # http://localhost:5173 — WebSpatial AVP dev settings
pnpm run build    # output: dist/webspatial/avp
pnpm run preview  # serve that build on :5173
pnpm run lint
```

**Vision Pro:** Xcode + visionOS simulator. Start `pnpm run dev` or `pnpm run preview`, then  
`pnpm exec webspatial-builder run --base=http://localhost:5173`.

**Vercel:** connect the repo in the Vercel UI or run `vercel` / `vercel --prod`. Settings are in [vercel.json](vercel.json).

## Stack

SPA routes: `/`, `/orbit`, `/models`, `/multi`, `/scene/:id`, `/planet/:name`. WebSpatial SDK **1.5.x**, `@webspatial/vite-plugin` in AVP mode. [webspatial.dev/docs](https://webspatial.dev/docs) is the source of truth for APIs and setup.

## Spatial interactions

- **Orbit** (`/orbit`): pinch (`onSpatialMagnify`) zooms the whole system, two-hand twist (`onSpatialRotate`) tilts the ecliptic, dragging the Sun (`onSpatialDrag`) scrubs time. Tap a planet for an in-scene HTML panel (an `AttachmentEntity`) with speed, play/pause and **Open in window**.
- **Planet volume** (`/planet/:name`): opened from the orbit panel via `initScene` + `window.open`. A `BroadcastChannel` (`src/lib/sync.ts`) keeps every open scene on one clock and one selection, so the detail planet spins in lockstep with the overview and prev/next in the volume re-selects in the orbit scene.
- **Home**: nav cards are `enable-xr` elements stepped in Z with `--xr-back`.
- **Multi-scene**: the overview volume uses `worldAlignment: 'gravityAligned'` and `resizability`.

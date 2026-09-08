import { initScene } from '@webspatial/react-sdk'

/** True when the page runs inside the WebSpatial shell (class set in main.tsx). */
export function isSpatial(): boolean {
  return document.documentElement.classList.contains('isSpatial')
}

function sceneUrl(path: string): string {
  return new URL(path, `${window.location.origin}${import.meta.env.BASE_URL}`).toString()
}

export type VolumeSize = { width: number; height: number; depth: number }

type VolumeOptions = {
  size: VolumeSize
  worldAlignment?: 'adaptive' | 'automatic' | 'gravityAligned'
  resizability?: { minWidth?: number; minHeight?: number; maxWidth?: number; maxHeight?: number }
}

/**
 * Open an app route as its own volumetric scene. `name` is the window name:
 * reusing it re-targets the existing volume instead of opening a second one.
 * Outside WebSpatial this degrades to a regular `window.open`.
 */
export function openVolume(path: string, name: string, opts: VolumeOptions): void {
  initScene(
    name,
    () => ({
      defaultSize: opts.size,
      resizability: opts.resizability,
      worldScaling: 'automatic',
      worldAlignment: opts.worldAlignment ?? 'automatic',
      baseplateVisibility: 'hidden',
    }),
    { type: 'volume' },
  )
  window.open(sceneUrl(path), name)
}

export const PLANET_WINDOW = 'PlanetDetail'

export function openPlanetVolume(name: string): void {
  openVolume(`planet/${name.toLowerCase()}`, PLANET_WINDOW, {
    size: { width: 0.8, height: 0.8, depth: 0.8 },
    resizability: { minWidth: 0.4, minHeight: 0.4, maxWidth: 1.5, maxHeight: 1.5 },
  })
}

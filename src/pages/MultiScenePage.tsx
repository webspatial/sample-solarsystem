import { Link } from 'react-router'
import { openVolume, type VolumeSize } from '../lib/spatial'

type SceneName = 'overview' | 'inner' | 'outer' | 'sun'

const SCENES: Record<SceneName, { title: string; size: VolumeSize }> = {
  overview: { title: 'SolarOverview', size: { width: 1.8, height: 1.2, depth: 0.5 } },
  inner: { title: 'InnerPlanets', size: { width: 1.5, height: 1.0, depth: 0.45 } },
  outer: { title: 'OuterPlanets', size: { width: 2.0, height: 1.3, depth: 0.5 } },
  sun: { title: 'SunFocus', size: { width: 1.2, height: 1.0, depth: 0.45 } },
}

export default function MultiScenePage() {
  const openScene = (name: SceneName) => {
    const def = SCENES[name]
    openVolume(`scene/${name}`, def.title, {
      size: def.size,
      /* The overview behaves like a tabletop model: it stays upright and can be
         resized, and the line-up rescales with the volume. */
      worldAlignment: name === 'overview' ? 'gravityAligned' : 'automatic',
      resizability:
        name === 'overview'
          ? { minWidth: 1.0, minHeight: 0.7, maxWidth: 3.0, maxHeight: 2.0 }
          : undefined,
    })
  }

  return (
    <div className="page stack">
      <Link to="/" className="back">
        ← Back
      </Link>
      <button
        type="button"
        className="chip"
        onClick={() => (Object.keys(SCENES) as SceneName[]).forEach(openScene)}
      >
        Open all scenes
      </button>
      <div className="row">
        <button type="button" className="chip" onClick={() => openScene('overview')}>
          Overview
        </button>
        <button type="button" className="chip" onClick={() => openScene('inner')}>
          Inner
        </button>
        <button type="button" className="chip" onClick={() => openScene('outer')}>
          Outer
        </button>
        <button type="button" className="chip" onClick={() => openScene('sun')}>
          Sun
        </button>
      </div>
    </div>
  )
}

import { Link } from 'react-router'
import { initScene } from '@webspatial/react-sdk'

function openSceneUrl(path: string): string {
  return new URL(path, `${window.location.origin}${import.meta.env.BASE_URL}`).toString()
}

export default function MultiScenePage() {
  const openPage = (path: string, title: string) => {
    window.open(openSceneUrl(path), title)
  }

  const openScene = (name: 'overview' | 'inner' | 'outer' | 'sun', title: string) => {
    const sizes = {
      overview: { width: 1.2, height: 0.8, depth: 0.15 },
      inner: { width: 1, height: 0.7, depth: 0.12 },
      outer: { width: 1.4, height: 0.9, depth: 0.15 },
      sun: { width: 0.8, height: 0.6, depth: 0.1 },
    }
    initScene(
      title,
      () => ({
        defaultSize: sizes[name],
        worldScaling: 'automatic',
        worldAlignment: 'automatic',
        baseplateVisibility: 'hidden',
      }),
      { type: 'volume' },
    )
    openPage(`scene/${name}`, title)
  }

  return (
    <div className="page stack">
      <Link to="/" className="back">
        ← Back
      </Link>
      <button type="button" className="chip" onClick={() => {
        openScene('overview', 'SolarOverview')
        openScene('inner', 'InnerPlanets')
        openScene('outer', 'OuterPlanets')
        openScene('sun', 'SunFocus')
      }}>
        Open all scenes
      </button>
      <div className="row">
        <button type="button" className="chip" onClick={() => openScene('overview', 'SolarOverview')}>
          Overview
        </button>
        <button type="button" className="chip" onClick={() => openScene('inner', 'InnerPlanets')}>
          Inner
        </button>
        <button type="button" className="chip" onClick={() => openScene('outer', 'OuterPlanets')}>
          Outer
        </button>
        <button type="button" className="chip" onClick={() => openScene('sun', 'SunFocus')}>
          Sun
        </button>
      </div>
    </div>
  )
}

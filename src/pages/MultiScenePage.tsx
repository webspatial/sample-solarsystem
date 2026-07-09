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
      overview: { width: 1.8, height: 1.2, depth: 0.5 },
      inner: { width: 1.5, height: 1.0, depth: 0.45 },
      outer: { width: 2.0, height: 1.3, depth: 0.5 },
      sun: { width: 1.2, height: 1.0, depth: 0.45 },
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

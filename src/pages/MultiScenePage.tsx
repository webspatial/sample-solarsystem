import { Link } from 'react-router'
import { initScene } from '@webspatial/react-sdk'
import { appOriginUrl } from '../appHref'

export default function MultiScenePage() {
  const openPage = (path: string, title: string) => {
    window.open(appOriginUrl(path), title)
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

  const openAllScenes = () => {
    openScene('overview', 'SolarOverview')
    openScene('inner', 'InnerPlanets')
    openScene('outer', 'OuterPlanets')
    openScene('sun', 'SunFocus')
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        padding: '1.5rem',
      }}
    >
      <Link
        to="/"
        style={{
          color: '#fff',
          textDecoration: 'none',
          padding: '0.6rem 1.2rem',
          backgroundColor: 'rgba(255,255,255,0.12)',
          borderRadius: '8px',
        }}
      >
        ← Back
      </Link>

      <button
        type="button"
        style={{
          padding: '0.6rem 1.2rem',
          backgroundColor: '#42a5f5',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 600,
        }}
        onClick={openAllScenes}
      >
        Open all scenes
      </button>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          type="button"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'rgba(255,255,255,0.12)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '999px',
            cursor: 'pointer',
          }}
          onClick={() => openScene('overview', 'SolarOverview')}
        >
          Overview
        </button>
        <button
          type="button"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'rgba(255,255,255,0.12)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '999px',
            cursor: 'pointer',
          }}
          onClick={() => openScene('inner', 'InnerPlanets')}
        >
          Inner planets
        </button>
        <button
          type="button"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'rgba(255,255,255,0.12)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '999px',
            cursor: 'pointer',
          }}
          onClick={() => openScene('outer', 'OuterPlanets')}
        >
          Outer planets
        </button>
        <button
          type="button"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'rgba(255,255,255,0.12)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '999px',
            cursor: 'pointer',
          }}
          onClick={() => openScene('sun', 'SunFocus')}
        >
          Sun focus
        </button>
      </div>
    </div>
  )
}

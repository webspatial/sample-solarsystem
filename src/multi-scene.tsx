import React from 'react';
import { createRoot } from 'react-dom/client';
import { initScene } from '@webspatial/react-sdk'
 

const MultiSceneDemo = () => {
  const XR_ENV: string | undefined =
    (window as unknown as { XR_ENV?: string }).XR_ENV ??
    (import.meta as unknown as { env?: { XR_ENV?: string } }).env?.XR_ENV
  const baseRaw = (window as unknown as { __XR_ENV_BASE__?: unknown }).__XR_ENV_BASE__
  let BASE: string =
    typeof baseRaw === 'string' && baseRaw.trim() !== '' && baseRaw.trim() !== '""'
      ? baseRaw
      : (XR_ENV === 'avp' ? '/webspatial/avp/' : '/')
  if (!BASE.endsWith('/')) BASE += '/'

  const openPage = (path: string, title: string) => {
    const url = new URL(path, `${window.location.origin}${BASE}`).toString()
    window.open(url, title)
  }

  const openScene = (name: string, title: string) => {
    switch (name) {
      case 'overview':
        initScene(
          title,
          () => ({
            defaultSize: {
              width: 1.2,
              height: 0.8,
              depth: 0.15,
            },
            worldScaling: 'automatic',
            worldAlignment: 'automatic',
            baseplateVisibility: 'hidden',
          }),
          { type: 'volume' },
        )
        openPage('scene-overview.html', title);
        break;
      case 'inner':
        initScene(
          title,
          () => ({
            defaultSize: {
              width: 1,
              height: 0.7,
              depth: 0.12,
            },
            worldScaling: 'automatic',
            worldAlignment: 'automatic',
            baseplateVisibility: 'hidden',
          }),
          { type: 'volume' },
        )
        openPage('scene-inner.html', title);
        break;
      case 'outer':
        initScene(
          title,
          () => ({
            defaultSize: {
              width: 1.4,
              height: 0.9,
              depth: 0.15,
            },
            worldScaling: 'automatic',
            worldAlignment: 'automatic',
            baseplateVisibility: 'hidden',
          }),
          { type: 'volume' },
        )
        openPage('scene-outer.html', title);
        break;
      case 'sun':
        initScene(
          title,
          () => ({
            defaultSize: {
              width: 0.8,
              height: 0.6,
              depth: 0.1,
            },
            worldScaling: 'automatic',
            worldAlignment: 'automatic',
            baseplateVisibility: 'hidden',
          }),
          { type: 'volume' },
        )
        openPage('scene-sun.html', title);
        break;
      default:
        break;
    }
  };

  const openAllScenes = () => {
    openScene('overview', 'SolarOverview');
    openScene('inner', 'InnerPlanets');
    openScene('outer', 'OuterPlanets');
    openScene('sun', 'SunFocus');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <a href="index.html" style={{ color: '#fff', textDecoration: 'none', padding: '0.6rem 1.2rem', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '8px' }}>← Back to Demo Menu</a>

      <button
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
        Open All Scenes
      </button>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          style={{ padding: '0.5rem 1rem', backgroundColor: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '999px', cursor: 'pointer' }}
          onClick={() => openScene('overview', 'SolarOverview')}
        >
          Open Overview
        </button>
        <button
          style={{ padding: '0.5rem 1rem', backgroundColor: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '999px', cursor: 'pointer' }}
          onClick={() => openScene('inner', 'InnerPlanets')}
        >
          Open Inner Planets
        </button>
        <button
          style={{ padding: '0.5rem 1rem', backgroundColor: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '999px', cursor: 'pointer' }}
          onClick={() => openScene('outer', 'OuterPlanets')}
        >
          Open Outer Planets
        </button>
        <button
          style={{ padding: '0.5rem 1rem', backgroundColor: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '999px', cursor: 'pointer' }}
          onClick={() => openScene('sun', 'SunFocus')}
        >
          Open Sun Focus
        </button>
      </div>
    </div>
  );
};

// Mount the app
const container = document.getElementById('scene-container');
if (container) {
  const root = createRoot(container);
  root.render(<MultiSceneDemo />);
}
export default MultiSceneDemo

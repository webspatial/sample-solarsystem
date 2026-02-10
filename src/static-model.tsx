import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { SpatializedStatic3DElementContainer as Model, enableDebugTool } from '@webspatial/react-sdk'
import type { SpatializedStatic3DElementRef } from '@webspatial/react-sdk'

enableDebugTool()

function StaticModelDemo() {
  const XR_ENV: string | undefined =
    (window as unknown as { XR_ENV?: string }).XR_ENV ??
    (import.meta as unknown as { env?: { XR_ENV?: string } }).env?.XR_ENV
  const BASE: string = typeof (window as unknown as { __XR_ENV_BASE__?: string }).__XR_ENV_BASE__ === 'string'
    ? String((window as unknown as { __XR_ENV_BASE__?: string }).__XR_ENV_BASE__)
    : (XR_ENV === 'avp' ? '/webspatial/avp/' : '/')
  const [showInfo, setShowInfo] = useState(false)
  const modelRef = React.useRef<SpatializedStatic3DElementRef | null>(null)
  const dragBaseRef = React.useRef<{ x: number, y: number, z: number }>({ x: 0, y: 0, z: 0 })
  const planets = [
    { name: 'Sun', src: `${BASE}modelasset/sun.usdz` },
    { name: 'Mercury', src: `${BASE}modelasset/mercury.usdz` },
    { name: 'Venus', src: `${BASE}modelasset/venus.usdz` },
    { name: 'Earth', src: `${BASE}modelasset/earth.usdz` },
    { name: 'Mars', src: `${BASE}modelasset/mars.usdz` },
    { name: 'Jupiter', src: `${BASE}modelasset/jupiter.usdz` },
    { name: 'Saturn', src: `${BASE}modelasset/saturn.usdz` },
    { name: 'Uranus', src: `${BASE}modelasset/uranus.usdz` },
    { name: 'Neptune', src: `${BASE}modelasset/neptune.usdz` },
    { name: 'Pluto', src: `${BASE}modelasset/pluto.usdz` },
  ]
  const [planetIndex, setPlanetIndex] = useState(3)
  

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {planets.map((p, i) => (
            <button
              key={p.name}
              onClick={() => setPlanetIndex(i)}
              style={{
                padding: '0.4rem 0.8rem',
                backgroundColor: i === planetIndex ? '#42a5f5' : 'rgba(255,255,255,0.1)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '999px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
        <div style={{ marginTop: '1rem' }}>
          <button
            onClick={() => setShowInfo(s => !s)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: showInfo ? '#42a5f5' : 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Info
          </button>
        </div>
      </div>

      <div style={{ position: 'relative', height: '360px' }}>
        <Model
          ref={modelRef}
          src={planets[planetIndex].src}
          style={{
            width: '340px',
            height: '340px',
            margin: '0 auto',
            display: 'block',
            border: '2px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            background: 'rgba(0,0,0,0.3)'
          }}
          onSpatialTap={() => {
            setShowInfo(s => !s)
          }}
          onSpatialDragStart={() => {
            dragBaseRef.current = { x: 0, y: 0, z: 0 }
          }}
          onSpatialDrag={(e) => {
            const t = e.detail.translation3D
            const dx = t.x - dragBaseRef.current.x
            const dy = t.y - dragBaseRef.current.y
            const dz = t.z - dragBaseRef.current.z
            const mat = modelRef.current?.entityTransform
            if (mat) {
              mat.translateSelf(dx, dy, dz)
            }
            dragBaseRef.current = t
          }}
          onSpatialDragEnd={() => {}}
        />

        {showInfo && (
          <div
            enable-xr
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '300px',
              minHeight: '130px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '14px',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
              transform: `translate3d(210px, -130px, 0px)`,
              '--xr-back': 120,
              '--xr-depth': 100,
              color: '#fff',
              padding: '16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              transition: 'transform 0.2s ease',
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#42a5f5',
              flex: '0 0 auto',
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '16px', fontWeight: 700 }}>{planets[planetIndex].name}</div>
              <div style={{ fontSize: '12px', opacity: 0.85 }}>Labeled 3D model with XR info panel</div>
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#cbd5e1' }}>
                {/* <div>Tap to rotate • Drag to manipulate • Pinch to scale</div> */}
                <div>Assets from public/modelasset</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', color: '#ccc' }}>
        <p>🛸 Interactive 3D Model</p>
        <p style={{ marginTop: '0.5rem' }}>Selected: {planets[planetIndex].name}</p>
      </div>
    </div>
  )
}

// Mount the app
const root = document.getElementById('demo-root')
if (root) {
  ReactDOM.createRoot(root).render(<StaticModelDemo />)
}
export default StaticModelDemo

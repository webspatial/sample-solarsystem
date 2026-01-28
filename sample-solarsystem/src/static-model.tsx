import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import {
  Model,
  enableDebugTool,
  ModelRef,
} from '@webspatial/react-sdk'

enableDebugTool()

function StaticModelDemo() {
  const [modelScale, setModelScale] = useState(1)
  const [modelRotation, setModelRotation] = useState({ x: 0, y: 0, z: 0 })
  const [showInfo, setShowInfo] = useState(false)
  const [time, setTime] = useState(0)
  const modelRef = React.useRef<ModelRef>(null)
  const planets = [
    { name: 'Sun', src: '/public/modelasset/sun.usdz' },
    { name: 'Mercury', src: '/public/modelasset/mercury.usdz' },
    { name: 'Venus', src: '/public/modelasset/venus.usdz' },
    { name: 'Earth', src: '/public/modelasset/earth.usdz' },
    { name: 'Mars', src: '/public/modelasset/mars.usdz' },
    { name: 'Jupiter', src: '/public/modelasset/jupiter.usdz' },
    { name: 'Saturn', src: '/public/modelasset/saturn.usdz' },
    { name: 'Uranus', src: '/public/modelasset/uranus.usdz' },
    { name: 'Neptune', src: '/public/modelasset/neptune.usdz' },
    { name: 'Pluto', src: '/public/modelasset/pluto.usdz' },
  ]
  const [planetIndex, setPlanetIndex] = useState(3)
  const orbitRadius = 10
  React.useEffect(() => {
    let raf = 0
    const tick = () => {
      setTime(t => t + 0.01)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  React.useEffect(() => {
    const t = modelRef.current?.entityTransform
    if (!t) return
    const x = Math.cos(time) * orbitRadius
    const y = Math.sin(time) * orbitRadius
    // const s = modelScale * 1.85
    t.setMatrixValue('none')
    t.translateSelf(x, y, 0)
    t.rotateAxisAngle(1, 0, 0, modelRotation.x)
    t.rotateAxisAngle(0, 0, 1, modelRotation.z)
    // t.scaleSelf(s, s, s)
  }, [time, modelScale, modelRotation])

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
          enable-xr
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
          onSpatialDragStart={(e) => {}}
          onSpatialDrag={(e) => {
            const delta = e.detail.translation3D
            setModelRotation(prev => ({
              x: prev.x + delta.y * 2,
              y: prev.y + delta.x * 2,
              z: prev.z
            }))
          }}
          onSpatialMagnify={(e) => {
            setModelScale(prev => Math.max(0.2, Math.min(3, prev * e.detail.magnification)))
          }}
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

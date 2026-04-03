import { useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router'
import { Model, type ModelRef } from '@webspatial/react-sdk'
import { appHref } from '../appHref'

export default function ModelsPage() {
  const base = import.meta.env.BASE_URL
  const [showInfo, setShowInfo] = useState(false)
  const modelRef = useRef<ModelRef | null>(null)
  const dragBaseRef = useRef({ x: 0, y: 0, z: 0 })

  const planets = [
    { name: 'Sun', src: `${base}modelasset/sun.usdz` },
    { name: 'Mercury', src: `${base}modelasset/mercury.usdz` },
    { name: 'Venus', src: `${base}modelasset/venus.usdz` },
    { name: 'Earth', src: `${base}modelasset/earth.usdz` },
    { name: 'Mars', src: `${base}modelasset/mars.usdz` },
    { name: 'Jupiter', src: `${base}modelasset/jupiter.usdz` },
    { name: 'Saturn', src: `${base}modelasset/saturn.usdz` },
    { name: 'Uranus', src: `${base}modelasset/uranus.usdz` },
    { name: 'Neptune', src: `${base}modelasset/neptune.usdz` },
    { name: 'Pluto', src: `${base}modelasset/pluto.usdz` },
  ]
  const [planetIndex, setPlanetIndex] = useState(3)

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <Link
        to="/"
        style={{
          color: '#8b9cff',
          textDecoration: 'none',
          display: 'inline-block',
          marginBottom: '1rem',
        }}
      >
        ← Back
      </Link>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {planets.map((p, i) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setPlanetIndex(i)}
              style={{
                padding: '0.4rem 0.8rem',
                backgroundColor: i === planetIndex ? '#42a5f5' : 'rgba(255,255,255,0.1)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '999px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
        <div style={{ marginTop: '1rem' }}>
          <button
            type="button"
            onClick={() => setShowInfo(s => !s)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: showInfo ? '#42a5f5' : 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
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
            background: 'rgba(0,0,0,0.3)',
          }}
          onSpatialTap={() => setShowInfo(s => !s)}
          onSpatialDragStart={() => {
            dragBaseRef.current = { x: 0, y: 0, z: 0 }
          }}
          onSpatialDrag={e => {
            const tx = e.translationX
            const ty = e.translationY
            const tz = e.translationZ
            const dx = tx - dragBaseRef.current.x
            const dy = ty - dragBaseRef.current.y
            const dz = tz - dragBaseRef.current.z
            const ref = modelRef.current
            if (ref) {
              const m = new DOMMatrix(ref.entityTransform.toString())
              m.translateSelf(dx, dy, dz)
              ref.entityTransform = m
            }
            dragBaseRef.current = { x: tx, y: ty, z: tz }
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
              transform: 'translate3d(210px, -130px, 0px)',
              '--xr-back': 120,
              '--xr-depth': 100,
              color: '#fff',
              padding: '16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              transition: 'transform 0.2s ease',
            } as CSSProperties}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: '#42a5f5',
                flex: '0 0 auto',
              }}
            />
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontSize: '16px', fontWeight: 700 }}>{planets[planetIndex].name}</div>
              <div style={{ fontSize: '12px', opacity: 0.85 }}>Labeled 3D model with XR info panel</div>
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#cbd5e1' }}>
                <div>Assets from {appHref('modelasset/')}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', color: '#ccc' }}>
        <p>Interactive 3D model</p>
        <p style={{ marginTop: '0.5rem' }}>Selected: {planets[planetIndex].name}</p>
      </div>
    </div>
  )
}

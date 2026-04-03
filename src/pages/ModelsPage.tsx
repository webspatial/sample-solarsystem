import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { Model, type ModelRef } from '@webspatial/react-sdk'

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
    <div className="page">
      <Link to="/" className="back">
        ← Back
      </Link>

      <div className="row" style={{ marginBottom: '0.75rem' }}>
        {planets.map((p, i) => (
          <button
            key={p.name}
            type="button"
            className="chip"
            data-active={i === planetIndex ? 'true' : undefined}
            onClick={() => setPlanetIndex(i)}
          >
            {p.name}
          </button>
        ))}
      </div>

      <p>
        <button type="button" className="chip" data-active={showInfo ? 'true' : undefined} onClick={() => setShowInfo(s => !s)}>
          Info
        </button>
      </p>

      <div className="model-wrap">
        <Model
          enable-xr
          ref={modelRef}
          src={planets[planetIndex].src}
          className="model-view"
          onSpatialTap={() => setShowInfo(s => !s)}
          onSpatialDragStart={() => {
            dragBaseRef.current = { x: 0, y: 0, z: 0 }
          }}
          onSpatialDrag={e => {
            const ref = modelRef.current
            if (!ref) return
            const tx = e.translationX
            const ty = e.translationY
            const tz = e.translationZ
            const m = new DOMMatrix(ref.entityTransform.toString())
            m.translateSelf(tx - dragBaseRef.current.x, ty - dragBaseRef.current.y, tz - dragBaseRef.current.z)
            ref.entityTransform = m
            dragBaseRef.current = { x: tx, y: ty, z: tz }
          }}
        />

        {showInfo && (
          <div enable-xr className="info-panel">
            <strong>{planets[planetIndex].name}</strong>
            <p style={{ margin: '0.35rem 0 0', fontSize: '0.9rem' }}>
              USDZ under <code>{`${base}modelasset/`}</code>
            </p>
          </div>
        )}
      </div>

      <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>Selected: {planets[planetIndex].name}</p>
    </div>
  )
}

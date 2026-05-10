import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  Reality,
  SceneGraph,
  Entity,
  ModelAsset,
  ModelEntity,
  AttachmentAsset,
  AttachmentEntity,
  SphereEntity,
  UnlitMaterial,
} from '@webspatial/react-sdk'

type Body = {
  name: string
  distance: number
  scale: number
  speed: number
  spin: number
  tilt: number
  fact: string
  facts: string[]
}

const SUN_SCALE = 0.04

const BODIES: Body[] = [
  {
    name: 'Mercury',
    distance: 0.18,
    scale: 0.008,
    speed: 4.15,
    spin: 0.04,
    tilt: 0.01,
    fact: 'Year = 88 days',
    facts: ['Smallest planet', 'No atmosphere', 'Day = 176 Earth days'],
  },
  {
    name: 'Venus',
    distance: 0.26,
    scale: 0.012,
    speed: 1.62,
    spin: -0.01,
    tilt: 3.1,
    fact: 'Spins backward',
    facts: ['Hottest planet', 'Spins east → west', 'Sulfuric acid clouds'],
  },
  {
    name: 'Earth',
    distance: 0.34,
    scale: 0.013,
    speed: 1.0,
    spin: 0.3,
    tilt: 0.41,
    fact: 'Home',
    facts: ['One natural moon', '71% covered in water', 'Only known life'],
  },
  {
    name: 'Mars',
    distance: 0.42,
    scale: 0.011,
    speed: 0.53,
    spin: 0.3,
    tilt: 0.44,
    fact: 'Tallest volcano',
    facts: ['Olympus Mons: 22 km', 'Two tiny moons', 'Rusty iron oxide soil'],
  },
  {
    name: 'Jupiter',
    distance: 0.55,
    scale: 0.028,
    speed: 0.084,
    spin: 0.7,
    tilt: 0.05,
    fact: 'Great Red Spot',
    facts: ['Largest planet', '95+ moons', 'Storm wider than Earth'],
  },
  {
    name: 'Saturn',
    distance: 0.7,
    scale: 0.024,
    speed: 0.034,
    spin: 0.65,
    tilt: 0.47,
    fact: 'Rings of ice',
    facts: ['7 main ring groups', 'Less dense than water', 'Hexagonal pole storm'],
  },
  {
    name: 'Uranus',
    distance: 0.84,
    scale: 0.018,
    speed: 0.012,
    spin: 0.4,
    tilt: 1.71,
    fact: 'Tipped on side',
    facts: ['Rotates on its side', 'Methane gives blue tint', '27 known moons'],
  },
  {
    name: 'Neptune',
    distance: 0.96,
    scale: 0.018,
    speed: 0.006,
    spin: 0.45,
    tilt: 0.49,
    fact: 'Supersonic winds',
    facts: ['Winds up to 2,100 km/h', 'Discovered by math first', 'Dark Spot storms'],
  },
  {
    name: 'Pluto',
    distance: 1.06,
    scale: 0.006,
    speed: 0.004,
    spin: 0.1,
    tilt: 2.1,
    fact: 'Heart of ice',
    facts: ['Dwarf planet', 'Tombaugh Regio heart', 'Five known moons'],
  },
]

export default function OrbitPage() {
  const base = import.meta.env.BASE_URL
  const [t, setT] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    let id: number
    const tick = () => {
      setT(x => x + (selected ? 0.00125 : 0.005))
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [selected])

  const onTap = (name: string) =>
    setSelected(prev => (prev === name ? null : name))

  const selectedBody = selected ? BODIES.find(b => b.name === selected) : null

  return (
    <div className="page">
      <Link to="/" className="back">
        ← Back
      </Link>
      <div className="reality-view">
        <Reality style={{ width: '100%', height: '100%' }}>
          <UnlitMaterial id="matMoon" color="#cfcfcf" />

          <ModelAsset id="mSun" src={`${base}modelasset/sun.usdz`} />
          {BODIES.map(b => (
            <ModelAsset
              key={b.name}
              id={`m${b.name}`}
              src={`${base}modelasset/${b.name.toLowerCase()}.usdz`}
            />
          ))}

          {BODIES.map(b => (
            <AttachmentAsset key={`a${b.name}`} name={`a${b.name}`}>
              <div className="planet-chip">
                <strong>{b.name}</strong>
                <span>{b.fact}</span>
              </div>
            </AttachmentAsset>
          ))}
          <AttachmentAsset name="aSelected">
            {selectedBody ? (
              <div className="planet-chip planet-chip--big">
                <strong>{selectedBody.name}</strong>
                {selectedBody.facts.map(f => (
                  <p key={f}>{f}</p>
                ))}
              </div>
            ) : (
              <div className="planet-chip">…</div>
            )}
          </AttachmentAsset>

          <SceneGraph>
            <ModelEntity
              model="mSun"
              position={{ x: 0, y: 0, z: 0 }}
              rotation={{ x: 0, y: t * 0.05, z: 0 }}
              scale={{ x: SUN_SCALE, y: SUN_SCALE, z: SUN_SCALE }}
            />

            {BODIES.map(b => {
              const a = t * b.speed
              const pos = {
                x: Math.cos(a) * b.distance,
                y: Math.sin(a * 2) * 0.005,
                z: Math.sin(a) * b.distance,
              }
              return (
                <Entity key={b.name} position={pos}>
                  <ModelEntity
                    model={`m${b.name}`}
                    rotation={{ x: 0, y: t * b.spin, z: b.tilt }}
                    scale={{ x: b.scale, y: b.scale, z: b.scale }}
                    onSpatialTap={() => onTap(b.name)}
                  />
                  <AttachmentEntity
                    attachment={selected === b.name ? 'aSelected' : `a${b.name}`}
                    position={[0, b.scale + 0.05, 0]}
                    size={
                      selected === b.name
                        ? { width: 220, height: 160 }
                        : { width: 160, height: 70 }
                    }
                  />
                  {b.name === 'Earth' && (
                    <Entity
                      position={{
                        x: Math.cos(t * 12) * 0.06,
                        y: 0,
                        z: Math.sin(t * 12) * 0.06,
                      }}
                      rotation={{ x: 0, y: t * 0.1, z: 0 }}
                    >
                      <SphereEntity radius={0.012} materials={['matMoon']} />
                    </Entity>
                  )}
                </Entity>
              )
            })}

          </SceneGraph>
        </Reality>
      </div>
    </div>
  )
}

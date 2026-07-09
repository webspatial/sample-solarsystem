import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
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

type Planet = {
  name: string
  distance: number
  scale: number
  spin: number
  color: string
  fact: string
}

type SceneDef = {
  title: string
  blurb: string
  sunX: number
  sunScale: number
  zoom: number
  planets: Planet[]
}

const MERCURY = { name: 'Mercury', scale: 0.008, spin: 0.25, color: '#8C7853', fact: 'Year = 88 days' }
const VENUS = { name: 'Venus', scale: 0.012, spin: -0.1, color: '#FFC649', fact: 'Spins backward' }
const EARTH = { name: 'Earth', scale: 0.013, spin: 0.5, color: '#6B93D6', fact: 'Home' }
const MARS = { name: 'Mars', scale: 0.011, spin: 0.5, color: '#C1440E', fact: 'Rusty red deserts' }
const JUPITER = { name: 'Jupiter', scale: 0.028, spin: 0.9, color: '#D8CA9D', fact: 'Great Red Spot' }
const SATURN = { name: 'Saturn', scale: 0.024, spin: 0.85, color: '#FAD5A5', fact: 'Rings of ice' }
const URANUS = { name: 'Uranus', scale: 0.018, spin: 0.6, color: '#4FD0E3', fact: 'Tipped on its side' }
const NEPTUNE = { name: 'Neptune', scale: 0.018, spin: 0.65, color: '#4B70DD', fact: 'Supersonic winds' }

/* Distances are meters inside the volume; each scene's line-up must stay
   within the volume bounds requested in MultiScenePage (widths 1.2-2.0m).
   zoom multiplies the shared planet scales so each scene fills its volume. */
const SCENES: Record<string, SceneDef> = {
  overview: {
    title: 'Solar System Overview',
    blurb: 'All eight planets in one sweep, from sun-scorched Mercury to distant Neptune.',
    sunX: -0.67,
    sunScale: 0.045,
    zoom: 1.5,
    planets: [
      { ...MERCURY, distance: 0.22 },
      { ...VENUS, distance: 0.36 },
      { ...EARTH, distance: 0.5 },
      { ...MARS, distance: 0.63 },
      { ...JUPITER, distance: 0.87 },
      { ...SATURN, distance: 1.08 },
      { ...URANUS, distance: 1.3 },
      { ...NEPTUNE, distance: 1.5 },
    ],
  },
  inner: {
    title: 'Inner Planets',
    blurb: 'The four rocky worlds huddled close to the Sun.',
    sunX: -0.48,
    sunScale: 0.055,
    zoom: 2,
    planets: [
      { ...MERCURY, distance: 0.3 },
      { ...VENUS, distance: 0.54 },
      { ...EARTH, distance: 0.78 },
      { ...MARS, distance: 1.02 },
    ],
  },
  outer: {
    title: 'Outer Planets',
    blurb: 'The gas and ice giants of the far solar system.',
    sunX: -0.75,
    sunScale: 0.05,
    zoom: 1.6,
    planets: [
      { ...JUPITER, distance: 0.42 },
      { ...SATURN, distance: 0.82 },
      { ...URANUS, distance: 1.22 },
      { ...NEPTUNE, distance: 1.6 },
    ],
  },
  sun: {
    title: 'The Sun',
    blurb: 'Our star up close — 99.8% of the solar system’s mass.',
    sunX: 0,
    sunScale: 0.09,
    zoom: 1,
    planets: [],
  },
}

const FLARE_COUNT = 8

function SpatialScene({ id, def }: { id: string; def: SceneDef }) {
  const base = import.meta.env.BASE_URL
  const [t, setT] = useState(0)

  useEffect(() => {
    let raf: number
    const tick = () => {
      setT(x => x + 0.005)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="reality-full">
      <Reality style={{ width: '100%', height: '100%' }}>
        <UnlitMaterial id="matFlare" color="#FF6B35" />
        <ModelAsset id="mSun" src={`${base}modelasset/sun.usdz`} />
        {def.planets.map(p => (
          <ModelAsset
            key={p.name}
            id={`m${p.name}`}
            src={`${base}modelasset/${p.name.toLowerCase()}.usdz`}
          />
        ))}

        {def.planets.map(p => (
          <AttachmentAsset key={`a${p.name}`} name={`a${p.name}`}>
            <div className="planet-chip">
              <strong>{p.name}</strong>
              <span>{p.fact}</span>
            </div>
          </AttachmentAsset>
        ))}
        {id === 'sun' && (
          <AttachmentAsset name="aSun">
            <div className="planet-chip">
              <strong>The Sun</strong>
              <span>99.8% of the system&rsquo;s mass</span>
            </div>
          </AttachmentAsset>
        )}

        <SceneGraph>
          <ModelEntity
            model="mSun"
            position={{ x: def.sunX, y: 0, z: 0 }}
            rotation={{ x: 0, y: t * 0.05, z: 0 }}
            scale={{ x: def.sunScale, y: def.sunScale, z: def.sunScale }}
          />

          {def.planets.map(p => {
            const s = p.scale * def.zoom
            return (
              <Entity key={p.name} position={{ x: def.sunX + p.distance, y: 0, z: 0 }}>
                <ModelEntity
                  model={`m${p.name}`}
                  rotation={{ x: 0, y: t * p.spin, z: 0 }}
                  scale={{ x: s, y: s, z: s }}
                />
                <AttachmentEntity
                  attachment={`a${p.name}`}
                  position={[0, s * 2 + 0.07, 0]}
                  size={{ width: 160, height: 68 }}
                />
              </Entity>
            )
          })}

          {id === 'sun' && (
            <>
              {/* Flares orbit in the x/y plane: the volume is only 0.1m deep,
                  so an x/z ring would clip out of its bounds. */}
              {Array.from({ length: FLARE_COUNT }).map((_, i) => {
                const a = (i / FLARE_COUNT) * Math.PI * 2 + t * 0.4
                return (
                  <Entity
                    key={i}
                    position={{ x: Math.cos(a) * 0.32, y: Math.sin(a) * 0.32, z: 0 }}
                  >
                    <SphereEntity radius={0.024} materials={['matFlare']} />
                  </Entity>
                )
              })}
              <AttachmentEntity attachment="aSun" position={[0, 0.42, 0]} size={{ width: 210, height: 64 }} />
            </>
          )}
        </SceneGraph>
      </Reality>
    </div>
  )
}

/* 2D preview shown when the route is opened in a regular browser
   instead of inside a WebSpatial volume. */
function ScenePreview({ id, def }: { id: string; def: SceneDef }) {
  const others = Object.keys(SCENES).filter(k => k !== id)
  return (
    <main className="page scene-page">
      <Link to="/multi" className="back">
        ← Back to scenes
      </Link>
      <section className="scene-card">
        <h1>{def.title}</h1>
        <p className="scene-blurb">{def.blurb}</p>
        <div className="scene-strip">
          <div className="planet-figure">
            <span className="planet-dot planet-dot--sun" style={{ width: 72, height: 72 }} />
            <strong>Sun</strong>
          </div>
          {def.planets.map(p => (
            <div key={p.name} className="planet-figure">
              <span
                className="planet-dot"
                style={{
                  width: Math.round(p.scale * 2400),
                  height: Math.round(p.scale * 2400),
                  background: `radial-gradient(circle at 32% 30%, color-mix(in srgb, ${p.color} 55%, white), ${p.color} 62%, color-mix(in srgb, ${p.color} 55%, black))`,
                }}
              />
              <strong>{p.name}</strong>
              <span className="planet-fact">{p.fact}</span>
            </div>
          ))}
        </div>
        <p className="scene-note">
          You&rsquo;re viewing the flat preview. In WebSpatial on Apple Vision Pro this page opens
          as a volumetric 3D scene — launch it from the Multi-scene page.
        </p>
        <nav className="nav">
          {others.map(k => (
            <Link key={k} to={`/scene/${k}`}>
              {SCENES[k].title}
            </Link>
          ))}
        </nav>
      </section>
    </main>
  )
}

export default function SceneRoute() {
  const { id } = useParams()
  const def = id ? SCENES[id] : undefined
  if (!id || !def) {
    return <Navigate to="/" replace />
  }
  const isSpatial = document.documentElement.classList.contains('isSpatial')
  return isSpatial ? <SpatialScene id={id} def={def} /> : <ScenePreview id={id} def={def} />
}

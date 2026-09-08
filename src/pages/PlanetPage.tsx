import { useCallback, useEffect, useRef, useState } from 'react'
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
import { BODIES, findBody, type Body } from '../data/bodies'
import { isSpatial } from '../lib/spatial'
import { useSyncChannel, type SyncMessage } from '../lib/sync'

/* The planet fills most of its 0.8 m volume; Saturn is smaller so the rings fit. */
const DETAIL_SCALE = 0.12
const SATURN_SCALE = 0.07
const BASE_STEP = 0.005

function detailScale(b: Body) {
  return b.name === 'Saturn' ? SATURN_SCALE : DETAIL_SCALE
}

function neighbours(b: Body) {
  const i = BODIES.indexOf(b)
  return {
    prev: BODIES[(i - 1 + BODIES.length) % BODIES.length],
    next: BODIES[(i + 1) % BODIES.length],
  }
}

/**
 * Detail volume for one planet. It follows the orbit scene: same clock,
 * same selection, so the planet here spins in lockstep with the one in the
 * overview. Standalone it runs its own clock until an orbit scene answers.
 */
function SpatialPlanet({ initial }: { initial: Body }) {
  const base = import.meta.env.BASE_URL
  const [body, setBody] = useState(initial)
  const [t, setT] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [playing, setPlaying] = useState(true)
  const tRef = useRef(0)
  const local = useRef({ speed: 1, playing: true, synced: false })

  useEffect(() => {
    local.current.speed = speed
    local.current.playing = playing
  }, [speed, playing])

  const send = useSyncChannel(
    useCallback((msg: SyncMessage) => {
      if (msg.type === 'state') {
        local.current.synced = true
        tRef.current = msg.t
        setT(msg.t)
        setSpeed(msg.speed)
        setPlaying(msg.playing)
        const next = findBody(msg.selected)
        if (next) setBody(next)
      } else if (msg.type === 'select') {
        const next = findBody(msg.name)
        if (next) setBody(next)
      }
    }, []),
  )

  useEffect(() => {
    send({ type: 'hello' })
  }, [send])

  useEffect(() => {
    let id: number
    const tick = () => {
      const l = local.current
      if (!l.synced && l.playing) {
        tRef.current += BASE_STEP * l.speed
        setT(tRef.current)
      }
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [])

  const go = (b: Body) => {
    setBody(b)
    send({ type: 'select', name: b.name })
  }

  const s = detailScale(body)
  const { prev, next } = neighbours(body)

  return (
    <div className="reality-full">
      <Reality style={{ width: '100%', height: '100%' }}>
        <UnlitMaterial id="matMoon" color="#cfcfcf" />
        {BODIES.map(b => (
          <ModelAsset key={b.name} id={`m${b.name}`} src={`${base}modelasset/${b.name.toLowerCase()}.usdz`} />
        ))}

        <AttachmentAsset name="aInfo">
          <div className="planet-chip planet-chip--big planet-chip--panel">
            <strong>{body.name}</strong>
            {body.facts.map(f => (
              <p key={f}>{f}</p>
            ))}
            <div className="panel-row">
              <button type="button" className="chip chip--mini" onClick={() => go(prev)}>
                ← {prev.name}
              </button>
              <button type="button" className="chip chip--mini" onClick={() => go(next)}>
                {next.name} →
              </button>
            </div>
          </div>
        </AttachmentAsset>

        <SceneGraph>
          <Entity key={body.name} position={{ x: 0, y: -0.05, z: 0 }}>
            <ModelEntity
              model={`m${body.name}`}
              rotation={{ x: 0, y: t * body.spin * 2, z: body.tilt }}
              scale={{ x: s, y: s, z: s }}
            />
            {body.name === 'Earth' && (
              <Entity
                position={{ x: Math.cos(t * 12) * 0.32, y: 0.04, z: Math.sin(t * 12) * 0.32 }}
                rotation={{ x: 0, y: t * 0.1, z: 0 }}
              >
                <SphereEntity radius={0.035} materials={['matMoon']} />
              </Entity>
            )}
          </Entity>
          <AttachmentEntity attachment="aInfo" position={[0, s * 2 + 0.06, 0]} size={{ width: 240, height: 190 }} />
        </SceneGraph>
      </Reality>
    </div>
  )
}

function PlanetPreview({ body }: { body: Body }) {
  const { prev, next } = neighbours(body)
  return (
    <main className="page scene-page">
      <Link to="/orbit" className="back">
        ← Back to orbit
      </Link>
      <section className="scene-card">
        <h1>{body.name}</h1>
        <p className="scene-blurb">{body.fact}</p>
        <div className="scene-strip">
          <div className="planet-figure">
            <span
              className="planet-dot"
              style={{
                width: 120,
                height: 120,
                background: `radial-gradient(circle at 32% 30%, color-mix(in srgb, ${body.color} 55%, white), ${body.color} 62%, color-mix(in srgb, ${body.color} 55%, black))`,
              }}
            />
          </div>
          <ul className="planet-facts">
            {body.facts.map(f => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
        <p className="scene-note">
          You&rsquo;re viewing the flat preview. In WebSpatial on Apple Vision Pro this page opens as
          its own volume, spinning in lockstep with the orbit scene.
        </p>
        <nav className="nav">
          <Link to={`/planet/${prev.name.toLowerCase()}`}>← {prev.name}</Link>
          <Link to={`/planet/${next.name.toLowerCase()}`}>{next.name} →</Link>
        </nav>
      </section>
    </main>
  )
}

export default function PlanetPage() {
  const { name } = useParams()
  const body = findBody(name)
  if (!body) return <Navigate to="/orbit" replace />
  return isSpatial() ? <SpatialPlanet key={body.name} initial={body} /> : <PlanetPreview body={body} />
}

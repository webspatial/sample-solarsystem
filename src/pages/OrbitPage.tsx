import { useCallback, useEffect, useRef, useState } from 'react'
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
import { BODIES, SUN_SCALE, findBody } from '../data/bodies'
import { openPlanetVolume } from '../lib/spatial'
import { useSyncChannel, type SyncMessage } from '../lib/sync'

/* One Earth year is 2π in `t`. Dragging the Sun 30 cm scrubs one year. */
const TIME_PER_METRE = (Math.PI * 2) / 0.3
const BASE_STEP = 0.005
const SPEEDS = [0.25, 1, 4]
const ZOOM_MIN = 0.4
const ZOOM_MAX = 3
const PITCH_MAX = 1.2
const SYNC_INTERVAL_MS = 100

type Quat = { x: number; y: number; z: number; w: number }

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

/** Quaternion → intrinsic XYZ Euler angles (radians). */
function quatToEuler(q: Quat) {
  const sinr = 2 * (q.w * q.x + q.y * q.z)
  const cosr = 1 - 2 * (q.x * q.x + q.y * q.y)
  const x = Math.atan2(sinr, cosr)
  const sinp = 2 * (q.w * q.y - q.z * q.x)
  const y = Math.abs(sinp) >= 1 ? (Math.sign(sinp) * Math.PI) / 2 : Math.asin(sinp)
  const siny = 2 * (q.w * q.z + q.x * q.y)
  const cosy = 1 - 2 * (q.y * q.y + q.z * q.z)
  const z = Math.atan2(siny, cosy)
  return { x, y, z }
}

export default function OrbitPage() {
  const base = import.meta.env.BASE_URL
  const [t, setT] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [speed, setSpeed] = useState(1)
  const [playing, setPlaying] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  /* Mutable mirrors read by the animation loop and gesture handlers. */
  const tRef = useRef(0)
  const ctrl = useRef({ speed: 1, playing: true, selected: null as string | null, dragging: false })
  const zoomBase = useRef(1)
  const zoomLive = useRef(1)
  const tiltBase = useRef({ x: 0, y: 0 })
  const tiltLive = useRef({ x: 0, y: 0 })
  const dragT = useRef(0)
  const lastSync = useRef(0)

  useEffect(() => {
    ctrl.current.speed = speed
    ctrl.current.playing = playing
    ctrl.current.selected = selected
  }, [speed, playing, selected])

  const send = useSyncChannel(
    useCallback((msg: SyncMessage) => {
      if (msg.type === 'select') setSelected(msg.name)
      else if (msg.type === 'speed') setSpeed(msg.speed)
      else if (msg.type === 'playing') setPlaying(msg.playing)
      else if (msg.type === 'hello') lastSync.current = 0
    }, []),
  )

  const broadcast = useCallback(() => {
    const c = ctrl.current
    send({ type: 'state', t: tRef.current, selected: c.selected, speed: c.speed, playing: c.playing })
  }, [send])

  useEffect(() => {
    let id: number
    const tick = (now: number) => {
      const c = ctrl.current
      if (c.playing && !c.dragging) {
        tRef.current += BASE_STEP * c.speed
        setT(tRef.current)
      }
      if (now - lastSync.current > SYNC_INTERVAL_MS) {
        lastSync.current = now
        broadcast()
      }
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [broadcast])

  const select = (name: string | null) => {
    setSelected(name)
    send({ type: 'select', name })
  }
  const changeSpeed = (s: number) => {
    setSpeed(s)
    send({ type: 'speed', speed: s })
  }
  const togglePlaying = () => {
    const next = !ctrl.current.playing
    setPlaying(next)
    send({ type: 'playing', playing: next })
  }

  /* Two-handed gestures: pinch scales the whole system, twist tilts the ecliptic.
     magnification / quaternion are cumulative since the gesture started. */
  const gestures = {
    onSpatialMagnify: (e: { magnification: number }) => {
      const z = clamp(zoomBase.current * e.magnification, ZOOM_MIN, ZOOM_MAX)
      zoomLive.current = z
      setZoom(z)
    },
    onSpatialMagnifyEnd: () => {
      zoomBase.current = zoomLive.current
    },
    onSpatialRotate: (e: { quaternion: Quat }) => {
      const d = quatToEuler(e.quaternion)
      const next = {
        x: clamp(tiltBase.current.x + d.x, -PITCH_MAX, PITCH_MAX),
        y: tiltBase.current.y + d.y,
      }
      tiltLive.current = next
      setTilt(next)
    },
    onSpatialRotateEnd: () => {
      tiltBase.current = tiltLive.current
    },
  }

  /* Dragging the Sun scrubs time. */
  const sunDrag = {
    onSpatialDragStart: () => {
      ctrl.current.dragging = true
      dragT.current = tRef.current
    },
    onSpatialDrag: (e: { translationX: number }) => {
      tRef.current = dragT.current + e.translationX * TIME_PER_METRE
      setT(tRef.current)
    },
    onSpatialDragEnd: () => {
      ctrl.current.dragging = false
    },
  }

  const resetView = () => {
    zoomBase.current = zoomLive.current = 1
    tiltBase.current = tiltLive.current = { x: 0, y: 0 }
    setZoom(1)
    setTilt({ x: 0, y: 0 })
  }

  const selectedBody = findBody(selected)
  const years = t / (Math.PI * 2)

  return (
    <div className="page">
      <div className="row orbit-bar">
        <Link to="/" className="back">
          ← Back
        </Link>
        <span className="orbit-hint">Pinch to zoom · twist to tilt · drag the Sun to scrub time</span>
        <button type="button" className="chip" onClick={resetView}>
          Reset view
        </button>
      </div>
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

          {/* HTML control panel that lives inside the 3D scene. */}
          <AttachmentAsset name="aSelected">
            {selectedBody ? (
              <div className="planet-chip planet-chip--big planet-chip--panel">
                <strong>{selectedBody.name}</strong>
                {selectedBody.facts.map(f => (
                  <p key={f}>{f}</p>
                ))}
                <div className="panel-row">
                  {SPEEDS.map(s => (
                    <button
                      key={s}
                      type="button"
                      className="chip chip--mini"
                      data-active={s === speed ? 'true' : undefined}
                      onClick={() => changeSpeed(s)}
                    >
                      {s}×
                    </button>
                  ))}
                  <button type="button" className="chip chip--mini" onClick={togglePlaying}>
                    {playing ? '❚❚' : '▶'}
                  </button>
                </div>
                <div className="panel-row">
                  <button
                    type="button"
                    className="chip chip--mini chip--accent"
                    onClick={() => openPlanetVolume(selectedBody.name)}
                  >
                    Open in window ↗
                  </button>
                  <button type="button" className="chip chip--mini" onClick={() => select(null)}>
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="planet-chip">…</div>
            )}
          </AttachmentAsset>

          <AttachmentAsset name="aHud">
            <div className="planet-chip planet-chip--hud">
              <strong>Year {years.toFixed(1)}</strong>
              <span>
                {speed}× {playing ? '▶' : '❚❚'} · zoom {zoom.toFixed(2)}
              </span>
            </div>
          </AttachmentAsset>

          <SceneGraph>
            {/* Root entity: every gesture transforms the whole system at once. */}
            <Entity rotation={{ x: tilt.x, y: tilt.y, z: 0 }} scale={{ x: zoom, y: zoom, z: zoom }}>
              <ModelEntity
                model="mSun"
                position={{ x: 0, y: 0, z: 0 }}
                rotation={{ x: 0, y: t * 0.05, z: 0 }}
                scale={{ x: SUN_SCALE, y: SUN_SCALE, z: SUN_SCALE }}
                {...gestures}
                {...sunDrag}
              />

              {BODIES.map(b => {
                const a = t * b.speed
                const pos = {
                  x: Math.cos(a) * b.distance,
                  y: Math.sin(a * 2) * 0.005,
                  z: Math.sin(a) * b.distance,
                }
                const isSelected = selected === b.name
                return (
                  <Entity key={b.name} position={pos}>
                    <ModelEntity
                      model={`m${b.name}`}
                      rotation={{ x: 0, y: t * b.spin, z: b.tilt }}
                      scale={{ x: b.scale, y: b.scale, z: b.scale }}
                      onSpatialTap={() => select(isSelected ? null : b.name)}
                      {...gestures}
                    />
                    <AttachmentEntity
                      attachment={isSelected ? 'aSelected' : `a${b.name}`}
                      position={[0, b.scale + 0.05, 0]}
                      size={isSelected ? { width: 240, height: 230 } : { width: 160, height: 70 }}
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
            </Entity>

            {/* HUD stays outside the root so zoom and tilt never move it. */}
            <AttachmentEntity attachment="aHud" position={[0, 0.22, 0]} size={{ width: 200, height: 60 }} />
          </SceneGraph>
        </Reality>
      </div>
    </div>
  )
}

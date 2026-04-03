import { Navigate, useParams } from 'react-router'
import {
  Reality,
  SceneGraph,
  SphereEntity,
  UnlitMaterial,
} from '@webspatial/react-sdk'

type Planet = { name: string; distance: number; size: number; color: string }

const OVERVIEW: Planet[] = [
  { name: 'Mercury', distance: 0.25, size: 0.04, color: 'matMercury' },
  { name: 'Venus', distance: 0.35, size: 0.05, color: 'matVenus' },
  { name: 'Earth', distance: 0.45, size: 0.05, color: 'matEarth' },
  { name: 'Mars', distance: 0.55, size: 0.045, color: 'matMars' },
  { name: 'Jupiter', distance: 0.75, size: 0.1, color: 'matJupiter' },
  { name: 'Saturn', distance: 0.9, size: 0.09, color: 'matSaturn' },
  { name: 'Uranus', distance: 1.05, size: 0.07, color: 'matUranus' },
  { name: 'Neptune', distance: 1.2, size: 0.07, color: 'matNeptune' },
]

const INNER: Planet[] = [
  { name: 'Mercury', distance: 0.25, size: 0.04, color: 'matMercury' },
  { name: 'Venus', distance: 0.35, size: 0.05, color: 'matVenus' },
  { name: 'Earth', distance: 0.45, size: 0.05, color: 'matEarth' },
  { name: 'Mars', distance: 0.55, size: 0.045, color: 'matMars' },
]

const OUTER: Planet[] = [
  { name: 'Jupiter', distance: 0.75, size: 0.1, color: 'matJupiter' },
  { name: 'Saturn', distance: 0.9, size: 0.09, color: 'matSaturn' },
  { name: 'Uranus', distance: 1.05, size: 0.07, color: 'matUranus' },
  { name: 'Neptune', distance: 1.2, size: 0.07, color: 'matNeptune' },
]

function OverviewScene() {
  const sunZ = -0.075
  const offset = -0.7
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Reality style={{ width: '100vw', height: '100vh' }}>
        <UnlitMaterial id="matSun" color="#FDB813" />
        <UnlitMaterial id="matMercury" color="#8C7853" />
        <UnlitMaterial id="matVenus" color="#FFC649" />
        <UnlitMaterial id="matEarth" color="#6B93D6" />
        <UnlitMaterial id="matMars" color="#C1440E" />
        <UnlitMaterial id="matJupiter" color="#D8CA9D" />
        <UnlitMaterial id="matSaturn" color="#FAD5A5" />
        <UnlitMaterial id="matUranus" color="#4FD0E3" />
        <UnlitMaterial id="matNeptune" color="#4B70DD" />
        <SceneGraph>
          <SphereEntity radius={0.18} materials={['matSun']} position={{ x: 0, y: 0, z: sunZ }} />
          {OVERVIEW.map(p => (
            <SphereEntity
              key={p.name}
              radius={p.size}
              materials={[p.color]}
              position={{ x: p.distance + offset, y: 0, z: sunZ }}
            />
          ))}
        </SceneGraph>
      </Reality>
    </div>
  )
}

function InnerScene() {
  const sunZ = -0.06
  const offset = -0.4
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Reality style={{ width: '100vw', height: '100vh' }}>
        <UnlitMaterial id="matSun" color="#FDB813" />
        <UnlitMaterial id="matMercury" color="#8C7853" />
        <UnlitMaterial id="matVenus" color="#FFC649" />
        <UnlitMaterial id="matEarth" color="#6B93D6" />
        <UnlitMaterial id="matMars" color="#C1440E" />
        <SceneGraph>
          <SphereEntity radius={0.18} materials={['matSun']} position={{ x: 0, y: 0, z: sunZ }} />
          {INNER.map(p => (
            <SphereEntity
              key={p.name}
              radius={p.size}
              materials={[p.color]}
              position={{ x: p.distance + offset, y: 0, z: sunZ }}
            />
          ))}
        </SceneGraph>
      </Reality>
    </div>
  )
}

function OuterScene() {
  const sunZ = -0.075
  const offset = -0.8
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Reality style={{ width: '100vw', height: '100vh' }}>
        <UnlitMaterial id="matSun" color="#FDB813" />
        <UnlitMaterial id="matJupiter" color="#D8CA9D" />
        <UnlitMaterial id="matSaturn" color="#FAD5A5" />
        <UnlitMaterial id="matUranus" color="#4FD0E3" />
        <UnlitMaterial id="matNeptune" color="#4B70DD" />
        <SceneGraph>
          <SphereEntity radius={0.18} materials={['matSun']} position={{ x: 0, y: 0, z: sunZ }} />
          {OUTER.map(p => (
            <SphereEntity
              key={p.name}
              radius={p.size}
              materials={[p.color]}
              position={{ x: p.distance + offset, y: 0, z: sunZ }}
            />
          ))}
        </SceneGraph>
      </Reality>
    </div>
  )
}

function SunScene() {
  const ring = Array.from({ length: 8 }).map((_, i) => {
    const angle = (i / 8) * Math.PI * 2
    return {
      x: Math.cos(angle) * 0.35,
      z: Math.sin(angle) * 0.35 - 1,
    }
  })
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Reality style={{ width: '100vw', height: '100vh' }}>
        <UnlitMaterial id="matSun" color="#FDB813" />
        <UnlitMaterial id="matFlare" color="#FF6B35" />
        <SceneGraph>
          <SphereEntity radius={0.18} materials={['matSun']} position={{ x: 0, y: 0, z: -0.05 }} />
          {ring.map((p, i) => (
            <SphereEntity
              key={i}
              radius={0.03}
              materials={['matFlare']}
              position={{ x: p.x, y: 0, z: -0.05 }}
            />
          ))}
        </SceneGraph>
      </Reality>
    </div>
  )
}

const SCENES = {
  overview: OverviewScene,
  inner: InnerScene,
  outer: OuterScene,
  sun: SunScene,
} as const

export default function SceneRoute() {
  const { id } = useParams()
  if (!id || !(id in SCENES)) {
    return <Navigate to="/" replace />
  }
  const Cmp = SCENES[id as keyof typeof SCENES]
  return <Cmp />
}

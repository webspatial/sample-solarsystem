import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Reality, SceneGraph, Entity, SphereEntity, UnlitMaterial } from '@webspatial/react-sdk'

export default function OrbitPage() {
  const [t, setT] = useState(0)

  useEffect(() => {
    let id: number
    const tick = () => {
      setT(x => x + 0.005)
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [])

  const planets = [
    { name: 'Sun', size: 0.12, distance: 0, speed: 0 },
    { name: 'Mercury', size: 0.02, distance: 0.18, speed: 4.15 },
    { name: 'Venus', size: 0.03, distance: 0.26, speed: 1.62 },
    { name: 'Earth', size: 0.03, distance: 0.34, speed: 1.0 },
    { name: 'Mars', size: 0.025, distance: 0.42, speed: 0.53 },
    { name: 'Jupiter', size: 0.07, distance: 0.58, speed: 0.08 },
    { name: 'Saturn', size: 0.06, distance: 0.72, speed: 0.03 },
  ]

  return (
    <div className="page">
      <Link to="/" className="back">
        ← Back
      </Link>
      <div className="reality-view">
        <Reality style={{ width: '100%', height: '100%' }}>
          <UnlitMaterial id="matSun" color="#FDB813" />
          <UnlitMaterial id="matMercury" color="#8C7853" />
          <UnlitMaterial id="matVenus" color="#FFC649" />
          <UnlitMaterial id="matEarth" color="#6B93D6" />
          <UnlitMaterial id="matMars" color="#C1440E" />
          <UnlitMaterial id="matJupiter" color="#D8CA9D" />
          <UnlitMaterial id="matSaturn" color="#FAD5A5" />
          <SceneGraph>
            <Entity position={{ x: 0, y: 0, z: 0 }} scale={{ x: 1, y: 1, z: 1 }}>
              <SphereEntity radius={0.12} materials={['matSun']} />
            </Entity>
            {planets.slice(1).map(planet => {
              const angle = t * planet.speed
              return (
                <Entity
                  key={planet.name}
                  position={{
                    x: Math.cos(angle) * planet.distance,
                    y: Math.sin(angle * 2) * 0.005,
                    z: Math.sin(angle) * planet.distance,
                  }}
                  rotation={{ x: 0, y: t * 30, z: 0 }}
                >
                  <SphereEntity radius={planet.size} materials={[`mat${planet.name}`]} />
                </Entity>
              )
            })}
          </SceneGraph>
        </Reality>
      </div>
    </div>
  )
}

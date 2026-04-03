import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  Reality,
  SceneGraph,
  Entity,
  SphereEntity,
  UnlitMaterial,
} from '@webspatial/react-sdk'

export default function OrbitPage() {
  const [animationTime, setAnimationTime] = useState(0)

  useEffect(() => {
    const animate = () => {
      setAnimationTime(prev => prev + 0.005)
      requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [])

  const planets = [
    { name: 'Sun', size: 0.12, color: '#FDB813', distance: 0, speed: 0 },
    { name: 'Mercury', size: 0.02, color: '#8C7853', distance: 0.18, speed: 4.15 },
    { name: 'Venus', size: 0.03, color: '#FFC649', distance: 0.26, speed: 1.62 },
    { name: 'Earth', size: 0.03, color: '#6B93D6', distance: 0.34, speed: 1.0 },
    { name: 'Mars', size: 0.025, color: '#C1440E', distance: 0.42, speed: 0.53 },
    { name: 'Jupiter', size: 0.07, color: '#D8CA9D', distance: 0.58, speed: 0.08 },
    { name: 'Saturn', size: 0.06, color: '#FAD5A5', distance: 0.72, speed: 0.03 },
  ]

  return (
    <div style={{ padding: '1rem', maxWidth: 900, margin: '0 auto' }}>
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
      <div style={{ height: '400px', width: '100%' }}>
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
              const angle = animationTime * planet.speed
              const x = Math.cos(angle) * planet.distance
              const z = Math.sin(angle) * planet.distance
              const y = Math.sin(angle * 2) * 0.005

              return (
                <Entity key={planet.name} position={{ x, y, z }} rotation={{ x: 0, y: animationTime * 30, z: 0 }}>
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

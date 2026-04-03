import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  Reality,
  SceneGraph,
  SphereEntity,
  UnlitMaterial,
  enableDebugTool,
} from '@webspatial/react-sdk'

enableDebugTool()

function InnerPlanetsScene() {
  console.log('[InnerPlanetsScene] window.name=', window.name)
  const inner = [
    { name: 'Mercury', distance: 0.25, size: 0.04, color: 'matMercury' },
    { name: 'Venus', distance: 0.35, size: 0.05, color: 'matVenus' },
    { name: 'Earth', distance: 0.45, size: 0.05, color: 'matEarth' },
    { name: 'Mars', distance: 0.55, size: 0.045, color: 'matMars' },
  ]

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Reality
        style={{
          width: '100vw',
          height: '100vh',
        }}
      >
        <UnlitMaterial id="matSun" color="#FDB813" />
        <UnlitMaterial id="matMercury" color="#8C7853" />
        <UnlitMaterial id="matVenus" color="#FFC649" />
        <UnlitMaterial id="matEarth" color="#6B93D6" />
        <UnlitMaterial id="matMars" color="#C1440E" />

        <SceneGraph>
          <SphereEntity
            radius={0.18}
            materials={['matSun']}
            position={{ x: 0, y: 0, z: -0.06 }}
          />
          {inner.map(p => (
            <SphereEntity
              key={p.name}
              radius={p.size}
              materials={[p.color]}
              position={{ x: p.distance - 0.4, y: 0, z: -0.06 }}
            />
          ))}
        </SceneGraph>
      </Reality>
    </div>
  )
}

const root = document.getElementById('scene-root')
if (root) {
  ReactDOM.createRoot(root).render(<InnerPlanetsScene />)
}
export default InnerPlanetsScene

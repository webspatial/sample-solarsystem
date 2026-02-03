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

function SunFocusScene() {
  console.log('[SunFocusScene] window.name=', window.name)
  const ring = Array.from({ length: 8 }).map((_, i) => {
    const angle = (i / 8) * Math.PI * 2
    return {
      x: Math.cos(angle) * 0.35,
      z: Math.sin(angle) * 0.35 - 1,
    }
  })

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Reality
        style={{
          width: '100vw',
          height: '100vh',
          '--xr-back': 120,
          '--xr-depth': 150,
        }}
      >
        <UnlitMaterial id="matSun" color="#FDB813" />
        <UnlitMaterial id="matFlare" color="#FF6B35" />

        <SceneGraph>
          <SphereEntity
            radius={0.18}
            materials={['matSun']}
            position={{ x: 0, y: 0, z: -1 }}
          />
          {ring.map((p, i) => (
            <SphereEntity
              key={i}
              radius={0.03}
              materials={['matFlare']}
              position={{ x: p.x, y: 0, z: p.z }}
            />
          ))}
        </SceneGraph>
      </Reality>
    </div>
  )
}

const root = document.getElementById('scene-root')
if (root) {
  ReactDOM.createRoot(root).render(<SunFocusScene />)
}
export default SunFocusScene

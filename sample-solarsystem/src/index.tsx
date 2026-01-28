import React from 'react'

export default function Index() {
  return (
    <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
      <div className="header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem',
          }}
        >
          WebSpatial Solar System
        </h1>
        <p>Interactive 3D Educational Demo</p>
      </div>

      <div
        className="demo-buttons"
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          margin: '2rem 0',
          flexWrap: 'wrap',
        }}
      >
        <a href="/src/dynamic-3d.html" className="btn" style={btnStyle}>
          Dynamic
        </a>
        <a href="/src/static-model.html" className="btn" style={btnStyle}>
          Models
        </a>
        <a href="/src/multi-scene.html" className="btn" style={btnStyle}>
          🌌 Multi-Scene
        </a>
      </div>
    </div>
  )
}

const btnStyle: React.CSSProperties = {
  padding: '1rem 2rem',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  border: 'none',
  borderRadius: 12,
  color: 'white',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  textDecoration: 'none',
  display: 'inline-block',
}

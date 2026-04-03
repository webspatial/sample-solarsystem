import type { CSSProperties } from 'react'
import { Link } from 'react-router'

const btnStyle: CSSProperties = {
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

export default function HomePage() {
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
        <p>Interactive 3D educational demo</p>
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
        <Link to="/orbit" className="btn" style={btnStyle}>
          Dynamic orbit
        </Link>
        <Link to="/models" className="btn" style={btnStyle}>
          USDZ models
        </Link>
        <Link to="/multi" className="btn" style={btnStyle}>
          Multi-scene
        </Link>
      </div>
    </div>
  )
}

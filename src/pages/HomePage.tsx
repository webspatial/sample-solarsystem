import { Link } from 'react-router'

export default function HomePage() {
  return (
    <main className="page">
      <h1>Solar system</h1>
      <p>WebSpatial demos: orbit, USDZ models, multi-window scenes.</p>
      <nav className="nav">
        <Link to="/orbit">Orbit</Link>
        <Link to="/models">Models</Link>
        <Link to="/multi">Multi-scene</Link>
      </nav>
    </main>
  )
}

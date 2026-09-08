import { Link } from 'react-router'

const CARDS = [
  {
    to: '/orbit',
    title: 'Orbit',
    blurb: 'Pinch, twist and drag a living solar system. Tap a planet to open it in its own volume.',
  },
  { to: '/models', title: 'Models', blurb: 'USDZ planets in a static <model> container you can drag around.' },
  { to: '/multi', title: 'Multi-scene', blurb: 'Spawn overview, inner, outer and sun volumes side by side.' },
]

export default function HomePage() {
  return (
    <main className="page">
      <h1>Solar system</h1>
      <p>WebSpatial demos: orbit, USDZ models, multi-window scenes.</p>
      {/* Each card is a spatialized element lifted a different distance off the
          page (--xr-back), so the launcher itself reads as layered glass. */}
      <nav className="launcher">
        {CARDS.map(c => (
          <div key={c.to} enable-xr className="launch-card">
            <Link to={c.to}>
              <strong>{c.title}</strong>
              <span>{c.blurb}</span>
            </Link>
          </div>
        ))}
      </nav>
    </main>
  )
}

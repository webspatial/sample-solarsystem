export type Body = {
  name: string
  /** Orbit radius in metres inside the orbit volume. */
  distance: number
  /** Model scale; the USDZ spheres are ~2 units in radius at scale 1. */
  scale: number
  /** Orbital angular speed relative to Earth (Earth = 1). */
  speed: number
  /** Axial spin rate; negative spins retrograde. */
  spin: number
  /** Axial tilt in radians. */
  tilt: number
  color: string
  fact: string
  facts: string[]
}

export const SUN_SCALE = 0.04

export const BODIES: Body[] = [
  {
    name: 'Mercury',
    distance: 0.18,
    scale: 0.008,
    speed: 4.15,
    spin: 0.04,
    tilt: 0.01,
    color: '#8C7853',
    fact: 'Year = 88 days',
    facts: ['Smallest planet', 'No atmosphere', 'Day = 176 Earth days'],
  },
  {
    name: 'Venus',
    distance: 0.26,
    scale: 0.012,
    speed: 1.62,
    spin: -0.01,
    tilt: 3.1,
    color: '#FFC649',
    fact: 'Spins backward',
    facts: ['Hottest planet', 'Spins east → west', 'Sulfuric acid clouds'],
  },
  {
    name: 'Earth',
    distance: 0.34,
    scale: 0.013,
    speed: 1.0,
    spin: 0.3,
    tilt: 0.41,
    color: '#6B93D6',
    fact: 'Home',
    facts: ['One natural moon', '71% covered in water', 'Only known life'],
  },
  {
    name: 'Mars',
    distance: 0.42,
    scale: 0.011,
    speed: 0.53,
    spin: 0.3,
    tilt: 0.44,
    color: '#C1440E',
    fact: 'Tallest volcano',
    facts: ['Olympus Mons: 22 km', 'Two tiny moons', 'Rusty iron oxide soil'],
  },
  {
    name: 'Jupiter',
    distance: 0.55,
    scale: 0.028,
    speed: 0.084,
    spin: 0.7,
    tilt: 0.05,
    color: '#D8CA9D',
    fact: 'Great Red Spot',
    facts: ['Largest planet', '95+ moons', 'Storm wider than Earth'],
  },
  {
    name: 'Saturn',
    distance: 0.7,
    scale: 0.024,
    speed: 0.034,
    spin: 0.65,
    tilt: 0.47,
    color: '#FAD5A5',
    fact: 'Rings of ice',
    facts: ['7 main ring groups', 'Less dense than water', 'Hexagonal pole storm'],
  },
  {
    name: 'Uranus',
    distance: 0.84,
    scale: 0.018,
    speed: 0.012,
    spin: 0.4,
    tilt: 1.71,
    color: '#4FD0E3',
    fact: 'Tipped on side',
    facts: ['Rotates on its side', 'Methane gives blue tint', '27 known moons'],
  },
  {
    name: 'Neptune',
    distance: 0.96,
    scale: 0.018,
    speed: 0.006,
    spin: 0.45,
    tilt: 0.49,
    color: '#4B70DD',
    fact: 'Supersonic winds',
    facts: ['Winds up to 2,100 km/h', 'Discovered by math first', 'Dark Spot storms'],
  },
  {
    name: 'Pluto',
    distance: 1.06,
    scale: 0.006,
    speed: 0.004,
    spin: 0.1,
    tilt: 2.1,
    color: '#C9B7A5',
    fact: 'Heart of ice',
    facts: ['Dwarf planet', 'Tombaugh Regio heart', 'Five known moons'],
  },
]

export function findBody(name: string | null | undefined): Body | undefined {
  if (!name) return undefined
  const key = name.toLowerCase()
  return BODIES.find(b => b.name.toLowerCase() === key)
}

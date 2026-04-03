import { BrowserRouter, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import MultiScenePage from './pages/MultiScenePage'
import ModelsPage from './pages/ModelsPage'
import OrbitPage from './pages/OrbitPage'
import SceneRoute from './pages/SceneRoute'

const b = import.meta.env.BASE_URL
const basename = b === '/' ? undefined : b.replace(/\/$/, '')

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/orbit" element={<OrbitPage />} />
        <Route path="/models" element={<ModelsPage />} />
        <Route path="/multi" element={<MultiScenePage />} />
        <Route path="/scene/:id" element={<SceneRoute />} />
      </Routes>
    </BrowserRouter>
  )
}

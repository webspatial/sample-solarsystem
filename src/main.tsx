import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Spatial } from '@webspatial/core-sdk'
import { enableDebugTool } from '@webspatial/react-sdk'
import './index.css'
import App from './App'

// Spatial-only CSS: https://webspatial.dev/docs/.../check-if-running-in-webspatial-mode (docs use class `is-spatial`; CSS here uses `isSpatial`).
if (Spatial.prototype.runInSpatialWeb()) {
  document.documentElement.classList.add('isSpatial')
}

enableDebugTool()

const root = createRoot(document.getElementById('root')!)

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)

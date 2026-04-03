import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Spatial } from '@webspatial/core-sdk'
import { enableDebugTool } from '@webspatial/react-sdk'
import './index.css'
import App from './App'

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

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).then(
      registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope)
      },
      err => {
        console.log('ServiceWorker registration failed: ', err)
      },
    )
  })
}

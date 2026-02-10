import '@webspatial/react-sdk'
import '@webspatial/core-sdk'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Index from './index.tsx'

if (typeof navigator !== 'undefined' && navigator.userAgent.indexOf('WebSpatial/') > -1) {
  document.documentElement.classList.add('is-spatial')
}

const root = createRoot(document.getElementById('root')!)

root.render(
  <StrictMode>
    <Index />
  </StrictMode>,
)

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope)
      },
      (err) => {
        console.log('ServiceWorker registration failed: ', err)
      },
    )
  })
}

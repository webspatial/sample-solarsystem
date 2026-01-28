import '@webspatial/react-sdk'
import '@webspatial/core-sdk'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Index from './index.tsx'

if (typeof navigator !== 'undefined' && navigator.userAgent.indexOf('WebSpatial/') > -1) {
  document.documentElement.classList.add('is-spatial')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Index />
  </StrictMode>,
)

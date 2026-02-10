import React, { useEffect, useMemo, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'
import styled from 'styled-components'
import styles from './html-visibility.module.css'
import {
  Reality,
  SceneGraph,
  SphereEntity,
  UnlitMaterial,
  enableDebugTool,
} from '@webspatial/react-sdk'

enableDebugTool()

const Panel = styled.div<{ $visible?: boolean }>`
  width: 240px;
  height: 140px;
  padding: 12px;
  border-radius: 12px;
  border: 2px solid #42a5f5;
  background: rgba(66, 165, 245, 0.2);
  color: #fff;
  visibility: ${(props: { $visible?: boolean }) => (props.$visible ? 'visible' : 'hidden')};
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(4px);
`
const PanelImportant = styled.div<{ $visible?: boolean }>`
  width: 240px;
  height: 140px;
  padding: 12px;
  border-radius: 12px;
  border: 2px solid #42a5f5;
  background: rgba(66, 165, 245, 0.2);
  color: #fff;
  visibility: ${(props: { $visible?: boolean }) => (props.$visible ? 'visible !important' : 'hidden !important')};
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(4px);
`

function HtmlVisibilityTest() {
  const [visible, setVisible] = useState(true)
  const [method, setMethod] = useState<'styled' | 'styledImportant' | 'inline' | 'cssmodule'>('styled')
  const styledRef = useRef<HTMLDivElement | null>(null)
  const inlineRef = useRef<HTMLDivElement | null>(null)
  const moduleRef = useRef<HTMLDivElement | null>(null)
  const computedTextRef = useRef<HTMLDivElement | null>(null)

  const InlinePanelStyle = useMemo<React.CSSProperties>(
    () => ({
      width: 240,
      height: 140,
      padding: 12,
      borderRadius: 12,
      border: '2px solid #42a5f5',
      background: 'rgba(66, 165, 245, 0.2)',
      color: '#fff',
      boxShadow: '0 6px 24px rgba(0, 0, 0, 0.35)',
      backdropFilter: 'blur(4px)',
      visibility: visible ? 'visible' : 'hidden',
    }),
    [visible],
  )

  useEffect(() => {
    let current: HTMLElement | null = null
    if (method === 'styled' || method === 'styledImportant') current = styledRef.current
    else if (method === 'inline') current = inlineRef.current
    else current = moduleRef.current
    const value = current ? getComputedStyle(current).visibility : 'missing'
    console.log(`[HtmlVisibilityTest] toggled: method=${method}, visible=${visible}, computed=${value}`)
    if (computedTextRef.current) {
      computedTextRef.current.innerText = `method=${method} • computed.visibility=${value}`
    }
  }, [visible, method])

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Reality style={{ width: '100vw', height: '100vh' }}>
        <UnlitMaterial id="matSun" color="#FDB813" />
        <SceneGraph>
          <SphereEntity
            radius={0.1}
            materials={['matSun']}
            position={{ x: 0, y: 0, z: -0.08 }}
          />
        </SceneGraph>

        <div style={{ position: 'absolute', top: 24, left: 24, display: 'flex', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              style={{
                padding: '8px 12px',
                background: '#42a5f5',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600,
              }}
              onClick={() => setVisible(v => !v)}
            >
              Toggle visibility ({visible ? 'visible' : 'hidden'})
            </button>
            <div style={{ display: 'flex', gap: 8 }}>
              <label style={{ fontSize: 12, opacity: 0.9, alignSelf: 'center' }}>style method</label>
              <select
                value={method}
                onChange={e => setMethod(e.target.value as typeof method)}
                style={{
                  padding: '8px 12px',
                  background: 'rgba(255,255,255,0.14)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                <option value="styled">styled</option>
                <option value="styledImportant">styled (!important)</option>
                <option value="inline">inline</option>
                <option value="cssmodule">css module</option>
              </select>
            </div>

            <div
              style={{
                fontSize: 12,
                opacity: 0.9,
                padding: '6px 10px',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.24)',
                background: 'rgba(0,0,0,0.35)',
              }}
              ref={computedTextRef}
            />
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            {method === 'styled' && (
              <div>
                <div style={{ marginBottom: 6, fontWeight: 600 }}>Styled Component</div>
                <Panel
                  ref={styledRef}
                  $visible={visible}
                  {...({ 'enable-xr': true } as Record<string, unknown>)}
                  style={{ '--xr-depth': 120, '--xr-back': 140 } as React.CSSProperties}
                >
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>Styled Panel</div>
                  <div style={{ fontSize: 12, opacity: 0.85 }}>
                    visibility={visible ? 'visible' : 'hidden'}
                  </div>
                </Panel>
              </div>
            )}
            {method === 'styledImportant' && (
              <div>
                <div style={{ marginBottom: 6, fontWeight: 600 }}>Styled Component (!important)</div>
                <PanelImportant
                  ref={styledRef}
                  $visible={visible}
                  {...({ 'enable-xr': true } as Record<string, unknown>)}
                  style={{ '--xr-depth': 120, '--xr-back': 140 } as React.CSSProperties}
                >
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>Styled Panel</div>
                  <div style={{ fontSize: 12, opacity: 0.85 }}>
                    visibility={visible ? 'visible' : 'hidden'}
                  </div>
                </PanelImportant>
              </div>
            )}
            {method === 'inline' && (
              <div>
                <div style={{ marginBottom: 6, fontWeight: 600 }}>Inline Style</div>
                <div
                  ref={inlineRef}
                  {...({ 'enable-xr': true } as Record<string, unknown>)}
                  style={{ ...InlinePanelStyle, '--xr-depth': 120, '--xr-back': 140 } as React.CSSProperties}
                >
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>Inline Panel</div>
                  <div style={{ fontSize: 12, opacity: 0.85 }}>
                    visibility={visible ? 'visible' : 'hidden'}
                  </div>
                </div>
              </div>
            )}
            {method === 'cssmodule' && (
              <div>
                <div style={{ marginBottom: 6, fontWeight: 600 }}>CSS Module</div>
                <div
                  ref={moduleRef}
                  {...({ 'enable-xr': true } as Record<string, unknown>)}
                  className={`${styles._panel} ${visible ? styles._visible : styles._hidden}`}
                  style={{ '--xr-depth': 120, '--xr-back': 140 } as React.CSSProperties}
                >
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>Module Panel</div>
                  <div style={{ fontSize: 12, opacity: 0.85 }}>
                    visibility={visible ? 'visible' : 'hidden'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Reality>
    </div>
  )
}

const root = document.getElementById('scene-root')
if (root) {
  ReactDOM.createRoot(root).render(<HtmlVisibilityTest />)
}
export default HtmlVisibilityTest

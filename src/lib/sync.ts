import { useEffect, useRef } from 'react'

/**
 * Cross-window sync between the orbit scene and planet detail volumes.
 * BroadcastChannel works across every window/volume of the same origin,
 * so one clock drives all open scenes.
 */
export type SyncState = {
  t: number
  selected: string | null
  speed: number
  playing: boolean
}

export type SyncMessage =
  | { type: 'hello' }
  | ({ type: 'state' } & SyncState)
  | { type: 'select'; name: string | null }
  | { type: 'speed'; speed: number }
  | { type: 'playing'; playing: boolean }

const CHANNEL = 'solar-system'

function open(): BroadcastChannel | null {
  try {
    return new BroadcastChannel(CHANNEL)
  } catch {
    return null
  }
}

export function useSyncChannel(onMessage: (msg: SyncMessage) => void) {
  const chanRef = useRef<BroadcastChannel | null>(null)
  const handlerRef = useRef(onMessage)

  useEffect(() => {
    handlerRef.current = onMessage
  }, [onMessage])

  useEffect(() => {
    const chan = open()
    if (!chan) return
    chanRef.current = chan
    chan.onmessage = (ev: MessageEvent<SyncMessage>) => handlerRef.current(ev.data)
    return () => {
      chan.close()
      chanRef.current = null
    }
  }, [])

  return (msg: SyncMessage) => chanRef.current?.postMessage(msg)
}

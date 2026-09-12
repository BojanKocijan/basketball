import { useCallback, useEffect, useRef, useState } from 'react'

/** Tracks elapsed seconds since the session was started, with pause/resume/reset. */
export function useSessionClock() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setElapsedSeconds((s) => s + 1)
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running])

  const start = useCallback(() => setRunning(true), [])
  const pause = useCallback(() => setRunning(false), [])
  const reset = useCallback(() => {
    setRunning(false)
    setElapsedSeconds(0)
  }, [])
  const jumpTo = useCallback((seconds: number) => {
    setElapsedSeconds(Math.max(0, seconds))
  }, [])

  return { elapsedSeconds, running, start, pause, reset, jumpTo }
}

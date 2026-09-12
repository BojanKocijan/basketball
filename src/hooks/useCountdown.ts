import { useCallback, useEffect, useRef, useState } from 'react'

/** A standalone countdown timer, e.g. for running a single exercise from the library. */
export function useCountdown(initialSeconds: number) {
  const [remaining, setRemaining] = useState(initialSeconds)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setRemaining((s) => {
        if (s <= 1) {
          setRunning(false)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running])

  const start = useCallback(() => setRunning((r) => (remaining > 0 ? true : r)), [remaining])
  const pause = useCallback(() => setRunning(false), [])
  const reset = useCallback(() => {
    setRunning(false)
    setRemaining(initialSeconds)
  }, [initialSeconds])

  return { remaining, running, start, pause, reset, done: remaining === 0 }
}

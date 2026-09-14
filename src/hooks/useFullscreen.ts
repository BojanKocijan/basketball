import { useCallback } from 'react'

/** Wraps the Fullscreen API — best-effort, since not every browser/context supports it (e.g. iOS Safari). */
export function useFullscreen() {
  const enter = useCallback(() => {
    document.documentElement.requestFullscreen?.().catch(() => {
      // ignore — fullscreen isn't available (unsupported browser, not a user gesture, etc.)
    })
  }, [])

  const exit = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {
        // ignore
      })
    }
  }, [])

  return { enter, exit }
}

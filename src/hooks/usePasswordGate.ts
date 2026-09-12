import { useCallback, useState } from 'react'

const STORAGE_KEY = 'u8-unlocked'

// NOTE: this is a casual deterrent, not real security. GitHub Pages only serves
// static files, so this password ends up readable in the built JS bundle by
// anyone who opens dev tools. Real access control needs a backend (see README).
const APP_PASSWORD = import.meta.env.VITE_APP_PASSWORD ?? ''

function isUnlocked(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function usePasswordGate() {
  const [unlocked, setUnlocked] = useState(isUnlocked)

  const tryUnlock = useCallback((attempt: string) => {
    if (APP_PASSWORD.length > 0 && attempt === APP_PASSWORD) {
      try {
        localStorage.setItem(STORAGE_KEY, 'true')
      } catch {
        // storage unavailable; unlocking still works for this tab
      }
      setUnlocked(true)
      return true
    }
    return false
  }, [])

  return { unlocked, tryUnlock, passwordConfigured: APP_PASSWORD.length > 0 }
}
